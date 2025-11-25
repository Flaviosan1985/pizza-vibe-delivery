import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getAuth } from 'firebase/auth';
import { getStorage } from 'firebase/storage';

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

// Initialize Firebase only if real credentials are configured
if (isFirebaseConfigured()) {
  try {
    app = initializeApp(firebaseConfig);
    db = getFirestore(app);
    auth = getAuth(app);
    storage = getStorage(app);
    console.log('✅ Firebase conectado com sucesso!');
  } catch (error) {
    console.warn('⚠️ [Firebase] Erro ao inicializar. Usando modo local (localStorage):', error);
  }
} else {
  console.log('📦 Modo Local ativo: usando localStorage (Firebase não configurado)');
}

export { db, auth, storage };
export default app;
