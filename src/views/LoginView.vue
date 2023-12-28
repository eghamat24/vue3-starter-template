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

    <div class="d-flex flex-column align-items-center justify-content-center mt-4">
        <button id="btn-modal" @click="showModalBottomSheet = !showModalBottomSheet">show Modal Bottom Sheet show with Model Value</button>
        <br>
        <button id="btn-modal-bottom-sheet" v-modal-directive.modal-bottom-sheet>show Modal Bottom Sheet with directive (pin)</button>
    </div>

    <VModalBottomSheet
        id="modal-bottom-sheet"
        v-model:show="showModalBottomSheet"
    >
        <template #title>
            title modal bottom sheet
        </template>

        <template #body>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aperiam culpa cum fugiat nemo quae? Aliquid beatae, cupiditate
            facilis hic ipsa labore laudantium molestiae odio perspiciatis placeat, quisquam tempora ut.Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. A aperiam culpa cum fugiat nemo quae? Aliquid beatae, cupiditate
            facilis hic ipsa labore laudantium molestiae odio perspiciatis placeat, quisquam tempora ut.
        </template>

        <template #footer>
            footer modal
        </template>
    </VModalBottomSheet>

    <div class="d-flex flex-column align-items-center justify-content-center mt-4">
        <button @click="showBottomSheet = !showBottomSheet">show Bottom Sheet show with Model Value</button>
    </div>

    <VBottomSheet
        id="bottom-sheet"
        v-model:show="showBottomSheet"
    >
        <template #title>
            title bottom sheet
        </template>

        <template #body>
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A aperiam culpa cum fugiat nemo quae? Aliquid beatae, cupiditate
            facilis hic ipsa labore laudantium molestiae odio perspiciatis placeat, quisquam tempora ut.Lorem ipsum dolor sit amet,
            consectetur adipisicing elit. A aperiam culpa cum fugiat nemo quae? Aliquid beatae, cupiditate
            facilis hic ipsa labore laudantium molestiae odio perspiciatis placeat, quisquam tempora ut.
        </template>

        <template #footer>
            footer modal
        </template>
    </VBottomSheet>
</main>
</template>

<script setup>
// Vue
import { ref } from "vue";

// Components
import VModal from "@/components/VModal.vue";
import VModalBottomSheet from "@/components/VModalBottomSheet.vue";
import VBottomSheet from "@/components/VBottomSheet.vue";

// Directive
import { modal as vModalDirective } from "@/directives/modal.directive";

const showModal = ref(false);
const showModalBottomSheet = ref(false);
const showBottomSheet = ref(false);
</script>
