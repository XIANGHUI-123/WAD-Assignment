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

const OrderHistoryScreen = ({navigation, currentUser}: any) => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const data = await getOrders();

    // 只显示当前用户的订单
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
          <View key={index} style={styles.itemRow}>
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
            RM {item.total.toFixed(2)}
          </Text>
        </View>
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        renderItem={renderItem}
        contentContainerStyle={{padding: 16}}
        ListEmptyComponent={
          <Text style={{textAlign: 'center', marginTop: 50}}>
            No orders found
          </Text>
        }
      />

      {/* ✅ Back Button */}
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => {
          if (navigation.canGoBack()) {
            navigation.goBack();
          } else {
            navigation.navigate('HomeTab');
          }
        }}>
        <Text style={styles.backButtonText}>Back to Home</Text>
      </TouchableOpacity>
    </View>
  );
};

export default OrderHistoryScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F1F5F9',
  },

  card: {
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    marginBottom: 14,
  },

  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 10,
  },

  orderId: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },

  date: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },

  statusBadge: {
    backgroundColor: '#FEF3C7',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 10,
  },

  statusText: {
    color: '#B45309',
    fontWeight: '600',
    fontSize: 12,
  },

  sectionTitle: {
    marginTop: 10,
    marginBottom: 6,
    fontWeight: '600',
    color: '#334155',
  },

  itemRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },

  itemName: {
    flex: 1,
    color: '#1E293B',
  },

  itemQty: {
    width: 40,
    textAlign: 'center',
    color: '#64748B',
  },

  itemPrice: {
    width: 80,
    textAlign: 'right',
    color: '#059669',
    fontWeight: '600',
  },

  divider: {
    height: 1,
    backgroundColor: '#E2E8F0',
    marginVertical: 10,
  },

  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },

  totalLabel: {
    fontWeight: '600',
    color: '#475569',
  },

  totalValue: {
    fontWeight: '800',
    color: '#4F46E5',
  },

  backButton: {
    margin: 16,
    backgroundColor: '#4F46E5',
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
