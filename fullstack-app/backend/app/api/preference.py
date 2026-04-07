import uuid

from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy import text
from sqlalchemy.orm import Session

from app.api.deps import get_current_user
from app.db.database import get_db
from app.schemas.preference import PreferenceRequest, PreferenceResponse


router = APIRouter(prefix="/preferences", tags=["preferences"])

def get_user_preferences(user_id: uuid.UUID, db: Session) -> PreferenceRequest:
    query = text(
        """
        SELECT preferred_colors, preferred_fits, preferred_occasions, preferred_climate, preferred_style_tags
        FROM style_preferences
        WHERE user_id = :user_id
        """
    )
    result = db.execute(query, {"user_id": user_id}).fetchone()
    if result:
        row = result._mapping
        return PreferenceRequest(
            preferred_colors=row["preferred_colors"],
            preferred_fits=row["preferred_fits"],
            preferred_occasions=row["preferred_occasions"],
            preferred_climate=row["preferred_climate"],
            preferred_style_tags=row["preferred_style_tags"],
        )
    return PreferenceRequest()  # Return empty preferences if not found


@router.post("/", response_model=PreferenceResponse)
async def save_preferences(
    preferences: PreferenceRequest,
    current_user=Depends(get_current_user),
    db: Session = Depends(get_db),
):
    user_id = current_user.get("userId")
    if not user_id:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    try:
        user_uuid = uuid.UUID(user_id)
    except ValueError:
        raise HTTPException(status_code=status.HTTP_401_UNAUTHORIZED, detail="Invalid token")

    query = text(
        """
        INSERT INTO style_preferences (
            id,
            user_id,
            preferred_colors,
            preferred_fits,
            preferred_occasions,
            preferred_climate,
            preferred_style_tags
        )
        VALUES (
            :id,
            :user_id,
            :preferred_colors,
            :preferred_fits,
            :preferred_occasions,
            :preferred_climate,
            :preferred_style_tags
        )
        ON CONFLICT (user_id) DO UPDATE SET
            preferred_colors = EXCLUDED.preferred_colors,
            preferred_fits = EXCLUDED.preferred_fits,
            preferred_occasions = EXCLUDED.preferred_occasions,
            preferred_climate = EXCLUDED.preferred_climate,
            preferred_style_tags = EXCLUDED.preferred_style_tags
        """
    )

    try:
        db.execute(
            query,
            {
                "id": uuid.uuid4(),
                "user_id": user_uuid,
                "preferred_colors": preferences.preferred_colors,
                "preferred_fits": preferences.preferred_fits,
                "preferred_occasions": preferences.preferred_occasions,
                "preferred_climate": preferences.preferred_climate,
                "preferred_style_tags": preferences.preferred_style_tags,
            },
        )
        db.commit()
    except Exception as exc:
        db.rollback()
        raise HTTPException(status_code=500, detail=f"Failed to save preferences: {str(exc)}")

    return {
        "message": "Preferences saved successfully",
        "preferences": preferences,
    }
