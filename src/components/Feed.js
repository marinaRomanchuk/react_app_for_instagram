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


async function getListOfPosts(token) {
    const AuthStr = 'Token '.concat(token);
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: AuthStr }, params: { feed: true,}
    })
        .then(result => result.data);
}

async function getListOfComments(token, post_id) {
    const AuthStr = 'Token '.concat(token);
    return axios.get("http://" + API_DOMAIN + "/api/comments/", { headers: { Authorization: AuthStr }, params: { post_id: post_id,}
    })
        .then(result => result.data);
}

function postComment(token, credentials) {
    const AuthStr = 'Token '.concat(token);
    return axios.post("http://" + API_DOMAIN + "/api/comments/", credentials, {
        headers: {Authorization: AuthStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

function postLike(token, post_id, is_like) {
    const AuthStr = 'Token '.concat(token);
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

function deleteLike(token, post_id, is_like) {
    const AuthStr = 'Token '.concat(token);
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

async function getLikesCount(token, post_id) {
    const AuthStr = 'Token '.concat(token);
    const post_str = ''.concat(post_id);
    return axios.get("http://" + API_DOMAIN + "/api/posts/" + post_str + "/likes/count/", { headers: { Authorization: AuthStr }
    })
        .then(result => result.data);
}

function Feed(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ loading, setLoading ] = useState(true);

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const posts = await getListOfPosts(token);

            let ind = 0;
            for (let item of posts) {
                const likes = await getLikesCount(token, item.id);
                const comments = await getListOfComments(token, item.id);

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
        console.log(postList);

    }, []);

    const clickLike = (post_id, ind) => {
        const newPostList = postList.postList;

        if (newPostList[ind].like) {
            deleteLike(token, post_id, 1);
            newPostList[ind].like = false;
            newPostList[ind].likes_count -= 1;
        }
        else {
            if (newPostList[ind].dislike) {
                deleteLike(token, post_id, 0);
                newPostList[ind].dislikes_count -= 1;
                newPostList[ind].dislike = false;
            }
            postLike(token, post_id, 1);
            newPostList[ind].like = true;
            newPostList[ind].likes_count += 1;
        }

        setPostList({postList: newPostList});
    }

    const clickDislike = (post_id, ind) => {
        const newPostList = postList.postList;

        if (newPostList[ind].dislike) {
            deleteLike(token, post_id, 0);
            newPostList[ind].dislike = false;
            newPostList[ind].dislikes_count -= 1;
        }
        else {
            if (newPostList[ind].like) {
                deleteLike(token, post_id, 1);
                newPostList[ind].like = false;
                newPostList[ind].likes_count -= 1;
            }
            postLike(token, post_id, 0);
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

        await postComment(token,{
            text: e.target.text.value,
            post: post_id
        });

        const newPostList = postList.postList;
        const comments = await getListOfComments(token, post_id);
        newPostList[ind].comments = comments;
        setPostList({postList: newPostList});
    }

    return (
        <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div class="list-group">
                    <h2> Welcome to your feed!</h2>
                        <center>
                         { postList.postList.map((item, index) => (
                             <div class="list-group-item list-group-item-action flex-column align-items-start">
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
                                 { item.show_comments ? item.comments.map(comment => (
                                     <div class="list-group-item list-group-item-action">{comment.text}
                                     </div>
                                 )) : <div></div>}
                                 <div className="list-group-item list-group-item-action">
                                     <form method="post"
                                           onSubmit={(e) => handleSubmit(e, item.id, index)}>
                                         <div className="form-group">
                                             <fieldset>
                                                 <input className="form-control" type="text" name="text"
                                                        placeholder="Leave your comment" required="required"/>
                                                 <button type="submit" className="btn btn-outline-dark">Send</button>
                                             </fieldset>
                                         </div>
                                     </form>
                                 </div>
                             </div>
                         ))}
                        </center>

                </div>
            )}
        </div>
    );
}


export default Feed;
