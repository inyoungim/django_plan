Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'sample-pcb-management-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/samplePCBManagementComponent.vue', vueLoaderOptions) )
    },
    data(){
        return {
        }
    },
    mounted(){

    },
    methods: {

    },
    computed:{

    },
}).mount('#vue3-top-object');

