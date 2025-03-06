// src/composables/useGeneralContentMetadata.js
import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { projectFireStore } from "@/firebase/config";

const generalContentMetadata = ref(null);  // Ensuring it's a shared reference
const isLoaded = ref(false);
const error = ref(null);

const fetchGeneralContentMetadata = async () => {
  if (isLoaded.value) return;  // Prevent multiple fetches

  try {
    const querySnapshot = await getDocs(collection(projectFireStore, "general_content"));
    generalContentMetadata.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    isLoaded.value = true;
  } catch (err) {
    error.value = "Failed to fetch image metadata";
    console.error(err);
  }
};

// Ensure data is fetched when the composable is used
const useGeneralContentMetadata = () => {
  if (!isLoaded.value) {
    fetchGeneralContentMetadata();  // Only fetch if not already loaded
  }
  
  return { generalContentMetadata, error };
};

export default useGeneralContentMetadata;
