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
import {Book, CartItem, getBooks, saveBooks} from './database';
import {useAppTheme} from './theme';

type OpenLibraryDoc = {
  key?: string;
  title?: string;
  author_name?: string[];
  cover_i?: number;
  first_publish_year?: number;
};


const PROGRAMMING_BOOKS_API =
  'https://openlibrary.org/search.json?q=programming&limit=10';
  
const createStableApiBookId = (doc: OpenLibraryDoc, index: number) => {
  // Use the OpenLibrary key directly as it's guaranteed to be unique
  // Prefix with 'api-' to avoid conflicts with local book IDs
  if (doc.key) {
    return `api-${doc.key}` as any;
  }
  // Fallback for books without keys
  return `api-programming-${index}` as any;
};

const convertApiBookToBook = (doc: OpenLibraryDoc, index: number): Book => {
  const title = doc.title || 'Programming Book';
  const author = doc.author_name?.[0] || 'Unknown Author';

  return {
    id: createStableApiBookId(doc, index),
    title,
    author,
    price: 25 + index * 3,
    stock: 10,
    category: 'Programming API',
    image: doc.cover_i
      ? `https://covers.openlibrary.org/b/id/${doc.cover_i}-M.jpg`
      : 'https://via.placeholder.com/150',
    description: `Imported from Open Library Web API${
      doc.first_publish_year ? `, first published in ${doc.first_publish_year}` : ''
    }.`,
  };
};

const ProductScreen = ({navigation, cart, setCart}: any) => {
  const {theme} = useAppTheme();
  const [books, setBooks] = useState<Book[]>([]);
  const [refreshing, setRefreshing] = useState(false);
  const [cloudStatus, setCloudStatus] = useState('Cloud API: not loaded');

  const loadBooks = async () => {
    setRefreshing(true);

    try {
      const localBooks = await getBooks();

      const response = await fetch(PROGRAMMING_BOOKS_API);

      if (!response.ok) {
        throw new Error('Failed to connect to Open Library API');
      }

      const apiData = await response.json();
      const apiBooks: Book[] = (apiData.docs || [])
        .slice(0, 10)
        .map((doc: OpenLibraryDoc, index: number) =>
          convertApiBookToBook(doc, index),
        );

      const existingTitles = new Set(
        localBooks.map(book => book.title.toLowerCase().trim()),
      );

      const newApiBooks = apiBooks.filter(
        book => !existingTitles.has(book.title.toLowerCase().trim()),
      );

      const mergedBooks = [...localBooks, ...newApiBooks];

      if (newApiBooks.length > 0) {
        await saveBooks(mergedBooks);
      }

      setBooks(mergedBooks);
      setCloudStatus(`Cloud API: ${apiBooks.length} programming books received`);
    } catch (error) {
      const localBooks = await getBooks();
      setBooks(localBooks);
      setCloudStatus('Cloud API: offline, showing local books only');
    } finally {
      setRefreshing(false);
    }
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
      if (existing.quantity >= book.stock) {
        Alert.alert(
          'Stock Limit Reached',
          'You cannot add more of this book than is currently in stock.',
        );
        return;
      }

      const updatedCart = cart.map((item: CartItem) =>
        item.bookId === book.id
          ? {...item, quantity: item.quantity + 1}
          : item,
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

    navigation.navigate('Cart');
  };

  const renderBook = ({item}: {item: Book}) => {
    const itemInCart = cart.find((c: CartItem) => c.bookId === item.id);
    const isOutOfStock = item.stock <= 0;

    const imageSource =
      item.image && typeof item.image === 'string' && item.image.trim() !== ''
        ? {uri: item.image}
        : {uri: 'https://via.placeholder.com/150'};

    return (
      <View
        style={[
          styles.card,
          {backgroundColor: theme.colors.surface, borderColor: theme.colors.border},
        ]}>
        <View
          style={[
            styles.imageContainer,
            {backgroundColor: theme.colors.secondaryBackground},
          ]}>
          <Image source={imageSource} style={styles.image} />

          {item.category === 'Programming API' && (
            <View style={styles.cloudBadge}>
              <Text style={styles.cloudBadgeText}>API</Text>
            </View>
          )}

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
          <Text style={[styles.title, {color: theme.colors.text}]} numberOfLines={2}>
            {item.title}
          </Text>

          <Text
            style={[styles.author, {color: theme.colors.mutedText}]}
            numberOfLines={1}>
            {item.author}
          </Text>

          <View style={styles.infoRow}>
            <View
              style={[
                styles.infoBadge,
                {backgroundColor: theme.colors.secondaryBackground},
              ]}>
              <Text style={[styles.infoBadgeText, {color: theme.colors.text}]}>
                {item.category}
              </Text>
            </View>

            <Text style={[styles.stockInfo, {color: theme.colors.primary}]}>
              {item.stock > 0 ? `${item.stock} left` : 'Out of Stock'}
            </Text>
          </View>

          <Text style={[styles.price, {color: theme.colors.primary}]}>
            RM {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}
          </Text>

          <TouchableOpacity
            style={[
              styles.button,
              {backgroundColor: theme.colors.primary},
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

  const totalItems = cart.reduce(
    (sum: number, item: CartItem) => sum + item.quantity,
    0,
  );

  return (
    <ScrollView
      style={[styles.container, {backgroundColor: theme.colors.background}]}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={loadBooks} />
      }>
      <View
        style={[
          styles.header,
          {backgroundColor: theme.colors.surface, borderBottomColor: theme.colors.border},
        ]}>
        <View>
          <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Books</Text>
          <Text style={[styles.headerSubtitle, {color: theme.colors.mutedText}]}>
            {books.length} available
          </Text>
          <Text style={[styles.apiStatus, {color: theme.colors.primary}]}>
            {cloudStatus}
          </Text>
        </View>

        {cart.length > 0 && (
          <TouchableOpacity
            style={styles.cartHeaderButton}
            onPress={() => navigation.navigate('Cart')}>
            <MaterialCommunityIcons
              name="cart-outline"
              size={24}
              color={theme.colors.primary}
            />

            <View style={styles.cartBadgeHeader}>
              <Text style={styles.cartBadgeHeaderText}>{totalItems}</Text>
            </View>
          </TouchableOpacity>
        )}
      </View>

      <FlatList
        data={books}
        keyExtractor={(item) => item.id.toString()}
        renderItem={renderBook}
         scrollEnabled={false}
       />

      {cart.length > 0 && (
        <TouchableOpacity
          style={[styles.checkoutButton, {backgroundColor: theme.colors.primary}]}
          onPress={() => navigation.navigate('Cart')}>
          <Text style={styles.checkoutText}>
            View Cart ({totalItems} item{totalItems !== 1 ? 's' : ''})
          </Text>
        </TouchableOpacity>
      )}
    </ScrollView>
  );
};

export default ProductScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    padding: 16,
    borderBottomWidth: 1,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  headerTitle: {fontSize: 28, fontWeight: '800'},
  headerSubtitle: {fontSize: 14, marginTop: 4},
  apiStatus: {fontSize: 12, marginTop: 6, fontWeight: '700'},
  cartHeaderButton: {padding: 8, position: 'relative'},
  cartBadgeHeader: {
    position: 'absolute',
    right: 0,
    top: 0,
    backgroundColor: '#EF4444',
    borderRadius: 10,
    minWidth: 20,
    height: 20,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeHeaderText: {color: '#fff', fontSize: 12, fontWeight: '700'},
  card: {
    marginHorizontal: 16,
    marginBottom: 14,
    borderRadius: 16,
    borderWidth: 1,
    overflow: 'hidden',
    flexDirection: 'row',
  },
  imageContainer: {
    width: 120,
    height: 170,
    position: 'relative',
  },
  image: {width: '100%', height: '100%', resizeMode: 'cover'},
  cloudBadge: {
    position: 'absolute',
    left: 8,
    top: 8,
    backgroundColor: '#10B981',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  cloudBadgeText: {color: '#fff', fontSize: 11, fontWeight: '800'},
  outOfStockBadge: {
    position: 'absolute',
    left: 8,
    bottom: 8,
    backgroundColor: '#EF4444',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 10,
  },
  outOfStockText: {color: '#fff', fontSize: 11, fontWeight: '700'},
  cartBadge: {
    position: 'absolute',
    right: 8,
    top: 8,
    backgroundColor: '#4F46E5',
    width: 26,
    height: 26,
    borderRadius: 13,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cartBadgeText: {color: '#fff', fontWeight: '800'},
  content: {flex: 1, padding: 14},
  title: {fontSize: 16, fontWeight: '800', marginBottom: 6},
  author: {fontSize: 13, marginBottom: 10},
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
    justifyContent: 'space-between',
  },
  infoBadge: {paddingHorizontal: 8, paddingVertical: 4, borderRadius: 8, maxWidth: 110},
  infoBadgeText: {fontSize: 11, fontWeight: '700'},
  stockInfo: {fontSize: 12, fontWeight: '700'},
  price: {fontSize: 18, fontWeight: '900', marginBottom: 12},
  button: {
    paddingVertical: 10,
    borderRadius: 10,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
  },
  buttonDisabled: {backgroundColor: '#94A3B8'},
  buttonText: {color: '#fff', fontWeight: '800'},
  checkoutButton: {
    marginHorizontal: 16,
    marginBottom: 24,
    padding: 16,
    borderRadius: 14,
    alignItems: 'center',
  },
  checkoutText: {color: '#fff', fontWeight: '800', fontSize: 16},
});
