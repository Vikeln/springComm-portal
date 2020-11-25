
import { axiosInstance } from '../API';


// const communicationUrl = "http://localhost:8080";
const communicationUrl = "http://10.38.83.54:30555";

class TenantService {


    /*Get all Tenants from endpoint*/
    getAllTenants() {
        return axiosInstance.get(communicationUrl + "/tenants");

    }


    /*Create Tenant*/
    createTenant(formData) {

        return axiosInstance.post(communicationUrl + "/tenants/add", formData);

    }

}

export default new TenantService();
