<template>
<h1 class="mb-5">{{ $t('Dashboard') }}</h1>
<div class="test-div">
    <VForm class="row">
        <div class="col-4">
            <VInput
                v-model="name"
                :rules=[Validator.required()]
            >
                <template #label>
                    نام
                </template>
            </VInput>
        </div>

        <button class="col-1">Submit</button>
    </VForm>
</div>

</template>
<script setup>
import { ref } from "vue";

import VForm from "@/components/form/VForm.vue";
import VInput from "@/components/form/VInput.vue";
import Validator from "@/utils/validator";

const name = ref("");
</script>
