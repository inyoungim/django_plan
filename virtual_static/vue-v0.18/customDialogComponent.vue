<template>

    <div v-if="this.$props.custom_dialog == 'PCB_ASSEMBLY_ORDER_HISTORY'">
        <div class="hstack border-bottom border-primary">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 pe-2 bg-primary bg-opacity-25">
                <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                <b>PCB Assembly Order History</b>
            </div>
        </div>

        <div class="table-responsive input-group mt-1">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th class="py-1 text-center text-nowrap">PK</th>
                        <th class="py-1 text-center text-nowrap">Organization</th>
                        <th class="py-1 text-center text-nowrap">Account</th>
                        <th class="py-1 text-center text-nowrap">Project Name</th>
                        <th class="py-1 text-center text-nowrap">Project Code</th>
                        <th class="py-1 text-center text-nowrap">Assembly P/N</th>
                        <th class="py-1 text-center text-nowrap">PCB P/N</th>
                        <th class="py-1 text-center text-nowrap">Rev</th>
                        <th class="py-1 text-center text-nowrap">Quantity</th>
                        <th class="py-1 text-center text-nowrap">Cost</th>
                        <th class="py-1 text-center text-nowrap">Date</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="data,i in searchList">
                        <th class="py-1 text-center text-nowrap">{{data.parent}}-{{data.id}}</th>
                        <td class="py-1 text-center text-nowrap">{{data.org_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.account_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.project_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.project_code}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.RELATION_COLUMN.column_data_value}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.PCB_PART_NUMBER.column_data_value}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.PCB_PART_REVISION.column_data_value}}</td>
                        <td class="py-1 text-center text-nowrap">{{data.unit_count}}</td>
                        <td class="py-1 text-center text-nowrap">{{ markedCost(data.total_cost) }}</td>
                        <td class="py-1 text-center text-nowrap">{{data.create_date}}</td>
                    </tr>
                    <tr v-if="searchList.length == 0">
                        <td class="py-1 text-center"  colspan='12'> There is no data. </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-else-if="this.$props.custom_dialog == 'ASSET_SEARCH'">
        <div class="input-group mt-1">
            <label class="input-group-text text-start text-wrap" style="width:160px;">
                <b>Exists Asset Search</b>
            </label>
            <div class="form-control text-end input-group p-0">
                <span class="form-control border-0 text-success">
                    Click "Open" button to open Asset Search modal
                </span>
                <button class="btn btn-sm btn-primary ms-auto" style="width:80px;"
                        @click="openAssetSearchModal">Open</button>
                <div class="input-group-tex">
                    <asset-search-modal-component
                        ref="assetSearchModalComponent"
                        :site="this.$props.site"
                        :lang="this.$props.lang"
                        :acl="this.$props.acl"
                        :div_name="this.$props.div_name">
                    </asset-search-modal-component>
                </div>
            </div>
        </div>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal" class="vue_modal" style="z-index: 9995;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered mx-auto" style="width:200px;">
            <div class="modal-content text-center">
                <div class="progress w-100">
                    <div class="progress-bar bg-success indeterminate3"></div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props : ['site','lang','account_item','pmode','custom_dialog','div_name'],
    components: {
        'asset-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetSearchModalComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            searchList : [],
            search_string :'',
            showProgressModal : false,
        }
    },
    mounted(){
        if(this.$props.account_item){
            if(this.$props.account_item.option){
                for(var i=0; i<this.$props.account_item.option.length; i++){
                    if(this.$props.account_item.option[i].column_data == "PCB_ASSEMBLY"){
                        this.search_string = this.$props.account_item.option[i].column_data_value;
                    }
                }
            }
            this.searchData();
        }
    },
    methods: {
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/customDialogHistory',
                { params:{ 'custom_dialog': vm.$props.custom_dialog , 'search_text': vm.search_string }, })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchList = res.data.searchList;
                    }else{
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        setTarget(data){
            this.$emit('select-target', data);
        },
        openAssetSearchModal(event){
            if(event) event.preventDefault();
            this.$refs.assetSearchModalComponent.openSearchModal();
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    }
}
</script>
