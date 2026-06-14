# Net Zero — Expense Tracker App

Net Zero is a simple and clean React Native expense tracker built for managing daily expenses. The app allows users to add, edit, delete, categorize, and view their expenses in a monthly dashboard.

This project uses local storage with AsyncStorage, so it works offline and does not require any backend, login system, or cloud database.

## Project Status

Open Source Project
Built by: Aqif Ahmed
Platform: React Native
Storage: AsyncStorage
Backend: Not required

## Features

* Add new expenses
* Edit existing expenses
* Delete expenses
* Categorize expenses using tags
* View total spending for the selected month
* View recent transactions
* Filter expenses by month
* View spending summary by category
* Dark theme UI
* Empty state messages
* Offline local storage using AsyncStorage

## Categories

The app supports the following expense categories:

* Food
* Transport
* Shopping
* Bills
* Other

## Screens

The project includes the following main screens:

### 1. Splash Screen

Displays the app name and gives the app a clean startup experience.

### 2. Home Dashboard

Shows the selected month, total spending, recent transactions, and navigation options.

### 3. Add Expense Screen

Allows users to add a new expense by entering title, amount, category, and date.

### 4. Edit Expense Screen

Allows users to update or delete an existing expense.

### 5. Spending Summary Screen

Shows a category-wise summary of expenses using a simple chart or breakdown list.

## App Screenshots

Add your final app screenshots below after completing the UI.

### Splash Screen

<!-- Add Splash Screen screenshot here -->

```md
![Splash Screen](./screenshots/splash-screen.png)
```

### Home Dashboard

<!-- Add Home Dashboard screenshot here -->

```md
![Home Dashboard](./screenshots/home-dashboard.png)
```

### Add Expense Screen

<!-- Add Add Expense screenshot here -->

```md
![Add Expense Screen](./screenshots/add-expense.png)
```

### Edit Expense Screen

<!-- Add Edit Expense screenshot here -->

```md
![Edit Expense Screen](./screenshots/edit-expense.png)
```

### Spending Summary Screen

<!-- Add Spending Summary screenshot here -->

```md
![Spending Summary Screen](./screenshots/spending-summary.png)
```

## Tech Stack

* React Native
* JavaScript
* AsyncStorage
* React Navigation
* Chart library for spending summary
* Dark theme styling

## Folder Structure

```bash
NetZero/
│
├── src/
│   ├── screens/
│   │   ├── SplashScreen.jsx
│   │   ├── HomeScreen.jsx
│   │   ├── AddExpenseScreen.jsx
│   │   ├── EditExpenseScreen.jsx
│   │   └── SummaryScreen.jsx
│   │
│   ├── components/
│   │   ├── ExpenseCard.jsx
│   │   ├── CategoryTag.jsx
│   │   ├── MonthSelector.jsx
│   │   ├── EmptyState.jsx
│   │   └── TotalSpentCard.jsx
│   │
│   ├── storage/
│   │   └── expenseStorage.js
│   │
│   ├── utils/
│   │   ├── categories.js
│   │   ├── dateUtils.js
│   │   └── expenseUtils.js
│   │
│   └── navigation/
│       └── AppNavigator.jsx
│
├── App.jsx
├── package.json
└── README.md
```

## Data Storage

The app uses AsyncStorage to save expenses locally on the device.

Example expense object:

```js
{
  id: "1718370000000",
  title: "Lunch",
  amount: 450,
  category: "Food",
  date: "2026-06-14"
}
```

## Main Storage Functions

The app can use the following storage functions:

```js
getExpenses()
saveExpenses(expenses)
addExpense(expense)
updateExpense(id, updatedExpense)
deleteExpense(id)
```

## Installation

Clone the repository:

```bash
git clone https://github.com/AqifAhmed/NetZero.git
```

Go to the project folder:

```bash
cd net-zero
```

Install dependencies:

```bash
npm install
```

Start the project:

```bash
npm start
```

For Android:

```bash
npm run android
```

For iOS:

```bash
npm run ios
```

## Required Packages

Install AsyncStorage:

```bash
npm install @react-native-async-storage/async-storage
```

Install React Navigation:

```bash
npm install @react-navigation/native
```

Install required navigation dependencies:

```bash
npm install react-native-screens react-native-safe-area-context
```

Install native stack navigator:

```bash
npm install @react-navigation/native-stack
```

For charts, you can use:

```bash
npm install react-native-chart-kit react-native-svg
```

## Project Scope

The goal is to demonstrate core React Native skills such as:

* State management
* Navigation
* CRUD operations
* Local storage
* Component-based UI
* Monthly filtering
* Data visualization
* Clean mobile app design

## License

This project is open source and available under the MIT License.

## Author

Aqif Ahmed
