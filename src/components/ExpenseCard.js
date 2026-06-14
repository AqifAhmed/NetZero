import React, { useState } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Modal } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format } from 'date-fns';
import { COLORS, SPACING, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';

export default function ExpenseCard({ expense, onEdit, showDelete = true }) {
  const { deleteExpense } = useExpenses();
  const [modalVisible, setModalVisible] = useState(false);
  const color = CATEGORY_COLORS[expense.category] || COLORS.textMuted;
  const icon = CATEGORY_ICONS[expense.category] || 'ellipsis-horizontal-circle';

  const handleDelete = () => {
    deleteExpense(expense.id);
    setModalVisible(false);
  };

  return (
    <>
      <TouchableOpacity style={styles.card} onPress={() => onEdit(expense)} activeOpacity={0.7}>
        <View style={[styles.iconBox, { backgroundColor: color + '22' }]}>
          <Ionicons name={icon} size={22} color={color} />
        </View>
        <View style={styles.info}>
          <Text style={styles.title} numberOfLines={1}>{expense.title}</Text>
          <Text style={styles.date}>{format(new Date(expense.date), 'MMM d, yyyy')}</Text>
        </View>
        <View style={styles.right}>
          <Text style={styles.amount}>PKR {Number(expense.amount).toLocaleString()}</Text>
          {showDelete && (
            <TouchableOpacity 
              onPress={() => setModalVisible(true)} 
              hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
            >
              <Ionicons name="trash-outline" size={16} color={COLORS.textMuted} />
            </TouchableOpacity>
          )}
        </View>
      </TouchableOpacity>

      <Modal
        visible={modalVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setModalVisible(false)}
      >
        <TouchableOpacity 
          style={styles.modalOverlay} 
          activeOpacity={1} 
          onPress={() => setModalVisible(false)}
        >
          <TouchableOpacity 
            style={styles.modalContent} 
            activeOpacity={1}
          >
            <View style={styles.dangerIconContainer}>
              <Ionicons name="trash-outline" size={28} color={COLORS.accent} />
            </View>
            <Text style={styles.modalTitle}>Delete Transaction</Text>
            <Text style={styles.modalText}>
              Are you sure you want to delete <Text style={styles.highlightText}>"{expense.title}"</Text> of <Text style={styles.highlightText}>PKR {Number(expense.amount).toLocaleString()}</Text>? This action cannot be undone.
            </Text>
            <View style={styles.buttonContainer}>
              <TouchableOpacity 
                style={styles.cancelButton} 
                onPress={() => setModalVisible(false)}
                activeOpacity={0.8}
              >
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
              <TouchableOpacity 
                style={styles.deleteButton} 
                onPress={handleDelete}
                activeOpacity={0.8}
              >
                <Text style={styles.deleteButtonText}>Delete</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </TouchableOpacity>
      </Modal>
    </>
  );
}

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: COLORS.surface,
    borderRadius: 14,
    padding: SPACING.md,
    marginBottom: SPACING.sm,
    gap: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  iconBox: {
    width: 44,
    height: 44,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  info: { flex: 1, gap: 2 },
  title: { color: COLORS.text, fontSize: 15, fontWeight: '500' },
  date: { color: COLORS.textMuted, fontSize: 12 },
  right: { alignItems: 'flex-end', gap: 6 },
  amount: { color: COLORS.text, fontSize: 15, fontWeight: '600' },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.85)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  modalContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.lg,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  dangerIconContainer: {
    width: 58,
    height: 58,
    borderRadius: 29,
    backgroundColor: 'rgba(239, 68, 68, 0.15)',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: SPACING.md,
  },
  modalTitle: {
    color: COLORS.text,
    fontSize: 18,
    fontWeight: '700',
    marginBottom: SPACING.sm,
    textAlign: 'center',
  },
  modalText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: SPACING.lg,
  },
  highlightText: {
    color: COLORS.text,
    fontWeight: '600',
  },
  buttonContainer: {
    flexDirection: 'row',
    gap: SPACING.md,
    width: '100%',
  },
  cancelButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 12,
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: COLORS.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButtonText: {
    color: COLORS.textSecondary,
    fontSize: 14,
    fontWeight: '600',
  },
  deleteButton: {
    flex: 1,
    paddingVertical: SPACING.sm + 2,
    borderRadius: 12,
    backgroundColor: COLORS.accent,
    alignItems: 'center',
    justifyContent: 'center',
  },
  deleteButtonText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '600',
  },
});
