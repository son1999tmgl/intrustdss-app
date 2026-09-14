import React, { useState, useEffect, useCallback } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ActivityIndicator,
  RefreshControl,
  SafeAreaView,
} from 'react-native';
import { useTranslation } from '@superapp/core-i18n';
import { DateService, hapticService } from '@superapp/core-services';
import { ContainerItem } from '@superapp/core-contracts';
import { containerService } from '../services/container.service';

interface ContainerListScreenProps {
  onBack: () => void;
  onOpenScan: () => void;
}

export function ContainerListScreen({ onBack, onOpenScan }: ContainerListScreenProps) {
  const { t } = useTranslation();
  const [containers, setContainers] = useState<ContainerItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchContainers = useCallback(async (keyword = '') => {
    try {
      setLoading(true);
      const res = await containerService.getContainers({ keyword, limit: 30 });
      setContainers(res.containers);
    } catch (err) {
      console.warn('Lỗi tải danh sách công:', err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, []);

  useEffect(() => {
    fetchContainers();
  }, [fetchContainers]);

  const handleRefresh = () => {
    setRefreshing(true);
    fetchContainers(searchQuery);
  };

  const handleSearch = (text: string) => {
    setSearchQuery(text);
    fetchContainers(text);
  };

  const renderItem = ({ item }: { item: ContainerItem }) => (
    <View style={styles.card}>
      <View style={styles.cardHeader}>
        <View style={styles.codeWrap}>
          <Text style={styles.icon}>🚛</Text>
          <Text style={styles.codeText}>{item.code}</Text>
        </View>
        <View style={styles.badge}>
          <Text style={styles.badgeText}>Đang vận chuyển</Text>
        </View>
      </View>

      <View style={styles.cardBody}>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('intrace.box_count')}:</Text>
          <Text style={styles.infoValueHighlight}>{item.total_boxes ?? 0}</Text>
        </View>
        <View style={styles.infoRow}>
          <Text style={styles.infoLabel}>{t('intrace.created_at')}:</Text>
          <Text style={styles.infoValue}>{DateService.formatDateTime(item.created_at)}</Text>
        </View>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity style={styles.backBtn} onPress={onBack}>
          <Text style={styles.backBtnText}>‹ {t('common.back')}</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{t('intrace.container_list_title')}</Text>
        <TouchableOpacity
          style={styles.addBtn}
          onPress={() => {
            hapticService.light();
            onOpenScan();
          }}
        >
          <Text style={styles.addBtnText}>+ {t('intrace.btn_create_container')}</Text>
        </TouchableOpacity>
      </View>

      {/* Search Input */}
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder={t('common.search') + ' mã công...'}
          placeholderTextColor="#94a3b8"
          value={searchQuery}
          onChangeText={handleSearch}
          clearButtonMode="while-editing"
        />
      </View>

      {/* List Content */}
      {loading && !refreshing ? (
        <View style={styles.centerLoading}>
          <ActivityIndicator size="large" color="#0369a1" />
          <Text style={styles.loadingText}>{t('common.loading')}</Text>
        </View>
      ) : (
        <FlatList
          data={containers}
          keyExtractor={(item) => item.id || item.code}
          renderItem={renderItem}
          contentContainerStyle={styles.listContent}
          refreshControl={
            <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} colors={['#0369a1']} />
          }
          ListEmptyComponent={
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyIcon}>🚛</Text>
              <Text style={styles.emptyText}>{t('common.no_data')}</Text>
            </View>
          }
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
    color: '#0369a1',
    fontWeight: '600',
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  addBtn: {
    backgroundColor: '#0369a1',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 8,
  },
  addBtnText: {
    color: '#ffffff',
    fontSize: 13,
    fontWeight: 'bold',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#ffffff',
    margin: 16,
    marginBottom: 8,
    paddingHorizontal: 12,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#e2e8f0',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 14,
    color: '#0f172a',
  },
  listContent: {
    padding: 16,
    paddingTop: 8,
    gap: 12,
  },
  card: {
    backgroundColor: '#ffffff',
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: '#e2e8f0',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  cardHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderBottomWidth: 1,
    borderBottomColor: '#f1f5f9',
    paddingBottom: 10,
  },
  codeWrap: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  icon: {
    fontSize: 20,
  },
  codeText: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#0f172a',
  },
  badge: {
    backgroundColor: '#e0f2fe',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  badgeText: {
    fontSize: 11,
    fontWeight: 'bold',
    color: '#0369a1',
  },
  cardBody: {
    paddingTop: 10,
    gap: 6,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  infoLabel: {
    fontSize: 13,
    color: '#64748b',
  },
  infoValue: {
    fontSize: 13,
    color: '#334155',
    fontWeight: '500',
  },
  infoValueHighlight: {
    fontSize: 15,
    color: '#0369a1',
    fontWeight: 'bold',
  },
  centerLoading: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    marginTop: 8,
    fontSize: 13,
    color: '#64748b',
  },
  emptyContainer: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 60,
  },
  emptyIcon: {
    fontSize: 48,
    marginBottom: 12,
  },
  emptyText: {
    fontSize: 15,
    color: '#94a3b8',
  },
});
