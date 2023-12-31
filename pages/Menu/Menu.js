import styles from './Menu.module.css';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { getDatabase, ref, onValue, get, child, set, update } from "firebase/database";
import ItemDetails from './ItemDetails/ItemDetails';
import AddBtn from '../../assets/addBtn.png';
import OrderBtn from '../../assets/takeOrder.png';
import { addEmailToCheckout, addItemToCheckout, createCheckout, fetchAllProducts, fetchCheckout } from "@/services/shopifyProvider";
import ToggleButton from "react-toggle-button"
const Menu = () => {
  const { data: session, status } = useSession();
  const [menuItems, setMenuItems] = useState([]);
  const [onMenu, setOnMenu] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [selectedId, setSelectedId] = useState();
  const router = useRouter()

  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});

function getData(){

        createCheckout();

  

      const dbRef = ref(getDatabase());
      get(child(dbRef, `admins`)).then((snapshot) => {
        if (snapshot.exists()) {
          var admins = snapshot.val();
          var isAdmin = false;
          Object.values(admins).forEach(admin=>{
            if(session.user.email === admin.email){
              setIsAdmin(true);
              isAdmin = true;
            }
          });
          get(child(dbRef, `orders`)).then((snapshot) => {
            if (snapshot.exists()) {
              var orders = snapshot.val();
           
              Object.values(orders).forEach((order, i)=>{
              if(order.customerEmail === session.user.email){
                const index = Object.keys(orders)[i];
                sessionStorage.setItem("order",index );
                
                router.push("/Menu/Order/Order")
              return;
              }
              })
            } 
          }).catch((error) => {
            console.error(error);
          });    
          fetchAllProducts().then(items=>{
            setMenuItems(items);
      
          });
    
        } 
      }).catch((error) => {
        console.error(error);
      });
      get(child(dbRef, `storeSettings`)).then((snapshot) => {
        if (snapshot.exists()) {
          var storeSettings = snapshot.val();
          setMenuOpen(storeSettings.open);
        }
        
      });
   
}
useEffect(() => {
getData();
  
}, []);
function goToItemDetails(id){
   addItemToCheckout(id, 1).then(done=>{
    addEmailToCheckout(session.user.email);
    router.push(done.webUrl);
   })

}
function toggleMenu(value){
  const db = getDatabase();

  const updates = {};
  updates['/storeSettings/open'] = value;
  update(ref(db), updates);
  getData();
}
function goToMenu(){
  setOnMenu(true); 

}

    return (
  <>{onMenu &&
  <div className={styles.menuItemsContainer}>
     {
  isAdmin&& <div className={`${styles.menuItem}`} onClick={()=>{router.push('/Menu/Order/Order')}}>
  <Image className={styles.itemImage} src={OrderBtn} width={100} height={150} alt='add an item'/>
  <span className={styles.itemName}>Begin Taking Orders</span>
  </div>
}
{
  isAdmin&& <div className={`${styles.menuItem}`}>
  <div className={styles.placeholder}  alt='add an item'></div>
   
   <span className={`${styles.toggleBtn}`}><ToggleButton
              value={menuOpen || false}
              
              onToggle={(value) => {
                toggleMenu(!value);
              }} />
              </span>
  <span className={styles.itemName}>Accepting Orders</span>
  </div>
}
  {Object.values(menuItems).map((menuItem, id)=>  (
    
<div key={id} className={`${styles.menuItem} ${!menuOpen && styles.disabled}`} onClick={()=>{if(!isAdmin && menuOpen){goToItemDetails(menuItem?.variants[0]?.id)}}}>
<Image className={styles.itemImage} src={menuItem?.images?.length && menuItem.images[0]?.src.split("?")[0]} width={100} height={150} alt='foodimg'/>
<span className={styles.itemName}>{menuItem.title}</span>

<span className={styles.itemPrice}>{menuItem?.variants?.length &&formatter.format(menuItem?.variants[0]?.price.amount)}</span>
</div>
))}



</div>}
{!onMenu &&selectedId &&
<ItemDetails id={selectedId} goToMenu={goToMenu}></ItemDetails>
  }
  </>
 )
    
}

export default Menu
