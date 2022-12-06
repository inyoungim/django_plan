<template>

    <div v-if="pmode == 'mgmt'">
        <div class="hstack border-bottom border-primary">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-danger bg-opacity-25">
                <i class="bi bi-grid-3x3-gap-fill text-danger px-2"></i>
                <b>Account Plan Option Column</b>
            </div>
        </div>
        <div class="table-responsive m-0 p-0">
            <table class="table table-hover table-bordered m-0">
                <thead style="background-color:#FFEEDD;">
                    <tr>
                        <th class="py-1 text-center" width="50px">No</th>
                        <th v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="py-1 text-center" width="50px">
                            <i class="bi bi-arrow-up"></i>
                            <i class="bi bi-arrow-down"></i>
                        </th>
                        <th class="py-1 text-center" width="20px">
                            <span class="badge small p-0">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            </span>
                        </th>
                        <th class="py-1 text-start" width="150px">Name</th>
                        <th class="py-1 text-start">Data</th>
                    </tr>
                </thead>
                <tbody v-for="item in itemList">
                    <tr class="bg-opacity-25" style="cursor:pointer"
                        :class="{'bg-warning': selectedColumn.id == item.id}" @click="selectedColumn = item">
                        <td class="py-1 text-center">{{item.order_no}}</td>
                        <td v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="py-1 text-center">
                            <div>
                                <i class="bi bi-arrow-up" @click="moveUpColumn(item)"></i>
                                <i class="bi bi-arrow-down" @click="moveDownColumn(item)"></i>
                            </div>
                        </td>
                        <td class="py-1 text-center">
                            <input class="form-check-input" type="checkbox" v-model="item.column_required" disabled>
                        </td>
                        <td class="py-1 text-start">{{item.column_name}}</td>
                        <td class="py-1 text-start">{{item.column_data}}</td>
                    </tr>
                    <tr v-if="item.column_guide" class="bg-opacity-25" style="cursor:pointer"
                        :class="{'bg-warning': selectedColumn.id == item.id}" @click="selectedColumn = item">
                        <td colspan="5" class="col m-0 pe-2 pb-2 text-end text-success">
                            {{item.column_guide}}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="col text-end my-1">
            <div v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="d-flex">
                <div v-if="this.$props.acl >= 9" class="btn btn-danger me-1"
                     style="padding:0.1em 0.5em;" @click="openCopyToModal">Copy to ...</div>
                <div class="btn btn-success me-auto" style="padding:0.1em 0.5em;" @click="copyColumnBelow">Copy to Below</div>

                <div class="btn btn-darkblue me-1" style="width:80px;padding:0.1em 0.5em;" @click="newColumn">Add</div>
                <div class="btn btn-darkblue me-1" style="width:80px;padding:0.1em 0.5em;" @click="modifyColumn">Modify</div>
                <div class="btn btn-danger me-1" style="width:80px;padding:0.1em 0.5em;" @click="deleteColumn">Delete</div>
                <div class="btn btn-danger me-1" style="min-width:80px;padding:0.1em 0.5em;" @click="deleteColumnAll">Delete All</div>
            </div>
        </div>

        <!-- Account Option Column Management Modal -->
        <div v-if="mode == 'column_new' || mode == 'column_modify' || mode == 'column_delete'" class="vue_modal" style="z-index: 9990;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <h4 class="col"> Account Plan Option Column </h4>
                        <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                    </div>
                    <div class="modal-body" style="min-height:100px;">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Name</b></label>
                            <input type="text" class="form-control col"
                                   name="Name" v-model="targetItem.column_name" disabled>

                            <button class="input-group-text" @click="accountPlanOptionColumnModal=true">
                                <i class="bi bi-search"></i>
                            </button>

                            <label class="input-group-text" style="width:100px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Mandatory</b>
                            </label>
                            <div class="input-group-text bg-white">
                                <input class="form-check-input" type="checkbox" v-model="targetItem.column_required">
                            </div>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Data</b></label>
                            <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                                   name="Data" v-model="targetItem.column_data">
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Guide</b></label>
                            <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                                   name="Guide" v-model="targetItem.column_guide">
                        </div>

                    </div>
                    <div class="modal-footer">
                        <div class="col text-center">
                            <div v-if="mode == 'column_new'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="submitFormModal">Submit</div>
                            <div v-if="mode == 'column_new'" class="btn btn-secondary" style="width:100px;"
                                 @click="mode='view'">Close</div>

                            <div v-if="mode == 'column_modify'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="updateFormModal">Update</div>
                            <div v-if="mode == 'column_modify'" class="btn btn-secondary" style="width:100px;"
                                 @click="mode='view'">Cancel</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else-if="itemList.length > 0" class="col">
        <div class="hstack border-bottom border-primary">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                <i class="bi bi-grid-3x3-gap-fill text-primary px-2"></i>
                <b>Account Plan Option Column</b>
            </div>
        </div>
        <div v-for="opt in itemList" class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0">
                    <i v-if="opt.column_required" class="bi bi-asterisk text-danger"></i>
                </span>
                <b>{{opt.column_name}}</b>
            </label>

            <select v-if="opt.data_type == 'list' || opt.data_type == 'component'"
                    class="form-select form-control text-start bg-white"
                    :disabled="pmode == 'view'" :required="opt.column_required"
                    :name="opt.column_name" v-model="opt.column_data_value" >
                <option v-for="(value, key) in opt.column_data" :value="value">{{key}}</option>
            </select>
            <textarea v-else-if="opt.data_type == 'textarea'" class="form-control text-start bg-white"
                      rows="3" class="form-select form-control text-start bg-white"
                      :disabled="pmode == 'view'" :required="opt.column_required"
                      :name="opt.column_name" v-model="opt.column_data_value">
            </textarea>

            <div v-else-if="opt.data_type == 'date'" :id="opt.column_name" class="form-control text-start input-group date p-0">
                <input type="text" class="form-control text-start bg-white border-0" aria-describedby="opt.column_name"
                       v-model="opt.column_data_value" readonly style="padding:0.1em 0.5em;">
                <span class="input-group-addon input-group-text border-0" style="padding:0.1em 0.5em;">
                    <i class="bi bi-calendar-date"></i>
                </span>
            </div>

            <input v-else class="form-control text-start bg-white" type="text" :disabled="pmode == 'view'"
                   :name="opt.column_name" v-model="opt.column_data_value" :required="opt.column_required">

            <label v-if="opt.column_guide" class="w-100 m-0 pe-2 pb-2 text-end text-success">{{opt.column_guide}}</label>
        </div>
    </div>

    <div v-if="copyToModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-danger" style="cursor:move">
                    <h4 class="col text-white">Copy to specific destination</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeCopyToModal"></button>
                </div>
                <div class="modal-body">

                    <div class="col">
                        <div class="input-group mt-1">
                            <span class="input-group-text"><b>Destination ID</b></span>
                            <input class="form-control bg-white" type="text" name="Destination ID" v-model="destination_id">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-1" style="width:100px;" @click="copyColumnTo">Confirm</div>
                        <div class="btn btn-secondary ms-1" style="width:100px;" @click="closeCopyToModal">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="accountPlanOptionColumnModal" class="col mx-1 my-3">
        <account-plan-option-column-component
                ref="accountPlanOptionColumnComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                @select-target="selectAccountPlanOptionColumn"
                @close-modal="accountPlanOptionColumnModal=false">
        </account-plan-option-column-component>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal == 'show'" class="vue_modal" style="z-index: 9995;">
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
    props : ['site','lang','div_name','acl','pmode','account_id','plan_id'],
    components: {
        'account-plan-option-column-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountPlanOptionColumnComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            itemList : [],
            mode : "view",
            account_id : this.$props.account_id,
            plan_id : this.$props.plan_id,
            selectedColumn : {},
            targetItem : {},
            showProgressModal : "",
            deleteAllColumn : false,
            destination_id : "",
            copyToModal : false,
            accountPlanOptionColumnModal : false,
        }
    },
    mounted(){
        if(this.$props.pmode =='new'){
            this.loadMasterOption();
        }else if(this.$props.pmode =='view'){
            this.loadOptionData();
        }
    },
    methods : {
        selectAccountPlanOptionColumn(item){
            this.targetItem.master_id = item.id;
            this.targetItem.column_name = item.column_name;
            this.targetItem.column_interface = item.column_interface;
        },
        // for Master management
        async loadData(account_id){
            this.account_id = account_id;
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/accountPlanOptionColumn/'+vm.account_id,
                { params:{ 'pmode': vm.$props.pmode, 'plan_id': vm.$props.plan_id } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";

            if(vm.itemList.length > 0)
                this.$emit('open-account-plan-option');
            else
                this.$emit('close-account-plan-option');
        },
        // for Plan Data View
        async loadOptionData(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/detailBudgetOption/'+vm.plan_id, null)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";

            if(vm.itemList.length > 0)
                this.$emit('open-account-plan-option');
            else
                this.$emit('close-account-plan-option');
        },
        // for Plan Data Create(New), Modify
        async loadMasterOption(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/loadMasterOption/'+vm.account_id, null)
                .then(function(res){
                    if(vm.$props.pmode =='new' && vm.itemList.length == 0){
                        vm.itemList = res.data.accountOptions;
                    }else{
                        for(var op=0; op<res.data.accountOptions.length; op++){
                            if( vm.itemList[op].column_name == res.data.accountOptions[op].column_name ){
                                vm.itemList[op].column_data = res.data.accountOptions[op].column_data;
                                vm.itemList[op].data_type = res.data.accountOptions[op].data_type;
                            }
                        }
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";

            $('.input-group.date').datepicker({
                daysOfWeekHighlighted: "0",
                todayHighlight: true,
                autoclose: true,
                language: this.$props.lang,
                orientation: "bottom",
            }).on("changeDate", function(e) {
                // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                var date = e.target.getElementsByTagName('input')[0].value;
                for(var i=0; i<vm.itemList.length; i++){
                    if(vm.itemList[i].column_name == e.target.id)
                        vm.itemList[i].column_data_value = date;
                }
            });

            if(vm.itemList.length > 0)
                this.$emit('open-account-plan-option');
            else
                this.$emit('close-account-plan-option');
        },
        openCopyToModal(){
            this.destination_id = "";
            this.copyToModal = true;
        },
        closeCopyToModal(){
            this.destination_id = "";
            this.copyToModal = false;
        },
        async copyColumnTo(){
            this.showProgressModal = "show";
            var vm = this;
            var destination = { id : this.destination_id };
            await axios.put('./api/copyToAccountPlanOptionColumn/'+vm.account_id, destination)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.copyToModal = false;
            this.mode = "view";
        },
        async copyColumnBelow(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/copyChildAccountPlanOptionColumn/'+vm.account_id, null)
                .then(function(res){  warningModal.show_modal(res.data.message);  })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        newColumn(){
            this.mode = "column_new";
            this.selectedColumn = {};
            this.targetItem = {};
        },
        modifyColumn(){
            if(this.selectedColumn.id){
                this.targetItem = JSON.parse(JSON.stringify(this.selectedColumn));
                this.mode = "column_modify";
            }else{
                warningModal.show_modal("Please, select one column.");
            }
        },
        cancelColumn(){
            this.mode = "view";
            this.loadData(this.account_id);
        },
        getData(){
            return this.itemList;
        },
        setData(data){
            this.itemList = data;
        },
        async submitFormModal(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.post('./api/accountPlanOptionColumn/'+vm.account_id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        async updateFormModal(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/accountPlanOptionColumn/'+vm.account_id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.selectedColumn = {};
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        deleteColumn(){
            this.selectedColumnPSC = {};
            this.selectedColumnStencil = {};
            if(!this.selectedColumn.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        deleteColumnAll(){
            this.selectedColumnPSC = {};
            this.selectedColumnStencil = {};
            this.selectedColumn = {};
            this.deleteAllColumn = true;
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            if(vm.selectedColumn.id){
                await axios.delete('./api/accountPlanOptionColumn/'+vm.selectedColumn.id)
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.selectedColumn = {};
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }else if(vm.deleteAllColumn){
                await axios.delete('./api/accountPlanOptionColumnAll/'+vm.account_id)
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.selectedColumn = {};
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = "";
        },
        async moveUpColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "up";
            await axios.put('./api/accountPlanOptionColumn/'+vm.account_id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        async moveDownColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "down";
            await axios.put('./api/accountPlanOptionColumn/'+vm.account_id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
    },
}
</script>

