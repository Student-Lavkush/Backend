import api from "./auth.service";

export const getUsers = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

export const getUserById = async (id) => {
  const { data } = await api.get(`/api/admin/users/${id}`);
  return data;
};

export const getRestaurants = async () => {
  const { data } = await api.get("/api/admin/restaurants");
  return data;
};

export const getAllOrders = async (filters = {}) => {
  const params = new URLSearchParams(filters).toString();
  const { data } = await api.get(`/api/admin/orders${params ? `?${params}` : ""}`);
  return data;
};