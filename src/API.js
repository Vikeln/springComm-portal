import axios from 'axios';

import AuthService from './services/auth.service';

var headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization': "Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': AuthService.getCurrentClientKey()
  };
} else {
  headers = {

    'Content-Type': 'application/json'
  };
}

export const axiosInstance = axios.create({
  headers: headers,
  timeout: 20000,
});



export const baseUrl = "http://localhost:8080/";
export const clientBaseUrl = "http://localhost:8081/";
export const ipayKeyString = "demoCHANGED";
export const appKey = process.env.REACT_APP_KEY;
