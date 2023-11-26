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


    <VDropdown position="bottom">
        <template #activator="{on}">
            <div v-on="on">test</div>
        </template>
        <template #default>
            <div>menu1</div>
            <div>menu2</div>
            <div>menu3</div>
            <div>menu4</div>
            <div>menu5</div>
            <div>menu6</div>
            <div>menu7</div>
        </template>
    </VDropdown>


    <!--    <div class="btn btn-info" @click="()=>selectedDate='2023/11/5'">Set 2023 Nov 5</div>-->
    <!--    <div>{{ selectedDate }}</div>-->
    <!--    <VDatepicker :min="new Date(2023,10,18)" year="2023" month="11" @select-date="(date)=> selectedDate = date"/>-->
    <!--    <VDatepicker year="2023" month="11" v-model:selected="selectedDate"/>-->
    <!--    <br/>-->
</main>
</template>
<script setup>
import VDatepicker from "@/components/datepicker/VDatepicker.vue";
import {ref} from "vue";
import Pasoonate from "pasoonate/dist/Pasoonate";
import VDropdown from "@/components/VDropdown.vue";

const selectedDate = ref(Pasoonate.make().gregorian().format('yyyy/M/dd'));


</script>
