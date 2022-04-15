import {postFollower, deleteFollower} from "../api/Users";
import React from "react";
import logo from "../../inst_logo.png";
import {Link} from "react-router-dom";

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

export const userSearchResults = (userList) => {
    return (
        <div className="list-group" style={{maxWidth: "1200px", margin: "0 auto"}}>
            {userList.length ? userList.map((user, index) => (
                <div className="list-group-item list-group-item-action"
                     style={{display: "inline-block", width: "100%"}}>
                    <img src={user.profile_photo ? user.profile_photo : logo} width={60}
                         style={{display: "inline-block", margin: "5px"}}>
                    </img>
                    <h4 style={{display: "inline-block", margin: "5px"}}><Link to={{
                        pathname: `/user/${user.id}`,
                        state: {id: user.id}
                    }}>{user.username}</Link></h4>

                    <h5 style={{margin: "5px"}}>{user.first_name + " " + user.last_name}</h5>
                </div>
            )) : <h4>No results found</h4>}
        </div>
    );
}
