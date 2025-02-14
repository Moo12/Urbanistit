import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";

import { ref } from 'vue'


const useStorage = () => {
    const error = ref(null)
    const url = ref(null)
    const filePath = ref(null)

    const uploadImage = async (file, category, subcategory = null) => {
        filePath.value = subcategory &&  subcategory.trim() !== ''
            ? `images/${category}/${subcategory}/${file.name}` 
            : `images/${category}/${file.name}`;

        console.log('file path', filePath.value)

        const storage = getStorage(); // Ensure you get the storage instance
        const fileRef = storageRef(storage, filePath.value); // Correct way to reference a file in Firebase v9+

        try{
            await uploadBytes(fileRef, file);
            url.value = await getDownloadURL(fileRef);
        }catch(err){
            console.log(err.message)
            error.value = err.message
            url.value = null
        }
    }

    const deleteImage = async(path) => {
        const storageRef = projectStorage.ref(path)

        try{
            await storageRef.delete()
        }
        catch(err){
            error.value = err.message
        }
    }

    return {url, error, filePath, uploadImage, deleteImage}
}


export default useStorage