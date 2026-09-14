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
import { ProductStampItem } from '@superapp/core-contracts';
import { boxService } from '../services/box.service';

interface BoxScanScreenProps {
  onBack: () => void;
  onSuccess: () => void;
}

export function BoxScanScreen({ onBack, onSuccess }: BoxScanScreenProps) {
  const { t } = useTranslation();
  const [boxCode, setBoxCode] = useState('');
  const [productInput, setProductInput] = useState('');
  const [scannedProducts, setScannedProducts] = useState<ProductStampItem[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // Thêm một mã tem sản phẩm vào danh sách thùng
  const handleAddProduct = (codeToAdd?: string) => {
    const targetCode = (codeToAdd || productInput).trim();
    if (!targetCode) return;

    if (!boxCode.trim()) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_box_code'));
      return;
    }

    // Kiểm tra trùng lặp mã tem trong thùng hiện tại
    const isDuplicate = scannedProducts.some((item) => item.code === targetCode);
    if (isDuplicate) {
      hapticService.error();
      Alert.alert(t('common.notice'), `${t('intrace.duplicate_item')} (${targetCode})`);
      setProductInput('');
      return;
    }

    // Thành công: Rung máy + Thêm vào danh sách
    hapticService.success();
    const newItem: ProductStampItem = {
      id: String(Date.now()),
      code: targetCode,
      scannedAt: DateService.nowIso(),
    };

    setScannedProducts([newItem, ...scannedProducts]);
    setProductInput('');
  };

  // Xóa 1 sản phẩm khỏi danh sách
  const handleRemoveProduct = (code: string) => {
    hapticService.light();
    setScannedProducts(scannedProducts.filter((item) => item.code !== code));
  };

  // Xác nhận tạo thùng và gửi lên backend
  const handleSubmitBox = async () => {
    if (!boxCode.trim()) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_box_code'));
      return;
    }

    if (scannedProducts.length === 0) {
      hapticService.error();
      Alert.alert(t('common.notice'), t('intrace.empty_items'));
      return;
    }

    try {
      setSubmitting(true);
      const productCodes = scannedProducts.map((p) => p.code);
      const res = await boxService.createBox({
        code: boxCode.trim(),
        product_codes: productCodes,
      });

      if (res.success) {
        hapticService.success();
        Alert.alert(t('common.success'), t('intrace.success_create_box'), [
          {
            text: 'OK',
            onPress: onSuccess,
          },
        ]);
      } else {
        hapticService.error();
        Alert.alert(t('common.error'), res.message || 'Lỗi khi lưu thùng hàng');
      }
    } catch (err: any) {
      hapticService.error();
      Alert.alert(t('common.error'), err.message || 'Lỗi hệ thống');
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
          <Text style={styles.headerTitle}>{t('intrace.scan_box_title')}</Text>
          <View style={{ width: 60 }} />
        </View>

        {/* Khung Viewfinder Camera Giả lập / Máy Quét */}
        <View style={styles.cameraMockContainer}>
          <View style={styles.scannerOverlay}>
            <View style={styles.laserLine} />
            <Text style={styles.scannerHintText}>📷 Đưa mã Barcode/QR vào khung quét</Text>
          </View>
        </View>

        {/* Form nhập liệu */}
        <View style={styles.formSection}>
          {/* B1: Nhập mã thùng */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('intrace.step_1_box')} *</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={[styles.input, styles.boxInput]}
                placeholder={t('intrace.placeholder_scan_box')}
                placeholderTextColor="#94a3b8"
                value={boxCode}
                onChangeText={setBoxCode}
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() => {
                  const sampleCode = `BOX-${Math.floor(1000 + Math.random() * 9000)}`;
                  setBoxCode(sampleCode);
                  hapticService.light();
                }}
              >
                <Text style={styles.simulateScanBtnText}>Mẫu</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* B2: Quét mã sản phẩm */}
          <View style={styles.inputGroup}>
            <Text style={styles.inputLabel}>{t('intrace.step_2_products')}</Text>
            <View style={styles.inputRow}>
              <TextInput
                style={styles.input}
                placeholder={t('intrace.placeholder_scan_product')}
                placeholderTextColor="#94a3b8"
                value={productInput}
                onChangeText={setProductInput}
                onSubmitEditing={() => handleAddProduct()}
                returnKeyType="done"
                autoCapitalize="characters"
              />
              <TouchableOpacity
                style={styles.addBtn}
                onPress={() => handleAddProduct()}
              >
                <Text style={styles.addBtnText}>+ Thêm</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.simulateScanBtn}
                onPress={() => {
                  const sampleSp = `SP-${Math.floor(10000 + Math.random() * 90000)}`;
                  handleAddProduct(sampleSp);
                }}
              >
                <Text style={styles.simulateScanBtnText}>Quét thử</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        {/* Thống kê & Danh sách sản phẩm đã quét */}
        <View style={styles.summaryBar}>
          <Text style={styles.summaryTitle}>{t('intrace.scanned_items_list')}</Text>
          <View style={styles.countBadge}>
            <Text style={styles.countBadgeText}>{scannedProducts.length} SP</Text>
          </View>
        </View>

        <FlatList
          data={scannedProducts}
          keyExtractor={(item) => item.code}
          style={styles.productList}
          contentContainerStyle={{ padding: 16, gap: 8 }}
          renderItem={({ item, index }) => (
            <View style={styles.productCard}>
              <View style={styles.productIndex}>
                <Text style={styles.productIndexText}>{scannedProducts.length - index}</Text>
              </View>
              <View style={styles.productInfo}>
                <Text style={styles.productCode}>{item.code}</Text>
                <Text style={styles.productTime}>{DateService.formatDateTime(item.scannedAt, 'HH:mm:ss')}</Text>
              </View>
              <TouchableOpacity
                style={styles.deleteBtn}
                onPress={() => handleRemoveProduct(item.code)}
              >
                <Text style={styles.deleteBtnText}>✕</Text>
              </TouchableOpacity>
            </View>
          )}
          ListEmptyComponent={
            <View style={styles.emptyWrap}>
              <Text style={styles.emptySubText}>Chưa quét tem sản phẩm nào vào thùng</Text>
            </View>
          }
        />

        {/* Nút hoàn thành cố định ở đáy */}
        <View style={styles.bottomBar}>
          <TouchableOpacity
            style={[styles.submitBtn, submitting && styles.submitBtnDisabled]}
            onPress={handleSubmitBox}
            disabled={submitting}
          >
            {submitting ? (
              <ActivityIndicator color="#ffffff" />
            ) : (
              <Text style={styles.submitBtnText}>
                ✓ {t('intrace.btn_confirm_box')} ({scannedProducts.length})
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
    color: '#059669',
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
    borderColor: '#10b981',
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
    backgroundColor: '#ef4444',
    shadowColor: '#ef4444',
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
  boxInput: {
    borderColor: '#059669',
    backgroundColor: '#f0fdf4',
    fontWeight: 'bold',
  },
  addBtn: {
    backgroundColor: '#059669',
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
    backgroundColor: '#059669',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  countBadgeText: {
    color: '#ffffff',
    fontSize: 12,
    fontWeight: 'bold',
  },
  productList: {
    flex: 1,
  },
  productCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    padding: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  productIndex: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#e2e8f0',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 10,
  },
  productIndexText: {
    fontSize: 12,
    fontWeight: 'bold',
    color: '#475569',
  },
  productInfo: {
    flex: 1,
  },
  productCode: {
    fontSize: 15,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  productTime: {
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
    backgroundColor: '#059669',
    height: 48,
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#059669',
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
