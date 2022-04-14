import axios from "axios";
import {API_DOMAIN} from "./PathList";

export function postLike(authStr, postId, isLike) {
    if (isLike) {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + postId + "/like/", {}, {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + postId + "/dislike/", {}, {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}

export function deleteLike(authStr, postId, isLike) {
    if (isLike) {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postId + "/like/",  {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postId + "/dislike/", {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}
