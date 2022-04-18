import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import useToken from "../lib/api/useToken";
import {getFeed} from '../lib/api/Posts';
import {newComment, comments} from "../lib/components/Comments";
import {postInfo, postLine} from "../lib/components/Posts";

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
                    <h2 style={{margin: "15px"}}> Welcome to your feed!</h2>
                     { postList.postList.length ? postList.postList.map((post, index) => (
                         <div class="list-group-item list-group-item-action flex-column align-items-start">
                             {postLine(post)}
                             <center>
                                 {postInfo(post, index, authStr, postList, setPostList)}
                             </center>
                             {comments(post)}
                             {newComment(post, index, authStr, postList, setPostList)}
                         </div>
                     )) : <div>
                         <h4>It's empty now...</h4>
                         <h4>Find people and subscribe them</h4>
                     </div>}
                </div>
            )}
        </div>
    );
}


export default Feed;
