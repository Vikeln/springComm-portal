import { axiosInstance,baseUrl } from '../API';



class AddressBookService {


    getCustomerUploadFile() {
        return axiosInstance.get(baseUrl + "bridge/address-book/getContactsExcelTemplate");

    }


    createContact(formData) {
        return axiosInstance.post(baseUrl + "bridge/address-book", formData);
    }


    /*Create Contact upload method*/
    createUploadContacts(formData) {

        return axiosInstance.post(baseUrl + "bridge/address-book/uploadContactsExcelFile", formData);


    }
    /*Create Contact uploads*/
    createContacts(formData) {

        return axiosInstance.post(baseUrl + "bridge/address-book/batch", formData);


    }
    getAllContacts() {

        return axiosInstance.get(baseUrl + "bridge/address-book");


    }
    getAllGroupContacts(group) {

        return axiosInstance.get(baseUrl + "bridge/address-book?contgroup=" + group);


    }
    getAllContactGroups() {

        return axiosInstance.get(baseUrl + "bridge/address-book/groups");
    }

}

export default new AddressBookService();
