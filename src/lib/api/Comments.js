import axios from "axios";
import {API_DOMAIN} from "./PathList";

export async function getListOfComments(authStr, postId) {
    return axios.get("http://" + API_DOMAIN + "/api/comments/", { headers: { Authorization: authStr },
        params: { post_id: postId,}})
        .then(result => result.data).catch((error) => {
            alert(error.response.data.detail);
            console.log(error.response);
        });
}

export function postComment(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/comments/", credentials, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        alert(error.response.data.detail);
        console.log(error.response);
    });
}
