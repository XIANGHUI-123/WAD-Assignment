import React, {useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {
  CartItem,
  User,
  addOrder,
  getBooks,
  saveBooks,
  updateUserPoints,
  markVoucherAsUsed,
  getVouchers,
} from './database';
import {useAppTheme} from './theme';

const CartScreen = ({cart, setCart, currentUser, navigation, onOrderSuccess}: any) => {
  const {theme} = useAppTheme();
  const [voucherCode, setVoucherCode] = useState('');
  const [appliedVoucher, setAppliedVoucher] = useState<{code: string; discountType: string; discountValue: number} | null>(null);
  const [usePoints, setUsePoints] = useState(false);
  const [loading, setLoading] = useState(false);

  const subtotal = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0 as number,
  );

  const voucherDiscount = appliedVoucher ? 
    (appliedVoucher.discountType === 'percentage' 
      ? subtotal * (appliedVoucher.discountValue / 100)
      : appliedVoucher.discountValue) : 0;

  const pointsDiscount = usePoints && currentUser?.points >= 200 ? 15 : 0;
  const pointsToSpend = usePoints && currentUser?.points >= 200 ? 200 : 0;
  
  const total = Math.max(0, subtotal - voucherDiscount - pointsDiscount);
  const pointsEarned = Math.floor(total);

  const increaseQty = async (bookId: number) => {
    const books = await getBooks();
    const book = books.find(b => b.id === bookId);
    
    const item = cart.find((i: CartItem) => i.bookId === bookId);
    if (book && item && item.quantity >= book.stock) {
      Alert.alert('Stock Limit Reached', 'You cannot add more of this book than is currently in stock.');
      return;
    }

    const updated = cart.map((item: CartItem) =>
      item.bookId === bookId ? {...item, quantity: item.quantity + 1} : item,
    );
    setCart(updated);
  };

  const decreaseQty = (bookId: number) => {
    const updated = cart
      .map((item: CartItem) =>
        item.bookId === bookId ? {...item, quantity: item.quantity - 1} : item,
      )
      .filter((item: CartItem) => item.quantity > 0);
    setCart(updated);
  };

  const removeItem = (bookId: number) => {
    const updated = cart.filter((item: CartItem) => item.bookId !== bookId);
    setCart(updated);
    Alert.alert('Removed', 'Item removed from cart.');
  };

  const applyVoucher = async () => {
    if (!voucherCode.trim()) {
      Alert.alert('Invalid', 'Please enter a voucher code.');
      return;
    }

    try {
      const vouchers = await getVouchers();
      const voucher = vouchers.find(
        v => {
          const expiryDate = new Date(v.expiryDate);
          expiryDate.setHours(0, 0, 0, 0);

          const today = new Date();
          today.setHours(0, 0, 0, 0);

          return v.code.toUpperCase() === voucherCode.toUpperCase() && 
            !v.isUsed && 
            v.currentUses < v.maxUses &&
            expiryDate >= today;
        }
      );

      if (voucher) {
        setAppliedVoucher({
          code: voucher.code,
          discountType: voucher.discountType,
          discountValue: voucher.discountValue,
        });
        Alert.alert('Success', `${voucher.code} applied! ${voucher.description}`);
        setVoucherCode('');
      } else {
        Alert.alert('Invalid', 'This voucher code is not valid or has been used.');
      }
    } catch (error) {
      Alert.alert('Error', 'Failed to validate voucher.');
    }
  };

  const removeVoucher = () => {
    setAppliedVoucher(null);
    setVoucherCode('');
  };

  const toggleUsePoints = () => {
    if (!usePoints && currentUser?.points < 200) {
      Alert.alert('Insufficient Points', 'You need at least 200 points to redeem a RM15 discount.');
      return;
    }
    setUsePoints(!usePoints);
  };

  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add books before checkout.');
      return;
    }

    if (!currentUser) {
      Alert.alert('Session Expired', 'Please log in again before placing an order.');
      return;
    }

    setLoading(true);

    try {
      const books = await getBooks();

      for (const item of cart) {
        const book = books.find(b => b.id === item.bookId);
        if (!book || book.stock < item.quantity) {
          Alert.alert(
            'Stock Error',
            `${item.title} does not have enough stock available.`,
          );
          setLoading(false);
          return;
        }
      }

      const updatedBooks = books.map(book => {
        const ordered = cart.find((item: CartItem) => item.bookId === book.id);
        if (!ordered) {
          return book;
        }
        return {...book, stock: book.stock - ordered.quantity};
      });

      await saveBooks(updatedBooks);

      let discount = 0;
      if (appliedVoucher) {
        discount += voucherDiscount;
      }
      if (usePoints) {
        discount += pointsDiscount;
      }

      // Add order with all details
      await addOrder({
        id: Date.now(),
        customerId: currentUser.id,
        customerName: currentUser.username,
        items: cart,
        total: subtotal,
        discount: discount,
        finalTotal: total,
        voucherApplied: appliedVoucher?.code,
        pointsUsed: pointsToSpend,
        pointsEarned: pointsEarned,
        status: 'Pending',
        date: new Date().toLocaleString(),
      });

      // Update user points with newly earned points
      await updateUserPoints(currentUser.id, pointsEarned);

      // Mark voucher as used if applied
      if (appliedVoucher) {
        const vouchers = await getVouchers();
        const voucher = vouchers.find(v => v.code === appliedVoucher.code);
        if (voucher) {
          await markVoucherAsUsed(voucher.id);
        }
      }

      // Deduct points if redeemed
      if (pointsToSpend > 0) {
        await updateUserPoints(currentUser.id, -pointsToSpend);
      }

      setCart([]);
      setAppliedVoucher(null);
      setUsePoints(false);
      setLoading(false);

      // Refresh current user in App to update points display
      if (onOrderSuccess) {
        await onOrderSuccess();
      }

      Alert.alert('Success', `Order placed successfully!\nYou earned ${pointsEarned} points!`, [
        {
          text: 'View Orders',
          onPress: () =>
            navigation.navigate('HomeTab', {screen: 'OrderHistory'}),
        },
        {text: 'Continue Shopping', onPress: () => navigation.goBack()},
      ]);
    } catch (error) {
      setLoading(false);
      Alert.alert('Error', 'Failed to place order. Please try again.');
    }
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={cart}
        keyExtractor={item => item.bookId.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons name="cart" size={64} color={theme.colors.mutedText} />
            <Text style={[styles.emptyText, {color: theme.colors.text}]}>Your cart is empty</Text>
            <Text style={[styles.emptySubtext, {color: theme.colors.mutedText}]}>
              Add some books to get started!
            </Text>
            <TouchableOpacity
              style={[styles.browseButton, {backgroundColor: theme.colors.primary}]}
              onPress={() => navigation.goBack()}>
              <Text style={styles.browseButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({item}) => (
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <Image source={{uri: item.image}} style={[styles.image, {backgroundColor: theme.colors.secondaryBackground}]} />
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={[styles.title, {color: theme.colors.text}]} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={[styles.price, {color: theme.colors.primary}]}>RM {item.price.toFixed(2)}</Text>
              <Text style={[styles.subtotal, {color: theme.colors.mutedText}]}>
                Subtotal: RM {(item.price * item.quantity).toFixed(2)}
              </Text>

              <View style={styles.qtyRow}>
                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => decreaseQty(item.bookId)}>
                  <Text style={styles.qtyText}>−</Text>
                </TouchableOpacity>

                <Text style={styles.qtyNumber}>{item.quantity}</Text>

                <TouchableOpacity
                  style={styles.qtyButton}
                  onPress={() => increaseQty(item.bookId)}>
                  <Text style={styles.qtyText}>+</Text>
                </TouchableOpacity>
              </View>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeItem(item.bookId)}>
              <MaterialCommunityIcons name="trash-can" size={20} color="#EF4444" />
            </TouchableOpacity>
          </View>
        )}
        ListFooterComponent={
          cart.length > 0 ? (
            <View style={[styles.footer, {backgroundColor: theme.colors.background}]}>
              {/* Voucher Section */}
              <View style={[styles.promoSection, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
                <Text style={[styles.promoTitle, {color: theme.colors.text}]}>Apply Voucher</Text>
                <View style={styles.voucherInputContainer}>
                  <TextInput
                    style={[styles.voucherInput, {backgroundColor: theme.colors.background, borderColor: theme.colors.border, color: theme.colors.text}]}
                    placeholder="Enter voucher code"
                    placeholderTextColor={theme.colors.mutedText}
                    value={voucherCode}
                    onChangeText={setVoucherCode}
                    editable={!appliedVoucher}
                  />
                  {!appliedVoucher ? (
                    <TouchableOpacity
                      style={styles.applyButton}
                      onPress={applyVoucher}>
                      <Text style={styles.applyButtonText}>Apply</Text>
                    </TouchableOpacity>
                  ) : (
                    <TouchableOpacity
                      style={[styles.applyButton, styles.removeButton]}
                      onPress={removeVoucher}>
                      <Text style={styles.applyButtonText}>Remove</Text>
                    </TouchableOpacity>
                  )}
                </View>
                {appliedVoucher && (
                  <View style={styles.appliedVoucherBadge}>
                    <MaterialCommunityIcons name="check-circle" size={18} color="#10B981" />
                    <Text style={styles.appliedVoucherText}>{appliedVoucher.code} - Applied</Text>
                  </View>
                )}
                <Text style={styles.voucherHint}>Try: SAVE10, SAVE20, or FLAT100</Text>
              </View>

              {/* Points Section */}
              <View style={[styles.promoSection, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
                <View style={styles.pointsHeader}>
                  <Text style={[styles.promoTitle, {color: theme.colors.text}]}>Redeem Points</Text>
                  <Text style={[styles.pointsBalance, {color: theme.colors.primary}]}>Balance: {currentUser?.points || 0}</Text>
                </View>
                <TouchableOpacity
                  style={[styles.pointsToggle, usePoints && styles.pointsToggleActive]}
                  onPress={toggleUsePoints}>
                  <View style={styles.pointsCheckbox}>
                    {usePoints && (
                      <MaterialCommunityIcons name="check" size={16} color="#fff" />
                    )}
                  </View>
                  <View style={{flex: 1}}>
                    <Text style={[styles.pointsToggleText, {color: theme.colors.text}]}>
                      {currentUser?.points >= 200 ? `Redeem 200 points for free book` : 'Not enough points (need 200)'}
                    </Text>
                    {currentUser?.points >= 200 && usePoints && (
                      <Text style={styles.pointsRedeemValue}>RM 15 discount applied</Text>
                    )}
                  </View>
                </TouchableOpacity>
              </View>

              <View style={[styles.divider, {backgroundColor: theme.colors.border}]} />

              {/* Pricing Summary */}
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Subtotal:</Text>
                <Text style={styles.totalItems}>RM {subtotal.toFixed(2)}</Text>
              </View>

              {appliedVoucher && (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountLabel}>Voucher Discount:</Text>
                  <Text style={styles.discountValue}>-RM {voucherDiscount.toFixed(2)}</Text>
                </View>
              )}

              {usePoints && currentUser?.points >= 200 && (
                <View style={styles.discountContainer}>
                  <Text style={styles.discountLabel}>Points Reward:</Text>
                  <Text style={styles.discountValue}>-RM {pointsDiscount.toFixed(2)}</Text>
                </View>
              )}

              <View style={styles.divider} />

              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Items:</Text>
                <Text style={styles.totalItems}>
                  {cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)}
                </Text>
              </View>

              <View style={styles.divider} />

              <View style={styles.totalContainer}>
                <Text style={styles.finalTotalLabel}>Final Total:</Text>
                <Text style={styles.total}>RM {total.toFixed(2)}</Text>
              </View>

              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={placeOrder}
                disabled={loading}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color="#fff"
                  style={{marginRight: 8}}
                />
                <Text style={styles.checkoutText}>{loading ? 'Processing...' : 'Place Order'}</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.continueButton}
                onPress={() => navigation.goBack()}>
                <Text style={styles.continueButtonText}>Continue Shopping</Text>
              </TouchableOpacity>
            </View>
          ) : null
        }
      />
    </View>
  );
};

export default CartScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC', paddingTop: 8},
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 24,
    paddingVertical: 60,
  },
  emptyText: {
    fontSize: 20,
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
  browseButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 10,
    marginTop: 24,
  },
  browseButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 12,
    marginBottom: 10,
    marginHorizontal: 8,
    flexDirection: 'row',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  image: {
    width: 75,
    height: 100,
    borderRadius: 8,
    marginRight: 12,
    backgroundColor: '#F1F5F9',
  },
  title: {
    fontSize: 15,
    fontWeight: '700',
    color: '#1E293B',
  },
  price: {
    marginTop: 4,
    color: '#059669',
    fontWeight: '700',
    fontSize: 14,
  },
  subtotal: {
    marginTop: 2,
    color: '#64748B',
    fontSize: 12,
  },
  qtyRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
  },
  qtyButton: {
    width: 28,
    height: 28,
    borderRadius: 6,
    backgroundColor: '#E2E8F0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  qtyText: {fontSize: 16, fontWeight: '700', color: '#1E293B'},
  qtyNumber: {marginHorizontal: 10, fontSize: 14, fontWeight: '700', color: '#1E293B'},
  deleteButton: {
    justifyContent: 'flex-start',
    paddingTop: 4,
  },
  footer: {
    paddingHorizontal: 16,
    paddingTop: 16,
    paddingBottom: 24,
  },
  promoSection: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 14,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  promoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 10,
  },
  voucherInputContainer: {
    flexDirection: 'row',
    gap: 8,
    marginBottom: 10,
  },
  voucherInput: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#E2E8F0',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 14,
    color: '#1E293B',
    backgroundColor: '#F8FAFC',
  },
  applyButton: {
    backgroundColor: '#4F46E5',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 8,
    justifyContent: 'center',
  },
  removeButton: {
    backgroundColor: '#EF4444',
  },
  applyButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 13,
  },
  appliedVoucherBadge: {
    backgroundColor: '#ECFDF5',
    borderRadius: 8,
    padding: 8,
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: '#DCFCE7',
  },
  appliedVoucherText: {
    color: '#047857',
    fontWeight: '600',
    fontSize: 12,
  },
  voucherHint: {
    fontSize: 11,
    color: '#94A3B8',
    fontStyle: 'italic',
  },
  pointsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  pointsBalance: {
    fontSize: 13,
    fontWeight: '600',
    color: '#F59E0B',
  },
  pointsToggle: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    padding: 12,
    backgroundColor: '#F8FAFC',
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  pointsToggleActive: {
    backgroundColor: '#FEF3C7',
    borderColor: '#F59E0B',
  },
  pointsCheckbox: {
    width: 20,
    height: 20,
    borderRadius: 4,
    backgroundColor: '#4F46E5',
    justifyContent: 'center',
    alignItems: 'center',
  },
  pointsToggleText: {
    fontSize: 13,
    fontWeight: '600',
    color: '#1E293B',
  },
  pointsRedeemValue: {
    fontSize: 11,
    color: '#10B981',
    marginTop: 4,
    fontWeight: '600',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  discountLabel: {
    fontSize: 13,
    color: '#059669',
    fontWeight: '600',
  },
  discountValue: {
    fontSize: 14,
    fontWeight: '700',
    color: '#059669',
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
  },
  finalTotalLabel: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  totalItems: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
  },
  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 12,
  },
  total: {
    fontSize: 24,
    fontWeight: '800',
    color: '#4F46E5',
  },
  checkoutButton: {
    backgroundColor: '#4F46E5',
    padding: 16,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    marginTop: 16,
    opacity: 1,
  },
  checkoutButtonDisabled: {
    opacity: 0.6,
  },
  checkoutText: {color: '#fff', fontWeight: '700', fontSize: 16},
  continueButton: {
    backgroundColor: '#F3F4F6',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 10,
  },
  continueButtonText: {
    color: '#1E293B',
    fontWeight: '700',
    fontSize: 14,
  },
});
