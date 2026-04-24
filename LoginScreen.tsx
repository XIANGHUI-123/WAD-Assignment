import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {loginUser, User} from './database';

const LoginScreen = ({navigation, onLogin}: any) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleLogin = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in username and password');
      return;
    }

    const user: User | null = await loginUser(username, password);

    if (!user) {
      Alert.alert('Login Failed', 'Invalid username or password');
      return;
    }

    onLogin(user);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Book Order App</Text>
      <Text style={styles.subtitle}>Login to continue</Text>

      <TextInput
        style={styles.input}
        placeholder="Username"
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={styles.link}>Register an account</Text>
      </TouchableOpacity>

      
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F5F7FF',
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
    color: '#4F46E5',
  },
  subtitle: {
    textAlign: 'center',
    color: '#666',
    marginTop: 8,
    marginBottom: 28,
  },
  input: {
    backgroundColor: '#fff',
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ddd',
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700', fontSize: 16},
  link: {
    marginTop: 18,
    textAlign: 'center',
    color: '#4F46E5',
    fontWeight: '600',
  },
  adminHint: {
    marginTop: 20,
    textAlign: 'center',
    color: '#888',
  },
});
