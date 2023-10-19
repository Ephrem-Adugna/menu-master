importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.1/firebase-messaging.js');

// Initialize the Firebase app in the service worker by passing in
// your app's Firebase config object.
// https://firebase.google.com/docs/web/setup#config-object
firebase.initializeApp({
    apiKey: "AIzaSyB8tDOtxUpEKFHhWmmRTDgnhTXSrmMVO0Q",
    authDomain: "bernardmenu-6a8a5.firebaseapp.com",
    databaseURL: "https://bernardmenu-6a8a5-default-rtdb.firebaseio.com",
    projectId: "bernardmenu-6a8a5",
    storageBucket: "bernardmenu-6a8a5.appspot.com",
    messagingSenderId: "935339817694",
    appId: "1:935339817694:web:2a17161978ca91e3b4a04f"
});

const messaging = firebase.messaging();
    messaging.onBackgroundMessage((payload) => {
        console.log(
          '[firebase-messaging-sw.js] Received background message ',
          payload
        );
        // Customize notification here
        const notificationTitle = payload.notification.body;
        const notificationOptions = {
          body: payload.notification.body,
          icon: '/pwaicon.png'
        };
      
        self.registration.showNotification(notificationTitle, notificationOptions);
      });
      