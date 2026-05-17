import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles, { colors } from '../styles/global';

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const VendaCard = ({ venda, onDelete }) => {
  return (
    <View style={styles.card}>
      <View
        style={{
          flexDirection: 'row',
          justifyContent: 'space-between',
          alignItems: 'flex-start',
        }}
      >
        <View style={{ flex: 1 }}>
          <Text
            style={{
              fontSize: 17,
              fontWeight: '700',
              color: colors.text,
              marginBottom: 4,
            }}
          >
            {venda.mercadoriaNome}
          </Text>

          <Text
            style={{
              fontSize: 13,
              color: colors.textSecondary,
              marginBottom: 8,
            }}
          >
            {venda.data}
            {venda.clienteNome ? ` - ${venda.clienteNome}` : ''}
          </Text>

          <View style={{ gap: 4 }}>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 80,
                }}
              >
                Qtd:
              </Text>
              <Text style={{ fontSize: 13, color: colors.text }}>
                {venda.quantidade} un
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 80,
                }}
              >
                Unitário:
              </Text>
              <Text style={{ fontSize: 13, color: colors.text }}>
                {formatCurrency(venda.precoUnitario)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 80,
                }}
              >
                Total:
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '700',
                  color: colors.success,
                }}
              >
                {formatCurrency(venda.total)}
              </Text>
            </View>

            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 80,
                }}
              >
                Lucro:
              </Text>
              <Text
                style={{
                  fontSize: 13,
                  fontWeight: '600',
                  color: colors.primary,
                }}
              >
                {formatCurrency(venda.lucro)}
              </Text>
            </View>
          </View>
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
          style={styles.buttonDanger}
          onPress={() => onDelete(venda.id)}
        >
          <Text style={styles.buttonDangerText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default VendaCard;
