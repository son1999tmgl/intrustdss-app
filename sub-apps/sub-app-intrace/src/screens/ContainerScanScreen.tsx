import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  KeyboardAvoidingView,
  Platform,
} from 'react-native';
import { useTranslation } from '@superapp/core-i18n';
import { hapticService, DateService } from '@superapp/core-services';
import { containerService } from '../services/container.service';

interface ContainerScanScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

interface ScannedBoxItem {
  id: string;
  code: string;
  scannedAt: string;
}

export function ContainerScanScreen({ onBack, onSuccess }: ContainerScanScreenProps) {
  const { t } = useTranslation();
  const [containerCode, setContainerCode] = useState('');
  const [boxInput, setBoxInput] = useState('');
  const [scannedBoxes, setScannedBoxes] = useState<ScannedBoxItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Thêm một mã thùng vào công
  const handleAddBox = (codeToAdd?: string) => {
    const targetCode = (codeToAdd || boxInput).trim();
    if (!targetCode) return;

    if (!containerCode.trim()) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_container_code'));
      return;
    }

    // Kiểm tra trùng lặp mã thùng
    const isDuplicate = scannedBoxes.some((item) => item.code === targetCode);
    if (isDuplicate) {
      hapticService.error();
      Alert.alert(t('common.notice'), `${t('intrace.duplicate_item')} (${targetCode})`);
      setBoxInput('');
      return;
    }

    hapticService.success();
    const newItem: ScannedBoxItem = {
      id: String(Date.now()),
      code: targetCode,
      scannedAt: DateService.nowIso(),
    };

    setScannedBoxes([newItem, ...scannedBoxes]);
    setBoxInput('');
  };

  const handleRemoveBox = (code: string) => {
    hapticService.light();
    setScannedBoxes(scannedBoxes.filter((item) => item.code !== code));
  };

  const handleSubmitContainer = async () => {
    if (!containerCode.trim()) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_container_code'));
      return;
    }

    if (scannedBoxes.length === 0) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_items'));
      return;
    }

    try {
      setSubmitting(true);
      const boxCodes = scannedBoxes.map((b) => b.code);
      const res = await containerService.createContainer({
        code: containerCode.trim(),
        box_codes: boxCodes,
      });

      if (res.success) {
        hapticService.success();
        Alert.alert(t('common.success'), t('intrace.success_create_container'), [
          {
            text: 'OK',
            onPress: onSuccess,
          },
        ]);
      } else {
        hapticService.error();
        Alert.alert(t('common.error'), res.message || 'Lỗi khi lưu công vận chuyển');
      }
    } catch (err: any) {
      hapticService.error();
      Alert.alert(t('common.error'), err.message || 'Lỗi kết nối máy chủ');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={{ flex: 1 }}
      >
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity style={styles.backBtn} onPress={onBack}>
            <Text style={styles.backBtnText}>‹ {t('common.back')}</Text>
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{t('intrace.scan_container_title')}</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Khung Viewfinder Camera Giả lập */}
        <View style={styles.cameraMockContainer}>
          <View style={styles.scannerOverlay}>
            <View style={styles.laserLine} />
            <Text style={styles.scannerHintText}>🚛 Đưa mã Barcode/QR công hoặc thùng vào khung</Text>
          </View>
        </View>

        {/* Form nhập liệu */}
        <View style={styles.formSection}>
          {/* B1: Nhập mã công */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('intrace.step_1_container')} *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.containerInput]}
                placeholder={t('intrace.placeholder_scan_container')}
                placeholderTextColor="#94a3b8"
                value={containerCode}
                onChangeText={setContainerCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() => {
                  const sampleCode = `CONT-${Math.floor(1000 + Math.random() * 9000)}`;
                  setContainerCode(sampleCode);
                  hapticService.light();
                }}
              >
                <Text style={styles.simulateScanBtnText}>Mẫu</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* B2: Quét mã thùng */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('intrace.step_2_boxes')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder="Nhập hoặc quét mã thùng..."
                placeholderTextColor="#94a3b8"
                value={boxInput}
                onChangeText={setBoxInput}
                onSubmitEditing={() => handleAddBox()}
                returnKeyType="done"
                autoCapitalize="characters"
              />
              <TouchableOpacity style={styles.addBtn} onPress={() => handleAddBox()}>
                <Text style={styles.addBtnText}>+ Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() => {
                  const sampleBox = `BOX-${Math.floor(1000 + Math.random() * 9000)}`;
                  handleAddBox(sampleBox);
                }}
              >
                <Text style={styles.simulateScanBtnText}>Quét thử</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Danh sách thùng đã quét */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryTitle}>Danh sách thùng trong công</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{scannedBoxes.length} Thùng</Text>
          </View>
        </View>

        <FlatList
          data={scannedBoxes}
          keyExtractor={(item) => item.code}
          style={styles.boxList}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item, index }) => (
            <View style={styles.boxCard}>
              <View style={styles.boxIndex}>
                <Text style={styles.boxIndexText}>{scannedBoxes.length - index}</Text>
              </View>
              <View style={styles.boxInfo}>
                <Text style={styles.boxCodeText}>📦 {item.code}</Text>
                <Text style={styles.boxTimeText}>{DateService.formatDateTime(item.scannedAt, 'HH:mm:ss')}</Text>
              </View>
              <TouchableOpacity style={styles.deleteBtn} onPress={() => handleRemoveBox(item.code)}>
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptySubText}>Chưa quét thùng hàng nào vào công</Text>
            </View>
          }
        />

        {/* Nút hoàn thành */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmitContainer}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>
                ✓ {t('intrace.btn_confirm_container')} ({scannedBoxes.length})
              </Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
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
    paddingVertical: 12,
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
    color: '#0369a1',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  cameraMockContainer: {
    height: 120,
    backgroundColor: '#0f172a',
    margin: 16,
    marginBottom: 8,
    borderRadius: 12,
    overflow: 'hidden',
    justifyContent: 'center',
    alignItems: 'center',
  },
  scannerOverlay: {
    width: '85%',
    height: 80,
    borderWidth: 2,
    borderColor: '#38bdf8',
    borderRadius: 8,
    borderStyle: 'dashed',
    justifyContent: 'center',
    alignItems: 'center',
  },
  laserLine: {
    position: 'absolute',
    left: 0,
    right: 0,
    height: 2,
    backgroundColor: '#38bdf8',
    shadowColor: '#38bdf8',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  scannerHintText: {
    color: '#cbd5e1',
    fontSize: 12,
    fontWeight: '500',
  },
  formSection: {
    paddingHorizontal: 16,
    gap: 10,
  },
  inputGroup: {
    gap: 4,
  },
  inputLabel: {
    fontSize: 13,
    fontWeight: '600',
    color: '#334155',
  },
  inputRow: {
    flexDirection: 'row',
    gap: 8,
  },
  input: {
    flex: 1,
    height: 44,
    backgroundColor: '#ffffff',
    borderWidth: 1,
    borderColor: '#cbd5e1',
    borderRadius: 8,
    paddingHorizontal: 12,
    fontSize: 14,
    color: '#0f172a',
  },
  containerInput: {
    borderColor: '#0284c7',
    backgroundColor: '#f0f9ff',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#0284c7',
    justifyContent: 'center',
    paddingHorizontal: 14,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 13,
  },
  simulateScanBtn: {
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  simulateScanBtnText: {
    color: '#475569',
    fontWeight: '600',
    fontSize: 12,
  },
  summaryBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    marginTop: 12,
    paddingVertical: 8,
    backgroundColor: '#f1f5f9',
  },
  summaryTitle: {
    fontSize: 13,
    fontWeight: 'bold',
    color: '#475569',
  },
  countBadge: {
    backgroundColor: '#0284c7',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  boxList: {
    flex: 1,
  },
  boxCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  boxIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  boxIndexText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  boxInfo: {
    flex: 1,
  },
  boxCodeText: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  boxTimeText: {
    fontSize: 11,
    color: '#94a3b8',
    marginTop: 2,
  },
  deleteBtn: {
    padding: 8,
  },
  deleteBtnText: {
    fontSize: 16,
    color: '#ef4444',
    fontWeight: 'bold',
  },
  emptyWrap: {
    alignItems: 'center',
    paddingVertical: 30,
  },
  emptySubText: {
    fontSize: 13,
    color: '#94a3b8',
  },
  bottomBar: {
    padding: 16,
    backgroundColor: '#ffffff',
    borderTopWidth: 1,
    borderTopColor: '#e2e8f0',
  },
  submitBtn: {
    backgroundColor: '#0284c7',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#0284c7',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 3,
  },
  submitBtnDisabled: {
    backgroundColor: '#94a3b8',
  },
  submitBtnText: {
    color: '#ffffff',
    fontSize: 16,
    fontWeight: 'bold',
  },
});
