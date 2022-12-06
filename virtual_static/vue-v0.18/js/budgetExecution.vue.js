axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'budget-execution-document-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionDocumentListComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            div_list : [],
            div_name : "",
        };
    },
    mounted(){
        if(init_div_list.includes(",")){
            var div_list = init_div_list.split(",");
            for(var i=0; i<div_list.length; i++){
                this.div_list.push(div_list[i]);
            }
        }else{
            this.div_list.push(init_div_list);
        }
        this.div_name = this.div_list[0];
    },
    methods: {
    },
    computed:{
    }
})
menuapp.mount('#vue3-top-object')
