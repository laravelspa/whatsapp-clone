import moment from 'moment'
import { useAuthState } from 'react-firebase-hooks/auth'
import { auth } from '../firebase'

function Message({ user, message }) {
  const [userLoggedIn] = useAuthState(auth)
  let classes = 'relative rounded-xl px-3 pt-2 pb-6 bg-green-300'
  const TypedMessage = user === userLoggedIn.email ? true : false
  if (TypedMessage) {
    classes += ' ml-auto text-right'
  } else {
    classes += ' text-left'
  }
  return (
    <div className='p-4'>
      <div
        style={{ width: 'fit-content', minWidth: '100px' }}
        className={classes}
      >
        <p>{message.message}</p>
        <div className='absolute bottom-1 right-1 text-xs text-gray-600'>
          {message.timestamp ? moment(message.timestamp).format('LT') : '...'}
        </div>
      </div>
    </div>
  )
}

export default Message
