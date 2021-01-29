
import { axiosInstance } from '../API';


const communicationUrl = "https://lbtotal.mfs.co.ke/bridge";

class SourceService {


    /*Get all Sources from endpoint*/
    getAllSources() {
        return axiosInstance.get(communicationUrl + "/source");

    }

    /*Get all active and status=COMPLETE Sources from endpoint*/
    getAllActiveSources() {
        return axiosInstance.get(communicationUrl + "/source/active");

    }

    /*Create source*/
    createSource(formData) {

        return axiosInstance.post(communicationUrl + "/source/add", formData);

    }

    /*Update single source*/
    updateSource(alphanum, activate, formData) {

        return axiosInstance.post(communicationUrl + "/source/activate/" + alphanum + "?activate=" + activate, formData);

    }
}

export default new SourceService();
