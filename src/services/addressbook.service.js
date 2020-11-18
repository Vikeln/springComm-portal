import { axiosInstance } from '../API';


// const userUrl = "https://lb.mfs.co.ke:30334/users";
const bookUrl = "http://localhost:8080/bridge/";
// const baseUrl = "https://lb.mfs.co.ke:30334/";
const baseUrl = "http://localhost:8080/";


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
