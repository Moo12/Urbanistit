import { ref, onUnmounted, watch } from 'vue';
import { projectFireStore } from '../firebase/config';
//import { setError } from '@/state/state';
import { collection, query, where, onSnapshot } from "firebase/firestore";


const getCollection = (collectionName) => {
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // Store the current unsubscribe function

  // Function to set up the Firestore listener with a given query
  const subscribeToCollection = (conditions = []) => {
    // Clean up the old listener
    if (unsub) {
      unsub();
      console.log('Old listener unsubscribed');
    }
    try {
      // Initialize the collection reference
      let collectionRef = collection(projectFireStore, collectionName);

      // Apply query conditions if provided
      if (conditions.length > 0) {
        const queries = conditions.map((condition) =>
          where(condition.field, condition.operator, condition.value)
        );
        collectionRef = query(collectionRef, ...queries);
      }

      // Set up a new listener
      unsub = onSnapshot(
        collectionRef,
        (snapshot) => {
          const results = snapshot.docs
            .map((doc) => ({
              ...doc.data(),
              id: doc.id,
            }))
            .filter((doc) => doc.created_at); // Ensure `createdAt` exists if needed

          documents.value = results;
          error.value = null;
        },
        (err) => {
          console.error(err.message);
          documents.value = null;
          error.value = "Could not fetch the data";
          //setError("Could not fetch the data");
        }
      );
    } catch (err) {
      console.error('catch getCollection');
      console.error(err.message);
      error.value = "Failed to set up Firestore listener";
      //setError("Failed to set up Firestore listener");
    }
  };

  // Clean up listener on component unmount
  onUnmounted(() => {
    if (unsub) {
      unsub();
      console.log('Listener unsubscribed on component unmount');
    }
  });

  return { documents, error, subscribeToCollection };
};

export default getCollection;
