// API service cho việc kết nối với Django backend

const API_URL = `http://${window.location.hostname}:8000/api`;

export const fetchCategories = async () => {
  try {
    const response = await fetch(`${API_URL}/categories/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching categories:', error);
    return [];
  }
};

export const fetchProducts = async () => {
  try {
    const response = await fetch(`${API_URL}/products/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products:', error);
    return [];
  }
};

export const fetchProductsByCategory = async (categoryId) => {
  try {
    const response = await fetch(`${API_URL}/products/?category=${categoryId}`);
    
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching products by category:', error);
    return [];
  }
};

export const fetchReviews = async () => {
  try {
    const response = await fetch(`${API_URL}/reviews/`);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};

export const loginUser = async (loginIdentifier, password) => {
  try {
    console.log("Đang gửi yêu cầu đăng nhập:", loginIdentifier);
    
    // Sử dụng endpoint đăng nhập mới
    const response = await fetch(`${API_URL}/customer/login/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        username: loginIdentifier, // Gửi username hoặc email
        password: password 
      }),
      credentials: 'include',
    });
    
    if (!response.ok) {
      console.log("Lỗi đăng nhập, status:", response.status);
      const errorText = await response.text();
      console.log("Response text:", errorText);
      
      let errorMessage = `Lỗi đăng nhập: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || `Lỗi đăng nhập: ${response.status}`;
      } catch (e) {
        console.log("Không thể parse lỗi thành JSON");
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Đăng nhập thành công:", data);
    
    // Lưu token
    if (data.token) {
      localStorage.setItem('userToken', data.token);
    }
    
    // Lưu thông tin người dùng
    localStorage.setItem('user', JSON.stringify({
      user_id: data.user_id,
      username: data.username,
      email: data.email
    }));
    
    return data;
  } catch (error) {
    console.error('Lỗi đăng nhập:', error);
    throw error;
  }
};

export const registerUser = async (userData) => {
  try {
    console.log("Đang gửi yêu cầu đăng ký:", userData);
    
    // Sử dụng endpoint đăng ký mới
    const response = await fetch(`${API_URL}/customer/register/`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });
    
    if (!response.ok) {
      console.log("Lỗi đăng ký, status:", response.status);
      const errorText = await response.text();
      console.log("Response text:", errorText);
      
      let errorMessage = `Lỗi đăng ký: ${response.status}`;
      try {
        const errorData = JSON.parse(errorText);
        errorMessage = errorData.detail || `Lỗi đăng ký: ${response.status}`;
      } catch (e) {
        console.log("Không thể parse lỗi thành JSON");
      }
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    console.log("Đăng ký thành công:", data);
    return data;
  } catch (error) {
    console.error('Lỗi đăng ký:', error);
    throw error;
  }
};

export const checkAuthStatus = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      return { isAuthenticated: false };
    }
    
    // Thử endpoint users/me/
    const response = await fetch(`${API_URL}/users/me/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      },
      credentials: 'include'
    });
    
    if (!response.ok) {
      localStorage.removeItem('userToken');
      localStorage.removeItem('user');
      return { isAuthenticated: false };
    }
    
    const data = await response.json();
    return { isAuthenticated: true, user: data };
  } catch (error) {
    console.error('Lỗi kiểm tra xác thực:', error);
    return { isAuthenticated: false };
  }
};

export const logoutUser = async () => {
  try {
    const token = localStorage.getItem('userToken');
    
    if (token) {
      const response = await fetch(`${API_URL}/logout/`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        credentials: 'include'
      });
      
      if (!response.ok) {
        throw new Error(`Lỗi đăng xuất: ${response.status}`);
      }
    }
    
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    return { success: true };
  } catch (error) {
    console.error('Lỗi đăng xuất:', error);
    localStorage.removeItem('userToken');
    localStorage.removeItem('user');
    throw error;
  }
};

// Lấy thông tin chi tiết người dùng
export const getUserProfile = async () => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    // Sử dụng API endpoint mới
    const response = await fetch(`${API_URL}/customer/profile/`, {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });

    if (!response.ok) {
      // Nếu API trả về lỗi, sử dụng thông tin từ localStorage
      console.warn(`Lỗi API ${response.status}: Sử dụng dữ liệu từ localStorage`);
      const user = JSON.parse(localStorage.getItem('user') || '{}');
      if (user && user.user_id) {
        return {
          ...user,
          phone: user.phone || '',
          address: user.address || ''
        };
      }
      throw new Error(`Lỗi ${response.status}: Không thể lấy thông tin người dùng`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi lấy thông tin người dùng:', error);
    // Thử dùng thông tin từ localStorage khi có lỗi
    const user = JSON.parse(localStorage.getItem('user') || '{}');
    if (user && user.user_id) {
      return {
        ...user,
        phone: user.phone || '',
        address: user.address || ''
      };
    }
    throw error;
  }
};

// Cập nhật thông tin người dùng
export const updateUserProfile = async (userData) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    // Sử dụng endpoint mới
    const response = await fetch(`${API_URL}/customer/profile/update/`, {
      method: 'PUT',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(userData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Lỗi ${response.status}: Không thể cập nhật thông tin`);
      } catch (e) {
        if (e.message.includes('Unexpected token')) {
          throw new Error(`Lỗi ${response.status}: Máy chủ trả về dữ liệu không hợp lệ`);
        }
        throw e;
      }
    }

    const data = await response.json();
    
    // Cập nhật thông tin trong localStorage
    if (data) {
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      const updatedUser = { ...storedUser, ...data };
      localStorage.setItem('user', JSON.stringify(updatedUser));
    }
    
    return data;
  } catch (error) {
    console.error('Lỗi khi cập nhật thông tin người dùng:', error);
    throw error;
  }
};

// Thay đổi mật khẩu
export const changePassword = async (passwordData) => {
  try {
    const token = localStorage.getItem('userToken');
    if (!token) {
      throw new Error('Chưa đăng nhập');
    }

    // Sử dụng API endpoint mới
    const response = await fetch(`${API_URL}/customer/change-password/`, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify(passwordData)
    });

    if (!response.ok) {
      const errorText = await response.text();
      try {
        const errorData = JSON.parse(errorText);
        throw new Error(errorData.detail || `Lỗi ${response.status}: Không thể thay đổi mật khẩu`);
      } catch (e) {
        if (e.message.includes('Unexpected token')) {
          throw new Error(`Lỗi ${response.status}: Máy chủ trả về dữ liệu không hợp lệ`);
        }
        throw e;
      }
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Lỗi khi thay đổi mật khẩu:', error);
    throw error;
  }
}; 