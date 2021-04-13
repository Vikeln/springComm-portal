import { axiosInstance, baseUrl } from '../API';

class TenantService {

    /*Get all Tenants from endpoint*/
    getAllTenants() {
        return axiosInstance.get(baseUrl + "tenants");
    }

    /*Create Tenant*/
    createTenant(formData) {
        return axiosInstance.post(baseUrl + "tenants/add", formData);
    }

    // get transactions
    getAllTransactions() {
        return axiosInstance.post(baseUrl + "tenants/transactions");
    }
    // purchase Units
    purchaseUnits(formData) {
        return axiosInstance.post(baseUrl + "tenants/purchase-units", formData);
    }

}

export default new TenantService();
