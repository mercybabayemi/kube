from fastapi import APIRouter

from app.core.dependencies import DBSession, CurrentUser
from app.schemas.returns import ReturnCreateRequest, ReturnResponse
from app.services import return_service

router = APIRouter()


@router.post("/", response_model=ReturnResponse, status_code=201)
def request_return(data: ReturnCreateRequest, current_user: CurrentUser, db: DBSession):
    return return_service.create_return(db, current_user.id, data.order_id, data.reason, data.description)


@router.get("/", response_model=list[ReturnResponse])
def my_returns(current_user: CurrentUser, db: DBSession):
    return return_service.get_buyer_returns(db, current_user.id)
