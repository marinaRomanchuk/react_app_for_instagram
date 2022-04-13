import {
    deleteLike,
    getListOfComments, postComment,
    postLike,
    postFollower, deleteFollower
} from "../api/RequestFunctions";
import dislikeFull from "../../dislike_full.png";
import dislikeEmpty from "../../dislike_empty.png";
import React from "react";
import likeFull from "../../like_full.png";
import likeEmpty from "../../like_empty.png";
import commentFull from "../../comment_full.png";
import commentEmpty from "../../comment.png";
import {API_DOMAIN} from "../api/PathList";
import logo from "../../inst_logo.png";
import {Link} from "react-router-dom";

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

export const commentButton = (post, index, authStr, postList, setPostList) => {
    return (
        <button className="btn btn-secondary" onClick={() =>
            clickComments(index, authStr, postList, setPostList)}
                style={{margin: "3px", height: "50px"}}>
            <img src={post.showComments ? commentFull : commentEmpty}
                 alt='comment' width={25} style={{margin: "3px"}}/>
            {post.stats.comments_count}
        </button>
    );
}

export const newComment = (post, index, authStr, postList, setPostList) => {
    return (
        <div className="list-group-item list-group-item-action">
            <form method="post"
                  onSubmit={(e) =>
                      submitComment(e, post.id, index, authStr, postList, setPostList)}>
                <div className="form-group">
                    <input className="form-control" type="text" name="text"
                           placeholder="Leave your comment" required="required"/>
                    <br></br>
                    <button type="submit" className="btn btn-outline-dark">Send</button>
                </div>
            </form>
        </div>
    );
}

export const comments = (post) => {
    return (
        post.showComments ? post.comments.map(comment => (
            <div class="list-group-item list-group-item-action">
                <img src={ comment.user_info.profile_photo ? "http://" + API_DOMAIN +
                    comment.user_info.profile_photo : logo } width={30}
                     style={{display:"inline-block"}}>
                </img>
                <p style={{display:"inline-block", margin:"5px"}}><Link to={{
                    pathname: `/user/${comment.user_info.id}`,
                    state: { id: comment.user_info.id }
                }}>{ comment.user_info.username }</Link></p>
                <h5 style={{display:"inline-block"}}>{ comment.text }</h5>
            </div>
        )) : <div></div>
    );
}

export const postInfo = (post, index, authStr, postList, setPostList) => {
    return (
        <div>
            <img src={ post.photo } width={600} alt={"image"}></img>
            <h3>{post.description}</h3>
            {likeButton(post, index, authStr, postList, setPostList)}
            {dislikeButton(post, index, authStr, postList, setPostList)}
            {commentButton(post, index, authStr, postList, setPostList)}
        </div>
    );
}

export const userPresentation = (user) => {
    return (
        <div>
            <div>
                <img src={ user.profile_photo ? user.profile_photo : logo } width={100} alt={"image"}
                     style={{display: "inline-block", margin: "5px"}}/>
                <h2 style={{display: "inline-block", margin: "10px"}}>{ user.username }</h2>
            </div>
            <h3> { user.first_name + " " + user.last_name } </h3>
            <h4> { user.description } </h4>
        </div>
    );
}

export const postLine = (post) => {
    return (
        <div style={{display: "inline-block", width: "100%"}}>
            <img src={ post.author.profile_photo ? post.author.profile_photo : logo } width={40}
                 style={{display: "inline-block"}}>
            </img>
            <h4 style={{display: "inline-block", margin: "5px"}}><Link to={{
                pathname: `/user/${post.author.id}`,
                state: { id: post.author.id }
            }}>{ post.author.username }</Link></h4>
        </div>
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

export async function clickFollow (e, authStr, user) {
    if(user.relations.followed) {
        deleteFollower(authStr, user.id);
    }
    else {
        postFollower(authStr, user.id);
    }
    window.location.reload();
}
