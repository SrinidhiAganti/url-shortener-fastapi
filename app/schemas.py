from pydantic import BaseModel, HttpUrl


class URLCreate(BaseModel):
    original_url: HttpUrl


class URLResponse(BaseModel):
    original_url: str
    short_code: str
    short_url: str
    click_count: int


class URLStats(BaseModel):
    original_url: str
    short_code: str
    click_count: int
    created_at: str
