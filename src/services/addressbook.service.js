import { axiosInstance } from '../API';


// const bookUrl = "http://localhost:8080/bridge/";
const bookUrl = "http://10.38.83.54:30555/bridge/";
// const baseUrl = "http://localhost:8080/";
const baseUrl = "http://10.38.83.54:30555/";


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

}

export default new AddressBookService();
