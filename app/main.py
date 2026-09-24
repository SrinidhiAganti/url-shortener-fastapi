from pathlib import Path
import secrets
import string

from fastapi import Depends, FastAPI, HTTPException
from fastapi.responses import FileResponse, RedirectResponse
from fastapi.staticfiles import StaticFiles
from sqlalchemy.orm import Session

from .database import Base, engine, get_db
from .models import URL
from .schemas import URLCreate, URLResponse, URLStats

# Create database tables.
Base.metadata.create_all(bind=engine)

app = FastAPI(
    title="LinkLite URL Shortener API",
    description="A URL shortening service built with Python and FastAPI.",
    version="1.0.0",
)

BASE_DIR = Path(__file__).resolve().parent.parent
FRONTEND_DIR = BASE_DIR / "frontend"

# Serve CSS and JavaScript from /static/...
app.mount(
    "/static",
    StaticFiles(directory=str(FRONTEND_DIR)),
    name="static",
)


def generate_short_code(length: int = 6) -> str:
    characters = string.ascii_letters + string.digits
    return "".join(secrets.choice(characters) for _ in range(length))


@app.get("/", include_in_schema=False)
def frontend():
    return FileResponse(FRONTEND_DIR / "index.html")


@app.get("/health")
def health():
    return {"status": "ok"}


@app.post("/urls", response_model=URLResponse)
def create_url(data: URLCreate, db: Session = Depends(get_db)):
    # Generate a unique short code.
    short_code = generate_short_code()
    while db.query(URL).filter(URL.short_code == short_code).first():
        short_code = generate_short_code()

    new_url = URL(
        original_url=str(data.original_url),
        short_code=short_code,
    )

    db.add(new_url)
    db.commit()
    db.refresh(new_url)

    return {
        "original_url": new_url.original_url,
        "short_code": new_url.short_code,
        "short_url": f"/{short_code}",
        "click_count": new_url.click_count,
    }


@app.get("/urls", response_model=list[URLResponse])
def list_urls(db: Session = Depends(get_db)):
    urls = db.query(URL).order_by(URL.created_at.desc()).all()

    return [
        {
            "original_url": url.original_url,
            "short_code": url.short_code,
            "short_url": f"/{url.short_code}",
            "click_count": url.click_count,
        }
        for url in urls
    ]


@app.get("/urls/{short_code}/stats", response_model=URLStats)
def url_stats(short_code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found",
        )

    return {
        "original_url": url.original_url,
        "short_code": url.short_code,
        "click_count": url.click_count,
        "created_at": url.created_at.isoformat(),
    }


@app.get("/{short_code}", include_in_schema=False)
def redirect_url(short_code: str, db: Session = Depends(get_db)):
    url = db.query(URL).filter(URL.short_code == short_code).first()

    if not url:
        raise HTTPException(
            status_code=404,
            detail="Short URL not found",
        )

    url.click_count += 1
    db.commit()

    return RedirectResponse(url.original_url)
