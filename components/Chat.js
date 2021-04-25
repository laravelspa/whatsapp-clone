import getRecipientEmail from '../utils/getRecipientEmail'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth, db } from '../firebase'
import { useCollection } from 'react-firebase-hooks/firestore'
import { useRouter } from 'next/router'

function Chat({ id, users }) {
  const router = useRouter()
  const [user] = useAuthState(auth)
  const [recipientSnapshot] = useCollection(
    db.collection('users').where('email', '==', getRecipientEmail(users, user))
  )
  const recipient = recipientSnapshot?.docs?.[0]?.data()
  const recipientEmail = getRecipientEmail(users, user)

  const enterChat = () => {
    router.push(`/chat/${id}`)
  }

  return (
    <div
      className='h-15 flex items-center hover:bg-gray-100 cursor-pointer'
      onClick={enterChat}
    >
      <div className='text-gray-400 text-3xl p-2'>
        {recipient ? (
          <div className='h-10 w-10'>
            <img src={recipient?.photoURL} className='rounded-full' />
          </div>
        ) : (
          <div className='bg-gray-100 text-gray-300 font-bold capitalize flex items-center justify-center rounded-full w-10 h-10'>
            <span>{recipientEmail[0]}</span>
          </div>
        )}
      </div>
      <div className='break-words'>
        <p>{recipientEmail}</p>
      </div>
    </div>
  )
}

export default Chat
