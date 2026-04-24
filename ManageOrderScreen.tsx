import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Order, deleteOrder, getOrders, updateOrder} from '../database';

const ManageOrdersScreen = () => {
  const [orders, setOrders] = useState<Order[]>([]);

  const loadOrders = async () => {
    const data = await getOrders();
    setOrders(data.reverse());
  };

  useFocusEffect(
    useCallback(() => {
      loadOrders();
    }, []),
  );

  const changeStatus = async (
    order: Order,
    status: 'Pending' | 'Completed' | 'Cancelled',
  ) => {
    await updateOrder({...order, status});
    loadOrders();
  };

  const removeOrder = (id: number) => {
    Alert.alert('Delete Order', 'Are you sure you want to delete this order?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteOrder(id);
          loadOrders();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={orders}
        keyExtractor={item => item.id.toString()}
        ListEmptyComponent={
          <Text style={styles.emptyText}>No orders available.</Text>
        }
        renderItem={({item}) => (
          <View style={styles.card}>
            <Text style={styles.title}>Order #{item.id}</Text>
            <Text style={styles.info}>Customer: {item.customerName}</Text>
            <Text style={styles.info}>Date: {item.date}</Text>
            <Text style={styles.info}>Status: {item.status}</Text>
            <Text style={styles.total}>Total: RM {item.total.toFixed(2)}</Text>

            {item.items.map(orderItem => (
              <Text key={orderItem.bookId} style={styles.itemText}>
                • {orderItem.title} x {orderItem.quantity}
              </Text>
            ))}

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.statusButton}
                onPress={() => changeStatus(item, 'Pending')}>
                <Text style={styles.statusText}>Pending</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, {backgroundColor: '#16A34A'}]}
                onPress={() => changeStatus(item, 'Completed')}>
                <Text style={styles.statusText}>Completed</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={[styles.statusButton, {backgroundColor: '#DC2626'}]}
                onPress={() => changeStatus(item, 'Cancelled')}>
                <Text style={styles.statusText}>Cancelled</Text>
              </TouchableOpacity>
            </View>

            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeOrder(item.id)}>
              <Text style={styles.deleteText}>Delete Order</Text>
            </TouchableOpacity>
          </View>
        )}
      />
    </View>
  );
};

export default ManageOrdersScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F9FAFB', padding: 16},
  emptyText: {textAlign: 'center', color: '#777', marginTop: 40},
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  title: {fontSize: 18, fontWeight: '700', color: '#222'},
  info: {marginTop: 4, color: '#555'},
  total: {marginTop: 8, color: '#16A34A', fontWeight: '700'},
  itemText: {marginTop: 6, color: '#444'},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  statusButton: {
    flex: 0.31,
    backgroundColor: '#4F46E5',
    padding: 10,
    borderRadius: 10,
    alignItems: 'center',
  },
  statusText: {color: '#fff', fontWeight: '700', fontSize: 12},
  deleteButton: {
    backgroundColor: '#111827',
    padding: 12,
    borderRadius: 10,
    marginTop: 12,
    alignItems: 'center',
  },
  deleteText: {color: '#fff', fontWeight: '700'},
});
