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
import {useAppTheme} from './theme';

const VouchersListScreen = ({navigation}: any) => {
  const {theme} = useAppTheme();
  const [vouchers, setVouchers] = useState<Voucher[]>([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  useEffect(() => {
    loadVouchers();
  }, []);

  const loadVouchers = async () => {
    try {
      setLoading(true);
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
  }
  return `RM ${voucher.discountValue} OFF`;
};

const getRemainingUsesText = (voucher: Voucher): string => {
  const remaining = voucher.maxUses - voucher.currentUses;

  if (remaining <= 0) {
    return 'Fully redeemed';
  }

  if (remaining <= 10) {
    return `Only ${remaining} left!`;
  }

  return `${remaining} available`;
};
  if (loading) {
    return (
      <View style={[styles.container, {backgroundColor: theme.colors.background}]}> 
        <Text style={[styles.loadingText, {color: theme.colors.mutedText}]}>Loading vouchers...</Text>
      </View>
    );
  }

  // FlatList for displaying vouchers
  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}> 
      {/* Header with Back Button */}
      <View style={{ flexDirection: 'row', alignItems: 'center', padding: 16, backgroundColor: theme.colors.background }}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={{ marginRight: 8 }}>
          <MaterialCommunityIcons name="arrow-left" size={24} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={{ fontSize: 20, fontWeight: 'bold', color: theme.colors.text }}>Available Vouchers</Text>
      </View>
      {/* FlatList for vouchers */}
      <FlatList
        data={vouchers}
        keyExtractor={(item) => item.id.toString()}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={onRefresh} />
        }
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="ticket-outline"
              size={64}
              color={theme.colors.mutedText}
            />
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>No vouchers available</Text>
            <Text style={[styles.emptySubtext, {color: theme.colors.mutedText}]}>Check back later for more deals!</Text>
          </View>
        }
        renderItem={({item}) => (
          <View style={[styles.voucherCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}> 
            <View style={styles.voucherLeft}> 
              <View style={styles.discountBadge}> 
                <Text style={styles.discountText}>{getDiscountText(item)}</Text> 
              </View> 
              <View style={{flex: 1, marginLeft: 12}}> 
                <Text style={[styles.voucherCode, {color: theme.colors.text}]}>{item.code}</Text> 
                <Text style={[styles.voucherDescription, {color: theme.colors.mutedText}]}>{item.description}</Text> 
                <View style={styles.voucherMeta}> 
                  <MaterialCommunityIcons name="calendar" size={12} color="#94A3B8" /> 
                  <Text style={[styles.voucherMetaText, {color: theme.colors.mutedText}]}>Expires: {item.expiryDate}</Text> 
                </View> 
                <Text style={[styles.remainingText, {color: theme.colors.primary}]}>{getRemainingUsesText(item)}</Text> 
              </View> 
            </View> 
            <TouchableOpacity 
              style={styles.copyButton} 
              onPress={() => copyToClipboard(item.code)}> 
              <MaterialCommunityIcons name="content-copy" size={20} color={theme.colors.primary} /> 
            </TouchableOpacity> 
          </View>
        )}
        contentContainerStyle={{paddingHorizontal: 16, paddingVertical: 16}}
        ItemSeparatorComponent={() => <View style={{height: 8}} />} 
      />
      {/* Footer */}
      <View style={[styles.footer, {backgroundColor: theme.colors.surface, borderTopColor: theme.colors.border}]}> 
        <View style={[styles.footerInfo, {backgroundColor: theme.colors.secondaryBackground}]}> 
          <MaterialCommunityIcons name="information" size={18} color={theme.colors.primary} /> 
          <Text style={[styles.footerText, {color: theme.colors.primary}]}> 
            Copy a voucher code and apply it during checkout to get your discount! 
          </Text> 
        </View> 
        <TouchableOpacity 
          style={[styles.goToCheckoutButton, {backgroundColor: theme.colors.primary}]} 
          onPress={() => navigation.navigate('ProductTab', {screen: 'Cart'})}> 
          <MaterialCommunityIcons 
            name="cart" 
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
  },
  loadingText: {
    fontSize: 16,
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
    marginTop: 16,
  },
  emptySubtext: {
    fontSize: 14,
    marginTop: 8,
    textAlign: 'center',
  },
  voucherCard: {
    borderRadius: 14,
    padding: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
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
    textAlign: 'center',
  },
  voucherCode: {
    fontSize: 16,
    fontWeight: '800',
    letterSpacing: 1,
  },
  voucherDescription: {
    fontSize: 12,
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
  },
  remainingText: {
    fontSize: 11,
    fontWeight: '600',
    marginTop: 4,
  },
  copyButton: {
    padding: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderTopWidth: 1,
  },
  footerInfo: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
    gap: 10,
  },
  footerText: {
    fontSize: 12,
    fontWeight: '500',
    flex: 1,
  },
  goToCheckoutButton: {
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
