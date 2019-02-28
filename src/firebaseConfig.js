import firebase from 'firebase/app'
import 'firebase/firestore'
import 'firebase/auth'

// firebase init
const config = {
    apiKey: "AIzaSyCOCUcu78gh6dlinBlgIldCX2D9qAPsPRE",
    authDomain: "yourgreatestpain.firebaseapp.com",
    databaseURL: "https://yourgreatestpain.firebaseio.com",
    projectId: "yourgreatestpain",
    storageBucket: "yourgreatestpain.appspot.com",
    messagingSenderId: "968308753504"
}
firebase.initializeApp(config)

// firebase utils
const firestore = firebase.firestore
const db = firebase.firestore()
const auth = firebase.auth()
const currentUser = auth.currentUser
//console.log(messaging)

// date issue fix according to firebase
// const settings = {
//     timestampsInSnapshots: true
// }
// db.settings(settings)

// firebase collections
const usersCollection = db.collection('users')
const gifsCollection = db.collection('gifs')

export {
    firestore,
    db,
    auth,
    currentUser,
    usersCollection,
    gifsCollection
}
