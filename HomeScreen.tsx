import React from 'react';
import {
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
  ScrollView,
} from 'react-native';
import {DrawerActions} from '@react-navigation/native';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import {useAppTheme} from './theme';

const HomeScreen = ({navigation, currentUser, cartCount}: any) => {
  const {theme} = useAppTheme();
  const openDrawer = () => navigation.dispatch(DrawerActions.openDrawer());

  return (
    <>
      <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]} showsVerticalScrollIndicator={false}>
        {/* Header Section */}
        <View style={styles.header}>
          <View style={styles.headerLeft}>
            <TouchableOpacity onPress={openDrawer} style={styles.menuButton}>
              <MaterialCommunityIcons name="menu" size={28} color={theme.colors.text} />
            </TouchableOpacity>
            <View>
              <Text style={[styles.greeting, {color: theme.colors.mutedText}]}>Welcome Back! 👋</Text>
              <Text style={[styles.username, {color: theme.colors.text}]}>{currentUser?.username}</Text>
            </View>
          </View>
        <View style={[styles.badge, {backgroundColor: theme.colors.secondaryBackground}]}>
          <MaterialCommunityIcons name="bookshelf" size={32} color="#4F46E5" />
        </View>
      </View>

      {/* Cart Summary Card */}
      {cartCount > 0 && (
        <TouchableOpacity
          style={[styles.cartCard, {backgroundColor: theme.colors.secondaryBackground, borderColor: theme.colors.border}]}
          onPress={() => navigation.navigate('ProductTab', {screen: 'Cart'})}>
          <View style={styles.cartContent}>
            <View>
              <Text style={[styles.cartLabel, {color: theme.colors.mutedText}]}>Items in Cart</Text>
              <Text style={[styles.cartCount, {color: theme.colors.text}]}>{cartCount} item{cartCount !== 1 ? 's' : ''}</Text>
            </View>
            <View style={[styles.cartBadge, {backgroundColor: theme.colors.primary}]}>
              <MaterialCommunityIcons
                name="cart"
                size={24}
                color="#fff"
              />
            </View>
          </View>
        </TouchableOpacity>
      )}

      {/* Rewards Section */}
      <View style={styles.rewardsContainer}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Rewards & Savings</Text>
        <View style={styles.rewardsRow}>
          <TouchableOpacity 
            style={[styles.rewardCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}
            onPress={() => navigation.navigate('HomeTab', {screen: 'VouchersList'})}>
            <MaterialCommunityIcons name="ticket-percent" size={28} color="#D97706" />
            <Text style={[styles.rewardValue, {color: theme.colors.text}]}>Vouchers</Text>
            <Text style={[styles.rewardSubtext, {color: theme.colors.mutedText}]}>Get discounts</Text>
          </TouchableOpacity>
          <View style={[styles.rewardCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <MaterialCommunityIcons name="star-circle" size={28} color="#F59E0B" />
            <Text style={[styles.rewardValue, {color: theme.colors.text}]}>Points</Text>
            <Text style={[styles.pointsValue, {color: theme.colors.primary}]}>{currentUser?.points || 0}</Text>
            <Text style={[styles.rewardSubtext, {color: theme.colors.mutedText}]}>200 pts = 1 book</Text>
          </View>
        </View>
        <View style={[styles.rewardInfoCard, {backgroundColor: theme.colors.secondaryBackground, borderColor: theme.colors.border}]}>
          <MaterialCommunityIcons name="information" size={20} color="#4F46E5" />
          <View style={{flex: 1, marginLeft: 12}}>
            <Text style={[styles.rewardInfoTitle, {color: theme.colors.primary}]}>Earn & Redeem</Text>
            <Text style={[styles.rewardInfoText, {color: theme.colors.primary}] }>
              • Earn 1 point per RM spent
              • Redeem 200 points for a free book
              • Use vouchers for instant discounts
            </Text>
          </View>
        </View>
      </View>

      {/* Action Cards */}
      <View style={styles.actionSection}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Explore</Text>

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
          style={[styles.actionCard, styles.secondaryCard, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}
          onPress={() => navigation.navigate('HomeTab', {screen: 'OrderHistory'})}>
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons
              name="history"
              size={32}
              color="#4F46E5"
            />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.actionTitle2, {color: theme.colors.text}]}>Order History</Text>
              <Text style={[styles.actionSubtitle2, {color: theme.colors.mutedText}]}>
                Track your orders
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#4F46E5" />
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.actionCard, styles.tertiaryCard, {backgroundColor: theme.colors.successBackground, borderColor: theme.colors.border}]}
          onPress={() => navigation.navigate('ProfileTab')}>
          <View style={styles.actionLeft}>
            <MaterialCommunityIcons name="account-details" size={32} color="#059669" />
            <View style={{marginLeft: 12}}>
              <Text style={[styles.actionTitle3, {color: theme.colors.text}]}>My Profile</Text>
              <Text style={[styles.actionSubtitle3, {color: theme.colors.mutedText}]}>
                Manage account
              </Text>
            </View>
          </View>
          <MaterialCommunityIcons name="chevron-right" size={24} color="#059669" />
        </TouchableOpacity>
      </View>

      {/* Features Section */}
      <View style={styles.featuresSection}>
        <Text style={[styles.sectionTitle, {color: theme.colors.text}]}>Why Choose Us?</Text>
        <View style={[styles.featureItem, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="truck-fast" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.featureTitle, {color: theme.colors.text}]}>Fast Delivery</Text>
            <Text style={[styles.featureText, {color: theme.colors.mutedText}]}>Quick and reliable book delivery</Text>
          </View>
        </View>

        <View style={[styles.featureItem, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="shield-check" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.featureTitle, {color: theme.colors.text}]}>Secure Payment</Text>
            <Text style={[styles.featureText, {color: theme.colors.mutedText}]}>Your transactions are safe and secure</Text>
          </View>
        </View>

        <View style={[styles.featureItem, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
          <View style={styles.featureIcon}>
            <MaterialCommunityIcons name="star" size={20} color="#4F46E5" />
          </View>
          <View style={{flex: 1}}>
            <Text style={[styles.featureTitle, {color: theme.colors.text}]}>Best Selection</Text>
            <Text style={[styles.featureText, {color: theme.colors.mutedText}]}>Thousands of books to choose from</Text>
          </View>
        </View>
      </View>

      <View style={{height: 30}} />
      </ScrollView>
    </>
  );
};

export default HomeScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingHorizontal: 16,
    paddingTop: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 24,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  menuButton: {
    marginRight: 12,
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
    borderRadius: 14,
    padding: 16,
    marginBottom: 24,
    borderWidth: 1,
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
  rewardsContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '700',
    color: '#1E293B',
    marginBottom: 12,
  },
  rewardsRow: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  rewardCard: {
    flex: 1,
    borderRadius: 12,
    padding: 16,
    alignItems: 'center',
    borderWidth: 1,
  },
  rewardValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#1E293B',
    marginTop: 8,
  },
  pointsValue: {
    fontSize: 20,
    fontWeight: '800',
    color: '#F59E0B',
    marginTop: 4,
  },
  rewardSubtext: {
    fontSize: 11,
    color: '#94A3B8',
    marginTop: 4,
  },
  rewardInfoCard: {
    borderRadius: 12,
    padding: 14,
    flexDirection: 'row',
    borderWidth: 1,
  },
  rewardInfoTitle: {
    fontSize: 14,
    fontWeight: '700',
    color: '#4F46E5',
  },
  rewardInfoText: {
    fontSize: 12,
    color: '#6366F1',
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
    padding: 14,
    borderRadius: 12,
    borderWidth: 1,
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
  modalOverlay: {
    flex: 1,
    flexDirection: 'row',
  },
  modalBackground: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: 'rgba(0,0,0,0.5)',
  },
  sideMenu: {
    width: 280,
    backgroundColor: '#fff',
    height: '100%',
    padding: 24,
    paddingTop: 60,
  },
  menuHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 40,
  },
  menuTitle: {
    fontSize: 24,
    fontWeight: '800',
    color: '#1E293B',
  },
  sideMenuItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#F1F5F9',
  },
  sideMenuItemText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#334155',
    marginLeft: 16,
  },
});

