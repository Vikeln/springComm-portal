import axios from 'axios';

import AuthService from './services/auth.service';

var headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization': "Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': process.env.REACT_APP_KEY
  };
} else {
  headers = {

    'Content-Type': 'application/json',
    'App-Key': process.env.REACT_APP_KEY
  };
}

export const axiosInstance = axios.create({
  headers: headers,
  timeout: 20000,
});


// export const baseUrl = "http://localhost:8080/";
// export const baseUrl = "http://10.38.83.54:30560/";
export const baseUrl = process.env.REACT_APP_BASE;
export const appKey = process.env.REACT_APP_KEY;