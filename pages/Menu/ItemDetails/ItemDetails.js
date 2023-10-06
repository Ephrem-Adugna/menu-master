import styles from './ItemDetails.module.css';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { getDatabase, ref, onValue, get, child } from "firebase/database";
import Payment from './Payment/Payment';


const ItemDetails = (props) => {
  const { data: session, status } = useSession();
  const [itemDetails, setItemDetails] = useState({});
  const [alertActive, setAlertActive] = useState(false);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const router = useRouter();

function getItemDetails(){

  const dbRef = ref(getDatabase());

  get(child(dbRef, `menu/${props?.id}`)).then((snapshot) => {
    if (snapshot.exists()) {
      var menuItems = snapshot.val();
      setItemDetails(menuItems);
    } 
  }).catch((error) => {
    console.error(error);
  });
}

useEffect(() => {
  if(!props){
    props.goToMenu();
  }
console.log(session)
 
 getItemDetails();
}, [])
if(itemDetails){
    return (
  <>
  { 
  <div className={`${styles.paymentAlert} ${alertActive && styles.visible}`}>
<span className={styles.cancelButton} onClick={()=>{setAlertActive(false);}}>X</span>

<span className={styles.placeOrderTitle}>Place Order</span>
<Payment  cost={itemDetails.itemPrice} itemId={props?.id} email={session.user.email} name={session.user.name}></Payment>

  </div>
}
{alertActive &&
  <div className={styles.alertCover}>
  </div>
}
  <div className={styles.itemContainer}>
<Image className={styles.itemImage} src={itemDetails.itemFile} width={300} height={400} alt='foodimg'/>
<div className={styles.itemDetailsContainer}>
<span className={styles.itemName}>{itemDetails.itemName} - {formatter.format(itemDetails.itemPrice)}</span>
<span className={styles.itemPrice}></span>
<span className={styles.itemDescription}>{itemDetails.itemDescription}</span>
{ itemDetails.available &&<span className={styles.placeOrderBtn} onClick={()=>{setAlertActive(true)}}>Place Order</span>}
{ !itemDetails.available &&<span className={styles.unavailableBtn} >Item Unavailable</span>}
</div>
  </div>

  </>
 )}
 return(
  <>
  Item Not Found
  </>
 )
    
}

export default ItemDetails
