import React, { useState, useCallback, useEffect } from 'react';
import {
  View,
  Text,
  FlatList,
  TouchableOpacity,
  Alert,
  Modal,
  ScrollView,
} from 'react-native';
import styles, { colors } from '../styles/global';
import ClientCard from '../components/ClientCard';
import ClientForm from '../components/ClientForm';
import FilterBar from '../components/FilterBar';
import {
  initStorage,
  getClients,
  addClient,
  updateClient,
  deleteClient,
  filterClients,
  getVendas,
} from '../utils/storage';

const HomeScreen = () => {
  const [clients, setClients] = useState(getClients());
  const [filter, setFilter] = useState('todas');
  const [modalVisible, setModalVisible] = useState(false);
  const [editingClient, setEditingClient] = useState(null);
  const [vendasCliente, setVendasCliente] = useState(null);

  const filteredClients = filterClients(filter);
  const totalDividas = clients
    .filter((c) => c.formaPagamento === 'divida' && !c.pago)
    .reduce((acc, c) => acc + c.valor, 0);
  const totalAvista = clients
    .filter((c) => c.formaPagamento === 'avista')
    .reduce((acc, c) => acc + c.valor, 0);

  const allVendas = getVendas();
  const vendasPorCliente = {};
  allVendas.forEach((v) => {
    if (v.clienteId) {
      if (!vendasPorCliente[v.clienteId])
        vendasPorCliente[v.clienteId] = [];
      vendasPorCliente[v.clienteId].push(v);
    }
  });

  useEffect(() => {
    initStorage().then(() => setClients([...getClients()]));
  }, []);

  const refresh = useCallback(() => {
    setClients([...getClients()]);
  }, []);

  const addMonths = (dateStr, months) => {
    const [day, month, year] = dateStr.split('/').map(Number);
    const date = new Date(year, month - 1, day);
    date.setMonth(date.getMonth() + months);
    const d = String(date.getDate()).padStart(2, '0');
    const m = String(date.getMonth() + 1).padStart(2, '0');
    return `${d}/${m}/${date.getFullYear()}`;
  };

  const handleAdd = async (data) => {
    if (data.formaPagamento === 'divida' && data.parcelas > 1) {
      const valorParcela = data.valor / data.parcelas;
      for (let i = 1; i <= data.parcelas; i++) {
        await addClient({
          nome: data.nome,
          tipoGasto: data.tipoGasto,
          valor: valorParcela,
          formaPagamento: 'divida',
          dataPagamento: addMonths(data.dataPagamento, i - 1),
          parcelaInfo: { atual: i, total: data.parcelas },
        });
      }
    } else {
      const { parcelas, ...cleanData } = data;
      await addClient(cleanData);
    }
    refresh();
    setModalVisible(false);
  };

  const handleEdit = async (data) => {
    const { parcelas, ...cleanData } = data;
    await updateClient(editingClient.id, cleanData);
    refresh();
    setEditingClient(null);
    setModalVisible(false);
  };

  const handleMarkAsPaid = (client) => {
    const hoje = new Date();
    const dataFormatada = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;
    Alert.alert(
      'Dar Baixa',
      `Confirmar pagamento de ${client.nome}?`,
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: `Pago em ${dataFormatada}`,
          onPress: async () => {
            await updateClient(client.id, {
              pago: true,
              dataPagamentoRealizado: dataFormatada,
            });
            refresh();
          },
        },
      ]
    );
  };

  const handleDelete = (id) => {
    Alert.alert(
      'Excluir registro',
      'Tem certeza que deseja excluir este cliente?',
      [
        { text: 'Cancelar', style: 'cancel' },
        {
          text: 'Excluir',
          style: 'destructive',
          onPress: async () => {
            await deleteClient(id);
            refresh();
          },
        },
      ]
    );
  };

  const openEdit = (client) => {
    setEditingClient(client);
    setModalVisible(true);
  };

  const openAdd = () => {
    setEditingClient(null);
    setModalVisible(true);
  };

  const openVendasCliente = (client) => {
    setVendasCliente({ client, vendas: vendasPorCliente[client.id] || [] });
  };

  const renderItem = ({ item }) => {
    const vendasDoCliente = vendasPorCliente[item.id] || [];
    const totalGasto = vendasDoCliente.reduce(
      (acc, v) => acc + v.total,
      0
    );
    return (
      <ClientCard
        client={item}
        onEdit={openEdit}
        onDelete={handleDelete}
        onMarkAsPaid={handleMarkAsPaid}
        vendasCount={vendasDoCliente.length}
        vendasTotal={totalGasto}
        onViewSales={openVendasCliente}
      />
    );
  };

  const renderEmpty = () => (
    <Text style={styles.emptyText}>
      {filter === 'todas'
        ? 'Nenhum cliente cadastrado.'
        : 'Nenhum registro encontrado para este filtro.'}
    </Text>
  );

  return (
    <View style={styles.container}>
      {clients.length > 0 && (
        <View
          style={{
            flexDirection: 'row',
            paddingHorizontal: 16,
            paddingTop: 12,
            gap: 10,
          }}
        >
          <View
            style={[
              styles.card,
              {
                flex: 1,
                marginHorizontal: 0,
                marginVertical: 0,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              À Vista
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.success,
              }}
            >
              R$ {totalAvista.toFixed(2).replace('.', ',')}
            </Text>
          </View>
          <View
            style={[
              styles.card,
              {
                flex: 1,
                marginHorizontal: 0,
                marginVertical: 0,
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
              }}
            >
              Dívidas
            </Text>
            <Text
              style={{
                fontSize: 16,
                fontWeight: '700',
                color: colors.danger,
              }}
            >
              R$ {totalDividas.toFixed(2).replace('.', ',')}
            </Text>
          </View>
        </View>
      )}

      <FilterBar activeFilter={filter} onFilterChange={setFilter} />

      <FlatList
        data={filteredClients}
        keyExtractor={(item) => item.id}
        renderItem={renderItem}
        ListEmptyComponent={renderEmpty}
        contentContainerStyle={{ paddingBottom: 100 }}
        showsVerticalScrollIndicator={false}
      />

      <TouchableOpacity
        style={{
          position: 'absolute',
          bottom: 24,
          right: 24,
          backgroundColor: colors.primary,
          width: 60,
          height: 60,
          borderRadius: 30,
          alignItems: 'center',
          justifyContent: 'center',
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 4 },
          shadowOpacity: 0.2,
          shadowRadius: 8,
          elevation: 6,
        }}
        onPress={openAdd}
      >
        <Text
          style={{
            color: '#ffffff',
            fontSize: 30,
            lineHeight: 32,
            fontWeight: '300',
          }}
        >
          +
        </Text>
      </TouchableOpacity>

      <ClientForm
        visible={modalVisible}
        onClose={() => {
          setModalVisible(false);
          setEditingClient(null);
        }}
        onSubmit={editingClient ? handleEdit : handleAdd}
        editingClient={editingClient}
      />

      <Modal
        visible={!!vendasCliente}
        animationType="slide"
        transparent
      >
        <View
          style={{
            flex: 1,
            backgroundColor: 'rgba(0,0,0,0.5)',
            justifyContent: 'flex-end',
          }}
        >
          <View
            style={{
              backgroundColor: colors.surface,
              borderTopLeftRadius: 20,
              borderTopRightRadius: 20,
              maxHeight: '80%',
            }}
          >
            <View
              style={{
                flexDirection: 'row',
                justifyContent: 'space-between',
                alignItems: 'center',
                padding: 20,
                paddingBottom: 0,
              }}
            >
              <Text style={styles.sectionTitle}>
                Vendas - {vendasCliente?.client?.nome}
              </Text>
              <TouchableOpacity
                onPress={() => setVendasCliente(null)}
              >
                <Text
                  style={{
                    color: colors.textSecondary,
                    fontSize: 16,
                  }}
                >
                  Fechar
                </Text>
              </TouchableOpacity>
            </View>

            <ScrollView
              style={{ padding: 20 }}
              keyboardShouldPersistTaps="handled"
            >
              {vendasCliente?.vendas?.length > 0 ? (
                vendasCliente.vendas.map((v) => (
                  <View
                    key={v.id}
                    style={{
                      backgroundColor: colors.inputBackground,
                      borderRadius: 8,
                      padding: 12,
                      marginBottom: 10,
                      borderWidth: 1,
                      borderColor: colors.border,
                    }}
                  >
                    <View
                      style={{
                        flexDirection: 'row',
                        justifyContent: 'space-between',
                        marginBottom: 4,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '600',
                          color: colors.text,
                        }}
                      >
                        {v.mercadoriaNome}
                      </Text>
                      <Text
                        style={{
                          fontSize: 12,
                          color: colors.textSecondary,
                        }}
                      >
                        {v.data}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Text
                        style={{
                          fontSize: 13,
                          color: colors.textSecondary,
                          flex: 1,
                        }}
                      >
                        {v.quantidade} un x{' '}
                        {`R$ ${Number(v.precoUnitario).toFixed(2).replace('.', ',')}`}
                      </Text>
                      <Text
                        style={{
                          fontSize: 14,
                          fontWeight: '700',
                          color: colors.success,
                        }}
                      >
                        {`R$ ${Number(v.total).toFixed(2).replace('.', ',')}`}
                      </Text>
                    </View>
                  </View>
                ))
              ) : (
                <Text
                  style={{
                    textAlign: 'center',
                    color: colors.textSecondary,
                    padding: 30,
                    fontSize: 14,
                  }}
                >
                  Nenhuma venda encontrada para este cliente.
                </Text>
              )}
              <View style={{ height: 30 }} />
            </ScrollView>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default HomeScreen;
