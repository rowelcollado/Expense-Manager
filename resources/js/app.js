require('./bootstrap');

window.Vue = require('vue');

import VueRouter from 'vue-router'
import { Form, HasError, AlertError } from 'vform'
import moment from 'moment'
import VueProgressBar from 'vue-progressbar'
import Swal from 'sweetalert2'
import Gate from './Gate'

// Routes
Vue.use(VueRouter)
let routes = [
    {
        path: '/dashboard',
        component: require('./Pages/Dashboard.vue').default
    },
    {
        path: '/users',
        component: require('./Pages/Users.vue').default
    },
    {
        path: '/profile',
        component: require('./Pages/Profile.vue').default
    },
    {
        path: '/expense',
        component: require('./Pages/Expenses/Expenses.vue').default
    },
    {
        path: '/expenseCategory',
        component: require('./Pages/Expenses/ExpenseCategory.vue').default
    },
    {
        path: '/userExpenses',
        component: require('./Pages/Expenses/UserExpense.vue').default
    },
    {
        path: '/developer',
        component: require('./Pages/Developer.vue').default
    },
    {
        path: '*',
        component: require('./Pages/NotFound.vue').default
    },
]
const router = new VueRouter({
    mode: 'history',
    routes
});
Vue.component('example-component', require('./components/ExampleComponent.vue').default);

// Pagination
Vue.component('paginations', require('laravel-vue-pagination'));

// Passport UI
Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue').default
);
Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue').default
);
Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue').default
);

// VForm
window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

// Vue Filter
Vue.filter('upText', (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1);
})
Vue.filter('myDate', (date) => {
    return moment(date).format('MMMM DD, YYYY h:mm a');
})
Vue.filter('Peso', function(value) {
    const amt = Number(value)
    // return '₱ ' + amt.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
    return 'Php ' + amt.toLocaleString('ko-KR', {minimumFractionDigits: 2, maximumFractionDigits: 2})
});

// Vue Progress Bar
Vue.use(VueProgressBar, {
    color: 'rgb(143, 255, 199)',
    failedColor: 'red',
    height: '4px',
})

// Sweet Alert 2
window.Swal = Swal;
const Toast = Swal.mixin({
    toast: true,
    position: 'top-end',
    showConfirmButton: false,
    timer: 3000,
    // timerProgressBar: true,
    // onOpen: (toast) => {
    //     toast.addEventListener('mouseenter', Swal.stopTimer)
    //     toast.addEventListener('mouseleave', Swal.resumeTimer)
    // }
})
window.Toast = Toast;

// Fire new Vue Instance
window.Fire = new Vue();

// Gate
Vue.prototype.$gate = new Gate(window.user);

const app = new Vue({
    el: '#app',
    router,
    data: {
        search: ''
    }
});
