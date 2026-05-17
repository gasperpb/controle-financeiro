import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import { colors } from '../styles/global';

const TABS = [
  { key: 'clientes', label: 'Clientes' },
  { key: 'mercadorias', label: 'Mercadorias' },
  { key: 'vendas', label: 'Vendas' },
];

const TabBar = ({ activeTab, onTabChange }) => {
  return (
    <View
      style={{
        flexDirection: 'row',
        backgroundColor: colors.primary,
        paddingHorizontal: 16,
        paddingBottom: 8,
        gap: 4,
      }}
    >
      {TABS.map((tab) => {
        const isActive = activeTab === tab.key;
        return (
          <TouchableOpacity
            key={tab.key}
            onPress={() => onTabChange(tab.key)}
            style={{
              flex: 1,
              paddingVertical: 10,
              borderRadius: 8,
              backgroundColor: isActive
                ? 'rgba(255,255,255,0.2)'
                : 'transparent',
              alignItems: 'center',
            }}
          >
            <Text
              style={{
                fontSize: 14,
                fontWeight: '600',
                color: isActive ? '#ffffff' : 'rgba(255,255,255,0.7)',
              }}
            >
              {tab.label}
            </Text>
          </TouchableOpacity>
        );
      })}
    </View>
  );
};

export default TabBar;
