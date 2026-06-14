# ChatGPT Assistance Log

## Project Understanding

Net Zero is an Expo React Native expense tracker. It uses JavaScript, React Navigation bottom tabs, AsyncStorage for offline local data, and a dark mobile UI. The app lets users add, edit, delete, filter, and summarize expenses by month and category.

Key implementation areas:

- `App.js` wires the app theme, safe area provider, navigation container, and expenses context.
- `src/context/ExpensesContext.js` manages expense state, selected month/year, filtered expenses, monthly total, and category totals.
- `src/utils/storage.js` saves expenses and selected month/year with AsyncStorage.
- `src/navigation/MainTab.js` defines Home, Expenses, and Summary tabs.
- `src/screens/HomeScreen.js` shows monthly total spending and recent transactions.
- `src/screens/ExpensesScreen.js` lists expenses and filters them by category.
- `src/screens/SummaryScreen.js` shows a category spending chart and breakdown.
- `src/components/ExpenseModal.js` handles add/edit expense forms, validation, categories, and date selection.
- `src/components/ExpenseCard.js` displays transaction details and delete confirmation.

## Prompt 1: Project Structure

**Prompt given to ChatGPT**

> I am building a React Native Expo app called Net Zero. It should track expenses offline with AsyncStorage. What folder structure should I use for screens, reusable components, navigation, context, storage helpers, and theme constants?

**ChatGPT response**

You can organize the app around feature responsibilities rather than putting everything in one file:

```text
src/
  components/
    ExpenseCard.js
    ExpenseModal.js
    EmptyState.js
    MonthSelector.js
  context/
    ExpensesContext.js
  navigation/
    MainTab.js
  screens/
    HomeScreen.js
    ExpensesScreen.js
    SummaryScreen.js
  utils/
    storage.js
  constants/
    theme.js
```

Use `App.js` as the composition root. Wrap the app with `SafeAreaProvider`, `ExpensesProvider`, and `NavigationContainer`, then render the bottom tab navigator.

## Prompt 2: Expense State Management

**Prompt given to ChatGPT**

> How can I manage expenses globally in React Native so Home, Expenses, and Summary screens all use the same expense data?

**ChatGPT response**

Use React Context with `useReducer`. The reducer can support actions such as `LOAD_ALL`, `ADD`, `UPDATE`, `DELETE`, and `SET_MONTH`. Store the raw expense list in state, then derive values like:

- `filteredExpenses`
- `totalThisMonth`
- `spendByCategory`

This keeps the screens simpler. Home can read the monthly total, Expenses can read filtered transactions, and Summary can read category totals without duplicating logic in every screen.

## Prompt 3: AsyncStorage Persistence

**Prompt given to ChatGPT**

> I need expenses to stay saved after closing the app, but I do not want a backend. How should I store and load expense data?

**ChatGPT response**

AsyncStorage is a good fit for this project because it is local, simple, and works offline. Create helper functions in `src/utils/storage.js`:

```js
loadExpenses()
saveExpenses(expenses)
loadSelectedDate()
saveSelectedDate(month, year)
generateId()
```

Load expenses when the provider mounts. Save expenses whenever the expense list changes after the first load. You can also persist the selected month and year so the app opens to the user's last selected month.

## Prompt 4: Add and Edit Expense Modal

**Prompt given to ChatGPT**

> I want one modal to handle both adding and editing expenses. It should validate title and amount, let users choose a category, and select a date. How should I design it?

**ChatGPT response**

Create an `ExpenseModal` component that receives:

- `visible`
- `onClose`
- `editingExpense`

If `editingExpense` exists, populate the form with its values. Otherwise, use an empty form. On save, validate that the title is not blank and the amount is a positive number. If editing, call `updateExpense`; otherwise call `addExpense`.

For categories, render chips from a shared `CATEGORIES` array. For dates, store the selected date as a `yyyy-MM-dd` string so it is easy to filter by month and year.

## Prompt 5: Monthly Filtering

**Prompt given to ChatGPT**

> How can I filter expenses by selected month and year, and let users move between months?

**ChatGPT response**

Keep `selectedMonth` and `selectedYear` in context. Then derive the visible list:

```js
const filteredExpenses = expenses.filter((expense) => {
  const date = new Date(expense.date);
  return date.getMonth() === selectedMonth &&
    date.getFullYear() === selectedYear;
});
```

Build a `MonthSelector` component that calls `setMonth(month, year)`. A simple approach is to generate the last 24 months, show the selected month in the center, and provide previous/next buttons.

## Prompt 6: Dark Theme UI

**Prompt given to ChatGPT**

> Can you suggest a clean dark theme for a mobile expense tracker with category colors and spacing constants?

**ChatGPT response**

Create a central `theme.js` file so all screens share the same colors and spacing:

```js
export const COLORS = {
  background: '#0F172A',
  surface: '#1E293B',
  surfaceElevated: '#2A3547',
  border: '#334155',
  primary: '#22C55E',
  accent: '#EF4444',
  text: '#FFFFFF',
  textSecondary: '#94A3B8',
  textMuted: '#64748B',
};
```

Then define category colors and icons in the same file. This makes components like `ExpenseCard`, `ExpenseModal`, and `SummaryScreen` consistent.
