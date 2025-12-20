declare module '../firebaseConfig' {
  import { Firestore } from 'firebase/firestore';
  
  export const db: Firestore;
}

declare module './firebaseConfig' {
  import { Firestore } from 'firebase/firestore';
  
  export const db: Firestore;
}
