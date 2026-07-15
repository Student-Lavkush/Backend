import api from "./auth.service";

export async function getAllFoodItems() {
  const { data } = await api.get("/api/foodItems/AllFoodItems");
  return data;
}

export async function getFoodByCategory(category) {
  const { data } = await api.get(`/api/foodItems/category/${category}`);
  return data;
}

export async function getPublicFoodItems() {
  const { data } = await api.get("/api/foodItems/public");
  return data;
}