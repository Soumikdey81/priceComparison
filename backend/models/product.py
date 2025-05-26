from pydantic import BaseModel

class Product(BaseModel):
    id: str
    name: str
    price: float
    rating: float
    reviews: int
    imageUrl: str
    url: str
    site: str
    availability: str
