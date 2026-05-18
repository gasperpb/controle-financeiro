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

const getFormaPagamentoLabel = (value, pago) => {
  if (value === 'divida' && pago) return 'Pago';
  const map = { avista: 'À Vista', divida: 'Dívida Pendente' };
  return map[value] || value;
};

const formatCurrency = (value) => {
  return `R$ ${Number(value).toFixed(2).replace('.', ',')}`;
};

const ClientCard = ({
  client,
  onEdit,
  onDelete,
  onMarkAsPaid,
  vendasCount = 0,
  vendasTotal = 0,
  onViewSales,
}) => {
  const isDivida = client.formaPagamento === 'divida';
  const isPago = client.pago === true;

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
                    backgroundColor: isPago
                      ? '#e6f4ea'
                      : isDivida
                      ? '#fce8e6'
                      : '#e6f4ea',
                  },
                ]}
              >
                <Text
                  style={{
                    fontSize: 12,
                    fontWeight: '600',
                    color: isPago
                      ? colors.success
                      : isDivida
                      ? colors.danger
                      : colors.success,
                  }}
                >
                  {getFormaPagamentoLabel(
                    client.formaPagamento,
                    isPago
                  )}
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

            {client.parcelaInfo && (
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    width: 100,
                  }}
                >
                  Parcela:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.primary,
                  }}
                >
                  {client.parcelaInfo.atual}/{client.parcelaInfo.total}
                </Text>
              </View>
            )}

            {isPago && client.dataPagamentoRealizado && (
              <View style={styles.row}>
                <Text
                  style={{
                    fontSize: 13,
                    color: colors.textSecondary,
                    width: 100,
                  }}
                >
                  Pago em:
                </Text>
                <Text
                  style={{
                    fontSize: 13,
                    fontWeight: '600',
                    color: colors.success,
                  }}
                >
                  {client.dataPagamentoRealizado}
                </Text>
              </View>
            )}

            {vendasCount > 0 && (
              <View
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  marginTop: 4,
                  gap: 6,
                }}
              >
                <View
                  style={[
                    styles.badge,
                    { backgroundColor: '#e8f0fe' },
                  ]}
                >
                  <Text
                    style={{
                      fontSize: 12,
                      fontWeight: '600',
                      color: colors.primary,
                    }}
                  >
                    {vendasCount} venda{vendasCount !== 1 ? 's' : ''}{' '}
                    {formatCurrency(vendasTotal)}
                  </Text>
                </View>
              </View>
            )}
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
        {vendasCount > 0 && (
          <TouchableOpacity
            style={styles.buttonOutline}
            onPress={() => onViewSales(client)}
          >
            <Text style={styles.buttonOutlineText}>Vendas</Text>
          </TouchableOpacity>
        )}
        {isDivida && !isPago && (
          <TouchableOpacity
            style={styles.buttonSuccess}
            onPress={() => onMarkAsPaid(client)}
          >
            <Text style={styles.buttonSuccessText}>Dar Baixa</Text>
          </TouchableOpacity>
        )}
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
