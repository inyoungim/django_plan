<template>

    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Manage User Group</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="50px">No</th>
                                <th v-if="mode != 'modify' && this.$props.acl >= 7" class="py-1 text-center" width="50px">
                                    <i class="bi bi-arrow-up"></i>
                                    <i class="bi bi-arrow-down"></i>
                                </th>
                                <th class="py-1 text-center" width="50px">Division</th>
                                <th class="py-1 text-center" width="150px">Group Type</th>
                                <th class="py-1 text-center">Group Name</th>
                                <th class="py-1 text-center">Monitoring</th>
                                <th class="py-1 text-center">Management</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="data in itemList" class="bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-warning': selectedItem.id == data.id}"
                                @click="selectedItem=data" @dblclick="modifyItem">
                                <td class="py-1 text-center">{{data.order_no}}</td>
                                <td v-if="mode != 'modify' && this.$props.acl >= 7" class="py-1 text-center">
                                    <div>
                                        <i class="bi bi-arrow-up" @click="moveUpColumn(data)"></i>
                                        <i class="bi bi-arrow-down" @click="moveDownColumn(data)"></i>
                                    </div>
                                </td>
                                <td class="py-1 text-center">{{data.div_name}}</td>
                                <td class="py-1 text-start">
                                    <span v-if="data.group_type == 'Account'">Budget Account</span>
                                    <span v-else-if="data.group_type == 'Category'">Asset Category</span>
                                    <span v-else>{{data.group_type}}</span>
                                </td>
                                <td class="py-1 text-start">{{data.group_name}}</td>
                                <td class="py-1 text-center">
                                    <span v-if="data.result_monitoring">Y</span>
                                    <span v-else></span>
                                </td>
                                <td class="py-1 text-center">
                                    <span v-if="data.management_acl">Y</span>
                                    <span v-else></span>
                                </td>
                            </tr>
                            <tr v-if="itemList.length == 0">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="col col text-center">
                        <div class="btn btn-primary mx-1" style="width:100px" @click="newItem">Add</div>
                        <div class="btn btn-primary mx-1" style="width:100px" @click="modifyItem">Modify</div>
                        <div class="btn btn-danger mx-1" style="width:100px;" @click="deleteItem">Delete</div>
                        <div class="btn btn-secondary mx-1" style="width:100px;" @click="closeModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--  Management Modal -->
    <div v-if="mode == 'new' || mode == 'modify' || mode == 'delete'" class="vue_modal" style="z-index: 9992;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">User Group</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="udf_form">

                    <div class="col input-group">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Group Type</b>
                        </label>
                        <select class="form-select py-1" v-model="targetItem.group_type">
                            <option value="Division">Division</option>
                            <option value="Organization">Organization</option>
                            <option value="Account">Budget Account</option>
                            <option value="Category">Asset Category</option>
                        </select>
                    </div>

                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Group Name</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Group Name" v-model="targetItem.group_name" required>
                    </div>
                    <div v-if="targetItem.group_type == 'Organization' || targetItem.group_type == 'Account'"
                         class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Monitoring</b>
                        </label>
                        <div class="col input-group-text bg-white py-1">
                            <input type="checkbox" v-model="targetItem.result_monitoring"
                                   :disabled="mode != 'new' && mode != 'modify'">
                                <span v-if="this.$props.lang == 'kr'" class="ms-2">실적 처리 결과를 모니터링 할 경우만 Check</span>
                                <span v-else class="ms-2">Check for monitoring budget closing result.</span>
                        </div>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Management</b>
                        </label>
                        <div class="col input-group-text bg-white py-1">
                            <input type="checkbox" v-model="targetItem.management_acl"
                                   :disabled="mode != 'new' && mode != 'modify'">
                                <span v-if="this.$props.lang == 'kr'" class="ms-2">모듈 관리자 권한을 부여합니다.</span>
                                <span v-else class="ms-2">Check for grant module manager.</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                             @click="submitFormModal">Submit</div>
                        <div v-if="mode == 'new'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Close</div>

                        <div v-if="mode == 'modify'" class="btn btn-primary me-4" style="width:100px;"
                             @click="updateFormModal">Update</div>
                        <div v-if="mode == 'modify'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Cancel</div>
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
    props : ['site','lang','acl','div_name'],
    data(){
        return {
            mode : "view",
            itemList : [],
            selectedItem : {},
            targetItem : {},
            showProgressModal : false,
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        closeModal(event){
            this.selectedItem = {};
            if(event) event.preventDefault();
            this.$emit('close-modal');
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/approvalUserGroups',
                    { params:{  div_name : vm.$props.div_name } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.$emit('update-data', vm.itemList);
        },
        newItem(){
            this.mode = "new";
            this.targetItem = { 'div_name' : this.$props.div_name };
        },
        modifyItem(){
            if(this.selectedItem.id){
                this.targetItem = JSON.parse(JSON.stringify(this.selectedItem));
                this.mode = "modify";
            }else{
                warningModal.show_modal("Please, select one column.");
            }
        },
        cancelItem(){
            this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelector("#udf_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitFormModal(mode=null){
            if(this.form_validation()) return false;
            this.showProgressModal = "show";
            if(this.targetItem.group_type != 'Organization' && this.targetItem.group_type != 'Account'){
                this.targetItem.result_monitoring = false;
            }
            var vm = this;
            await axios.post('./api/approvalUserGroups', vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.$emit('update-data', vm.itemList);
        },
        async updateFormModal(){
            if(this.form_validation()) return false;
            this.showProgressModal = "show";
            if(this.targetItem.group_type != 'Organization' && this.targetItem.group_type != 'Account'){
                this.targetItem.result_monitoring = false;
            }
            var vm = this;
            await axios.put('./api/approvalUserGroups', vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == this.selectedItem.id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
            this.$emit('update-data', vm.itemList);
        },
        deleteItem(){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            if(vm.selectedItem.id){
                await axios.delete('./api/approvalUserGroups',
                    { params:{  div_name : vm.$props.div_name, id : vm.selectedItem.id } })
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.mode = "list";
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = "";
            this.selectedItem = {};
            this.$emit('update-data', vm.itemList);
        },
        async moveUpColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "up";
            await axios.put('./api/approvalUserGroups', vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.$emit('update-data', vm.itemList);
        },
        async moveDownColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "down";
            await axios.put('./api/approvalUserGroups', vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.$emit('update-data', vm.itemList);
        },
    },
    computed:{
    },
}
</script>
