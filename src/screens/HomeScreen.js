import React, { useState } from 'react';
import {
  View, Text, StyleSheet, FlatList,
  TouchableOpacity, StatusBar, SafeAreaView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { COLORS, SPACING } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';
import ExpenseCard from '../components/ExpenseCard';
import MonthSelector from '../components/MonthSelector';
import EmptyState from '../components/EmptyState';
import ExpenseModal from '../components/ExpenseModal';

export default function HomeScreen() {
  const { filteredExpenses, totalThisMonth, loading } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);
  const [editingExpense, setEditingExpense] = useState(null);

  const handleAdd = () => { setEditingExpense(null); setModalVisible(true); };
  const handleEdit = (exp) => { setEditingExpense(exp); setModalVisible(true); };
  const handleClose = () => { setModalVisible(false); setEditingExpense(null); };

  if (loading) return <View style={styles.root} />;

  return (
    <SafeAreaView style={styles.root}>
      <StatusBar barStyle="light-content" backgroundColor={COLORS.background} />
      
      <View style={styles.header}>
        <Text style={styles.appName}>Net Zero</Text>
      </View>

      <View style={styles.heroCard}>
        <Text style={styles.heroLabel}>Total Spent</Text>
        <Text style={styles.heroAmount}>
          PKR {totalThisMonth.toLocaleString('en-PK', { minimumFractionDigits: 0 })}
        </Text>
        <Text style={styles.heroSub}>{filteredExpenses.length} transactions this month</Text>
      </View>

      <MonthSelector />

      <View style={styles.listContainer}>
        <View style={styles.sectionRow}>
          <View style={styles.sectionTitleGroup}>
            <Text style={styles.sectionTitle}>Recent Transactions</Text>
            <View style={styles.countBadge}>
              <Text style={styles.countText}>{filteredExpenses.length}</Text>
            </View>
          </View>
          
          <TouchableOpacity style={styles.addInlineButton} onPress={handleAdd} activeOpacity={0.75}>
            <Ionicons name="add" size={16} color={COLORS.primary} />
            <Text style={styles.addInlineButtonText}>Add</Text>
          </TouchableOpacity>
        </View>

        <FlatList
          data={filteredExpenses.slice(0, 20)}
          keyExtractor={(item) => item.id}
          renderItem={({ item }) => <ExpenseCard expense={item} onEdit={handleEdit} showDelete={false} />}
          ListEmptyComponent={
            <EmptyState
              icon="wallet-outline"
              title="No expenses yet"
              subtitle="Tap Add to log your first expense for this month"
            />
          }
          contentContainerStyle={styles.list}
          showsVerticalScrollIndicator={false}
          alwaysBounceVertical={true}
        />
      </View>
      
      <ExpenseModal
        visible={modalVisible}
        onClose={handleClose}
        editingExpense={editingExpense}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.sm,
    paddingBottom: SPACING.xs,
  },
  appName: { color: COLORS.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  heroCard: {
    margin: SPACING.md,
    marginTop: SPACING.sm,
    backgroundColor: COLORS.primary,
    borderRadius: 20,
    padding: SPACING.lg,
    gap: SPACING.xs,
  },
  heroLabel: {
    color: 'rgba(255,255,255,0.7)', fontSize: 13, fontWeight: '500',
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  heroAmount: { color: '#fff', fontSize: 36, fontWeight: '700', letterSpacing: -1 },
  heroSub: { color: 'rgba(255,255,255,0.6)', fontSize: 13 },
  listContainer: {
    flex: 1,
  },
  sectionRow: {
    flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between',
    paddingHorizontal: SPACING.md, paddingTop: SPACING.md, paddingBottom: SPACING.sm,
  },
  sectionTitleGroup: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.xs + 2,
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  countBadge: {
    backgroundColor: COLORS.surface,
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  countText: {
    color: COLORS.textSecondary,
    fontSize: 11,
    fontWeight: '600',
  },
  addInlineButton: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    paddingHorizontal: SPACING.sm + 2,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 4,
    elevation: 2,
  },
  addInlineButtonText: {
    color: COLORS.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 60 },
});
