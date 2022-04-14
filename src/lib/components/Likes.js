import {deleteLike, postLike} from "../api/Likes";
import likeFull from "../../like_full.png";
import likeEmpty from "../../like_empty.png";
import dislikeFull from "../../dislike_full.png";
import dislikeEmpty from "../../dislike_empty.png";
import React from "react";

export const likeButton = (post, index, authStr, postList, setPostList) => {
    return (
        <button className="btn btn-secondary" onClick={() =>
            clickLike(post.id, index, authStr, postList, setPostList)}
                style={{margin: "3px", height: "50px"}}>
            <img src={post.stats.has_liked ? likeFull : likeEmpty} alt='like' width={25}
                 style={{margin: "3px"}}/>
            {post.stats.likes_count}
        </button>
    );
}

export const dislikeButton = (post, index, authStr, postList, setPostList) => {
    return (
        <button className="btn btn-secondary" onClick={() =>
            clickDislike(post.id, index, authStr, postList, setPostList)}
                style={{margin: "3px", height: "50px"}}>
            <img src={post.stats.has_disliked ? dislikeFull : dislikeEmpty} alt='dislike' width={25}
                 style={{margin: "3px"}}/>
            {post.stats.dislikes_count}
        </button>
    );
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

