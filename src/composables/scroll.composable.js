import { watch, onBeforeUnmount } from 'vue';

export function useLazyLoad(target) {
    const observer = new IntersectionObserver(function ([entry]) {
        if (entry.intersectionRatio > 0) {
            _triggerCallbacks(entry);
        }
    }, { threshold: [1] });

    function start() {
        observer.observe(target.value);
    }

    function stop() {
        observer.unobserve(target.value);
    }

    const callbacks = [];

    function onReach(callback) {
        callbacks.push(callback);
    }

    function _triggerCallbacks(entry) {
        for (const callback of callbacks) {
            callback(entry);
        }
    }

    watch(target, function (newValue, oldValue) {
        if (newValue !== oldValue && oldValue instanceof Element) {
            observer.unobserve(oldValue);
        }

        if (newValue instanceof Element) {
            start();
        }
    }, { immediate: true });

    onBeforeUnmount(() => stop());

    return {
        start,
        stop,
        onReach
    };
}
