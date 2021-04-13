import { axiosInstance,baseUrl } from '../API';

class SourceService {

    /*Get all Sources from endpoint*/
    getAllSources() {
        return axiosInstance.get(baseUrl + "bridge/source");

    }

    /*Get all active and status=COMPLETE Sources from endpoint*/
    getAllActiveSources() {
        return axiosInstance.get(baseUrl + "bridge/source/active");

    }

    /*Create source*/
    createSource(formData) {

        return axiosInstance.post(baseUrl + "bridge/source/add", formData);

    }

    /*Update single source*/
    updateSource(alphanum, activate, formData) {

        return axiosInstance.post(baseUrl + "bridge/source/activate/" + alphanum + "?activate=" + activate, formData);

    }
}

export default new SourceService();
