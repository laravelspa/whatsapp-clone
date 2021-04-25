import Head from 'next/head'
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faWhatsapp } from '@fortawesome/free-brands-svg-icons'
import { faGoogle } from '@fortawesome/free-brands-svg-icons'
import { auth, provider } from '../firebase'

function Login() {
  const signIn = () => {
    auth.signInWithPopup(provider).catch(alert)
  }
  return (
    <div>
      <Head>
        <title>Login</title>
      </Head>
      <div className='bg-gray-300 mx-auto h-screen flex flex-col justify-center items-center p-4'>
        <div className='bg-gray-100 flex flex-col justify-center items-center p-20 shadow-2xl rounded-xl'>
          <div className='text-green-600 text-9xl'>
            <FontAwesomeIcon icon={faWhatsapp}></FontAwesomeIcon>
          </div>
          <div>
            <button
              onClick={signIn}
              type='button'
              className='capitalize mt-20 px-4 py-2 text-green-100 font-bold bg-green-500 hover:bg-green-600 rounded-lg shadow-xl outline-white ease-in-out duration-500'
            >
              <FontAwesomeIcon icon={faGoogle}></FontAwesomeIcon> sign in with
              google
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default Login
