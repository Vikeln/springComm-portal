import { axiosInstance,baseUrl } from '../API';


class AuthService {

    forgotPassword(formData) {

        //return axiosInstanceInstance.post(baseUrl + "auth"+"/resetpassword", formData);
        return axiosInstance.post(baseUrl + "auth" + "/forgotpassword", formData);

    }

    resetPassword(formData) {

        //return axiosInstanceInstance.post(baseUrl + "auth"+"/resetpassword", formData);
        return axiosInstance.post(baseUrl + "auth" + "/resetpassword", formData);


    }
    /*Login method
    Set username and password field, and will respond with true or false
    */
    login(username, password) {

        return axiosInstance.post(baseUrl + "auth", {
            username,
            password
        },{
            headers: {
                'Content-Type': 'application/json',
                "access-control-allow-origin" : "*",
            }
        });

    }

    loginDummy(email, password) {

        if (email == "jakello@mfs.co.ke" && password == "12345") {

            localStorage.setItem("user", "John");

            return true;

        } else {

            return false;

        }
    }

    /*Logout user state from local storage*/

    logout() {


        localStorage.removeItem("user");
        localStorage.removeItem("data");
        localStorage.removeItem("loginTime");
        localStorage.removeItem("email");
        localStorage.removeItem("roles");
        localStorage.removeItem("clientId");
        localStorage.removeItem("client");
        localStorage.removeItem("clientName");
        localStorage.removeItem("name");
        localStorage.removeItem("accessToken");
        window.location.href="/auth/login";
        window.location.reload();

    }

    /*Register New User
    send username, email and password
    */
    register(username, email, password) {

        return axiosInstance.post(baseUrl + "auth", {
            username,
            email,
            password
        });

    }

    /*getCurrentUser
    Returns user state from local storage*/
    getCurrentUser() {

        //return JSON.parse(localStorage.getItem("user"));
        return localStorage.getItem("user");

    }
    getUserLoggedInAt() {

        //return JSON.parse(localStorage.getItem("user"));
        return localStorage.getItem("loginTime");

    }
    checkIfRoleExists(role) {
        if (localStorage.getItem("roles")) {
            if (localStorage.getItem("roles").includes(role))
                return true;
            return false;

        }

    }

    getCurrentUserEmail() {
        return localStorage.getItem("email");
    }

    getCurrentUserName() {
        return localStorage.getItem("name");
    }

    getCurrentUserAccessToken() {

        return localStorage.getItem("accessToken");

    }
    
    getCurrentClientId() {

        return localStorage.getItem("clientId");

    }
    getCurrentClientKey() {

        return localStorage.getItem("client");

    }
    getCurrentClientName() {

        return localStorage.getItem("clientName");

    }

    getSampleTest() {

        return false;

    }
}

export default new AuthService();
