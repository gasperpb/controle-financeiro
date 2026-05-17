import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
  Platform,
} from 'react-native';
import styles, { colors } from '../styles/global';

const TIPOS_GASTO = [
  { label: 'Compra de Dinheiro', value: 'compra_dinheiro' },
  { label: 'Mercadoria', value: 'mercadoria' },
];

const FORMAS_PAGAMENTO = [
  { label: 'À Vista', value: 'avista' },
  { label: 'Dívida', value: 'divida' },
];

const ClientForm = ({ visible, onClose, onSubmit, editingClient }) => {
  const [nome, setNome] = useState('');
  const [tipoGasto, setTipoGasto] = useState('compra_dinheiro');
  const [valor, setValor] = useState('');
  const [formaPagamento, setFormaPagamento] = useState('avista');
  const [dataPagamento, setDataPagamento] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingClient) {
      setNome(editingClient.nome);
      setTipoGasto(editingClient.tipoGasto);
      setValor(String(editingClient.valor));
      setFormaPagamento(editingClient.formaPagamento);
      setDataPagamento(editingClient.dataPagamento);
    } else {
      resetForm();
    }
  }, [editingClient, visible]);

  const resetForm = () => {
    setNome('');
    setTipoGasto('compra_dinheiro');
    setValor('');
    setFormaPagamento('avista');
    setDataPagamento('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!valor.trim()) newErrors.valor = 'Valor é obrigatório';
    else if (isNaN(Number(valor)) || Number(valor) <= 0)
      newErrors.valor = 'Valor inválido';
    if (!dataPagamento.trim())
      newErrors.dataPagamento = 'Data é obrigatória';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      nome: nome.trim(),
      tipoGasto,
      valor: Number(valor),
      formaPagamento,
      dataPagamento: dataPagamento.trim(),
    });
    resetForm();
  };

  const Selector = ({ label, options, value, onSelect }) => (
    <View style={{ marginBottom: 12 }}>
      <Text style={styles.label}>{label}</Text>
      <View style={styles.pickerContainer}>
        <View
          style={{
            flexDirection: 'row',
            padding: Platform.OS === 'web' ? 8 : 2,
          }}
        >
          {options.map((opt) => (
            <TouchableOpacity
              key={opt.value}
              onPress={() => onSelect(opt.value)}
              style={{
                flex: 1,
                paddingVertical: 10,
                paddingHorizontal: 8,
                backgroundColor:
                  value === opt.value ? colors.primary : 'transparent',
                borderRadius: 6,
                margin: 2,
              }}
            >
              <Text
                style={{
                  textAlign: 'center',
                  fontSize: 13,
                  fontWeight: '500',
                  color:
                    value === opt.value ? '#ffffff' : colors.text,
                }}
              >
                {opt.label}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>
    </View>
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
            maxHeight: '85%',
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
              {editingClient ? 'Editar Cliente' : 'Novo Cliente'}
            </Text>
            <TouchableOpacity
              onPress={() => {
                resetForm();
                onClose();
              }}
            >
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
            <Text style={styles.label}>Nome do Cliente</Text>
            <TextInput
              style={[
                styles.input,
                errors.nome && {
                  borderColor: colors.danger,
                },
              ]}
              placeholder="Digite o nome"
              placeholderTextColor={colors.textSecondary}
              value={nome}
              onChangeText={setNome}
            />
            {errors.nome && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.nome}
              </Text>
            )}

            <Selector
              label="Tipo de Gasto"
              options={TIPOS_GASTO}
              value={tipoGasto}
              onSelect={setTipoGasto}
            />

            <Text style={styles.label}>Valor do Gasto</Text>
            <TextInput
              style={[
                styles.input,
                errors.valor && { borderColor: colors.danger },
              ]}
              placeholder="0,00"
              placeholderTextColor={colors.textSecondary}
              value={valor}
              onChangeText={setValor}
              keyboardType="decimal-pad"
            />
            {errors.valor && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.valor}
              </Text>
            )}

            <Selector
              label="Forma de Pagamento"
              options={FORMAS_PAGAMENTO}
              value={formaPagamento}
              onSelect={setFormaPagamento}
            />

            <Text style={styles.label}>Data do Pagamento</Text>
            <TextInput
              style={[
                styles.input,
                errors.dataPagamento && {
                  borderColor: colors.danger,
                },
              ]}
              placeholder="DD/MM/AAAA"
              placeholderTextColor={colors.textSecondary}
              value={dataPagamento}
              onChangeText={setDataPagamento}
            />
            {errors.dataPagamento && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.dataPagamento}
              </Text>
            )}

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 8 }]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonPrimaryText}>
                {editingClient
                  ? 'Salvar Alterações'
                  : 'Adicionar Cliente'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default ClientForm;
