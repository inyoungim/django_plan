<template>

    <!-- New Item Modal -->
    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">
                        <span v-if="lang=='kr'">예산 계정 가품의</span><span v-else>Virtual Execution</span>
                    </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:100px;">
                    <div class="col" id="virtual_execution_form">
                        <div class="hstack border-bottom border-primary">
                            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                <b>Execution Item Information</b>
                            </div>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Organization</b>
                            </label>
                            <div class="form-control text-start input-group p-0 rnd-tooltip">
                                <input type="text"
                                       class="form-control text-start border-0"
                                       name="Organization" v-model="accountItem.org_name" readonly required>
                                <input type="hidden" class="form-control text-start border-0 border-end"
                                       name="Organization" v-model="accountItem.au_code" readonly required>
                                <div class="input-group-text border-0 p-0">
                                    <organization-select-component
                                            ref="organizationSelectComponent"
                                            :site="this.$props.site"
                                            :lang="this.$props.lang"
                                            :acl="this.$props.acl"
                                            :div_name="this.$props.div_name"
                                            :year="this.$props.parent_org_item.year-1"
                                            :preset_orgid="this.$props.parent_org_item.id"
                                            @select-target="setOrganization">
                                    </organization-select-component>
                                </div>
                            </div>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Account</b>
                            </label>
                            <div class="form-control text-start input-group p-0 rnd-tooltip">
                                <input type="text" class="form-control text-start border-0"
                                       name="Account" v-model="accountItem.account_name" readonly required>
                                <input type="hidden" class="form-control text-start border-0 border-end"
                                       name="Account" v-model="accountItem.account_code" readonly required>
                                <div class="input-group-text border-0 p-0">
                                    <account-select-component
                                            ref="accountSelectComponent"
                                            :site="this.$props.site"
                                            :lang="this.$props.lang"
                                            :acl="this.$props.acl"
                                            :div_name="this.$props.div_name"
                                            :pmode="'account'"
                                            @select-target="setAccount">
                                    </account-select-component>
                                </div>
                            </div>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Month</b>
                            </label>
                            <div class="form-control text-start input-group p-0 border-0">
                                <lable class="form-control text-start bg-white">{{ this.$props.parent_org_item.year-1 }}</lable>
                                <div class="form-control p-0">
                                    <select v-model="accountItem.execution_month"
                                            class="form-select border-0 bg-white" name="Month" required>
                                        <option v-for="n in (12)" :value="n">{{n}}</option>
                                    </select>
                                </div>
                            </div>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Project Name</b>
                            </label>

                            <div class="form-control text-start input-group p-0">
                                <input type="text" class="form-control text-start border-0"
                                       name="Project Name" v-model="accountItem.project_name" readonly required>
                                <div class="input-group-text border-0 p-0">
                                    <project-select-component
                                            ref="projectSelectComponent"
                                            :site="this.$props.site"
                                            :lang="this.$props.lang"
                                            :div_name="this.$props.div_name"
                                            @select-target="setProject">
                                    </project-select-component>
                                </div>
                            </div>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Project Code</b>
                            </label>
                            <input class="form-control text-start" type="text"
                                   name="Project Code" v-model="accountItem.project_code" readonly required>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Unit Cost</b>
                            </label>
                            <input class="form-control text-start bg-white" type="text"
                                   name="Unit Cost" v-model="accountItem.unit_cost" required >
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Quantity</b>
                            </label>
                            <input class="form-control text-start" type="text"
                                   name="Quantity" v-model="accountItem.unit_count" required >
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Total Cost</b>
                            </label>
                            <input class="form-control text-start bg-white" type="text" disabled required
                                   name="Total Cost" v-model="cal_totalCost">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col">
                        <div class="btn btn-primary mx-1" style="min-width:100px;" @click="submitForm">Save</div>
                        <div class="btn btn-secondary mx-1" style="min-width:100px;" @click="closeModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- New Item Modal -->

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
    props : ['site','lang','acl','div_name','parent_org_item', 'parent_acc_item'],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
        'account-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountSelectComponent.vue', vueLoaderOptions) ),
        'project-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/projectSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            accountItem : {},
            showProgressModal : false,
        }
    },
    mounted(){
    },
    methods: {
        // emit function
        setOrganization(item){
            this.accountItem.org_id = item.id;
            this.accountItem.org_name = item.org_name;
            this.accountItem.au_code = item.au_code;
            this.accountItem.nas_code = item.nas_code;
            this.accountItem.div_name = item.div_name;
            this.accountItem.execution_year = item.year;
        },
        async setAccount(item){
            this.accountItem.account_id = item.id;
            this.accountItem.account_name = item.account_name;
            this.accountItem.account_code = item.account_code;
        },
        setProject(project){
            this.accountItem.project_name = project.project_name;
            this.accountItem.project_code = project.project_code;
        },
        updateResult(){
            this.$emit('update-result');
        },
        closeModal(event){
            if(event) event.preventDefault();
            this.account_mode = "view";
            this.$emit('close-component');
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#virtual_execution_form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
        async submitForm(event){
            if(event) event.preventDefault();
            if(!this.form_validation()) return false;

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/virtualExecution', vm.accountItem )
                    .then(function(res){
                        vm.accountItem = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            this.showProgressModal = false;
            this.closeModal();
            this.$emit('update-result');
        },
    },
    computed:{
        cal_totalCost(){
            if(this.accountItem.unit_count && this.accountItem.unit_cost){
                this.accountItem.total_cost = parseInt(this.accountItem.unit_count * this.accountItem.unit_cost);
                return this.markedCost(this.accountItem.total_cost);
            }
            this.accountItem.total_cost = "";
            return this.markedCost(this.accountItem.total_cost);
        },
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
