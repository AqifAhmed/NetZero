  AWP Semester Project
  Student: Aqif Ahmed | L1F23BSSE0095

  github: https://github.com/AqifAhmed/NetZero

STEP 1 - Project Setup
  - Created a React Native Expo app named Net Zero
  - Installed the required packages for navigation, safe area handling,
    AsyncStorage, icons, date formatting, and charts
  - Kept App.js as the main entry point for providers and navigation
  - Created a clean src folder structure:
      * components   - Reusable UI components
      * context      - Global expense state
      * navigation   - Bottom tab navigation
      * screens      - Main app screens
      * utils        - AsyncStorage helper functions
      * constants    - Theme, category colors, icons, and spacing

STEP 2 - App Wrapper and Theme
  - Wrapped the app with SafeAreaProvider for mobile safe area support
  - Wrapped all screens with ExpensesProvider so expense data is global
  - Added NavigationContainer with a custom dark theme
  - Used shared colors from src/constants/theme.js for background, text,
    cards, borders, and primary actions

STEP 3 - Bottom Tab Navigation
  - Created MainTab.js using createBottomTabNavigator
  - Added three main tabs:
      * Home
      * Expenses
      * Summary
  - Used Ionicons from @expo/vector-icons for tab icons
  - Styled the tab bar using the dark theme colors
  - Disabled default headers so each screen can control its own layout

STEP 4 - Global Expense State Using Context API
  - Created ExpensesContext.js with createContext and useContext
  - Used useReducer to manage expense actions:
      * LOAD_ALL
      * ADD
      * UPDATE
      * DELETE
      * SET_MONTH
  - Stored expenses, loading state, selected month, and selected year globally
  - Exposed helper functions:
      addExpense()
      updateExpense()
      deleteExpense()
      setMonth()
  - Derived filteredExpenses, totalThisMonth, and spendByCategory from state
  - This removed the need to pass expense data manually through many components

STEP 5 - AsyncStorage Persistence
  - Created src/utils/storage.js for local storage helpers
  - Used AsyncStorage to save expenses on the device
  - Added functions:
      loadExpenses()
      saveExpenses(expenses)
      loadSelectedDate()
      saveSelectedDate(month, year)
      generateId()
  - Loaded saved expenses when the provider mounts
  - Saved expenses whenever the list changes after loading
  - Saved the selected month and year so the app remembers the user's last view

STEP 6 - Home Dashboard Screen
  - Created HomeScreen.js as the main dashboard
  - Displayed the app name and monthly total spending
  - Showed transaction count for the selected month
  - Added MonthSelector to move between months
  - Displayed recent transactions using FlatList and ExpenseCard
  - Added an EmptyState when there are no expenses
  - Added an Add button that opens ExpenseModal

STEP 7 - Add and Edit Expense Modal
  - Created ExpenseModal.js for both adding and editing expenses
  - Used controlled inputs for:
      * title
      * amount
      * category
      * date
  - Added validation so title cannot be empty and amount must be positive
  - Added category chips using shared category colors and icons
  - Added a custom date picker modal using date-fns
  - Disabled future dates when selecting an expense date
  - If editingExpense exists, the modal loads existing expense values
  - If editingExpense is empty, the modal opens as a new expense form

STEP 8 - Expenses List and Category Filter
  - Created ExpensesScreen.js for viewing all monthly expenses
  - Added MonthSelector at the top of the list
  - Added category filter chips:
      * All
      * Food
      * Transport
      * Shopping
      * Bills
      * Other
  - Filtered expenses by selected category
  - Used ExpenseCard for each transaction
  - Enabled editing and deleting from the expenses list
  - Displayed an EmptyState when no matching expenses are found

STEP 9 - Expense Cards and Delete Handling
  - Created ExpenseCard.js to display transaction details
  - Showed title, amount, category, date, and category icon/color
  - Added edit support by opening the modal with the selected expense
  - Added delete support with confirmation before removing the expense
  - Reused the same card design in Home and Expenses screens

STEP 10 - Monthly Filtering
  - Stored selectedMonth and selectedYear inside ExpensesContext
  - Filtered expenses by comparing each expense date with the selected month/year
  - Created MonthSelector.js to move between previous and next months
  - Persisted the selected month/year using AsyncStorage
  - Used filteredExpenses across Home, Expenses, and Summary screens

STEP 11 - Spending Summary and Chart
  - Created SummaryScreen.js for monthly spending analysis
  - Calculated total spending for the selected month
  - Grouped expenses by category using spendByCategory
  - Added a PieChart using react-native-chart-kit
  - Added a custom single-category view when only one category has spending
  - Added a breakdown list showing:
      * category name
      * percentage of total spending
      * progress bar
      * amount in PKR
  - Displayed an EmptyState when no data exists for the selected month

STEP 12 - Final UI Output
  - App opens with a clean dark mobile interface
  - User can add expenses with title, amount, category, and date
  - User can edit existing expenses
  - User can delete expenses with confirmation
  - Expenses are saved offline using AsyncStorage
  - User can move between months
  - Home screen shows monthly total and recent transactions
  - Expenses screen filters transactions by category
  - Summary screen displays category-wise spending chart and breakdown


AI INTERACTION RECORD

Step 1:
  I asked AI: How should I structure a React Native Expo expense tracker project?
  AI suggested folders for components, context, navigation, screens, utils, and constants.
  I modified: Used the suggested structure but adjusted file names to match my Net Zero app.

Step 3:
  I asked AI: How can I create bottom tab navigation in React Native?
  AI gave an example using createBottomTabNavigator.
  I modified: Added only the three tabs needed for this app: Home, Expenses, and Summary.

Step 4:
  I asked AI: How can I share expense data across multiple screens?
  AI suggested using React Context with useReducer.
  I modified: Added custom actions for loading, adding, updating, deleting, and selecting month/year.

Step 5:
  I asked AI: How can I save expenses locally without a backend?
  AI suggested AsyncStorage helper functions.
  I modified: Added separate storage for both expenses and the selected month/year.

Step 6:
  I asked AI: How can one modal handle both adding and editing expenses?
  AI suggested checking whether an editing object exists.
  I modified: Added validation, category chips, and a custom date picker inside the modal.

Step 7:
  I asked AI: How can I show spending by category in a mobile app?
  AI suggested grouping data and using a chart library.
  I modified: Used react-native-chart-kit and added a fallback layout for a single category.


SOLUTIONS

Solution 1 (Offline storage):
  - Added AsyncStorage helper functions in src/utils/storage.js
  - Loaded saved expenses when the app starts
  - Saved expenses whenever the list changes

Solution 2 (Global state):
  - Created ExpensesContext.js
  - Wrapped the app with ExpensesProvider
  - Used useExpenses() in screens and components that need expense data

Solution 3 (Reusable modal):
  - Built ExpenseModal.js for both add and edit
  - Used editingExpense to decide whether to create a new expense or update an existing one
  - Added validation before saving

Solution 4 (Month filtering):
  - Stored selectedMonth and selectedYear in context
  - Converted expense.date to a Date object before comparing month/year
  - Created MonthSelector.js to update the selected month

Solution 5 (Chart display):
  - Used PieChart when more than one category has spending
  - Added a custom single-item chart view when only one category exists
  - Added category breakdown bars for easier reading

Solution 6 (Empty states):
  - Created EmptyState.js as a reusable component
  - Used it on Home, Expenses, and Summary screens when there is no data


LEARNING REFLECTION

What I understood:
  - How Expo can be used to build a mobile app quickly with React Native
  - How React Navigation creates a multi-screen mobile experience
  - How Context API and useReducer help manage shared app state
  - How AsyncStorage can keep app data saved offline without a backend
  - How controlled components make form inputs easier to manage
  - How filtering by month/year works using JavaScript Date objects
  - How category totals can be calculated with reduce()
  - How charts can make expense data easier to understand

What was difficult:
  - Managing the same expense data across multiple screens was confusing at first
  - Combining add and edit behavior in one modal required careful state resetting
  - Date handling needed attention because the app stores dates as strings
  - The chart screen needed special handling for empty data and single-category data
  - Making the UI consistent required using shared colors, spacing, and category constants

Overall:
  This assignment helped me understand how a React Native app becomes more organized
  when state, navigation, storage, and reusable components are separated properly.
  The Net Zero app demonstrates CRUD operations, local storage, month filtering,
  category summaries, and a clean mobile UI. It also helped me understand how
  React concepts such as state, context, props, forms, and effects work together
  in a complete application.
