import React from 'react';
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';
import { useTranslation } from '@superapp/core-i18n';
import { hapticService } from '@superapp/core-services';

interface PlaceholderScreenProps {
  appKey: 'econtract' | 'ebhxh' | 'hoadon' | 'infarm';
  onBack: () => void;
}

export function PlaceholderScreen({ appKey, onBack }: PlaceholderScreenProps) {
  const { t } = useTranslation();

  const appMeta: Record<
    string,
    { titleKey: string; descKey: string; icon: string; color: string }
  > = {
    econtract: {
      titleKey: 'apps.econtract_title',
      descKey: 'apps.econtract_desc',
      icon: '📝',
      color: '#0284c7',
    },
    ebhxh: {
      titleKey: 'apps.ebhxh_title',
      descKey: 'apps.ebhxh_desc',
      icon: '🛡️',
      color: '#16a34a',
    },
    hoadon: {
      titleKey: 'apps.hoadon_title',
      descKey: 'apps.hoadon_desc',
      icon: '🧾',
      color: '#d97706',
    },
    infarm: {
      titleKey: 'apps.infarm_title',
      descKey: 'apps.infarm_desc',
      icon: '🌱',
      color: '#15803d',
    },
  };

  const meta = appMeta[appKey] || appMeta.econtract;

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backBtn}
          onPress={() => {
            hapticService.light();
            onBack();
          }}
        >
          <Text style={styles.backBtnText}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t(meta.titleKey)}</Text>
        <View style={{ width: 60 }} />
      </View>

      {/* Content Card */}
      <View style={styles.content}>
        <View style={[styles.iconWrap, { backgroundColor: meta.color + '15' }]}>
          <Text style={styles.icon}>{meta.icon}</Text>
        </View>

        <Text style={styles.appName}>{t(meta.titleKey)}</Text>
        <Text style={styles.appDesc}>{t(meta.descKey)}</Text>

        <View style={styles.badge}>
          <Text style={styles.badgeText}>🚀 {t('common.coming_soon')}</Text>
        </View>

        <Text style={styles.note}>
          Module này đã được cấp quyền trong tài khoản SSO của bạn và sẽ sớm được tích hợp vào Super App.
        </Text>

        <TouchableOpacity
          style={styles.returnBtn}
          onPress={() => {
            hapticService.selection();
            onBack();
          }}
        >
          <Text style={styles.returnBtnText}>⌂ Quay lại danh mục ứng dụng</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  backBtn: {
    paddingVertical: 6,
    paddingHorizontal: 8,
  },
  backBtnText: {
    fontSize: 16,
    color: '#2563eb',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 32,
  },
  iconWrap: {
    width: 96,
    height: 96,
    borderRadius: 30,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 48,
  },
  appName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#0f172a',
    textAlign: 'center',
  },
  appDesc: {
    fontSize: 14,
    color: '#64748b',
    textAlign: 'center',
    marginTop: 6,
  },
  badge: {
    backgroundColor: '#fef3c7',
    paddingHorizontal: 14,
    paddingVertical: 6,
    borderRadius: 20,
    marginTop: 20,
    borderWidth: 1,
    borderColor: '#fde68a',
  },
  badgeText: {
    color: '#b45309',
    fontSize: 13,
    fontWeight: 'bold',
  },
  note: {
    fontSize: 13,
    color: '#94a3b8',
    textAlign: 'center',
    marginTop: 16,
    lineHeight: 20,
    maxWidth: 280,
  },
  returnBtn: {
    marginTop: 32,
    backgroundColor: '#ffffff',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#cbd5e1',
  },
  returnBtnText: {
    fontSize: 14,
    color: '#334155',
    fontWeight: '600',
  },
});
