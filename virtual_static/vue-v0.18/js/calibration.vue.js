axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const init_div_list = document.currentScript.getAttribute('div_list');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'calibration-status-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/calibrationStatusComponent.vue', vueLoaderOptions) ),
        'calibration-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/calibrationListComponent.vue', vueLoaderOptions) ),
        'calibration-mailing-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/calibrationMailingComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            switchData : 'calibration',
            div_list : [],
            target_div_name : "",
            target_year : 0,
            target_month : 0,
            maxHeight : 10000,

            selected_item : {},
            selectedColumn : "",
            include_child : false,
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
        this.target_div_name = this.div_list[0];
    },
    methods: {
        // emit function
        selectedCell(item, column, year, month, include_child){
            this.selected_item = item;
            this.selectedColumn = column;
            this.target_year = year;
            this.target_month = month;
            this.include_child = include_child;

            var vm = this;
            if(vm.$refs.calibrationListComponent && this.selected_item.id){
                vm.$refs.calibrationListComponent.selected_item = vm.selected_item;
                vm.$refs.calibrationListComponent.search_type = vm.selectedColumn;
                vm.$refs.calibrationListComponent.year = vm.target_year;
                vm.$refs.calibrationListComponent.month = vm.target_month;
                vm.$refs.calibrationListComponent.include_child = vm.include_child;
                vm.$refs.calibrationListComponent.searchData();
            }
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
        },
        changeDiv(){
            if(this.$refs.calibrationStatusComponent){
                this.$nextTick(() => {
                    this.$refs.calibrationStatusComponent.div_name = this.target_div_name;
                    this.$refs.calibrationStatusComponent.loadData();
                });
            }
            if(this.$refs.calibrationMailingComponent){
                this.$nextTick(() => {
                    this.$refs.calibrationMailingComponent.div_name = this.target_div_name;
                    this.$refs.calibrationMailingComponent.loadData();
                });
            }
        },
        contractHeight(){
            this.maxHeight = 350;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
    },
    computed:{
    }
})
menuapp.mount('#vue3-top-object')
