import { ref } from 'vue';

export default function useSelectorToggle(initialIds = [], _emitName) {
    const toggled = ref({});
    const emitName = _emitName

    // Initialize all IDs as false
    const initializeToggled = (ids) => {
        toggled.value = ids.reduce((acc, id) => {
            acc[id] = false;
            return acc;
        }, {});
    };

    // Call this function when data is available
    if (initialIds.length) {
        initializeToggled(initialIds);
    }

    const handleClick = (id, emit) => {
        let clickedStatusButton = 0;

        if (toggled.value[id]) {
            // If already selected, untoggle it
            toggled.value[id] = false;
        } else {
            // Untoggle all and toggle the clicked one
            Object.keys(toggled.value).forEach(key => {
                toggled.value[key] = false;
            });
            toggled.value[id] = true;
            clickedStatusButton = id;
        }

        emit(emitName, clickedStatusButton);
    };

    return { toggled, initializeToggled, handleClick };
}