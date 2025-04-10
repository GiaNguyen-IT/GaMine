from django.urls import path, include
from rest_framework.routers import DefaultRouter
from . import views
from django.views.decorators.csrf import csrf_exempt
from rest_framework.viewsets import ViewSetMixin

# Đăng ký router với csrf_exempt
router = DefaultRouter()
# Đặt csrf_exempt cho tất cả các viewsets
router.register(r'admins', views.AdminViewSet)
router.register(r'permissions', views.PermissionsViewSet)
router.register(r'audit-logs', views.AuditLogViewSet)
router.register(r'users', views.UsersViewSet)
router.register(r'categories', views.CategoriesViewSet)
router.register(r'products', views.ProductsViewSet)
router.register(r'promotions', views.PromotionsViewSet)
router.register(r'orders', views.OrdersViewSet)
router.register(r'blogs', views.BlogViewSet)
router.register(r'faqs', views.FaqViewSet)
router.register(r'contacts', views.ContactViewSet)
router.register(r'careers', views.CareersViewSet)
router.register(r'terms', views.TermsAndConditionsViewSet)
router.register(r'privacy', views.PrivacyPolicyViewSet)

urlpatterns = [
    path('', include(router.urls)),
    path('login/', csrf_exempt(views.admin_login), name='admin_login'),
    path('dashboard/', csrf_exempt(views.dashboard_stats), name='dashboard_stats'),
    path('admins/me/', csrf_exempt(views.current_admin), name='current_admin'),
    path('products/<int:product_id>/promotions/', csrf_exempt(views.product_promotions), name='product_promotions'),
    path('products/<int:product_id>/price/', csrf_exempt(views.product_price), name='product_price'),
    path('products/<int:product_id>/update-inventory/', csrf_exempt(views.update_product_inventory), name='update_product_inventory'),
    path('categories/<int:category_id>/promotions/', csrf_exempt(views.category_promotions), name='category_promotions'),
    
    # API đăng nhập/đăng ký người dùng
    path('customer/login/', views.user_login, name='user-login'),
    path('customer/register/', views.user_register, name='user-register'),
    path('customer/profile/update/', views.update_user_profile, name='update-user-profile'),
    path('customer/profile/', views.user_profile, name='user-profile'),
    path('customer/change-password/', views.user_change_password, name='user-change-password'),
] 