import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  RefreshControl,
  ScrollView,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {Book, CartItem, getBooks} from './database';

const ProductScreen = ({navigation, cart, setCart}: any) => {
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, []),
  );

  const addToCart = (book: Book) => {
    if (book.stock <= 0) {
      Alert.alert('Out of stock', 'This book is currently unavailable.');
      return;
    }

    const existing = cart.find((item: CartItem) => item.bookId === book.id);

    if (existing) {
      const updatedCart = cart.map((item: CartItem) =>
        item.bookId === book.id ? {...item, quantity: item.quantity + 1} : item,
      );
      setCart(updatedCart);
    } else {
      const newItem: CartItem = {
        bookId: book.id,
        title: book.title,
        price: book.price,
        quantity: 1,
        image: book.image,
      };
      setCart([...cart, newItem]);
    }

    Alert.alert('Added', `${book.title} added to cart.`);
  };

  const renderBook = ({item}: {item: Book}) => {
    const itemInCart = cart.find((c: CartItem) => c.bookId === item.id);
    const isOutOfStock = item.stock <= 0;

    return (
      <View style={styles.card}>
        <View style={styles.imageContainer}>
          <Image source={{uri: item.image}} style={styles.image} />
          {isOutOfStock && (
            <View style={styles.outOfStockBadge}>
              <Text style={styles.outOfStockText}>Out of Stock</Text>
            </View>
          )}
          {itemInCart && (
            <View style={styles.cartBadge}>
              <Text style={styles.cartBadgeText}>{itemInCart.quantity}</Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.title} numberOfLines={2}>
            {item.title}
          </Text>
          <Text style={styles.author} numberOfLines={1}>
            {item.author}
          </Text>

          <View style={styles.infoRow}>
            <View style={styles.infoBadge}>
              <Text style={styles.infoBadgeText}>{item.category}</Text>
            </View>
            <Text style={styles.stockInfo}>
              {item.stock > 0 ? `${item.stock} left` : 'Out of Stock'}
            </Text>
          </View>

          <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>

          <TouchableOpacity
            style={[
              styles.button,
              isOutOfStock && styles.buttonDisabled,
            ]}
            onPress={() => addToCart(item)}
            disabled={isOutOfStock}>
            <MaterialCommunityIcons
              name={itemInCart ? 'plus-circle' : 'cart-outline'}
              size={18}
              color="#fff"
              style={{marginRight: 6}}
            />
            <Text style={styles.buttonText}>
              {itemInCart ? 'Add More' : 'Add to Cart'}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    );
  };

  return (
    <ScrollView
      style={styles.container}
      refreshControl={
        <RefreshControl refreshing={false} onRefresh={loadBooks} />
      }>
      <View style={styles.header}>
        <View>
          <Text style={styles.headerTitle}>Books</Text>
          <Text style={styles.headerSubtitle}>{books.length} available</Text>
        </View>

        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.cartHeaderButton}
            onPress={() => navigation.navigate('Cart')}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color="#4F46E5"
            />
            <View style={styles.cartBadgeHeader}>
              <Text style={styles.cartBadgeHeaderText}>{cart.length}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={renderBook}
        scrollEnabled={false}
        contentContainerStyle={{paddingTop: 12, paddingBottom: 12}}
      />

      {cart.length > 0 && (
        <TouchableOpacity
          style={styles.cartButton}
          onPress={() => navigation.navigate('Cart')}>
          <MaterialCommunityIcons
            name="cart-outline"
            size={20}
            color="#fff"
            style={{marginRight: 10}}
          />
          <Text style={styles.cartButtonText}>
            View Cart ({cart.reduce((sum: number, item: CartItem) => sum + item.quantity, 0)} items)
          </Text>
        </TouchableOpacity>
      )}

      <View style={{height: 20}} />
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC'},
  header: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    backgroundColor: '#fff',
    borderBottomWidth: 1,
    borderBottomColor: '#E2E8F0',
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  headerSubtitle: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 4,
  },
  cartHeaderButton: {
    position: 'relative',
    padding: 10,
  },
  cartBadgeHeader: {
    position: 'absolute',
    top: 0,
    right: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeHeaderText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    marginBottom: 12,
    marginHorizontal: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: '#E2E8F0',
    flexDirection: 'row',
  },
  imageContainer: {
    position: 'relative',
    width: 100,
    height: 140,
    backgroundColor: '#F1F5F9',
  },
  image: {
    width: '100%',
    height: '100%',
    resizeMode: 'cover',
  },
  outOfStockBadge: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0,0,0,0.6)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  outOfStockText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 11,
    textAlign: 'center',
  },
  cartBadge: {
    position: 'absolute',
    top: 6,
    right: 6,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 24,
    height: 24,
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartBadgeText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  content: {
    flex: 1,
    padding: 12,
    justifyContent: 'space-between',
  },
  title: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  author: {
    color: '#64748B',
    marginTop: 2,
    fontSize: 12,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 8,
    gap: 8,
  },
  infoBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  infoBadgeText: {
    fontSize: 11,
    color: '#4F46E5',
    fontWeight: '600',
  },
  stockInfo: {
    fontSize: 11,
    color: '#16A34A',
    fontWeight: '600',
  },
  price: {
    marginTop: 8,
    fontSize: 16,
    fontWeight: '800',
    color: '#059669',
  },
  button: {
    marginTop: 8,
    backgroundColor: '#4F46E5',
    padding: 8,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {
    backgroundColor: '#CBD5E1',
    opacity: 0.6,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 12,
  },
  cartButton: {
    marginHorizontal: 12,
    marginBottom: 16,
    backgroundColor: '#059669',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  cartButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 15,
  },
});
