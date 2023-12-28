// Vue
import { watch, onMounted } from 'vue';

// Utils
import {
    reflow,
    hideScrollBar,
    resetScrollBar,
    executeAfterTransition
} from '@/utils';

// Services
import LanguageService from '@/services/language.service';

// Events
import {
    EVENT_MODAL_SHOW,
    EVENT_MODAL_TOGGLE,
    EVENT_MODAL_HIDE
} from '@/directives/modal.directive';

/**
 * @param {Ref} isShow
 * @param {Ref<HTMLElement>} modal
 * @param {String} id
 * @param {Function} onShow
 * @param {Function} onHide
 * @returns {Object}
 */
export function useModal(isShow, modal, id, onShow = null, onHide = null) {
    const CLASS_NAME_OPEN = 'modal-open';
    const CLASS_NAME_SHOW = 'show';

    function showModal() {
        modal.value.style.display = 'block';
        hideScrollBar();

        document.body.classList.add(CLASS_NAME_OPEN);
        reflow(modal.value);

        modal.value.classList.add(CLASS_NAME_SHOW);
    }

    function hideModal() {
        modal.value.classList.remove(CLASS_NAME_SHOW);
        document.body.classList.remove(CLASS_NAME_OPEN);

        executeAfterTransition(() => {
            modal.value.style.display = null;
            resetScrollBar();
        }, modal.value);
    }

    function show() {
        isShow.value = true;
    }

    function hide() {
        isShow.value = false;
    }

    function toggle() {
        isShow.value = !isShow.value;
    }

    onMounted(() => {
        if (id) {
            document.addEventListener(`${EVENT_MODAL_SHOW}:${id}`, show);
            document.addEventListener(`${EVENT_MODAL_HIDE}:${id}`, hide);

            document.addEventListener(`${EVENT_MODAL_TOGGLE}:${id}`, toggle);
        }

        if (isShow.value) {
            showModal();
        }
    });

    watch(() => isShow.value, (value) => {
        if (value) {

            if (typeof onShow === 'function') {
                onShow();
            } else {
                showModal();
            }

        } else {

            if (typeof onHide === 'function') {
                onHide();
            } else {
                hideModal();
            }

        }
    });

    return {
        showModal,
        hideModal,

        show,
        hide,
        toggle
    };
}

/**
 * @param {Ref<HTMLElement>} dialog
 * @param {String} pin
 * @param {Array} offset
 * @returns {Object}
 */
export function usePinModal(dialog, pin, offset = [0, 16]) {
    const CLASS_NAME_PINNED = 'modal-dialog-pinned';
    const CLASS_NAME_CENTERED = 'modal-dialog-centered';

    const DEFAULT_OFFSET_Y = 16;

    function addPinModal() {
        const pinEl = document.querySelector(pin);
        const pinElRect = pinEl.getBoundingClientRect();

        dialog.value.classList.remove(CLASS_NAME_CENTERED);
        dialog.value.classList.add(CLASS_NAME_PINNED);

        dialog.value.style.top = (pinElRect.bottom + offset[1]) + 'px';

        if (LanguageService.isRtl()) {
            dialog.value.style.right = (screen.width - pinElRect.right + offset[0]) + 'px';
        } else {
            dialog.value.style.left = (pinElRect.left + offset[0]) + 'px';
        }

        const dialogRect = dialog.value.getBoundingClientRect();
        let distanceFromBottom = window.innerHeight - dialogRect.bottom;

        if (distanceFromBottom >= 0) return;

        distanceFromBottom -= DEFAULT_OFFSET_Y;

        dialog.value.style.top = (parseInt(dialog.value.style.top) + distanceFromBottom) + 'px';
        document.documentElement.scrollTop -= distanceFromBottom;
    }

    function removePinModal() {
        dialog.value.classList.remove(CLASS_NAME_PINNED);

        dialog.value.style.top = null;
        dialog.value.style.right = null;
        dialog.value.style.left = null;
    }

    return {
        addPinModal,
        removePinModal
    };
}

/**
 * @returns {Object}
 */
export function useDisplayModal() {
    function showModal(id) {
        const event = new CustomEvent(`${EVENT_MODAL_SHOW}:${id}`);
        document.dispatchEvent(event);
    }

    function hideModal(id) {
        const event = new CustomEvent(`${EVENT_MODAL_HIDE}:${id}`);
        document.dispatchEvent(event);
    }

    function toggleModal(id) {
        const event = new CustomEvent(`${EVENT_MODAL_TOGGLE}:${id}`);
        document.dispatchEvent(event);
    }

    return {
        showModal,
        hideModal,
        toggleModal
    };
}
