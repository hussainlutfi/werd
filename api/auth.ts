import apiClient from './apiClient';

export const checkPhoneNumber = async (phoneNumber: string) => {
	try {
		const data = await apiClient.get(`/auth/checkPhone/${phoneNumber}`);
		return data;
	} catch (error) {
		console.error('❌ Error in checkPhoneNumber:', error);
		throw error;
	}
};
