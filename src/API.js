import axios from 'axios';

import AuthService from './services/auth.service';

var  headers;
if (AuthService.getCurrentUserAccessToken()) {
  headers = {

    'Authorization':"Bearer " + AuthService.getCurrentUserAccessToken(),
    'Content-Type': 'application/json',
    'App-Key': '12702e6f3d914ff7b4c69573195f4017'
  };
}else{
  headers = {

    'Content-Type': 'application/json',
    'App-Key': '12702e6f3d914ff7b4c69573195f4017'
  };
}

export const axiosInstance = axios.create({
  baseURL: 'https://localhost:8080/',
  headers: headers,
  timeout: 20000,
});
