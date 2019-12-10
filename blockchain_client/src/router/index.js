import Vue from 'vue'
import Router from 'vue-router'
import Index from '@/components/Index'
import Sign from '@/components/Sign'
import Finance from '@/components/Finance'

Vue.use(Router)

export default new Router({
  routes: [
    {
      path: '/',
      name: 'Index',
      component: Index
    },
    {
      path: '/sign',
      name: 'Sign',
      component: Sign
    },
    {
      path: '/finance',
      name: 'Finance',
      component: Finance
    }
  ],
  mode: 'history'
})
