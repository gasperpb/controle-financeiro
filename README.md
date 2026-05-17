# Controle Financeiro

Aplicativo mobile para controle financeiro de clientes, desenvolvido com React Native (Expo).

## Funcionalidades

- Cadastro de clientes com nome, tipo de gasto, valor, forma de pagamento e data
- Editar e excluir registros
- Filtros por forma de pagamento (À Vista / Dívidas)
- Resumo com total de valores à vista e dívidas
- Persistência de dados com AsyncStorage (os dados não são perdidos ao fechar o app)

## Tecnologias

- React Native 0.76 + Expo SDK 52
- AsyncStorage para persistência local

## Como rodar

```bash
npm install
npm start        # inicia o Expo dev server
npm run android  # abre no Android
npm run ios      # abre no iOS
npm run web      # abre no navegador
```

## Estrutura

```
src/
  components/     # Componentes reutilizáveis (ClientCard, ClientForm, FilterBar)
  screens/        # Telas (HomeScreen)
  utils/          # Lógica de armazenamento (storage.js)
  styles/         # Estilos globais
```
