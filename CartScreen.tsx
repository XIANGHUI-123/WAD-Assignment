import React from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {CartItem, User, addOrder, getBooks, saveBooks} from './database';

const CartScreen = ({cart, setCart, currentUser, navigation}: any) => {
  const total = cart.reduce(
    (sum: number, item: CartItem) => sum + item.price * item.quantity,
    0 as number,
  );

  const increaseQty = (bookId: number) => {
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

  const placeOrder = async () => {
    if (cart.length === 0) {
      Alert.alert('Cart Empty', 'Please add books before checkout.');
      return;
    }

    const books = await getBooks();

    for (const item of cart) {
      const book = books.find(b => b.id === item.bookId);
      if (!book || book.stock < item.quantity) {
        Alert.alert(
          'Stock Error',
          `${item.title} does not have enough stock available.`,
        );
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

    await addOrder({
      id: Date.now(),
      customerId: currentUser.id,
      customerName: currentUser.username,
      items: cart,
      total,
      status: 'Pending',
      date: new Date().toLocaleString(),
    });

    setCart([]);
    Alert.alert('Success', 'Order placed successfully!', [
      {
        text: 'View Orders',
        onPress: () =>
          navigation.navigate('HomeTab', {screen: 'OrderHistory'}),
      },
      {text: 'Continue Shopping', onPress: () => navigation.goBack()},
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={cart}
        keyExtractor={item => item.bookId.toString()}
        ListEmptyComponent={
          <View style={styles.emptyContainer}>
            <MaterialCommunityIcons
              name="cart"
              size={64}
              color="#CBD5E1"
            />
            <Text style={styles.emptyText}>Your cart is empty</Text>
            <Text style={styles.emptySubtext}>
              Add some books to get started!
            </Text>
            <TouchableOpacity
              style={styles.browseButton}
              onPress={() => navigation.goBack()}>
              <Text style={styles.browseButtonText}>Continue Shopping</Text>
            </TouchableOpacity>
          </View>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.image} />
            <View style={{flex: 1, marginRight: 8}}>
              <Text style={styles.title} numberOfLines={2}>
                {item.title}
              </Text>
              <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>
              <Text style={styles.subtotal}>
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
            <View style={styles.footer}>
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Total Items:</Text>
                <Text style={styles.totalItems}>
                  {cart.reduce((sum, item) => sum + item.quantity, 0)}
                </Text>
              </View>
              <View style={styles.divider} />
              <View style={styles.totalContainer}>
                <Text style={styles.totalLabel}>Order Total:</Text>
                <Text style={styles.total}>RM {total.toFixed(2)}</Text>
              </View>
              <TouchableOpacity
                style={styles.checkoutButton}
                onPress={placeOrder}>
                <MaterialCommunityIcons
                  name="check-circle"
                  size={22}
                  color="#fff"
                  style={{marginRight: 8}}
                />
                <Text style={styles.checkoutText}>Place Order</Text>
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
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  totalLabel: {
    fontSize: 14,
    color: '#64748B',
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
