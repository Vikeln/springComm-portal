import { axiosInstance, baseUrl } from '../API';

class SourceService {

    /*Get all Sources from endpoint*/
    getAllSources(clientKey,tenant) {
        if (clientKey != undefined)
            return axiosInstance.get(baseUrl + "bridge/source/" + clientKey);
        else if (tenant != undefined && tenant != "")
            return axiosInstance.get(baseUrl + "bridge/source/tenant/" + tenant);
        else
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
    activateSource(sourceId,status) {

        return axiosInstance.post(baseUrl + "bridge/source/activate/" + sourceId+"?status="+status);

    }
}

export default new SourceService();
