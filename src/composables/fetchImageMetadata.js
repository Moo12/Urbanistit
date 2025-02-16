// src/composables/useImageMetadata.js
import { ref, onMounted } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { projectFireStore } from "@/firebase/config";

const imagesMetadata = ref(null);  // Ensuring it's a shared reference
const isLoaded = ref(false);
const error = ref(null);

const fetchImageMetadata = async () => {
  if (isLoaded.value) return;  // Prevent multiple fetches

  try {
    const querySnapshot = await getDocs(collection(projectFireStore, "images_metadata"));
    imagesMetadata.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    isLoaded.value = true;
  } catch (err) {
    error.value = "Failed to fetch image metadata";
    console.error(err);
  }
};

// Ensure data is fetched when the composable is used
const useImageMetadata = () => {
  if (!isLoaded.value) {
    fetchImageMetadata();  // Only fetch if not already loaded
  }
  
  return { imagesMetadata, error };
};

export default useImageMetadata;
