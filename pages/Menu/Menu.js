import styles from './Menu.module.css';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { getDatabase, ref, onValue, get, child, set } from "firebase/database";
import ItemDetails from './ItemDetails/ItemDetails';
import AddBtn from '../../assets/addBtn.png';
import OrderBtn from '../../assets/takeOrder.png';

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
function getMenu(){
  const dbRef = ref(getDatabase());
  get(child(dbRef, `menu`)).then((snapshot) => {
    if (snapshot.exists()) {
      var menuItems = snapshot.val();
      setMenuItems(menuItems);
    } 
    else{
setMenuItems({});
    }
  }).catch((error) => {
    console.error(error);
  });
}

useEffect(() => {
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
        else{
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
          });        }
      });
      if(!isAdmin){
      getMenu();
      }

    } 
  }).catch((error) => {
    console.error(error);
  });
}, []);
function goToItemDetails(id){
   setOnMenu(false); 
  setSelectedId(id.toString());

}
function goToMenu(){
  setOnMenu(true); 

}

function toggleAvailable(menuItem, id){
  const db = getDatabase();
  set(ref(db, 'menu/' + id), {...menuItem, available: !menuItem.available});
getMenu();
}
function deleteItem(id){
  const db = getDatabase();
  set(ref(db, 'menu/' + id), {});
getMenu();
}
    return (
  <>{onMenu &&
  <div className={styles.menuItemsContainer}>
  {Object.values(menuItems).map((menuItem, id)=>  (
    
<div key={id} className={`${styles.menuItem} ${ !menuItem.available && styles.disabled}`} onClick={()=>{if(!isAdmin){goToItemDetails(Object.keys(menuItems)[id])}}}>
<Image className={styles.itemImage} src={menuItem.itemFile} width={100} height={150} alt='foodimg'/>
<span className={styles.itemName}>{menuItem.itemName}</span>
{isAdmin && <span className={styles.itemMarkUnavailable} onClick={()=>{toggleAvailable(menuItem, Object.keys(menuItems)[id])}}>Mark {menuItem.available && <span>Unavailable</span>}{!menuItem.available && <span>Available</span>}</span>}
{isAdmin && <span className={styles.itemMarkUnavailable} onClick={()=>{goToItemDetails(Object.keys(menuItems)[id])}}>View Details</span>}
{isAdmin && <span className={styles.itemMarkUnavailable} onClick={()=>{deleteItem(Object.keys(menuItems)[id])}}>Delete</span>}
<span className={styles.itemPrice}>{formatter.format(menuItem.itemPrice)}</span>
</div>
))}
{
  isAdmin&& <div className={`${styles.menuItem}`} onClick={()=>{router.push('/Menu/Order/Order')}}>
  <Image className={styles.itemImage} src={OrderBtn} width={100} height={150} alt='add an item'/>
  <span className={styles.itemName}>Begin Taking Orders</span>
  </div>
}
{isAdmin && <div className={`${styles.menuItem}`} onClick={()=>{router.push('/Menu/CreateItem/CreateItem')}}>
<Image className={styles.itemImage} src={AddBtn} width={100} height={150} alt='add an item'/>
<span className={styles.itemName}>Add an Item</span>
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
