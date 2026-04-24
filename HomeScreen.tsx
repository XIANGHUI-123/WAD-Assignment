import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
  Image,
} from 'react-native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

const HomeScreen = ({navigation, currentUser, cartCount}: any) => {
  return (
    <ScrollView style={styles.container} showsVerticalScrollIndicator={false}>
      {/* Header Section */}
      <View style={styles.header}>
        <View>
          <Text style={styles.greeting}>Welcome Back! 👋</Text>
          <Text style={styles.username}>{currentUser?.username}</Text>
        </View>
        <View style={styles.badge}>
          <MaterialCommunityIcons name="bookshelf" size={32} color="#4F46E5" />
        </View>
      </View>

      {/* Cart Summary Card */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={styles.cartCard}
          onPress={() => navigation.navigate('ProductTab', {screen: 'Cart'})}>
          <View style={styles.cartContent}>
            <View>
              <Text style={styles.cartLabel}>Items in Cart</Text>
              <Text style={styles.cartCount}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
            </View>
            <View style={styles.cartBadge}>
              <MaterialCommunityIcons
                name="shopping-cart"
                size={24}
                color="#fff"
              />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Quick Stats */}
      <View style={styles.statsContainer}>
        <Text style={styles.sectionTitle}>Your Activity</Text>
        <View style={styles.statsRow}>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="package-variant" size={28} color="#4F46E5" />
            <Text style={styles.statValue}>Orders</Text>
            <Text style={styles.statSubtext}>View history</Text>
          </View>
          <View style={styles.statCard}>
            <MaterialCommunityIcons name="heart-outline" size={28} color="#EF4444" />
            <Text style={styles.statValue}>Favorites</Text>
            <Text style={styles.statSubtext}>Coming soon</Text>
          </View>
        </View>
      </View>

      {/* Action Cards */}
      <View style={styles.actionSection}>
        <Text style={styles.sectionTitle}>Explore</Text>

        <TouchableOpacity
          style={[styles.actionCard, styles.primaryCard]}
          onPress={() => navigation.navigate('ProductTab', {screen: 'ProductList'})}>
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons name="book-multiple" size={32} color="#fff" />
            <View style={{marginLeft: 12}}>
              <Text style={styles.actionTitle}>Browse Books</Text>
              <Text style={styles.actionSubtitle}>
                {cartCount === 0
                  ? 'Start shopping'
                  : 'Continue shopping'}
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#fff" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.secondaryCard]}
          onPress={() => navigation.navigate('HomeTab', {screen: 'OrderHistory'})}>
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons
              name="history"
              size={32}
              color="#4F46E5"
            />
            <View style={{marginLeft: 12}}>
              <Text style={styles.actionTitle2}>Order History</Text>
              <Text style={styles.actionSubtitle2}>
                Track your orders
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#4F46E5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.tertiaryCard]}
          onPress={() => navigation.navigate('ProfileTab')}>
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons name="account-details" size={32} color="#059669" />
            <View style={{marginLeft: 12}}>
              <Text style={styles.actionTitle3}>My Profile</Text>
              <Text style={styles.actionSubtitle3}>
                Manage account
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={styles.sectionTitle}>Why Choose Us?</Text>
        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="truck-fast" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>Fast Delivery</Text>
            <Text style={styles.featureText}>Quick and reliable book delivery</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>Secure Payment</Text>
            <Text style={styles.featureText}>Your transactions are safe and secure</Text>
          </View>
        </View>

        <View style={styles.featureItem}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="star" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={styles.featureTitle}>Best Selection</Text>
            <Text style={styles.featureText}>Thousands of books to choose from</Text>
          </View>
        </View>
      </View>

      <View style={{height: 30}} />
    </ScrollView>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F8FAFC',
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  greeting: {
    fontSize: 16,
    color: '#64748B',
    fontWeight: '500',
  },
  username: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
    marginTop: 4,
  },
  badge: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: '#E0E7FF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  cartCard: {
    backgroundColor: '#FEF3C7',
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderLeftWidth: 4,
    borderLeftColor: '#F59E0B',
  },
  cartContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  cartLabel: {
    fontSize: 12,
    color: '#78350F',
    fontWeight: '600',
  },
  cartCount: {
    fontSize: 22,
    fontWeight: '800',
    color: '#92400E',
    marginTop: 4,
  },
  cartBadge: {
    width: 48,
    height: 48,
    borderRadius: 12,
    backgroundColor: '#F59E0B',
    justifyContent: 'center',
    alignItems: 'center',
  },
  statsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  statsRow: {
    flexDirection: 'row',
    gap: 12,
  },
  statCard: {
    flex: 1,
    backgroundColor: '#fff',
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  statValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  statSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  actionSection: {
    marginBottom: 24,
  },
  actionCard: {
    borderRadius: 14,
    padding: 16,
    marginBottom: 12,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  primaryCard: {
    backgroundColor: '#4F46E5',
  },
  secondaryCard: {
    backgroundColor: '#F3F4F6',
  },
  tertiaryCard: {
    backgroundColor: '#ECFDF5',
  },
  actionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  actionTitle: {
    fontSize: 16,
    fontWeight: '700',
    color: '#fff',
  },
  actionTitle2: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
  },
  actionTitle3: {
    fontSize: 16,
    fontWeight: '700',
    color: '#065F46',
  },
  actionSubtitle: {
    fontSize: 12,
    color: '#E0E7FF',
    marginTop: 2,
  },
  actionSubtitle2: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
  actionSubtitle3: {
    fontSize: 12,
    color: '#047857',
    marginTop: 2,
  },
  featuresSection: {
    marginBottom: 20,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
    backgroundColor: '#fff',
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#E2E8F0',
  },
  featureIcon: {
    width: 44,
    height: 44,
    borderRadius: 10,
    backgroundColor: '#EEF2FF',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  featureTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#1E293B',
  },
  featureText: {
    fontSize: 12,
    color: '#64748B',
    marginTop: 2,
  },
});
