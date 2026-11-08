from fastapi import APIRouter, Depends, HTTPException, Query
from sqlalchemy.orm import Session
from typing import List, Optional

from app.database import get_db
from app.models import Product
from app.schemas import ProductResponse
from app.rag.knowledge_base import rag_service

router = APIRouter(prefix="/api/products", tags=["products"])

@router.get("", response_model=List[ProductResponse])
def get_products(
    category: Optional[str] = None,
    concern: Optional[str] = None,
    search: Optional[str] = None,
    db: Session = Depends(get_db)
):
    query = db.query(Product)

    if category and category.lower() != "all":
        query = query.filter(Product.category.ilike(f"%{category}%"))

    if concern and concern.lower() != "all":
        query = query.filter(Product.intended_concern.ilike(f"%{concern}%"))

    if search:
        s = f"%{search}%"
        query = query.filter(
            (Product.name.ilike(s)) |
            (Product.description.ilike(s)) |
            (Product.key_actives.ilike(s)) |
            (Product.ingredients.ilike(s))
        )

    return query.all()

@router.get("/{product_id}", response_model=ProductResponse)
def get_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")
    return product

@router.get("/{product_id}/explain")
def explain_product(product_id: int, db: Session = Depends(get_db)):
    product = db.query(Product).filter(Product.id == product_id).first()
    if not product:
        raise HTTPException(status_code=404, detail="Product not found")

    # Product Knowledge Agent explanation synthesis
    explanation = {
        "product_id": product.id,
        "product_name": product.name,
        "category": product.category,
        "key_actives": product.key_actives,
        "why_it_works": (
            f"{product.name} targets {product.intended_concern} through active formulation of {product.key_actives}. "
            f"It works synergistically to penetrate into the skin/scalp cellular level without causing surface barrier disruption."
        ),
        "usage_guide": product.usage_instructions,
        "safety_notes": product.warnings,
        "verification_status": product.verification_status,
        "source_url": product.source_url
    }
    return explanation

