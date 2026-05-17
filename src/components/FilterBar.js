import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/global';

const FILTERS = [
  { label: 'Todas', value: 'todas' },
  { label: 'À Vista', value: 'avista' },
  { label: 'Dívidas', value: 'divida' },
];

const FilterBar = ({ activeFilter, onFilterChange }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        paddingHorizontal: 16,
        paddingVertical: 12,
        gap: 8,
      }}
    >
      {FILTERS.map((f) => {
        const isActive = activeFilter === f.value;
        return (
          <TouchableOpacity
            key={f.value}
            onPress={() => onFilterChange(f.value)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: isActive
                ? colors.primary
                : colors.surface,
              alignItems: 'center',
              justifyContent: 'center',
              shadowColor: '#000',
              shadowOffset: { width: 0, height: 1 },
              shadowOpacity: 0.06,
              shadowRadius: 3,
              elevation: 1,
            }}
          >
            <Text
              style={{
                fontSize: 13,
                fontWeight: '600',
                color: isActive ? '#ffffff' : colors.text,
              }}
            >
              {f.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default FilterBar;
