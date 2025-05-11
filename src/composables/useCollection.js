import { ref } from 'vue';
import { projectFireStore, timestamp } from '@/firebase/config';
import { doc, collection, setDoc, addDoc } from "firebase/firestore";

const useCollection = (defaultCollectionName = null) => {
  const error = ref(null);
  const collectionName = ref(defaultCollectionName);

  const setCollectionName = (newName) => {
    collectionName.value = newName;
  };

  const validateCollectionName = (customCollectionName) => {
    const finalCollection = customCollectionName || collectionName.value;
    if (!finalCollection) {
      error.value = "Collection name is required";
      return null;
    }
    return finalCollection;
  };

  const addDocImp = async (docData, id = null, customCollectionName = null) => {
    const finalCollection = validateCollectionName(customCollectionName);
    if (!finalCollection) return;

    error.value = null;

    docData.metadata = docData.metadata ?? {}; 
    docData.metadata.created_at = docData.metadata.created_at ?? timestamp();
    docData.metadata.last_update = timestamp();

    console.log("add doc collection", finalCollection)

    try {
      if (id) {
        const docRef = doc(projectFireStore, finalCollection, id);
        await setDoc(docRef, docData);
        return docRef;
      } else {
        const colRef = collection(projectFireStore, finalCollection);
        const docRef = await addDoc(colRef, docData);
        
        return docRef;
      }
    } catch (err) {
      error.value = "Could not add the document";
      throw err;
    }
  };

  return { error, addDocImp, setCollectionName };
};

export default useCollection;
