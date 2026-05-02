import React, {useState} from 'react';
import {
  Alert,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  View,
} from 'react-native';
import {addBook, Book} from './database';
import {useAppTheme} from './theme';

const AddBookScreen = ({navigation}: any) => {
  const {theme} = useAppTheme();
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [price, setPrice] = useState('');
  const [stock, setStock] = useState('');
  const [category, setCategory] = useState('');
  const [image, setImage] = useState('');

  const handleAddBook = async () => {
    if (!title || !author || !price || !stock || !category) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const numericPrice = Number(price);
    const numericStock = Number(stock);

    if (Number.isNaN(numericPrice) || numericPrice <= 0) {
      Alert.alert('Error', 'Please enter a valid price');
      return;
    }

    if (Number.isNaN(numericStock) || numericStock < 0) {
      Alert.alert('Error', 'Please enter a valid stock quantity');
      return;
    }

    const newBook: Book = {
      id: Date.now(),
      title,
      author,
      price: numericPrice,
      stock: numericStock,
      category,
      image: image.trim() || 'https://via.placeholder.com/150',
    };

    await addBook(newBook);
    Alert.alert('Success', 'Book added successfully');
    navigation.goBack();
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <Text style={[styles.title, {color: theme.colors.text}]}>Add Book</Text>

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Title *"
        placeholderTextColor={theme.colors.mutedText}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Author *"
        placeholderTextColor={theme.colors.mutedText}
        value={author}
        onChangeText={setAuthor}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Price *"
        placeholderTextColor={theme.colors.mutedText}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Stock *"
        placeholderTextColor={theme.colors.mutedText}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Category *"
        placeholderTextColor={theme.colors.mutedText}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={[
          styles.input,
          {
            backgroundColor: theme.colors.surface,
            borderColor: theme.colors.border,
            color: theme.colors.text,
          },
        ]}
        placeholder="Image URL optional"
        placeholderTextColor={theme.colors.mutedText}
        value={image}
        onChangeText={setImage}
      />

      <TouchableOpacity
        style={[styles.button, {backgroundColor: theme.colors.primary}]}
        onPress={handleAddBook}>
        <Text style={styles.buttonText}>Save Book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default AddBookScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20},
  title: {fontSize: 26, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderWidth: 1,
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginTop: 8,
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
});
