import { useEffect, useState } from "react";
import {
    PayPalScriptProvider,
    PayPalButtons,
    usePayPalScriptReducer
} from "@paypal/react-paypal-js";
import { useRouter } from 'next/navigation';
import { getDatabase, ref, push, update, get, child } from "firebase/database";
import styles from './Payment.module.css';
import { validatePhoneNumber } from "@/services/phoneNumberValidator";
// This values are the props in the UI
const currency = "USD";
const style = { "layout": "vertical" };
// Custom component to wrap the PayPalButtons and handle currency changes
const ButtonWrapper = ({ currency, showSpinner, cost, formData, name, email , id }) => {
    // usePayPalScriptReducer can be use only inside children of PayPalScriptProviders
    // This is the main reason to wrap the PayPalButtons in a new component
    const [{ options, isPending }, dispatch] = usePayPalScriptReducer();
    const router = useRouter();
const [phoneNumberDone, setPhoneNumberDone] = useState(false);
const [error, setErorr] = useState(false);
const [phoneNumber, setPhoneNumber] = useState("");
const [phoneNumberTo, setPhoneNumberTo] = useState("");
    function getCurrentTimeIn12HourFormat() {
        const now = new Date();
        let hours = now.getHours();
        const minutes = now.getMinutes();
        const amOrPm = hours >= 12 ? 'PM' : 'AM';
      
        // Convert hours to 12-hour format
        hours = hours % 12 || 12;
      
        // Add leading zeros to minutes if needed
        const formattedMinutes = minutes < 10 ? `0${minutes}` : minutes;
      
        // Create a string in 12-hour format (e.g., "1:30 PM")
        const currentTime = `${hours}:${formattedMinutes} ${amOrPm}`;
      
        return currentTime;
      }
    function createOrder(){
        const db = getDatabase();
      
        const newPostKey = push(child(ref(db), 'orders')).key;
      
        // Write the new post's data simultaneously in the posts list and the user's post list.
        const updates = {};
        var code = Math.floor(1000 + Math.random() * 9000);
        sessionStorage.setItem("order", newPostKey);
        var date = new Date();
        const dbRef = ref(getDatabase());
        get(child(dbRef, `menu/${id}`)).then((snapshot) => {
             if (snapshot.exists()) {
               var item = snapshot.val();
               var itemName = item.itemName;  
               updates['/orders/' + newPostKey] = {itemName: itemName, code: code, item: id, customerEmail: email, customerName: name, timestamp: getCurrentTimeIn12HourFormat(), status: 0, phoneNumber: phoneNumberTo };
               update(ref(db), updates);                 
             } 
           }).catch((error) => {
             console.error(error);
           });
        
      return;
      
      }
      function ValidateUSPhoneNumber(phoneNumber) {
        var phoneno = /^\(?([0-9]{3})\)?[-. ]?([0-9]{3})[-. ]?([0-9]{4})$/;
        if(phoneNumber.match(phoneno)) {
          return true;
        }
        else {
          return false;
        }
      }
      function verifyPhoneNumber(e){
e.preventDefault();
if(!ValidateUSPhoneNumber(phoneNumber)){
setErorr(true);
return;
}

validatePhoneNumber(phoneNumber).then(response=>{
    if(response.data?.success == false || response.data?.valid == false){
        setErorr(true);
        return;
    }
    setErorr(false);
    const carrier = response.data.carrier;
    var mail = "";
    if(carrier.includes("AT&T") ){
    mail = "@mms.att.net";
    }
    else if(carrier.includes("Boost Mobile")){
    mail = "@myboostmobile.com";
    }
    else if(carrier.includes("Cricket")){
    mail = "@mms.cricketwireless.net";
    }
    else if(carrier.includes("Sprint")){
    mail = "@pm.sprint.com";
    }
    else if(carrier.includes("T-Mobile")){
    mail = "@tmomail.net";
    }
    else if(carrier.includes("U.S. Cellular")){
    mail = "@mms.uscc.net";
    }
    else if( carrier.includes("Verizon") ){
    mail = "@vzwpix.com";
    }
    setPhoneNumberTo(phoneNumber + mail);
    setPhoneNumberDone(true);
}).catch(e=>{
    console.error(e)
})
      }
    useEffect(() => {
        dispatch({
            type: "resetOptions",
            value: {
                ...options,
                currency: currency,
            },
        });
    }, [currency, showSpinner]);
    if(!phoneNumberDone)
{
    return(
        <>
        <form onSubmit={verifyPhoneNumber}>
        <label className={styles.phoneNumberTitle}>Enter your Phone Number</label>
        <input value={phoneNumber} onChange={(e)=>{setPhoneNumber(e.nativeEvent.target.value)}} minLength={10} required className={styles.phoneNumberInput}type={"number"} placeholder="Phone Number"/>
        <input type={"submit"} value={"Save"}   className={styles.saveButton}/>
      {error && <span className={styles.phoneNumberError} >Please use a valid phone number</span>}        </form>
        </>
    )
    }
    return (<>
        {(showSpinner && isPending) && <div className="spinner" />}
        <PayPalButtons
            style={style}
            disabled={false}
            forceReRender={[cost, currency, style]}
            fundingSource={"card"}
            createOrder={(data, actions) => {
                return actions.order
                    .create({
                        purchase_units: [
                            {
                                amount: {
                                    currency_code: currency,
                                    value: cost,
                                },
                            },
                        ],
                        application_context: {
                            shipping_preference: "NO_SHIPPING"
                        }
                    })
                    .then((orderId) => {
                        // Your code here after create the order
                        return orderId;
                    });
            }}
            onApprove={function () {
                    // Your code here after capture the order
                    createOrder();
                    router.push("/Menu/Order/Order")
                  
            }}
        />
    </>
    );

}

export default function Payment({ cost, email, itemId, name }) {
    return (
        <div style={{ maxWidth: "750px", minHeight: "200px" }}>
            <PayPalScriptProvider
                options={{
                    "clientId": process.env.NEXT_PUBLIC_PAYPAL_CLIENT_ID,
                    components: "buttons",
                    currency: "USD",
            // shipping_preference:"NO_SHIPPING"

                }}
            >
                <ButtonWrapper
                    currency={currency}
                    showSpinner={true}
                    cost={cost}
                    formData={{}}
                    email={email}
                    id={itemId}
                    name={name}

                />
            </PayPalScriptProvider>
        </div>
    );
}