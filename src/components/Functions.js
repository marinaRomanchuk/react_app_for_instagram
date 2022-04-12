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
    const userStr = ''.concat(userId);
    return axios.get("http://" + API_DOMAIN + "/api/users/" + userStr + "/", { headers: { Authorization: authStr }})
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
    const postStr = ''.concat(postId);
    if (isLike) {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + postStr + "/like/", {}, {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + postStr + "/dislike/", {}, {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}

export function deleteLike(authStr, postId, isLike) {
    const postStr = ''.concat(postId);
    if (isLike) {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postStr + "/like/",  {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postStr + "/dislike/", {
            headers: {Authorization: authStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}

export function deletePost(authStr, postId) {
    const postStr = ''.concat(postId);
    return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postStr + "/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

export function clickLike (postId, index, authStr, postList, setPostList) {
    const newPostList = postList.postList;

    if (newPostList[index].stats.has_liked) {
        deleteLike(authStr, postId, true);
        newPostList[index].stats.has_liked = false;
        newPostList[index].stats.likes_count -= 1;
    }
    else {
        if (newPostList[index].stats.has_disliked) {
            deleteLike(authStr, postId, false);
            newPostList[index].stats.dislikes_count -= 1;
            newPostList[index].stats.has_disliked = false;
        }
        postLike(authStr, postId, true);
        newPostList[index].stats.has_liked = true;
        newPostList[index].stats.likes_count += 1;
    }

    setPostList({postList: newPostList});
}

export function clickDislike (postId, index, authStr, postList, setPostList) {
    const newPostList = postList.postList;

    if (newPostList[index].stats.has_disliked) {
        deleteLike(authStr, postId, false);
        newPostList[index].stats.has_disliked = false;
        newPostList[index].stats.dislikes_count -= 1;
    }
    else {
        if (newPostList[index].stats.has_liked) {
            deleteLike(authStr, postId, true);
            newPostList[index].stats.has_liked = false;
            newPostList[index].stats.likes_count -= 1;
        }
        postLike(authStr, postId, false);
        newPostList[index].stats.has_disliked = true;
        newPostList[index].stats.dislikes_count += 1;
    }

    setPostList({postList: newPostList});
}

export async function clickComments (index, authStr, postList, setPostList) {
    const newPostList = postList.postList;
    if (!('comments' in newPostList[index])) {
        const comments = await getListOfComments(authStr, newPostList[index].id);
        newPostList[index].comments = comments;
    }
    newPostList[index].showComments = ! newPostList[index].showComments;
    setPostList({postList: newPostList});
}

export async function submitComment (e, postId, index, authStr, postList, setPostList) {
    e.preventDefault();

    await postComment(authStr,{
        text: e.target.text.value,
        post: postId
    });

    const newPostList = postList.postList;
    const comments = await getListOfComments(authStr, newPostList[index].id);
    newPostList[index].comments = comments;
    newPostList[index].stats.comments_count += 1;
    setPostList({postList: newPostList});
    e.target.reset();
}
