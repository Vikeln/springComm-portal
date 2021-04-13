import axios from 'axios';

import AuthService from './services/auth.service';

var headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization': "Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': 'a1bed52870ec4338abf13513ad29875e'
  };
} else {
  headers = {

    'Content-Type': 'application/json',
    'App-Key': 'a1bed52870ec4338abf13513ad29875e'
  };
}

export const axiosInstance = axios.create({
  headers: headers,
  timeout: 20000,
});


// export const baseUrl = "http://localhost:8080/";
export const baseUrl = "http://10.38.83.36:31098/";
// export const baseUrl = "https://mobiconnect-api.mfs.co.ke/";


// export const userUrl = "https://mobiconnect-api.mfs.co.ke/users";
export const userUrl = "http://10.38.83.36:31098/users";
// export const userUrl = "http://localhost:8080/users";