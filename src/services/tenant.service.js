
import { axiosInstance } from '../API';


const communicationUrl = "https://lbtotal.mfs.co.ke";

class TenantService {


    /*Get all Tenants from endpoint*/
    getAllTenants() {
        return axiosInstance.get(communicationUrl + "/tenants");

    }



    /*Create Tenant*/
    createTenant(formData) {

        return axiosInstance.post(communicationUrl + "/tenants/add", formData);

    }
    // get transactions
    getAllTransactions() {
        return axiosInstance.post(communicationUrl + "/tenants/transactions");

    }
    // purchase Units
    purchaseUnits(formData) {
        return axiosInstance.post(communicationUrl + "/tenants/purchase-units", formData);

    }

}

export default new TenantService();
