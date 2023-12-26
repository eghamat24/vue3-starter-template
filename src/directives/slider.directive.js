const slider = {
    created(element) {
        element._handleMousedownEvent = function (mousedownEvent) {
            const initialScrollBehavior = element.style.scrollBehavior;
            element.style.scrollBehavior = 'unset';

            let clientX = mousedownEvent.clientX;

            function handleMousemove(mousemoveEvent) {
                element.scrollLeft -= mousemoveEvent.clientX - clientX;
                clientX = mousemoveEvent.clientX;
            }

            element.addEventListener('mousemove', handleMousemove);

            function handleMouseup() {
                element.style.scrollBehavior = initialScrollBehavior;

                document.removeEventListener('mouseup', handleMouseup);
                element.removeEventListener('mousemove', handleMousemove);

                if (clientX !== mousedownEvent.clientX) {
                    function clickHandler(event) {
                        event.stopPropagation();
                        element.removeEventListener('click', clickHandler, true);
                    }

                    element.addEventListener('click', clickHandler, true);
                }
            }

            document.addEventListener('mouseup', handleMouseup);
        };

        element.addEventListener('mousedown', element._handleMousedownEvent);
    },

    unmounted(element) {
        element.removeEventListener('mousedown', element._handleMousedownEvent);
    }
};

export {
    slider
};
