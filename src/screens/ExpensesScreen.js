import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList, TouchableOpacity, SafeAreaView,
} from 'react-native';
import { COLORS, SPACING, CATEGORIES, CATEGORY_COLORS } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';
import ExpenseCard from '../components/ExpenseCard';
import MonthSelector from '../components/MonthSelector';
import EmptyState from '../components/EmptyState';
import ExpenseModal from '../components/ExpenseModal';

export default function ExpensesScreen() {
  const { filteredExpenses } = useExpenses();
  const [activeFilter, setActiveFilter] = useState('All');
  const [editingExpense, setEditingExpense] = useState(null);

  const filters = ['All', ...CATEGORIES];
  const displayed =
    activeFilter === 'All'
      ? filteredExpenses
      : filteredExpenses.filter((e) => e.category === activeFilter);

  const ListHeader = () => (
    <View>
      <MonthSelector />
      <FlatList
        horizontal
        data={filters}
        keyExtractor={(i) => i}
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.chips}
        renderItem={({ item }) => {
          const color = item === 'All' ? COLORS.primary : CATEGORY_COLORS[item];
          const active = activeFilter === item;
          return (
            <TouchableOpacity
              style={[styles.chip, active && { backgroundColor: color + '33', borderColor: color }]}
              onPress={() => setActiveFilter(item)}
              activeOpacity={0.7}
            >
              <Text style={[styles.chipText, active && { color }]}>{item}</Text>
            </TouchableOpacity>
          );
        }}
      />
      <View style={styles.countRow}>
        <Text style={styles.countText}>{displayed.length} expenses</Text>
      </View>
    </View>
  );

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Expenses</Text>
      </View>
      <FlatList
        data={displayed}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <ExpenseCard expense={item} onEdit={(exp) => setEditingExpense(exp)} showDelete={true} />
        )}
        ListHeaderComponent={ListHeader}
        ListEmptyComponent={
          <EmptyState
            icon="search-outline"
            title="No expenses found"
            subtitle={
              activeFilter !== 'All'
                ? `No ${activeFilter} expenses this month`
                : 'No expenses logged for this month'
            }
          />
        }
        contentContainerStyle={styles.list}
        showsVerticalScrollIndicator={false}
      />
      <ExpenseModal
        visible={!!editingExpense}
        onClose={() => setEditingExpense(null)}
        editingExpense={editingExpense}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.xs },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  chips: { paddingHorizontal: SPACING.md, gap: SPACING.sm, paddingBottom: SPACING.sm },
  chip: {
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm - 2,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border, backgroundColor: COLORS.surface,
  },
  chipText: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  countRow: { paddingHorizontal: SPACING.md, paddingBottom: SPACING.sm },
  countText: { color: COLORS.textMuted, fontSize: 12 },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 100 },
});
