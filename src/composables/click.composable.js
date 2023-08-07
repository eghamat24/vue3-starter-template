import { onMounted, toValue } from 'vue';

export function onClickOutside(elementRef, callback) {
    function handler(event) {
        const element = toValue(elementRef);

        if (!element.contains(event.target)) {
            callback(event);
        }
    }

    let isOn = false;

    function on() {
        if (isOn) {
            return;
        }

        document.addEventListener('click', handler);
        isOn = true;
    }

    function off() {
        if (!isOn) {
            return;
        }

        document.removeEventListener('click', handler);
        isOn = false;
    }

    if (toValue(elementRef)) {
        on();
    } else {
        onMounted(() => on());
    }

    return {
        on,
        off
    };
}