import React, { useState, useEffect, useContext } from 'react'
import { UserContext } from '../../App'
import M from 'materialize-css'
import { Link } from 'react-router-dom' //link helps page to not reload 
const Home = () => {
    const [data, setData] = useState([])
    const { state, dispatch } = useContext(UserContext)
    useEffect(() => {
        fetch('/allpost', {
            headers: {
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                setData(result.posts)
            })
    }, [])

    const likePost = (id) => {
        fetch('/like', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }
    const unlikePost = (id) => {
        fetch('/unlike', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId: id
            })
        }).then(res => res.json())
            .then(result => {
                //   console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)
            }).catch(err => {
                console.log(err)
            })
    }

    const makeComment = (text, postId) => {
        fetch('/comment', {
            method: "put",
            headers: {
                "Content-Type": "application/json",
                "Authorization": "Bearer " + localStorage.getItem("jwt")
            },
            body: JSON.stringify({
                postId,
                text
            })
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.map(item => {
                    if (item._id === result._id) {
                        return result
                    } else {
                        return item
                    }
                })
                setData(newData)

            }).catch(err => {
                console.log(err)
            })
    }

    const deletePost = (postid) => {
        fetch(`/deletepost/${postid}`, {
            method: "delete",
            headers: {
                Authorization: "Bearer " + localStorage.getItem("jwt")
            }
        }).then(res => res.json())
            .then(result => {
                console.log(result)
                const newData = data.filter(item => {
                    return item._id !== result._id
                })
                setData(newData)
            })
    }

    // const deleteComment = (postid, commentid) => {

    //     fetch(`/deletecomment/${postid}/${commentid}`, {
    //         method: "delete",
    //         headers: {
    //             Authorization: "Bearer " + localStorage.getItem("jwt"),
    //         },
    //     })
    //         .then((res) => res.json())
    //         .then((result) => {
    //             const newData = data.map((item) => {

    //                 if (item._id == result._id) {
    //                     return result;
    //                 } else {
    //                     return item;
    //                 }
    //             });
    //             setData(newData);
    //         });
    // };


    return (
        <div className="home">
            {
                data.map(item => {
                    return (
                        <div className="card home-card hello" key={item._id}>
                            <h5 style={{ padding: "5px" }}><Link to={item.postedBy._id !== state._id ? "/profile/" + item.postedBy._id : "/profile"}>{item.postedBy.name}</Link> {item.postedBy._id === state._id
                                && <i className="material-icons" style={{
                                    float: "right",
                                    color:"red"
                                }}
                                    onClick={() => deletePost(item._id)}
                                >delete</i>

                            }</h5>
                            <div className="card-image">
                                <img src={item.photo} />
                            </div>
                            <div className="card-content">

                                {item.likes.includes(state._id)
                                    ?
                                    <i className="material-icons" style={{ color: "red" }}
                                        onClick={() => { unlikePost(item._id) }}
                                    >favorite</i>
                                    :
                                    <i className="material-icons" style={{ color: "black" }}
                                        onClick={() => { likePost(item._id) }}
                                    >favorite</i>
                                }


                                <h6  style={{ fontWeight: "500" }} >{item.likes.length} likes</h6>
                                <h6>{item.title}</h6>
                                <p>{item.body}</p>
                                {
                                    item.comments.map(record => {
                                        return (
                                            <h6 key={record._id}><span style={{ fontWeight: "500" }}>{record.postedBy.name}</span> {record.text}</h6>
                                        )
                                    })
                                }
                                <form onSubmit={(e) => {

                                    e.preventDefault()
                                    makeComment(e.target[0].value, item._id)
                                    setData([]);
                                    M.toast({html:"comment sent sucessfully",classes:"#43a047 green darken-1"})
                                }}>
                                    <input type="text" placeholder="add a comment" />
                                </form>
                                {/* <h6 key={record._id}>
                                    <span style={{ fontWeight: "500" }}>
                                        {record.postedBy.name}
                                    </span>{" "}
                                    {record.text}
                                    {(item.postedBy._id || record.postedBy._id) ==
                                        state._id && (
                                            <i
                                                className="material-icons"
                                                style={{
                                                    float: "right",
                                                }}
                                                onClick={() => deleteComment(item._id, record._id)}
                                            >
                                                delete
                                            </i>
                                        )}
                                </h6> */}
                            </div>
                        </div>
                    )
                })
            }


        </div>
    )
}


export default Home