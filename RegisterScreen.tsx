import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {registerUser} from './database';
import {useAppTheme} from './theme';

const RegisterScreen = ({navigation}: any) => {
  const {theme} = useAppTheme();
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleRegister = async () => {
    if (!username || !password) {
      Alert.alert('Error', 'Please fill in all fields');
      return;
    }

    const result = await registerUser(username, password);

    if (!result.success) {
      Alert.alert('Register Failed', result.message);
      return;
    }

    Alert.alert('Success', 'Account created successfully');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.primary}]}>Register</Text>

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="New username"
        placeholderTextColor={theme.colors.mutedText}
        value={username}
        onChangeText={setUsername}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="New password"
        placeholderTextColor={theme.colors.mutedText}
        secureTextEntry
        value={password}
        onChangeText={setPassword}
      />

      <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.primary}]} onPress={handleRegister}>
        <Text style={styles.buttonText}>Create Account</Text>
      </TouchableOpacity>
    </View>
  );
};

export default RegisterScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    padding: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 24,
    textAlign: 'center',
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
});

