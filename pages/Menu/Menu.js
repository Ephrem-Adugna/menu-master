import styles from './Menu.module.css';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { getDatabase, ref, onValue, get, child, set } from "firebase/database";
import ItemDetails from './ItemDetails/ItemDetails';
import AddBtn from '../../assets/addBtn.png';
import OrderBtn from '../../assets/takeOrder.png';
import { addItemToCheckout, createCheckout, fetchAllProducts, fetchCheckout } from "@/services/shopifyProvider";

const Menu = () => {
  const { data: session, status } = useSession();
  const [menuItems, setMenuItems] = useState([]);
  const [onMenu, setOnMenu] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const router = useRouter()

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});


useEffect(() => {
  if (localStorage.checkout) {
    fetchCheckout(localStorage.checkout).then(c=>{
      console.log(c.webUrl)
    });

    } else {
      createCheckout();
    }
    fetchAllProducts().then(items=>{
      setMenuItems(items);

    })    
  
}, []);
function goToItemDetails(id){
   addItemToCheckout(id, 1).then(done=>{
    router.push(done.webUrl);
   })

}
function goToMenu(){
  setOnMenu(true); 

}

    return (
  <>{onMenu &&
  <div className={styles.menuItemsContainer}>
  {Object.values(menuItems).map((menuItem, id)=>  (
    
<div key={id} className={`${styles.menuItem}`} onClick={()=>{if(!isAdmin){goToItemDetails(menuItem?.variants[0]?.id)}}}>
<Image className={styles.itemImage} src={menuItem?.images?.length && menuItem.images[0]?.src.split("?")[0]} width={100} height={150} alt='foodimg'/>
<span className={styles.itemName}>{menuItem.title}</span>

<span className={styles.itemPrice}>{menuItem?.variants?.length &&formatter.format(menuItem?.variants[0]?.price.amount)}</span>
</div>
))}
{
  isAdmin&& <div className={`${styles.menuItem}`} onClick={()=>{router.push('/Menu/Order/Order')}}>
  <Image className={styles.itemImage} src={OrderBtn} width={100} height={150} alt='add an item'/>
  <span className={styles.itemName}>Begin Taking Orders</span>
  </div>
}


</div>}
{!onMenu &&selectedId &&
<ItemDetails id={selectedId} goToMenu={goToMenu}></ItemDetails>
  }
  </>
 )
    
}

export default Menu
