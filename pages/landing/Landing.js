import styles from './Landing.module.css';
import { useRouter } from 'next/navigation'
import { useEffect } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import googleIcon from '../../assets/googleIcon.png'
import Menu from '../Menu/Menu';
const Landing = () => {
  const router = useRouter()
  const { data: session, status } = useSession()
  if (status === "authenticated") {
    return(
      <Menu></Menu>
  )
    }
    return (
      <>
      <div onClick={()=>{router.push('/api/auth/signin');}} className={styles.loginContainer}>
      <Image className={styles.gSignInImg} src={googleIcon} alt={"Sign In With Google"}width={100}/>
      <span className={styles.loginText}>Sign In With Google</span>
      </div>
      </>
     )
  
    
}

export default Landing
