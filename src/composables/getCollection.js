import { ref, onUnmounted, watch } from 'vue';
import { projectFireStore } from '../firebase/config';
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

const getCollection = (collectionName) => {
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // Store the current unsubscribe function

  // Function to set up the Firestore listener (REAL-TIME)
  const subscribeToCollection = (conditions = []) => {
    if (unsub) {
      unsub();
      console.log('Old listener unsubscribed');
    }
    try {
      let collectionRef = collection(projectFireStore, collectionName);

      if (conditions.length > 0) {
        const queries = conditions.map((condition) =>
          where(condition.field, condition.operator, condition.value)
        );
        collectionRef = query(collectionRef, ...queries);
      }

      unsub = onSnapshot(
        collectionRef,
        (snapshot) => {
          const results = snapshot.docs.map((doc) => ({
            ...doc.data(),
            id: doc.id,
          }));

          documents.value = results;
          error.value = null;
        },
        (err) => {
          console.error(err.message);
          documents.value = null;
          error.value = "Could not fetch the data";
        }
      );
    } catch (err) {
      console.error('Error in subscribeToCollection:', err.message);
      error.value = "Failed to set up Firestore listener";
    }
  };

  // Function to fetch documents ONCE (SYNC FETCH)
  const fetchCollectionOnce = async (conditions = []) => {
    try {
      let collectionRef = collection(projectFireStore, collectionName);

      if (conditions.length > 0) {
        const queries = conditions.map((condition) =>
          where(condition.field, condition.operator, condition.value)
        );
        collectionRef = query(collectionRef, ...queries);
      }

      const snapshot = await getDocs(collectionRef);
      documents.value = snapshot.docs.map((doc) => ({
        ...doc.data(),
        id: doc.id,
      }));

      error.value = null;
    } catch (err) {
      console.error('Error fetching collection:', err.message);
      error.value = "Failed to fetch data";
    }
  };

  // Clean up listener on component unmount
  onUnmounted(() => {
    if (unsub) {
      unsub();
      console.log('Listener unsubscribed on component unmount');
    }
  });

  return { documents, error, subscribeToCollection, fetchCollectionOnce };
};

export default getCollection;
