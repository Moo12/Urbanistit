import { ref } from 'vue';

export default function useSelectorToggle(initialIds = [], _emitName) {
    const toggled = ref({});
    const emitName = _emitName
    const currentToggledKey = ref(null)

    // Initialize all IDs as false
    const initializeToggled = (ids) => {
        if (Object.keys(toggled.value).length === 0){
            toggled.value = ids.reduce((acc, id) => {
                acc[id] = false;
                return acc;
            }, {});
        }
    };

    // Call this function when data is available
    if (initialIds.length) {
        initializeToggled(initialIds);
    }

    const handleClick = (id, emit) => {
        let clickedStatusButton = 0;

        console.log("handleClick id", id, toggled.value)

        if (toggled.value[id]) {
            // If already selected, untoggle it
            toggled.value[id] = false;
            currentToggledKey.value = null

            console.log("to false")

        } else {
            // Untoggle all and toggle the clicked one
            Object.keys(toggled.value).forEach(key => {
                toggled.value[key] = false;
            });
            toggled.value[id] = true;
            clickedStatusButton = id;
            currentToggledKey.value = id
            console.log("to true. toggled", toggled.value)
        }

        if (emit){
            emit(emitName, clickedStatusButton);
        }

    };

    return { toggled, currentToggledKey, initializeToggled, handleClick };
}