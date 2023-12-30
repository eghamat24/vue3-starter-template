<template>
    <slot name="header">
        <VHeader/>
    </slot>

    <main class="row g-0 flex-fill">
        <slot name="side-bar">
            <VSideMenu />
        </slot>

        <div class="col bg-light p-4">
            <slot>Content</slot>
        </div>
    </main>

    <slot name="footer">
        <VFooter />
    </slot>
</template>

<script>
    // Components
    import VHeader from '@/components/layout/VHeader.vue';
    import VFooter from '@/components/layout/VFooter.vue';
    import VSideMenu from '@/components/layout/side-menu/VSideMenu.vue';

    export default {
        components: {
            VHeader,
            VSideMenu,
            VFooter
        }
    }
</script>
