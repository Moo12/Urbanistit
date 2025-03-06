// src/composables/useImageMetadata.js
import { ref, onMounted, watchEffect } from "vue";
import { collection, getDocs, onSnapshot } from "firebase/firestore";
import { projectFireStore } from "@/firebase/config";

const imagesMetadata = ref(null);  // Ensuring it's a shared reference
const isLoaded = ref(false);
const error = ref(null);

// Fetch metadata initially
const fetchImageMetadata = async () => {
  try {
    const querySnapshot = await getDocs(collection(projectFireStore, "images_metadata"));
    imagesMetadata.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    isLoaded.value = true;
  } catch (err) {
    error.value = "Failed to fetch image metadata";
    console.error(err);
  }
};

// Subscribe to real-time updates from Firestore
const subscribeToImageMetadata = () => {
  const unsubscribe = onSnapshot(
    collection(projectFireStore, "images_metadata"),
    (querySnapshot) => {
      imagesMetadata.value = querySnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    },
    (err) => {
      error.value = "Failed to listen to image metadata changes";
      console.error(err);
    }
  );

  // Optionally, return unsubscribe function to stop listening
  return unsubscribe;
};

// Ensure data is fetched and subscribed to when the composable is used
const useImageMetadata = () => {
    onMounted(() => {
    if (!isLoaded.value) {
      fetchImageMetadata();  // Only fetch if not already loaded
    }
    
    const unsubscribe = subscribeToImageMetadata(); // Subscribe to real-time updates

    // Clean up subscription when component is destroyed
    watchEffect(() => {
      return () => unsubscribe();
    });
  });

  return { imagesMetadata, error };
};

export default useImageMetadata;
