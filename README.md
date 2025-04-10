# Hướng dẫn chạy server cho phép truy cập từ mạng LAN

## Backend Django (Admin)

1. Đã cấu hình `ALLOWED_HOSTS = ['*', '0.0.0.0', '127.0.0.1', 'localhost']` trong file `settings.py`
2. Để chạy server cho phép truy cập từ mạng LAN, sử dụng lệnh:

```bash
cd d:\hoc\chuyen de 1\project\admin\backend
python manage.py runserver 0.0.0.0:8000
```

3. Sau khi chạy lệnh trên, backend sẽ có thể truy cập từ các máy khác trong mạng LAN thông qua địa chỉ IP của máy chủ: `http://<địa-chỉ-IP-máy-chủ>:8000`

## Frontend React (Admin Panel)

1. Để chạy frontend cho phép truy cập từ mạng LAN, sử dụng lệnh:

```bash
cd d:\hoc\chuyen de 1\project\admin\frontend\admin-panel
set HOST=0.0.0.0
set PORT=3000
npm start
```

2. Sau khi chạy lệnh trên, frontend sẽ có thể truy cập từ các máy khác trong mạng LAN thông qua địa chỉ IP của máy chủ: `http://<địa-chỉ-IP-máy-chủ>:3000`

## Frontend React (Gamine-React)

1. Để chạy frontend cho phép truy cập từ mạng LAN, sử dụng lệnh:

```bash
cd d:\hoc\chuyen de 1\project\gamine-react
set HOST=0.0.0.0
set PORT=3001
npm start
```

2. Sau khi chạy lệnh trên, frontend sẽ có thể truy cập từ các máy khác trong mạng LAN thông qua địa chỉ IP của máy chủ: `http://<địa-chỉ-IP-máy-chủ>:3001`

## Lưu ý

- Để biết địa chỉ IP của máy chủ, sử dụng lệnh `ipconfig` trong Command Prompt hoặc PowerShell
- Đảm bảo tường lửa của máy chủ cho phép kết nối đến các cổng 8000 và 3000
- Nếu chạy nhiều frontend cùng lúc, cần đổi cổng để tránh xung đột (ví dụ: PORT=3001 npm start)