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
    </main>
</template>
