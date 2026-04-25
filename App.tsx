import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View,TouchableOpacity} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

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

import AdminDashboardScreen from './Admin/AdminDashBoard';
import ManageBooksScreen from './Admin/ManageBookScreen';
import BookFormScreen from './Admin/BookScreen';
import ManageOrdersScreen from './Admin/ManageOrdersScreen';

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();

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
      <Stack.Screen name="ProductList" options={{title: 'Books'}}>
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
        options={({navigation}) => ({
          title: 'Shopping Cart',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
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
      <Stack.Screen name="HomeMain" options={{title: 'Home'}}>
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
        options={({navigation}) => ({
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
        name="VouchersList"
        options={({navigation}) => ({
          title: 'Available Vouchers',
          headerLeft: () => (
            <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
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
  return (
    <Tab.Navigator
      screenOptions={{
        headerShown: false,
        tabBarShowLabel: true,
        tabBarActiveTintColor: '#4F46E5',
        tabBarInactiveTintColor: '#888',
        tabBarStyle: {
          height: 60,
          paddingBottom: 6,
          paddingTop: 6,
        },
      }}>
      <Tab.Screen
        name="ProductTab"
        options={{
          tabBarLabel: 'Books',
          tabBarIcon: ({color, size}) => (
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
          tabBarIcon: ({color, size}) => (
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
          title: 'Profile',
          tabBarLabel: 'Profile',
          tabBarIcon: ({color, size}) => (
            <MaterialCommunityIcons
              name="account-circle-outline"
              color={color}
              size={size}
            />
          ),
        }}>
        {props => (
          <ProfileScreen
            {...props}
            currentUser={currentUser}
            onLogout={handleLogout}
          />
        )}
      </Tab.Screen>
    </Tab.Navigator>
  );
};

export default function App() {
  const [loading, setLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);

  useEffect(() => {
    const init = async () => {
      await seedAdminAndBooks();
      const user = await getCurrentUser();
      setCurrentUser(user);
      setLoading(false);
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
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  return (
    <NavigationContainer>
      {!currentUser ? (
        <Stack.Navigator>
          <Stack.Screen name="Login" options={{headerShown: false}}>
            {props => <LoginScreen {...props} onLogin={handleLogin} />}
          </Stack.Screen>

          <Stack.Screen
            name="Register"
            component={RegisterScreen}
            options={{title: 'Register'}}
          />
        </Stack.Navigator>
      ) : currentUser.role === 'admin' ? (
        <Stack.Navigator>
          <Stack.Screen
            name="AdminDashboard"
            component={AdminDashboardScreen}
            options={{title: 'Admin Dashboard'}}
          />

          <Stack.Screen
            name="ManageBooks"
            options={({navigation}: any) => ({
              title: 'Manage Books',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
                </TouchableOpacity>
              ),
            })}
            component={ManageBooksScreen}
          />

          <Stack.Screen
            name="BookForm"
            options={({navigation}: any) => ({
              title: 'Book Form',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
                </TouchableOpacity>
              ),
            })}
            component={BookFormScreen}
          />

          <Stack.Screen
            name="ManageOrders"
            options={({navigation}: any) => ({
              title: 'Manage Orders',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
                </TouchableOpacity>
              ),
            })}
            component={ManageOrdersScreen}
          />

          <Stack.Screen
            name="Profile"
            options={({navigation}: any) => ({
              title: 'Profile',
              headerLeft: () => (
                <TouchableOpacity onPress={() => navigation.goBack()} style={{paddingLeft: 16}}>
                  <MaterialCommunityIcons name="arrow-left" size={24} color="#4F46E5" />
                </TouchableOpacity>
              ),
            })}>
            {props => (
              <ProfileScreen
                {...props}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      ) : (
        <CustomerTabs
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
