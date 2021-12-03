import { axiosInstance,baseUrl } from '../API';

class UserService {

    /*Create Single User*/
    createUser(formData) {

        return axiosInstance.post(baseUrl+"users/create",formData);

    }

    /*Get single user based on userId*/
    getUser(userId) {

        return axiosInstance.get(baseUrl+"users/" + userId);

    }

    updateUser(formData){


        return axiosInstance.post(baseUrl+"users/update",formData);

    }
    unlockUserAccount(id){

        return axiosInstance.get(baseUrl+"accounts/unlockUserAccount/"+id);

    }

    // Activate a disable user
    enableUser(username){

        return axiosInstance.get(baseUrl+"users/enable?userName="+username);

    }
    // DeActivate a disable user
    deactivate(id){

        return axiosInstance.get(baseUrl+"users/deactivateUser/"+id);

    }

    /*Delete single user based on userId*/
    deleteUser(userId) {

    }

    getAllUsers() {
        return axiosInstance.get(baseUrl + "users");
    }

    getUserGroups(){
        return axiosInstance.get(baseUrl+"user-groups");
    }

    createUserRoles(roleData){

        return axiosInstance.post(baseUrl+"roles/addrole",roleData);

    }
    updateUserRoles(roleData){

        return axiosInstance.post(baseUrl+"roles/editrole",roleData);

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
