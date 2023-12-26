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

    <div class="p-4">
        <button
            type="submit"
            @click="showCollapse = !showCollapse"
        >
            toggle Collapse
        </button>
    </div>

    <VCollapse v-model="showCollapse">
        <template #activator="{ on }">
            <button
                type="submit"
                v-on="on"
            >
                toggle Collapse
            </button>
        </template>

        <div class="p-4 m-4 border">
            Lorem ipsum dolor sit amet, consectetur adipisicing elit. A architecto assumenda, autem commodi consequatur cupiditate dolor esse fuga iusto labore maxime modi necessitatibus odio praesentium quis repudiandae tempora veritatis voluptas.
        </div>
    </VCollapse>

    <main>
        <h1>{{ $t('Login') }}</h1>
    </main>
</template>
<script setup>
import VCollapse from "@/components/VCollapse.vue";
import { ref } from "vue";

const showCollapse = ref(false);
</script>
