import { useEffect, useState } from 'react'
import Head from 'next/head'
import { getMessaging, getToken  } from "firebase/messaging";
import { sendNotification } from '@/services/sendNotification';



const NotificationButtonFirebase = () => {
 
  useEffect(() => {
    const messaging = getMessaging();
    getToken(messaging, {vapidKey: "BKy2Rm_Ts8PmYAaHAePkd8ngCIko4o90QkaDzpknv5bSYSXH1iO7o9fVyJ7C1Sl8QwS5aWoS3ddu2mCUZ8m5ZjU"}).then((currentToken) => {
      if (currentToken) {
       sendNotification({token: currentToken})
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
  }, [])
  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      }
    }
      );
    }
 

 

  return (
    <>
     
      <button onClick={()=>{requestPermission()}}>
        Subscribe
      </button>
     
    </>
  )
}

export default NotificationButtonFirebase