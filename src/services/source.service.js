
import { axiosInstance } from '../API';


const communicationUrl = "http://localhost:8080/bridge";
// const communicationUrl = "http://10.38.83.54:30555/bridge";

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
