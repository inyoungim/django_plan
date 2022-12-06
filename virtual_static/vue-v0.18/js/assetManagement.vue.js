axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const init_div_list = document.currentScript.getAttribute('div_list');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'asset-category-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategoryListComponent.vue', vueLoaderOptions) ),
        'organization-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationListComponent.vue', vueLoaderOptions) ),
        'asset-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemListComponent.vue', vueLoaderOptions) ),
        'execution-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetExecutionDocumentListComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            mode : '',
            div_list : [],
            target_div_name : "",
            switchData : 'execution',
            orgListSwitch : true,
            assetCategorySwitch : true,
            maxHeight : 10000,
            selectedOrg : {},
            selectedCategory : {},
            show_tooltip : false,
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
        // emit of assetCategoryListComponent
        async assetCategorySelected(item) {
            if(item.id) this.selectedCategory = item;
            if(this.$refs.assetItemListComponent){
                if(this.$refs.assetItemListComponent.$props.parent_category_item != this.selectedCategory){
                    this.$refs.assetItemListComponent.$props.parent_category_item = this.selectedCategory;
                    await this.$refs.assetItemListComponent.searchData();
                }
            }
        },
        // emit of organizationListComponent
        async orgSelected(item) {
            if(item.id) this.selectedOrg = item;
            if(this.$refs.assetItemListComponent){
                if(this.$refs.assetItemListComponent.$props.parent_org_item != this.selectedOrg){
                    this.$refs.assetItemListComponent.$props.parent_org_item = this.selectedOrg;
                    await this.$refs.assetItemListComponent.searchData();
                }
            }
        },
        // emit of assetItemSummaryComponent
        toggleConditionSwitch(){
            if(this.switchData == 'category'){
                if(this.assetCategorySwitch)
                    $('#assetCategorySwitch').hide(100);
                else
                    $('#assetCategorySwitch').show(100);
                this.assetCategorySwitch = !this.assetCategorySwitch;
            }else{
                if(this.orgListSwitch)
                    $('#orgListSwitch').hide(100);
                else
                    $('#orgListSwitch').show(100);
                this.orgListSwitch = !this.orgListSwitch;
            }
        },
        changeDiv(){
            this.selectedCategory = {};
            this.selectedOrg = {};
            if(this.$refs.executionItemListComponent){
                this.$refs.executionItemListComponent.div_name = this.target_div_name;
                this.$refs.executionItemListComponent.searchData();
            }
        },
        async clearOrganization(){
            if(this.selectedOrg.id){
                this.selectedOrg = {};
                if(this.$refs.organizationListComponent){
                    this.$refs.organizationListComponent.clearItem();
                }
                if(this.$refs.assetItemListComponent){
                    this.$refs.assetItemListComponent.$props.parent_org_item = this.selectedOrg;
                    await this.$refs.assetItemListComponent.searchData();
                }
            }
        },
        async clearCategory(){
            if(this.selectedCategory.id){
                this.selectedCategory = {};
                if(this.$refs.assetCategoryListComponent){
                    this.$refs.assetCategoryListComponent.clearItem();
                }
                if(this.$refs.assetItemListComponent){
                    this.$refs.assetItemListComponent.$props.parent_category_item = this.selectedCategory;
                    await this.$refs.assetItemListComponent.searchData();
                }
            }
        },
        contractHeight(){
            this.maxHeight = 500;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
            this.targetColumn = "";
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
