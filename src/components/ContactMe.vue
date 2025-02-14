<template>
    <div class="flex flex-row-reverse justify-around">

        <div class="flex flex-col items-center justify-center  text-right">
            <h1 class="text-background-site font-bold md:text-6xl lg:text-7xl text-4xl">שניצור יחד</h1>
            <h1 class="text-background-site font-bold md:text-6xl lg:text-7xl text-4xl">משהו מיוחד?</h1>
        </div>
        <div class="h-full flex flex-col justify-center">
            <form action="">
                <div class="form-div">
                    <input 
                        type="text" 
                        v-model="name"
                        class="form-input "
                        placeholder="שם מלא"
                        required
                    />
                </div>
                <!-- Email Input -->
                <div class="form-div">
                    <input 
                        type="email" 
                        v-model="email"
                        class="form-input"
                        placeholder="כתובת מייל"
                        required
                    />
                </div>
                <!-- Message Input -->
                <div class="form-div">
                    <textarea 
                        v-model="message"
                        rows="4"
                        class="w-full form-input"
                        placeholder="על מה נדבר?"
                        required
                    ></textarea>
                </div>
                <!-- Submit Button -->

                <div class="form-div h-auto bg-menu-button rounded-xl justify-self-center">
                    <button 
                            type="submit"
                            class="btn w-full h-full text-4xl font-bold p-3 text-center   text-background-site  transition duration-300"
                            >
                            שלח
                    </button>
                </div>
            </form>
        </div>
        <div v-if="displaySocialMediaIcons" class="btn flex flex-row space-x-2"> <!-- social media icons -->
            <a href="https://facebook.com" target="_blank">
            <i class="btn fab fa-facebook text-black text-4xl m-6 md:text-6xl xl:text-7xl rounded-lg"></i>
            </a>
            <a href="https://instagram.com" target="_blank">
            <i class="btn fab fa-instagram text-black text-4xl m-6 md:text-6xl xl:text-7xl rounded-lg"></i>
            </a>
            <a href="https://youtube.com" target="_blank">
            <i class="btn fab fa-youtube text-black text-4xl md:text-6xl xl:text-7xl bg-white rounded-lg m-6"></i>
            </a>
        </div>
    </div>

</template>
<script>
import { ref, onMounted, watch } from 'vue';

export default {
    props: {
        aligmentDirection: {
            type: String,
            required: false,
            default: 'center', // default alignment
            validator(value) {
                return ['left', 'center', 'right'].includes(value);
            }
        },
    },
    setup(props){
        const displaySocialMediaIcons = ref(false)
        const rowDirectionClassName = ref('')
        
        const columnDirectionClassName = ref('')

        const message = ref('')
        const name = ref('')
        const email = ref('')

             // Set the appropriate alignment classes based on the prop value
        const setAlignmentClasses = () => {
            switch (props.aligmentDirection) {
                case 'left':
                    columnDirectionClassName.value = 'items-start'; // Align items to the start (left)
                    rowDirectionClassName.value = 'justify-start'; // Align content to the start (left)
                    break;
                case 'center':
                    columnDirectionClassName.value = 'items-center'; // Align items to the center
                    rowDirectionClassName.value = 'justify-center'; // Align content to the center
                    break;
                case 'right':
                    columnDirectionClassName.value = 'items-end'; // Align items to the end (right)
                    rowDirectionClassName.value = 'justify-end'; // Align content to the end (right)
                    break;
                default:
                    columnDirectionClassName.value = 'items-center'; // Default to center if something unexpected is passed
                    rowDirectionClassName.value = 'justify-center'; // Default to center if something unexpected is passed
            }
        };

        onMounted(() => {
            console.log('mounted')
            setAlignmentClasses(); // Set alignment on component mount

            console.log('column:', columnDirectionClassName.value)
            console.log('raw:', rowDirectionClassName.value)
        });
    
        watch(() => props.aligmentDirection, setAlignmentClasses); // Update alignment when prop changes

        return { columnDirectionClassName, rowDirectionClassName, displaySocialMediaIcons, name, email, message }
    }



}


</script>

<style>

</style>