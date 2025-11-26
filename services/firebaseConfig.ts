import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';
import { getAnalytics, isSupported } from 'firebase/analytics';
import { getMessaging, getToken, onMessage } from 'firebase/messaging';

// Firebase configuration
// IMPORTANTE: Se quiser usar o backend Firebase, substitua estas credenciais
// pelas suas do Console do Firebase: https://console.firebase.google.com/
// Por enquanto, o app funciona 100% com localStorage (modo local)
const firebaseConfig = {
  apiKey: import.meta.env.VITE_FIREBASE_API_KEY || "demo-mode",
  authDomain: import.meta.env.VITE_FIREBASE_AUTH_DOMAIN || "demo-mode.firebaseapp.com",
  projectId: import.meta.env.VITE_FIREBASE_PROJECT_ID || "demo-mode",
  storageBucket: import.meta.env.VITE_FIREBASE_STORAGE_BUCKET || "demo-mode.appspot.com",
  messagingSenderId: import.meta.env.VITE_FIREBASE_MESSAGING_SENDER_ID || "000000000000",
  appId: import.meta.env.VITE_FIREBASE_APP_ID || "1:000000000000:web:demo",
  measurementId: import.meta.env.VITE_FIREBASE_MEASUREMENT_ID || "G-DEMO"
};

// Check if Firebase is configured (real credentials vs demo mode)
export const isFirebaseConfigured = () => {
  return firebaseConfig.apiKey !== "demo-mode" && 
         firebaseConfig.projectId !== "demo-mode" &&
         !firebaseConfig.apiKey.includes("YOUR_");
};

let app: any = null;
let db: any = null;
let auth: any = null;
let storage: any = null;
let analytics: any = null;
let messaging: any = null;

// Initialize Firebase only if real credentials are configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    
    // Initialize Analytics (only in browser)
    if (typeof window !== 'undefined') {
      isSupported().then(yes => {
        if (yes) {
          analytics = getAnalytics(app);
          console.log('📊 Firebase Analytics habilitado');
        }
      });
      
      // Initialize Cloud Messaging (notifications)
      try {
        messaging = getMessaging(app);
        console.log('🔔 Firebase Cloud Messaging habilitado');
      } catch (error) {
        console.log('⚠️ Messaging não disponível (requer HTTPS)');
      }
    }
    
    console.log('✅ Firebase conectado com sucesso!');
  } catch (error) {
    console.warn('⚠️ [Firebase] Erro ao inicializar. Usando modo local (localStorage):', error);
  }
} else {
  console.log('📦 Modo Local ativo: usando localStorage (Firebase não configurado)');
}

// Request notification permission
export const requestNotificationPermission = async () => {
  if (!messaging) return null;
  
  try {
    const permission = await Notification.requestPermission();
    if (permission === 'granted') {
      const token = await getToken(messaging, {
        vapidKey: import.meta.env.VITE_FIREBASE_VAPID_KEY
      });
      console.log('🔑 Token de notificação:', token);
      return token;
    }
  } catch (error) {
    console.error('Erro ao solicitar permissão de notificação:', error);
  }
  return null;
};

// Listen for foreground messages
export const onMessageListener = () =>
  new Promise((resolve) => {
    if (!messaging) return;
    onMessage(messaging, (payload) => {
      resolve(payload);
    });
  });

export { db, auth, storage, analytics, messaging };
export default app;
