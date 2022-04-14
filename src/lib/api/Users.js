import axios from "axios";
import {API_DOMAIN} from "./PathList";

export async function loginUser(credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/token/", credentials)
        .then(result => result.data)
        .catch((error) => {
            console.log(error.response);
        });
}

export async function getSelfInfo(authStr) {
    return axios.get("http://" + API_DOMAIN + "/api/users/me/", { headers: { Authorization: authStr }})
        .then(result => result.data);
}

export async function getUserInfo(authStr, userId) {
    return axios.get("http://" + API_DOMAIN + "/api/users/" + userId + "/", { headers: { Authorization: authStr }})
        .then(result => result.data);
}

export async function patchUserInfo(authStr, credentials) {
    return axios.patch("http://" + API_DOMAIN + "/api/users/me/", credentials,
        { headers: { Authorization: authStr }})
        .then(result => result.data);
}

export function postFollower(authStr, userId) {
    return axios.post("http://" + API_DOMAIN + "/api/users/" + userId + "/follow/", {}, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

export function deleteFollower(authStr, userId) {
    return axios.delete("http://" + API_DOMAIN + "/api/users/" + userId + "/follow/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}
