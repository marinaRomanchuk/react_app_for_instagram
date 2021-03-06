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

export async function getUserInfo(authStr, userId, setNotFound) {
    return axios.get("http://" + API_DOMAIN + "/api/users/" + userId + "/", { headers: { Authorization: authStr }})
        .then(result => result.data).catch((error) => {
            if (error.response.status == 404) {
                setNotFound(true);
            }
            else {
                alert(error.response.data.detail);
            }
            console.log(error.response);
        });
}

export async function patchUserInfo(authStr, credentials) {
    return axios.patch("http://" + API_DOMAIN + "/api/users/me/", credentials,
        { headers: { Authorization: authStr }})
        .then(result => result.data).catch((error) => {
            alert(error.response.data.detail);
            console.log(error.response);
        });
}

export function postFollower(authStr, userId) {
    return axios.post("http://" + API_DOMAIN + "/api/users/" + userId + "/follow/", {}, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        alert(error.response.data.detail);
        console.log(error.response);
    });
}

export function deleteFollower(authStr, userId) {
    return axios.delete("http://" + API_DOMAIN + "/api/users/" + userId + "/follow/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        alert(error.response.data.detail);
        console.log(error.response);
    });
}

export async function getSearchResults(authStr, searchString) {
    return axios.get("http://" + API_DOMAIN + "/api/search/", { headers: { Authorization: authStr },
        params: { search: searchString }})
        .then(result => result.data).catch((error) => {
            alert(error.response.data.detail);
            console.log(error.response);
        });
}
