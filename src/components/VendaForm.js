import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  FlatList,
} from 'react-native';
import styles, { colors } from '../styles/global';
import { getMercadorias, searchMercadorias, getClients } from '../utils/storage';

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const VendaForm = ({ visible, onClose, onSubmit }) => {
  const hoje = new Date();
  const hojeFormatado = `${String(hoje.getDate()).padStart(2, '0')}/${String(hoje.getMonth() + 1).padStart(2, '0')}/${hoje.getFullYear()}`;

  const [data, setData] = useState(hojeFormatado);
  const [searchMercQuery, setSearchMercQuery] = useState('');
  const [searchCliQuery, setSearchCliQuery] = useState('');
  const [mercadoriasList, setMercadoriasList] = useState([]);
  const [selectedMerc, setSelectedMerc] = useState(null);
  const [selectedCli, setSelectedCli] = useState(null);
  const [quantidade, setQuantidade] = useState('1');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (visible) {
      setMercadoriasList(getMercadorias());
      setSelectedMerc(null);
      setSelectedCli(null);
      setQuantidade('1');
      setSearchMercQuery('');
      setSearchCliQuery('');
      setData(hojeFormatado);
      setErrors({});
    }
  }, [visible]);

  const filteredMercs = searchMercadorias(searchMercQuery).filter(
    (m) => m.quantidade > 0
  );

  const filteredClients = getClients().filter((c) => {
    if (!searchCliQuery.trim()) return true;
    const q = searchCliQuery.toLowerCase();
    return c.nome.toLowerCase().includes(q);
  });

  const handleSelectMerc = (merc) => {
    setSelectedMerc(merc);
    setSearchMercQuery('');
  };

  const handleSelectCli = (cli) => {
    setSelectedCli(cli);
    setSearchCliQuery('');
  };

  const validate = () => {
    const newErrors = {};
    if (!data.trim()) newErrors.data = 'Data é obrigatória';
    if (!selectedMerc) newErrors.mercadoria = 'Selecione uma mercadoria';
    if (!selectedCli) newErrors.cliente = 'Selecione um cliente';
    const qtd = Number(quantidade);
    if (!qtd || qtd < 1) newErrors.quantidade = 'Quantidade inválida';
    else if (selectedMerc && qtd > selectedMerc.quantidade)
      newErrors.quantidade = `Estoque insuficiente (${selectedMerc.quantidade} un)`;
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    const qtd = Number(quantidade);
    onSubmit({
      data: data.trim(),
      mercadoriaId: selectedMerc.id,
      mercadoriaNome: selectedMerc.nome,
      quantidade: qtd,
      precoUnitario: selectedMerc.precoVenda,
      total: selectedMerc.precoVenda * qtd,
      clienteId: selectedCli ? selectedCli.id : null,
      clienteNome: selectedCli ? selectedCli.nome : '',
    });
  };

  const renderMercItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => handleSelectMerc(item)}
      style={{
        paddingVertical: 12,
        paddingHorizontal: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
      }}
    >
      <View style={{ flex: 1 }}>
        <Text
          style={{
            fontSize: 15,
            fontWeight: '600',
            color: colors.text,
          }}
        >
          {item.nome}
        </Text>
        {item.fornecedor && (
          <Text
            style={{
              fontSize: 12,
              color: colors.textSecondary,
              marginTop: 2,
            }}
          >
            {item.fornecedor}
          </Text>
        )}
      </View>
      <View style={{ alignItems: 'flex-end' }}>
        <Text
          style={{
            fontSize: 13,
            fontWeight: '600',
            color: colors.success,
          }}
        >
          {formatCurrency(item.precoVenda)}
        </Text>
        <Text
          style={{
            fontSize: 12,
            color:
              item.quantidade <= 5 ? colors.danger : colors.textSecondary,
          }}
        >
          {item.quantidade} un
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <Modal visible={visible} animationType="slide" transparent>
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
            maxHeight: '90%',
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
            <Text style={styles.sectionTitle}>Nova Venda</Text>
            <TouchableOpacity onPress={onClose}>
              <Text
                style={{ color: colors.textSecondary, fontSize: 16 }}
              >
                Fechar
              </Text>
            </TouchableOpacity>
          </View>

          <ScrollView
            style={{ padding: 20 }}
            keyboardShouldPersistTaps="handled"
          >
            <Text style={styles.label}>Data da Venda</Text>
            <TextInput
              style={[
                styles.input,
                errors.data && { borderColor: colors.danger },
              ]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textSecondary}
              value={data}
              onChangeText={setData}
            />
            {errors.data && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.data}
              </Text>
            )}

            <Text style={styles.label}>Mercadoria</Text>
            {selectedMerc ? (
              <View
                style={{
                  backgroundColor: colors.inputBackground,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: colors.border,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <View style={{ flex: 1 }}>
                    <Text
                      style={{
                        fontSize: 15,
                        fontWeight: '600',
                        color: colors.text,
                      }}
                    >
                      {selectedMerc.nome}
                    </Text>
                    <Text
                      style={{
                        fontSize: 12,
                        color: colors.textSecondary,
                        marginTop: 2,
                      }}
                    >
                      Preço: {formatCurrency(selectedMerc.precoVenda)} |{' '}
                      Estoque: {selectedMerc.quantidade} un
                    </Text>
                  </View>
                  <TouchableOpacity
                    onPress={() => setSelectedMerc(null)}
                    style={{ paddingLeft: 12 }}
                  >
                    <Text
                      style={{
                        color: colors.danger,
                        fontWeight: '600',
                      }}
                    >
                      Trocar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.inputBackground,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.mercadoria
                    ? colors.danger
                    : colors.border,
                  marginBottom: 12,
                  maxHeight: 200,
                }}
              >
                <TextInput
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  placeholder="Buscar mercadoria..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchMercQuery}
                  onChangeText={setSearchMercQuery}
                />
                <FlatList
                  data={filteredMercs}
                  keyExtractor={(item) => item.id}
                  renderItem={renderMercItem}
                  style={{ maxHeight: 150 }}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.textSecondary,
                        padding: 16,
                        fontSize: 13,
                      }}
                    >
                      {searchMercQuery.trim()
                        ? 'Nenhuma mercadoria disponível'
                        : 'Nenhuma mercadoria com estoque'}
                    </Text>
                  }
                />
              </View>
            )}
            {errors.mercadoria && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.mercadoria}
              </Text>
            )}

            <Text style={styles.label}>Quantidade</Text>
            <TextInput
              style={[
                styles.input,
                errors.quantidade && { borderColor: colors.danger },
              ]}
              placeholder="1"
              placeholderTextColor={colors.textSecondary}
              value={quantidade}
              onChangeText={setQuantidade}
              keyboardType="number-pad"
            />
            {errors.quantidade && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.quantidade}
              </Text>
            )}

            {selectedMerc && (
              <View
                style={{
                  backgroundColor: colors.inputBackground,
                  borderRadius: 8,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View style={styles.row}>
                  <Text
                    style={{
                      flex: 1,
                      fontSize: 13,
                      color: colors.textSecondary,
                    }}
                  >
                    Subtotal:
                  </Text>
                  <Text
                    style={{
                      fontSize: 16,
                      fontWeight: '700',
                      color: colors.success,
                    }}
                  >
                    {formatCurrency(
                      selectedMerc.precoVenda * Number(quantidade || 0)
                    )}
                  </Text>
                </View>
              </View>
            )}

            <Text style={styles.label}>Cliente</Text>
            {selectedCli ? (
              <View
                style={{
                  backgroundColor: colors.inputBackground,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.cliente
                    ? colors.danger
                    : colors.border,
                  padding: 12,
                  marginBottom: 12,
                }}
              >
                <View
                  style={{
                    flexDirection: 'row',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                  }}
                >
                  <Text
                    style={{
                      fontSize: 15,
                      fontWeight: '600',
                      color: colors.text,
                    }}
                  >
                    {selectedCli.nome}
                  </Text>
                  <TouchableOpacity
                    onPress={() => setSelectedCli(null)}
                  >
                    <Text
                      style={{
                        color: colors.danger,
                        fontWeight: '600',
                      }}
                    >
                      Trocar
                    </Text>
                  </TouchableOpacity>
                </View>
              </View>
            ) : (
              <View
                style={{
                  backgroundColor: colors.inputBackground,
                  borderRadius: 8,
                  borderWidth: 1,
                  borderColor: errors.cliente
                    ? colors.danger
                    : colors.border,
                  marginBottom: 12,
                  maxHeight: 200,
                }}
              >
                <TextInput
                  style={{
                    paddingHorizontal: 14,
                    paddingVertical: 12,
                    fontSize: 15,
                    color: colors.text,
                    borderBottomWidth: 1,
                    borderBottomColor: colors.border,
                  }}
                  placeholder="Buscar cliente..."
                  placeholderTextColor={colors.textSecondary}
                  value={searchCliQuery}
                  onChangeText={setSearchCliQuery}
                />
                <FlatList
                  data={filteredClients}
                  keyExtractor={(item) => item.id}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => handleSelectCli(item)}
                      style={{
                        paddingVertical: 12,
                        paddingHorizontal: 16,
                        borderBottomWidth: 1,
                        borderBottomColor: colors.border,
                      }}
                    >
                      <Text
                        style={{
                          fontSize: 15,
                          fontWeight: '500',
                          color: colors.text,
                        }}
                      >
                        {item.nome}
                      </Text>
                    </TouchableOpacity>
                  )}
                  style={{ maxHeight: 150 }}
                  keyboardShouldPersistTaps="handled"
                  ListEmptyComponent={
                    <Text
                      style={{
                        textAlign: 'center',
                        color: colors.textSecondary,
                        padding: 16,
                        fontSize: 13,
                      }}
                    >
                      {searchCliQuery.trim()
                        ? 'Nenhum cliente encontrado'
                        : 'Nenhum cliente cadastrado'}
                    </Text>
                  }
                />
              </View>
            )}
            {errors.cliente && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -12,
                  marginBottom: 8,
                }}
              >
                {errors.cliente}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 8 }]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonPrimaryText}>
                Confirmar Venda
              </Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default VendaForm;
