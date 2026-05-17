let clients = [];
let nextId = 1;
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
        JSON.stringify(clients)
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
        clients = JSON.parse(stored);
        nextId =
          clients.reduce((max, c) => Math.max(max, Number(c.id)), 0) + 1;
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
