import { ref, onUnmounted, watch } from 'vue';
import { projectFireStore } from '../firebase/config';
import { collection, query, where, onSnapshot, getDocs } from "firebase/firestore";

const getCollection = (initialCollectionName = null) => {
  const collectionName = ref(initialCollectionName); // Store the collection name
  const documents = ref(null);
  const error = ref(null);
  let unsub = null; // Store the current unsubscribe function

  // Function to set up the Firestore listener (REAL-TIME)
  const subscribeToCollection = (dynamicCollectionName = null, conditions = []) => {
    // Use the dynamically passed collection name or the initial one if not provided
    const finalCollectionName = dynamicCollectionName || collectionName.value;
    if (!finalCollectionName) {
      error.value = "No collection name provided";
      return;
    }

    if (unsub) {
      unsub();
    }

    try {
      let collectionRef = collection(projectFireStore, finalCollectionName);


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

          console.log('snapshot', results)
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
  const fetchCollectionOnce = async (dynamicCollectionName = null, conditions = []) => {
    // Use the dynamically passed collection name or the initial one if not provided
    const finalCollectionName = dynamicCollectionName || collectionName.value;
    if (!finalCollectionName) {
      error.value = "No collection name provided";
      return;
    }

    try {
      let collectionRef = collection(projectFireStore, finalCollectionName);

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
      console.error("collection name" ,finalCollectionName)
      error.value = "Failed to fetch data";
    }
  };

  return { documents, error, subscribeToCollection, fetchCollectionOnce };
};

export default getCollection;
