<template>
<header>
    <nav>
        <RouterLink :to="{ name: 'Dashboard' }">
            {{ $t('Dashboard') }}
        </RouterLink>
        |
        <RouterLink :to="{ name: 'Login' }">
            {{ $t('Login') }}
        </RouterLink>
    </nav>
</header>

<main>
    <h1>{{ $t('Login') }}</h1>


    <div class="d-flex flex-column align-items-center justify-content-center">
        <button id="btn-modal" @click="showModal = !showModal">show Modal show with Model Value</button>
        <br>
        <button id="btn-modal-2" v-modal-directive.modal-test>show Modal with directive (pin)</button>
    </div>

    <VModal id="modal-test" v-model:show="showModal" pin="#btn-modal-2">
        <template #title>
            title modal
        </template>

        <template #body>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aperiam culpa cum fugiat nemo quae? Aliquid beatae, cupiditate
            facilis hic ipsa labore laudantium molestiae odio perspiciatis placeat, quisquam tempora ut.
        </template>

        <template #footer>
            footer modal
        </template>
    </VModal>
</main>
</template>

<script setup>
// Vue
import { ref } from "vue";

// Components
import VModal from "@/components/VModal.vue";

// Directive
import { modal as vModalDirective } from "@/directives/modal.directive";

const showModal = ref(false);
</script>
