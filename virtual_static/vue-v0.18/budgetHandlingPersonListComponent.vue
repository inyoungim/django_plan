<template>

    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col" v-if="this.$props.lang=='kr'">경비 담당자 관리</h4>
                    <h4 class="col" v-else>Manage budget handling person list</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div v-if="this.$props.acl >= 7" class="hstack py-1">
                        <div class="col-auo me-2">
                            <div class="input-group">
                                <lable class="input-group-text">{{this.$props.year}} Year</lable>
                                <lable class="input-group-text">{{this.$props.div_name}}</lable>
                            </div>
                        </div>
                        <div class="col-auo me-2">
                            <div class="input-group">
                                <span class="input-group-text">
                                    <i class="bi bi-person-fill"></i> User Name
                                </span>
                                <input class="form-control" placeholder="Name"
                                    v-model="new_name" @keydown.enter.prevent="searchUser">
                                <button class="btn btn-primary" @click="searchUser">Search & Add</button>
                            </div>
                        </div>
                        <div class="col-auo">
                            <div class="input-group">
                                <button class="btn btn-danger" style="width:80px;" @click="deleteData">Delete</button>
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
                                <th class="py-1 text-start" width="150px">User Name</th>
                                <th class="py-1 text-start">Position</th>
                                <th class="py-1 text-start">E-mail</th>
                                <th class="py-1 text-start">Organization</th>
                                <th class="py-1 text-center">Y/N</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="data in itemList" class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': selectedItem.id == data.id}"
                                @click="selectedItem=data">
                                <td class="py-1 text-center">{{data.order_no}}</td>
                                <td v-if="mode != 'modify' && this.$props.acl >= 7" class="py-1 text-center">
                                    <div>
                                        <i class="bi bi-arrow-up" @click="moveUpColumn(data)"></i>
                                        <i class="bi bi-arrow-down" @click="moveDownColumn(data)"></i>
                                    </div>
                                </td>
                                <td class="py-1 text-start">
                                    <span v-if="this.$props.lang=='kr'">{{data.user_name}}</span>
                                    <span v-else>{{data.user_name_en}}</span>
                                </td>
                                <td class="py-1 text-start">
                                    <span v-if="this.$props.lang=='kr'">{{data.user_posi}}</span>
                                    <span v-else>{{data.user_posi_en}}</span>
                                </td>
                                <td class="py-1 text-start">{{data.user_email}}</td>
                                <td class="py-1 text-start">
                                    <span v-if="this.$props.lang=='kr'">{{data.user_org}}</span>
                                    <span v-else>{{data.user_org_en}}</span>
                                </td>
                                <td class="py-1 text-center" @click="changeActivation(data)">
                                    <span v-if="data.activate">Y</span>
                                    <span v-else class="text-danger"><b>N</b></span>
                                </td>
                            </tr>
                            <tr v-if="itemList.length == 0">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary mx-2" style="min-width:80px;" @click="closeModal">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showSearchUserModal" class="vue_modal" style="z-index: 9992;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">User Search Result</h5>
                    <button type="button" class="btn-close btn-close-white" @click="showSearchUserModal=false"></button>
                </div>
                <div class="modal-body" style="max-height:400px;">

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="5%"><i class="bi bi-person-fill"></i></th>
                                <th class="py-1 text-center" >Name</th>
                                <th class="py-1 text-center" >Position</th>
                                <th class="py-1 text-center" >E-Mail</th>
                                <th class="py-1 text-center" >Organization</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="user in searchUserList" @click="addUser(user)" style="cursor:pointer">
                                <td class="py-1 text-center"><i class="bi bi-person-fill"></i></td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.FULL_NAME }} </div>
                                    <div v-else> {{ user.NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.JIKWI_NAME }} </div>
                                    <div v-else> {{ user.JIKWI_NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">{{ user.EMAIL }}</td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.OLD_ORG_NAME }} </div>
                                    <div v-else> {{ user.ORGAN_NAME_ENG }} </div>
                                </td>
                            </tr>
                            <tr v-if="searchUserList.length == 0">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        Please, select one row.
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
    props : ['site','lang','acl','div_name','year','user_group'],
    data(){
        return {
            itemList : [],
            selectedItem : {},
            searchUserList : [],

            showProgressModal : false,
            showSearchUserModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetHandlingPersons/'+vm.$props.user_group.id,
                { params:{ div_name : vm.$props.div_name, year : vm.$props.year } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },

        async searchUser(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            vm.searchUserList = [];
            await axios.get('./api/userinfo',
                 { params:{ 'div_name':vm.$props.div_name, 'search_text': vm.new_name }, })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchUserList = res.data.searchList;
                    }else{
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            if(this.searchUserList.length == 1){
                this.addUser(this.searchUserList[0]);
            }else if(this.searchUserList.length > 1){
                this.showSearchUserModal = true;
            }else{
                warningModal.show_modal("There is no result.");
            }
        },
        async addUser(user){
            var new_user = {};
            new_user.user_empno = user.EMPLOYEE_NUMBER;
            new_user.user_email = user.EMAIL;
            new_user.user_name = user.FULL_NAME;
            new_user.user_posi = user.JIKWI_NAME;
            new_user.user_org = user.OLD_ORG_NAME;
            new_user.user_name_en = user.NAME_ENG;
            new_user.user_posi_en = user.JIKWI_NAME_ENG;
            new_user.user_org_en = user.ORGAN_NAME_ENG;
            new_user.div_name = this.$props.div_name;
            new_user.year = this.$props.year;
            var data = { "new_user" : new_user };

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/budgetHandlingPersons/'+vm.$props.user_group.id, data)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.new_name = "";
            this.showProgressModal = false;
            this.showSearchUserModal = false;
            this.$emit('update-data');
        },
        deleteData(event){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/budgetHandlingPersons/'+vm.$props.user_group.id,
                { params:{ div_name : vm.$props.div_name, year : vm.$props.year, id : vm.selectedItem.id } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.showSearchUserModal = false;
            this.$emit('update-data');
        },
        async moveUpColumn(item){
            this.showProgressModal = true;
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "up";
            await axios.put('./api/budgetHandlingPersons/'+vm.$props.user_group.id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-data');
        },
        async moveDownColumn(item){
            this.showProgressModal = true;
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "down";
            await axios.put('./api/budgetHandlingPersons/'+vm.$props.user_group.id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-data');
        },
        async changeActivation(item){
            this.showProgressModal = true;
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            await axios.put('./api/budgetHandlingPersons/'+vm.$props.user_group.id, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-data');
        },
        closeModal(event){
            this.selectedItem = {};
            if(event) event.preventDefault();
            this.$emit('close-modal');
        },
    },
    computed:{
    },
}
</script>
