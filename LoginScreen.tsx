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
import {useAppTheme} from './theme';

const LoginScreen = ({navigation, onLogin}: any) => {
  const {theme} = useAppTheme();
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
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>Book Order App</Text>
      <Text style={[styles.subtitle, {color: theme.colors.mutedText}]}>Login to continue</Text>

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Username"
        placeholderTextColor={theme.colors.mutedText}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Password"
        placeholderTextColor={theme.colors.mutedText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.primary}]} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate('Register')}>
        <Text style={[styles.link, {color: theme.colors.primary}]}>Register an account</Text>
      </TouchableOpacity>

      
    </View>
  );
};

export default LoginScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 30,
    fontWeight: '700',
    textAlign: 'center',
  },
  subtitle: {
    textAlign: 'center',
    marginTop: 8,
    marginBottom: 28,
  },
  input: {
    borderRadius: 10,
    borderWidth: 1,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700', fontSize: 16},
  link: {
    marginTop: 18,
    textAlign: 'center',
    fontWeight: '600',
  },
  adminHint: {
    marginTop: 20,
    textAlign: 'center',
  },
});

