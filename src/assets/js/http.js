import axios from 'axios'
import qs from 'query-string'

axios.defaults.baseURL = 'http://127.0.0.1:7001';
axios.defaults.timeout = 60000;

//axios.defaults.headers['Authorization'] = "";

export function setToken(token){
    axios.defaults.headers['Authorization'] = token;
}
export const GET = (url,headers={}) => {return axios.get(url,headers)};
export const POST = (url,body,headers={}) => {return axios.post(url, body,headers)}
