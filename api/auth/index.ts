import apiClient from "../apiClient";
import { UserData } from "./types";

export const checkPhoneNumber = async (phoneNumber: string) => {
  try {
    const response = await apiClient.get(`/auth/checkPhone/${phoneNumber}`);
    return response.data as UserData;
  } catch (error) {
    console.error("❌ Error in checkPhoneNumber:", error);
    throw error;
  }
};
