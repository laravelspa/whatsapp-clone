import { useRouter } from 'next/router'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import {
  faMicrophone,
  faPaperclip,
  faEllipsisV,
  faLaugh,
} from '@fortawesome/free-solid-svg-icons'
import { useCollection } from 'react-firebase-hooks/firestore'
import Message from './Message'
import { useEffect, useRef, useState } from 'react'
import firebase from 'firebase'
import getRecipientEmail from '../utils/getRecipientEmail'
import TimeAgo from 'timeago-react'

function ChatScreen({ chat, messages }) {
  const [user] = useAuthState(auth)
  const router = useRouter()
  const endMessagesRef = useRef(null)
  const [input, setInput] = useState('')
  const [messagesSnapshot] = useCollection(
    db
      .collection('chats')
      .doc(router.query.id)
      .collection('messages')
      .orderBy('timestamp', 'asc')
  )

  const showMessages = () => {
    if (messagesSnapshot) {
      return messagesSnapshot.docs.map((message) => (
        <Message
          key={message.id}
          user={message.data().user}
          message={{
            ...message.data(),
            timestamp: message.data().timestamp?.toDate().getTime(),
          }}
        />
      ))
    } else {
      return JSON.parse(messages).map((message) => (
        <Message key={message.id} user={message.user} message={Message} />
      ))
    }
  }

  const [recipientSnapshot] = useCollection(
    db
      .collection('users')
      .where('email', '==', getRecipientEmail(chat.users, user))
  )

  const scrollToBottom = () => {
    console.log(endMessagesRef.current)
    endMessagesRef?.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'start',
    })
  }

  const sendMessage = (e) => {
    e.preventDefault()

    // Update the last seen
    db.collection('users').doc(user.id).set(
      {
        lastSeen: firebase.firestore.FieldValue.serverTimestamp(),
      },
      { merge: true }
    )

    db.collection('chats').doc(router.query.id).collection('messages').add({
      timestamp: firebase.firestore.FieldValue.serverTimestamp(),
      message: input,
      user: user.email,
      photoURL: user.photoURL,
    })

    setInput('')
    scrollToBottom()
  }
  if (endMessagesRef) {
    scrollToBottom()
  }
  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(chat.users, user)

  return (
    <>
      <div className='bg-gray-100 h-20 flex items-center sticky top-0 z-10 px-4 shadow-xl'>
        <div className='flex flex-1'>
          <div className='mr-4'>
            {recipient ? (
              <img
                src={recipient?.photoURL}
                className='rounded-full h-10 w-10'
              />
            ) : (
              <div className='bg-gray-100 text-gray-300 font-bold capitalize flex items-center justify-center rounded-full w-10 h-10'>
                <span>{recipientEmail[0]}</span>
              </div>
            )}
          </div>
          <div>
            <div className='text-gray-500 text-base font-bold'>
              {recipientEmail}
            </div>
            <div className='text-gray-400 text-sm'>
              {recipientSnapshot ? (
                <p>
                  Last active:{' '}
                  {recipient?.lastSeen?.toDate() ? (
                    <TimeAgo datetime={recipient?.lastSeen?.toDate()} />
                  ) : (
                    'unavailable'
                  )}
                </p>
              ) : (
                <p>Loading last active...</p>
              )}
            </div>
          </div>
        </div>
        <div className='flex'>
          <div className='text-2xl mr-10 text-gray-400'>
            <FontAwesomeIcon icon={faPaperclip}></FontAwesomeIcon>
          </div>
          <div className='text-2xl text-gray-400'>
            <FontAwesomeIcon icon={faEllipsisV}></FontAwesomeIcon>
          </div>
        </div>
      </div>
      <div className='bg-gray-300' style={{ minHeight: '75vh' }}>
        {showMessages()}
        <div ref={endMessagesRef}></div>
      </div>
      <div className='sticky bottom-0 bg-white'>
        <form className='flex items-center py-4'>
          <div className='text-3xl w-20 flex justify-center items-center text-gray-400'>
            <FontAwesomeIcon icon={faLaugh}></FontAwesomeIcon>
          </div>
          <div className='flex-1'>
            <input
              className='p-2 w-full outline-none rounded-full shadow-2xl text-gray-600 border-0'
              type='text'
              value={input}
              onChange={(e) => setInput(e.target.value)}
            />
          </div>
          <button
            hidden
            disabled={!input}
            type='submit'
            onClick={sendMessage}
          ></button>
          <div className='text-3xl w-20 flex justify-center items-center text-gray-400'>
            <FontAwesomeIcon icon={faMicrophone}></FontAwesomeIcon>
          </div>
        </form>
      </div>
    </>
  )
}

export default ChatScreen
