// posts.ts
import apiClient from "./apiClient";

export const checkPhoneNumberExists = async (phoneNumber: string) => {
  const response = await apiClient.post("/auth/driver-auth/check-phone", {
    phoneNumber,
  });
  return response;
};
