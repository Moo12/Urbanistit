import { ref, watchEffect } from 'vue'
import { projectFireStore } from '../firebase/config'
import { collection } from "firebase/firestore";

const getDocument = (collectionName, id) => {

  const document = ref(null)
  const error = ref(null)

  // register the firestore Document reference
  let documentRef = collection(projectFireStore, collectionName).doc(id)

  const unsub = onSnapshot(
    documentRef,
    (doc) => {
      if (doc.exists()) {
        document.value = { ...doc.data(), id: doc.id };
        error.value = null;
      } else {
        error.value = "That document doesn't exist.";
      }
    },
    (err) => {
      console.log(err.message);
      error.value = "Could not fetch document.";
    }
  );

  watchEffect((onInvalidate) => {
    onInvalidate(() => unsub());
  });

  return { error, document }
}

export default getDocument