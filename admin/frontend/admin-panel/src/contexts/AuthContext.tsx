import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { login as apiLogin, checkAuth } from '../services/api';
import { Admin, LoginRequest } from '../types';
import { useSnackbar } from 'notistack';

// Định nghĩa kiểu dữ liệu cho context
interface AuthContextType {
    isAuthenticated: boolean;
    admin: Admin | null;
    login: (credentials: LoginRequest) => Promise<void>;
    logout: () => void;
    loading: boolean;
}

// Tạo context
const AuthContext = createContext<AuthContextType>({
    isAuthenticated: false,
    admin: null,
    login: async () => {},
    logout: () => {},
    loading: true
});

// Hook để sử dụng context
export const useAuth = () => useContext(AuthContext);

// Provider component
export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
    const [admin, setAdmin] = useState<Admin | null>(null);
    const [loading, setLoading] = useState(true);
    const navigate = useNavigate();
    const { enqueueSnackbar } = useSnackbar();

    // Kiểm tra xem đã đăng nhập chưa
    useEffect(() => {
        const checkAuthentication = async () => {
            const token = localStorage.getItem('token');
            const adminData = localStorage.getItem('admin');
            
            if (token && adminData) {
                try {
                    setAdmin(JSON.parse(adminData));
                    // Chỉ kiểm tra token một cách nhẹ nhàng, không chuyển hướng nếu có lỗi
                    checkAuth().catch(err => {
                        console.warn('Lỗi kiểm tra xác thực:', err);
                    });
                } catch (error) {
                    console.error('Lỗi xác thực:', error);
                    // Chỉ xóa dữ liệu nếu có lỗi phân tích JSON
                    localStorage.removeItem('token');
                    localStorage.removeItem('admin');
                    setAdmin(null);
                }
            }
            
            setLoading(false);
        };
        
        checkAuthentication();
    }, []);

    // Hàm đăng nhập
    const login = async (credentials: LoginRequest) => {
        try {
            setLoading(true);
            const response = await apiLogin(credentials);
            const { token, admin } = response.data;
            
            localStorage.setItem('token', token);
            localStorage.setItem('admin', JSON.stringify(admin));
            
            setAdmin(admin);
            navigate('/dashboard');
            
            enqueueSnackbar('Đăng nhập thành công!', { 
                variant: 'success' 
            });
        } catch (error) {
            console.error('Lỗi đăng nhập:', error);
            enqueueSnackbar('Đăng nhập thất bại. Vui lòng kiểm tra tên đăng nhập và mật khẩu.', { 
                variant: 'error' 
            });
            throw error;
        } finally {
            setLoading(false);
        }
    };

    // Hàm đăng xuất
    const logout = () => {
        localStorage.removeItem('token');
        localStorage.removeItem('admin');
        setAdmin(null);
        navigate('/login');
        enqueueSnackbar('Đăng xuất thành công!', { 
            variant: 'info' 
        });
    };

    return (
        <AuthContext.Provider value={{
            isAuthenticated: !!admin,
            admin,
            login,
            logout,
            loading
        }}>
            {children}
        </AuthContext.Provider>
    );
}; 