import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import icon from '../assets/icon.png';
import Menu from './Menu/Menu';
import Landing from './landing/Landing';
const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  return (
    <>
    <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>
    </div>
     <Landing></Landing>
    </>
  )
}
