import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Modal,
} from 'react-native';
import styles, { colors } from '../styles/global';

const MercadoriaForm = ({ visible, onClose, onSubmit, editingMercadoria }) => {
  const [nome, setNome] = useState('');
  const [descricao, setDescricao] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoCusto, setPrecoCusto] = useState('');
  const [precoVenda, setPrecoVenda] = useState('');
  const [fornecedor, setFornecedor] = useState('');
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (editingMercadoria) {
      setNome(editingMercadoria.nome);
      setDescricao(editingMercadoria.descricao || '');
      setQuantidade(String(editingMercadoria.quantidade));
      setPrecoCusto(String(editingMercadoria.precoCusto));
      setPrecoVenda(String(editingMercadoria.precoVenda));
      setFornecedor(editingMercadoria.fornecedor || '');
    } else {
      resetForm();
    }
  }, [editingMercadoria, visible]);

  const resetForm = () => {
    setNome('');
    setDescricao('');
    setQuantidade('');
    setPrecoCusto('');
    setPrecoVenda('');
    setFornecedor('');
    setErrors({});
  };

  const validate = () => {
    const newErrors = {};
    if (!nome.trim()) newErrors.nome = 'Nome é obrigatório';
    if (!quantidade.trim() || isNaN(Number(quantidade)) || Number(quantidade) < 0)
      newErrors.quantidade = 'Quantidade inválida';
    if (!precoCusto.trim() || isNaN(Number(precoCusto)) || Number(precoCusto) < 0)
      newErrors.precoCusto = 'Preço de custo inválido';
    if (!precoVenda.trim() || isNaN(Number(precoVenda)) || Number(precoVenda) < 0)
      newErrors.precoVenda = 'Preço de venda inválido';
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {
    if (!validate()) return;
    onSubmit({
      nome: nome.trim(),
      descricao: descricao.trim(),
      quantidade: Number(quantidade),
      precoCusto: Number(precoCusto),
      precoVenda: Number(precoVenda),
      fornecedor: fornecedor.trim(),
    });
    resetForm();
  };

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
              {editingMercadoria
                ? 'Editar Mercadoria'
                : 'Nova Mercadoria'}
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
            <Text style={styles.label}>Nome da Mercadoria</Text>
            <TextInput
              style={[
                styles.input,
                errors.nome && { borderColor: colors.danger },
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

            <Text style={styles.label}>Descrição</Text>
            <TextInput
              style={styles.input}
              placeholder="Descrição (opcional)"
              placeholderTextColor={colors.textSecondary}
              value={descricao}
              onChangeText={setDescricao}
              multiline
            />

            <Text style={styles.label}>Quantidade em Estoque</Text>
            <TextInput
              style={[
                styles.input,
                errors.quantidade && { borderColor: colors.danger },
              ]}
              placeholder="0"
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

            <Text style={styles.label}>Preço de Custo</Text>
            <TextInput
              style={[
                styles.input,
                errors.precoCusto && { borderColor: colors.danger },
              ]}
              placeholder="0,00"
              placeholderTextColor={colors.textSecondary}
              value={precoCusto}
              onChangeText={setPrecoCusto}
              keyboardType="decimal-pad"
            />
            {errors.precoCusto && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.precoCusto}
              </Text>
            )}

            <Text style={styles.label}>Preço de Venda</Text>
            <TextInput
              style={[
                styles.input,
                errors.precoVenda && { borderColor: colors.danger },
              ]}
              placeholder="0,00"
              placeholderTextColor={colors.textSecondary}
              value={precoVenda}
              onChangeText={setPrecoVenda}
              keyboardType="decimal-pad"
            />
            {errors.precoVenda && (
              <Text
                style={{
                  color: colors.danger,
                  fontSize: 12,
                  marginTop: -8,
                  marginBottom: 8,
                }}
              >
                {errors.precoVenda}
              </Text>
            )}

            <Text style={styles.label}>Fornecedor</Text>
            <TextInput
              style={styles.input}
              placeholder="Nome do fornecedor (opcional)"
              placeholderTextColor={colors.textSecondary}
              value={fornecedor}
              onChangeText={setFornecedor}
            />

            <TouchableOpacity
              style={[styles.buttonPrimary, { marginTop: 8 }]}
              onPress={handleSubmit}
            >
              <Text style={styles.buttonPrimaryText}>
                {editingMercadoria
                  ? 'Salvar Alterações'
                  : 'Adicionar Mercadoria'}
              </Text>
            </TouchableOpacity>

            <View style={{ height: 30 }} />
          </ScrollView>
        </View>
      </View>
    </Modal>
  );
};

export default MercadoriaForm;
