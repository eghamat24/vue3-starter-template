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
    <div class="btn btn-info" @click="()=>selectedDate='2023/11/5'">Set 2023 Nov 5</div>
    <div>{{ selectedDate }}</div>
    <VDatepicker year="2023" month="11" v-model:selected="selectedDate"/>
    <br/>
</main>
</template>
<script setup>
import VDatepicker from "@/components/datepicker/VDatepicker.vue";
import {ref} from "vue";
import Pasoonate from "pasoonate/dist/Pasoonate";

const selectedDate = ref(Pasoonate.make().gregorian().format('yyyy/M/dd'));


</script>
