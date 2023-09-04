import styles from './CreateItem.module.css';
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react';
import { useSession } from "next-auth/react"
import Image from 'next/image';
import { getDatabase, ref, push, update, get, child } from "firebase/database";
import icon from '../../../assets/icon.png';
import Landing from '@/pages/landing/Landing';


const CreateItem = () => {
  const { data: session, status } = useSession();
  const [newItemData, setNewItemData] = useState({itemName: '', itemPrice: '', itemDescription: '', itemFile: ''});
  const [alertActive, setAlertActive] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const formatter = new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
});
const router = useRouter();

function readFile() {
  

  var file = document.querySelector('#img')['files'][0];
  var reader = new FileReader();
  var baseString;
  reader.onloadend = function () {
      baseString = reader.result;
      setNewItemData({... newItemData, itemFile:baseString });  };
    reader.readAsDataURL(file);
  
}


useEffect(() => {
    const dbRef = ref(getDatabase());
    get(child(dbRef, `admins`)).then((snapshot) => {
      if (snapshot.exists()) {
        var admins = snapshot.val();
        admins.forEach(admin=>{
          if(session.user.email === admin.email){
            setIsAdmin(true);
          }
        })
      } 
    }).catch((error) => {
      console.error(error);
    });

 
}, []);
function createItem(e){
  e.preventDefault();
  const db = getDatabase();

  const newPostKey = push(child(ref(db), 'menu')).key;

  // Write the new post's data simultaneously in the posts list and the user's post list.
  const updates = {};
  updates['/menu/' + newPostKey] = {...newItemData, available: false};
   update(ref(db), updates); 
router.push('/')
return;

}
if (status === "authenticated" && isAdmin) {

    return (
  <>
    <div className={styles.nav} onClick={()=>{window.location.href="/"}}>
<Image src={icon}></Image>
<span className={styles.navTitle}>Menu Master</span>
    </div>
    <div className={styles.container}>
      <form onSubmit={(e)=>{createItem(e)}}>
      <label className={styles.itemLabel}>Item Name</label>
  <input required value={newItemData.itemName} onChange={(e)=>{setNewItemData({... newItemData, itemName: e.target.value})}} placeholder='Item Name' className={styles.inputBox}/>
  <label className={styles.itemLabel}>Item Price</label>

  <input required value={newItemData.itemPrice} onChange={(e)=>{setNewItemData({... newItemData, itemPrice: e.target.value})}} placeholder='Item Price' type={'number'} className={styles.inputBox}/>
  <label className={styles.itemLabel}>Item Description</label>
  
  <input required value={newItemData.itemDescription} onChange={(e)=>{setNewItemData({... newItemData, itemDescription: e.target.value})}} placeholder='Item Description'  className={styles.inputBox}/>
  <label className={styles.itemLabel}>Item Image File (Should be at or near 100px(width) by 150px(height) )</label>

  <input required id='img'  onChange={(e)=>{readFile()}} type={'file'} accept='image/png' className={styles.inputBox}/>
  <button className={styles.itemBtn} type='submit'>Submit</button>
  </form>
  </div>
  </>
 )}
 return(
  <>
  <Landing></Landing>
  </>
 )
    
}

export default CreateItem
