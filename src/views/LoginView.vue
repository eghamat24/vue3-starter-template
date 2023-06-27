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
    <VForm v-model="isValid" >
        <VInput  v-model="userName" :rules="[Validator.minLength(3)]"/>
        <VInput
            v-model="password"
            :rules="[Validator.minLength(4)]"
        />
        <button :disabled="!isValid" >submit</button>
    </VForm>


</main>
</template>
<script setup>
import {ref} from 'vue';
import VInput from "@/components/form/VInput.vue";
import VForm from "@/components/form/VForm.vue";
import Validator from '@/utils/validator.js';

const userName = ref(null);
const password = ref(null);
const isValid = ref(true)






</script>
