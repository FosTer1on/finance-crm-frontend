import { apiClient } from "./client";
import { ENDPOINTS } from "./endpoints";

export const getCompanies = () => apiClient.get(ENDPOINTS.companies);