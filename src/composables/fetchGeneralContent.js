import { ref } from "vue";
import { collection, getDocs } from "firebase/firestore";
import { projectFireStore } from "@/firebase/config";

const generalContentMetadata = ref(new Map()); // Stores main collection + relevant subcollections
const isLoaded = ref(false);
const inProgress = ref(false)
const error = ref(null);

const inProgressubCollections = ref({})

/**
 * Fetches subcollections only for documents that exist in subcollectionMap.
 * @param {string} docId - Document ID to check for subcollections.
 * @param {string} subcollectionName - Name of the subcollection.
 * @returns {Promise<Object[]>} - Returns an array of subcollection documents.
 */
const fetchSubcollection = async (docRef, subcollectionName) => {
  try {
    const subSnapshot = await getDocs(collection(projectFireStore, docRef.path, subcollectionName));
    return subSnapshot.docs.map(subDoc => ({
      id: subDoc.id,
      ...subDoc.data(),
    }));
  } catch (err) {
    console.error(`Failed to fetch subcollection '${subcollectionName}' for doc '${docRef}':`, err);
    return []; // Return an empty array on failure
  }
};

/**
 * Fetches the main collection and subcollections based on the provided map.
 * @param {Object} subcollectionMap - An object where keys are document IDs and values are subcollection names.
 */

const fetchGeneralContentMetadata = async (subcollectionMap = {}) => {
  if (isLoaded.value) return; // Prevent multiple fetches

  try {
    const querySnapshot = await getDocs(collection(projectFireStore, "general_content"));

    const fetchedData = new Map(); // Store data as a map

    await Promise.all(
      querySnapshot.docs.map(async (doc) => {
        const docData = { id: doc.id, ...doc.data(), ref: doc.ref };

        // Check if this doc has a subcollection in the provided map
        if (subcollectionMap[doc.id]) {
          // Store subcollection directly under its name
          docData[subcollectionMap[doc.id]] = await fetchSubcollection(doc.ref, subcollectionMap[doc.id]);
        }

        fetchedData.set(doc.id, docData); // Store in the map
      })
    );

    generalContentMetadata.value = fetchedData;
    isLoaded.value = true;
  } catch (err) {
    inProgress.value = false;
    error.value = "Failed to fetch general content metadata";
    console.error(err);
  }
};

const checkForUnfetchedSubCollections = (subcollectionMap = {}) => {
  const unfetchedSubCollections = Object.entries(subcollectionMap).reduce((acc, [docId, subcollectionName]) => {
    if (!generalContentMetadata.value?.find(doc => doc.id === docId && doc[subcollectionName])) {
      acc[docId] = subcollectionName;
    }
    return acc;
  }, {});

  return Object.keys(unfetchedSubCollections).length ? unfetchedSubCollections : null;
};

// Ensure data is fetched when the composable is used
const useGeneralContentMetadata = (subcollectionMap = {}) => {
  
  if (!inProgress.value) 
  {
    inProgress.value = true
    fetchGeneralContentMetadata(subcollectionMap);
  }

  return { generalContentMetadata, error, isLoaded };
};



export default useGeneralContentMetadata;
