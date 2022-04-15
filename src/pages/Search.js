import React, { useState} from 'react';
import "bootstrap/dist/css/bootstrap.css";
import useToken from "../lib/api/useToken";
import {getSearchResults} from "../lib/api/Users";
import {userSearchResults} from "../lib/components/Users";


function Search(props) {
    const { token, setToken } = useToken();
    const [ searhString, setSearchString] = useState('');
    const [ userList, setUserList ] = useState([]);
    const [ loading, setLoading ] = useState(true);
    const authStr = 'Token '.concat(token);

    const handleSubmit = async e => {
        e.preventDefault();
        const posts = await getSearchResults(authStr, searhString);
        setUserList(posts.results);
        setLoading(false);
    }

    return (
        <div style={{maxWidth: "1200px", margin:"0 auto"}}>
            <form method="post" onSubmit={handleSubmit}>
                <fieldset>
                    <div className="form-group">
                        <fieldset>
                            <label className="form-label mt-4">Search the site</label>
                            <input className="form-control" type="text" placeholder="Find..."
                                   required="required" onChange={e => setSearchString(e.target.value)}
                                   value={searhString}/>
                        </fieldset>
                    </div>
                    <button type="submit" className="btn btn-outline-dark" style={{margin: "10px"}}>Search</button>
                </fieldset>
            </form>
            <br></br>

            {!loading && (
                userSearchResults(userList)
            )}
        </div>
    );
}


export default Search;
