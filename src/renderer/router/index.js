import Vue from 'vue';
import Router from 'vue-router';
import store from '../store';
const { defaultView } = store.state.settings;

Vue.use(Router);

export default new Router({
  routes: [
    {
      path: '/',
      redirect: `/${defaultView}`,
    },
    {
      path: '/light/:id',
      name: 'light-page',
      component: require('@/components/LightPage/LightPage').default,
    },
    {
      path: '/light/',
      redirect: '/lights',
    },
    {
      path: '/lights/new',
      name: 'light-add-new',
      component: require('@/components/LightPage/AddNew').default,
    },
    {
      path: '/group/:id',
      name: 'group-page',
      component: require('@/components/GroupPage/GroupPage').default,
    },
    {
      path: '/group/',
      redirect: '/groups',
    },
    {
      path: '/groups/new',
      name: 'room-add-new',
      component: require('@/components/GroupPage/AddNew').default,
    },
    {
      path: '/setup',
      name: 'setup-page',
      component: require('@/components/SetupPage').default,
    },
    {
      path: '/lights',
      name: 'lights-page',
      component: require('@/components/LandingPage').default,
      props: { displayType: 'lights' },
    },
    {
      path: '/groups',
      name: 'groups-page',
      component: require('@/components/LandingPage').default,
      props: { displayType: 'groups' },
    },
    {
      path: '/settings',
      name: 'settings-page',
      component: require('@/components/SettingsPage').default,
    },
  ],
});
