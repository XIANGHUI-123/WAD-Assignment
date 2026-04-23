import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {NavigationContainer} from '@react-navigation/native';
import {createNativeStackNavigator} from '@react-navigation/native-stack';

import {
  Book,
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
import AdminDashboardScreen from './Admin/AdminDashBoard'
import ManageBooksScreen from './Admin/ManageBookScreen';
import BookFormScreen from './Admin/BookScreen';
import ManageOrdersScreen from './Admin/ManageOrdersScreen';

const Stack = createNativeStackNavigator();

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

  if (loading) {
    return (
      <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
        <ActivityIndicator size="large" color="#4F46E5" />
      </View>
    );
  }

  const handleLogin = (user: User) => {
    setCurrentUser(user);
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCart([]);
  };

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
            component={ManageBooksScreen}
            options={{title: 'Manage Books'}}
          />
          <Stack.Screen
            name="BookForm"
            component={BookFormScreen}
            options={{title: 'Book Form'}}
          />
          <Stack.Screen
            name="ManageOrders"
            component={ManageOrdersScreen}
            options={{title: 'Manage Orders'}}
          />
          <Stack.Screen name="Profile" options={{title: 'Profile'}}>
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
        <Stack.Navigator>
          <Stack.Screen name="Home" options={{title: 'Home'}}>
            {props => <HomeScreen {...props} currentUser={currentUser} />}
          </Stack.Screen>
          <Stack.Screen name="Product" options={{title: 'Books'}}>
            {props => (
              <ProductScreen
                {...props}
                cart={cart}
                setCart={setCart}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="Cart" options={{title: 'Cart'}}>
            {props => (
              <CartScreen
                {...props}
                cart={cart}
                setCart={setCart}
                currentUser={currentUser}
              />
            )}
          </Stack.Screen>
          <Stack.Screen name="OrderHistory" options={{title: 'My Orders'}}>
            {props => <OrderHistoryScreen {...props} currentUser={currentUser} />}
          </Stack.Screen>
          <Stack.Screen name="Profile" options={{title: 'Profile'}}>
            {props => (
              <ProfileScreen
                {...props}
                currentUser={currentUser}
                onLogout={handleLogout}
              />
            )}
          </Stack.Screen>
        </Stack.Navigator>
      )}
    </NavigationContainer>
  );
}
