from django.shortcuts import render
from rest_framework import viewsets, status
from rest_framework.response import Response
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import IsAuthenticated, AllowAny
from django.contrib.auth import authenticate, login
from django.db.models import Sum, Count, F
from django.http import HttpResponse
from django.utils import timezone
from datetime import timedelta
from .models import *
from .serializers import *
from .permissions import IsAdminOrSelf
import jwt as pyjwt
import datetime
from django.conf import settings
from django.views.decorators.csrf import csrf_exempt
from django.utils.decorators import method_decorator
from django.db.models import Q
from django.contrib.auth.hashers import make_password, check_password
from decimal import Decimal
import json

# Authentication views
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def admin_login(request):
    username = request.data.get('username')
    password = request.data.get('password')
    
    print(f"Đang đăng nhập với username: {username}")
    
    if not username or not password:
        print("Thiếu username hoặc password")
        return Response({'error': 'Vui lòng cung cấp tên đăng nhập và mật khẩu'}, status=status.HTTP_400_BAD_REQUEST)
    
    try:
        # Kiểm tra xem username/email có tồn tại không
        try:
            admin = Admin.objects.get(Q(username=username) | Q(email=username))
            print(f"Tìm thấy admin: {admin.username}, ID: {admin.admin_id}")
        except Admin.DoesNotExist:
            print(f"Không tìm thấy admin với username/email: {username}")
            return Response({'error': 'Tên đăng nhập hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Kiểm tra mật khẩu
        if not admin.check_password(password):
            print(f"Mật khẩu không đúng cho admin: {admin.username}")
            return Response({'error': 'Tên đăng nhập hoặc mật khẩu không đúng'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Kiểm tra tài khoản có active không
        if not admin.is_active:
            print(f"Tài khoản admin {admin.username} không active")
            return Response({'error': 'Tài khoản đã bị vô hiệu hóa'}, status=status.HTTP_401_UNAUTHORIZED)
        
        # Xác thực thành công, tạo token
        admin = authenticate(request, username=username, password=password)
        
        if not admin:
            print(f"Xác thực thất bại cho {username} mặc dù đã kiểm tra mật khẩu")
            return Response({'error': 'Đăng nhập thất bại'}, status=status.HTTP_401_UNAUTHORIZED)
        
        print(f"Xác thực thành công cho admin: {admin.username}")
        
        # Tạo JWT token
        payload = {
            'admin_id': admin.admin_id,
            'username': admin.username,
            'email': admin.email,
            'role': admin.role,
            'is_active': admin.is_active,
            'exp': datetime.datetime.utcnow() + datetime.timedelta(days=365)  # Hạn dùng 1 năm
        }
        
        token = pyjwt.encode(payload, settings.SECRET_KEY, algorithm='HS256')
        print(f"Đã tạo token cho admin: {admin.username}")
        
        # Ghi log đăng nhập
        AuditLog.objects.create(
            admin=admin,
            action='Đăng nhập',
            table_name='Admin'
        )
        
        return Response({
            'token': token,
            'admin': {
                'admin_id': admin.admin_id,
                'username': admin.username,
                'email': admin.email,
                'role': admin.role
            }
        })
    except Exception as e:
        print(f"Lỗi không xác định khi đăng nhập: {str(e)}")
        return Response({'error': f'Lỗi đăng nhập: {str(e)}'}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)

# Endpoint để kiểm tra thông tin admin hiện tại
@api_view(['GET'])
@permission_classes([IsAuthenticated])
@csrf_exempt
def current_admin(request):
    admin = request.user
    return Response({
        'admin_id': admin.admin_id,
        'username': admin.username,
        'email': admin.email,
        'role': admin.role,
        'is_active': admin.is_active
    })

# AdminViewSet
@method_decorator(csrf_exempt, name='dispatch')
class AdminViewSet(viewsets.ModelViewSet):
    queryset = Admin.objects.all()
    serializer_class = AdminSerializer
    permission_classes = [AllowAny]
    
    def get_permissions(self):
        # Tạm thời trả về [] để bỏ qua kiểm tra quyền
        return []
    
    def get_queryset(self):
        # Debug output
        print(f"User: {self.request.user}")
        print(f"User authenticated: {self.request.user.is_authenticated if hasattr(self.request.user, 'is_authenticated') else 'Unknown'}")
        
        # Tạm thời cho phép xem tất cả
        return Admin.objects.all()
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return AdminCreateSerializer
        return AdminSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        admin = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo Admin mới',
            table_name='Admin',
            record_id=admin.admin_id
        )
        
        return Response(AdminSerializer(admin).data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Log thông tin debug
        print(f"Cập nhật user ID: {instance.admin_id}")
        print(f"Data nhận được: {request.data}")
        
        # Đảm bảo các trường có thể null
        data = request.data.copy()
        if 'phone' in data and data['phone'] == '':
            data['phone'] = None
        if 'address' in data and data['address'] == '':
            data['address'] = None
            
        try:
            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            admin = serializer.save()
            
            # Ghi log
            AuditLog.objects.create(
                admin_id=request.user.admin_id,
                action='Cập nhật Admin',
                table_name='Admin',
                record_id=admin.admin_id
            )
            
            return Response(AdminSerializer(admin).data)
        except Exception as e:
            # Log lỗi chi tiết
            print(f"Lỗi khi cập nhật admin: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.admin_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa Admin',
            table_name='Admin',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# PermissionsViewSet
@method_decorator(csrf_exempt, name='dispatch')
class PermissionsViewSet(viewsets.ModelViewSet):
    queryset = Permissions.objects.all()
    serializer_class = PermissionsSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        permission = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo quyền mới',
            table_name='Permissions',
            record_id=permission.permission_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        permission = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật quyền',
            table_name='Permissions',
            record_id=permission.permission_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.permission_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa quyền',
            table_name='Permissions',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# AuditLogViewSet
@method_decorator(csrf_exempt, name='dispatch')
class AuditLogViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = AuditLog.objects.all().order_by('-created_at')
    serializer_class = AuditLogSerializer
    permission_classes = [AllowAny]

# Dashboard view
@api_view(['GET'])
@permission_classes([AllowAny])
def dashboard_stats(request):
    try:
        # Số lượng người dùng
        total_users_count = Users.objects.count()
        
        # Số lượng người dùng mới trong 30 ngày qua
        thirty_days_ago = timezone.now() - timedelta(days=30)
        new_users_count = Users.objects.filter(created_at__gte=thirty_days_ago).count()
        
        # Tổng số sản phẩm
        total_products = Products.objects.count()
        
        # Tổng số đơn hàng và doanh thu
        total_orders = Orders.objects.count()
        # Chuyển về 0 nếu không có doanh thu
        revenue_data = Orders.objects.filter(order_status='Completed').aggregate(revenue=Sum('total_amount'))
        total_revenue = revenue_data['revenue'] if revenue_data['revenue'] else 0
        
        # Sản phẩm bán chạy nhất
        top_products = Products.objects.order_by('-sold_quantity')[:5]
        top_products_data = ProductsSerializer(top_products, many=True).data
        
        # Đơn hàng theo trạng thái
        order_status_counts = Orders.objects.values('order_status').annotate(count=Count('order_id'))
        
        # Doanh thu theo tháng trong năm hiện tại
        current_year = timezone.now().year
        monthly_revenue = []
        
        # Dữ liệu theo từng tháng trong năm
        for month in range(1, 13):
            month_revenue = Orders.objects.filter(
                created_at__year=current_year,
                created_at__month=month,
                order_status='Completed'
            ).aggregate(revenue=Sum('total_amount'))
            
            monthly_revenue.append({
                'month': f'{month}/{current_year}',
                'revenue': month_revenue['revenue'] if month_revenue['revenue'] else 0
            })
        
        return Response({
            'total_users': total_users_count,
            'new_users_count': new_users_count,
            'total_products': total_products,
            'total_orders': total_orders,
            'total_revenue': total_revenue,
            'top_products': top_products_data,
            'order_status_counts': order_status_counts,
            'monthly_revenue': monthly_revenue
        })
    except Exception as e:
        print(f"Lỗi khi lấy dữ liệu dashboard: {str(e)}")
        return Response(
            {'error': f'Không thể lấy dữ liệu dashboard: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# UsersViewSet
@method_decorator(csrf_exempt, name='dispatch')
class UsersViewSet(viewsets.ModelViewSet):
    queryset = Users.objects.all()
    serializer_class = UsersSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return UserCreateSerializer
        return UsersSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo người dùng mới',
            table_name='Users',
            record_id=user.user_id
        )
        
        return Response(UsersSerializer(user).data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Log thông tin debug
        print(f"Cập nhật user ID: {instance.user_id}")
        print(f"Data nhận được: {request.data}")
        
        # Đảm bảo các trường có thể null
        data = request.data.copy()
        if 'phone' in data and data['phone'] == '':
            data['phone'] = None
        if 'address' in data and data['address'] == '':
            data['address'] = None
            
        try:
            serializer = self.get_serializer(instance, data=data, partial=partial)
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            
            # Ghi log
            AuditLog.objects.create(
                admin_id=request.user.admin_id,
                action='Cập nhật người dùng',
                table_name='Users',
                record_id=user.user_id
            )
            
            return Response(UsersSerializer(user).data)
        except Exception as e:
            # Log lỗi chi tiết
            print(f"Lỗi khi cập nhật user: {str(e)}")
            return Response({"error": str(e)}, status=status.HTTP_400_BAD_REQUEST)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.user_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa người dùng',
            table_name='Users',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# CategoriesViewSet
@method_decorator(csrf_exempt, name='dispatch')
class CategoriesViewSet(viewsets.ModelViewSet):
    queryset = Categories.objects.all()
    serializer_class = CategoriesSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        # Xử lý hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                CategoryImages.objects.create(
                    category=category,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo danh mục mới',
            table_name='Categories',
            record_id=category.category_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        category = serializer.save()
        
        # Cập nhật hoặc thêm hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            # Xóa hình ảnh cũ và thêm mới
            CategoryImages.objects.filter(category=category).delete()
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                CategoryImages.objects.create(
                    category=category,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật danh mục',
            table_name='Categories',
            record_id=category.category_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.category_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa danh mục',
            table_name='Categories',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# ProductsViewSet
@method_decorator(csrf_exempt, name='dispatch')
class ProductsViewSet(viewsets.ModelViewSet):
    queryset = Products.objects.all().order_by('product_id')
    serializer_class = ProductsSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['create']:
            return ProductCreateSerializer
        return ProductsSerializer
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Xử lý chi tiết sản phẩm nếu có
        if 'detail' in request.data and isinstance(request.data['detail'], dict):
            ProductDetails.objects.create(
                product=product,
                specification=request.data['detail'].get('specification')
            )
        elif 'specification' in request.data:
            ProductDetails.objects.create(
                product=product,
                specification=request.data['specification']
            )
        
        # Xử lý hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                ProductImages.objects.create(
                    product=product,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo sản phẩm mới',
            table_name='Products',
            record_id=product.product_id
        )
        
        return Response(ProductsSerializer(product).data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        product = serializer.save()
        
        # Cập nhật chi tiết sản phẩm nếu có
        if 'detail' in request.data and isinstance(request.data['detail'], dict):
            product_detail, created = ProductDetails.objects.get_or_create(product=product)
            product_detail.specification = request.data['detail'].get('specification')
            product_detail.save()
        elif 'specification' in request.data:
            product_detail, created = ProductDetails.objects.get_or_create(product=product)
            product_detail.specification = request.data['specification']
            product_detail.save()
        
        # Cập nhật hoặc thêm hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            # Có thể xóa hình ảnh cũ và thêm mới hoặc cập nhật từng cái
            ProductImages.objects.filter(product=product).delete()
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                ProductImages.objects.create(
                    product=product,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật sản phẩm',
            table_name='Products',
            record_id=product.product_id
        )
        
        return Response(ProductsSerializer(product).data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.product_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa sản phẩm',
            table_name='Products',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# PromotionsViewSet
@method_decorator(csrf_exempt, name='dispatch')
class PromotionsViewSet(viewsets.ModelViewSet):
    queryset = Promotions.objects.all()
    serializer_class = PromotionsSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        promotion = serializer.save()
        
        # Gắn khuyến mãi vào sản phẩm cụ thể nếu có
        if 'product_ids' in request.data and isinstance(request.data['product_ids'], list):
            for product_id in request.data['product_ids']:
                try:
                    product = Products.objects.get(product_id=product_id)
                    ProductPromotions.objects.create(
                        product=product,
                        category=None,
                        promotion=promotion
                    )
                except Products.DoesNotExist:
                    pass
        
        # Gắn khuyến mãi vào danh mục sản phẩm nếu có
        if 'category_ids' in request.data and isinstance(request.data['category_ids'], list):
            for category_id in request.data['category_ids']:
                try:
                    category = Categories.objects.get(category_id=category_id)
                    ProductPromotions.objects.create(
                        product=None,
                        category=category,
                        promotion=promotion
                    )
                except Categories.DoesNotExist:
                    pass
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo khuyến mãi mới',
            table_name='Promotions',
            record_id=promotion.promotion_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        promotion = serializer.save()
        
        # Xóa tất cả các liên kết khuyến mãi cũ
        ProductPromotions.objects.filter(promotion=promotion).delete()
        
        # Cập nhật khuyến mãi cho sản phẩm cụ thể nếu có
        if 'product_ids' in request.data and isinstance(request.data['product_ids'], list):
            for product_id in request.data['product_ids']:
                try:
                    product = Products.objects.get(product_id=product_id)
                    ProductPromotions.objects.create(
                        product=product,
                        category=None,
                        promotion=promotion
                    )
                except Products.DoesNotExist:
                    pass
        
        # Cập nhật khuyến mãi cho danh mục sản phẩm nếu có
        if 'category_ids' in request.data and isinstance(request.data['category_ids'], list):
            for category_id in request.data['category_ids']:
                try:
                    category = Categories.objects.get(category_id=category_id)
                    ProductPromotions.objects.create(
                        product=None,
                        category=category,
                        promotion=promotion
                    )
                except Categories.DoesNotExist:
                    pass
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật khuyến mãi',
            table_name='Promotions',
            record_id=promotion.promotion_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.promotion_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa khuyến mãi',
            table_name='Promotions',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# OrdersViewSet
@method_decorator(csrf_exempt, name='dispatch')
class OrdersViewSet(viewsets.ModelViewSet):
    queryset = Orders.objects.all().order_by('-order_id')
    serializer_class = OrdersSerializer
    permission_classes = [AllowAny]
    
    def get_serializer_class(self):
        if self.action in ['create', 'update', 'partial_update']:
            return OrderCreateSerializer
        return OrdersSerializer
    
    def create(self, request, *args, **kwargs):
        # Nếu có chi tiết đơn hàng, hãy áp dụng giá khuyến mãi nếu không chỉ định giá rõ ràng
        if 'details' in request.data and isinstance(request.data['details'], list):
            for detail in request.data['details']:
                # Nếu không có giá hoặc giá là 0, sử dụng giá khuyến mãi
                if 'price' not in detail or not detail['price']:
                    try:
                        product = Products.objects.get(pk=detail['product'])
                        # Sử dụng str() thay vì float() để giữ nguyên độ chính xác
                        detail['price'] = str(product.get_discounted_price())
                    except Products.DoesNotExist:
                        pass
                        
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo đơn hàng mới',
            table_name='Orders',
            record_id=order.order_id
        )
        
        return Response(OrdersSerializer(order).data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        # Nếu có chi tiết đơn hàng, hãy áp dụng giá khuyến mãi nếu không chỉ định giá rõ ràng
        if 'details' in request.data and isinstance(request.data['details'], list):
            for detail in request.data['details']:
                # Nếu không có giá hoặc giá là 0, sử dụng giá khuyến mãi
                if 'price' not in detail or not detail['price']:
                    try:
                        product = Products.objects.get(pk=detail['product'])
                        # Sử dụng str() thay vì float() để giữ nguyên độ chính xác
                        detail['price'] = str(product.get_discounted_price())
                    except Products.DoesNotExist:
                        pass
                        
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        
        # Lưu trạng thái trước khi cập nhật để kiểm tra nếu đổi trạng thái
        previous_status = instance.order_status
        
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        order = serializer.save()
        
        # Nếu trạng thái thay đổi thành "Completed" và trạng thái trước đó không phải là "Completed"
        if 'order_status' in request.data and request.data['order_status'] == 'Completed' and previous_status != 'Completed':
            # Cập nhật kho cho từng sản phẩm trong đơn hàng
            for detail in order.details.all():
                try:
                    # Giảm số lượng trong kho và tăng số lượng đã bán
                    product = detail.product
                    quantity = detail.quantity
                    
                    # Kiểm tra xem có đủ hàng trong kho không
                    if product.stock_quantity < quantity:
                        # Vẫn cập nhật với số lượng có sẵn
                        available_quantity = product.stock_quantity
                        product.sold_quantity += available_quantity
                        product.stock_quantity = 0
                    else:
                        product.stock_quantity -= quantity
                        product.sold_quantity += quantity
                    
                    product.save()
                    
                    # Ghi log
                    AuditLog.objects.create(
                        admin_id=request.user.admin_id,
                        action=f'Cập nhật kho hàng cho sản phẩm {product.name} (-{quantity})',
                        table_name='Products',
                        record_id=product.product_id
                    )
                except Exception as e:
                    # Ghi lại lỗi nhưng không dừng quá trình xử lý
                    print(f"Lỗi khi cập nhật kho hàng: {str(e)}")
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật đơn hàng',
            table_name='Orders',
            record_id=order.order_id
        )
        
        return Response(OrdersSerializer(order).data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.order_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa đơn hàng',
            table_name='Orders',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# BlogViewSet
@method_decorator(csrf_exempt, name='dispatch')
class BlogViewSet(viewsets.ModelViewSet):
    queryset = Blog.objects.all().order_by('-blog_id')
    serializer_class = BlogSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save()
        
        # Xử lý hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                BlogImages.objects.create(
                    blog=blog,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo bài viết mới',
            table_name='Blog',
            record_id=blog.blog_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        blog = serializer.save()
        
        # Cập nhật hình ảnh nếu có
        if 'images' in request.data and isinstance(request.data['images'], list):
            # Xóa hình ảnh cũ và thêm mới
            BlogImages.objects.filter(blog=blog).delete()
            for image_data in request.data['images']:
                is_primary = image_data.get('is_primary', False)
                BlogImages.objects.create(
                    blog=blog,
                    image_url=image_data['image_url'],
                    is_primary=is_primary
                )
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật bài viết',
            table_name='Blog',
            record_id=blog.blog_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.blog_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa bài viết',
            table_name='Blog',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# FaqViewSet
@method_decorator(csrf_exempt, name='dispatch')
class FaqViewSet(viewsets.ModelViewSet):
    queryset = Faq.objects.all()
    serializer_class = FaqSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        faq = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo FAQ mới',
            table_name='Faq',
            record_id=faq.faq_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        faq = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật FAQ',
            table_name='Faq',
            record_id=faq.faq_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.faq_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa FAQ',
            table_name='Faq',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# ContactViewSet
@method_decorator(csrf_exempt, name='dispatch')
class ContactViewSet(viewsets.ReadOnlyModelViewSet):
    queryset = Contact.objects.all()
    serializer_class = ContactSerializer
    permission_classes = [AllowAny]
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.contact_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa liên hệ',
            table_name='Contact',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# CareersViewSet
@method_decorator(csrf_exempt, name='dispatch')
class CareersViewSet(viewsets.ModelViewSet):
    queryset = Careers.objects.all()
    serializer_class = CareersSerializer
    permission_classes = [AllowAny]
    
    def create(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        career = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Tạo tuyển dụng mới',
            table_name='Careers',
            record_id=career.job_id
        )
        
        return Response(serializer.data, status=status.HTTP_201_CREATED)
    
    def update(self, request, *args, **kwargs):
        partial = kwargs.pop('partial', False)
        instance = self.get_object()
        serializer = self.get_serializer(instance, data=request.data, partial=partial)
        serializer.is_valid(raise_exception=True)
        career = serializer.save()
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Cập nhật tuyển dụng',
            table_name='Careers',
            record_id=career.job_id
        )
        
        return Response(serializer.data)
    
    def destroy(self, request, *args, **kwargs):
        instance = self.get_object()
        instance_id = instance.job_id
        self.perform_destroy(instance)
        
        # Ghi log
        AuditLog.objects.create(
            admin_id=request.user.admin_id,
            action='Xóa tuyển dụng',
            table_name='Careers',
            record_id=instance_id
        )
        
        return Response(status=status.HTTP_204_NO_CONTENT)

# TermsAndConditionsViewSet
@method_decorator(csrf_exempt, name='dispatch')
class TermsAndConditionsViewSet(viewsets.ModelViewSet):
    queryset = TermsAndConditions.objects.all()
    serializer_class = TermsAndConditionsSerializer
    permission_classes = [AllowAny]

# PrivacyPolicyViewSet
@method_decorator(csrf_exempt, name='dispatch')
class PrivacyPolicyViewSet(viewsets.ModelViewSet):
    queryset = PrivacyPolicy.objects.all()
    serializer_class = PrivacyPolicySerializer
    permission_classes = [AllowAny]

# Endpoint để lấy khuyến mãi áp dụng cho một sản phẩm cụ thể
@api_view(['GET'])
@permission_classes([AllowAny])
def product_promotions(request, product_id):
    try:
        product = Products.objects.get(product_id=product_id)
        
        # Lấy các khuyến mãi áp dụng trực tiếp cho sản phẩm
        direct_promotions = ProductPromotions.objects.filter(product=product)
        
        # Lấy các khuyến mãi áp dụng cho danh mục của sản phẩm
        category_promotions = ProductPromotions.objects.filter(category=product.category)
        
        # Kết hợp kết quả và loại bỏ trùng lặp
        all_promotions = []
        
        for promo in direct_promotions:
            all_promotions.append(promo.promotion)
            
        for promo in category_promotions:
            if promo.promotion not in all_promotions:
                all_promotions.append(promo.promotion)
        
        serializer = PromotionsSerializer(all_promotions, many=True)
        return Response(serializer.data)
    except Products.DoesNotExist:
        return Response({"error": "Sản phẩm không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

# Endpoint để lấy danh sách các khuyến mãi áp dụng cho một danh mục
@api_view(['GET'])
@permission_classes([AllowAny])
def category_promotions(request, category_id):
    try:
        category = Categories.objects.get(category_id=category_id)
        promotions = [pp.promotion for pp in ProductPromotions.objects.filter(category=category)]
        serializer = PromotionsSerializer(promotions, many=True)
        return Response(serializer.data)
    except Categories.DoesNotExist:
        return Response({"error": "Danh mục không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

# Endpoint để lấy giá sau khuyến mãi của sản phẩm
@api_view(['GET'])
@permission_classes([IsAuthenticated])
def product_price(request, product_id):
    try:
        product = Products.objects.get(product_id=product_id)
        regular_price = product.price
        discounted_price = product.get_discounted_price()
        
        # Kiểm tra nếu có giảm giá
        has_discount = regular_price != discounted_price
        
        # Tính phần trăm giảm giá
        if has_discount:
            discount_percent = round(((regular_price - discounted_price) / regular_price * Decimal('100')), 2)
        else:
            discount_percent = 0
        
        return Response({
            'product_id': product.product_id,
            'name': product.name,
            'regular_price': regular_price,
            'discounted_price': discounted_price,
            'has_discount': has_discount,
            'discount_percent': discount_percent
        })
    except Products.DoesNotExist:
        return Response({"error": "Sản phẩm không tồn tại"}, status=status.HTTP_404_NOT_FOUND)

# API đăng nhập cho người dùng thông thường
@api_view(['POST'])
@permission_classes([AllowAny])
def user_login(request):
    try:
        username = request.data.get('username')
        password = request.data.get('password')
        
        print(f"Đang đăng nhập với username: {username}")
        
        if not username or not password:
            return Response(
                {'detail': 'Vui lòng nhập tên đăng nhập và mật khẩu'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Tìm người dùng theo username hoặc email
        user = Users.objects.filter(
            Q(username=username) | Q(email=username)
        ).first()
        
        if not user:
            print(f"Không tìm thấy tài khoản với username/email: {username}")
            return Response(
                {'detail': 'Tài khoản không tồn tại'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Kiểm tra mật khẩu
        if not check_password(password, user.password):
            print(f"Mật khẩu không chính xác cho user: {user.username}")
            return Response(
                {'detail': 'Mật khẩu không chính xác'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Tạo token đơn giản dễ parse
        token = f"user_{user.user_id}_{abs(hash(user.username+str(user.user_id)))}"
        print(f"Đã tạo token: {token}")
        
        # Trả về thông tin người dùng và token đơn giản
        user_data = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'token': token,
        }
        
        print(f"Đăng nhập thành công: {user.username}, ID: {user.user_id}")
        return Response(user_data, status=status.HTTP_200_OK)
    
    except Exception as e:
        print(f"Lỗi đăng nhập: {str(e)}")
        return Response(
            {'detail': f'Lỗi: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# API đăng ký cho người dùng thông thường
@api_view(['POST'])
@permission_classes([AllowAny])
def user_register(request):
    try:
        data = request.data
        
        # Kiểm tra các trường bắt buộc
        if not data.get('username') or not data.get('email') or not data.get('password'):
            return Response(
                {'detail': 'Vui lòng điền đầy đủ thông tin bắt buộc'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Kiểm tra username đã tồn tại chưa
        if Users.objects.filter(username=data.get('username')).exists():
            return Response(
                {'detail': 'Tên đăng nhập đã được sử dụng'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Kiểm tra email đã tồn tại chưa
        if Users.objects.filter(email=data.get('email')).exists():
            return Response(
                {'detail': 'Email đã được sử dụng'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Mã hóa mật khẩu
        hashed_password = make_password(data.get('password'))
        
        # Tạo người dùng mới
        user = Users.objects.create(
            username=data.get('username'),
            email=data.get('email'),
            password=hashed_password,
            phone=data.get('phone', ''),
            address=data.get('address', '')
        )
        
        return Response({
            'user_id': user.user_id,
            'username': user.username,
            'message': 'Đăng ký thành công'
        }, status=status.HTTP_201_CREATED)
    
    except Exception as e:
        return Response(
            {'detail': f'Lỗi: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# API để cập nhật thông tin người dùng
@api_view(['PUT'])
@permission_classes([AllowAny])
def update_user_profile(request):
    try:
        # Lấy token từ header
        auth_header = request.headers.get('Authorization', '')
        print(f"Đã nhận token header: {auth_header}")
        
        if not auth_header.startswith('Bearer '):
            return Response(
                {'detail': 'Không tìm thấy Bearer token trong header'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = auth_header.split(' ')[1]
        print(f"Đã nhận token: {token}")
        
        # Parse token để lấy user_id
        user_id = None
        
        # Nếu token có định dạng như "user_{user_id}_{hash}"
        if token.startswith('user_'):
            parts = token.split('_')
            if len(parts) >= 2:
                try:
                    user_id = int(parts[1])
                    print(f"Đã trích xuất user_id={user_id} từ token")
                except ValueError:
                    print("Không thể parse user_id từ token")
            else:
                print("Token không đúng định dạng user_id_hash")
        
        if not user_id:
            print("Không thể xác định user_id từ token")
            return Response(
                {'detail': 'Token không hợp lệ'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Tìm người dùng theo ID
        try:
            user = Users.objects.get(user_id=user_id)
            print(f"Đã tìm thấy user: {user.username}, ID: {user.user_id}")
        except Users.DoesNotExist:
            print(f"Không tìm thấy người dùng với ID: {user_id}")
            return Response(
                {'detail': 'Người dùng không tồn tại'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Cập nhật thông tin người dùng
        data = request.data
        print(f"Dữ liệu cập nhật: {data}")
        
        # Không cho phép thay đổi email
        if 'email' in data:
            del data['email']
            
        # Cập nhật các trường dữ liệu
        if 'username' in data and data['username'] != user.username:
            # Kiểm tra username đã tồn tại chưa
            if Users.objects.filter(username=data['username']).exclude(user_id=user_id).exists():
                return Response(
                    {'detail': 'Tên đăng nhập đã được sử dụng'},
                    status=status.HTTP_400_BAD_REQUEST
                )
            user.username = data['username']
            print(f"Đã cập nhật username thành: {user.username}")
            
        if 'phone' in data:
            user.phone = data['phone']
            print(f"Đã cập nhật phone thành: {user.phone}")
            
        if 'address' in data:
            user.address = data['address']
            print(f"Đã cập nhật address thành: {user.address}")
            
        # Lưu thay đổi vào database
        user.save()
        print("Đã lưu thay đổi vào database")
        
        # Trả về thông tin đã cập nhật
        response_data = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone or '',
            'address': user.address or ''
        }
        print(f"Trả về thông tin người dùng đã cập nhật: {response_data}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Lỗi khi xử lý update_user_profile: {str(e)}")
        return Response(
            {'detail': f'Lỗi: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# API để lấy thông tin chi tiết người dùng
@api_view(['GET'])
@permission_classes([AllowAny])
def user_profile(request):
    try:
        # Lấy token từ header
        auth_header = request.headers.get('Authorization', '')
        print(f"Đã nhận token header: {auth_header}")
        
        if not auth_header.startswith('Bearer '):
            return Response(
                {'detail': 'Không tìm thấy Bearer token trong header'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = auth_header.split(' ')[1]
        print(f"Đã nhận token: {token}")
        
        # Parse token để lấy user_id
        user_id = None
        
        # Nếu token có định dạng như "user_{user_id}_{hash}"
        if token.startswith('user_'):
            parts = token.split('_')
            if len(parts) >= 2:
                try:
                    user_id = int(parts[1])
                    print(f"Đã trích xuất user_id={user_id} từ token")
                except ValueError:
                    print("Không thể parse user_id từ token")
            else:
                print("Token không đúng định dạng user_id_hash")
        
        if not user_id:
            print("Không thể xác định user_id từ token")
            return Response(
                {'detail': 'Token không hợp lệ'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Tìm người dùng theo ID
        try:
            user = Users.objects.get(user_id=user_id)
            print(f"Đã tìm thấy user: {user.username}, ID: {user.user_id}")
        except Users.DoesNotExist:
            print(f"Không tìm thấy người dùng với ID: {user_id}")
            return Response(
                {'detail': 'Người dùng không tồn tại'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Trả về thông tin người dùng
        response_data = {
            'user_id': user.user_id,
            'username': user.username,
            'email': user.email,
            'phone': user.phone or '',
            'address': user.address or ''
        }
        print(f"Trả về thông tin người dùng: {response_data}")
        return Response(response_data, status=status.HTTP_200_OK)
        
    except Exception as e:
        print(f"Lỗi khi xử lý user_profile: {str(e)}")
        return Response(
            {'detail': f'Lỗi: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# API để thay đổi mật khẩu người dùng
@api_view(['POST'])
@permission_classes([AllowAny])
def user_change_password(request):
    try:
        # Lấy token từ header
        auth_header = request.headers.get('Authorization', '')
        if not auth_header.startswith('Bearer '):
            return Response(
                {'detail': 'Không tìm thấy Bearer token trong header'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        token = auth_header.split(' ')[1]
        # Parse token để lấy user_id
        user_id = None
        
        # Nếu token có định dạng như "user_{user_id}_{hash}"
        if token.startswith('user_'):
            parts = token.split('_')
            if len(parts) >= 2:
                try:
                    user_id = int(parts[1])
                except ValueError:
                    pass
        
        if not user_id:
            return Response(
                {'detail': 'Token không hợp lệ'},
                status=status.HTTP_401_UNAUTHORIZED
            )
        
        # Tìm người dùng theo ID
        try:
            user = Users.objects.get(user_id=user_id)
        except Users.DoesNotExist:
            return Response(
                {'detail': 'Người dùng không tồn tại'},
                status=status.HTTP_404_NOT_FOUND
            )
        
        # Kiểm tra dữ liệu đầu vào
        current_password = request.data.get('current_password')
        new_password = request.data.get('new_password')
        
        if not current_password or not new_password:
            return Response(
                {'detail': 'Vui lòng cung cấp mật khẩu hiện tại và mật khẩu mới'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Kiểm tra mật khẩu hiện tại
        if not check_password(current_password, user.password):
            return Response(
                {'detail': 'Mật khẩu hiện tại không chính xác'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Đảm bảo mật khẩu mới đủ mạnh
        if len(new_password) < 8:
            return Response(
                {'detail': 'Mật khẩu mới phải có ít nhất 8 ký tự'},
                status=status.HTTP_400_BAD_REQUEST
            )
        
        # Cập nhật mật khẩu mới
        user.password = make_password(new_password)
        user.save()
        
        return Response({
            'detail': 'Mật khẩu đã được thay đổi thành công'
        }, status=status.HTTP_200_OK)
        
    except Exception as e:
        return Response(
            {'detail': f'Lỗi: {str(e)}'},
            status=status.HTTP_500_INTERNAL_SERVER_ERROR
        )

# Endpoint để cập nhật số lượng tồn kho và số lượng đã bán
@api_view(['POST'])
@permission_classes([AllowAny])
@csrf_exempt
def update_product_inventory(request, product_id):
    try:
        product = Products.objects.get(product_id=product_id)
        
        # Lấy số lượng từ request
        quantity = request.data.get('quantity', 0)
        quantity = int(quantity)
        
        # Nếu quantity < 0, giảm stock_quantity và tăng sold_quantity
        # Điều này xảy ra khi một đơn hàng được hoàn thành
        if quantity < 0:
            abs_quantity = abs(quantity)
            
            # Kiểm tra xem có đủ hàng trong kho không
            if product.stock_quantity < abs_quantity:
                return Response({
                    "error": f"Không đủ hàng trong kho. Hiện chỉ có {product.stock_quantity} sản phẩm."
                }, status=status.HTTP_400_BAD_REQUEST)
            
            # Cập nhật số lượng
            product.stock_quantity -= abs_quantity
            product.sold_quantity += abs_quantity
        else:
            # Nếu quantity > 0, tăng stock_quantity
            # Điều này xảy ra khi nhập thêm hàng vào kho
            product.stock_quantity += quantity
        
        # Lưu thay đổi
        product.save()
        
        # Ghi log
        try:
            AuditLog.objects.create(
                admin_id=request.user.admin_id if hasattr(request.user, 'admin_id') else None,
                action=f"Cập nhật kho hàng sản phẩm {product.name} ({quantity})",
                table_name='Products',
                record_id=product.product_id
            )
        except:
            # Bỏ qua lỗi nếu không thể ghi log
            pass
        
        return Response({
            "success": True,
            "product_id": product.product_id,
            "name": product.name,
            "stock_quantity": product.stock_quantity,
            "sold_quantity": product.sold_quantity,
            "message": f"Đã cập nhật số lượng tồn kho thành {product.stock_quantity} và số lượng đã bán thành {product.sold_quantity}"
        })
    except Products.DoesNotExist:
        return Response({"error": "Sản phẩm không tồn tại"}, status=status.HTTP_404_NOT_FOUND)
    except Exception as e:
        return Response({"error": str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR) 