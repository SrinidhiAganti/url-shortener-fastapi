# LinkLite - URL Shortener

A full-stack URL shortening application built with **Python, FastAPI, SQLAlchemy, SQLite, HTML, CSS and JavaScript**.

The application provides a REST API and a responsive web interface for creating short URLs and viewing click statistics.

## Features

- Create unique short URLs
- Redirect short URLs to original URLs
- Track click counts
- View shortened URL history
- View URL statistics
- URL validation with Pydantic
- SQLAlchemy database integration
- FastAPI Swagger/OpenAPI documentation
- Responsive frontend
- Automated API tests
- Clean separation between backend and frontend

## Tech Stack

### Backend
- Python
- FastAPI
- SQLAlchemy
- Pydantic
- SQLite

### Frontend
- HTML5
- CSS3
- JavaScript
- Fetch API

### Testing
- Pytest
- FastAPI TestClient

## Project Structure

```text
url-shortener/
├── app/
│   ├── __init__.py
│   ├── database.py
│   ├── main.py
│   ├── models.py
│   └── schemas.py
├── frontend/
│   ├── index.html
│   ├── script.js
│   └── style.css
├── tests/
│   └── test_urls.py
├── .gitignore
├── README.md
└── requirements.txt
```

## Run Locally

### 1. Clone the repository

```bash
git clone https://github.com/YOUR_USERNAME/url-shortener.git
cd url-shortener
```

### 2. Create a virtual environment

Windows:

```powershell
python -m venv venv
venv\Scriptsctivate
```

macOS/Linux:

```bash
python3 -m venv venv
source venv/bin/activate
```

### 3. Install dependencies

```bash
pip install -r requirements.txt
```

### 4. Start the application

```bash
python -m uvicorn app.main:app --reload
```

### 5. Open the application

Frontend:

```text
http://127.0.0.1:8000
```

API documentation:

```text
http://127.0.0.1:8000/docs
```

Health check:

```text
http://127.0.0.1:8000/health
```

## API Endpoints

| Method | Endpoint | Description |
|---|---|---|
| GET | `/` | Web frontend |
| GET | `/health` | API health check |
| POST | `/urls` | Create a short URL |
| GET | `/urls` | List shortened URLs |
| GET | `/urls/{short_code}/stats` | View click statistics |
| GET | `/{short_code}` | Redirect to original URL |

## Example API Request

```http
POST /urls
Content-Type: application/json
```

```json
{
  "original_url": "https://www.example.com"
}
```

Example response:

```json
{
  "original_url": "https://www.example.com",
  "short_code": "aB72xK",
  "short_url": "/aB72xK",
  "click_count": 0
}
```

## Run Tests

```bash
pytest
```

## Future Improvements

- PostgreSQL support
- User registration and login
- JWT authentication
- URL expiration
- Custom short codes
- Rate limiting
- Redis caching
- Docker
- CI/CD with GitHub Actions
- Cloud deployment
- Advanced analytics

## Resume Description

**URL Shortener | Python, FastAPI, SQLAlchemy, SQLite, JavaScript**

- Developed a RESTful URL-shortening service using Python and FastAPI with unique short-code generation and HTTP redirection.
- Designed a SQLAlchemy-based persistence layer with URL validation, click tracking, statistics, and URL history APIs.
- Built a responsive JavaScript frontend consuming REST APIs and documented endpoints through FastAPI Swagger/OpenAPI.

> Only claim features that you have actually implemented and tested.

## License

This project is intended for educational and portfolio use.


## Important: Existing SQLite Data

The application stores local data in `urls.db`.

If you already have shortened URLs in an older copy of the project, **copy your existing `urls.db` into the project root** before starting the new version. The application will use the existing records.

`urls.db` is ignored by Git on purpose. Do not commit personal/local database data to GitHub.

## Troubleshooting

If the page looks like plain HTML without styling:

1. Make sure `frontend/style.css` and `frontend/script.js` exist.
2. Restart the server:
   ```powershell
   Ctrl+C
   python -m uvicorn app.main:app --reload
   ```
3. Open:
   `http://127.0.0.1:8000/static/style.css`
4. If CSS text appears, static-file serving is working.
5. Hard-refresh the main page with `Ctrl+F5`.

If `uvicorn` is not recognized, use:
```powershell
python -m uvicorn app.main:app --reload
```


## Author

**Srinidhi Aganti**

Computer Science and Engineering Student

## Copyright

Copyright © 2026 Srinidhi Aganti. All rights reserved.

This project is provided for educational and portfolio purposes. The author retains copyright to the original source code and project design. Third-party libraries remain subject to their respective licenses.
