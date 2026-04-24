import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const BOOKS_KEY = 'books';
const ORDERS_KEY = 'orders';

export type User = {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'customer';
};

export type Book = {
  id: number;
  title: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description?: string;
};

export type CartItem = {
  bookId: number;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type Order = {
  id: number;
  customerId: number;
  customerName: string;
  items: CartItem[];
  total: number;
  status: 'Pending' | 'Completed' | 'Cancelled';
  date: string;
};

//////////////////////////
// USER
//////////////////////////

export const getUsers = async (): Promise<User[]> => {
  const data = await AsyncStorage.getItem(USERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveUsers = async (users: User[]) => {
  await AsyncStorage.setItem(USERS_KEY, JSON.stringify(users));
};

export const registerUser = async (
  username: string,
  password: string,
) => {
  const users = await getUsers();

  const exists = users.find(u => u.username === username);
  if (exists) {
    return {success: false, message: 'Username already exists'};
  }

  const newUser: User = {
    id: Date.now(),
    username,
    password,
    role: 'customer',
  };

  await saveUsers([...users, newUser]);
  return {success: true};
};

export const loginUser = async (
  username: string,
  password: string,
): Promise<User | null> => {
  const users = await getUsers();

  const user = users.find(
    u => u.username === username && u.password === password,
  );

  if (!user) return null;

  await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(user));
  return user;
};

export const getCurrentUser = async (): Promise<User | null> => {
  const data = await AsyncStorage.getItem(CURRENT_USER_KEY);
  return data ? JSON.parse(data) : null;
};

export const logoutUser = async () => {
  await AsyncStorage.removeItem(CURRENT_USER_KEY);
};

//////////////////////////
// BOOK
//////////////////////////

export const getBooks = async (): Promise<Book[]> => {
  const data = await AsyncStorage.getItem(BOOKS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveBooks = async (books: Book[]) => {
  await AsyncStorage.setItem(BOOKS_KEY, JSON.stringify(books));
};

export const addBook = async (book: Book) => {
  const books = await getBooks();
  await saveBooks([...books, book]);
};

export const updateBook = async (updatedBook: Book) => {
  const books = await getBooks();

  const updated = books.map(b =>
    b.id === updatedBook.id ? updatedBook : b,
  );

  await saveBooks(updated);
};

export const deleteBook = async (id: number) => {
  const books = await getBooks();
  const updated = books.filter(b => b.id !== id);
  await saveBooks(updated);
};

//////////////////////////
// ORDER
//////////////////////////

export const getOrders = async (): Promise<Order[]> => {
  const data = await AsyncStorage.getItem(ORDERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveOrders = async (orders: Order[]) => {
  await AsyncStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
};

export const addOrder = async (order: Order) => {
  const orders = await getOrders();
  await saveOrders([...orders, order]);
};

export const updateOrder = async (updatedOrder: Order) => {
  const orders = await getOrders();

  const updated = orders.map(o =>
    o.id === updatedOrder.id ? updatedOrder : o,
  );

  await saveOrders(updated);
};

export const deleteOrder = async (id: number) => {
  const orders = await getOrders();
  const updated = orders.filter(o => o.id !== id);
  await saveOrders(updated);
};

//////////////////////////
// INIT (VERY IMPORTANT)
//////////////////////////

export const seedAdminAndBooks = async () => {
  let users = await getUsers();
  let books = await getBooks();
  let orders = await getOrders();

  //////////////////////////
  // USERS (Admin + Custom)
  //////////////////////////

  if (users.length === 0) {
    users = [
      {
        id: 1,
        username: 'admin',
        password: 'admin123',
        role: 'admin',
      },
      {
        id: 2,
        username: 'Alicia',
        password: 'Alicia123',
        role: 'customer',
      },
      {
        id: 3,
        username: 'Brian',
        password: 'Brian123',
        role: 'customer',
      },
      {
        id: 4,
        username: 'Cindy',
        password: 'Cindy123',
        role: 'customer',
      },
      {
        id: 5,
        username: 'David',
        password: 'David123',
        role: 'customer',
      },
      {
        id: 6,
        username: 'Emma',
        password: 'Emma123',
        role: 'customer',
      },
      {
        id: 7,
        username: 'Frank',
        password: 'Frank123',
        role: 'customer',
      },
      {
        id: 8,
        username: 'Grace',
        password: 'Grace123',
        role: 'customer',
      },
      {
        id: 9,
        username: 'Henry',
        password: 'Henry123',
        role: 'customer',
      },
      {
        id: 10,
        username: 'Ivy',
        password: 'Ivy123',
        role: 'customer',
      },
      {
        id: 11,
        username: 'Jack',
        password: 'Jack123',
        role: 'customer',
      },
    ];

    await saveUsers(users);
  }

  //////////////////////////
  // BOOKS (8)
  //////////////////////////

  if (books.length === 0) {
    books = [
      { id: 1, title: 'Python Crash Course', author: 'Eric Matthes', price: 39.9, stock: 10, category: 'Programming', image: 'https://picsum.photos/200' },
      { id: 2, title: 'Database Essentials', author: 'Alice Tan', price: 30, stock: 8, category: 'Database', image: 'https://picsum.photos/201' },
      { id: 3, title: 'Java Basics', author: 'John Lee', price: 25, stock: 12, category: 'Programming', image: 'https://picsum.photos/202' },
      { id: 4, title: 'C++ Mastery', author: 'David Lim', price: 45, stock: 6, category: 'Programming', image: 'https://picsum.photos/203' },
      { id: 5, title: 'Web Development Guide', author: 'Sarah Ng', price: 35, stock: 9, category: 'Web', image: 'https://picsum.photos/204' },
      { id: 6, title: 'UI/UX Design', author: 'Emily Wong', price: 28, stock: 7, category: 'Design', image: 'https://picsum.photos/205' },
      { id: 7, title: 'Machine Learning Intro', author: 'Alan Teo', price: 50, stock: 5, category: 'AI', image: 'https://picsum.photos/206' },
      { id: 8, title: 'Mobile App Dev', author: 'Chris Tan', price: 32, stock: 11, category: 'Mobile', image: 'https://picsum.photos/207' },
    ];

    await saveBooks(books);
  }
};  
