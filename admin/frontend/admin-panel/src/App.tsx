import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { CssBaseline, ThemeProvider, createTheme } from '@mui/material';
import { SnackbarProvider } from 'notistack';
import AdminPanelSettingsIcon from '@mui/icons-material/AdminPanelSettings';
import PeopleIcon from '@mui/icons-material/People';
import CategoryIcon from '@mui/icons-material/Category';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import DiscountIcon from '@mui/icons-material/Discount';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import ArticleIcon from '@mui/icons-material/Article';
import QuestionAnswerIcon from '@mui/icons-material/QuestionAnswer';
import EmailIcon from '@mui/icons-material/Email';
import WorkIcon from '@mui/icons-material/Work';
import GavelIcon from '@mui/icons-material/Gavel';
import PrivacyTipIcon from '@mui/icons-material/PrivacyTip';

import { AuthProvider } from './contexts/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

// Pages
import Login from './pages/Login';
import Dashboard from './pages/Dashboard';
import AdminManagement from './pages/AdminManagement';
import UserManagement from './pages/UserManagement';
import CategoryManagement from './pages/CategoryManagement';
import ProductManagement from './pages/ProductManagement';
import PromotionManagement from './pages/PromotionManagement';
import OrderManagement from './pages/OrderManagement';
import BlogManagement from './pages/BlogManagement';

// Pages that will be created
// import BlogManagement from './pages/BlogManagement';
// import FaqManagement from './pages/FaqManagement';
// import ContactManagement from './pages/ContactManagement';
// import CareerManagement from './pages/CareerManagement';

// Tạo theme
const theme = createTheme({
  palette: {
    primary: {
      main: '#2196f3',
    },
    secondary: {
      main: '#f50057',
    },
  },
});

// Define menu items for the sidebar
export const MENU_ITEMS = [
  {
    path: '/dashboard',
    name: 'Dashboard',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    path: '/admins',
    name: 'Quản lý Admin',
    icon: <AdminPanelSettingsIcon />,
  },
  {
    path: '/users',
    name: 'Quản lý người dùng',
    icon: <PeopleIcon />,
  },
  {
    path: '/categories',
    name: 'Quản lý danh mục',
    icon: <CategoryIcon />,
  },
  {
    path: '/products',
    name: 'Quản lý sản phẩm',
    icon: <Inventory2Icon />,
  },
  {
    path: '/promotions',
    name: 'Quản lý khuyến mãi',
    icon: <DiscountIcon />,
  },
  {
    path: '/orders',
    name: 'Quản lý đơn hàng',
    icon: <ShoppingCartIcon />,
  },
  {
    path: '/blogs',
    name: 'Quản lý bài viết',
    icon: <ArticleIcon />,
  },
  // {
  //   path: '/faqs',
  //   name: 'Quản lý FAQ',
  //   icon: <QuestionAnswerIcon />,
  // },
  // {
  //   path: '/contacts',
  //   name: 'Quản lý liên hệ',
  //   icon: <EmailIcon />,
  // },
  // {
  //   path: '/careers',
  //   name: 'Quản lý tuyển dụng',
  //   icon: <WorkIcon />,
  // },
  // {
  //   path: '/terms',
  //   name: 'Quản lý điều khoản',
  //   icon: <GavelIcon />,
  // },
  // {
  //   path: '/privacy',
  //   name: 'Quản lý chính sách',
  //   icon: <PrivacyTipIcon />,
  // },
];

function App() {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <SnackbarProvider maxSnack={3}>
        <Router>
          <AuthProvider>
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route path="/dashboard" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/admins" element={
                <ProtectedRoute>
                  <AdminManagement />
                </ProtectedRoute>
              } />
              <Route path="/users" element={
                <ProtectedRoute>
                  <UserManagement />
                </ProtectedRoute>
              } />
              <Route path="/categories" element={
                <ProtectedRoute>
                  <CategoryManagement />
                </ProtectedRoute>
              } />
              <Route path="/products" element={
                <ProtectedRoute>
                  <ProductManagement />
                </ProtectedRoute>
              } />
              <Route path="/promotions" element={
                <ProtectedRoute>
                  <PromotionManagement />
                </ProtectedRoute>
              } />
              <Route path="/orders" element={
                <ProtectedRoute>
                  <OrderManagement />
                </ProtectedRoute>
              } />
              <Route path="/blogs" element={
                <ProtectedRoute>
                  <BlogManagement />
                </ProtectedRoute>
              } />
              <Route path="/faqs" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/contacts" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/careers" element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } />
              <Route path="/" element={<Navigate to="/dashboard" replace />} />
              <Route path="*" element={<Navigate to="/dashboard" replace />} />
            </Routes>
          </AuthProvider>
        </Router>
      </SnackbarProvider>
    </ThemeProvider>
  );
}

export default App;
