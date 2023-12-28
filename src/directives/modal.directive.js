// Events
export const EVENT_MODAL_SHOW = 'modal:show';
export const EVENT_MODAL_HIDE = 'modal:hide';
export const EVENT_MODAL_TOGGLE = 'modal:toggle';

function getClosestModal(element, selector) {
    let ancestor = element.parentNode;

    while (ancestor && ancestor.nodeType === Node.ELEMENT_NODE) {
        if (ancestor.matches(selector)) {
            return ancestor;
        }

        ancestor = ancestor.parentNode;
    }

    return null;
}

const modal = {
    mounted(el, binding) {
        let hasHideModifier = false;
        let modifierType = null;
        let modalId = null;

        for (let prop in binding.modifiers) {
            switch (prop) {
                case 'hide':
                    hasHideModifier = true;
                    break;
                case 'show' :
                case 'toggle':
                    modifierType = prop;
                    break;

                default:
                    modalId = prop;
            }
        }

        if (binding.value) {
            modalId = binding.value;
        }

        el._addEventListener = function () {
            let modalEvent = null;

            // check has hide modifier and hide selected id or closest modal
            if (hasHideModifier) {
                if (!modalId) {
                    const closestModal = getClosestModal(el, '.modal');
                    modalId = closestModal.id;
                }

                modalEvent = new CustomEvent(EVENT_MODAL_HIDE + ':' + modalId);
            } else {
                if (modifierType === 'show') {
                    modalEvent = new CustomEvent(EVENT_MODAL_SHOW + ':' + modalId);
                } else {
                    modalEvent = new CustomEvent(EVENT_MODAL_TOGGLE + ':' + modalId);
                }
            }

            document.dispatchEvent(modalEvent);
        }

        el.addEventListener('click', el._addEventListener);
    },

    unmounted(el) {
        el.removeEventListener('click', el._addEventListener);
    }
};

export {
    modal
};
