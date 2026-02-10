import { axiosInstance } from "@/lib/axiosInstance";
import type { Category } from "@/types/api";

export const categoryKeys = {
  all: ["categories"] as const,
};

// Fetch all categories (public endpoint)
export async function fetchCategories(): Promise<Category[]> {
  const { data } = await axiosInstance.get<{ data: Category[] }>("/api/categories");
  return Array.isArray(data) ? data : data.data || [];
}
