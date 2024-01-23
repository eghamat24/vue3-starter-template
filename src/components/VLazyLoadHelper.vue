<template>
    <!-- The class name is given only for better readability in DOM -->
    <component :is="tag" class="js-lazy-load-helper" ref="root"></component>
</template>

<script>
    import { ref } from 'vue';

    // Composables
    import { useLazyLoad } from '@/composables/scroll.composable';

    export default {
        name: 'VLazyLoadHelper',

        props: {
            tag: {
                type: String,
                default: 'div'
            }
        },

        emits: ['reach'],

        setup(props, context) {
            const root = ref(null);

            const { onReach } = useLazyLoad(root);
            onReach(function () {
                context.emit('reach');
            });

            return { root };
        }
    }
</script>
