import { useEffect } from 'react';
import Client from 'shopify-buy';

// const client = Client.buildClient({
//   storefrontAccessToken: "f221c3b5b694c54040e0fb01f55edcf8",
//   domain: "sbhsmenu.myshopify.com",
// });
const client = Client.buildClient({
  storefrontAccessToken: process.env.NEXT_PUBLIC_SHOPIFY_KEY,
  domain: process.env.NEXT_PUBLIC_SHOPIFY_STORE,
});
 
 
  export const createCheckout = async () => {
    const checkout = await client.checkout.create().then(checkout=>{
        return checkout
    }).catch(e=>{
        console.log(e);
        return '';
    })
    localStorage.setItem("checkout", checkout.id);
  };

 export const fetchCheckout = async (checkoutId) => {
  const checkout =  client.checkout
      .fetch(checkoutId)
      .then((checkout) => {
       return checkout;
      })
      .catch((err) => console.log(err));
      return checkout;
  };

  export const addItemToCheckout = async (variantId, quantity) => {
    const lineItemsToAdd = [
      {
        variantId,
        quantity: parseInt(quantity, 10),
      },
    ];
    const checkout = await client.checkout.addLineItems(
      localStorage.checkout,
      lineItemsToAdd
    );
return checkout;
    this.openCart();
  };

  export const fetchAllProducts = async () => {
    const products = await client.product.fetchAll();
    // this.setState({ products: products });
    return products;
  };

  export const  fetchProductWithId = async (id) => {
    const product = await client.product.fetch(id);
    this.setState({ product: product });
    // console.log(JSON.stringify(product));

    return product;
  };

  export const closeCart = () => {
    this.setState({ isCartOpen: false });
  };
 export const openCart = () => {
    this.setState({ isCartOpen: true });
  };