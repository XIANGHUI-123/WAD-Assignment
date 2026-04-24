import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {logoutUser} from './database';

const ProfileScreen = ({currentUser, onLogout, navigation}: any) => {
  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  // Helper component for list items to keep code DRY
  const MenuLink = ({label, onPress, icon = "→"}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{label}</Text>
      <Text style={styles.menuArrow}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={styles.container}>
      {/* Header Section with Avatar */}
      <View style={styles.headerSection}>
        <View style={styles.avatar}>
          <Text style={styles.avatarText}>
            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={styles.userName}>{currentUser?.username}</Text>
        <View style={styles.roleBadge}>
          <Text style={styles.roleText}>{currentUser?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* General Section */}
      <Text style={styles.sectionTitle}>Account Settings</Text>
      <View style={styles.card}>
        <MenuLink label="Order History" onPress={() => navigation.navigate('OrderHistory')} />
        <View style={styles.divider} />
        <MenuLink label="Settings" onPress={() => navigation.navigate('Settings')} />
        <View style={styles.divider} />
        <MenuLink label="Notifications" onPress={() => {}} />
      </View>

      {/* Admin Section (Conditional) */}
      {currentUser?.role === 'admin' && (
        <>
          <Text style={styles.sectionTitle}>Administrator Controls</Text>
          <View style={styles.card}>
            <MenuLink label="Manage Books Catalog" onPress={() => navigation.navigate('ManageBooks')} />
            <View style={styles.divider} />
            <MenuLink label="Manage All Orders" onPress={() => navigation.navigate('ManageOrders')} />
            
          </View>
        </>
      )}

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={styles.footerVersion}>App Version 1.0.4 (Production)</Text>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, backgroundColor: '#F8FAFC', padding: 20},
  
  // Header Styles
  headerSection: {alignItems: 'center', marginVertical: 30},
  avatar: {
    width: 80, 
    height: 80, 
    borderRadius: 40, 
    backgroundColor: '#3B82F6', 
    justifyContent: 'center', 
    alignItems: 'center',
    marginBottom: 12,
    elevation: 3,
  },
  avatarText: {color: '#fff', fontSize: 32, fontWeight: 'bold'},
  userName: {fontSize: 22, fontWeight: '700', color: '#1E293B'},
  roleBadge: {
    backgroundColor: '#E2E8F0', 
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 20, 
    marginTop: 6
  },
  roleText: {fontSize: 12, fontWeight: '600', color: '#64748B'},

  // List Card Styles
  sectionTitle: {fontSize: 14, fontWeight: '600', color: '#94A3B8', marginBottom: 8, marginLeft: 4},
  card: {
    backgroundColor: '#fff',
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 10,
    elevation: 2,
  },
  menuItem: {
    flexDirection: 'row', 
    justifyContent: 'space-between', 
    padding: 16, 
    alignItems: 'center'
  },
  menuText: {fontSize: 16, color: '#334155', fontWeight: '500'},
  menuArrow: {fontSize: 18, color: '#CBD5E1'},
  divider: {height: 1, backgroundColor: '#F1F5F9', marginHorizontal: 16},

  // Button Styles
  logoutButton: {
    backgroundColor: '#EF4444',
    padding: 16,
    borderRadius: 12,
    alignItems: 'center',
    marginTop: 10,
  },
  logoutText: {color: '#fff', fontWeight: '700', fontSize: 16},
  footerVersion: {textAlign: 'center', color: '#94A3B8', fontSize: 12, marginTop: 24, marginBottom: 40},
});
