Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'borrow-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowListComponent.vue', vueLoaderOptions) ),
        'borrow-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowContentsComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
        }
    },
}).mount('#vue3-top-object');

