import { axiosInstance } from '../API';


const bookUrl = "https://lbtotal.mfs.co.ke/bridge/";
const baseUrl = "https://lbtotal.mfs.co.ke/";


class AddressBookService {


    getCustomerUploadFile() {
        return axiosInstance.get(bookUrl + "address-book/getContactsExcelTemplate");

    }


    createContact(formData) {
        return axiosInstance.post(bookUrl + "address-book", formData);
    }


    /*Create Contact upload method*/
    createUploadContacts(formData) {

        return axiosInstance.post(bookUrl + "address-book/uploadContactsExcelFile", formData);


    }
    /*Create Contact uploads*/
    createContacts(formData) {

        return axiosInstance.post(bookUrl + "address-book/batch", formData);


    }
    getAllContacts() {

        return axiosInstance.get(bookUrl + "address-book");


    }
    getAllGroupContacts(group) {

        return axiosInstance.get(bookUrl + "address-book?contgroup=" + group);


    }
    getAllContactGroups() {

        return axiosInstance.get(bookUrl + "address-book/groups");


    }

}

export default new AddressBookService();
