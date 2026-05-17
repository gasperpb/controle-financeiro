import React from 'react';
import { View, Text, TouchableOpacity } from 'react-native';
import styles, { colors } from '../styles/global';

const getTipoGastoLabel = (value) => {
  const map = {
    compra_dinheiro: 'Compra de Dinheiro',
    mercadoria: 'Mercadoria',
  };
  return map[value] || value;
};

const getFormaPagamentoLabel = (value) => {
  const map = { avista: 'À Vista', divida: 'Dívida Pendente' };
  return map[value] || value;
};

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const ClientCard = ({ client, onEdit, onDelete }) => {
  const isDivida = client.formaPagamento === 'divida';

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
              marginBottom: 8,
            }}
          >
            {client.nome}
          </Text>

          <View style={{ gap: 6 }}>
            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 100,
                }}
              >
                Tipo de Gasto:
              </Text>
              <Text
                style={{ fontSize: 13, color: colors.text }}
              >
                {getTipoGastoLabel(client.tipoGasto)}
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
                Valor:
              </Text>
              <Text
                style={{
                  fontSize: 15,
                  fontWeight: '600',
                  color: colors.text,
                }}
              >
                {formatCurrency(client.valor)}
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
                Pagamento:
              </Text>
              <View
                style={[
                  styles.badge,
                  {
                    backgroundColor: isDivida
                      ? '#fce8e6'
                      : '#e6f4ea',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isDivida ? colors.danger : colors.success,
                  }}
                >
                  {getFormaPagamentoLabel(client.formaPagamento)}
                </Text>
              </View>
            </View>

            <View style={styles.row}>
              <Text
                style={{
                  fontSize: 13,
                  color: colors.textSecondary,
                  width: 100,
                }}
              >
                Data:
              </Text>
              <Text
                style={{ fontSize: 13, color: colors.text }}
              >
                {client.dataPagamento}
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
          style={styles.buttonOutline}
          onPress={() => onEdit(client)}
        >
          <Text style={styles.buttonOutlineText}>Editar</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.buttonDanger}
          onPress={() => onDelete(client.id)}
        >
          <Text style={styles.buttonDangerText}>Excluir</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

export default ClientCard;
