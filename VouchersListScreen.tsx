import React, {useEffect, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  RefreshControl,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {getAvailableVouchers, Voucher} from './database';

const VouchersListScreen = ({navigation}: any) => {
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      const availableVouchers = await getAvailableVouchers();
      setVouchers(availableVouchers);
    } catch (error) {
      Alert.alert('Error', 'Failed to load vouchers');
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  const onRefresh = async () => {
    setRefreshing(true);
    await loadVouchers();
  };

  const copyToClipboard = (code: string) => {
    Alert.alert('Copied', `Voucher code "${code}" copied! You can use it during checkout.`);
  };

  const getDiscountText = (voucher: Voucher): string => {
    if (voucher.discountType === 'percentage') {
      return `${voucher.discountValue}% OFF`;
    } else {
      return `RM ${voucher.discountValue} OFF`;
    }
  };

  const getRemainingUsesText = (voucher: Voucher): string => {
    const remaining = voucher.maxUses - voucher.currentUses;
    if (remaining <= 0) {
      return 'Fully redeemed';
    } else if (remaining <= 10) {
      return `Only ${remaining} left!`;
    } else {
      return `${remaining} available`;
    }
  };

  if (loading) {
    return (
      <View style={styles.container}>
        <Text style={styles.loadingText}>Loading vouchers...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <FlatList
        data={vouchers}
        keyExtractor={item => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="ticket-outline"
              size={64}
              color="#CBD5E1"
            />
            <Text style={styles.emptyText}>No vouchers available</Text>
            <Text style={styles.emptySubtext}>
              Check back later for more deals!
            </Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.voucherCard}>
            <View style={styles.voucherLeft}>
              <View style={styles.discountBadge}>
                <Text style={styles.discountText}>{getDiscountText(item)}</Text>
              </View>
              <View style={{flex: 1, marginLeft: 12}}>
                <Text style={styles.voucherCode}>{item.code}</Text>
                <Text style={styles.voucherDescription}>{item.description}</Text>
                <View style={styles.voucherMeta}>
                  <MaterialCommunityIcons name="calendar" size={12} color="#94A3B8" />
                  <Text style={styles.voucherMetaText}>Expires: {item.expiryDate}</Text>
                </View>
                <Text style={styles.remainingText}>{getRemainingUsesText(item)}</Text>
              </View>
            </View>
            <TouchableOpacity
              style={styles.copyButton}
              onPress={() => copyToClipboard(item.code)}>
              <MaterialCommunityIcons name="content-copy" size={20} color="#4F46E5" />
            </TouchableOpacity>
          </View>
        )}
        contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 16}}
        ItemSeparatorComponent={() => <View style={{height: 8}} />}
      />
      <View style={styles.footer}>
        <View style={styles.footerInfo}>
          <MaterialCommunityIcons name="information" size={18} color="#4F46E5" />
          <Text style={styles.footerText}>
            Copy a voucher code and apply it during checkout to get your discount!
          </Text>
        </View>
        <TouchableOpacity
          style={styles.goToCheckoutButton}
          onPress={() => navigation.navigate('ProductTab', {screen: 'Cart'})}>
          <MaterialCommunityIcons
            name="shopping-cart"
            size={20}
            color="#fff"
            style={{marginRight: 8}}
          />
          <Text style={styles.goToCheckoutText}>Go to Cart</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VouchersListScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
  },
  loadingText: {
    fontSize: 16,
    color: '#64748B',
    textAlign: 'center',
    marginTop: 50,
  },
  emptyContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    color: '#64748B',
    marginTop: 8,
    textAlign: 'center',
  },
  voucherCard: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 8,
    elevation: 2,
  },
  voucherLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  discountBadge: {
    backgroundColor: '#FEF3C7',
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderWidth: 2,
    borderColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
    minWidth: 80,
  },
  discountText: {
    fontSize: 13,
    fontWeight: '800',
    color: '#D97706',
    textAlign: 'center',
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: '800',
    color: '#1E293B',
    letterSpacing: 1,
  },
  voucherDescription: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  voucherMeta: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    marginTop: 6,
  },
  voucherMetaText: {
    fontSize: 11,
    color: '#94A3B8',
  },
  remainingText: {
    fontSize: 11,
    color: '#10B981',
    fontWeight: '600',
    marginTop: 4,
  },
  copyButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: '#fff',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
    borderTopColor: '#E2E8F0',
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#EEF2FF',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  footerText: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '500',
    flex: 1,
  },
  goToCheckoutButton: {
    backgroundColor: '#4F46E5',
    borderRadius: 10,
    paddingHorizontal: 16,
    paddingVertical: 14,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  goToCheckoutText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
});
