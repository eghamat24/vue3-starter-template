import { createRouter, createWebHistory } from 'vue-router';

// Middlewares
import AuthenticateRoute from './middleware/AuthenticateRoute';
import AuthorizeRoute from './middleware/AuthorizeRoute';
import RedirectIfAuthenticated from './middleware/RedirectIfAuthenticated';

// Views
import PanelView from '@/views/PanelView.vue';

// Utils
import QueryString from '@/utils/query';

const router = createRouter({
    history: createWebHistory(import.meta.env.BASE_URL),
    routes: [
        {
            path: '/',
            name: 'Panel',
            component: PanelView,
            beforeEnter: [AuthenticateRoute],
            children: [
                {
                    path: 'dashboard',
                    name: 'Dashboard',
                    component: () => import('@/views/DashboardView.vue'),
                    beforeEnter: [AuthorizeRoute],
                    meta: {
                        permissions: ['dashboard']
                    }
                },
                {
                    path: 'users',
                    name: 'Users',
                    component: () => import('@/views/UsersView.vue')
                },
                {
                    path: 'todos',
                    name: 'Todos',
                    component: () => import('@/views/TodosView.vue')
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            // route level code-splitting
            // this generates a separate chunk (Login.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/LoginView.vue'),
            beforeEnter: [RedirectIfAuthenticated]
        },
    ],
    parseQuery: (query) => QueryString.parse(query),
    stringifyQuery: (query) => QueryString.stringify(query)
});

export default router;
