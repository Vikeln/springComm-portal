import { axiosInstance } from '../API';


// const userUrl = "http://10.38.83.54:30555/users";
// const baseUrl = "http://10.38.83.54:30555/";


const userUrl = "http://localhost:8080/users";
const baseUrl = "http://localhost:8080/";


class UserService {

    /*Create Single User*/
    createUser(formData) {

        return axiosInstance.post(userUrl+"/create",formData);

    }

    /*Get single user based on userId*/
    getUser(userId) {

        return axiosInstance.get(userUrl+"/" + userId);

    }

    updateUser(formData){


        return axiosInstance.put(userUrl+"/update",formData);

    }
    unlockUserAccount(id){

        return axiosInstance.get(baseUrl+"auth/unlockUserAccount/"+id);

    }

    // Activate a disable user
    enableUser(username){

        return axiosInstance.get(userUrl+"/enable?userName="+username);

    }
    // DeActivate a disable user
    deactivate(username){

        return axiosInstance.get(baseUrl+"auth/deactivateUser/"+username);

    }

    /*Delete single user based on userId*/
    deleteUser(userId) {

    }



    getAllUsers() {
        return axiosInstance.get(userUrl);
    }

    getUserGroups(){
        return axiosInstance.get(baseUrl+"user-groups");
    }

    createUserRoles(roleData){

        return axiosInstance.post(baseUrl+"roles/addrole",roleData);

    }
    updateUserRoles(roleData){

        return axiosInstance.put(baseUrl+"roles/editrole",roleData);

    }

    getUserRoles(){

        return axiosInstance.get(baseUrl+"roles");

    }

    getUserRole(roleId){

        return axiosInstance.get(baseUrl+"roles/view/"+roleId);

    }

    resetPassword(formData){
        return axiosInstance.post(baseUrl+"users/reset-password", formData);
    }

    getAllPermissions(){
        return axiosInstance.get(baseUrl+"privileges");
    }


}

export default new UserService();
