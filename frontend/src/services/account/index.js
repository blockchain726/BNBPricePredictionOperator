import axios from 'axios'
import { API_BASE_URL } from 'config'

export const LOGIN_URL = API_BASE_URL + "/api/login";

export function login(address) {
    return axios.post(LOGIN_URL, { address } )
}
