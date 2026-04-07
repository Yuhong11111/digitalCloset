"""
SQLAlchemy models for PostgreSQL tables: User and ClothItem
"""
from sqlalchemy import ARRAY, Column, String, DateTime, Boolean, Text, ForeignKey, Integer
from sqlalchemy.orm import relationship
from sqlalchemy.dialects.postgresql import UUID
from datetime import datetime
import uuid

from app.db.database import Base


class User(Base):
    """User model"""
    __tablename__ = "users"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    username = Column(String(50), unique=True, nullable=False, index=True)
    password = Column(String(255), nullable=False)
    email = Column(String(100), unique=True, nullable=True, index=True)
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

    # Relationships
    items = relationship("ClothItem", back_populates="owner", cascade="all, delete-orphan")
    style_preference = relationship(
        "StylePreference",
        back_populates="user",
        cascade="all, delete-orphan",
        uselist=False,
    )

    def __repr__(self):
        return f"<User {self.username}>"


class ClothItem(Base):
    """Clothing item model"""
    __tablename__ = "cloth_items"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    owner_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, index=True)
    name = Column(String(100), nullable=False)
    category = Column(String(50), nullable=False)  # top, bottom, outerwear, footwear, accessory
    color = Column(String(50), nullable=False)
    size = Column(String(20), nullable=True)
    season = Column(String(50), nullable=False)  # spring, summer, fall, winter, all
    image_url = Column(Text, nullable=True)
    notes = Column(Text, nullable=True)
    favorite = Column(Boolean, default=False)
    created_at = Column(DateTime, default=datetime.utcnow)
    wear_count = Column(Integer, default=0)
    last_worn_at = Column(DateTime, nullable=True)
    material = Column(String(100), nullable=True)
    brand = Column(String(100), nullable=True)
    tags = Column(ARRAY(String), nullable=True)  # Comma-separated tags
    purchase_price = Column(Integer, nullable=True)

    # Relationships
    owner = relationship("User", back_populates="items")

    def __repr__(self):
        return f"<ClothItem {self.name}>"


class StylePreference(Base):
    """Style preference model"""
    __tablename__ = "style_preferences"

    id = Column(UUID(as_uuid=True), primary_key=True, default=uuid.uuid4)
    user_id = Column(UUID(as_uuid=True), ForeignKey("users.id", ondelete="CASCADE"), nullable=False, unique=True, index=True)
    preferred_colors = Column(ARRAY(String), nullable=True)
    preferred_fits = Column(ARRAY(String), nullable=True)
    preferred_occasions = Column(ARRAY(String), nullable=True)
    preferred_climate = Column(ARRAY(String), nullable=True)
    preferred_style_tags = Column(ARRAY(String), nullable=True)

    # Relationships
    user = relationship("User", back_populates="style_preference", uselist=False)

    def __repr__(self):
        return f"<StylePreference for User {self.user_id}>"
