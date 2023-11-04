import { useEffect, useState } from "react";
import { getMessaging, getToken, onMessage  } from "firebase/messaging";
import { RingLoader } from 'react-spinners';
import Client from 'shopify-buy';
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
  const client = Client.buildClient({
    storefrontAccessToken: "f221c3b5b694c54040e0fb01f55edcf8",
    domain: "sbhsmenu.myshopify.com",
  });
export default function ShopifyPayment() {
  
    const createCheckout = async () => {
        const checkout = await client.checkout.create().then(checkout=>{
            return checkout
        }).catch(e=>{
            console.log(e);
            return '';
        })
        localStorage.setItem("checkout", checkout.id);
      };
    
      const fetchCheckout = async (checkoutId) => {
      const checkout =  client.checkout
          .fetch(checkoutId)
          .then((checkout) => {
           return checkout;
          })
          .catch((err) => console.log(err));
          return checkout;
      };
    
      const addItemToCheckout = async (variantId, quantity) => {
        const lineItemsToAdd = [
          {
            variantId,
            quantity: parseInt(quantity, 10),
          },
        ];
        const checkout = await client.checkout.addLineItems(
          this.state.checkout.id,
          lineItemsToAdd
        );
        this.setState({ checkout: checkout });
        console.log(checkout);
    
        this.openCart();
      };
    
      const fetchAllProducts = async () => {
        const products = await client.product.fetchAll();
        // this.setState({ products: products });
        console.log(products)
      };
    
      const  fetchProductWithId = async (id) => {
        const product = await client.product.fetch(id);
        this.setState({ product: product });
        // console.log(JSON.stringify(product));
    
        return product;
      };
    
      const closeCart = () => {
        this.setState({ isCartOpen: false });
      };
      const openCart = () => {
        this.setState({ isCartOpen: true });
      };
    
      useEffect(()=>{
        fetchAllProducts();
        if (localStorage.checkout) {
          fetchCheckout(localStorage.checkout).then(c=>{
            console.log(c.webUrl)
          });

          } else {
            createCheckout();
          }
    },[])
    return (<>
     
    </>
    );

}
