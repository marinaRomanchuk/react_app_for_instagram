import React, { useState, useEffect } from 'react';
import "bootstrap/dist/css/bootstrap.css";
import useToken from "../lib/api/useToken";
import basket  from '../basket.png';
import logo from '../inst_logo.png';
import {
    getSelfInfo, getListOfPosts, deletePost, patchUserInfo, postPost
} from '../lib/api/RequestFunctions';
import {comments, newComment, postInfo, userPresentation} from "../lib/components/Components";
import {userEditting, photoAdding} from "../lib/components/Modals";

function Profile(props) {
    const { token, setToken } = useToken();
    const [ postList, setPostList ] = useState([]);
    const [ user, setUser] = useState({});
    const [ userInfo, setUserInfo] = useState({});
    const [ newPost, setPost ] = useState({description: "", photo: ""})
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    const [showUserInfo, setShowUserInfo] = useState(false);
    const [showPostCreation, setShowPostCreation] = useState(false);

    const [profileImage, setProfileImage] = useState("");

    useEffect(() => {
        const handleSome = async () => {
            setLoading(true);
            const user = await getSelfInfo(authStr);
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
        if (newPost.photo != "") {
            await postPost(authStr, newPost);
            setShowPostCreation(false);
            window.location.reload();
        }
        else {
            alert("Please, choose photo to post")
        }
    }

    const clickDeletePost = async (postId) => {
        await deletePost(authStr, postId);
        window.location.reload();
    }

    return (
        <div>
            {loading && <div>Loading</div>}
            {!loading && (
                <div class="list-group" style={{maxWidth: "1000px", margin:"0 auto"}}>
                    {userPresentation(user)}
                    <div>
                        <button className="btn btn-secondary" onClick={handleShowInformationEditor}
                                style={{display: "inline-block", margin: "5px", height:"50px"}}>Edit information</button>
                            {userEditting(user, userInfo, showUserInfo, handleChangeUserInfo,
                                handleCloseUserInfo, handleSendUserInfo, uploadProfileImage)}

                        <button className="btn btn-secondary" onClick={handleShowPostCreation}
                                style={{display: "inline-block", margin: "5px", height:"50px"}}>Create new post</button>
                            {photoAdding(newPost, showPostCreation, handleChangePostCreation, handleClosePostCreation,
                                handleSendPostCreation, uploadPostImage)}
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


export default Profile;
