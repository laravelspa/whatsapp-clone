import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'

function Loading() {
  return (
    <div className='h-screen text-green-600 flex flex-col justify-center items-center'>
      <div className='text-7xl'>
        <FontAwesomeIcon
          className='animate-bounce'
          icon={faWhatsapp}
        ></FontAwesomeIcon>
      </div>
    </div>
  )
}

export default Loading
