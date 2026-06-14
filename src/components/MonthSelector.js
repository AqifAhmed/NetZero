import React, { useRef, useEffect } from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { format, subMonths } from 'date-fns';
import { useIsFocused } from '@react-navigation/native';
import { COLORS, SPACING } from '../constants/theme';
import { useExpenses } from '../context/ExpensesContext';

const CONTAINER_WIDTH = 160;

export default function MonthSelector() {
  const { selectedMonth, selectedYear, setMonth } = useExpenses();
  const flatListRef = useRef(null);
  const isUserGesture = useRef(false);

  // Generate last 24 months ending at the current month
  const today = new Date();
  const months = [];
  for (let i = 23; i >= 0; i--) {
    months.push(subMonths(today, i));
  }

  const selectedIndex = months.findIndex(
    (m) => m.getMonth() === selectedMonth && m.getFullYear() === selectedYear
  );

  const isFocused = useIsFocused();
  const wasFocusedRef = useRef(false);

  useEffect(() => {
    if (isFocused) {
      if (selectedIndex !== -1 && flatListRef.current) {
        const shouldAnimate = wasFocusedRef.current;
        const timer = setTimeout(() => {
          flatListRef.current?.scrollToIndex({
            index: selectedIndex,
            animated: shouldAnimate,
          });
        }, 50);
        wasFocusedRef.current = true;
        return () => clearTimeout(timer);
      }
    } else {
      wasFocusedRef.current = false;
    }
  }, [selectedIndex, isFocused]);

  const handleScroll = (event) => {
    if (!isUserGesture.current) return;
    isUserGesture.current = false;

    const xOffset = event.nativeEvent.contentOffset.x;
    const index = Math.round(xOffset / CONTAINER_WIDTH);
    if (index >= 0 && index < months.length && index !== selectedIndex) {
      const target = months[index];
      setMonth(target.getMonth(), target.getFullYear());
    }
  };

  const goBack = () => {
    if (selectedIndex > 0) {
      const prev = months[selectedIndex - 1];
      setMonth(prev.getMonth(), prev.getFullYear());
    }
  };

  const goForward = () => {
    if (selectedIndex < months.length - 1) {
      const next = months[selectedIndex + 1];
      setMonth(next.getMonth(), next.getFullYear());
    }
  };

  const isFirstMonth = selectedIndex === 0;
  const isCurrentMonth = selectedIndex === months.length - 1;

  return (
    <View style={styles.container}>
      <TouchableOpacity 
        onPress={goBack} 
        style={[styles.btn, isFirstMonth && styles.disabled]}
        disabled={isFirstMonth}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="chevron-back" 
          size={18} 
          color={isFirstMonth ? COLORS.border : COLORS.textSecondary} 
        />
      </TouchableOpacity>

      <View style={styles.swipeContainer}>
        <FlatList
          ref={flatListRef}
          horizontal
          pagingEnabled
          data={months}
          keyExtractor={(item) => item.toISOString()}
          showsHorizontalScrollIndicator={false}
          onScrollBeginDrag={() => { isUserGesture.current = true; }}
          onMomentumScrollEnd={handleScroll}
          snapToInterval={CONTAINER_WIDTH}
          decelerationRate="fast"
          disableIntervalMomentum={true}
          getItemLayout={(data, index) => ({
            length: CONTAINER_WIDTH,
            offset: CONTAINER_WIDTH * index,
            index,
          })}
          renderItem={({ item }) => (
            <View style={styles.monthLabelWrapper}>
              <Text style={styles.label}>{format(item, 'MMMM yyyy')}</Text>
            </View>
          )}
        />
      </View>

      <TouchableOpacity 
        onPress={goForward} 
        style={[styles.btn, isCurrentMonth && styles.disabled]}
        disabled={isCurrentMonth}
        activeOpacity={0.7}
      >
        <Ionicons 
          name="chevron-forward" 
          size={18} 
          color={isCurrentMonth ? COLORS.border : COLORS.textSecondary} 
        />
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: SPACING.lg,
    paddingVertical: SPACING.sm,
  },
  btn: {
    width: 36,
    height: 36,
    borderRadius: 10,
    backgroundColor: COLORS.surface,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: COLORS.border,
  },
  disabled: { 
    opacity: 0.25,
  },
  swipeContainer: {
    width: CONTAINER_WIDTH,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  monthLabelWrapper: {
    width: CONTAINER_WIDTH,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    color: COLORS.text,
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});
