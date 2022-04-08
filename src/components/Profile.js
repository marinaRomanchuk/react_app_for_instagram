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
import basket  from '../basket.png';
import logo from '../inst_logo.png';
import {Button, Modal} from "react-bootstrap";


async function getListOfPosts(authStr, userId) {
    return axios.get("http://" + API_DOMAIN + "/api/posts/", { headers: { Authorization: authStr },
        params: { user_id: userId,}})
        .then(result => result.data);
}

async function getUserInfo(authStr) {
    return axios.get("http://" + API_DOMAIN + "/api/users/me/", { headers: { Authorization: authStr }})
        .then(result => result.data);
}

async function patchUserInfo(authStr, credentials) {
    return axios.patch("http://" + API_DOMAIN + "/api/users/me/", credentials,
        { headers: { Authorization: authStr }})
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

function postPost(authStr, credentials) {
    return axios.post("http://" + API_DOMAIN + "/api/posts/create/", credentials, {
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

function deletePost(authStr, postId) {
    const postStr = ''.concat(postId);
    return axios.delete("http://" + API_DOMAIN + "/api/posts/" + postStr + "/",  {
        headers: {Authorization: authStr}
    }).catch((error) => {
        console.log(error.response);
    });
}

function Profile(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ user, setUser] = useState({});
    const [ userInfo, setUserInfo] = useState({});
    const [ post, setPost ] = useState({description: "", photo: ""})
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showPostCreation, setShowPostCreation] = useState(false);

    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const user = await getUserInfo(authStr);
            setUser(user);
            setUserInfo(user);

            const posts = await getListOfPosts(authStr, user.id);
            for (let post of posts) {
                post.showComments = false;
            }
            setPostList({postList: posts});
            setLoading(false);
        }
        handleSome();
    }, []);

    const handleCloseUserInfo = () => {
        setProfileImage("");
        setShowUserInfo(false);
    };

    const handleClosePostCreation = () => {
        setPost(prevState => ({
            ...prevState,
            ["photo"]: ""
        }));
        setShowPostCreation(false);
    };

    const handleShowInformationEditor = () => setShowUserInfo(true);
    const handleShowPostCreation = () => setShowPostCreation(true);

    const handleChangeUserInfo = e => {
        const { name, value } = e.target;
        setUserInfo(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const handleChangePostCreation = e => {
        const { name, value } = e.target;
        setPost(prevState => ({
            ...prevState,
            [name]: value
        }));
    };

    const uploadPostImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setPost(prevState => ({
            ...prevState,
            ["photo"]: base64
        }));
    };

    const uploadProfileImage = async (e) => {
        const file = e.target.files[0];
        const base64 = await convertBase64(file);
        setProfileImage(base64);
    };

    const convertBase64 = (file) => {
        return new Promise((resolve, reject) => {
            const fileReader = new FileReader();
            fileReader.readAsDataURL(file);

            fileReader.onload = () => {
                resolve(fileReader.result);
            };

            fileReader.onerror = (error) => {
                reject(error);
            };
        });
    };

    const handleSendUserInfo = async (e) => {
        e.preventDefault();
        let dataSend = {
            "first_name": userInfo.first_name,
            "last_name": userInfo.last_name,
            "description": userInfo.description,
            "email": userInfo.email,
            "date_of_birth": userInfo.date_of_birth,
        };
        if (profileImage != "") {
            dataSend["profile_photo"] = profileImage;
        }
        await patchUserInfo(authStr, dataSend);
        setShowUserInfo(false);
        window.location.reload();
    }

    const handleSendPostCreation = async (e) => {
        e.preventDefault();
        if (post.photo != "") {
            await postPost(authStr, post);
            setShowPostCreation(false);
            window.location.reload();
        }
        else {
            alert("Please, choose photo to post")
        }
    }

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

    const clickDeletePost = async (postId) => {
        await deletePost(authStr, postId);
        window.location.reload();
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
        newPostList[index].stats.comments_count += 1;
        setPostList({postList: newPostList});
        e.target.reset();
    }

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
                    <div>
                        <button className="btn btn-secondary" onClick={handleShowInformationEditor}
                                style={{display: "inline-block", margin: "5px", height:"50px"}}>Edit information</button>
                        <Modal show={showUserInfo} onHide={handleCloseUserInfo}>
                            <Modal.Header closeButton>
                                <Modal.Title>User information</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h5>Username</h5>
                                <input type="text" placeholder="username" value={user.username}
                                       style={{marginBottom:"15px"}}/>

                                <h5>First name</h5>
                                <input type="text" placeholder="first name" value={userInfo.first_name}
                                       style={{marginBottom:"15px"}} name="first_name" onChange={handleChangeUserInfo}/>

                                <h5>Last name</h5>
                                <input type="text" placeholder="last name" value={userInfo.last_name}
                                       style={{marginBottom:"15px"}} name="last_name" onChange={handleChangeUserInfo}/>

                                <h5>Date of birth</h5>
                                <input type="date" placeholder="date of birth" value={userInfo.date_of_birth}
                                       style={{marginBottom:"15px"}} name="date_of_birth" onChange={handleChangeUserInfo}/>

                                <h5>Email</h5>
                                <input type="email" placeholder="email" value={userInfo.email}
                                       style={{marginBottom:"15px"}} name="email" onChange={handleChangeUserInfo}/>

                                <h5>Profile photo</h5>
                                <input type="file" style={{marginBottom:"15px"}}
                                    onChange={(e) => {uploadProfileImage(e);}}/>

                                <h5>Description</h5>
                                <input type="text" placeholder="description" value={userInfo.description}
                                       style={{marginBottom:"15px"}} name="description" onChange={handleChangeUserInfo}/>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleCloseUserInfo}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSendUserInfo}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>

                        <button className="btn btn-secondary" onClick={handleShowPostCreation}
                                style={{display: "inline-block", margin: "5px", height:"50px"}}>Create new post</button>
                        <Modal show={showPostCreation} onHide={handleClosePostCreation}>
                            <Modal.Header closeButton>
                                <Modal.Title>Post creation</Modal.Title>
                            </Modal.Header>
                            <Modal.Body>
                                <h5>Your photo</h5>
                                <input type="file" style={{marginBottom:"15px"}}
                                       onChange={(e) => {uploadPostImage(e);}}/>

                                <h5>Description</h5>
                                <input type="text" placeholder="description" value={post.description} name="description"
                                       style={{marginBottom:"15px"}} onChange={handleChangePostCreation}/>

                            </Modal.Body>
                            <Modal.Footer>
                                <Button variant="secondary" onClick={handleClosePostCreation}>
                                    Close
                                </Button>
                                <Button variant="primary" onClick={handleSendPostCreation}>
                                    Save Changes
                                </Button>
                            </Modal.Footer>
                        </Modal>
                    </div>
                    <br></br>
                    { postList.postList.map((post, index) => (
                        <div class="list-group-item list-group-item-action flex-column align-items-start">
                            <div style={{display: "inline-block", width: "100%"}}>
                                <img src={ post.author.profile_photo ? post.author.profile_photo : logo } width={40}
                                     style={{display: "inline-block"}}>
                                </img>
                                <h4 style={{display: "inline-block", margin: "5px"}}>{ post.author.username }</h4>
                                <button className="btn btn-secondary" onClick={() => clickDeletePost(post.id)}
                                        style={{height: "50px", position: "absolute", right: "0", margin: "3px"}}>
                                    <img src={ basket } width={30}/>
                                </button>
                            </div>
                            <center>
                                <img src={ post.photo } width={600} alt={"image"}/>
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


export default Profile;
