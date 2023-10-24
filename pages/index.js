import Head from 'next/head'
import Image from 'next/image'
import { Inter } from 'next/font/google'
import styles from '@/styles/Home.module.css'
import icon from '../assets/icon.png';
import Menu from './Menu/Menu';
import Landing from './landing/Landing';
import { useEffect, useState } from 'react';
const inter = Inter({ subsets: ['latin'] })
export default function Home() {
  const [downloadInstructions, setDownloadInstructions] = useState(false);
  const [noPWA, setNoPWA] = useState(false);
  useEffect(()=>{
    if(!window.matchMedia('(display-mode: standalone)').matches){
      setTimeout(()=>{setNoPWA(true)}, 6000);
    
      
    }
    
  },[downloadInstructions])
  if(downloadInstructions){
    return(
      <div >
  <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>


    </div>
    <h1>Help Video</h1>
    <video  className='downloadVideo' loop autoplay muted controls id="vid">
         <source type="video/mp4" src={'/howtovide.mp4'}></source>
</video>     </div>
    )
  }
  return (
    <div >
   {noPWA &&  <div onClick={()=>{setDownloadInstructions(true)}} className='noPWANotifier'>See how to download the app to get notifications about your orders!</div>}

    <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>


    </div>
     <Landing></Landing>
     </div>
  )
}
