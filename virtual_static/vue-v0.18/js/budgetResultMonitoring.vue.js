axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');
const init_year = document.currentScript.getAttribute('init_year');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'budget-result-monitoring-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetResultMonitoringComponent.vue', vueLoaderOptions) ),
        'budget-result-monitoring-mailing-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetResultMonitoringMailingComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            switchData : 'result',
            mode : "",
            div_list : [],
            div_name : "",
            target_year : "",
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
        this.target_year = parseInt(init_year);
    },
    methods: {
        // emit of budgetResultMonitoringComponent user
        changeYear(year){
            this.target_year = year;
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
        },
        changeDiv(){
        },
    },
    computed:{
    }

})
menuapp.mount('#vue3-top-object')
