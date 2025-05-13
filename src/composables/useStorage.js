import { getStorage, ref as storageRef, uploadBytes, getDownloadURL, deleteObject } from "firebase/storage";
import { ref } from "vue";

const useStorage = () => {
    const errors = ref([]); // Track errors per file
    const filesUploadedInfo = ref([]); // Track filesUploadedInfo for uploaded files

    // 🔹 Multi-file upload function
    const uploadImages = async (files, category, subcategory = null) => {
        if (!files || files.length === 0) {
            errors.value.push("No files selected.");
            console.error(errors.value[0])
            return;
        }

        const storage = getStorage(); // Ensure Firebase storage instance
        errors.value = []; // Reset errors
        filesUploadedInfo.value = []; // Reset filesUploadedInfo

        const uploadPromises = Array.from(files).map(async (file) => {
            const path = subcategory && subcategory.trim() !== ""
                ? `images/${category}/${subcategory}/${file.name}`
                : `images/${category}/${file.name}`;

            console.log(`upload to path: ${path}`)

            const fileRef = storageRef(storage, path);

            try {
                await uploadBytes(fileRef, file);
                const fileUrl = await getDownloadURL(fileRef);
                console.log("file url",fileUrl)

                const item = {url: fileUrl, name: file.name, type: file.type}
                filesUploadedInfo.value = [...filesUploadedInfo.value, item];

            } catch (err) {
                console.error(`Error uploading ${file.name}:`, err.message);
                errors.value.push({ file: file.name, message: err.message });
            }
        });

        await Promise.all(uploadPromises); // Wait for all uploads
    };

    // 🔹 Delete an image by path
    const deleteImage = async (path) => {
        const storage = getStorage();
        const fileRef = storageRef(storage, path);

        try {
            await deleteObject(fileRef);
        } catch (err) {
            console.error(`Error deleting file: ${err.message}`);
            errors.value.push(err.message);
        }
    };

    return { filesUploadedInfo, errors, uploadImages, deleteImage };
};

export default useStorage;
