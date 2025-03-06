import { ref } from 'vue';
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { projectFireStore, timestamp } from '@/firebase/config';

const useDocument = (defaultCollectionName = null) => {
  const error = ref(null);
  const isPending = ref(false);
  const collectionName = ref(defaultCollectionName);

  const setCollectionName = (newName) => {
    collectionName.value = newName;
  };

  const validateCollectionName = (customCollectionName) => {
    const finalCollection = customCollectionName || collectionName.value;
    if (!finalCollection) {
      error.value = "Collection name is required";
      console.error(error.value)
      return null;
    }
    return finalCollection;
  };

  const _deleteDoc = async (id, customCollectionName = null) => {
    isPending.value = true;
    error.value = null;
    
    const finalCollection = validateCollectionName(customCollectionName);
    if (!finalCollection) return;

    try {
      await deleteDoc(doc(projectFireStore, finalCollection, id));
    } catch (err) {
      console.error(err);
      error.value = "Could not delete the document";
    } finally {
      isPending.value = false;
    }
  };

  const _docExists = async (id, customCollectionName = null) => {
    isPending.value = true;
    error.value = null;

    const finalCollection = validateCollectionName(customCollectionName);
    if (!finalCollection) return false;

    try {
      const docRef = doc(projectFireStore, finalCollection, id);
      const docSnap = await getDoc(docRef);
      return docSnap.exists();
    } catch (err) {
      console.error(err);
      error.value = "Could not check document existence";
      return false;
    } finally {
      isPending.value = false;
    }
  };

  const _updateDoc = async (updates, id, customCollectionName = null) => {
    isPending.value = true;
    error.value = null;

    const finalCollection = validateCollectionName(customCollectionName);
    if (!finalCollection) return;

    updates.metadata = updates?.metadata || {};
    updates.metadata.last_update = timestamp();

    console.log("updates ", updates)

    try {
      await updateDoc(doc(projectFireStore, finalCollection, id), updates);
    } catch (err) {
      console.error(err);
      error.value = "Could not update the document";
    } finally {
      isPending.value = false;
    }
  };

  return { error, _deleteDoc, isPending, _updateDoc, _docExists, setCollectionName };
};

export default useDocument;
