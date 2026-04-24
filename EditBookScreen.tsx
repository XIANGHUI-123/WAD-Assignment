import React, {useState} from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import {updateBook} from './database';

const EditBookScreen = ({route, navigation}: any) => {
  const {book} = route.params;

  const [title, setTitle] = useState(book.title);
  const [author, setAuthor] = useState(book.author);
  const [price, setPrice] = useState(String(book.price));
  const [stock, setStock] = useState(String(book.stock));
  const [category, setCategory] = useState(book.category);

  const handleUpdateBook = async () => {
    const updatedBook = {
      ...book,
      title,
      author,
      price: Number(price),
      stock: Number(stock),
      category,
    };

    await updateBook(updatedBook);
    Alert.alert('Success', 'Book updated successfully');
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Edit Book</Text>

      <TextInput style={styles.input} value={title} onChangeText={setTitle} />
      <TextInput style={styles.input} value={author} onChangeText={setAuthor} />
      <TextInput
        style={styles.input}
        value={price}
        onChangeText={setPrice}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={stock}
        onChangeText={setStock}
        keyboardType="numeric"
      />
      <TextInput
        style={styles.input}
        value={category}
        onChangeText={setCategory}
      />

      <TouchableOpacity style={styles.button} onPress={handleUpdateBook}>
        <Text style={styles.buttonText}>Update Book</Text>
      </TouchableOpacity>
    </View>
  );
};

export default EditBookScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 20, backgroundColor: '#fff'},
  title: {fontSize: 26, fontWeight: 'bold', marginBottom: 20},
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 10,
    padding: 12,
    marginBottom: 12,
  },
  button: {
    backgroundColor: '#4F46E5',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: 'bold'},
});
