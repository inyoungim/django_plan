<template>

    <div class="col">
        <button class="input-group-text border-0 py-1" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Account</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack">
                        <div class="col vstack align-top mx-1" style="min-height:20px;">
                            <budget-list-for-account-component ref="budgetListForAccountComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :month="this.$props.month"
                                :acl="this.$props.acl"
                                :pmode="'addItem'"
                                :selectedOrg="this.$props.selected_org"
                                :div_name="this.$props.div_name"
                                @toggle-orglist="toggleOrgListSwitch"
                                @select-item="accountSelected"
                                @dblclick-item="selectSearchModal"></budget-list-for-account-component>
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
        'budget-list-for-account-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetListForAccountComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            accountItem : {},

            showSearchListModal : false,
            showProgressModal : false,
        }
    },
    methods: {
        // emit of budgetListForAccountComponent
        toggleOrgListSwitch(){
            if(!this.orgListSwitchHide)
                $('#orgListSwitch').hide(100);
            else
                $('#orgListSwitch').show(100);
            this.orgListSwitchHide = !this.orgListSwitchHide;
        },
        // emit of budgetListForAccountComponent
        accountSelected(item, organization, month){
            this.accountItem = item;
            this.accountItem.execution_year = organization.year;
            this.accountItem.execution_month = month;
            this.account_mode = "new";
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
            if(!this.accountItem.id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            if(this.accountItem.rght - this.accountItem.lft > 1){
                warningModal.show_modal("Select child account!");
                return;
            }
            this.$emit('select-target', this.accountItem);
            this.showSearchListModal = false;
        },
    }
}
</script>
