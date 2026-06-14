import React, { useState, useEffect } from 'react';
import {
  View, Text, StyleSheet, Modal, TextInput,
  TouchableOpacity, ScrollView, Platform, KeyboardAvoidingView,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek,
  eachDayOfInterval, isSameDay, isSameMonth, addMonths, subMonths, parseISO,
} from 'date-fns';
import { COLORS, SPACING, CATEGORIES, CATEGORY_COLORS, CATEGORY_ICONS } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';

const EMPTY_FORM = {
  title: '',
  amount: '',
  category: 'Food',
  date: format(new Date(), 'yyyy-MM-dd'),
};

export default function ExpenseModal({ visible, onClose, editingExpense }) {
  const { addExpense, updateExpense } = useExpenses();
  const [form, setForm] = useState(EMPTY_FORM);
  const [errors, setErrors] = useState({});
  const [calendarVisible, setCalendarVisible] = useState(false);
  
  const selectedDate = form.date ? parseISO(form.date) : new Date();
  const [currentMonth, setCurrentMonth] = useState(selectedDate);
  
  const isEditing = !!editingExpense;

  useEffect(() => {
    if (editingExpense) {
      setForm({
        title: editingExpense.title,
        amount: String(editingExpense.amount),
        category: editingExpense.category,
        date: editingExpense.date,
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setErrors({});
  }, [editingExpense, visible]);

  useEffect(() => {
    if (form.date) {
      setCurrentMonth(parseISO(form.date));
    }
  }, [form.date]);

  const monthStart = startOfMonth(currentMonth);
  const monthEnd = endOfMonth(monthStart);
  const startDate = startOfWeek(monthStart, { weekStartsOn: 1 });
  const endDate = endOfWeek(monthEnd, { weekStartsOn: 1 });
  const dayRange = eachDayOfInterval({ start: startDate, end: endDate });

  const validate = () => {
    const e = {};
    if (!form.title.trim()) e.title = 'Title is required';
    if (!form.amount || isNaN(Number(form.amount)) || Number(form.amount) <= 0)
      e.amount = 'Enter a valid amount';
    return e;
  };

  const handleSave = () => {
    const e = validate();
    if (Object.keys(e).length) { setErrors(e); return; }
    const payload = { ...form, amount: Number(form.amount) };
    if (isEditing) updateExpense({ ...editingExpense, ...payload });
    else addExpense(payload);
    onClose();
  };

  const set = (key) => (val) => setForm((f) => ({ ...f, [key]: val }));

  return (
    <Modal visible={visible} animationType="slide" presentationStyle="pageSheet" onRequestClose={onClose}>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.root}
      >
        <View style={styles.header}>
          <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
            <Ionicons name="close" size={22} color={COLORS.textSecondary} />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>{isEditing ? 'Edit Expense' : 'Add Expense'}</Text>
          <TouchableOpacity onPress={handleSave} style={styles.saveBtn}>
            <Text style={styles.saveBtnText}>Save</Text>
          </TouchableOpacity>
        </View>

        <ScrollView contentContainerStyle={styles.body} keyboardShouldPersistTaps="handled">
          <Text style={styles.label}>Title</Text>
          <TextInput
            style={[styles.input, errors.title && styles.inputError]}
            placeholder="e.g. Lunch at Bundu Khan"
            placeholderTextColor={COLORS.textMuted}
            value={form.title}
            onChangeText={set('title')}
          />
          {errors.title && <Text style={styles.errorText}>{errors.title}</Text>}

          <Text style={styles.label}>Amount (PKR)</Text>
          <TextInput
            style={[styles.input, errors.amount && styles.inputError]}
            placeholder="0"
            placeholderTextColor={COLORS.textMuted}
            value={form.amount}
            onChangeText={set('amount')}
            keyboardType="numeric"
          />
          {errors.amount && <Text style={styles.errorText}>{errors.amount}</Text>}

          <Text style={styles.label}>Date</Text>
          <TouchableOpacity
            style={styles.dateSelector}
            onPress={() => setCalendarVisible(true)}
            activeOpacity={0.7}
          >
            <Text style={styles.dateSelectorText}>
              {format(selectedDate, 'MMMM d, yyyy')}
            </Text>
            <Ionicons name="calendar-outline" size={20} color={COLORS.textSecondary} />
          </TouchableOpacity>

          <Text style={styles.label}>Category</Text>
          <View style={styles.categoryGrid}>
            {CATEGORIES.map((cat) => {
              const color = CATEGORY_COLORS[cat];
              const icon = CATEGORY_ICONS[cat];
              const selected = form.category === cat;
              return (
                <TouchableOpacity
                  key={cat}
                  style={[
                    styles.catChip,
                    selected && { backgroundColor: color + '33', borderColor: color },
                  ]}
                  onPress={() => set('category')(cat)}
                  activeOpacity={0.7}
                >
                  <Ionicons name={icon} size={16} color={selected ? color : COLORS.textMuted} />
                  <Text style={[styles.catLabel, selected && { color }]}>{cat}</Text>
                </TouchableOpacity>
              );
            })}
          </View>
        </ScrollView>

        <Modal
          visible={calendarVisible}
          transparent={true}
          animationType="fade"
          onRequestClose={() => setCalendarVisible(false)}
        >
          <TouchableOpacity
            style={styles.calOverlay}
            activeOpacity={1}
            onPress={() => setCalendarVisible(false)}
          >
            <TouchableOpacity
              style={styles.calContent}
              activeOpacity={1}
            >
              <View style={styles.calHeader}>
                <TouchableOpacity onPress={() => setCurrentMonth(subMonths(currentMonth, 1))}>
                  <Ionicons name="chevron-back" size={20} color={COLORS.text} />
                </TouchableOpacity>
                <Text style={styles.calMonthText}>
                  {format(currentMonth, 'MMMM yyyy')}
                </Text>
                {(() => {
                  const today = new Date();
                  const isCurrentMonthOrFuture =
                    currentMonth.getMonth() === today.getMonth() &&
                    currentMonth.getFullYear() === today.getFullYear();
                  return (
                    <TouchableOpacity
                      onPress={() => setCurrentMonth(addMonths(currentMonth, 1))}
                      disabled={isCurrentMonthOrFuture}
                      style={isCurrentMonthOrFuture && { opacity: 0.25 }}
                    >
                      <Ionicons name="chevron-forward" size={20} color={COLORS.text} />
                    </TouchableOpacity>
                  );
                })()}
              </View>

              <View style={styles.weekdaysRow}>
                {['M', 'T', 'W', 'T', 'F', 'S', 'S'].map((d, index) => (
                  <Text key={index} style={styles.weekdayText}>{d}</Text>
                ))}
              </View>

              <View style={styles.daysGrid}>
                {dayRange.map((day) => {
                  const isCurrent = isSameMonth(day, currentMonth);
                  const isSelected = isSameDay(day, selectedDate);
                  const isToday = isSameDay(day, new Date());
                  
                  // Disable future dates
                  const todayEnd = new Date();
                  todayEnd.setHours(23, 59, 59, 999);
                  const isFuture = day > todayEnd;
                  
                  return (
                    <TouchableOpacity
                      key={day.toISOString()}
                      style={[
                        styles.dayButton,
                        isSelected && styles.selectedDayButton,
                      ]}
                      onPress={() => {
                        set('date')(format(day, 'yyyy-MM-dd'));
                        setCalendarVisible(false);
                      }}
                      disabled={isFuture}
                      activeOpacity={0.7}
                    >
                      <Text
                        style={[
                          styles.dayText,
                          !isCurrent && styles.mutedDayText,
                          isToday && styles.todayDayText,
                          isSelected && styles.selectedDayText,
                          isFuture && styles.futureDayText,
                        ]}
                      >
                        {format(day, 'd')}
                      </Text>
                    </TouchableOpacity>
                  );
                })}
              </View>

              <View style={styles.calFooter}>
                <TouchableOpacity
                  style={styles.todayBtn}
                  onPress={() => {
                    set('date')(format(new Date(), 'yyyy-MM-dd'));
                    setCalendarVisible(false);
                  }}
                  activeOpacity={0.7}
                >
                  <Text style={styles.todayBtnText}>Today</Text>
                </TouchableOpacity>
                <TouchableOpacity
                  style={styles.closeBtnCal}
                  onPress={() => setCalendarVisible(false)}
                  activeOpacity={0.7}
                >
                  <Text style={styles.closeBtnCalText}>Close</Text>
                </TouchableOpacity>
              </View>
            </TouchableOpacity>
          </TouchableOpacity>
        </Modal>
      </KeyboardAvoidingView>
    </Modal>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.md,
    borderBottomWidth: 1,
    borderColor: COLORS.border,
  },
  closeBtn: {
    width: 36, height: 36, borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center', justifyContent: 'center',
  },
  headerTitle: { color: COLORS.text, fontSize: 17, fontWeight: '600' },
  saveBtn: {
    backgroundColor: COLORS.primary,
    paddingHorizontal: SPACING.md,
    paddingVertical: SPACING.xs + 2,
    borderRadius: 10,
  },
  saveBtnText: { color: '#fff', fontWeight: '600', fontSize: 14 },
  body: { padding: SPACING.md, gap: SPACING.xs },
  label: {
    color: COLORS.textSecondary, fontSize: 13, fontWeight: '500',
    marginTop: SPACING.md, marginBottom: SPACING.xs,
    textTransform: 'uppercase', letterSpacing: 0.5,
  },
  input: {
    backgroundColor: COLORS.surface, borderWidth: 1,
    borderColor: COLORS.border, borderRadius: 12,
    padding: SPACING.md, color: COLORS.text, fontSize: 15,
  },
  inputError: { borderColor: COLORS.accent },
  errorText: { color: COLORS.accent, fontSize: 12, marginTop: 4 },
  categoryGrid: { flexDirection: 'row', flexWrap: 'wrap', gap: SPACING.sm, marginTop: SPACING.xs },
  catChip: {
    flexDirection: 'row', alignItems: 'center', gap: SPACING.xs,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm,
    borderRadius: 20, borderWidth: 1, borderColor: COLORS.border,
    backgroundColor: COLORS.surface,
  },
  catLabel: { color: COLORS.textMuted, fontSize: 13, fontWeight: '500' },
  dateSelector: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: COLORS.surface,
    borderWidth: 1,
    borderColor: COLORS.border,
    borderRadius: 12,
    padding: SPACING.md,
  },
  dateSelectorText: {
    color: COLORS.text,
    fontSize: 15,
  },
  calOverlay: {
    flex: 1,
    backgroundColor: 'rgba(15, 23, 42, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    padding: SPACING.lg,
  },
  calContent: {
    width: '100%',
    maxWidth: 320,
    backgroundColor: COLORS.surface,
    borderRadius: 20,
    padding: SPACING.md,
    borderWidth: 1,
    borderColor: COLORS.border,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  calHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: SPACING.md,
    paddingHorizontal: SPACING.xs,
  },
  calMonthText: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '700',
  },
  weekdaysRow: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: SPACING.sm,
  },
  weekdayText: {
    color: COLORS.textMuted,
    fontSize: 12,
    fontWeight: '600',
    width: 38,
    textAlign: 'center',
  },
  daysGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-around',
    gap: 2,
  },
  dayButton: {
    width: 38,
    height: 38,
    borderRadius: 19,
    alignItems: 'center',
    justifyContent: 'center',
    marginVertical: 2,
  },
  selectedDayButton: {
    backgroundColor: COLORS.primary,
  },
  dayText: {
    color: COLORS.text,
    fontSize: 14,
    fontWeight: '500',
  },
  mutedDayText: {
    color: COLORS.textMuted,
    opacity: 0.35,
  },
  todayDayText: {
    color: COLORS.primary,
    fontWeight: '700',
  },
  selectedDayText: {
    color: COLORS.text,
    fontWeight: '700',
  },
  calFooter: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: SPACING.md,
    borderTopWidth: 1,
    borderColor: COLORS.border,
    paddingTop: SPACING.sm,
  },
  todayBtn: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  todayBtnText: {
    color: COLORS.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  closeBtnCal: {
    paddingVertical: SPACING.xs,
    paddingHorizontal: SPACING.md,
  },
  closeBtnCalText: {
    color: COLORS.textSecondary,
    fontWeight: '600',
    fontSize: 14,
  },
  futureDayText: {
    color: COLORS.textMuted,
    opacity: 0.15,
  },
});
