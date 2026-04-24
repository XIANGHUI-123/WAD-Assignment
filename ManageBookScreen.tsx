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

const ManageBooksScreen = ({navigation}: any) => {
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

  const handleDelete = (bookId: number) => {
    Alert.alert('Delete Book', 'Are you sure you want to delete this book?', [
      {text: 'Cancel', style: 'cancel'},
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          await deleteBook(bookId);
          loadBooks();
        },
      },
    ]);
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity
        style={styles.addButton}
        onPress={() => navigation.navigate('BookForm')}>
        <Text style={styles.addButtonText}>Add New Book</Text>
      </TouchableOpacity>

      <FlatList
        data={books}
        keyExtractor={item => item.id.toString()}
        renderItem={({item}) => (
          <View style={styles.card}>
            <Image source={{uri: item.image}} style={styles.image} />
            <Text style={styles.title}>{item.title}</Text>
            <Text style={styles.info}>Author: {item.author}</Text>
            <Text style={styles.info}>Category: {item.category}</Text>
            <Text style={styles.info}>Stock: {item.stock}</Text>
            <Text style={styles.price}>RM {item.price.toFixed(2)}</Text>

            <View style={styles.row}>
              <TouchableOpacity
                style={styles.editButton}
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
  container: {flex: 1, backgroundColor: '#F9FAFB', padding: 16},
  addButton: {
    backgroundColor: '#16A34A',
    padding: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 14,
  },
  addButtonText: {color: '#fff', fontWeight: '700'},
  card: {
    backgroundColor: '#fff',
    borderRadius: 14,
    padding: 14,
    marginBottom: 14,
  },
  image: {width: '100%', height: 170, borderRadius: 10, marginBottom: 10},
  title: {fontSize: 18, fontWeight: '700', color: '#222'},
  info: {marginTop: 4, color: '#555'},
  price: {marginTop: 8, fontWeight: '700', color: '#16A34A'},
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 12,
  },
  editButton: {
    flex: 0.48,
    backgroundColor: '#4F46E5',
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
