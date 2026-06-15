# Net Zero — Expense Tracker App

A mobile expense tracker built with React Native and Expo. The app lets you log daily expenses, filter by month and category, and see a visual breakdown of where your money is going. Everything is stored locally on the device using AsyncStorage — no login, no internet required.

---

## Features

- Add, edit, and delete expense entries
- Filter expenses by month using a month selector
- Filter by category on the Expenses screen (All, Food, Transport, Shopping, Bills, Other)
- Home dashboard with total PKR spent and recent transactions
- Summary screen with a pie chart and per-category breakdown with percentages
- Built-in calendar picker for selecting expense dates (future dates disabled)
- Form validation on the add/edit modal
- Data persists across app restarts via AsyncStorage
- Selected month also persists so the app reopens where you left off
- Dark themed UI throughout

---

## Screens

### Home
Shows the app name, a hero card with total spent and transaction count for the selected month, the month selector, and a list of recent transactions (up to 20). Has an Add button to open the expense modal. Tapping any expense card opens it in edit mode.

### Expenses
Full scrollable list of all expenses for the selected month. Has category filter chips at the top to narrow down by Food, Transport, Shopping, Bills, or Other. Each card has a delete button. Tapping a card opens the edit modal.

### Summary
Shows total spent for the month, a pie chart with category-colored slices, and a list of each category with its amount, percentage, and a proportional progress bar.

### Expense Modal (Add / Edit)
A slide-up modal used for both adding and editing expenses. Contains a title field, amount field (PKR), a calendar date picker, and a category selector with icon chips. In edit mode a delete button is also shown.

---

## Tech Stack

| Technology | Version |
|---|---|
| React Native | 0.81.5 |
| Expo | ~54.0.34 |
| @react-navigation/native | 6.1.18 |
| @react-navigation/bottom-tabs | 6.6.1 |
| @react-native-async-storage/async-storage | 2.2.0 |
| react-native-chart-kit | 6.12.3 |
| react-native-svg | 15.12.1 |
| @expo/vector-icons (Ionicons) | 15.1.1 |
| date-fns | 3.6.0 |
| react-native-safe-area-context | 5.6.0 |
| react-native-screens | 4.16.0 |

---

## Project Structure

```
NetZero/
├── src/
│   ├── screens/
│   │   ├── HomeScreen.js
│   │   ├── ExpensesScreen.js
│   │   └── SummaryScreen.js
│   ├── components/
│   │   ├── ExpenseCard.js
│   │   └── ExpenseModal.js
│   ├── context/
│   │   └── ExpensesContext.js
│   ├── navigation/
│   │   └── MainTab.js
│   └── constants/
│       └── theme.js
├── app.json
├── package.json
└── index.js
```

---

## State Management

Global state is managed through `ExpensesContext` using `useReducer`. The context is provided at the root level so all screens can access expenses and dispatch actions without prop drilling.

**Actions:**
- `LOAD_ALL` — loads expenses and selected date from AsyncStorage on startup
- `ADD` — adds a new expense
- `UPDATE` — updates an existing expense
- `DELETE` — removes an expense by id
- `SET_MONTH` — changes the selected month/year

Whenever the expenses array changes, a `useEffect` automatically saves the updated list back to AsyncStorage.

**Values exposed by the context:**
- `filteredExpenses` — expenses filtered by the selected month
- `totalThisMonth` — sum of amounts for the selected month
- `spendByCategory` — object with totals per category for the selected month
- `selectedMonth`, `selectedYear` — current month navigation state
- `addExpense`, `updateExpense`, `deleteExpense`, `setMonth` — action functions
- `loading` — boolean, true while AsyncStorage data is being loaded

---

## Data Model

Each expense is stored as a plain object:

```js
{
  id: "1749900000000",       // timestamp string, used as unique key
  title: "Lunch",
  amount: 450,               // number, stored in PKR
  category: "Food",          // one of: Food, Transport, Shopping, Bills, Other
  date: "2026-06-14",        // yyyy-MM-dd string
  createdAt: 1749900000000   // Date.now() at time of creation
}
```

All expenses are stored as a JSON array under a single AsyncStorage key. The selected month and year are stored separately.

---

## Categories

```js
['Food', 'Transport', 'Shopping', 'Bills', 'Other']
```

Each category has a fixed color and Ionicons icon defined in `src/constants/theme.js`:

| Category | Color | Icon |
|---|---|---|
| Food | `#EF4444` | restaurant |
| Transport | `#38BDF8` | car |
| Shopping | `#FBBF24` | bag-handle |
| Bills | `#86EFAC` | receipt |
| Other | `#94A3B8` | ellipsis-horizontal-circle |

---

## Theme

The app uses a dark color scheme defined in `src/constants/theme.js`:

```js
background:      '#0F172A'
surface:         '#1E293B'
surfaceElevated: '#2A3547'
border:          '#334155'
primary:         '#22C55E'   // green accent
text:            '#FFFFFF'
textSecondary:   '#94A3B8'
textMuted:       '#64748B'
```

---

## Getting Started

Clone the repo and install dependencies:

```bash
git clone https://github.com/aqifahmed/NetZero.git
cd NetZero
npm install
```

Start the Expo dev server:

```bash
npx expo start
```

Run on Android or iOS:

```bash
npx expo start --android
npx expo start --ios
```

> Requires Node.js and Expo CLI. For physical device testing, install the Expo Go app.

---

## Built By

- Aqif Ahmed — [github.com/aqifahmed](https://github.com/aqifahmed)
- Danish Hamid