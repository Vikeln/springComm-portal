import { axiosInstance, baseUrl } from '../API';

class CommunicationsService {


    /*Get all messages from endpoint*/
    getAllMessages(date1, date2, source, sentBy) {

        var part = "";

        if (source !== "")
            part = part + "&source=" + source;

        if (sentBy !== "")
            part = part + "&sentBy=" + sentBy;

        return axiosInstance.get(baseUrl + "bridge/sent-sms?start=" + date1 + "&end=" + date2 + (part !== "" ? part : ""));

    }

    getDashboardData() {

        return axiosInstance.get(baseUrl + "bridge/sent-sms/my-smsdetails");

    }

    getDashboardGraphData() {

        return axiosInstance.get(baseUrl + "bridge/sent-sms/my-sms-graph");

    }

    getAllScheduledMessages(date1, date2) {


        return axiosInstance.get(baseUrl + "bridge/scheduled-sms?start=" + date1 + "&end=" + date2);

    }

    /*Get all customer messages from endpoint*/
    getAllCustomerMessages(phone) {
        if (phone.startsWith("+")) {
            return axiosInstance.get(baseUrl + "bridge/customer-outbox?customerPhone=" + phone.substring(1));
        }
        else {
            return axiosInstance.get(baseUrl + "bridge/customer-outbox?customerPhone=" + phone);
        }

    }

    /*Get single message based on messageId*/
    getSingleMessage(messageId) {

        return axiosInstance.get(baseUrl + "bridge/" + messageId);

    }

    /*Get all message templates*/
    getAllMessageTemplates() {

        return axiosInstance.get(baseUrl + "bridge/message-templates");

    }

    /*Get single message template*/
    getSingleMessageTemplate(templateId) {

        return axiosInstance.get(baseUrl + "bridge/message-templates/" + templateId);

    }

    /*Create single message template*/
    createMessageTemplate(formData) {

        return axiosInstance.post(baseUrl + "bridge/message-templates/add", formData);

    }

    /*Update single message template*/
    updateMessageTemplate(templateId, formData) {

        return axiosInstance.post(baseUrl + "bridge/message-templates/edit?id=" + templateId, formData);

    }

    /*Get all message types*/
    getAllMessageTypes() {

        return axiosInstance.get(baseUrl + "bridge/message-types");

    }

    /*Create Message Type*/
    createMessageType(formData) {

        return axiosInstance.get(baseUrl + "bridge/message-types/add", formData);

    }

    /*Create Message*/
    createMessage(formData) {

        return axiosInstance.post(baseUrl + "communications/sms/send", formData);

    }

    /*Create Custom Message*/
    createCustomMessage(formData) {

        return axiosInstance.post(baseUrl + "communications/sms/send-custom", formData);

    }

    /*Update single message template*/
    updateMessageType(messageTypeId, formData) {

        return axiosInstance.post(baseUrl + "bridge/message-types/edit/" + messageTypeId, formData);

    }
}

export default new CommunicationsService();
