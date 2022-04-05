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

function Feed(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const posts = await getListOfPosts(authStr);
            for (let post of posts) {
                post.showComments = false;
            }
            setPostList({postList: posts});
            setLoading(false);
        }
        handleSome();
    }, []);

    const clickLike = (postId, index) => {
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

    const clickDislike = (postId, index) => {
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
                                 <img src={ post.author.profile_photo ? post.author.profile_photo : logo } width={40}
                                      style={{display: "inline-block"}}>
                                 </img>
                                 <h4 style={{display: "inline-block", margin: "5px"}}>{ post.author.username }</h4>
                             </div>
                             <center>
                             <img src={ post.photo } width={600} alt={"image"}></img>
                             <h3>{post.description}</h3>
                             <button className="btn btn-secondary" onClick={() => clickLike(post.id, index)}
                                     style={{margin: "3px", height: "50px"}}>
                                 <img src={post.stats.has_liked ? likeFull : likeEmpty} alt='like' width={25}
                                      style={{margin: "3px"}}/>
                                 {post.stats.likes_count}
                             </button>
                             <button className="btn btn-secondary" onClick={() => clickDislike(post.id, index)}
                                     style={{margin: "3px", height: "50px"}}>
                                 <img src={post.stats.has_disliked ? dislikeFull : dislikeEmpty} alt='dislike' width={25}
                                      style={{margin: "3px"}}/>
                                 {post.stats.dislikes_count}
                             </button>
                             <button className="btn btn-secondary" onClick={() => clickComments(index)}
                                     style={{margin: "3px", height: "50px"}}>
                                 <img src={post.showComments ? commentFull : commentEmpty}
                                      alt='comment' width={25} style={{margin: "3px"}}/>
                                 {post.stats.comments_count}
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
