import { createRouter, createWebHistory } from 'vue-router';

import AuthenticateRoute from './middleware/AuthenticateRoute';
import AuthorizeRoute from './middleware/AuthorizeRoute';

import PanelView from '@/views/PanelView.vue';

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
                    path: '',
                    name: 'Dashboard',
                    component: () => import('@/views/DashboardView.vue'),
                    beforeEnter: [AuthorizeRoute],
                    meta: {
                        permissions: ['dashboard']
                    }
                }
            ]
        },
        {
            path: '/login',
            name: 'Login',
            // route level code-splitting
            // this generates a separate chunk (Login.[hash].js) for this route
            // which is lazy-loaded when the route is visited.
            component: () => import('@/views/LoginView.vue')
        },
        {
            path: '/gallery-slider',
            name: 'GallerySlider',
            component: () => import('@/views/GallerySliderView.vue')
        }
    ]
});

export default router;
