export const seedDatabase = async () => true;

export const clearAllProducts = async () => true;

export const getDatabaseStatus = async () => ({
  products: 0,
  categories: 0,
  orders: 0,
  isHealthy: true
});
