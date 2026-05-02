import React, { useEffect, useState } from 'react';
import { ActivityIndicator, StyleSheet, Text, TouchableOpacity, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { createDrawerNavigator, DrawerContentScrollView, DrawerItem } from '@react-navigation/drawer';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import { ThemeProvider, useAppTheme } from './theme';

import {
  CartItem,
  User,
  getCurrentUser,
  seedAdminAndBooks,
} from './database';

import LoginScreen from './LoginScreen';
import RegisterScreen from './RegisterScreen';
import HomeScreen from './HomeScreen';
import ProductScreen from './ProductScreen';
import CartScreen from './CartScreen';
import OrderHistoryScreen from './OrderHistoryScreen';
import ProfileScreen from './ProfileScreen';
import VouchersListScreen from './VouchersListScreen';
import SettingsScreen from './SettingsScreen';

import AdminDashboardScreen from './Admin/AdminDashBoard';
import ManageBooksScreen from './Admin/ManageBookScreen';
import BookFormScreen from './Admin/BookScreen';
import ManageOrdersScreen from './Admin/ManageOrderScreen';


const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();
const Drawer = createDrawerNavigator();

const CustomerDrawerContent = ({ navigation, currentUser, handleLogout }: any) => {
  const {theme} = useAppTheme();
  const goTo = (tabName: string, screen?: string) => {
    navigation.closeDrawer();
    if (screen) {
      navigation.navigate('MainTabs', {
        screen: tabName,
        params: {screen},
      });
      return;
    }

    navigation.navigate('MainTabs', {screen: tabName});
  };

  return (
    <DrawerContentScrollView contentContainerStyle={[styles.drawerContent, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.drawerHeader, {backgroundColor: theme.colors.secondaryBackground, borderBottomColor: theme.colors.border}]}>
        <View style={[styles.drawerAvatar, {backgroundColor: theme.colors.surface}]}>
          <MaterialCommunityIcons name="account" size={28} color={theme.colors.primary} />
        </View>
        <Text style={[styles.drawerGreeting, {color: theme.colors.mutedText}]}>Signed in as</Text>
        <Text style={[styles.drawerName, {color: theme.colors.text}]}>{currentUser?.username}</Text>
        <Text style={[styles.drawerRole, {color: theme.colors.primary}]}>{currentUser?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.drawerSection}>
        <Text style={[styles.drawerSectionTitle, {color: theme.colors.mutedText}]}>Navigate</Text>
        <DrawerItem
          label="Home"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="home-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('HomeTab')}
        />
        <DrawerItem
          label="Browse Books"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="book-open-page-variant-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('ProductTab')}
        />
        <DrawerItem
          label="Cart"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="cart-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('ProductTab', 'Cart')}
        />
        <DrawerItem
          label="Order History"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="history" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('HomeTab', 'OrderHistory')}
        />
        <DrawerItem
          label="Vouchers"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="ticket-percent" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('HomeTab', 'VouchersList')}
        />
        <DrawerItem
          label="Profile"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('ProfileTab')}
        />
        <DrawerItem
          label="Settings"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="cog-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => goTo('ProfileTab', 'Settings')}
        />
      </View>

      <View style={styles.drawerSection}>
        <Text style={[styles.drawerSectionTitle, {color: theme.colors.mutedText}]}>Session</Text>
        <DrawerItem
          label="Logout"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="logout" color="#EF4444" size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: '#EF4444'}]}
          onPress={() => {
            navigation.closeDrawer();
            handleLogout();
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const ProductStack = ({
  cart,
  setCart,
  currentUser,
  onOrderSuccess,
}: {
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  currentUser: User;
  onOrderSuccess: () => void;
}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProductList" options={{ title: 'Books' }}>
        {props => (
          <ProductScreen
            {...props}
            cart={cart}
            setCart={setCart}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Cart"
        options={({ navigation }) => ({
          title: 'Shopping Cart',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}>
        {props => (
          <CartScreen
            {...props}
            cart={cart}
            setCart={setCart}
            currentUser={currentUser}
            onOrderSuccess={onOrderSuccess}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const HomeStack = ({
  currentUser,
  cart,
}: {
  currentUser: User;
  cart: CartItem[];
}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="HomeMain" options={{ title: 'Home' }}>
        {props => (
          <HomeScreen
            {...props}
            currentUser={currentUser}
            cartCount={cart.length}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="OrderHistory"
        options={({ navigation }) => ({
          title: 'Order History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}>
        {props => (
          <OrderHistoryScreen
            {...props}
            currentUser={currentUser}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="VouchersList"
        options={({ navigation }) => ({
          title: 'Available Vouchers',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}>
        {props => (
          <VouchersListScreen
            {...props}
          />
        )}
      </Stack.Screen>
    </Stack.Navigator>
  );
};

const ProfileStack = ({
  currentUser,
  handleLogout,
}: {
  currentUser: User;
  handleLogout: () => void;
}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen name="ProfileMain" options={{title: 'Profile', headerShown: false}}>
        {props => (
          <ProfileScreen
            {...props}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="OrderHistory"
        options={({navigation}: any) => ({
          title: 'Order History',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}>
        {props => (
          <OrderHistoryScreen
            {...props}
            currentUser={currentUser}
          />
        )}
      </Stack.Screen>
      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({navigation}: any) => ({
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const AdminDashboardStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminDashboardMain"
        component={AdminDashboardScreen}
        options={{ title: 'Admin Dashboard' }}
      />

      <Stack.Screen
        name="ManageBooks"
        options={({ navigation }: any) => ({
          title: 'Manage Books',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}
        component={ManageBooksScreen}
      />

      <Stack.Screen
        name="BookForm"
        options={({ navigation }: any) => ({
          title: 'Book Form',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{ paddingLeft: 16 }}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}
        component={BookFormScreen}
      />
    </Stack.Navigator>
  );
};

const AdminOrdersStack = () => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="ManageOrdersMain"
        component={ManageOrdersScreen}
        options={{ title: 'Manage Orders' }}
      />
    </Stack.Navigator>
  );
};

const AdminProfileStack = ({
  currentUser,
  handleLogout,
}: {
  currentUser: User;
  handleLogout: () => void;
}) => {
  return (
    <Stack.Navigator>
      <Stack.Screen
        name="AdminProfileMain"
        options={{ title: 'Profile', headerShown: false }}>
        {props => (
          <ProfileScreen
            {...props}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </Stack.Screen>

      <Stack.Screen
        name="Settings"
        component={SettingsScreen}
        options={({navigation}: any) => ({
          title: 'Settings',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
              <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
            </TouchableOpacity>
          ),
        })}
      />
    </Stack.Navigator>
  );
};

const CustomerTabs = ({
  currentUser,
  handleLogout,
  cart,
  setCart,
  onOrderSuccess,
}: {
  currentUser: User;
  handleLogout: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: () => void;
}) => {
  const {theme} = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}>
      <Tab.Screen
        name="ProductTab"
        options={{
          tabBarLabel: 'Books',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-open-page-variant-outline"
              color={color}
              size={size}
            />
          ),
        }}>
        {() => (
          <ProductStack
            cart={cart}
            setCart={setCart}
            currentUser={currentUser}
            onOrderSuccess={onOrderSuccess}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="HomeTab"
        options={{
          tabBarLabel: 'Home',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="home-outline"
              color={color}
              size={size}
            />
          ),
        }}>
        {() => (
          <HomeStack
            currentUser={currentUser}
            cart={cart}
          />
        )}
      </Tab.Screen>

      <Tab.Screen
        name="ProfileTab"
        options={{
          headerShown: false,
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}>
        {() => (
          <ProfileStack
            currentUser={currentUser}
            handleLogout={handleLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const CustomerDrawer = ({
  currentUser,
  handleLogout,
  cart,
  setCart,
  onOrderSuccess,
}: {
  currentUser: User;
  handleLogout: () => void;
  cart: CartItem[];
  setCart: React.Dispatch<React.SetStateAction<CartItem[]>>;
  onOrderSuccess: () => void;
}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(15, 23, 42, 0.45)',
        drawerStyle: {width: 300},
      }}
      drawerContent={props => (
        <CustomerDrawerContent
          {...props}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      )}>
      <Drawer.Screen name="MainTabs">
        {() => (
          <CustomerTabs
            currentUser={currentUser}
            handleLogout={handleLogout}
            cart={cart}
            setCart={setCart}
            onOrderSuccess={onOrderSuccess}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

const AdminDrawerContent = ({ navigation, currentUser, handleLogout }: any) => {
  const {theme} = useAppTheme();
  const goTo = (screenName: string) => {
    navigation.closeDrawer();
    navigation.navigate('AdminMainTabs', { screen: screenName });
  };

  return (
    <DrawerContentScrollView contentContainerStyle={[styles.drawerContent, {backgroundColor: theme.colors.background}]}>
      <View style={[styles.drawerHeader, {backgroundColor: theme.colors.secondaryBackground, borderBottomColor: theme.colors.border}]}>
        <View style={[styles.drawerAvatar, {backgroundColor: theme.colors.surface}]}>
          <MaterialCommunityIcons name="shield-admin" size={28} color={theme.colors.primary} />
        </View>
        <Text style={[styles.drawerGreeting, {color: theme.colors.mutedText}]}>Signed in as</Text>
        <Text style={[styles.drawerName, {color: theme.colors.text}]}>{currentUser?.username}</Text>
        <Text style={[styles.drawerRole, {color: theme.colors.primary}]}>{currentUser?.role?.toUpperCase()}</Text>
      </View>

      <View style={styles.drawerSection}>
        <Text style={[styles.drawerSectionTitle, {color: theme.colors.mutedText}]}>Administrator</Text>
        <DrawerItem
          label="Manage Books"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="book-edit-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => navigation.navigate('ManageBooks')}
        />
        <DrawerItem
          label="Manage Orders"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="clipboard-check-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => navigation.navigate('ManageOrdersTab')}
        />
        <DrawerItem
          label="Profile"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="account-circle-outline" color={color} size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: theme.colors.text}]}
          onPress={() => navigation.navigate('AdminProfileTab')}
        />
      </View>

      <View style={styles.drawerSection}>
        <Text style={[styles.drawerSectionTitle, {color: theme.colors.mutedText}]}>Session</Text>
        <DrawerItem
          label="Logout"
          icon={({color, size}) => (
            <MaterialCommunityIcons name="logout" color="#EF4444" size={size} />
          )}
          labelStyle={[styles.drawerLabel, {color: '#EF4444'}]}
          onPress={() => {
            navigation.closeDrawer();
            handleLogout();
          }}
        />
      </View>
    </DrawerContentScrollView>
  );
};

const AdminTabs = ({
  currentUser,
  handleLogout,
}: {
  currentUser: User;
  handleLogout: () => void;
}) => {
  const {theme} = useAppTheme();
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: theme.colors.primary,
        tabBarInactiveTintColor: theme.colors.mutedText,
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
          backgroundColor: theme.colors.surface,
          borderTopColor: theme.colors.border,
        },
      }}>
      <Tab.Screen
        name="ManageBooksTab"
        options={{
          tabBarLabel: 'Books',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="book-edit-outline"
              color={color}
              size={size}
            />
          ),
        }}
        component={AdminDashboardStack}
      />

      <Tab.Screen
        name="ManageOrdersTab"
        options={{
          tabBarLabel: 'Orders',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="clipboard-check-outline"
              color={color}
              size={size}
            />
          ),
        }}
        component={AdminOrdersStack}
      />

      <Tab.Screen
        name="AdminProfileTab"
        options={{
          tabBarLabel: 'Profile',
          tabBarIcon: ({ color, size }) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}>
        {() => (
          <AdminProfileStack
            currentUser={currentUser}
            handleLogout={handleLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

const AdminDrawer = ({
  currentUser,
  handleLogout,
}: {
  currentUser: User;
  handleLogout: () => void;
}) => {
  return (
    <Drawer.Navigator
      screenOptions={{
        headerShown: false,
        drawerType: 'front',
        overlayColor: 'rgba(15, 23, 42, 0.45)',
        drawerStyle: {width: 300},
      }}
      drawerContent={props => (
        <AdminDrawerContent
          {...props}
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      )}>
      <Drawer.Screen name="AdminMainTabs">
        {() => (
          <AdminTabs
            currentUser={currentUser}
            handleLogout={handleLogout}
          />
        )}
      </Drawer.Screen>
    </Drawer.Navigator>
  );
};

function AppContent() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const {theme, isThemeReady} = useAppTheme();

  useEffect(() => {
    const init = async () => {
      try {
        await seedAdminAndBooks();
        const user = await getCurrentUser();
        setCurrentUser(user);
      } catch (error) {
        console.error('Failed to initialize app data:', error);
        setCurrentUser(null);
      } finally {
        setLoading(false);
      }
    };

    init();
  }, []);

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
  };

  const refreshCurrentUser = async () => {
    const updatedUser = await getCurrentUser();
    setCurrentUser(updatedUser);
  };

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }
  if (!isThemeReady) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center', backgroundColor: theme.colors.background }}>
        <ActivityIndicator size="large" color={theme.colors.primary} />
      </View>
    );
  }

  return (
    <NavigationContainer
      theme={{
        dark: theme.mode === 'dark',
        colors: {
          primary: theme.colors.primary,
          background: theme.colors.background,
          card: theme.colors.surface,
          text: theme.colors.text,
          border: theme.colors.border,
          notification: '#EF4444',
        },
      }}>
      {!currentUser ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{ headerShown: false }}>
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{ title: 'Register' }}
          />
        </Stack.Navigator>
        ) : currentUser.role === 'admin' ? (
        <AdminDrawer
          currentUser={currentUser}
          handleLogout={handleLogout}
        />
      ) : (
        <CustomerDrawer
          currentUser={currentUser}
          handleLogout={handleLogout}
          cart={cart}
          setCart={setCart}
          onOrderSuccess={refreshCurrentUser}
        />
      )}
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <ThemeProvider>
      <AppContent />
    </ThemeProvider>
  );
}

const styles = StyleSheet.create({
  drawerContent: {
    paddingTop: 0,
    backgroundColor: '#F8FAFC',
    flexGrow: 1,
  },
  drawerHeader: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 20,
    paddingTop: 60,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#C7D2FE',
  },
  drawerAvatar: {
    width: 52,
    height: 52,
    borderRadius: 26,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  drawerGreeting: {
    fontSize: 12,
    color: '#64748B',
    fontWeight: '600',
  },
  drawerName: {
    fontSize: 18,
    color: '#1E293B',
    fontWeight: '800',
    marginTop: 4,
  },
  drawerRole: {
    fontSize: 12,
    color: '#4F46E5',
    fontWeight: '700',
    marginTop: 4,
  },
  drawerSection: {
    marginTop: 12,
    paddingHorizontal: 8,
  },
  drawerSectionTitle: {
    fontSize: 12,
    color: '#94A3B8',
    fontWeight: '700',
    paddingHorizontal: 8,
    marginBottom: 4,
    textTransform: 'uppercase',
  },
  drawerLabel: {
    fontSize: 15,
    fontWeight: '600',
    color: '#334155',
  },
});
