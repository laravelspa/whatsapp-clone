import firebase from 'firebase'

const firebaseConfig = {
  apiKey: 'AIzaSyBV-O_Z7GbwdroTySqNYyBLtlFKCd4AgvA',
  authDomain: 'whatsapp-d97f5.firebaseapp.com',
  projectId: 'whatsapp-d97f5',
  storageBucket: 'whatsapp-d97f5.appspot.com',
  messagingSenderId: '721498561063',
  appId: '1:721498561063:web:0650df197e63310eee4c02',
}

const app = !firebase.apps.length
  ? firebase.initializeApp(firebaseConfig)
  : firebase.app()

const db = app.firestore()
const auth = app.auth()
const provider = new firebase.auth.GoogleAuthProvider()

export { db, auth, provider }
