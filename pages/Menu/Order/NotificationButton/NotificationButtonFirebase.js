import { useEffect, useState } from 'react'
import Head from 'next/head'
import { getMessaging, getToken, onMessage  } from "firebase/messaging";
import { sendNotification } from '@/services/sendNotification';
import { getDatabase, ref, onValue, get, child, set, update } from "firebase/database";



const NotificationButtonFirebase = ({orderId}) => {
 useEffect(()=>{
  const db = getDatabase();
  const dbRef = ref(getDatabase());
    const messaging = getMessaging();
    getToken(messaging, {vapidKey: "BKy2Rm_Ts8PmYAaHAePkd8ngCIko4o90QkaDzpknv5bSYSXH1iO7o9fVyJ7C1Sl8QwS5aWoS3ddu2mCUZ8m5ZjU"}).then((currentToken) => {
      if (currentToken) {
        console.log(currentToken)
        get(child(dbRef, `orders/${orderId}`)).then((snapshot) => {
          if (snapshot.exists()) {
          var order = snapshot.val();
          const updates = {};
        updates[`orders/${orderId}`] = {...order, regToken: currentToken};
        update(ref(db), updates); 
                    
          }});
      } else {
        // Show permission request UI
        console.log('No registration token available. Request permission to generate one.');
        // ...
      }
    }).catch((err) => {
      console.log('An error occurred while retrieving token. ', err);
      // ...
    });
    onMessage(messaging, (payload) => {
      console.log('Message received. ', payload);
    });
    
 },[])
  function requestPermission() {
    console.log('Requesting permission...');
    Notification.requestPermission().then((permission) => {
      if (permission === 'granted') {
        console.log('Notification permission granted.');
      
      }
    }
      );
    }
   return(
    <button onClick={()=>{requestPermission()}} style={{fontFamily: 40}}>Allow Notifications</button>
   )

 

 
}

export default NotificationButtonFirebase