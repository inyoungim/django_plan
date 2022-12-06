axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');
const init_year = document.currentScript.getAttribute('init_year');
const init_org_id = document.currentScript.getAttribute('init_org_id');
const init_org_name = document.currentScript.getAttribute('init_org_name');
const init_tab_switch = document.currentScript.getAttribute('init_tab_switch');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'asset-inspection-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetInspectionListComponent.vue', vueLoaderOptions) ),
        'asset-inspection-summary-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetInspectionSummaryComponent.vue', vueLoaderOptions) ),
        'inspection-setting-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetInspectionSettingComponent.vue', vueLoaderOptions) ),
        'inspection-mailing-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/inspectionMailingComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            mode : '',
            div_list : [],
            target_div_name : "",
            target_year : "",
            target_version : "",
            switchData : '',
            orgListSwitch : true,
            assetCategorySwitch : true,
            check_child_org : false,
            maxHeight : 10000,
            selectedOrg : {},
            selectedCategory : {},
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
        this.target_year = parseInt(init_year);
        if(init_tab_switch != '')
            this.switchData = init_tab_switch;
        else
            this.switchData = "table";
    },
    methods: {
        // emit of assetCategoryListComponent
        async assetCategorySelected(item) {
            this.selectedCategory = item;
        },
        // emit of assetInspectionListComponent
        async orgSelected(item) {
            this.selectedOrg = item;
        },
        // emit of assetInspectionListComponent
        changeOrgChildCheck(check){
            this.check_child_org = check;
        },
        // emit of assetInspectionListComponent
        async searchDetailItem(org, item, column, include_org_child) {
            this.switchData = "table";
            if(column == "Total")
                column = "";
            this.$nextTick(() => {
                this.$refs.assetInspectionListComponent.myitem=false;
                this.$refs.assetInspectionListComponent.org_item=item;
                this.$refs.assetInspectionListComponent.search_status=column;
                this.$refs.assetInspectionListComponent.include_org_child=include_org_child;
                this.$refs.assetInspectionListComponent.searchData();
            });
        },

        changeDiv(){
            this.selectedCategory = {};
            this.selectedOrg = {};
            if(this.$refs.assetInspectionListComponent){
                this.$nextTick(() => {
                    this.$refs.assetInspectionListComponent.div_name = this.target_div_name;
                    this.$refs.assetInspectionListComponent.searchData();
                });
            }
            if(this.$refs.assetInspectionSummaryComponent){
                this.$nextTick(() => {
                    this.$refs.assetInspectionSummaryComponent.div_name = this.target_div_name;
                    this.$refs.assetInspectionSummaryComponent.loadData();
                });
            }
            if(this.$refs.inspectionSettingComponent){
                this.$nextTick(() => {
                    this.$refs.inspectionSettingComponent.div_name = this.target_div_name;
                    this.$refs.inspectionSettingComponent.searchData();
                });
            }
            if(this.$refs.inspectionMailingComponent){
                this.$nextTick(() => {
                    this.$refs.inspectionMailingComponent.div_name = this.target_div_name;
                    this.$refs.inspectionMailingComponent.loadData();
                });
            }
        },
        changeYear(year){
            this.target_year = year;
        },
        changeVersion(version){
            this.target_version = version;
        },
        contractHeight(){
            this.maxHeight = 550;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
        },
        changeOrgChildCheck(check){
            this.check_child_org = check;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    }
})
menuapp.mount('#vue3-top-object')
