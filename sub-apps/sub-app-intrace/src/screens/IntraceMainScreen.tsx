import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from '@superapp/core-i18n';
import { hapticService } from '@superapp/core-services';
import { BoxListScreen } from './BoxListScreen';
import { BoxScanScreen } from './BoxScanScreen';
import { ContainerListScreen } from './ContainerListScreen';
import { ContainerScanScreen } from './ContainerScanScreen';

interface IntraceMainScreenProps {
  onBackToHost: () => void;
}

type ViewMode = 'box_list' | 'box_scan' | 'container_list' | 'container_scan';

export function IntraceMainScreen({ onBackToHost }: IntraceMainScreenProps) {
  const { t } = useTranslation();
  const [activeTab, setActiveTab] = useState<'boxes' | 'containers'>('boxes');
  const [viewMode, setViewMode] = useState<ViewMode>('box_list');

  // Điều hướng con bên trong inTrace
  if (viewMode === 'box_scan') {
    return (
      <BoxScanScreen
        onBack={() => setViewMode('box_list')}
        onSuccess={() => setViewMode('box_list')}
      />
    );
  }

  if (viewMode === 'container_scan') {
    return (
      <ContainerScanScreen
        onBack={() => setViewMode('container_list')}
        onSuccess={() => setViewMode('container_list')}
      />
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      {/* Thanh Bar chuyển Tab chính giữa Thùng & Công */}
      <View style={styles.tabBarWrap}>
        <TouchableOpacity style={styles.exitBtn} onPress={onBackToHost}>
          <Text style={styles.exitBtnText}>⌂ {t('common.app_name')}</Text>
        </TouchableOpacity>

        <View style={styles.segmentedControl}>
          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'boxes' && styles.segmentBtnActive]}
            onPress={() => {
              hapticService.selection();
              setActiveTab('boxes');
            }}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'boxes' && styles.segmentTextActive,
              ]}
            >
              📦 {t('intrace.tab_boxes')}
            </Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={[styles.segmentBtn, activeTab === 'containers' && styles.segmentBtnActive]}
            onPress={() => {
              hapticService.selection();
              setActiveTab('containers');
            }}
          >
            <Text
              style={[
                styles.segmentText,
                activeTab === 'containers' && styles.segmentTextActive,
              ]}
            >
              🚛 {t('intrace.tab_containers')}
            </Text>
          </TouchableOpacity>
        </View>
      </View>

      {/* Hiển thị màn hình danh sách tương ứng */}
      {activeTab === 'boxes' ? (
        <BoxListScreen
          onBack={onBackToHost}
          onOpenScan={() => setViewMode('box_scan')}
        />
      ) : (
        <ContainerListScreen
          onBack={onBackToHost}
          onOpenScan={() => setViewMode('container_scan')}
        />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8fafc',
  },
  tabBarWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 10,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e2e8f0',
  },
  exitBtn: {
    paddingVertical: 6,
    paddingHorizontal: 10,
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    marginRight: 10,
  },
  exitBtnText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  segmentedControl: {
    flex: 1,
    flexDirection: 'row',
    backgroundColor: '#f1f5f9',
    borderRadius: 8,
    padding: 3,
  },
  segmentBtn: {
    flex: 1,
    paddingVertical: 7,
    alignItems: 'center',
    borderRadius: 6,
  },
  segmentBtnActive: {
    backgroundColor: '#ffffff',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  segmentText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#64748b',
  },
  segmentTextActive: {
    color: '#0f172a',
    fontWeight: 'bold',
  },
});
