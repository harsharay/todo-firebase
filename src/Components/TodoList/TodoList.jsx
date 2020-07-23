import React,{ useState,useEffect } from 'react'
import { firestore, googlSignIn, createUserDocument, auth } from "../../Firebase/firebase.utils"
import * as firebase from "firebase";
import DeleteForeverIcon from '@material-ui/icons/DeleteForever';
import AddCommentIcon from '@material-ui/icons/AddComment';
import Alert from '@material-ui/lab/Alert';

import "./TodoList.styles.css"

function TodoList() {

    const [data, setData] = useState("") //Single task
    const [list, setList] = useState([]) //Todo List main
    const [userData ,setUserData] = useState([]) //User Data from firebase
    const [empty, setEmpty] = useState(null)

    // useEffect(() => {
    //     addToFirestore()
    // },[list])

    useEffect(() => {
        auth.onAuthStateChanged(user => {
            setUserData(user)
            createUserDocument(user)
        })
    },[])


    const handleChange = (e) => {
        let newValue = e.target.value
        setData(newValue)
    }

    const handleClick = () => {
        if(data.length!==0){
            // setList([...list,data])
            addToFirestoreAndGet(userData)
            // getItemsFromFirestore(userData)
        } 
        setData("")
    }

    //Adding individual task to firestore data
    const addToFirestoreAndGet = async (userData) => {
        if(userData){
            //Updating the individual task into the firebase array
            await firestore.doc(`/todoList/${userData.uid}`).update({ 
                listItems :  firebase.firestore.FieldValue.arrayUnion(data)
            })
            setEmpty(null)
            //Getting the data from firebase
            let response = await firestore.collection('todoList').where("uid","==",userData.uid).get()
            response.forEach(item => setList(item.data().listItems))
        }
    }

    //Retreiving data from firestore
    // const getItemsFromFirestore = async (userData) => {
    //     if(userData){
    //         let response = await firestore.collection('todoList').where("uid","==",userData.uid).get()
    //         response.forEach(item => console.log(item.data().listItems))
    //     }
    // } Initially wrote this a separate function, but there is a discrepancy in data between adding and deleting
    // Hence moved this function into a single function combined with adding.

    
    const handleRetrieve = async () => {
        if(userData){
            let reference = await firestore.collection('todoList').where("uid","==",userData.uid).get()
            reference.forEach(item => {
                if(item.data().listItems.length > 0){
                    setList(item.data().listItems)
                } else {
                    // alert("Nothing to display, add something")
                    setEmpty('empty')
                }
            })
        }
    }

    //Deleting the items
    const handleDelete = async (task) => {
        if(userData){
            await firestore.doc(`todoList/${userData.uid}`).update({
                listItems : firebase.firestore.FieldValue.arrayRemove(task)
            })
            let response = await firestore.collection('todoList').where("uid","==",userData.uid).get()
            response.forEach(item => setList(item.data().listItems))
        }
        
    }


    return (
        <div className="container">
            {userData ? 
            <div className="signed-in-data">
                <div className="button-group">
                    <button onClick={() => auth.signOut()} className="sign-out">Sign out</button>
                    {list.length===0 && <button onClick={handleRetrieve} className="retrieve">Retrieve old Data</button>}
                </div>
                {empty && <Alert severity="warning">Nothing to display, please add something</Alert>}
                <h2>Welcome <span className="user-name">{userData.displayName}</span></h2>
                <input type="text" placeholder="type here and click + " onChange={handleChange} value={data} className="input-box"/>
                <AddCommentIcon onClick={handleClick} className="add"/>
                <div className="list-items">
                    {list.length>0 ?
                        list.map((item,index) => <li key={index}>{item}<span className="delete" onClick={() => handleDelete(item)}><DeleteForeverIcon /></span></li>)
                    
                    :
                    <h3>Add some task</h3>}
                </div>
            </div>        
            :   <div>
                <h2>Sign in and proceed</h2>
                <button onClick={googlSignIn} className="sign-in">Google SignIn</button>
                </div>}
        </div>
    )
}

export default TodoList
