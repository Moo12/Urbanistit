import { ref } from 'vue'
import { doc, updateDoc, deleteDoc, getDoc } from "firebase/firestore";
import { projectFireStore, timestamp } from '@/firebase/config';

const useDocument = (collectionName) => {
  const error = ref(null);
  const isPending = ref(false);

  const _deleteDoc = async (id) => {
    isPending.value = true;
    error.value = null;
    try {
      await deleteDoc(doc(projectFireStore, collectionName, id));
      isPending.value = false;
    } catch (err) {
      console.error(err);
      error.value = "Could not delete the document";
      isPending.value = false;
    }
  };

  const _docExists = async (id) => {
    isPending.value = true;
    error.value = null;

    try {
      const docRef = doc(projectFireStore, collectionName, id);
      const docSnap = await getDoc(docRef);
      isPending.value = false;
      return docSnap.exists(); // Returns true if the document exists, false otherwise
    } catch (err) {
      console.error(err);
      error.value = "Could not check document existence";
      isPending.value = false;
      return false;
    }
  };

  const _updateDoc = async (updates, id) => {
    isPending.value = true;
    error.value = null

    updates.metadata = updates.metadata ?? {}; 
    updates.metadata.last_update = timestamp();

    
    try {
      await updateDoc(doc(projectFireStore, collectionName, id), updates);
      isPending.value = false;
    } catch (err) {
      console.error(err);
      error.value = "Could not update the document";
      isPending.value = false;
    }
  };

  return { error, _deleteDoc, isPending, _updateDoc, _docExists };
};

export default useDocument;
