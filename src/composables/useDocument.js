import { ref } from 'vue'
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { projectFireStore } from '@/firebase/config';

const useDocument = (collectionName, id) => {
  const error = ref(null);
  const isPending = ref(false);

  const _deleteDoc = async () => {
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

  const _updateDoc = async (updates) => {
    isPending.value = true;
    error.value = null;
    try {
      await updateDoc(doc(projectFireStore, collectionName, id), updates);
      isPending.value = false;
    } catch (err) {
      console.error(err);
      error.value = "Could not update the document";
      isPending.value = false;
    }
  };

  return { error, _deleteDoc, isPending, _updateDoc };
};

export default useDocument;
