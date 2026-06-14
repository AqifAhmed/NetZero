import React, { createContext, useContext, useEffect, useReducer } from 'react';
import { loadExpenses, saveExpenses, generateId, loadSelectedDate, saveSelectedDate } from '../utils/storage';

const ExpensesContext = createContext(null);

const initialState = {
  expenses: [],
  loading: true,
  selectedMonth: new Date().getMonth(),
  selectedYear: new Date().getFullYear(),
};

function reducer(state, action) {
  switch (action.type) {
    case 'LOAD_ALL':
      return {
        ...state,
        expenses: action.payload.expenses,
        selectedMonth: action.payload.date ? action.payload.date.month : state.selectedMonth,
        selectedYear: action.payload.date ? action.payload.date.year : state.selectedYear,
        loading: false,
      };
    case 'ADD':
      return { ...state, expenses: [action.payload, ...state.expenses] };
    case 'UPDATE':
      return {
        ...state,
        expenses: state.expenses.map((e) =>
          e.id === action.payload.id ? action.payload : e
        ),
      };
    case 'DELETE':
      return { ...state, expenses: state.expenses.filter((e) => e.id !== action.payload) };
    case 'SET_MONTH':
      return { ...state, selectedMonth: action.payload.month, selectedYear: action.payload.year };
    default:
      return state;
  }
}

export function ExpensesProvider({ children }) {
  const [state, dispatch] = useReducer(reducer, initialState);

  useEffect(() => {
    Promise.all([loadExpenses(), loadSelectedDate()]).then(([expenses, date]) => {
      dispatch({ type: 'LOAD_ALL', payload: { expenses, date } });
    });
  }, []);

  useEffect(() => {
    if (!state.loading) saveExpenses(state.expenses);
  }, [state.expenses, state.loading]);

  const addExpense = (expense) => {
    const newExpense = { ...expense, id: generateId(), createdAt: Date.now() };
    dispatch({ type: 'ADD', payload: newExpense });
  };
  const updateExpense = (expense) => dispatch({ type: 'UPDATE', payload: expense });
  const deleteExpense = (id) => dispatch({ type: 'DELETE', payload: id });
  const setMonth = (month, year) => {
    dispatch({ type: 'SET_MONTH', payload: { month, year } });
    saveSelectedDate(month, year);
  };

  const filteredExpenses = state.expenses.filter((e) => {
    const d = new Date(e.date);
    return d.getMonth() === state.selectedMonth && d.getFullYear() === state.selectedYear;
  });

  const totalThisMonth = filteredExpenses.reduce((sum, e) => sum + Number(e.amount), 0);
  const spendByCategory = filteredExpenses.reduce((acc, e) => {
    acc[e.category] = (acc[e.category] || 0) + Number(e.amount);
    return acc;
  }, {});

  return (
    <ExpensesContext.Provider
      value={{
        ...state,
        filteredExpenses,
        totalThisMonth,
        spendByCategory,
        addExpense,
        updateExpense,
        deleteExpense,
        setMonth,
      }}
    >
      {children}
    </ExpensesContext.Provider>
  );
}

export const useExpenses = () => useContext(ExpensesContext);
