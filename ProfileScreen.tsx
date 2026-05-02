import React from 'react';
import {StyleSheet, Text, TouchableOpacity, View, ScrollView} from 'react-native';
import {logoutUser} from './database';
import {useAppTheme} from './theme';

const ProfileScreen = ({currentUser, onLogout, navigation}: any) => {
  const {theme} = useAppTheme();
  const handleLogout = async () => {
    await logoutUser();
    onLogout();
  };

  // Helper component for list items to keep code DRY
  const MenuLink = ({label, onPress, icon = "→"}: {label: string; onPress: () => void; icon?: string}) => (
    <TouchableOpacity style={styles.menuItem} onPress={onPress}>
      <Text style={styles.menuText}>{label}</Text>
      <Text style={styles.menuArrow}>{icon}</Text>
    </TouchableOpacity>
  );

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]}>
      {/* Header Section with Avatar */}
      <View style={styles.headerSection}>
        <View style={[styles.avatar, {backgroundColor: theme.colors.primary}]}>
          <Text style={[styles.avatarText, {color: '#fff'}]}>
            {currentUser?.username?.charAt(0).toUpperCase() || 'U'}
          </Text>
        </View>
        <Text style={[styles.userName, {color: theme.colors.text}]}>{currentUser?.username}</Text>
        <View style={[styles.roleBadge, {backgroundColor: theme.colors.secondaryBackground}]}>
          <Text style={[styles.roleText, {color: theme.colors.primary}]}>{currentUser?.role?.toUpperCase()}</Text>
        </View>
      </View>

      {/* General Section */}
      <Text style={[styles.sectionTitle, {color: theme.colors.mutedText}]}>Account Settings</Text>
      <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
       <MenuLink label="Order History"onPress={() =>navigation.navigate('ManageOrdersMain')}
/>
        <View style={styles.divider} />
        <MenuLink label="Settings" onPress={() => navigation.navigate('Settings')} />
        
        
      </View>

      {/* Admin Section (Conditional) */}
      {currentUser?.role === 'admin' && (
        <>
          <Text style={[styles.sectionTitle, {color: theme.colors.mutedText}]}>Administrator Controls</Text>
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <MenuLink label="Manage Books Catalog" onPress={() => navigation.navigate('ManageBooks')} />
            <View style={styles.divider} />
            <MenuLink label="Manage All Orders" onPress={() => navigation.navigate('ManageOrdersMain')} />
            
          </View>
        </>
      )}

      {/* Logout Action */}
      <TouchableOpacity style={styles.logoutButton} onPress={handleLogout}>
        <Text style={styles.logoutText}>Logout</Text>
      </TouchableOpacity>
      
      <Text style={[styles.footerVersion, {color: theme.colors.mutedText}]}>App Version 1.0.4 (Production)</Text>
    </ScrollView>
  );
};

export default ProfileScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  
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
  avatarText: {fontSize: 32, fontWeight: 'bold'},
  userName: {fontSize: 22, fontWeight: '700'},
  roleBadge: {
    paddingHorizontal: 12, 
    paddingVertical: 4, 
    borderRadius: 20, 
    marginTop: 6
  },
  roleText: {fontSize: 12, fontWeight: '600'},

  // List Card Styles
  sectionTitle: {fontSize: 14, fontWeight: '600', marginBottom: 8, marginLeft: 4},
  card: {
    borderRadius: 16,
    paddingVertical: 8,
    marginBottom: 24,
    borderWidth: 1,
    shadowColor: '#f7efef',
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
  menuText: {fontSize: 16, fontWeight: '500'},
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
