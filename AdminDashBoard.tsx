import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View} from 'react-native';

const AdminDashboardScreen = ({navigation}: any) => {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Administrator Panel</Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ManageBooks')}>
        <Text style={styles.buttonText}>Manage Books</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate('ManageOrders')}>
        <Text style={styles.buttonText}>Manage Orders</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.secondaryButton}
        onPress={() => navigation.navigate('Profile')}>
        <Text style={styles.secondaryButtonText}>Profile</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    padding: 24,
  },
  title: {fontSize: 28, fontWeight: '700', marginBottom: 24},
  button: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    marginBottom: 12,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700'},
  secondaryButton: {
    backgroundColor: '#E5E7EB',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  secondaryButtonText: {fontWeight: '700', color: '#111'},
});
