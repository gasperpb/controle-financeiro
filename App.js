import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet, View, Text } from 'react-native';
import HomeScreen from './src/screens/HomeScreen';
import MercadoriasScreen from './src/screens/MercadoriasScreen';
import VendasScreen from './src/screens/VendasScreen';
import TabBar from './src/components/TabBar';
import { colors } from './src/styles/global';

export default function App() {
  const [activeTab, setActiveTab] = useState('clientes');

  return (
    <SafeAreaView style={styles.safeArea}>
      <StatusBar style="light" />
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Controle Financeiro</Text>
      </View>
      <View style={styles.content}>
        {activeTab === 'clientes' ? (
          <HomeScreen />
        ) : activeTab === 'mercadorias' ? (
          <MercadoriasScreen />
        ) : (
          <VendasScreen />
        )}
      </View>
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  header: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 20,
  },
  headerTitle: {
    color: '#ffffff',
    fontSize: 24,
    fontWeight: '700',
  },
  content: {
    flex: 1,
    backgroundColor: colors.background,
  },
});
