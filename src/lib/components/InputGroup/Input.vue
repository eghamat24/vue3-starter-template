<script>
// Vue
import { computed, h, ref, defineComponent, mergeProps, onMounted } from 'vue';

// Components
import Button from '@/lib/components/Button.vue';
import Icon from '@/lib/components/Icon.vue';
import InputAddon from '@/lib/components/InputGroup/InputAddon.vue';
import InputGroup from '@/lib/components/InputGroup/InputGroup.vue';

export default defineComponent({
    inheritAttrs: false,
    props: {
        inputGroupAttrs: {
            type: Object
        },
        state: {
            type: String,
            default: null,
            validator(value) {
                return (
                    value === 'error' ||
                    value === 'success' ||
                    value === 'warning' ||
                    value === 'information'
                );
            }
        },
        modelValue: {
            type: [String, Number],
            default: ''
        },
        placeholder: {
            type: String,
            default: ''
        },
        compact: {
            type: Boolean,
            default: false
        },
        group: {
            type: Boolean,
            default: false
        },
        clearable: {
            type: Boolean,
            default: false
        },
        autofocus: {
            type: Boolean,
            default: false
        },
        disabled: {
            type: Boolean,
            default: false
        }
    },
    emits: ['blur', 'focus', 'update:modelValue', 'keyup.enter', 'clear'],
    setup(props, { emit, attrs, slots, expose }) {
        const isInputGroup = computed(() => {
            return props.clearable || props.group;
        });

        const classes = computed(() => {
            return {
                'fd-input': true,
                'fd-input--compact': props.compact,
                'fd-input-group__input': props.group || props.clearable,
                ...(props.state == null ? {} : { [`is-${props.state}`]: true })
            };
        });

        const focused = ref(false);

        function handleBlur(event) {
            focused.value = false;
            emit('blur', event);
        }

        function handleFocus(event) {
            focused.value = true;
            emit('focus', event);
        }

        function handleUpdate(event) {
            emit('update:modelValue', event.target.value);
        }

        function handleKeyUp(event) {
            if (event.keyCode === 13){
                handlePressEnter();
            }
            if (event.keyCode === 27){
                clear();
            }
        }

        function handlePressEnter() {
            emit('keyup.enter', true);
        }

        const input = ref(null);

        function clear() {
            emit('update:modelValue', undefined);
            emit('clear');
            input.value.focus();
        }

        function renderInputGroup(child) {
            return h(InputGroup, props.inputGroupAttrs, child);
        }

        function renderInput() {
            return h(
                'input',
                mergeProps(
                    {
                        ref: input,
                        class: classes.value,
                        placeholder: props.placeholder,
                        value: props.modelValue,
                        disabled: props.disabled,
                        autofocus: true,
                        onKeyup: (event) => handleKeyUp(event),
                        onBlur: (event) => handleBlur(event),
                        onFocus: (event) => handleFocus(event),
                        onInput: (event) => handleUpdate(event)
                    },
                    { ...attrs }
                )
            );
        }

        function renderInputAddon(child) {
            return h(InputAddon, {}, () => child);
        }

        function renderClearButton() {
            return h(
                Button,
                {
                    type: 'button',
                    tabIndex: '-1',
                    styling: 'transparent',
                    compact: true,
                    onClick: (event) => {
                        event.stopPropagation();
                        clear();
                    }
                },
                () => renderClearIcon()
            );
        }

        function renderClearIcon() {
            return h(Icon, {
                name: 'decline'
            });
        }

        function renderGroupedInput() {
            return () => renderInputGroup(renderSingleInput());
        }

        function renderSingleInput() {
            return () => [
                renderInput(),
                props.clearable && props.modelValue && renderInputAddon(renderClearButton()),
                !!slots.default && renderInputAddon(slots.default())
            ];
        }

        onMounted(() => {
            expose({ input });
            if (props.autofocus) input.value.focus();
        });

        if (isInputGroup.value) return renderGroupedInput();
        else return renderSingleInput();
    }
});
</script>
