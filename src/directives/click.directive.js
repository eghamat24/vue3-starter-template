const clickOutside = {
    created(element, binding) {
        element._clickOutsideEvent = function (event) {
            if (!element.contains(event.target)) {
                binding.value(event);
            }
        };

        document.addEventListener('click', element._clickOutsideEvent);
    },
    unmounted(element) {
        document.removeEventListener('click', element._clickOutsideEvent);
    }
};

export {
    clickOutside
};