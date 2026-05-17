let clients = [];
let mercadorias = [];
let vendas = [];
let nextId = 1;
let nextMercId = 1;
let nextVendaId = 1;
let loaded = false;

const getStorage = async () => {
  try {
    const AsyncStorage =
      require('@react-native-async-storage/async-storage').default;
    return AsyncStorage;
  } catch {
    return null;
  }
};

const persist = async () => {
  const AsyncStorage = await getStorage();
  if (AsyncStorage) {
    try {
      await AsyncStorage.setItem(
        '@controle_financeiro',
        JSON.stringify({ clients, mercadorias, vendas })
      );
    } catch (e) {
      console.log('Error persisting to AsyncStorage', e);
    }
  }
};

export const initStorage = async () => {
  if (loaded) return;
  const AsyncStorage = await getStorage();
  if (AsyncStorage) {
    try {
      const stored = await AsyncStorage.getItem('@controle_financeiro');
      if (stored) {
        const data = JSON.parse(stored);
        if (Array.isArray(data)) {
          clients = data;
          mercadorias = [];
        } else {
          clients = data.clients || [];
          mercadorias = data.mercadorias || [];
          vendas = data.vendas || [];
        }
        nextId =
          clients.reduce((max, c) => Math.max(max, Number(c.id)), 0) + 1;
        nextMercId =
          mercadorias.reduce((max, m) => Math.max(max, Number(m.id)), 0) + 1;
        nextVendaId =
          vendas.reduce((max, v) => Math.max(max, Number(v.id)), 0) + 1;
      }
    } catch (e) {
      console.log('Error loading from AsyncStorage', e);
    }
  }
  loaded = true;
};

export const getClients = () => {
  return [...clients];
};

export const addClient = async (client) => {
  const newClient = { ...client, id: String(nextId++) };
  clients = [...clients, newClient];
  await persist();
  return newClient;
};

export const updateClient = async (id, updatedData) => {
  clients = clients.map((c) =>
    c.id === id ? { ...c, ...updatedData } : c
  );
  await persist();
  return clients.find((c) => c.id === id);
};

export const deleteClient = async (id) => {
  clients = clients.filter((c) => c.id !== id);
  await persist();
};

export const filterClients = (filterType) => {
  if (filterType === 'todas') return [...clients];
  return clients.filter((c) => c.formaPagamento === filterType);
};

export const clearClients = async () => {
  clients = [];
  nextId = 1;
  await persist();
};

export const getMercadorias = () => {
  return [...mercadorias];
};

export const addMercadoria = async (mercadoria) => {
  const nova = { ...mercadoria, id: String(nextMercId++) };
  mercadorias = [...mercadorias, nova];
  await persist();
  return nova;
};

export const updateMercadoria = async (id, updatedData) => {
  mercadorias = mercadorias.map((m) =>
    m.id === id ? { ...m, ...updatedData } : m
  );
  await persist();
  return mercadorias.find((m) => m.id === id);
};

export const deleteMercadoria = async (id) => {
  mercadorias = mercadorias.filter((m) => m.id !== id);
  await persist();
};

export const getVendas = () => {
  return [...vendas];
};

export const addVenda = async (venda) => {
  const merc = mercadorias.find((m) => m.id === venda.mercadoriaId);
  if (!merc) throw new Error('Mercadoria não encontrada');
  if (merc.quantidade < venda.quantidade)
    throw new Error('Estoque insuficiente');

  const lucro =
    (venda.precoUnitario - merc.precoCusto) * venda.quantidade;
  const nova = {
    ...venda,
    id: String(nextVendaId++),
    lucro,
  };

  merc.quantidade -= venda.quantidade;
  vendas = [...vendas, nova];
  await persist();
  return nova;
};

export const deleteVenda = async (id) => {
  const venda = vendas.find((v) => v.id === id);
  if (venda) {
    const merc = mercadorias.find((m) => m.id === venda.mercadoriaId);
    if (merc) merc.quantidade += venda.quantidade;
  }
  vendas = vendas.filter((v) => v.id !== id);
  await persist();
};

export const searchVendas = (query) => {
  if (!query.trim()) return [...vendas];
  const q = query.toLowerCase();
  return vendas.filter(
    (v) =>
      v.mercadoriaNome.toLowerCase().includes(q) ||
      (v.clienteNome && v.clienteNome.toLowerCase().includes(q))
  );
};

export const searchMercadorias = (query) => {
  if (!query.trim()) return [...mercadorias];
  const q = query.toLowerCase();
  return mercadorias.filter(
    (m) =>
      m.nome.toLowerCase().includes(q) ||
      (m.fornecedor && m.fornecedor.toLowerCase().includes(q))
  );
};
