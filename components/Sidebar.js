import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faComment,
  faSearch,
  faUserCircle,
  faEllipsisV,
} from '@fortawesome/free-solid-svg-icons'
import * as EmailValidator from 'email-validator'
import { auth, db } from '../firebase'
import { useAuthState } from 'react-firebase-hooks/auth'
import { useCollection } from 'react-firebase-hooks/firestore'
import Chat from '../components/Chat'

function Sidebar() {
  const [user] = useAuthState(auth)
  const userChatRef = db
    .collection('chats')
    .where('users', 'array-contains', user.email)

  const [chatsSnapshot] = useCollection(userChatRef)

  const createChat = () => {
    const input = prompt(
      'Please enter an email address for the user you wish to chat with'
    )

    if (!input) return null

    if (
      EmailValidator.validate(input) &&
      !chatAlreadyExists(input) &&
      input !== user.email
    ) {
      db.collection('chats').add({
        users: [user.email, input],
      })
    }
  }
  const chatAlreadyExists = (recipientEmail) =>
    !!chatsSnapshot?.docs.find(
      (chat) =>
        chat.data().users.find((user) => user === recipientEmail)?.length > 0
    )
  return (
    <div className='h-screen w-80 flex-1 overflow-x-scroll'>
      <div className='h-20 bg-gray-100 w-full flex justify-between px-4 items-center shadow-xl'>
        <div>
          <div
            className='text-4xl text-gray-400 cursor-pointer'
            onClick={() => auth.signOut()}
          >
            <img src={user.photoURL} className='rounded-full h-10 w-10' />
          </div>
        </div>
        <div className='flex justify-between'>
          <div className='text-2xl mr-4 text-gray-400'>
            <FontAwesomeIcon icon={faComment}></FontAwesomeIcon>
          </div>
          <div className='text-2xl text-gray-400'>
            <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
          </div>
        </div>
      </div>
      <div className='flex justify-center items-center p-4 w-full'>
        <div className='text-base mr-4'>
          <FontAwesomeIcon icon={faSearch}></FontAwesomeIcon>
        </div>
        <div>
          <input
            type='text'
            className='py-3 px-4 bg-white rounded-lg placeholder-gray-400 text-gray-900 appearance-none inline-block w-full shadow-md focus:outline-none focus:ring-2 focus:ring-gray-50-600'
            placeholder='Search in chats'
          />
        </div>
      </div>
      <div className='flex justify-center'>
        <button
          onClick={createChat}
          className='uppercase bg-gray-100 p-4 w-full hover:border-gray-300 border'
        >
          start a new chat
        </button>
      </div>
      {chatsSnapshot?.docs.map((chat) => (
        <Chat key={chat.id} id={chat.id} users={chat.data().users} />
      ))}
    </div>
  )
}

export default Sidebar
