import React from "react";
import {dislikeButton, likeButton} from "./Likes";
import {commentButton} from "./Comments";
import logo from "../../inst_logo.png";
import {Link} from "react-router-dom";


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
