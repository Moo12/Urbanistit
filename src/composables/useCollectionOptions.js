import { ref } from "vue";
import { projectFireStore } from "../firebase/config";
import { collection, getDocs } from "firebase/firestore";

const useCollectionOptions = (collectionName) => {
  const options = ref([]);
  const error = ref(null);

  const fetchOptions = async () => {
    try {
      options.value = []; // Reset options
      const collectionRef = collection(projectFireStore, collectionName);
      const snapshot = await getDocs(collectionRef);

      options.value = snapshot.docs.map((doc) => ({
        id: doc.id,
        data: doc.data(),
      }));
    } catch (err) {
      console.error("Error fetching options:", err.message);
      error.value = "Failed to load options";
    }
  };

  const getSelectedOptionValue = (id) => {
    if (!options.value || options.value.length === 0) {
      return null;
    }
  
    if (Array.isArray(id)) {
      return options.value.filter(option => id.includes(option.id));
    } else {
      return options.value.find(option => option.id === id) || null;
    }
  };

  return { options, error, fetchOptions, getSelectedOptionValue };
};

export default useCollectionOptions;
