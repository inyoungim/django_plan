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
                    <h4 class="col">Budget Account</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack">
                        <div class="col vstack align-top mx-1" style="height:500px;">
                            <account-list-component ref="accountListComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :month="this.$props.month"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                @change-view-path="changeViewPath"
                                @select-item="setAccount"
                                @dblclick-item="selectSearchModal"></account-list-component>
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
    props : ['site','lang','year','month','div_list','div_name','selected_org','acl','pmode'],
    components: {
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            accountItem : {},

            showSearchListModal : false,
            showProgressModal : false,
            viewPath : false,
        }
    },
    methods: {
        // emit of accountListComponent
        setAccount(item){
            this.accountItem = item;
        },
        // emit function
        changeViewPath(value){
            this.viewPath = value;
        },
        openSearchModal(event){
            if(event) event.preventDefault();
            this.searchList = [];
            this.search_string = "";
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
        },
        async selectSearchModal(){
            if(this.$props.pmode == "account"){
                if(this.accountItem.rght - this.accountItem.lft > 1){
                    warningModal.show_modal("Select child account!");
                    return;
                }
            }
            this.$emit('select-target', this.accountItem);
            this.showSearchListModal = false;
        },
    }
}
</script>
