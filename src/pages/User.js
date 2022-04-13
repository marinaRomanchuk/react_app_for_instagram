import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import useToken from "../lib/api/useToken";
import { useParams } from "react-router-dom";
import {getUserInfo, getListOfPosts} from '../lib/api/RequestFunctions';
import {comments, newComment, postInfo, userPresentation, postLine, clickFollow} from "../lib/components/Components";


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
                    {userPresentation(user)}
                    <div>
                        <button className="btn btn-secondary" onClick={(e) =>
                            clickFollow(e, authStr, user, setUser)}
                                style={{display: "inline-block", margin: "5px", height:"50px"}}>{
                            user.relations.followed ? "Unsubscribe" : "Subscribe"
                        }</button>
                        <h5>{
                            user.relations.followed ? "You are following " + user.username : ""
                        }</h5>
                    </div>
                    <br></br>
                    { postList.postList.map((post, index) => (
                        <div class="list-group-item list-group-item-action flex-column align-items-start">
                            {postLine(post)}
                            <center>
                                {postInfo(post, index, authStr, postList, setPostList)}
                            </center>
                            {comments(post)}
                            {newComment(post, index, authStr, postList, setPostList)}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}


export default User;
