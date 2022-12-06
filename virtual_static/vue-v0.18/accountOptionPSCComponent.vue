<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Account Option PSC(PCB Sample Cost Calculator)</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack my-1 justify-content-end">
                        <div class="col-auto px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Column Name</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                            </div>
                        </div>
                    </div>

                    <table v-if="this.$props.pmode == 'mgmt' && this.$props.acl >= 7"
                           class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">
                                    <input class="form-check-input" type="checkbox"
                                           :class="{'bg-secondary':checkNotMatch}" v-model="checked_all" @click="checkAll">
                                </th>
                                <th class="py-1 text-center">No</th>
                                <th class="py-1 text-center">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                </th>
                                <th class="py-1 text-start text-nowrap" width="150px">Column Name</th>
                                <th class="py-1 text-start text-nowrap">Column Interface</th>
                                <th class="py-1 text-start text-nowrap">Column Data</th>
                            </tr>
                        </thead>
                        <tbody v-for="data in itemList">
                            <tr class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': checked_ids.includes(data.id)}"
                                @dblclick="checkDblClick(data)">
                                <td class="text-center">
                                    <input type="checkbox" v-model="checked_ids" :value="data.id">
                                </td>
                                <td class="py-1 text-center">{{data.order_no}}</td>
                                <td class="py-1 text-center">
                                    <input class="form-check-input" type="checkbox" v-model="data.column_required" disabled>
                                </td>
                                <td class="py-1 text-start text-nowrap">{{data.column_name}}</td>
                                <td class="py-1 text-start text-nowrap">{{data.column_interface}}</td>
                                <td class="py-1 text-start">{{data.column_data}}</td>
                            </tr>
                            <tr v-if="data.column_guide">
                                <td class="py-1 text-end text-success" colspan='10'> {{data.column_guide}} </td>
                            </tr>
                        </tbody>
                        <tbody v-if="itemList.length == 0">
                            <tr class="bg-opacity-25">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="col text-end my-1">
                        <div v-if="this.$props.acl >= 9" class="d-flex">
                            <div class="btn btn-darkblue me-1" style="min-width:80px;padding:0.1em 0.5em;" @click="moveUpColumn">Move Up</div>
                            <div class="btn btn-darkblue me-auto" style="min-width:80px;padding:0.1em 0.5em;" @click="moveDownColumn">Move Down</div>
                            <div class="btn btn-darkblue ms-auto" style="min-width:80px;padding:0.1em 0.5em;" @click="newItem">Add</div>
                            <div class="btn btn-darkblue ms-1" style="min-width:80px;padding:0.1em 0.5em;" @click="modifyItem">Modify</div>
                            <div class="btn btn-danger ms-1" style="min-width:80px;padding:0.1em 0.5em;" @click="deleteItem">Delete</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!--  Management Modal -->
    <div v-if="mode == 'new' || mode == 'modify' || mode == 'delete'" class="vue_modal" style="z-index: 9992;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Account Option PSC(PCB Sample Cost Calculator) Management</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="udf_form">
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Column Name</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Name" v-model="targetItem.column_name" required>
                        <label class="input-group-text" style="width:100px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Mandatory</b>
                        </label>
                        <div class="input-group-text bg-white">
                            <input class="form-check-input" type="checkbox" v-model="targetItem.column_required">
                        </div>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Column Interface</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Interface" v-model="targetItem.column_interface">
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Column Data</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Data" v-model="targetItem.column_data">
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Column Guide</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Guide" v-model="targetItem.column_guide">
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
    props : ['site','lang','acl','pmode','div_name','search_string'],
    data(){
        return {
            mode : "view",
            itemList : [],
            search_string :this.$props.search_string,
            selectedItem : {},
            targetItem : {},
            checked_ids:[],
            checked_all:false,

            showSearchListModal : false,
            showProgressModal : false,
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        closeSearchModal(event){
            this.selectedItem = {};
            if(event) event.preventDefault();
            this.showSearchListModal = false;
            this.$emit('close-modal');
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/accountOptionColumnPSCMaster/0',
                { params:{ search_string : vm.search_string } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        selectSearchModal(){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select a item.");
                return;
            }
            this.showSearchListModal = false;
            this.$emit('select-target', this.selectedItem);
            this.$emit('close-modal');
        },

        newItem(){
            this.mode = "new";
            this.targetItem = {};
        },
        modifyItem(){
            if(this.checked_ids.length != 1 ){
                warningModal.show_modal("Please, select one column.");
                return;
            }

            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == this.checked_ids[0]){
                    this.targetItem = JSON.parse(JSON.stringify(this.itemList[i]));
                    this.mode = "modify";
                    break;
                }
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
            var vm = this;
            vm.targetItem.search_string = vm.search_string;
            await axios.post('./api/accountOptionColumnPSCMaster/0', vm.targetItem)
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
        },
        async updateFormModal(){
            if(this.form_validation()) return false;
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem.search_string = vm.search_string;
            await axios.put('./api/accountOptionColumnPSCMaster/'+vm.targetItem.id, vm.targetItem)
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
        },
        deleteItem(){
            if(this.checked_ids.length != 1 ){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            if(vm.checked_ids[0]){
                await axios.delete('./api/accountOptionColumnPSCMaster/'+vm.checked_ids[0],
                    { params:{ search_string : vm.search_string } }
                    )
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.mode = "list";
                        vm.checked_ids = [];
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = "";
        },
        async moveUpColumn(){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = {};
            vm.targetItem.id_list = this.checked_ids;
            vm.targetItem.move_to = "up";
            vm.targetItem.search_string = vm.search_string;
            await axios.put('./api/accountOptionColumnPSCMaster/0', vm.targetItem)
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
        },
        async moveDownColumn(){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = {};
            vm.targetItem.id_list = this.checked_ids;
            vm.targetItem.move_to = "down";
            vm.targetItem.search_string = vm.search_string;
            await axios.put('./api/accountOptionColumnPSCMaster/0', vm.targetItem)
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
        },
        checkDblClick(data){
            if(this.$props.pmode != 'mgmt'){
                this.selectedItem = data;
                this.selectSearchModal();
            }else{
                this.checked_ids = [];
                this.checked_ids.push(data.id);
                //if(this.checked_ids.includes(data.id)){
                //    var index = this.checked_ids.indexOf(data.id);
                //    this.checked_ids.splice(index, 1);
                //}else{
                //    this.checked_ids.push(data.id);
                //}
            }
        },
        checkAll(){
            this.checked_all = !this.checked_all;
            this.checked_ids = [];
            if(this.checked_all){
                if(this.itemList){
                    for(var i=0; i<this.itemList.length; i++){
                        this.checked_ids.push(this.itemList[i].id);
                    }
                }
            }
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.itemList){
                all_item_length = this.itemList.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.checked_all = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.checked_all = false;
                return false;
            }
            return true;
        },
    },
}
</script>
