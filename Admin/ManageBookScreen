import React, {useCallback, useState} from 'react';
import {
  Alert,
  FlatList,
  Image,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import {useFocusEffect} from '@react-navigation/native';
import {Book, deleteBook, getBooks} from '../database';
import {useAppTheme} from '../theme';

const ManageBooksScreen = ({navigation}: any) => {
  const {theme} = useAppTheme();
  const [books, setBooks] = useState<Book[]>([]);

  const loadBooks = async () => {
    const data = await getBooks();
    setBooks(data);
  };

  useFocusEffect(
    useCallback(() => {
      loadBooks();
    }, []),
  );

  const handleDelete = (bookId: number | string) => {
    Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBook(bookId as number);
          loadBooks();
        },
      },
    ]);
  };

  return (
    <View style={[styles.container, {backgroundColor: theme.colors.background}]}>
      <TouchableOpacity
        style={[styles.addButton, {backgroundColor: theme.colors.primary}]}
        onPress={() => navigation.navigate('BookForm')}>
        <Text style={styles.addButtonText}>Add New Book</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={[styles.card, {backgroundColor: theme.colors.surface, borderColor: theme.colors.border}]}>
            <Image
              source={
                item.image && typeof item.image === 'string' && item.image.trim() !== ''
                  ? { uri: item.image }
                  : { uri: 'https://via.placeholder.com/150' }
              }
              style={styles.image}
            />
            <Text style={[styles.title, {color: theme.colors.text}]}>{item.title}</Text>
            <Text style={[styles.info, {color: theme.colors.mutedText}]}>Author: {item.author}</Text>
            <Text style={[styles.info, {color: theme.colors.mutedText}]}>Category: {item.category}</Text>
            <Text style={[styles.info, {color: theme.colors.mutedText}]}>Stock: {item.stock}</Text>
            <Text style={[styles.price, {color: theme.colors.primary}]}>RM {typeof item.price === 'number' ? item.price.toFixed(2) : '0.00'}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={[styles.editButton, {backgroundColor: theme.colors.primary}]}
                onPress={() => navigation.navigate('BookForm', {book: item})}>
                <Text style={styles.buttonText}>Edit</Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.deleteButton}
                onPress={() => handleDelete(item.id)}>
                <Text style={styles.buttonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
};

export default ManageBooksScreen;

const styles = StyleSheet.create({
  container: {flex: 1, padding: 16},
  addButton: {
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  addButtonText: {color: '#fff', fontWeight: '700'},
  card: {
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
    borderWidth: 1,
  },
  image: {width: '100%', height: 170, borderRadius: 10, marginBottom: 10},
  title: {fontSize: 18, fontWeight: '700'},
  info: {marginTop: 4},
  price: {marginTop: 8, fontWeight: '700'},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    flex: 0.48,
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  deleteButton: {
    flex: 0.48,
    backgroundColor: '#DC2626',
    padding: 12,
    borderRadius: 10,
    alignItems: 'center',
  },
  buttonText: {color: '#fff', fontWeight: '700'},
});
