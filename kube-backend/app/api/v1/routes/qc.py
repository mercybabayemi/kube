import uuid

from fastapi import APIRouter, Depends

from app.core.dependencies import DBSession, CurrentUser, require_role
from app.models.enums import UserRole
from app.schemas.qc import QCInspectionResponse, QCUpdateRequest
from app.services import qc_service

router = APIRouter()

QCOnly = Depends(require_role(UserRole.QC_OFFICER))


@router.get("/assignments", response_model=list[QCInspectionResponse], dependencies=[QCOnly])
def my_assignments(current_user: CurrentUser, db: DBSession):
    return qc_service.get_qc_assignments(db, current_user.id)


@router.get("/pending", response_model=list[QCInspectionResponse], dependencies=[QCOnly])
def pending_inspections(db: DBSession):
    return qc_service.get_pending_inspections(db)


@router.patch("/{inspection_id}/assign", response_model=QCInspectionResponse, dependencies=[QCOnly])
def assign_to_me(inspection_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return qc_service.assign_inspection(db, inspection_id, current_user.id)


@router.patch("/{inspection_id}/start", response_model=QCInspectionResponse, dependencies=[QCOnly])
def start_inspection(inspection_id: uuid.UUID, current_user: CurrentUser, db: DBSession):
    return qc_service.start_inspection(db, inspection_id, current_user.id)


@router.patch("/{inspection_id}/pass", response_model=QCInspectionResponse, dependencies=[QCOnly])
def pass_inspection(inspection_id: uuid.UUID, data: QCUpdateRequest, db: DBSession):
    return qc_service.pass_inspection(db, inspection_id, data.notes)


@router.patch("/{inspection_id}/fail", response_model=QCInspectionResponse, dependencies=[QCOnly])
def fail_inspection(inspection_id: uuid.UUID, data: QCUpdateRequest, db: DBSession):
    if not data.notes:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Notes required when failing an inspection")
    return qc_service.fail_inspection(db, inspection_id, data.notes, data.repair_details)


@router.patch("/{inspection_id}/repair", response_model=QCInspectionResponse, dependencies=[QCOnly])
def log_repair(inspection_id: uuid.UUID, data: QCUpdateRequest, db: DBSession):
    if not data.repair_details:
        from fastapi import HTTPException
        raise HTTPException(status_code=400, detail="Repair details required")
    return qc_service.log_repair(db, inspection_id, data.repair_details)


@router.patch("/{inspection_id}/repaired", response_model=QCInspectionResponse, dependencies=[QCOnly])
def mark_repaired(inspection_id: uuid.UUID, db: DBSession):
    return qc_service.mark_repaired(db, inspection_id)


@router.patch("/{inspection_id}/ready", response_model=QCInspectionResponse, dependencies=[QCOnly])
def mark_ready(inspection_id: uuid.UUID, db: DBSession):
    return qc_service.mark_ready_to_ship(db, inspection_id)
