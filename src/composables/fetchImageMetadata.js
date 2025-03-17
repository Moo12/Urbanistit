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
    const getImageUrl = (id) => {
      
      let imgMetadata = imagesMetadata.value.filter(img => img.id === id);
    
      // Check if imgMetadata has any results and return the image_url
      if (imgMetadata.length > 0) {
        console.log("image metadta found ", imgMetadata[0].image_url)
        return imgMetadata[0].image_url;
      } else {
        // Return a default value or handle the case where the image is not found
        console.warn(`Image with id ${id} not found.`);
        return null; // Or any other default value you'd prefer
      }
    }

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

  return { imagesMetadata, error, getImageUrl };
};

export default useImageMetadata;
