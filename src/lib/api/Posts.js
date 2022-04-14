import axios from "axios";
import {API_DOMAIN} from "./PathList";


export async function getListOfPosts(authStr, userId) {
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: authStr },
        params: { user_id: userId,}})
        .then(result => result.data);
}

export async function getFeed(authStr) {
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: authStr },
        params: { feed: true,}})
        .then(result => result.data);
}

export function postPost(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/posts/create/", credentials, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

export function deletePost(authStr, postId) {
    return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postId + "/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}
