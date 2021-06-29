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


//export const baseUrl = "http://localhost:8080/";
export const baseUrl = "http://54.82.177.49:8888/";
// export const baseUrl = process.env.REACT_APP_BASE;
export const appKey = process.env.REACT_APP_KEY;
