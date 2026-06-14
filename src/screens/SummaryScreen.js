import React from 'react';
import { View, Text, StyleSheet, ScrollView, Dimensions, FlatList } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { PieChart } from 'react-native-chart-kit';
import { COLORS, SPACING, CATEGORIES, CATEGORY_COLORS } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';
import MonthSelector from '../components/MonthSelector';
import EmptyState from '../components/EmptyState';

const { width } = Dimensions.get('window');

export default function SummaryScreen() {
  const { spendByCategory, totalThisMonth, filteredExpenses } = useExpenses();

  const chartData = CATEGORIES
    .filter((cat) => spendByCategory[cat] > 0)
    .map((cat) => ({
      name: cat,
      amount: spendByCategory[cat],
      color: CATEGORY_COLORS[cat],
      legendFontColor: COLORS.textSecondary,
      legendFontSize: 13,
    }));

  const isEmpty = filteredExpenses.length === 0;

  return (
    <SafeAreaView style={styles.root}>
      <View style={styles.header}>
        <Text style={styles.title}>Summary</Text>
      </View>
      
      {/* Fixed section always shown at the top */}
      <View style={styles.fixedContent}>
        <MonthSelector />
        
        {!isEmpty && (
          <>
            <View style={styles.totalCard}>
              <Text style={styles.totalLabel}>Total this month</Text>
              <Text style={styles.totalAmount}>PKR {totalThisMonth.toLocaleString()}</Text>
            </View>

            <View style={styles.chartCard}>
              <Text style={styles.cardLabel}>Spending by Category</Text>
              {chartData.length === 1 ? (
                <View style={styles.singleItemChartContainer}>
                  <View style={styles.singleItemLeft}>
                    <View style={[styles.singleItemCircle, { backgroundColor: chartData[0].color }]} />
                  </View>
                  <View style={styles.singleItemRight}>
                    <View style={styles.singleItemLegendRow}>
                      <View style={[styles.singleItemLegendDot, { backgroundColor: chartData[0].color }]} />
                      <Text style={styles.singleItemLegendText}>
                        {chartData[0].name}  100%
                      </Text>
                    </View>
                  </View>
                </View>
              ) : (
                <PieChart
                  data={chartData}
                  width={width - SPACING.md * 4}
                  height={130}
                  chartConfig={{ color: (opacity = 1) => `rgba(255,255,255,${opacity})` }}
                  accessor="amount"
                  backgroundColor="transparent"
                  paddingLeft="10"
                  absolute={false}
                />
              )}
            </View>
          </>
        )}
      </View>

      {/* Scrollable list content */}
      {isEmpty ? (
        <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
          <EmptyState
            icon="pie-chart-outline"
            title="No data yet"
            subtitle="Add some expenses to see your spending breakdown"
          />
        </ScrollView>
      ) : (
        <View style={styles.scrollContainer}>
          <View style={styles.breakdownHeader}>
            <Text style={styles.sectionTitle}>Breakdown</Text>
          </View>
          
          <FlatList
            data={CATEGORIES.filter((c) => spendByCategory[c] > 0)}
            keyExtractor={(cat) => cat}
            renderItem={({ item: cat }) => {
              const amount = spendByCategory[cat];
              const pct = totalThisMonth > 0 ? (amount / totalThisMonth) * 100 : 0;
              const color = CATEGORY_COLORS[cat];
              return (
                <View key={cat} style={styles.barRow}>
                  <View style={styles.barMeta}>
                    <View style={[styles.dot, { backgroundColor: color }]} />
                    <Text style={styles.barLabel}>{cat}</Text>
                    <Text style={styles.barPct}>{pct.toFixed(0)}%</Text>
                  </View>
                  <View style={styles.barTrack}>
                    <View style={[styles.barFill, { width: `${pct}%`, backgroundColor: color }]} />
                  </View>
                  <Text style={styles.barAmount}>PKR {amount.toLocaleString()}</Text>
                </View>
              );
            }}
            contentContainerStyle={styles.list}
            showsVerticalScrollIndicator={false}
          />
        </View>
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: { flex: 1, backgroundColor: COLORS.background },
  header: { paddingHorizontal: SPACING.md, paddingTop: SPACING.sm, paddingBottom: SPACING.xs },
  title: { color: COLORS.text, fontSize: 26, fontWeight: '700', letterSpacing: -0.5 },
  body: { padding: SPACING.md, paddingTop: 0, paddingBottom: 100, gap: SPACING.md },
  fixedContent: {
    paddingHorizontal: SPACING.md,
    gap: SPACING.md,
    paddingBottom: SPACING.xs,
  },
  chartCard: {
    backgroundColor: COLORS.surface, borderRadius: 18,
    paddingHorizontal: SPACING.md, paddingVertical: SPACING.sm, borderWidth: 1, borderColor: COLORS.border,
  },
  cardLabel: {
    color: COLORS.textSecondary, fontSize: 13, fontWeight: '500',
    textTransform: 'uppercase', letterSpacing: 0.5, marginBottom: SPACING.sm,
  },
  scrollContainer: {
    flex: 1,
  },
  breakdownHeader: {
    paddingHorizontal: SPACING.md,
    paddingTop: SPACING.md,
    paddingBottom: SPACING.sm,
  },
  sectionTitle: { color: COLORS.text, fontSize: 16, fontWeight: '600' },
  barRow: { gap: SPACING.xs },
  barMeta: { flexDirection: 'row', alignItems: 'center', gap: SPACING.sm },
  dot: { width: 8, height: 8, borderRadius: 4 },
  barLabel: { color: COLORS.text, fontSize: 14, fontWeight: '500', flex: 1 },
  barPct: { color: COLORS.textMuted, fontSize: 13 },
  barTrack: { height: 6, backgroundColor: COLORS.surfaceElevated, borderRadius: 3, overflow: 'hidden' },
  barFill: { height: '100%', borderRadius: 3 },
  barAmount: { color: COLORS.textSecondary, fontSize: 13, textAlign: 'right' },
  totalCard: {
    backgroundColor: COLORS.surfaceElevated, borderRadius: 14, padding: SPACING.md,
    flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center',
    borderWidth: 1, borderColor: COLORS.border,
  },
  totalLabel: { color: COLORS.textSecondary, fontSize: 14 },
  totalAmount: { color: COLORS.text, fontSize: 18, fontWeight: '700' },
  list: { paddingHorizontal: SPACING.md, paddingBottom: 40, gap: SPACING.md },
  singleItemChartContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    height: 130,
    width: '100%',
  },
  singleItemLeft: {
    width: '50%',
    alignItems: 'center',
    justifyContent: 'center',
  },
  singleItemCircle: {
    width: 96,
    height: 96,
    borderRadius: 48,
    transform: [{ translateX: 10 }],
  },
  singleItemRight: {
    width: '50%',
    justifyContent: 'center',
    paddingLeft: 20,
  },
  singleItemLegendRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: SPACING.sm,
  },
  singleItemLegendDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  singleItemLegendText: {
    color: COLORS.textSecondary,
    fontSize: 13,
    fontWeight: '500',
  },
});
