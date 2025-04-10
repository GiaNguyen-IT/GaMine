import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import './LoginRegister.css';
import { loginUser, registerUser } from '../services/api';

function LoginRegister() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [successMessage, setSuccessMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: '',
    phone: '',
    address: '',
    loginIdentifier: ''
  });

  const handleInputChange = (e) => {
    const { id, value } = e.target;
    setFormData({
      ...formData,
      [id]: value
    });
    // Clear any error messages when user starts typing
    setErrorMessage('');
  };

  const toggleForm = () => {
    // Clear error and success messages
    setErrorMessage('');
    setSuccessMessage('');
    
    // When switching to login after registration, keep the username in the login field
    if (!isLogin) {
      // Switching to login form
      if (formData.username) {
        setFormData(prev => ({
          ...prev,
          loginIdentifier: formData.username // Use username as login identifier
        }));
      }
    }
    
    setIsLogin(!isLogin);
  };

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const validateForm = () => {
    if (isLogin) {
      if (!formData.loginIdentifier) return 'Username or Email is required';
      if (!formData.password) return 'Password is required';
    } else {
      if (!formData.username) return 'Username is required';
      if (!formData.email) return 'Email is required';
      if (!formData.password) return 'Password is required';
      if (formData.password !== formData.confirmPassword) 
        return 'Passwords do not match';
      
      // Basic password validation
      const passwordRegex = /^(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*()_+])[A-Za-z\d!@#$%^&*()_+]{8,}$/;
      if (!passwordRegex.test(formData.password)) {
        return 'Password must be at least 8 characters with at least one uppercase letter, one number, and one special character';
      }
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Form validation
    const validationError = validateForm();
    if (validationError) {
      setErrorMessage(validationError);
      return;
    }
    
    setIsLoading(true);
    setErrorMessage('');
    setSuccessMessage('');
    
    try {
      if (isLogin) {
        // Handle Login - could be using username or email
        const result = await loginUser(formData.loginIdentifier, formData.password);
        console.log('Login successful:', result);
        setSuccessMessage('Login successful! Welcome back.');
        
        // Redirect to homepage after short delay
        setTimeout(() => {
          navigate('/');
          // Add a small delay before refreshing to ensure navigation completes
          setTimeout(() => {
            window.location.reload();
          }, 100);
        }, 1500);
      } else {
        // Handle Registration
        const userData = {
          username: formData.username,
          email: formData.email,
          password: formData.password,
          phone: formData.phone || '',
          address: formData.address || ''
        };
        
        const result = await registerUser(userData);
        console.log('Registration successful:', result);
        setSuccessMessage('Registration successful! You can now login.');
        
        // Clear form and switch to login
        setFormData({
          ...formData,
          password: '',
          confirmPassword: '',
          loginIdentifier: formData.username || formData.email // Use username or email as login identifier
        });
        
        // Switch to login view after short delay
        setTimeout(() => {
          setIsLogin(true);
        }, 1500);
      }
    } catch (error) {
      const errorMsg = error.message || 'An error occurred. Please try again.';
      console.error('Authentication error:', errorMsg);
      setErrorMessage(errorMsg);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-register-container">
      {/* Cyberpunk decorative elements */}
      <div className="cyber-circuit left"></div>
      <div className="cyber-circuit right"></div>
      <div className="cyber-line line1"></div>
      <div className="cyber-line line2"></div>
      <div className="cyber-dot dot1"></div>
      <div className="cyber-dot dot2"></div>
      <div className="cyber-dot dot3"></div>
      <div className="cyber-dot dot4"></div>
      
      <div className="form-container">
        <div className="form-tabs">
          <div 
            className={`tab ${isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(true)}
          >
            Login
          </div>
          <div 
            className={`tab ${!isLogin ? 'active' : ''}`} 
            onClick={() => setIsLogin(false)}
          >
            Register
          </div>
        </div>
        
        {/* Error and Success Messages */}
        {errorMessage && (
          <div className="message error-message">
            <span>{errorMessage}</span>
          </div>
        )}
        
        {successMessage && (
          <div className="message success-message">
            <span>{successMessage}</span>
          </div>
        )}
        
        {isLogin ? (
          <form className="login-form" onSubmit={handleSubmit}>
            <h2>Welcome Back</h2>
            <p>Login to access your account</p>
            
            <div className="form-group">
              <label htmlFor="loginIdentifier">Username or Email</label>
              <input 
                type="text" 
                id="loginIdentifier" 
                placeholder="Enter your username or email" 
                value={formData.loginIdentifier}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Enter your password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <img 
                  src={`../assets/icons/eye-${showPassword ? 'open' : 'closed'}.png`} 
                  alt="Toggle password visibility" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility} 
                />
              </div>
            </div>
            
            <div className="form-options">
              <div className="remember-me">
                <input type="checkbox" id="remember" />
                <label htmlFor="remember">Remember me</label>
              </div>
              <Link to="#" className="forgot-password">Forgot Password?</Link>
            </div>
            
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Logging in...' : 'Login'}
            </button>
            
            <div className="form-footer">
              <p>Don't have an account? <span className="switch-form" onClick={toggleForm}>Register</span></p>
            </div>
          </form>
        ) : (
          <form className="register-form" onSubmit={handleSubmit}>
            <h2>Create Account</h2>
            <p>Join our gaming community</p>
            
            <div className="form-group">
              <label htmlFor="username">Username</label>
              <input 
                type="text" 
                id="username" 
                placeholder="Enter your username" 
                value={formData.username}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>
            
            <div className="form-group">
              <label htmlFor="email">Email Address</label>
              <input 
                type="email" 
                id="email" 
                placeholder="Enter your email" 
                value={formData.email}
                onChange={handleInputChange}
                required
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="phone">Phone Number</label>
              <input 
                type="tel" 
                id="phone" 
                placeholder="Enter your phone number" 
                value={formData.phone}
                onChange={handleInputChange}
                disabled={isLoading}
              />
            </div>

            <div className="form-group">
              <label htmlFor="address">Address</label>
              <textarea 
                id="address" 
                placeholder="Enter your address" 
                rows="3"
                value={formData.address}
                onChange={handleInputChange}
                disabled={isLoading}
              ></textarea>
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="password">Password</label>
              <div className="password-input-container">
                <input 
                  type={showPassword ? "text" : "password"} 
                  id="password" 
                  placeholder="Create a password" 
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <img 
                  src={`../assets/icons/eye-${showPassword ? 'open' : 'closed'}.png`} 
                  alt="Toggle password visibility" 
                  className="toggle-password" 
                  onClick={togglePasswordVisibility} 
                />
              </div>
              <div className="password-requirements">
                <p>Password must contain:</p>
                <ul>
                  <li>At least 8 characters</li>
                  <li>At least one uppercase letter</li>
                  <li>At least one number</li>
                  <li>At least one special character</li>
                </ul>
              </div>
            </div>
            
            <div className="form-group password-group">
              <label htmlFor="confirmPassword">Confirm Password</label>
              <div className="password-input-container">
                <input 
                  type={showConfirmPassword ? "text" : "password"} 
                  id="confirmPassword" 
                  placeholder="Confirm your password" 
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  required
                  disabled={isLoading}
                />
                <img 
                  src={`../assets/icons/eye-${showConfirmPassword ? 'open' : 'closed'}.png`} 
                  alt="Toggle password visibility" 
                  className="toggle-password" 
                  onClick={toggleConfirmPasswordVisibility} 
                />
              </div>
            </div>
            
            <div className="form-group terms">
              <input type="checkbox" id="terms" required />
              <label htmlFor="terms">I agree to the <Link to="/terms-conditions">Terms and Conditions</Link> and <Link to="/privacy-policy">Privacy Policy</Link></label>
            </div>
            
            <button 
              type="submit" 
              className={`submit-btn ${isLoading ? 'loading' : ''}`}
              disabled={isLoading}
            >
              {isLoading ? 'Creating Account...' : 'Create Account'}
            </button>
            
            <div className="form-footer">
              <p>Already have an account? <span className="switch-form" onClick={toggleForm}>Login</span></p>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}

export default LoginRegister; 