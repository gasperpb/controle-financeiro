import React, { useState } from 'react';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaView, StyleSheet } from 'react-native';
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
      <TabBar activeTab={activeTab} onTabChange={setActiveTab} />
      {activeTab === 'clientes' ? (
        <HomeScreen />
      ) : activeTab === 'mercadorias' ? (
        <MercadoriasScreen />
      ) : (
        <VendasScreen />
      )}
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: colors.primary,
  },
});
