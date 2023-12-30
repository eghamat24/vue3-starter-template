<template>
    <router-link
        :to="to"
        class="list-group-item list-group-item-action d-flex"
        active-class="text-primary bg-primary bg-opacity-10"
    >
        <div class="me-3">
            <slot name="icon">
                <i class="bi bi-list"></i>
            </slot>
        </div>

        <slot></slot>
    </router-link>
</template>

<script>
    export default {
        name: 'VSideMenuItem',

        props: {
            to: {
                type: [Object, String],
                required: true
            }
        }
    }
</script>
