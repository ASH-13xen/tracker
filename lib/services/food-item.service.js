import * as repo from "@/lib/repositories/food-item.repository";

export const getAllFoodItems = () => repo.getAll();
export const createFoodItem = (data) => repo.create(data);
export const updateFoodItem = (id, data) => repo.update(id, data);
export const deleteFoodItem = (id) => repo.remove(id);
