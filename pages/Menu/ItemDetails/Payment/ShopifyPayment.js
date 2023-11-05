import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage  } from "firebase/messaging";
import { RingLoader } from 'react-spinners';
import { useRouter } from 'next/navigation';
import { getDatabase, ref, push, update, get, child } from "firebase/database";
import styles from './Payment.module.css';
import { validatePhoneNumber } from "@/services/phoneNumberValidator";
const currency = "USD";
const style = { "layout": "vertical" };
// const client = Client.buildClient({
//     storefrontAccessToken: "dd4d4dc146542ba7763305d71d1b3d38",
//     domain: "graphql.myshopify.com",
//   });
import { createCheckout, fetchAllProducts, fetchCheckout } from "@/services/shopifyProvider";
export default function ShopifyPayment() {
  
    
    
      useEffect(()=>{
        if (localStorage.checkout) {
          fetchCheckout(localStorage.checkout).then(c=>{
            console.log(c.webUrl)
          });
      
          } else {
            createCheckout();
          }
       console.log("from shopify provider", fetchAllProducts())
        
    },[])
    return (<>
     
    </>
    );

}
