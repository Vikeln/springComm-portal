import { axiosInstance, clientBaseUrl } from '../API';

class TenantService {

    /*Get all Tenants from endpoint*/
    getAllClients() {
        return axiosInstance.get(clientBaseUrl + "clients");
    }
    
    /*Create Tenant*/
    createClients(formData) {
        return axiosInstance.post(clientBaseUrl + "clients/create", formData);
    }


    getClient(id) {
        return axiosInstance.get(clientBaseUrl + "clients/"+id);
    }
 
    viewTenant(key) {
        return axiosInstance.get(clientBaseUrl + "clients/view/"+key);
    }

    getClientDocuments(client){
        return axiosInstance.get(clientBaseUrl + "documents?client="+client);
    }
    createClientDocuments(formData){
        return axiosInstance.post(clientBaseUrl + "documents",formData);
    }


    // get transactions
    getAllTransactions() {
        return axiosInstance.post(clientBaseUrl + "tenants/transactions");
    }
    
    getAllCountries() {
        return axiosInstance.get(clientBaseUrl + "countries/all");
    }
    addCountries(formData) {
        return axiosInstance.post(clientBaseUrl + "countries",formData);
    }

    getUnitCosts() {
        return axiosInstance.get(clientBaseUrl + "unit-costs");
    }

    reviseUnitCosts(formData) {
        return axiosInstance.post(clientBaseUrl + "unit-costs/defaults/create-update",formData);
    }
    
    assignClientServiceUnitCosts(clientService, formData) {
        return axiosInstance.post(clientBaseUrl + "services/assignUnitCost/"+clientService,formData);
    }

    updateServiceStandingCharge(client, formData) {
        return axiosInstance.post(clientBaseUrl + "services/updateServiceStandingCharge/"+client,formData);
    }

    getClientServiceUsageReport(clientService, startDate,endDate) {
        return axiosInstance.get(clientBaseUrl + "services/getClientServiceUsageReport/"+clientService +"?startDate=" +startDate+"&endDate="+endDate);
    }

    reviseUnitCosts(formData) {
        return axiosInstance.post(clientBaseUrl + "unit-costs/defaults/create-update",formData);
    }

    getUSSDCodes(client) {
        if (client != undefined)
            return axiosInstance.get(clientBaseUrl + "ussd/codes?client=" + client);
        return axiosInstance.get(clientBaseUrl + "ussd/codes");
    }

    getClientServices(client) {
        return axiosInstance.get(clientBaseUrl + "services/client/" + client);
    }

    getClientService(clientService) {
        return axiosInstance.get(clientBaseUrl + "services/view/" + clientService);
    }

    applyNewUSSDCodes(formData) {
        return axiosInstance.post(clientBaseUrl + "ussd/codes/apply", formData);
    }

    // purchase Units
    purchaseUnits(formData) {
        return axiosInstance.post(clientBaseUrl + "tenants/purchase-units", formData);
    }

}

export default new TenantService();
