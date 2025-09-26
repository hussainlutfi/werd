import apiClient from './apiClient';

export const getCompanyDetails = async (companyUid: string) => {
	try {
		const data = await apiClient.get(`/auth/driver-auth/${companyUid}`);
		return data;
	} catch (error) {
		console.error('❌ Error in getCompanyDetails:', error);
		throw error;
	}
};

