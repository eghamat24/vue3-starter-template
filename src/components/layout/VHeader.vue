<template>
    <header class="header d-flex justify-content-between align-items-center bg-info px-2">
        <div>
            <slot name="start">
                <img alt="Eghamat24" width="150" height="24" src="@/assets/logo.svg" />
            </slot>
        </div>

        <div class="header-center">
            <slot name="center">
                <span>Eghamat24</span>
            </slot>
        </div>

        <div>
            <slot name="end"></slot>
        </div>
    </header>
</template>

<script>
    export default {
        name: 'VHeader'
    }
</script>

<style lang="scss">
    .header {
        position: relative;
        height: 50px;

        &-center {
            position: absolute;
            top: 50%;
            left: 50%;
            transform: translate(50%, -50%);
        }
    }
</style>