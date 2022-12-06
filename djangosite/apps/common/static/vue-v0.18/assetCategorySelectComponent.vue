<template>

    <div class="col">
        <button class="input-group-text border-0 py-1" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable" :class="{'modal-lg': viewPath}">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Asset Category Selector</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack">
                        <div id="orgListSwitch" class="col-5 vstack align-top mx-1" style="height:500px;">
                            <asset-category-list-component
                                    ref="assetCategoryListComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :div_list="this.$props.div_list"
                                    :div_name="this.$props.div_name"
                                    :acl="this.$props.acl"
                                    @change-view-path="changeViewPath"
                                    @select-item="selectedAssetCategory"
                                    @dblclick-item="selectSearchModal">
                            </asset-category-list-component>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectSearchModal">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeSearchModal">Cancel</div>
                    </div>
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
    props : ['site','lang','year','month','div_list','div_name','acl','pmode','org_id'],
    components: {
        'asset-category-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategoryListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            assetCategory : {},
            showSearchListModal : false,
            showProgressModal : false,
            viewPath : false,
        }
    },
    methods: {
        // emit of assetCategoryListComponent
        selectedAssetCategory(item){
            this.assetCategory = item;
        },
        // emit function
        changeViewPath(value){
            this.viewPath = value;
        },
        async openSearchModal(event){
            if(event) event.preventDefault();
            if(this.$props.pmode == "budget"){
                this.showProgressModal = true;
                var vm = this;
                var response = {};
                await axios.get('./api/inspectionCheck/'+vm.$props.org_id, null)
                .then(function(res){ response = res.data; })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
                this.showProgressModal = false;
                if(!response.inspection_complete){
                    var msg = "";
                    if(this.$props.lang == 'kr'){
                        msg = "조직내 자산 실사가 완료 되지 않아 해당 예산 품의를 진행할 수 없습니다.";
                    }else{
                        msg = "It is not complete of asset inspection in your organization!";
                    }
                    warningModal.show_modal(msg);
                    return;
                }
            }
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
        },
        async selectSearchModal(){
            if(!this.assetCategory.id){
                warningModal.show_modal("Select a asset category!");
                return;
            }
            if(this.$props.pmode != 'selectall'){
                if(this.assetCategory.rght - this.assetCategory.lft > 1){
                    warningModal.show_modal("Select a child category!");
                    return;
                }
            }
            this.$emit('select-target', this.assetCategory);
            this.showSearchListModal = false;
        },
    }
}
</script>
