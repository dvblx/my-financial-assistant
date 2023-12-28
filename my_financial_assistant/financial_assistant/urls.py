from django.urls import path, re_path
from rest_framework.routers import SimpleRouter

from .views import PersonalDataViewSet, BankAccountViewSet, FinancialGoalViewSet, \
    CashInvoiceViewSet, RegularSpendingViewSet, OperationsView, MainPageView

urlpatterns = [
    path('', MainPageView.as_view()),
    re_path(r'/operation/{0,1}$', OperationsView.as_view()),
]

router = SimpleRouter()
router.register(r'/personal', PersonalDataViewSet)
router.register(r'/bank-account', BankAccountViewSet)
router.register(r'/financial-goal', FinancialGoalViewSet)
router.register(r'/cash-invoice', CashInvoiceViewSet)
router.register(r'/regular-spending', RegularSpendingViewSet)

urlpatterns += router.urls
