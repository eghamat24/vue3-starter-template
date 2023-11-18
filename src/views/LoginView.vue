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
    <VDatepicker month="11" year="2023" @select-date="(date)=> selectedDate = date"/>
    <br/>
    <div>
        selected Date: {{ selectedDate }}

    </div>
</main>
</template>
<script setup>
import VDatepicker from "@/components/datepicker/VDatepicker.vue";
import {ref} from "vue";
const selectedDate = ref('');


</script>
