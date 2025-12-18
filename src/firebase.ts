import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider } from "firebase/auth";

/**
 * Configuración de Firebase.
 * 
 * NOTA DE ARQUITECTURA:
 * En un entorno de producción ideal, estos valores deberían inyectarse 
 * a través de variables de entorno (import.meta.env.VITE_FIREBASE_API_KEY, etc.)
 * para mantener la separación entre entornos (dev, staging, prod).
 * 
 * Sin embargo, dado que la configuración de Firebase Client es pública por diseño,
 * incluirlos aquí no representa una vulnerabilidad crítica de seguridad (a diferencia de las Service Accounts).
 */
const firebaseConfig = {
  apiKey: "AIzaSyCLGz1ZhXTeRt__bO940gt6093lMxgeTJM",
  authDomain: "fudmaster-5f448.firebaseapp.com",
  projectId: "fudmaster-5f448",
  storageBucket: "fudmaster-5f448.firebasestorage.app",
  messagingSenderId: "751969009180",
  appId: "1:751969009180:web:cc9d7cc73c93ffde4ce9d9",
  measurementId: "G-08E0KYPV1F"
};

// 1. Inicializar la aplicación de Firebase (Singleton)
const app = initializeApp(firebaseConfig);

// 2. Inicializar el servicio de Autenticación y el Proveedor de Google
// Exportamos las instancias directamente para ser usadas por los servicios o composables.
const auth = getAuth(app);
const provider = new GoogleAuthProvider();

// Configuración adicional del proveedor si fuera necesaria (ej. scopes)
// provider.addScope('profile');
// provider.addScope('email');

export { auth, provider };
