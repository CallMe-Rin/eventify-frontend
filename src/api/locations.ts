import { axiosInstance } from "@/lib/axiosInstance";
import type { Location } from "@/types/api";

export const locationKeys = {
  all: ["locations"] as const,
};

export async function fetchLocations(): Promise<Location[]> {
  const { data } = await axiosInstance.get<Location[]>("/locations");
  return data;
}
