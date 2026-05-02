import AsyncStorage from '@react-native-async-storage/async-storage';

const USERS_KEY = 'users';
const CURRENT_USER_KEY = 'currentUser';
const BOOKS_KEY = 'books';
const ORDERS_KEY = 'orders';
const VOUCHERS_KEY = 'vouchers';

export type User = {
  id: number;
  username: string;
  password: string;
  role: 'admin' | 'customer';
  points: number;
};

export type Book = {
  id: number | string;
  title: string;
  author: string;
  price: number;
  stock: number;
  category: string;
  image: string;
  description?: string;
};

export type CartItem = {
  bookId: number | string;
  title: string;
  price: number;
  quantity: number;
  image: string;
};

export type Voucher = {
  id: number;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  description: string;
  expiryDate: string;
  maxUses: number;
  currentUses: number;
  isUsed: boolean;
};

export type Order = {
  id: number;
  customerId: number;
  customerName: string;
  items: CartItem[];
  total: number;
  discount?: number;
  finalTotal?: number;
  voucherApplied?: string;
  pointsUsed?: number;
  pointsEarned?: number;
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
    points: 0,
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

export const updateUserPoints = async (userId: number, pointsToAdd: number): Promise<User | null> => {
  const users = await getUsers();
  const updatedUsers = users.map(u =>
    u.id === userId ? {...u, points: (u.points || 0) + pointsToAdd} : u,
  );
  
  await saveUsers(updatedUsers);
  
  // Update current user if it's the logged-in user
  const currentUser = await getCurrentUser();
  if (currentUser && currentUser.id === userId) {
    const updatedUser = updatedUsers.find(u => u.id === userId) || null;
    if (updatedUser) {
      await AsyncStorage.setItem(CURRENT_USER_KEY, JSON.stringify(updatedUser));
    }
    return updatedUser;
  }
  
  return updatedUsers.find(u => u.id === userId) || null;
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
// VOUCHER
//////////////////////////

export const getVouchers = async (): Promise<Voucher[]> => {
  const data = await AsyncStorage.getItem(VOUCHERS_KEY);
  return data ? JSON.parse(data) : [];
};

export const saveVouchers = async (vouchers: Voucher[]) => {
  await AsyncStorage.setItem(VOUCHERS_KEY, JSON.stringify(vouchers));
};

export const getAvailableVouchers = async (): Promise<Voucher[]> => {
  let vouchers = await getVouchers();

  if (!vouchers || vouchers.length === 0) {
    await seedAdminAndBooks();
    vouchers = await getVouchers();
  }

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  return vouchers.filter(v => {
    const expiryDate = new Date(v.expiryDate);
    expiryDate.setHours(0, 0, 0, 0);

    return !v.isUsed && v.currentUses < v.maxUses && expiryDate >= today;
  });
};

export const markVoucherAsUsed = async (voucherId: number) => {
  const vouchers = await getVouchers();
  const updated = vouchers.map(v =>
    v.id === voucherId 
      ? {...v, currentUses: v.currentUses + 1, isUsed: v.currentUses + 1 >= v.maxUses}
      : v,
  );
  await saveVouchers(updated);
};

export const addVoucher = async (voucher: Voucher) => {
  const vouchers = await getVouchers();
  await saveVouchers([...vouchers, voucher]);
};

export const updateVoucher = async (updatedVoucher: Voucher) => {
  const vouchers = await getVouchers();
  const updated = vouchers.map(v =>
    v.id === updatedVoucher.id ? updatedVoucher : v,
  );
  await saveVouchers(updated);
};

export const deleteVoucher = async (id: number) => {
  const vouchers = await getVouchers();
  const updated = vouchers.filter(v => v.id !== id);
  await saveVouchers(updated);
};

//////////////////////////
// INIT (VERY IMPORTANT)
//////////////////////////

export const seedAdminAndBooks = async () => {
  let users = await getUsers();
  let books = await getBooks();
  let orders = await getOrders();
  let vouchers = await getVouchers();

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
        points: 0,
      },
      {
        id: 2,
        username: 'Alicia',
        password: 'Alicia123',
        role: 'customer',
        points: 200,
      },
      {
        id: 3,
        username: 'Brian',
        password: 'Brian123',
        role: 'customer',
        points: 0,
      },
      {
        id: 4,
        username: 'Cindy',
        password: 'Cindy123',
        role: 'customer',
        points: 0,
      },
      {
        id: 5,
        username: 'David',
        password: 'David123',
        role: 'customer',
        points: 0,
      },
      {
        id: 6,
        username: 'Emma',
        password: 'Emma123',
        role: 'customer',
        points: 0,
      },
      {
        id: 7,
        username: 'Frank',
        password: 'Frank123',
        role: 'customer',
        points: 0,
      },
      {
        id: 8,
        username: 'Grace',
        password: 'Grace123',
        role: 'customer',
        points: 0,
      },
      {
        id: 9,
        username: 'Henry',
        password: 'Henry123',
        role: 'customer',
        points: 0,
      },
      {
        id: 10,
        username: 'Ivy',
        password: 'Ivy123',
        role: 'customer',
        points: 0,
      },
      {
        id: 11,
        username: 'Jack',
        password: 'Jack123',
        role: 'customer',
        points: 0,
      },
    ];

    await saveUsers(users);
  } else {
    // Update existing users to have points field if they don't
    const updatedUsers = users.map(u => ({
      ...u,
      points: u.points !== undefined ? u.points : 0,
    }));
    await saveUsers(updatedUsers);
  }

  //////////////////////////
  // BOOKS (8)
  //////////////////////////

  if (books.length === 0) {
    books = [
      { id: 100, title: 'Python Crash Course', author: 'Eric Matthes', price: 39.9, stock: 10, category: 'Programming', image: 'https://learning.oreilly.com/library/cover/9781718502710/250w/' },
      { id: 200, title: 'Database Essentials', author: 'Alice Tan', price: 30, stock: 8, category: 'Database', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 300, title: 'Java Basics', author: 'John Lee', price: 25, stock: 12, category: 'Programming', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 400, title: 'C++ Mastery', author: 'David Lim', price: 45, stock: 6, category: 'Programming', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 500, title: 'Web Development Guide', author: 'Sarah Ng', price: 35, stock: 9, category: 'Web', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 600, title: 'UI/UX Design', author: 'Emily Wong', price: 28, stock: 7, category: 'Design', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 700, title: 'Machine Learning Intro', author: 'Alan Teo', price: 50, stock: 5, category: 'AI', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
      { id: 800, title: 'Mobile App Dev', author: 'Chris Tan', price: 32, stock: 11, category: 'Mobile', image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' },
    ];

    await saveBooks(books);
  }

  //////////////////////////
  // VOUCHERS
  //////////////////////////

  if (vouchers.length === 0) {
    vouchers = [
      {
        id: 1,
        code: 'SAVE10',
        discountType: 'percentage',
        discountValue: 10,
        description: 'Save 10% on your purchase',
        expiryDate: '2026-6-10',
        maxUses: 100,
        currentUses: 0,
        isUsed: false,
      },
      {
        id: 2,
        code: 'SAVE20',
        discountType: 'percentage',
        discountValue: 20,
        description: 'Save 20% on your purchase',
        expiryDate: '2026-7-15',
        maxUses: 50,
        currentUses: 0,
        isUsed: false,
      },
      {
        id: 3,
        code: 'FLAT100',
        discountType: 'fixed',
        discountValue: 100,
        description: 'Flat RM 100 discount',
        expiryDate: '2026-12-31',
        maxUses: 30,
        currentUses: 0,
        isUsed: false,
      },
      {
        id: 4,
        code: 'WELCOME15',
        discountType: 'percentage',
        discountValue: 15,
        description: 'Welcome bonus - 15% off',
        expiryDate: '2026-8-31',
        maxUses: 200,
        currentUses: 0,
        isUsed: false,
      },
      {
        id: 5,
        code: 'FLAT50',
        discountType: 'fixed',
        discountValue: 50,
        description: 'Flat RM 50 discount',
        expiryDate: '2026-8-13',
        maxUses: 75,
        currentUses: 0,
        isUsed: false,
      },
    ];

    await saveVouchers(vouchers);
  }

  if (orders.length === 0) {
  orders = [
    {
      id: 1,
      customerId: 2,
      customerName: 'Alicia',
      items: [
        { 
          bookId: 100, 
          title: 'Python Crash Course', 
          price: 39.9, 
          quantity: 1, 
          image: 'https://learning.oreilly.com/library/cover/9781718502710/250w/' 
        },
        { 
          bookId: 200, 
          title: 'Database Essentials', 
          price: 30, 
          quantity: 1, 
          image: 'https://learning.oreilly.com/library/cover/9780134685991/250w/' 
        },
      ],
      total: 69.9,
      discount: 6.99,
      finalTotal: 62.91,
      voucherApplied: 'SAVE10',
      pointsUsed: 0,
      pointsEarned: 62,
      status: 'Pending',
      date: '2026-05-01',
    },
  ];

  await saveOrders(orders);
}
};  
