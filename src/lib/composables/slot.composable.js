import { useSlots } from 'vue';

export function useSlot() {
    const slots = useSlots();
    const hasSlot = (slot) => !!slots[slot];

    return { hasSlot };
}
