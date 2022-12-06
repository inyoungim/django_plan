<template>

    <!-- New Item Modal -->
    <div v-if="item.id" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
             :class="{ 'modal-lg' : item.item_type == 'Transfer'}">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="item.item_type == 'Transfer'"  class="col">Accounts Summary Information</h4>
                    <h4 v-else class="col">Add New Budget</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeAdjustmentFormModal"></button>
                </div>

                <div class="modal-body" style="min-height:100px;">

                    <div class="row" id="transfer_account_summary_form">
                        <div v-if="item.item_type == 'Transfer'" class="col-lg-6  vstack align-top p-1 px-2">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Transfer From</b>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Organization</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Organization" v-model="item.from_org_name" readonly required>
                                    <input type="hidden" v-model="item.from_org_id">
                                    <input type="hidden" v-model="item.from_au_code">
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Account</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Account" v-model="item.from_account_name" readonly required>
                                    <input type="hidden" v-model="item.from_account_id">
                                    <input type="hidden" v-model="item.from_account_code">
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Month</b>
                                </label>
                                <div class="form-control text-start input-group p-0 border-0">
                                    <input type="hidden" v-model="item.from_account_year">
                                    <input class="form-control text-start" type="text" :class="{'bg-white' :account_mode == 'view'}"
                                       name="Transfer From Month" v-model="item.from_account_month" readonly required>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Name</b>
                                </label>

                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Project Name" v-model="item.from_project_name" readonly required>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Code</b>
                                </label>
                                <input class="form-control text-start" type="text" :class="{'bg-white' :account_mode == 'view'}"
                                       name="Project Code" v-model="item.from_project_code" readonly required>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Remain Cost</b>
                                </label>
                                <input class="form-control text-start" type="text" disabled required
                                       :class="{'bg-white' :account_mode == 'view'}"
                                       name="Remain Cost" v-model="item.from_account_remain">
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Transfer Cost</b>
                                </label>
                                <input class="form-control text-start bg-warning bg-opacity-25" type="text"
                                       disabled required
                                       name="Transfer Cost" v-model="item.from_account_transfer">
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Available Cost</b>
                                </label>
                                <input class="form-control text-start" type="text" disabled required
                                       :class="{'bg-white' :account_mode == 'view'}"
                                       name="Available Cost" v-model="cal_fromAvailableCost">
                            </div>

                        </div>

                        <div class="col-lg-6 vstack align-top p-1 px-2">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b v-if="item.item_type == 'Transfer'">Transfer To</b>
                                    <b v-else>New Budget Information</b>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Organization</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Organization" v-model="item.org_name" readonly required>
                                    <input type="hidden" v-model="item.org_id">
                                    <input type="hidden" v-model="item.au_code">
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Account</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Account" v-model="item.account_name" readonly required>
                                    <input type="hidden" v-model="item.account_id">
                                    <input type="hidden" v-model="item.account_code">
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Month</b>
                                </label>
                                <div class="form-control text-start input-group p-0 border-0">
                                    <input type="hidden" v-model="item.account_year">
                                    <input class="form-control text-start" type="text" :class="{'bg-white' :account_mode == 'view'}"
                                       name="Transfer To Month" v-model="item.account_month" readonly required>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Name</b>
                                </label>

                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Project Name" v-model="item.project_name" readonly required>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Code</b>
                                </label>
                                <input class="form-control text-start" type="text" :class="{'bg-white' :account_mode == 'view'}"
                                       name="Project Code" v-model="item.project_code" readonly required>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Remain Cost</b>
                                </label>
                                <input class="form-control text-start" type="text" disabled required
                                       :class="{'bg-white' :account_mode == 'view'}"
                                       name="Remain Cost" v-model="item.account_remain">
                            </div>

                            <div v-if="item.item_type == 'Transfer'" class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Transfer Cost</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text" required
                                       :disabled="account_mode == 'view'"
                                       name="Transfer Cost" v-model="item.account_transfer">
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Additional Cost</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text" required
                                       :disabled="account_mode == 'view'"
                                       name="Additional Cost" v-model="item.account_add">
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Available Cost</b>
                                </label>
                                <input class="form-control text-start" type="text" disabled required
                                       :class="{'bg-white' :account_mode == 'view'}"
                                       name="Available Cost" v-model="cal_toAvailableCost">
                            </div>

                        </div>
                    </div>

                </div>

                <div class="modal-footer">
                    <div class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeAdjustmentFormModal">Close</div>
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
    props : ['site','lang','acl', 'execution_item_id', 'year','month','preset_orgid'],
    data(){
        return {
            mode : "",
            account_mode : "view",
            item : {},
            editItem : {},
            selectedItem : {},
            showProgressModal : false,
        }
    },
    mounted(){
        this.item = {};
        this.loadAdjustmentItem();
    },
    methods: {
        updateResult(){
            this.$emit('update-result');
        },
        async loadAdjustmentItem(){
            loadingModalEl.show();
            var vm = this;
            vm.edit_item = {};
            await axios.get('./api/adjustmentItem/'+vm.execution_item_id, null)
                .then(function(res){    vm.item = res.data; })
                .catch(function(err){
                    vm.closeAdjustmentFormModal();
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
            this.mode = "view";
        },
        closeAdjustmentFormModal(event){
            if(event) event.preventDefault();
            this.account_mode = "view";
            this.$emit('close-adjust-result-modal');
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
        cal_fromAvailableCost(){
            if(this.item.from_account_remain){
                if(this.item.account_transfer)
                    this.item.from_account_transfer = parseInt(this.item.account_transfer) * -1;
                this.item.from_account_available =
                    parseInt(this.item.from_account_remain) + parseInt(this.item.from_account_transfer);
                return this.markedCost(this.item.from_account_available);
            }
            this.item.from_account_available = "";
            return this.markedCost(this.item.from_account_available);
        },
        cal_toAvailableCost(){
            if(this.item){
                if(this.item.account_add){
                    this.item.account_available =
                    parseInt(this.item.account_remain) + parseInt(this.item.account_add);
                    return this.markedCost(this.item.account_available);
                }else if(this.item.account_transfer){
                    this.item.account_available =
                    parseInt(this.item.account_remain) + parseInt(this.item.account_transfer);
                    return this.markedCost(this.item.account_available);
                }
            }
            this.item.account_available = "";
            return this.markedCost(this.item.account_available);
        },
    },
}
</script>
