import { ref, watchEffect } from 'vue';
import { doc, onSnapshot } from 'firebase/firestore';
import { projectFireStore } from '../firebase/config';

const getDocument = (collectionName, id) => {
  const document = ref(null);
  const error = ref(null);

  // Create a reference to the document
  const documentRef = doc(projectFireStore, collectionName, id);

  const unsub = onSnapshot(
    documentRef,
    (docSnap) => {
      if (docSnap.exists()) {
        document.value = { ...docSnap.data(), id: docSnap.id };
        error.value = null;
      } else {
        error.value = "That document doesn't exist.";
      }
    },
    (err) => {
      console.error(err.message);
      error.value = "Could not fetch document.";
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document };
};

export default getDocument;
