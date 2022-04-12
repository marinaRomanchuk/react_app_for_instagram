import React, { useState, useEffect } from 'react';
import {API_DOMAIN} from './PathList';
import "bootstrap/dist/css/bootstrap.css";
import useToken from "./useToken";
import likeEmpty from '../like_empty.png';
import likeFull  from '../like_full.png';
import dislikeFull  from '../dislike_full.png';
import dislikeEmpty  from '../dislike_empty.png';
import commentEmpty  from '../comment.png';
import commentFull  from '../comment_full.png';
import logo from '../inst_logo.png';
import { useParams } from "react-router-dom";
import {getUserInfo, getListOfPosts, clickLike, clickDislike, clickComments, submitComment} from './Functions';


function User(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ user, setUser] = useState({});
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);
    const { id } = useParams();

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const user = await getUserInfo(authStr, id);
            setUser(user);

            const posts = await getListOfPosts(authStr, user.id);
            for (let post of posts) {
                post.showComments = false;
            }
            setPostList({postList: posts});
            setLoading(false);
        }
        handleSome();
    }, []);

    return (
        <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div class="list-group" style={{maxWidth: "1000px", margin:"0 auto"}}>
                    <div>
                        <img src={ user.profile_photo ? user.profile_photo : logo } width={100} alt={"image"}
                             style={{display: "inline-block", margin: "5px"}}/>
                        <h2 style={{display: "inline-block", margin: "10px"}}>{ user.username }</h2>
                    </div>
                    <h3> { user.first_name + " " + user.last_name } </h3>
                    <h4> { user.date_of_birth } </h4>
                    <h4> { user.description } </h4>

                    <br></br>
                    { postList.postList.map((post, index) => (
                        <div class="list-group-item list-group-item-action flex-column align-items-start">
                            <div style={{display: "inline-block", width: "100%"}}>
                                <img src={ post.author.profile_photo ? post.author.profile_photo : logo } width={40}
                                     style={{display: "inline-block"}}>
                                </img>
                                <h4 style={{display: "inline-block", margin: "5px"}}>{ post.author.username }</h4>
                            </div>
                            <center>
                                <img src={ post.photo } width={600} alt={"image"}/>
                                <h3>{post.description}</h3>
                                <button className="btn btn-secondary" onClick={() =>
                                    clickLike(post.id, index, authStr, postList, setPostList)}
                                        style={{margin: "3px", height: "50px"}}>
                                    <img src={post.stats.has_liked ? likeFull : likeEmpty} alt='like' width={25}
                                         style={{margin: "3px"}}/>
                                    {post.stats.likes_count}
                                </button>
                                <button className="btn btn-secondary" onClick={() =>
                                    clickDislike(post.id, index, authStr, postList, setPostList)}
                                        style={{margin: "3px", height: "50px"}}>
                                    <img src={post.stats.has_disliked ? dislikeFull : dislikeEmpty} alt='dislike' width={25}
                                         style={{margin: "3px"}}/>
                                    {post.stats.dislikes_count}
                                </button>
                                <button className="btn btn-secondary" onClick={() =>
                                    clickComments(index, authStr, postList, setPostList)}
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
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default User;
