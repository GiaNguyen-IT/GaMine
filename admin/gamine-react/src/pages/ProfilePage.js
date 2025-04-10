import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { getUserProfile, updateUserProfile, changePassword } from '../services/api';
import './ProfilePage.css';

function ProfilePage() {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('profile');
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState(null);
  const [error, setError] = useState(null);

  // Form data states
  const [profileForm, setProfileForm] = useState({
    username: '',
    email: '',
    phone: '',
    address: ''
  });

  const [passwordForm, setPasswordForm] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });

  // Load user data from localStorage or API
  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('userToken');
      if (!token) {
        navigate('/login-register');
        return;
      }

      try {
        setLoading(true);
        // Lấy thông tin từ localStorage trước
        const storedUserData = JSON.parse(localStorage.getItem('user') || '{}');
        setUserData(storedUserData);
        setProfileForm({
          username: storedUserData.username || '',
          email: storedUserData.email || '',
          phone: storedUserData.phone || '',
          address: storedUserData.address || ''
        });

        // Thử lấy thông tin chi tiết từ API
        const userProfile = await getUserProfile();
        setUserData(userProfile);
        setProfileForm({
          username: userProfile.username || '',
          email: userProfile.email || '',
          phone: userProfile.phone || '',
          address: userProfile.address || ''
        });
      } catch (error) {
        console.error('Lỗi khi lấy thông tin người dùng:', error);
        setError('Không thể lấy thông tin người dùng. Vui lòng thử lại sau.');
      } finally {
        setLoading(false);
      }
    };

    checkAuth();
  }, [navigate]);

  const handleProfileChange = (e) => {
    const { name, value } = e.target;
    setProfileForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handlePasswordChange = (e) => {
    const { name, value } = e.target;
    setPasswordForm(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleProfileSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    try {
      const updatedUser = await updateUserProfile(profileForm);
      setUserData(updatedUser);
      setMessage('Thông tin tài khoản đã được cập nhật thành công!');
      
      // Cập nhật thông tin trong localStorage
      const storedUser = JSON.parse(localStorage.getItem('user') || '{}');
      localStorage.setItem('user', JSON.stringify({
        ...storedUser,
        ...updatedUser
      }));
    } catch (error) {
      console.error('Lỗi khi cập nhật thông tin:', error);
      setError(error.message || 'Có lỗi xảy ra khi cập nhật thông tin. Vui lòng thử lại.');
    }
  };

  const handlePasswordSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    setError(null);

    // Validate password match
    if (passwordForm.newPassword !== passwordForm.confirmPassword) {
      setError('Mật khẩu mới và xác nhận mật khẩu không khớp.');
      return;
    }

    // Validate password strength
    const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
    if (!passwordRegex.test(passwordForm.newPassword)) {
      setError('Mật khẩu mới phải có ít nhất 8 ký tự, bao gồm chữ hoa, chữ số và ký tự đặc biệt.');
      return;
    }

    try {
      await changePassword({
        current_password: passwordForm.currentPassword,
        new_password: passwordForm.newPassword
      });
      
      setMessage('Mật khẩu đã được cập nhật thành công!');
      setPasswordForm({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
      });
    } catch (error) {
      console.error('Lỗi khi đổi mật khẩu:', error);
      setError(error.message || 'Có lỗi xảy ra khi đổi mật khẩu. Vui lòng thử lại.');
    }
  };

  if (loading) {
    return (
      <div className="profile-container loading">
        <div className="loading-spinner"></div>
        <p>Đang tải thông tin tài khoản...</p>
      </div>
    );
  }

  return (
    <div className="profile-container">
      <div className="profile-header">
        <h1>Thông Tin Tài Khoản</h1>
        <div className="user-avatar">
          <i className="fas fa-user-circle"></i>
          <span className="username">{userData?.username || 'Người dùng'}</span>
        </div>
      </div>

      {/* Tabs */}
      <div className="profile-tabs">
        <button 
          className={`tab-btn ${activeTab === 'profile' ? 'active' : ''}`}
          onClick={() => setActiveTab('profile')}
        >
          <i className="fas fa-user"></i> Thông tin cá nhân
        </button>
        <button 
          className={`tab-btn ${activeTab === 'security' ? 'active' : ''}`}
          onClick={() => setActiveTab('security')}
        >
          <i className="fas fa-lock"></i> Bảo mật
        </button>
      </div>

      {/* Notification */}
      {message && <div className="success-message">{message}</div>}
      {error && <div className="error-message">{error}</div>}

      {/* Tab Content */}
      <div className="tab-content">
        {activeTab === 'profile' && (
          <form onSubmit={handleProfileSubmit} className="profile-form">
            <div className="form-group">
              <label htmlFor="username">Tên đăng nhập</label>
              <input
                type="text"
                id="username"
                name="username"
                value={profileForm.username}
                onChange={handleProfileChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email</label>
              <input
                type="email"
                id="email"
                name="email"
                value={profileForm.email}
                onChange={handleProfileChange}
                required
                disabled
              />
              <small>Email không thể thay đổi</small>
            </div>
            
            <div className="form-group">
              <label htmlFor="phone">Số điện thoại</label>
              <input
                type="tel"
                id="phone"
                name="phone"
                value={profileForm.phone}
                onChange={handleProfileChange}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="address">Địa chỉ</label>
              <textarea
                id="address"
                name="address"
                value={profileForm.address}
                onChange={handleProfileChange}
                rows="3"
              ></textarea>
            </div>
            
            <button type="submit" className="save-btn">
              <i className="fas fa-save"></i> Lưu thay đổi
            </button>
          </form>
        )}

        {activeTab === 'security' && (
          <form onSubmit={handlePasswordSubmit} className="password-form">
            <div className="form-group">
              <label htmlFor="currentPassword">Mật khẩu hiện tại</label>
              <input
                type="password"
                id="currentPassword"
                name="currentPassword"
                value={passwordForm.currentPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="newPassword">Mật khẩu mới</label>
              <input
                type="password"
                id="newPassword"
                name="newPassword"
                value={passwordForm.newPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
              <input
                type="password"
                id="confirmPassword"
                name="confirmPassword"
                value={passwordForm.confirmPassword}
                onChange={handlePasswordChange}
                required
              />
            </div>
            
            <div className="password-requirements">
              <p>Mật khẩu phải đáp ứng các yêu cầu sau:</p>
              <ul>
                <li>Ít nhất 8 ký tự</li>
                <li>Ít nhất 1 chữ hoa</li>
                <li>Ít nhất 1 chữ số</li>
                <li>Ít nhất 1 ký tự đặc biệt</li>
              </ul>
            </div>
            
            <button type="submit" className="save-btn">
              <i className="fas fa-key"></i> Đổi mật khẩu
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

export default ProfilePage; 