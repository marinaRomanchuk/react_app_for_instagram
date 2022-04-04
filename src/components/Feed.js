import React, { useState, useEffect } from 'react';
import {API_DOMAIN} from './PathList';
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import useToken from "./useToken";
import likeEmpty from '../like_empty.png';
import likeFull  from '../like_full.png';
import dislikeFull  from '../dislike_full.png';
import dislikeEmpty  from '../dislike_empty.png';
import commentEmpty  from '../comment.png';
import commentFull  from '../comment_full.png';
import logo from '../inst_logo.png';


async function getListOfPosts(authStr) {
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: authStr },
        params: { feed: true,}})
        .then(result => result.data);
}

async function getListOfComments(authStr, postId) {
    return axios.get("http://" + API_DOMAIN + "/api/comments/", { headers: { Authorization: authStr },
        params: { post_id: postId,}})
        .then(result => result.data);
}

function postComment(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/comments/", credentials, {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

function postLike(authStr, postId, isLike) {
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

function deleteLike(authStr, postId, isLike) {
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

async function getLikesCount(authStr, postId) {
    const postStr = ''.concat(postId);
    return axios.get("http://" + API_DOMAIN + "/api/posts/" + postStr + "/stats/",
        { headers: { Authorization: authStr }})
        .then(result => result.data);
}

function Feed(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const posts = await getListOfPosts(authStr);

            let index = 0;
            for (let post of posts) {
                const likes = await getLikesCount(authStr, post.id);

                posts[index].likesCount = likes.likes_count;
                posts[index].dislikesCount = likes.dislikes_count;
                posts[index].commentsCount = likes.comments_count;
                posts[index].hasLiked = likes.has_liked;
                posts[index].hasDisliked = likes.has_disliked;
                posts[index].showComments = false;
                index = index + 1;
            }
            setPostList({postList: posts});
            setLoading(false);
        }
        handleSome();
    }, []);

    const clickLike = (postId, index) => {
        const newPostList = postList.postList;

        if (newPostList[index].hasLiked) {
            deleteLike(authStr, postId, true);
            newPostList[index].hasLiked = false;
            newPostList[index].likesCount -= 1;
        }
        else {
            if (newPostList[index].hasDisliked) {
                deleteLike(authStr, postId, false);
                newPostList[index].dislikesCount -= 1;
                newPostList[index].hasDisliked = false;
            }
            postLike(authStr, postId, true);
            newPostList[index].hasLiked = true;
            newPostList[index].likesCount += 1;
        }

        setPostList({postList: newPostList});
    }

    const clickDislike = (postId, index) => {
        const newPostList = postList.postList;

        if (newPostList[index].hasDisliked) {
            deleteLike(authStr, postId, false);
            newPostList[index].hasDisliked = false;
            newPostList[index].dislikesCount -= 1;
        }
        else {
            if (newPostList[index].hasLiked) {
                deleteLike(authStr, postId, true);
                newPostList[index].hasLiked = false;
                newPostList[index].likesCount -= 1;
            }
            postLike(authStr, postId, false);
            newPostList[index].hasDisliked = true;
            newPostList[index].dislikesCount += 1;
        }

        setPostList({postList: newPostList});
    }

    const clickComments = async (index) => {
        const newPostList = postList.postList;
        if (!('comments' in newPostList[index])) {
            const comments = await getListOfComments(authStr, newPostList[index].id);
            newPostList[index].comments = comments;
        }
        newPostList[index].showComments = ! newPostList[index].showComments;
        setPostList({postList: newPostList});
    }

    const handleSubmit = async (e, postId, index) => {
        e.preventDefault();

        await postComment(authStr,{
            text: e.target.text.value,
            post: postId
        });

        const newPostList = postList.postList;
        const comments = await getListOfComments(authStr, newPostList[index].id);
        newPostList[index].comments = comments;
        newPostList[index].commentsCount += 1;
        setPostList({postList: newPostList});
        e.target.reset();
    }

    return (
        <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div class="list-group" style={{maxWidth: "1000px", margin:"0 auto"}}>
                    <h2> Welcome to your feed!</h2>
                     { postList.postList.map((post, index) => (
                         <div class="list-group-item list-group-item-action flex-column align-items-start">
                             <div>
                                 <img src={ post.user_info.profile_photo ? "http://" + API_DOMAIN +
                                            post.user_info.profile_photo : logo } width={40}
                                      style={{display: "inline-block"}}>
                                 </img>
                                 <h4 style={{display: "inline-block", margin: "5px"}}>{ post.user_info.username }</h4>
                             </div>
                             <center>
                             <img src={ "http://" + API_DOMAIN + post.photo } width={600} alt={"image"}></img>
                             <h3>{post.description}</h3>
                             <button className="btn btn-secondary" onClick={() => clickLike(post.id, index)}>
                                 <img src={post.hasLiked ? likeFull : likeEmpty} alt='like' width={25}
                                      style={{margin: "3px"}}/>
                                 {post.likesCount}
                             </button>
                             <button className="btn btn-secondary" onClick={() => clickDislike(post.id, index)}>
                                 <img src={post.hasDisliked ? dislikeFull : dislikeEmpty} alt='dislike' width={25}
                                      style={{margin: "3px"}}/>
                                 {post.dislikesCount}
                             </button>
                             <button className="btn btn-secondary" onClick={() => clickComments(index)}>
                                 <img src={post.showComments ? commentFull : commentEmpty}
                                      alt='comment' width={25} style={{margin: "3px"}}/>
                                 {post.commentsCount}
                             </button>
                             </center>
                             { post.showComments ? post.comments.map(comment => (
                                 <div class="list-group-item list-group-item-action">
                                     <img src={ comment.user_info.profile_photo ? "http://" + API_DOMAIN +
                                         comment.user_info.profile_photo : logo } width={30}
                                          style={{display:"inline-block"}}>
                                     </img>
                                     <p style={{display:"inline-block", margin:"5px"}}>{ comment.user_info.username }</p>
                                     <h5 style={{display:"inline-block"}}>{ comment.text }</h5>
                                 </div>
                             )) : <div></div>}
                             <div className="list-group-item list-group-item-action">
                                 <form method="post"
                                       onSubmit={(e) => handleSubmit(e, post.id, index)}>
                                     <div className="form-group">
                                         <input className="form-control" type="text" name="text"
                                                placeholder="Leave your comment" required="required"/>
                                         <br></br>
                                         <button type="submit" className="btn btn-outline-dark">Send</button>
                                     </div>
                                 </form>
                             </div>
                         </div>
                     ))}
                </div>
            )}
        </div>
    );
}


export default Feed;
