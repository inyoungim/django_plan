<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Account Planning Option Column Master</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack my-1 justify-content-end">
                        <div class="col-auo mx-1">
                            <div class="input-group">
                                <lable class="input-group-text">{{this.$props.div_name}}</lable>
                            </div>
                        </div>
                        <div class="col-auto px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Column Name</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                            </div>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="50px">No</th>
                                <th v-if="mode != 'modify' && this.$props.acl >= 7" class="py-1 text-center" width="50px">
                                    <i class="bi bi-arrow-up"></i>
                                    <i class="bi bi-arrow-down"></i>
                                </th>
                                <th class="py-1 text-start" width="150px">Column Name</th>
                                <th class="py-1 text-start">Column Description</th>
                                <th class="py-1 text-start">Column Interface</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="data in itemList" class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': selectedItem.id == data.id}"
                                @click="selectedItem=data" @dblclick="selectSearchModal">
                                <td class="py-1 text-center">{{data.order_no}}</td>
                                <td v-if="mode != 'modify' && this.$props.acl >= 7" class="py-1 text-center">
                                    <div>
                                        <i class="bi bi-arrow-up" @click="moveUpColumn(data)"></i>
                                        <i class="bi bi-arrow-down" @click="moveDownColumn(data)"></i>
                                    </div>
                                </td>
                                <td class="py-1 text-start">{{data.column_name}}</td>
                                <td class="py-1 text-start">{{data.column_desc}}</td>
                                <td class="py-1 text-start">{{data.column_interface}}</td>
                            </tr>
                            <tr v-if="itemList.length == 0">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div v-if="this.$props.pmode == 'mgmt'" class="col text-end my-1">
                        <div v-if="this.$props.acl >= 7" class="d-flex">
                            <div class="btn btn-darkblue ms-auto" style="width:80px;padding:0.1em 0.5em;" @click="newItem">Add</div>
                            <div class="btn btn-darkblue ms-1" style="width:80px;padding:0.1em 0.5em;" @click="modifyItem">Modify</div>
                            <div class="btn btn-danger ms-1" style="width:80px;padding:0.1em 0.5em;" @click="deleteItem">Delete</div>
                        </div>
                    </div>
                    <div v-else class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectSearchModal">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeSearchModal">Cancel</div>
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
                    <h4 class="col">Account Planning Option Column Master</h4>
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
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Column Description</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Description" v-model="targetItem.column_desc">
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <b>Column Interface</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Column Interface" v-model="targetItem.column_interface">
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
            await axios.get('./api/planOptionColumnMaster/0',
                { params:{ div_name : vm.$props.div_name, search_string : vm.search_string } })
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
            this.targetItem = { 'div_name': this.$props.div_name };
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
            var vm = this;
            vm.targetItem.search_string = vm.search_string;
            await axios.post('./api/planOptionColumnMaster/0', vm.targetItem)
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
            await axios.put('./api/planOptionColumnMaster/'+vm.targetItem.id, vm.targetItem)
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
                await axios.delete('./api/planOptionColumnMaster/'+vm.selectedItem.id,
                    { params:{ div_name : vm.$props.div_name, search_string : vm.search_string } }
                    )
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.mode = "list";
                        vm.selectedItem = {};
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
            vm.targetItem.search_string = vm.search_string;
            await axios.put('./api/planOptionColumnMaster/'+vm.targetItem.id, vm.targetItem)
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
        async moveDownColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "down";
            vm.targetItem.search_string = vm.search_string;
            await axios.put('./api/planOptionColumnMaster/'+vm.targetItem.id, vm.targetItem)
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
    },
    computed:{
    },
}
</script>
