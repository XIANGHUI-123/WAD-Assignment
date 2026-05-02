import React, {useState} from 'react';
import {
  Alert,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
} from 'react-native';
import {addBook, updateBook} from '../database';
import {useAppTheme} from '../theme';

const BookFormScreen = ({route, navigation}: any) => {
  const {theme} = useAppTheme();
  const editingBook = route.params?.book;

  const [title, setTitle] = useState(editingBook?.title || '');
  const [author, setAuthor] = useState(editingBook?.author || '');
  const [price, setPrice] = useState(
    editingBook ? String(editingBook.price) : '',
  );
  const [stock, setStock] = useState(
    editingBook ? String(editingBook.stock) : '',
  );
  const [category, setCategory] = useState(editingBook?.category || '');
  const [image, setImage] = useState(editingBook?.image || '');
  const [description, setDescription] = useState(
    editingBook?.description || '',
  );

  const handleSave = async () => {
    if (!title || !author || !price || !stock || !category || !image) {
      Alert.alert('Error', 'Please fill in all required fields');
      return;
    }

    const parsedPrice = Number(price);
    const parsedStock = Number(stock);

    if (
      !Number.isFinite(parsedPrice) ||
      parsedPrice <= 0 ||
      !Number.isFinite(parsedStock) ||
      parsedStock < 0
    ) {
      Alert.alert('Error', 'Price must be greater than 0 and stock must be 0 or more.');
      return;
    }

    const bookData = {
      id: editingBook?.id || Date.now(),
      title,
      author,
      price: parsedPrice,
      stock: parsedStock,
      category,
      image,
      description,
    };

    if (editingBook) {
      await updateBook(bookData);
      Alert.alert('Success', 'Book updated successfully');
    } else {
      await addBook(bookData);
      Alert.alert('Success', 'Book added successfully');
    }

    navigation.goBack();
  };

  return (
    <ScrollView style={[styles.container, {backgroundColor: theme.colors.background}]} contentContainerStyle={{padding: 20}}>
      <Text style={[styles.header, {color: theme.colors.text}]}>
        {editingBook ? 'Edit Book' : 'Add New Book'}
      </Text>

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Book title"
        placeholderTextColor={theme.colors.mutedText}
        value={title}
        onChangeText={setTitle}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Author"
        placeholderTextColor={theme.colors.mutedText}
        value={author}
        onChangeText={setAuthor}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Price"
        keyboardType="numeric"
        placeholderTextColor={theme.colors.mutedText}
        value={price}
        onChangeText={setPrice}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Stock"
        keyboardType="numeric"
        placeholderTextColor={theme.colors.mutedText}
        value={stock}
        onChangeText={setStock}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Category"
        placeholderTextColor={theme.colors.mutedText}
        value={category}
        onChangeText={setCategory}
      />

      <TextInput
        style={[styles.input, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Image link"
        placeholderTextColor={theme.colors.mutedText}
        value={image}
        onChangeText={setImage}
      />

      <TextInput
        style={[styles.input, styles.multiline, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border, color: theme.colors.text}]}
        placeholder="Description"
        placeholderTextColor={theme.colors.mutedText}
        value={description}
        onChangeText={setDescription}
        multiline
      />

      <TouchableOpacity style={[styles.button, {backgroundColor: theme.colors.primary}]} onPress={handleSave}>
        <Text style={styles.buttonText}>
          {editingBook ? 'Update Book' : 'Save Book'}
        </Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default BookFormScreen;

const styles = StyleSheet.create({
  container: {flex: 1},
  header: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 20,
  },
  input: {
    borderWidth: 1,
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 12,
    marginBottom: 14,
  },
  multiline: {
    height: 110,
    textAlignVertical: 'top',
  },
  button: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 30,
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});
