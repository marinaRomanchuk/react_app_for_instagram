import React, { useState, useEffect } from 'react';
import {API_DOMAIN} from './PathList';
import "bootstrap/dist/css/bootstrap.css";
import axios from "axios";
import useToken from "./useToken";
import like_empty from '../like_empty.png';
import like_full  from '../like_full.png';
import dislike_full  from '../dislike_full.png';
import dislike_empty  from '../dislike_empty.png';
import comment_empty  from '../comment.png';
import comment_full  from '../comment_full.png';


async function getListOfPosts(AuthStr) {
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: AuthStr }, params: { feed: true,}
    })
        .then(result => result.data);
}

async function getListOfComments(AuthStr, post_id) {
    return axios.get("http://" + API_DOMAIN + "/api/comments/", { headers: { Authorization: AuthStr }, params: { post_id: post_id,}
    })
        .then(result => result.data);
}

async function getUser(AuthStr, user_id) {
    const user_str = ''.concat(user_id);
    return axios.get("http://" + API_DOMAIN + "/api/users/" + user_str + "/",
        { headers: { Authorization: AuthStr }, params: { feed: true,}
    })
        .then(result => result.data);
}

function postComment(AuthStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/comments/", credentials, {
        headers: {Authorization: AuthStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

function postLike(AuthStr, post_id, is_like) {
    const post_str = ''.concat(post_id);
    if (is_like) {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + post_str + "/like/", {}, {
            headers: {Authorization: AuthStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.post("http://" + API_DOMAIN + "/api/posts/" + post_str + "/dislike/", {}, {
            headers: {Authorization: AuthStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}

function deleteLike(AuthStr, post_id, is_like) {
    const post_str = ''.concat(post_id);
    if (is_like) {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + post_str + "/like/",  {
            headers: {Authorization: AuthStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
    else {
        return axios.delete("http://" + API_DOMAIN + "/api/posts/" + post_str + "/dislike/", {
            headers: {Authorization: AuthStr}
        }).catch((error) => {
            console.log(error.response);
        });
    }
}

async function getLikesCount(AuthStr, post_id) {
    const post_str = ''.concat(post_id);
    return axios.get("http://" + API_DOMAIN + "/api/posts/" + post_str + "/likes/count/", { headers: { Authorization: AuthStr }
    })
        .then(result => result.data);
}

function Feed(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const AuthStr = 'Token '.concat(token);

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const posts = await getListOfPosts(AuthStr);

            let ind = 0;
            for (let item of posts) {
                const likes = await getLikesCount(AuthStr, item.id);
                const comments = await getListOfComments(AuthStr, item.id);
                const user = await getUser(AuthStr, item.user_id);

                posts[ind].user = user;
                posts[ind].likes_count = likes.likes_count;
                posts[ind].dislikes_count = likes.dislike_count;
                posts[ind].like = likes.like;
                posts[ind].dislike = likes.dislike;
                posts[ind].comments = comments;
                posts[ind].show_comments = false;
                ind = ind + 1;
            }
            setPostList({postList: posts});
            setLoading(false);
        }
        handleSome();
    }, []);

    const clickLike = (post_id, ind) => {
        const newPostList = postList.postList;

        if (newPostList[ind].like) {
            deleteLike(AuthStr, post_id, 1);
            newPostList[ind].like = false;
            newPostList[ind].likes_count -= 1;
        }
        else {
            if (newPostList[ind].dislike) {
                deleteLike(AuthStr, post_id, 0);
                newPostList[ind].dislikes_count -= 1;
                newPostList[ind].dislike = false;
            }
            postLike(AuthStr, post_id, 1);
            newPostList[ind].like = true;
            newPostList[ind].likes_count += 1;
        }

        setPostList({postList: newPostList});
    }

    const clickDislike = (post_id, ind) => {
        const newPostList = postList.postList;

        if (newPostList[ind].dislike) {
            deleteLike(AuthStr, post_id, 0);
            newPostList[ind].dislike = false;
            newPostList[ind].dislikes_count -= 1;
        }
        else {
            if (newPostList[ind].like) {
                deleteLike(AuthStr, post_id, 1);
                newPostList[ind].like = false;
                newPostList[ind].likes_count -= 1;
            }
            postLike(AuthStr, post_id, 0);
            newPostList[ind].dislike = true;
            newPostList[ind].dislikes_count += 1;
        }

        setPostList({postList: newPostList});
    }

    const clickComments = (ind) => {
        const newPostList = postList.postList;
        newPostList[ind].show_comments = ! newPostList[ind].show_comments;
        setPostList({postList: newPostList});
    }

    const handleSubmit = async (e, post_id, ind) => {
        e.preventDefault();

        await postComment(AuthStr,{
            text: e.target.text.value,
            post: post_id
        });

        const newPostList = postList.postList;
        const comments = await getListOfComments(AuthStr, post_id);
        newPostList[ind].comments = comments;
        setPostList({postList: newPostList});
    }

    return (
        <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div class="list-group">
                    <h2> Welcome to your feed!</h2>
                         { postList.postList.map((item, index) => (
                             <div class="list-group-item list-group-item-action flex-column align-items-start">
                                 <div>
                                     <img src={item.user.profile_photo } width={40} style={{display:"inline-block"}}>
                                     </img>
                                     <h4 style={{display:"inline-block"}}>{ item.user.username }</h4>
                                 </div>
                                 <center>
                                 <img src={ "http://" + API_DOMAIN + item.photo } width={600}></img>
                                 <h3>{item.description}</h3>
                                 <button className="btn btn-secondary" onClick={() => clickLike(item.id, index)}>
                                     <img src={item.like ? like_full : like_empty} alt='like' width={25}/>
                                     {item.likes_count}
                                 </button>
                                 <button className="btn btn-secondary" onClick={() => clickDislike(item.id, index)}>
                                     <img src={item.dislike ? dislike_full : dislike_empty} alt='dislike' width={25}/>
                                     {item.dislikes_count}
                                 </button>
                                 <button className="btn btn-secondary" onClick={() => clickComments(index)}>
                                     <img src={item.show_comments ? comment_full : comment_empty}
                                          alt='comment' width={25}/>
                                 </button>
                                 </center>
                                 { item.show_comments ? item.comments.map(comment => (
                                     <div class="list-group-item list-group-item-action">{comment.text}
                                     </div>
                                 )) : <div></div>}
                                 <div className="list-group-item list-group-item-action">
                                     <form method="post"
                                           onSubmit={(e) => handleSubmit(e, item.id, index)}>
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
