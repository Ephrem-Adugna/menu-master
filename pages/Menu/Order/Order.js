import React, { useEffect, useState } from 'react'
import { getDatabase, ref, onValue, get, child, set, update } from "firebase/database";
import { useSession } from 'next-auth/react';
import Landing from '@/pages/landing/Landing';
import icon from '../../../assets/icon.png';
import styles from './Order.module.css';
import Image from 'next/image';
import checkMark from '../../../assets/checkMark.png';
import { render } from '@react-email/render';
import { sendMail } from '@/services/mailService';
import { useRouter } from 'next/router';
import NotificationButtonFirebase from './NotificationButton/NotificationButtonFirebase';
// import nodemailer from 'nodemailer';
// import { Email } from './Email';
export default function Order() {
    const [orderId, setOrderId] = useState(typeof window !== "undefined" && window.sessionStorage.getItem("order"))
    const { data: session, status } = useSession();
    const [isAdmin, setIsAdmin] = useState(false)
    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState({});
    const [itemNames, setItemNames] = useState([]);
  const router = useRouter()

    function compareTime(a, b) {
      const timeA = new Date(`1970-01-01T${a.timestamp}:00Z`);
      const timeB = new Date(`1970-01-01T${b.timestamp}:00Z`);
  
      if (timeA < timeB) return 1;
      if (timeA > timeB) return -1;
      return 0;
  }
  
  
    function getOrderDetails(){
        const dbRef = ref(getDatabase());

        get(child(dbRef, `orders/${orderId}`)).then((snapshot) => {
            if (snapshot.exists()) {
            var orders = snapshot.val();
           
  
            setOrder(orders);
              
            }});
          setInterval(()=>{
            get(child(dbRef, `orders/${orderId}`)).then((snapshot) => {
                if (snapshot.exists()) {
                var orders = snapshot.val();
               
      
                setOrder(orders);
                  
                }
                else{
router.push('/')
                  
                }
              });
          }, 2000)
    }



    useEffect(()=>{
    const db = getDatabase();

        const dbRef = ref(getDatabase());
  get(child(dbRef, `admins`)).then((snapshot) => {
    if (snapshot.exists()) {
      var admins = snapshot.val();
      Object.values(admins).forEach((admin, i)=>{
        if(session.user.email === admin.email){
          setIsAdmin(true);

  const updates = {};

          updates['/admins/' + Object.keys(admins)[i]] = {email: admin.email, acceptingOrders: true};
          update(ref(db), updates); 
          get(child(dbRef, `orders`)).then((snapshot) => {
            if (snapshot.exists()) {
            var orders = snapshot.val();
            setOrders(orders);

            }});
          setInterval(()=>{
          get(child(dbRef, `orders`)).then((snapshot) => {
            if (snapshot.exists()) {
            var orders = snapshot.val();
            setOrders(orders);

            }
            else{
            setOrders([]);

            }
          });
         },2000)
        
        }
        else{
          var orderIdNow =sessionStorage.getItem("order");
        setOrderId(orderIdNow);

            if(orderIdNow){
                getOrderDetails();
            }

        }
      })
    } 
  }).catch((error) => {
    console.error(error);
  });
    }, [session]);
    function closeOrder(id, order){
    const db = getDatabase();

      const updates = {};
      updates['/orders/' + id] = {};
      update(ref(db), updates); 
      alert("Order Closed")
    }
    function sendOrderDone(code, number, name, regToken, order, id){
      const db = getDatabase();

      const updates = {};
      updates['/orders/' + id] = {...order, status:1};
      update(ref(db), updates); 
      sendMail(number, `Your order for ${name} is done! Code: ${code}`, "Menu Master", regToken).then(response=>{
       if( response.data.success)
       {
        alert("Message Sent")
       }
      }).catch(e=>{
        console.error(e)
      })
    }
  //   function setUpNotifications(){
  //     const messaging = getMessaging();
  //     getToken(messaging, {vapidKey: "BKy2Rm_Ts8PmYAaHAePkd8ngCIko4o90QkaDzpknv5bSYSXH1iO7o9fVyJ7C1Sl8QwS5aWoS3ddu2mCUZ8m5ZjU"}).then((currentToken) => {
  //       if (currentToken) {
  //        setRegToken(currentToken);
  //        createOrder(currentToken);
  //       } else {
  //         // Show permission request UI
  //         console.log('No registration token available. Request permission to generate one.');
  //         // ...
  //       }
  //     }).catch((err) => {
  //       console.log('An error occurred while retrieving token. ', err);
  //       // ...
  //     });
  //     onMessage(messaging, (payload) => {
  //       console.log('Message received. ', payload);
  //     });
      
   
  
  // }
if (status === "authenticated" && isAdmin) {

  return (
    <>
       <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>
    </div>
    <div>
        <span className={styles.ordersTitle}>Orders</span>
        <table className={styles.table}>
            <thead>
            <th>Name</th>
    <th>Order Number</th>
    <th>Timestamp</th>
    <th>Send Done</th>
    <th>Close Order</th>
            </thead>
            <tbody>
              {Object.values(orders).map((order, id)=>  ( 
                 <tr key={id}>
                    <td>{order.itemName}</td>
                    <td>{order.code}</td>
                    <td>{order.timestamp}</td>
                    <td onClick={()=>{sendOrderDone(order.code, order.phoneNumber, order.itemName, order.regToken, order, Object.keys(orders)[id])}}><Image className={styles.sendDoneButton} width={50} height={75} src={checkMark}></Image></td>
                    <td ><Image onClick={()=>{closeOrder(Object.keys(orders)[id], order)}} className={styles.sendDoneButton} width={50} height={75} src={checkMark}></Image></td>
                </tr>
                
                ))}
            </tbody>
        </table>
    </div>
    </>
  )
}
if(status === "authenticated" && orderId){
    return (
        <>
          <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>
    </div>
        <div className={styles.orderContainer}>
        <span className={styles.codeTitle}>Your Code is:</span>
        <span className={styles.code}>{order.code}</span>
        <span className={styles.status}>Order Status: {["Pending", "Ready"][order.status]}</span>
        <NotificationButtonFirebase orderId={orderId}></NotificationButtonFirebase>
        
        </div>
        </>
      )   
}
return(
    <>
     <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>
    </div>

    <div>
        No Page
    </div>
    </>

)
}
