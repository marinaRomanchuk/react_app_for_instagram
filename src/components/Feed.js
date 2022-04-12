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
import {Link} from "react-router-dom";
import {getFeed, clickLike, clickDislike, clickComments, submitComment} from './Functions';

function Feed(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const posts = await getFeed(authStr);
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
                    <h2> Welcome to your feed!</h2>
                     { postList.postList.map((post, index) => (
                         <div class="list-group-item list-group-item-action flex-column align-items-start">
                             <div>
                                 <img src={ post.author.profile_photo ? post.author.profile_photo : logo } width={40}
                                      style={{display: "inline-block"}}>
                                 </img>
                                 <h4 style={{display: "inline-block", margin: "5px"}}> <Link to={{
                                     pathname: `/user/${post.author.id}`,
                                     state: { id: post.author.id }
                                 }}>{ post.author.username }</Link></h4>
                             </div>
                             <center>
                             <img src={ post.photo } width={600} alt={"image"}></img>
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
                                     <p style={{display:"inline-block", margin:"5px"}}><Link to={{
                                         pathname: `/user/${comment.user_info.id}`,
                                         state: { id: comment.user_info.id }
                                     }}>{ comment.user_info.username }</Link></p>
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


export default Feed;
