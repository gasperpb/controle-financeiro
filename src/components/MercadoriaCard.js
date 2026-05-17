import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles, { colors } from '../styles/global';

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const MercadoriaCard = ({ mercadoria, onEdit, onDelete }) => {
  const baixoEstoque = mercadoria.quantidade <= 5;

  return (
    <View style={styles.card}>
      <View style={{ flex: 1 }}>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'flex-start',
          }}
        >
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 8,
              flex: 1,
            }}
          >
            {mercadoria.nome}
          </Text>
          <View
            style={[
              styles.badge,
              {
                backgroundColor: baixoEstoque ? '#fce8e6' : '#e6f4ea',
              },
            ]}
          >
            <Text
              style={{
                fontSize: 12,
                fontWeight: '600',
                color: baixoEstoque ? colors.danger : colors.success,
              }}
            >
              {mercadoria.quantidade} un
            </Text>
          </View>
        </View>

        <View style={{ gap: 6 }}>
          {mercadoria.fornecedor ? (
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 100,
                }}
              >
                Fornecedor:
              </Text>
              <Text style={{ fontSize: 13, color: colors.text }}>
                {mercadoria.fornecedor}
              </Text>
            </View>
          ) : null}

          <View style={styles.row}>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                width: 100,
              }}
            >
              Custo:
            </Text>
            <Text style={{ fontSize: 13, color: colors.text }}>
              {formatCurrency(mercadoria.precoCusto)}
            </Text>
          </View>

          <View style={styles.row}>
            <Text
              style={{
                fontSize: 13,
                color: colors.textSecondary,
                width: 100,
              }}
            >
              Venda:
            </Text>
            <Text
              style={{
                fontSize: 15,
                fontWeight: '600',
                color: colors.success,
              }}
            >
              {formatCurrency(mercadoria.precoVenda)}
            </Text>
          </View>

          {mercadoria.descricao ? (
            <Text
              style={{
                fontSize: 12,
                color: colors.textSecondary,
                marginTop: 4,
              }}
            >
              {mercadoria.descricao}
            </Text>
          ) : null}
        </View>
      </View>

      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'flex-end',
          gap: 10,
          marginTop: 14,
          paddingTop: 12,
          borderTopWidth: 1,
          borderTopColor: colors.border,
        }}
      >
        <TouchableOpacity
          style={styles.buttonOutline}
          onPress={() => onEdit(mercadoria)}
        >
          <Text style={styles.buttonOutlineText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDanger}
          onPress={() => onDelete(mercadoria.id)}
        >
          <Text style={styles.buttonDangerText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default MercadoriaCard;
