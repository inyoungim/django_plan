<template>
    <div class="hstack" style="overflow:auto">
        <div class="vstack col-6 align-top text-nowrap mt-2 me-1">

            <div class="table-responsive">
                <table class="table table-hover table-bordered mb-0" style="overflow-x:auto">
                    <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                        <tr>
                            <th class="col-4 py-1 text-start">
                                <div class="input-group">
                                    <label class="input-group-text border-0" style="cursor:pointer" @click="enableFilter">
                                        <i v-if="!filter_enable" class="bi bi-funnel"></i>
                                        <i v-else class="bi bi-funnel-fill"></i>
                                    </label>
                                    <input class="form-control border-0 border-end" v-model="filter_name" :disabled="!filter_enable">
                                    <label class="input-group-text border-0" style="cursor:pointer" @click="moveFocus">
                                        <i class="bi bi-send"></i>
                                    </label>
                                </div>
                            </th>
                            <th class="py-1 text-center">User List</th>
                        </tr>
                    </thead>
                    <tbody v-for="(item,index) in itemList" >
                        <tr v-if="isView(item)" class="bg-opacity-25" :id="item.id">
                            <td class="hstack border-0 border-start">
                                <div v-html="level(item)"></div>
                                <span v-if="item.rght -1 > item.lft" class="col-auto" style="width:20px; cursor:pointer;"
                                      v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                                <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span>{{ item.asset_category }}</span>
                                <div v-if="index == 0" class="ps-2">
                                    <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                        <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                        <i v-else class="bi bi-tag"></i>
                                    </label>
                                </div>
                            </td>
                            <td class="bg-opacity-25 text-start" style="cursor:pointer;"
                                :class="{'bg-danger': selectedItem.id == item.id }" @click="selectedItem=item">
                                <span v-for="user,index in item.user_list">
                                    <span v-if="index > 0">, </span>
                                    <span v-if="this.$props.lang=='kr'">{{user.user_name}}</span>
                                    <span v-else>{{user.user_name_en}}</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="vstack col-6 align-top mt-2 ms-1" style="overflow-x:auto">

            <div v-if="selectedItem.id && this.$props.acl >= 7" class="hstack">
                <div class="col-auo ms-auto">
                    <div class="input-group">
                        <span class="input-group-text">
                            <i class="bi bi-person-fill"></i> User Name
                        </span>
                        <input class="form-control" placeholder="Name"
                            v-model="new_name" @keydown.enter.prevent="searchUser">
                        <button class="btn btn-primary" @click="searchUser">Search & Add</button>
                    </div>
                </div>
                <div class="col-auo ms-2">
                    <div class="input-group">
                        <button class="btn btn-danger" style="width:80px;" @click="deleteData">Delete</button>
                    </div>
                </div>
            </div>

            <table class="table table-hover table-bordered mt-2">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th class="py-1 text-center" width="50px">PK</th>
                        <th class="py-1 text-start" width="150px">User Name</th>
                        <th class="py-1 text-start">Position</th>
                        <th class="py-1 text-start">Organization</th>
                    </tr>
                </thead>
                <tbody v-if="selectedItem.id" class="shadow-sm">
                    <tr v-for="user in selectedItem.user_list" class="bg-opacity-25"
                        style="cursor:pointer" :class="{'bg-warning': selectedPICUser.id == user.id}"
                        @click="selectedPICUser=user">
                        <td class="py-1 text-center">{{user.id}}</td>
                        <td class="py-1 text-start">
                            <span v-if="this.$props.lang=='kr'">{{user.user_name}}</span>
                            <span v-else>{{user.user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start">
                            <span v-if="this.$props.lang=='kr'">{{user.user_posi}}</span>
                            <span v-else>{{user.user_posi_en}}</span>
                        </td>
                        <td class="py-1 text-start">
                            <span v-if="this.$props.lang=='kr'">{{user.user_org}}</span>
                            <span v-else>{{user.user_org_en}}</span>
                        </td>
                    </tr>
                    <tr v-if="selectedItem.user_list && selectedItem.user_list.length == 0">
                        <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                    </tr>
                </tbody>
            </table>

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
            filter_enable : false,
            filter_name : "",

            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedPICUser : {},
            toggle_id : false,

            searchUserList : [],
            showProgressModal : false,
            showSearchUserModal : false,
        }
    },
    async mounted(){
        await this.loadData();
        await this.expandAll(2);
    },
    watch : {
        async user_group(nVal){
            await this.loadData();
            this.expandAll(2);
            this.clearSelectedItem();
        }
    },
    methods: {
        refreshData(){
            this.loadData();
            this.expandAll(2);
        },
        clearSelectedItem(){
            this.selectedItem = {};
            this.selectedPICUser = {};
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/approvalUserGroupCategoryList/'+ vm.$props.user_group.id,
                    { params:{  div_name : vm.$props.div_name } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        // open all parents node and select id node
        async openSelectItem(id){
            this.showProgressModal = true;
            var vm = this;
            var result = [];
            await axios.get('./api/getAssetCategoryParents/'+id, null)
                .then(function(res){
                    result = res.data.idList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            for(var a=0; a<result.length; a++){
                if(!vm.openItemList.includes(result[a])){
                    vm.openItemList.push(result[a]);
                }
            }
            vm.selectItemID(id);
            this.showProgressModal = false;
        },
        toggle(item) {
            let index = this.openItemList.indexOf(item.id);
            if(index > -1){
                this.openItemList.splice(index,1);
                for(var i=0; i<this.itemList.length; i++){
                    if(this.itemList[i].tree_id == item.tree_id &&
                        this.itemList[i].lft > item.lft && this.itemList[i].rght < item.rght){
                        index = this.openItemList.indexOf(this.itemList[i].id);
                        if(index > -1)
                            this.openItemList.splice(index,1);
                    }
                }
            }else{
                this.openItemList.push(item.id);
            }
        },
        selectItemID(id) {
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
        },
        expandAll(level=100){
            this.openItemList = [];
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].level < level){
                    this.openItemList.push(this.itemList[i].id);
                }
            }
        },
        enableFilter(){
            this.filter_enable = !this.filter_enable;
            if(this.filter_enable){
                this.expandAll();
            }else{
                this.filter_name = "";
            }
        },
        async moveFocus(){
            if(!this.selectedItem.id) return;
            this.filter_name = "";
            this.filter_enable = false;
            this.openItemList = [];
            await this.openSelectItem(this.selectedItem.id);
            if(!this.selectedItem.id) return;
            this.$nextTick(() => {
                document.getElementById(this.selectedItem.id).scrollIntoView({block:"center"});
            });
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
            new_user.category_id = this.selectedItem.id;
            var data = { "div_name" : this.$props.div_name, "new_user" : new_user };

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/approvalUserGroupCategoryList/'+ vm.$props.user_group.id, data )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.new_name = "";

            for(var i=0; i<this.itemList.length; i++){
                if(this.selectedItem.id == this.itemList[i].id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
            this.showProgressModal = false;
            this.showSearchUserModal = false;
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
            await axios.delete('./api/approvalUserGroupCategoryList/'+vm.$props.user_group.id,
                { params:{ div_name : vm.$props.div_name, id : vm.selectedPICUser.id } })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });

            for(var i=0; i<this.itemList.length; i++){
                if(this.selectedItem.id == this.itemList[i].id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }

            this.showProgressModal = false;
            this.showSearchUserModal = false;
            this.$emit('update-data');
        },
    },
    computed:{
        isView(){
            return(item)=>{
                if(item.parent == null) return true;
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.asset_category.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name ){
                        return true;
                    }else{
                        return false;
                    }
                }
                return false;
            }

        },
        folderSymbol(){
            return(pid)=>{
                if(this.openItemList.indexOf(pid) > -1)
                    return "<i class='bi bi-dash-square-fill text-secondary'></i>";
                return "<i class='bi bi-plus-square-fill text-primary'></i>";
            }
        },
        level(){
            return(item)=>{
                return "<div style='width:"+ item.level * 1.5 + "em;'></div>";
            }
        },
    },
}
</script>
