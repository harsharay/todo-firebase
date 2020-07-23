import firebase from "firebase/app"
import "firebase/auth"
import "firebase/firestore"


const firebaseConfig = {
    apiKey: "AIzaSyAAvuA7BTJRVFRym3cRHHzwfPIM3NaCTP0",
    authDomain: "crwn-db-b2bb7.firebaseapp.com",
    databaseURL: "https://crwn-db-b2bb7.firebaseio.com",
    projectId: "crwn-db-b2bb7",
    storageBucket: "crwn-db-b2bb7.appspot.com",
    messagingSenderId: "281711477222",
    appId: "1:281711477222:web:7f1a80f4d9c5158ff89627"
  };
  // Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firestore = firebase.firestore()
export const auth = firebase.auth()

const provider = new firebase.auth.GoogleAuthProvider()

provider.setCustomParameters({ prompt : 'select_account' })

export const googlSignIn = () => auth.signInWithRedirect(provider)

//Creating user document

export const createUserDocument = async (userAuth) => {
    if(userAuth){
        let reference = firestore.doc(`todoList/${userAuth.uid}`)
        let snapshot = await reference.get()
        if(!snapshot.exists){
            let { displayName, uid, email } = userAuth
            let createdAt = new Date()
            let listItems = []
            try {
                reference.set({
                    displayName,
                    uid,
                    email,
                    createdAt,
                    listItems
                })
            } catch (e) {
                console.log(`${e.message} is the error`)
            }
        } else {
            return userAuth;
            // console.log(userAuth)
        }
    }
}

