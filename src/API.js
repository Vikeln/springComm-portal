import axios from 'axios';

import AuthService from './services/auth.service';

var  headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization':"Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': 'a1bed52870ec4338abf13513ad29875e'
  };
}else{
  headers = {

    'Content-Type': 'application/json',
    'App-Key': 'a1bed52870ec4338abf13513ad29875e'
  };
}

export const axiosInstance = axios.create({
  baseURL: 'https://localhost:8080/',
  headers: headers,
  timeout: 20000,
});
