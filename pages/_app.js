import '@/styles/globals.css'
import { initializeApp } from 'firebase/app';
import { getDatabase } from "firebase/database";
import { Provider, SessionProvider } from 'next-auth/react'
import { useEffect, useState } from 'react';
import Image from 'next/image'
import icon from '../assets/Menu Master.gif';
import iconImg from '../assets/Menu Master.png';

const firebaseConfig = {
  apiKey: "AIzaSyB8tDOtxUpEKFHhWmmRTDgnhTXSrmMVO0Q",
  authDomain: "bernardmenu-6a8a5.firebaseapp.com",
  databaseURL: "https://bernardmenu-6a8a5-default-rtdb.firebaseio.com",
  projectId: "bernardmenu-6a8a5",
  storageBucket: "bernardmenu-6a8a5.appspot.com",
  messagingSenderId: "935339817694",
  appId: "1:935339817694:web:2a17161978ca91e3b4a04f"
};

const app = initializeApp(firebaseConfig);
export default function App({ Component, pageProps }) {
  const [vidDone, setVidDone] = useState(false);
  useEffect(()=>{
 setTimeout(()=>{
setVidDone(true)
 },5000)
  }, [])
  return(
  <div className='container'>
   {!vidDone &&  
<Image className='splashVideo' src={icon}></Image>
   }
   {!vidDone &&
<Image className='splashImg' src={iconImg}></Image>

   }
   {!vidDone &&
   <span className='attribution'>Endorsed By <br></br>Ephrem Adugna</span>
}
      <div style={{visibility: `${!vidDone && 'hidden' || 'visible'}`}}>
   <SessionProvider session={pageProps.session}>
    <Component {...pageProps} />
    </SessionProvider>
    </div>
  </div>
  )
}
