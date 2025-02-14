import { ref } from 'vue';
import { projectFireStore, timestamp } from '@/firebase/config';
import { doc, collection, setDoc, addDoc } from "firebase/firestore";

const useCollection = (collectionName) => {
  const error = ref(null);

  // add a new document
  const addDocImp = async (docData, id = null) => {
    error.value = null;

    docData.created_at = timestamp()
    docData.updated_at = timestamp()

    try {
      if (id) {
        // If an ID is provided, create a doc ref with that ID and use setDoc.
        const docRef = doc(projectFireStore, collectionName, id);
        await setDoc(docRef, docData);
        return docRef;
      } else {
        // If no ID is provided, use the collection reference and addDoc to generate an ID.
        const colRef = collection(projectFireStore, collectionName);
        const docRef = await addDoc(colRef, docData);
        return docRef;
      }
    } catch (err) {
      console.log(err.message);
      error.value = 'Could not send the message';
      throw err;
    }
  };

  return { error, addDocImp };
};

export default useCollection;
