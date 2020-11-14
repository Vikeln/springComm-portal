
import { axiosInstance } from '../API';


// const communicationUrl = "https://lb.mfs.co.ke:30334/communications";
const communicationUrl = "http://localhost:8080/bridge";
const communicationUrls = "http://localhost:8080";

class CommunicationsService {


    /*Get all messages from endpoint*/
    getAllMessages(date1, date2) {


        return axiosInstance.get(communicationUrl + "/sent-sms?start=" + date1 + "&end=" + date2);

    }
    getDashboardData() {


        return axiosInstance.get(communicationUrl + "/sent-sms/my-smsdetails");

    }

    getAllScheduledMessages(date1, date2) {


        return axiosInstance.get(communicationUrl + "/scheduled-sms?start=" + date1 + "&end=" + date2);

    }

    /*Get all customer messages from endpoint*/
    getAllCustomerMessages(phone) {
        if (phone.startsWith("+")) {
            return axiosInstance.get(communicationUrl + "/customer-outbox?customerPhone=" + phone.substring(1));
        }
        else {
            return axiosInstance.get(communicationUrl + "/customer-outbox?customerPhone=" + phone);
        }

    }

    /*Get single message based on messageId*/
    getSingleMessage(messageId) {

        return axiosInstance.get(communicationUrl + "/" + messageId);

    }

    /*Get all message templates*/
    getAllMessageTemplates() {

        return axiosInstance.get(communicationUrl + "/message-templates");

    }

    /*Get single message template*/
    getSingleMessageTemplate(templateId) {

        return axiosInstance.get(communicationUrl + "/message-templates/" + templateId);

    }

    /*Create single message template*/
    createMessageTemplate(formData) {

        return axiosInstance.post(communicationUrl + "/message-templates/add", formData);

    }

    /*Update single message template*/
    updateMessageTemplate(templateId, formData) {

        return axiosInstance.post(communicationUrl + "/message-templates/edit?id=" + templateId, formData);

    }

    /*Get all message types*/
    getAllMessageTypes() {

        return axiosInstance.get(communicationUrl + "/message-types");

    }

    /*Create Message Type*/
    createMessageType(formData) {

        return axiosInstance.get(communicationUrl + "/message-types/add", formData);

    }

    /*Create Message*/
    createMessage(formData) {

        return axiosInstance.post(communicationUrls + "/communications/sms/send", formData);

    }

    /*Update single message template*/
    updateMessageType(messageTypeId, formData) {

        return axiosInstance.post(communicationUrl + "/message-types/edit/" + messageTypeId, formData);

    }
}

export default new CommunicationsService();