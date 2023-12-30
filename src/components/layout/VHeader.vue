<template>
    <header class="header d-flex align-items-center bg-primary text-white px-2">
        <button
            type="submit"
            class="btn btn-sm text-white"
        >
            <i class="bi bi-list h4"></i>
        </button>

        <div class="px-2">
            <slot name="start">
                <div class="h5 mb-0">Eghamat24</div>
            </slot>
        </div>

        <div class="ms-auto">
            <slot name="end"></slot>

            <button
                type="submit"
                class="btn btn-sm text-white"
                @click="logout"
            >
                <i class="bi bi-power h4"></i>
            </button>
        </div>
    </header>
</template>

<script>
    import { useRouter } from "vue-router";

    // Services
    import AuthenticationService from "@/services/authentication.service";

    export default {
        name: 'VHeader',

        setup() {
            const router = useRouter();

            function logout() {
                AuthenticationService.logout();
                router.push({ name: 'Login' });
            }

            return {
                logout
            };
        }
    }
</script>
