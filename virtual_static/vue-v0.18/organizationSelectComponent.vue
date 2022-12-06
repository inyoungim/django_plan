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
                    <h4 class="col">Organization Selector</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack">
                        <div id="orgListSwitch" class="col-5 vstack align-top mx-1" style="height:500px;">
                            <organization-list-component ref="organizationListComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :year="this.$props.year"
                                    :div_list="this.$props.div_list"
                                    :div_name="this.$props.div_name"
                                    :acl="this.$props.acl"
                                    :pmode="'plan'"
                                    :myorg="true"
                                    :display_option="'active'"
                                    :preset_orgid="this.$props.preset_orgid"
                                    @change-view-path="changeViewPath"
                                    @select-item="orgSelected"
                                    @select-item-ok="selectSearchModal">
                            </organization-list-component>
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
    props : ['site','lang','year','month','div_list','div_name','preset_orgid','acl','pmode'],
    components: {
        'organization-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            organizationItem : {},

            showSearchListModal : false,
            showProgressModal : false,
            viewPath : false,
        }
    },
    methods: {
        // emit of organizationListComponent
        async orgSelected(item) {
            this.organizationItem = item;
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
            if(!this.organizationItem.id){
                warningModal.show_modal("Select an organization!");
                return;
            }
            this.$emit('select-target', this.organizationItem);
            this.showSearchListModal = false;
        },
    }
}
</script>
