import AsyncStorage from '@react-native-async-storage/async-storage';

const EXPENSES_KEY = '@netzero_expenses';

export const loadExpenses = async () => {
  try {
    const data = await AsyncStorage.getItem(EXPENSES_KEY);
    return data ? JSON.parse(data) : [];
  } catch (e) {
    console.error('Failed to load expenses:', e);
    return [];
  }
};

export const saveExpenses = async (expenses) => {
  try {
    await AsyncStorage.setItem(EXPENSES_KEY, JSON.stringify(expenses));
  } catch (e) {
    console.error('Failed to save expenses:', e);
  }
};

export const generateId = () =>
  Date.now().toString(36) + Math.random().toString(36).substr(2);

const SELECTED_DATE_KEY = '@netzero_selected_date';

export const loadSelectedDate = async () => {
  try {
    const data = await AsyncStorage.getItem(SELECTED_DATE_KEY);
    return data ? JSON.parse(data) : null;
  } catch (e) {
    console.error('Failed to load selected date:', e);
    return null;
  }
};

export const saveSelectedDate = async (month, year) => {
  try {
    await AsyncStorage.setItem(SELECTED_DATE_KEY, JSON.stringify({ month, year }));
  } catch (e) {
    console.error('Failed to save selected date:', e);
  }
};
