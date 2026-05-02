import React, {useCallback, useState} from 'react';
import {
  View,
  Text,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {getOrders, Order} from './database';
import {useAppTheme} from './theme';

const OrderHistoryScreen = ({navigation, currentUser}: any) => {
  const [orders, setOrders] = useState<Order[]>([]);
  const {theme} = useAppTheme();

  const loadOrders = async () => {
    const data = await getOrders();

    
    const userOrders = data.filter(
      order => order.customerId === currentUser?.id,
    );

    setOrders(userOrders.reverse());
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, []),
  );

  const renderItem = ({item}: {item: Order}) => {
    return (
      <View style={styles.card}>
        <View style={styles.header}>
          <View>
            <Text style={styles.orderId}>Order #{item.id}</Text>
            <Text style={styles.date}>{item.date}</Text>
          </View>

          <View style={styles.statusBadge}>
            <Text style={styles.statusText}>{item.status}</Text>
          </View>
        </View>

        <Text style={styles.sectionTitle}>Items ({item.items.length})</Text>

        {item.items.map((book: any, index: number) => (
          <View key={`${item.id}-${book.bookId || index}`} style={styles.itemRow}>
            <Text style={styles.itemName}>{book.title}</Text>
            <Text style={styles.itemQty}>x{book.quantity}</Text>
            <Text style={styles.itemPrice}>
              RM {(book.price * book.quantity).toFixed(2)}
            </Text>
          </View>
        ))}

        <View style={styles.divider} />

        <View style={styles.totalRow}>
          <Text style={styles.totalLabel}>Order Total:</Text>
          <Text style={styles.totalValue}>
            RM {(item.finalTotal ?? item.total).toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 50, color: theme.colors.mutedText}}>
            No orders found
          </Text>
        }
      />
     
      <TouchableOpacity
  style={[styles.backButton, {backgroundColor: theme.colors.primary}]}
  onPress={() => navigation.navigate('HomeTab')}>
  <Text style={styles.backButtonText}>Back</Text>
</TouchableOpacity>
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  card: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
    borderWidth: 1,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '700',
  },

  date: {
    fontSize: 12,
    marginTop: 2,
  },

  statusBadge: {
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
    borderWidth: 1,
  },

  statusText: {
    fontWeight: '600',
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  itemName: {
    flex: 1,
  },

  itemQty: {
    width: 40,
    textAlign: 'center',
  },

  itemPrice: {
    width: 80,
    textAlign: 'right',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    marginVertical: 10,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontWeight: '600',
  },

  totalValue: {
    fontWeight: '800',
  },

  backButton: {
    margin: 16,
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },

  backButtonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 16,
  },
});
