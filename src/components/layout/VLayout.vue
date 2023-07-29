<template>
    <slot name="header">
        <VHeader/>
    </slot>

    <main class="row g-0 flex-fill">
        <slot name="side-bar">
            <VSideBar />
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
    import VSideBar from '@/components/layout/VSideBar.vue';

    export default {
        components: {
            VHeader,
            VSideBar,
            VFooter
        }
    }
</script>
