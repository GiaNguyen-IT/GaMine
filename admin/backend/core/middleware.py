import jwt as pyjwt
from django.conf import settings
from django.http import JsonResponse
from .models import Admin

class JWTAuthMiddleware:
    def __init__(self, get_response):
        self.get_response = get_response

    def __call__(self, request):
        # Tạm thời bỏ qua middleware vì đã dùng custom authentication class
        return self.get_response(request)
        
        # Danh sách các đường dẫn không cần xác thực
        exempt_paths = [
            '/api/login/',
            '/admin/',
            '/api-auth/',
        ]
        
        # Bỏ qua xác thực cho các đường dẫn không cần xác thực
        if any(request.path.startswith(path) for path in exempt_paths):
            return self.get_response(request)
        
        # Kiểm tra token trong header
        auth_header = request.META.get('HTTP_AUTHORIZATION', '')
        
        if not auth_header.startswith('Bearer '):
            return JsonResponse({'error': 'Không có token hoặc token không hợp lệ'}, status=401)
        
        token = auth_header.split(' ')[1]
        
        try:
            # Giải mã token mà không kiểm tra hết hạn
            payload = pyjwt.decode(token, settings.SECRET_KEY, algorithms=['HS256'], options={"verify_exp": False})
            admin_id = payload.get('admin_id')
            
            if not admin_id:
                return JsonResponse({'error': 'Token không hợp lệ'}, status=401)
            
            # Lấy admin từ database
            try:
                admin = Admin.objects.get(admin_id=admin_id)
                if not admin.is_active:
                    return JsonResponse({'error': 'Tài khoản đã bị vô hiệu hóa'}, status=401)
                request.user = admin
            except Admin.DoesNotExist:
                return JsonResponse({'error': 'Người dùng không tồn tại'}, status=401)
        except pyjwt.InvalidTokenError:
            return JsonResponse({'error': 'Token không hợp lệ'}, status=401)
            
        return self.get_response(request) 