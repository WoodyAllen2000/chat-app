import React, { useEffect } from 'react';
import Navbar from './components/NavBar';
import { Navigate, Route, Routes } from 'react-router-dom';
import HomePage from './pages/HomePage';
import SignUpPage from './pages/SignUpPage';
import LoginPage from './pages/LoginPage';
import SettingsPage from './pages/SettingsPage';
import ProfilePage from './pages/ProfilePage';
import { useAuthStore } from './store/useAuthStore';
import { useThemeStore } from './store/useThemeStore';
import { Loader } from 'lucide-react';
import { Toaster } from 'react-hot-toast';

const App = () => {
  const { theme } = useThemeStore();

  const { authUser, checkAuth, isCheckingAuth, } = useAuthStore();

  // 检查是否登录
  useEffect(() => {
    checkAuth();
  }, [checkAuth]);

  console.log({ authUser });

  // check时，加载loading界面
  if (isCheckingAuth && !authUser) {
    return (
      <div className='flex items-center justify-center h-screen'>
        <Loader className='size-10 animate-spin' />
      </div>
    );
  }

  return (
    <>
      <div data-theme={ theme }>
        {/* 先引入Navbar，在Navbar里面进行路由 */}
        <Navbar />

        <Routes>
          {/* 首页是homepage */}
          {/* 如果用户没有认证，跳转到login页面 */}
          <Route path='/' element={authUser ? <HomePage /> : <Navigate to="/login" />}/>
          {/* 如果用户已登录，不能出现signup和login界面，直接进入homepage */}
          <Route path='/signup' element={!authUser ? <SignUpPage /> : <Navigate to="/" />}/>
          <Route path='/login' element={!authUser ? <LoginPage /> : <Navigate to="/" />}/>
          <Route path='/settings' element={<SettingsPage />}/>
          <Route path='/profile' element={authUser ? <ProfilePage /> : <Navigate to="/login" />}/>

        </Routes>

        <Toaster />
      </div>
    </>
  );
}

export default App;
