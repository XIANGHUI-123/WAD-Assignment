import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, TouchableOpacity, View, ScrollView, SafeAreaView } from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { DrawerNavigationProp } from '@react-navigation/drawer';
import {useAppTheme} from '../theme';
import { getBooks, getOrders, getUsers } from '../database';

type AdminDashboardScreenProps = {
  navigation: DrawerNavigationProp<any>;
};

const AdminDashboardScreen = ({ navigation }: AdminDashboardScreenProps) => {
  const {theme} = useAppTheme();
  const [stats, setStats] = useState({
    totalBooks: 0,
    totalOrders: 0,
    totalUsers: 0,
    totalRevenue: 0,
    pendingOrders: 0,
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const books = await getBooks();
        const orders = await getOrders();
        const users = await getUsers();

        const totalRevenue = orders.reduce((sum, order) => sum + (order.finalTotal || order.total), 0);
        const pendingOrders = orders.filter(order => order.status === 'Pending').length;

        setStats({
          totalBooks: books.length,
          totalOrders: orders.length,
          totalUsers: users.length,
          totalRevenue,
          pendingOrders,
        });
      } catch (error) {
        console.error('Failed to fetch stats:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStats();
  }, []);

  const StatCard = ({ title, value, icon, color, onPress }: any) => (
    <TouchableOpacity
      style={[styles.statCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}
      onPress={onPress}
      activeOpacity={0.7}>
      <View style={[styles.statIconContainer, {backgroundColor: color + '20'}]}>
        <MaterialCommunityIcons name={icon} size={28} color={color} />
      </View>
      <View style={styles.statContent}>
        <Text style={[styles.statTitle, {color: theme.colors.mutedText}]}>{title}</Text>
        <Text style={[styles.statValue, {color: theme.colors.text}]}>{value}</Text>
      </View>
      <MaterialCommunityIcons name="chevron-right" size={24} color={theme.colors.mutedText} />
    </TouchableOpacity>
  );

  const QuickActionCard = ({ label, icon, color, onPress }: any) => (
    <TouchableOpacity
      style={[styles.quickActionCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}
      onPress={onPress}>
      <View style={[styles.actionIconContainer, {backgroundColor: color}]}>
        <MaterialCommunityIcons name={icon} size={32} color="#fff" />
      </View>
      <Text style={[styles.actionLabel, {color: theme.colors.text}]}>{label}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.openDrawer()}>
          <MaterialCommunityIcons name="menu" size={28} color={theme.colors.primary} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, {color: theme.colors.text}]}>Admin Dashboard</Text>
        <View style={{ width: 28 }} />
      </View>

      <ScrollView
        style={styles.scrollContent}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{paddingBottom: 24}}>
        
        {/* Welcome Section */}
        <View style={[styles.welcomeSection, {backgroundColor: theme.colors.primary}]}>
          <Text style={styles.welcomeTitle}>Welcome Back, Admin</Text>
          <Text style={styles.welcomeSubtitle}>Manage your bookstore efficiently</Text>
        </View>

        {/* Statistics Grid */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Dashboard Statistics</Text>
          
          <StatCard
            title="Total Books"
            value={stats.totalBooks}
            icon="book-multiple-outline"
            color="#3B82F6"
            onPress={() => navigation.navigate('ManageBooksTab')}
          />
          <StatCard
            title="Total Orders"
            value={stats.totalOrders}
            icon="clipboard-check-outline"
            color="#8B5CF6"
            onPress={() => navigation.navigate('ManageOrdersTab')}
          />
          <StatCard
            title="Pending Orders"
            value={stats.pendingOrders}
            icon="clock-outline"
            color="#F59E0B"
          />
          <StatCard
            title="Total Users"
            value={stats.totalUsers}
            icon="account-multiple-outline"
            color="#10B981"
          />
          <StatCard
            title="Total Revenue"
            value={`$${stats.totalRevenue.toFixed(2)}`}
            icon="currency-usd"
            color="#EF4444"
          />
        </View>

        {/* Quick Actions */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Quick Actions</Text>
          <View style={styles.quickActionsGrid}>
            <QuickActionCard
              label="Manage Books"
              icon="book-edit-outline"
              color="#3B82F6"
              onPress={() => navigation.navigate('ManageBooks')}
            />
            <QuickActionCard
              label="Manage Orders"
              icon="clipboard-check-outline"
              color="#8B5CF6"
              onPress={() => navigation.navigate('ManageOrdersTab')}
            />
            <QuickActionCard
              label="View Profile"
              icon="account-circle-outline"
              color="#10B981"
              onPress={() => navigation.navigate('AdminProfileTab')}
            />
            <QuickActionCard
              label="Settings"
              icon="cog-outline"
              color="#F59E0B"
              onPress={() => navigation.navigate('Settings')}
            />
          </View>
        </View>

        {/* System Status */}
        <View style={styles.sectionContainer}>
          <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>System Status</Text>
          <View style={[styles.statusCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, {backgroundColor: '#10B981'}]} />
              <Text style={[styles.statusText, {color: theme.colors.text}]}>System: Online</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, {backgroundColor: '#10B981'}]} />
              <Text style={[styles.statusText, {color: theme.colors.text}]}>Database: Connected</Text>
            </View>
            <View style={styles.statusItem}>
              <View style={[styles.statusIndicator, {backgroundColor: '#10B981'}]} />
              <Text style={[styles.statusText, {color: theme.colors.text}]}>API: Active</Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
};

export default AdminDashboardScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '700',
  },
  scrollContent: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  welcomeSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    borderRadius: 12,
    marginBottom: 24,
  },
  welcomeTitle: {
    fontSize: 22,
    fontWeight: '700',
    color: '#fff',
    marginBottom: 4,
  },
  welcomeSubtitle: {
    fontSize: 14,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  sectionContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  statCard: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 14,
    borderRadius: 12,
    marginBottom: 10,
    borderWidth: 1,
  },
  statIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  statContent: {
    flex: 1,
  },
  statTitle: {
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 4,
  },
  statValue: {
    fontSize: 18,
    fontWeight: '700',
  },
  quickActionsGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    gap: 10,
  },
  quickActionCard: {
    width: '48%',
    alignItems: 'center',
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  actionIconContainer: {
    width: 56,
    height: 56,
    borderRadius: 12,
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 8,
  },
  actionLabel: {
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  statusCard: {
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  statusItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  statusIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  statusText: {
    fontSize: 14,
    fontWeight: '500',
  },
});
