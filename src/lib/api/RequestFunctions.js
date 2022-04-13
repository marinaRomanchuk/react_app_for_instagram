import axios from "axios";
import {API_DOMAIN} from "./PathList";

export async function loginUser(credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/token/", credentials)
        .then(result => result.data)
        .catch((error) => {
            console.log(error.response);
        });
}

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

export async function getListOfComments(authStr, postId) {
    return axios.get("http://" + API_DOMAIN + "/api/comments/", { headers: { Authorization: authStr },
        params: { post_id: postId,}})
        .then(result => result.data);
}

export function postComment(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/comments/", credentials, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

export function postPost(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/posts/create/", credentials, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

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

export function deletePost(authStr, postId) {
    return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postId + "/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
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
