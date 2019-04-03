import Vue from 'vue';
import Router from 'vue-router';
import Rsa from '@/components/Rsa';

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Rsa',
      component: Rsa,
    },
  ],
});
