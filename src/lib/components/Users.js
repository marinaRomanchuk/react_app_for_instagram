import {postFollower, deleteFollower} from "../api/Users";
import React from "react";
import logo from "../../inst_logo.png";

export const userPresentation = (user) => {
    return (
        <div>
            <div>
                <img src={ user.profile_photo ? user.profile_photo : logo } width={100} alt={"image"}
                     style={{display: "inline-block", margin: "5px"}}/>
                <h2 style={{display: "inline-block", margin: "10px"}}>{ user.username }</h2>
            </div>
            <h3> { user.first_name + " " + user.last_name } </h3>
            <h4> { user.description } </h4>
        </div>
    );
}

export async function clickFollow (e, authStr, user) {
    if(user.relations.followed) {
        deleteFollower(authStr, user.id);
    }
    else {
        postFollower(authStr, user.id);
    }
    window.location.reload();
}
