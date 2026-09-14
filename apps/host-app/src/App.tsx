import React, { useState, useEffect } from 'react';
import { StatusBar } from 'react-native';
import { authStorage } from '@superapp/core-services';
import '@superapp/core-i18n'; // Khởi tạo i18n
import { LoginScreen } from './screens/LoginScreen';
import { DashboardScreen } from './screens/DashboardScreen';
import { PlaceholderScreen } from './screens/PlaceholderScreen';
import { IntraceMainScreen } from 'sub-app-intrace';

type AppSection = 'intrace' | 'econtract' | 'ebhxh' | 'hoadon' | 'infarm' | null;

export default function App() {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [activeSubApp, setActiveSubApp] = useState<AppSection>(null);

  useEffect(() => {
    // Lắng nghe thay đổi phiên đăng nhập
    const unsubscribe = authStorage.subscribe((session) => {
      setIsAuthenticated(!!session?.accessToken);
    });

    // Kiểm tra trạng thái hiện tại
    setIsAuthenticated(authStorage.isAuthenticated());

    return () => unsubscribe();
  }, []);

  // 1. Chưa đăng nhập -> Hiển thị Màn hình Đăng nhập SSO
  if (!isAuthenticated) {
    return (
      <>
        <StatusBar barStyle="light-content" />
        <LoginScreen onLoginSuccess={() => setIsAuthenticated(true)} />
      </>
    );
  }

  // 2. Đã chọn mở Sub-App inTrace (Đóng thùng & Đóng công)
  if (activeSubApp === 'intrace') {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <IntraceMainScreen onBackToHost={() => setActiveSubApp(null)} />
      </>
    );
  }

  // 3. Đã chọn mở các Sub-App đang chờ phát triển (eContract, eBHXH, Hóa đơn, inFarm)
  if (activeSubApp) {
    return (
      <>
        <StatusBar barStyle="dark-content" />
        <PlaceholderScreen
          appKey={activeSubApp}
          onBack={() => setActiveSubApp(null)}
        />
      </>
    );
  }

  // 4. Màn hình Dashboard Tổng của Super App
  return (
    <>
      <StatusBar barStyle="dark-content" />
      <DashboardScreen
        onOpenApp={(appKey) => setActiveSubApp(appKey)}
        onLogout={() => {
          setActiveSubApp(null);
          setIsAuthenticated(false);
        }}
      />
    </>
  );
}
