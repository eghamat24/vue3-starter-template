<template>
    <main class="d-flex bg-body-secondary h-100">
        <div class="row g-0 w-100 my-auto">
            <div class="col-10 col-md-8 col-lg-5 col-xl-3 mx-auto">
                <div class="card">
                    <div class="card-body">
                        <div class="h3 mb-4">{{ $t('Login') }}</div>

                        <LoginForm />
                    </div>
                </div>
            </div>
        </div>
    </main>
</template>

<script>
    // Components
    import LoginForm from "@/components/login/LoginForm.vue";

    export default {
        components: {
            LoginForm
        }
    }
</script>
