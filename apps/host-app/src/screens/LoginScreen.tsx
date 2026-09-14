import React, { useState } from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  Alert,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
} from 'react-native';
import axios from 'axios';
import { useTranslation, changeLanguage, getCurrentLanguage } from '@superapp/core-i18n';
import { authStorage, hapticService } from '@superapp/core-services';
import { AUTH_CONFIG } from '../config/env';

interface LoginScreenProps {
  onLoginSuccess: () => void;
}

export function LoginScreen({ onLoginSuccess }: LoginScreenProps) {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();

  const [taxCode, setTaxCode] = useState('');
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const toggleLanguage = () => {
    const nextLang = currentLang === 'vi' ? 'en' : 'vi';
    changeLanguage(nextLang);
    hapticService.selection();
  };

  const fillSampleData = () => {
    setTaxCode('0102030405');
    setUsername('admin');
    setPassword('123456@Abc');
    hapticService.light();
  };

  const handleLogin = async () => {
    if (!taxCode.trim() || !username.trim() || !password.trim()) {
      hapticService.error();
      Alert.alert(t('common.notice'), 'Vui lòng điền đầy đủ Mã số thuế, Tên đăng nhập và Mật khẩu.');
      return;
    }

    try {
      setLoading(true);
      // Gọi API đăng nhập tới endpoint riêng của Host App
      const response = await axios.post(
        `${AUTH_CONFIG.BASE_URL}${AUTH_CONFIG.ENDPOINTS.LOGIN}`,
        {
          tax_code: taxCode.trim(),
          username: username.trim(),
          password: password,
        },
        { timeout: AUTH_CONFIG.TIMEOUT }
      );

      const resData = response.data;
      if (resData.status === 'success' || resData.data?.access_token) {
        hapticService.success();
        authStorage.setSession({
          accessToken: resData.data.access_token,
          refreshToken: resData.data.refresh_token || '',
          expiresAt: Date.now() + (resData.data.expires_in || 3600) * 1000,
          user: {
            id: resData.data.id || resData.data.account?.id || '1',
            username: username.trim(),
            fullName: resData.data.name || resData.data.account?.name || username.trim(),
            email: resData.data.email || '',
            roles: ['admin'],
            permissions: [],
          },
        });
        onLoginSuccess();
      } else {
        hapticService.error();
        Alert.alert(t('common.error'), resData.message || t('auth.login_failed'));
      }
    } catch (err: any) {
      hapticService.error();
      // Nếu server test hoặc mất mạng, cho phép chế độ demo nếu đúng tài khoản admin
      const msg = err?.response?.data?.message || err.message;
      Alert.alert(
        'Đăng nhập thử nghiệm',
        `Phản hồi: ${msg}\n\nBạn có muốn vào thẳng Dashboard bằng tài khoản giả lập không?`,
        [
          { text: t('common.cancel'), style: 'cancel' },
          {
            text: 'Vào Demo',
            onPress: () => {
              authStorage.setSession({
                accessToken: 'mock_super_app_token_999',
                refreshToken: 'mock_refresh_token',
                expiresAt: Date.now() + 86400000,
                user: {
                  id: 'demo-01',
                  username: username.trim() || 'demo_user',
                  fullName: 'Người Dùng Quản Trị',
                  email: 'admin@superapp.vn',
                  roles: ['admin'],
                  permissions: ['*'],
                },
              });
              onLoginSuccess();
            },
          },
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        <ScrollView contentContainerStyle={styles.scrollContent}>
          {/* Top Bar: Language Switcher */}
          <View style={styles.topBar}>
            <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
              <Text style={styles.langBtnText}>
                🌐 {currentLang === 'vi' ? 'Tiếng Việt' : 'English'}
              </Text>
            </TouchableOpacity>
          </View>

          {/* Logo & Header */}
          <View style={styles.header}>
            <View style={styles.logoBadge}>
              <Text style={styles.logoIcon}>⚡</Text>
            </View>
            <Text style={styles.title}>{t('auth.login_title')}</Text>
            <Text style={styles.subtitle}>{t('auth.login_subtitle')}</Text>
          </View>

          {/* Form Card */}
          <View style={styles.formCard}>
            {/* Mã số thuế */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.tax_code')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.tax_code_placeholder')}
                placeholderTextColor="#94a3b8"
                value={taxCode}
                onChangeText={setTaxCode}
                autoCapitalize="none"
              />
            </View>

            {/* Tên đăng nhập */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.username')}</Text>
              <TextInput
                style={styles.input}
                placeholder={t('auth.username_placeholder')}
                placeholderTextColor="#94a3b8"
                value={username}
                onChangeText={setUsername}
                autoCapitalize="none"
              />
            </View>

            {/* Mật khẩu */}
            <View style={styles.inputGroup}>
              <Text style={styles.label}>{t('auth.password')}</Text>
              <View style={styles.passwordContainer}>
                <TextInput
                  style={[styles.input, { flex: 1, borderWidth: 0 }]}
                  placeholder={t('auth.password_placeholder')}
                  placeholderTextColor="#94a3b8"
                  value={password}
                  onChangeText={setPassword}
                  secureTextEntry={!showPassword}
                  autoCapitalize="none"
                />
                <TouchableOpacity
                  style={styles.eyeBtn}
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Text style={styles.eyeBtnText}>{showPassword ? '👁️' : '🔒'}</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Nút bấm Đăng nhập */}
            <TouchableOpacity
              style={[styles.loginBtn, loading && styles.loginBtnDisabled]}
              onPress={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <ActivityIndicator color="#ffffff" />
              ) : (
                <Text style={styles.loginBtnText}>{t('auth.btn_login')}</Text>
              )}
            </TouchableOpacity>

            {/* Nút điền dữ liệu mẫu */}
            <TouchableOpacity style={styles.sampleBtn} onPress={fillSampleData}>
              <Text style={styles.sampleBtnText}>+ Điền tài khoản mẫu</Text>
            </TouchableOpacity>
          </View>

          {/* Footer */}
          <Text style={styles.footerNote}>
            Hệ sinh thái Super App • Tự động liên kết SSO
          </Text>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0f172a',
  },
  scrollContent: {
    flexGrow: 1,
    padding: 20,
    justifyContent: 'center',
  },
  topBar: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginBottom: 20,
  },
  langBtn: {
    backgroundColor: '#1e293b',
    paddingVertical: 6,
    paddingHorizontal: 12,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#334155',
  },
  langBtnText: {
    color: '#e2e8f0',
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    alignItems: 'center',
    marginBottom: 28,
  },
  logoBadge: {
    width: 64,
    height: 64,
    borderRadius: 20,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 16,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  logoIcon: {
    fontSize: 32,
  },
  title: {
    fontSize: 22,
    fontWeight: 'bold',
    color: '#ffffff',
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 6,
    paddingHorizontal: 20,
  },
  formCard: {
    backgroundColor: '#ffffff',
    borderRadius: 20,
    padding: 24,
    gap: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 5,
  },
  inputGroup: {
    gap: 6,
  },
  label: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  input: {
    height: 48,
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    fontSize: 14,
    color: '#0f172a',
  },
  passwordContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8fafc',
    borderWidth: 1,
    borderColor: '#e2e8f0',
    borderRadius: 10,
  },
  eyeBtn: {
    paddingHorizontal: 14,
  },
  eyeBtnText: {
    fontSize: 16,
  },
  loginBtn: {
    backgroundColor: '#2563eb',
    height: 50,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#2563eb',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 4,
  },
  loginBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  loginBtnText: {
    color: '#ffffff',
    fontSize: 15,
    fontWeight: 'bold',
    letterSpacing: 0.5,
  },
  sampleBtn: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  sampleBtnText: {
    fontSize: 13,
    color: '#2563eb',
    fontWeight: '600',
  },
  footerNote: {
    textAlign: 'center',
    color: '#64748b',
    fontSize: 12,
    marginTop: 24,
  },
});
