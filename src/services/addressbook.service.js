import { axiosInstance } from '../API';


const bookUrl = "http://10.38.83.36:31098/bridge/";
const baseUrl = "http://10.38.83.36:31098/";


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
