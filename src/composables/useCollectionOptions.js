import { ref } from "vue";
import { projectFireStore } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const useCollectionOptions = (collectionName, fieldName, lang = "en") => {
  const options = ref([]);
  const error = ref(null);

  const fetchOptions = async () => {
    try {
      options.value = []; // Reset options
      const collectionRef = collection(projectFireStore, collectionName);
      const snapshot = await getDocs(collectionRef);

      options.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        title: doc.data()?.translations?.[lang]?.[fieldName] || `Unknown (${doc.id})`, // Extract title dynamically
      }));
    } catch (err) {
      console.error("Error fetching options:", err.message);
      error.value = "Failed to load options";
    }
  };

  return { options, error, fetchOptions };
};

export default useCollectionOptions;
