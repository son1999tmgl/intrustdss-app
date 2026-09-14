import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
} from 'react-native';
import { useTranslation, changeLanguage, getCurrentLanguage } from '@superapp/core-i18n';
import { authStorage, hapticService } from '@superapp/core-services';

interface DashboardScreenProps {
  onOpenApp: (appKey: 'intrace' | 'econtract' | 'ebhxh' | 'hoadon' | 'infarm') => void;
  onLogout: () => void;
}

export function DashboardScreen({ onOpenApp, onLogout }: DashboardScreenProps) {
  const { t } = useTranslation();
  const currentLang = getCurrentLanguage();
  const user = authStorage.getUser();

  const toggleLanguage = () => {
    const next = currentLang === 'vi' ? 'en' : 'vi';
    changeLanguage(next);
    hapticService.selection();
  };

  const handleLogoutConfirm = () => {
    Alert.alert(t('auth.logout'), 'Bạn có chắc chắn muốn đăng xuất?', [
      { text: t('common.cancel'), style: 'cancel' },
      {
        text: t('auth.logout'),
        style: 'destructive',
        onPress: () => {
          hapticService.light();
          authStorage.clearSession();
          onLogout();
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Top Header */}
      <View style={styles.topHeader}>
        <View style={styles.brandWrap}>
          <View style={styles.brandDot} />
          <Text style={styles.brandText}>SUPER APP</Text>
        </View>

        <View style={styles.headerActions}>
          <TouchableOpacity style={styles.langBtn} onPress={toggleLanguage}>
            <Text style={styles.langBtnText}>
              🌐 {currentLang === 'vi' ? 'VI' : 'EN'}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.logoutBtn} onPress={handleLogoutConfirm}>
            <Text style={styles.logoutBtnText}>🚪</Text>
          </TouchableOpacity>
        </View>
      </View>

      <ScrollView contentContainerStyle={styles.scrollBody}>
        {/* User Card */}
        <View style={styles.userBanner}>
          <View style={styles.avatar}>
            <Text style={styles.avatarText}>
              {(user?.fullName || user?.username || 'U').charAt(0).toUpperCase()}
            </Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={styles.userName}>{user?.fullName || 'Người Dùng'}</Text>
            <Text style={styles.userRole}>@{user?.username} • Quản trị viên</Text>
          </View>
          <View style={styles.ssoBadge}>
            <Text style={styles.ssoBadgeText}>SSO ACTIVE</Text>
          </View>
        </View>

        {/* Section Title */}
        <View style={styles.sectionHeader}>
          <Text style={styles.sectionTitle}>{t('apps.title')}</Text>
          <Text style={styles.sectionSubtitle}>{t('apps.subtitle')}</Text>
        </View>

        {/* List of 5 Sub-Apps */}
        <View style={styles.appsGrid}>
          {/* 1. inTrace (ACTIVE) */}
          <TouchableOpacity
            style={[styles.appCard, styles.appCardActive]}
            onPress={() => {
              hapticService.success();
              onOpenApp('intrace');
            }}
          >
            <View style={[styles.appIconWrap, { backgroundColor: '#10b98120' }]}>
              <Text style={styles.appIcon}>📦</Text>
            </View>
            <View style={styles.appDetails}>
              <View style={styles.appTitleRow}>
                <Text style={styles.appTitle}>{t('apps.intrace_title')}</Text>
                <View style={styles.readyBadge}>
                  <Text style={styles.readyBadgeText}>SẴN SÀNG</Text>
                </View>
              </View>
              <Text style={styles.appDesc}>{t('apps.intrace_desc')}</Text>
              <Text style={styles.appFeatureHighlight}>
                ⚡ Đóng thùng SP • Đóng công vận chuyển
              </Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* 2. eContract */}
          <TouchableOpacity
            style={styles.appCard}
            onPress={() => {
              hapticService.light();
              onOpenApp('econtract');
            }}
          >
            <View style={[styles.appIconWrap, { backgroundColor: '#0284c715' }]}>
              <Text style={styles.appIcon}>📝</Text>
            </View>
            <View style={styles.appDetails}>
              <View style={styles.appTitleRow}>
                <Text style={styles.appTitle}>{t('apps.econtract_title')}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>SẮP RA MẮT</Text>
                </View>
              </View>
              <Text style={styles.appDesc}>{t('apps.econtract_desc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* 3. eBHXH */}
          <TouchableOpacity
            style={styles.appCard}
            onPress={() => {
              hapticService.light();
              onOpenApp('ebhxh');
            }}
          >
            <View style={[styles.appIconWrap, { backgroundColor: '#16a34a15' }]}>
              <Text style={styles.appIcon}>🛡️</Text>
            </View>
            <View style={styles.appDetails}>
              <View style={styles.appTitleRow}>
                <Text style={styles.appTitle}>{t('apps.ebhxh_title')}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>SẮP RA MẮT</Text>
                </View>
              </View>
              <Text style={styles.appDesc}>{t('apps.ebhxh_desc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* 4. Hóa đơn điện tử */}
          <TouchableOpacity
            style={styles.appCard}
            onPress={() => {
              hapticService.light();
              onOpenApp('hoadon');
            }}
          >
            <View style={[styles.appIconWrap, { backgroundColor: '#d9770615' }]}>
              <Text style={styles.appIcon}>🧾</Text>
            </View>
            <View style={styles.appDetails}>
              <View style={styles.appTitleRow}>
                <Text style={styles.appTitle}>{t('apps.hoadon_title')}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>SẮP RA MẮT</Text>
                </View>
              </View>
              <Text style={styles.appDesc}>{t('apps.hoadon_desc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>

          {/* 5. inFarm */}
          <TouchableOpacity
            style={styles.appCard}
            onPress={() => {
              hapticService.light();
              onOpenApp('infarm');
            }}
          >
            <View style={[styles.appIconWrap, { backgroundColor: '#15803d15' }]}>
              <Text style={styles.appIcon}>🌱</Text>
            </View>
            <View style={styles.appDetails}>
              <View style={styles.appTitleRow}>
                <Text style={styles.appTitle}>{t('apps.infarm_title')}</Text>
                <View style={styles.pendingBadge}>
                  <Text style={styles.pendingBadgeText}>SẮP RA MẮT</Text>
                </View>
              </View>
              <Text style={styles.appDesc}>{t('apps.infarm_desc')}</Text>
            </View>
            <Text style={styles.arrowIcon}>›</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  topHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  brandWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  brandDot: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: '#2563eb',
  },
  brandText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#0f172a',
    letterSpacing: 0.5,
  },
  headerActions: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  langBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
  },
  langBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#334155',
  },
  logoutBtn: {
    padding: 6,
    borderRadius: 8,
  },
  logoutBtnText: {
    fontSize: 18,
  },
  scrollBody: {
    padding: 16,
    gap: 16,
  },
  userBanner: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  avatar: {
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#2563eb',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  avatarText: {
    color: '#ffffff',
    fontSize: 18,
    fontWeight: 'bold',
  },
  userInfo: {
    flex: 1,
  },
  userName: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  userRole: {
    fontSize: 12,
    color: '#64748b',
    marginTop: 2,
  },
  ssoBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  ssoBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#15803d',
  },
  sectionHeader: {
    marginTop: 4,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#1e293b',
  },
  sectionSubtitle: {
    fontSize: 13,
    color: '#64748b',
    marginTop: 2,
  },
  appsGrid: {
    gap: 12,
  },
  appCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 16,
    borderRadius: 14,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.04,
    shadowRadius: 3,
    elevation: 1,
  },
  appCardActive: {
    borderColor: '#10b981',
    backgroundColor: '#ffffff',
    borderWidth: 1.5,
  },
  appIconWrap: {
    width: 48,
    height: 48,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 14,
  },
  appIcon: {
    fontSize: 24,
  },
  appDetails: {
    flex: 1,
  },
  appTitleRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  appTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  readyBadge: {
    backgroundColor: '#dcfce7',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  readyBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#16a34a',
  },
  pendingBadge: {
    backgroundColor: '#f1f5f9',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 4,
  },
  pendingBadgeText: {
    fontSize: 10,
    fontWeight: 'bold',
    color: '#94a3b8',
  },
  appDesc: {
    fontSize: 12,
    color: '#64748b',
  },
  appFeatureHighlight: {
    fontSize: 11,
    fontWeight: '600',
    color: '#059669',
    marginTop: 4,
  },
  arrowIcon: {
    fontSize: 20,
    color: '#94a3b8',
    marginLeft: 8,
  },
});
