import React from "react";
import {Button, Modal} from "react-bootstrap";


export const userEditting = (user, userInfo, showUserInfo, handleChangeUserInfo,
                             handleCloseUserInfo, handleSendUserInfo, uploadProfileImage) => {
    return (
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
    );
}

export const photoAdding = (post, showPostCreation, handleChangePostCreation, handleClosePostCreation,
                            handleSendPostCreation, uploadPostImage) => {
    return (
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
    );
}
