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

            }});
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
    }, []);
    function sendOrderDone(code, number, name){
      sendMail(number, `Your order for ${name} is done! Code: ${code}`, "Menu Master").then(response=>{
       if( response.data.success)
       {
        alert("Message Sent")
       }
      }).catch(e=>{
        console.error(e)
      })
    }
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
                    <td onClick={()=>{sendOrderDone(order.code, order.phoneNumber, order.itemName)}}><Image className={styles.sendDoneButton} width={50} height={75} src={checkMark}></Image></td>
                    <td ><Image className={styles.sendDoneButton} width={50} height={75} src={checkMark}></Image></td>
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
