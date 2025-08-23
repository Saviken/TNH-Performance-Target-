from django.urls import path
from rest_framework.routers import DefaultRouter
from .views import (
    DimensionViewSet, StrategicObjectiveViewSet, InitiativeViewSet, InitiativeActionViewSet, ApprovalStatusViewSet,
    RejectApprovalRequestViewSet, RequestApprovalViewSet, ApproveApprovalRequestViewSet, CancelApprovalRequestViewSet
)

router = DefaultRouter()

router.register("dimensions", DimensionViewSet, basename="dimension")
router.register("strategicobjectives", StrategicObjectiveViewSet, basename="strategicobjective")
router.register("initiatives", InitiativeViewSet, basename="initiative")
router.register("initiativeactions", InitiativeActionViewSet, basename="initiativeaction")
router.register("approvalstatuses", ApprovalStatusViewSet, basename="approvalstatus")
router.register("requestapprovals", RequestApprovalViewSet, basename="requestapproval")
router.register("approveapprovals", ApproveApprovalRequestViewSet, basename="approveapproval")
router.register("rejectapprovals", RejectApprovalRequestViewSet, basename="rejectapproval")
router.register("cancelapprovals", CancelApprovalRequestViewSet, basename="cancelapproval")


urlpatterns = router.urls

