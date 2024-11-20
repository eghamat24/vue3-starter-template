<template>
<VForm @submit="submit">
    <div class="mb-3">
        <VInput
            v-model="formData.username"
            placeholder="anything..."
            :rules="[Validator.required()]"
        >
            <template #label>{{ $t('Username') }}</template>
        </VInput>
    </div>

    <div class="mb-3">
        <VInput
            v-model="formData.password"
            type="password"
            placeholder="anything..."
            :rules="[Validator.required()]"
        >
            <template #label>{{ $t('Password') }}</template>
        </VInput>
    </div>

    <div class="mb-3">
        <VSwitch v-model="formData.saveMe"
        >
            <template #label>
                {{ $t('SaveMe') }}
            </template>
        </VSwitch>
    </div>

    <button
        type="submit"
        class="btn btn-primary mt-4"
        :disabled="isLoading"
    >{{ $t('Submit') }}
    </button>
</VForm>
</template>

<script>
import {reactive} from "vue";
import {useRoute, useRouter} from "vue-router";

// Components
import VForm from "@/components/form/VForm.vue";
import VInput from "@/components/form/VInput.vue";

// Composables
import {useLoading} from "@/composables/loading.composable";
import {useToast} from "@/composables/toast.composable";

// Utils
import Validator from "@/utils/validator";

// Services
import AuthenticationService from "@/services/authentication.service";
import {t} from "@/services/language.service";

// Enums
import ThemeColor from "@/enums/ThemeColor";
import HttpStatusCode from "@/enums/HttpStatusCode";
import VSwitch from "@/components/form/radio/VSwitch.vue";

export default {
    name: 'LoginForm',

    components: {
        VSwitch,
        VForm,
        VInput
    },

    setup() {
        const formData = reactive({
            username: '',
            password: '',
            saveMe: false
        });

        const {isLoading, startLoading, endLoading} = useLoading();
        const {showToast} = useToast();

        const route = useRoute();
        const router = useRouter();

        function submit() {
            startLoading();

            AuthenticationService.login(formData).then(function () {
                router.push(route.redirectedFrom || {name: 'Dashboard'});

                showToast({
                    theme: ThemeColor.SUCCESS,
                    body: t('You are successfully logged in')
                });
            }).catch(function (error) {
                const body = error.status === HttpStatusCode.UNAUTHORIZED
                    ? t('Incorrect username or password')
                    : t('System error');

                showToast({
                    theme: ThemeColor.DANGER,
                    body
                });
            }).finally(function () {
                endLoading();
            });
        }

        return {
            Validator,

            isLoading,
            formData,
            submit
        };
    }
}
</script>
