<template>
    <aside class="col-2 border-end">
        <nav class="list-group list-group-flush py-2">
            <VSideMenuItem :to="{ name: 'Dashboard' }">
                <template #icon>
                    <i class="bi bi-border-all"></i>
                </template>

                {{ $t('Dashboard') }}
            </VSideMenuItem>

            <VSideMenuItem :to="{ name: 'Users' }">
                <template #icon>
                    <i class="bi bi-people"></i>
                </template>

                {{ $t('Users') }}
            </VSideMenuItem>
        </nav>
    </aside>
</template>

<script>
    // Components
    import VSideMenuItem from '@/components/layout/side-menu/VSideMenuItem.vue';

    export default {
        name: 'VSideBar',

        components: {
            VSideMenuItem
        }
    }
</script>
