import axios from 'axios';

import AuthService from './services/auth.service';

var  headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization':"Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': '59be5d4fc037468cafcdb49f053a0a87'
  };
}else{
  headers = {

    'Content-Type': 'application/json',
    'App-Key': '59be5d4fc037468cafcdb49f053a0a87'
  };
}

export const axiosInstance = axios.create({
  baseURL: 'https://localhost:8080/',
  headers: headers,
  timeout: 20000,
});
