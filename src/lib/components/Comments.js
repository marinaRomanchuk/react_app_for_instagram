import commentFull from "../../comment_full.png";
import commentEmpty from "../../comment.png";
import {API_DOMAIN} from "../api/PathList";
import logo from "../../inst_logo.png";
import {Link} from "react-router-dom";
import React from "react";
import {getListOfComments, postComment} from "../api/Comments";


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
                <img src={ comment.user_info.profile_photo ?
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
