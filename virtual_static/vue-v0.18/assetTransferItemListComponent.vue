<template>
    <div class="form-control p-0 border-0">
        <div v-if="this.$props.pmode == 'new' || this.$props.pmode == 'modify'" class="d-flex mb-1">
            <div class="me-auto">
                <button class="btn btn-sm btn-primary " style="width:80px; height:25px;"
                        @click="add_items">Add Item</button>
                <button class="btn btn-sm btn-danger ms-2" style="width:80px; height:25px;"
                        @click="delete_items">Delete Item</button>
                <button class="btn btn-sm btn-success ms-2" style="width:100px; height:25px;"
                        @click="set_user">Set New User</button>
            </div>
        </div>
        <div id="edit_form" class="table-responsive m-0 p-0">
            <table class="table table-hover table-bordered m-0">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th v-if="pmode !='view'" class="py-1 text-center">
                            <input class="form-check-input" type="checkbox"
                                   :class="{'bg-secondary':checkNotMatch}"
                                v-model="allChecked" @click="checkAllTransferItem">
                        </th>

                        <th class="py-1 text-center text-nowrap">PK</th>
                        <!--
                        <th class="py-1 text-center text-nowrap">Category</th>
                        -->
                        <th class="py-1 text-center text-nowrap">Asset Number</th>
                        <th class="py-1 text-center text-nowrap"><span v-if="lang=='kr'">품명</span><span v-else>Product Name</span></th>
                        <th class="py-1 text-center text-nowrap"><span v-if="lang=='kr'">모델명</span><span v-else>Model Name</span></th>
                        <th class="py-1 text-center text-nowrap"><span v-if="lang=='kr'">제조사</span><span v-else>Maker</span></th>
                        <th class="py-1 text-center text-nowrap">User Name</th>
                        <th class="py-1 text-center text-nowrap">Organization</th>
                        <th class="py-1 text-center text-nowrap">New User Name</th>
                        <th class="py-1 text-center text-nowrap">New Organization</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="item in item_list" class="bg-opacity-25"
                        :class="{'bg-warning' : checked_ids.includes(item.id) }">
                        <td v-if="pmode !='view'" class="py-1 text-center">
                            <input class="form-check-input bg-opacity-50" type="checkbox"
                                v-model="checked_ids" :value="item.id">
                        </td>
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.id}}</td>
                        <!--
                        <td class="py-1 text-start text-nowrap">{{item.asset_category}}</td>
                        -->
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.asset_number}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_maker}}</td>
                        <td class="py-1 text-start text-nowrap">
                            <span v-if="this.$props.lang =='kr'">{{item.user_name}}</span>
                            <span v-else>{{item.user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.user_org_name}}</td>
                        <td class="py-1 text-start text-nowrap">
                            <input type="hidden" name="New User Name" v-model="item.to_user_empno" required>
                            <span v-if="this.$props.lang =='kr'">{{item.to_user_name}}</span>
                            <span v-else>{{item.to_user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.to_user_org_name}}</td>
                    </tr>
                    <tr v-if="item_list.length == 0">
                        <td colspan="50" class="text-center"> There is no data. </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <!-- set New User Modal -->
    <div v-if="userSettingModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> New User </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelNewUser"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">
                    <div class="input-group mt-1">
                        <label class="input-group-text text-start text-wrap" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>User Name</b>
                        </label>

                            <input v-if="this.$props.lang=='kr'"
                                   class="form-control text-start" type="text"
                                   name="User Name" disabled
                                   v-model="new_user.to_user_name" readonly required>
                            <input v-else
                                   class="form-control text-start" type="text"
                                   name="User Name" disabled
                                   v-model="new_user.to_user_name_en" readonly required>

                        <div>
                            <user-select-component
                                   ref="userSelectComponent"
                                   :site="this.$props.site"
                                   :lang="this.$props.lang"
                                   :pmode="'simple'"
                                   :stype="'USER'"
                                   @select-target="userSelected"></user-select-component>
                        </div>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text text-start text-wrap" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Organization</b>
                        </label>
                        <div class="input-group-text form-control text-start ">
                            {{new_user.to_user_org_name}}
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="updateNewUser">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="cancelNewUser">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div>
        <asset-search-modal-component
            ref="assetSearchModalComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="this.$props.div_name"
            :select_mode="'checkbox'"
            @select-target="selectedAsset">
        </asset-search-modal-component>
    </div>

    <!-- Detail View Modal -->
    <div v-if="viewAssetItemModal">
        <asset-item-component
            ref="assetItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :asset_item="selected_item"
            :div_name="this.$props.div_name"
            :pmode="'view'"
            @update-data="updateData"
            @close-modal="closeAssetItemModal">
        </asset-item-component>
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
    props : ['site','lang','pmode','acl','doc_id','div_name','item_type'],
    components: {
        'asset-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            doc_id : this.$props.doc_id,
            mode : this.$props.pmode,
            item_list : [],
            selected_item : {},
            checked_ids : [],
            viewAssetItemModal : false,
            showProgressModal : false,
            userSettingModal : false,
            new_user : {},
        }
    },
    mounted(){
        if(this.doc_id != 0){
            this.loadData();
        }
    },
    methods: {
        // emit function of assetItemComponent
        addAssetItem(item){
            this.item_list.push(item);
            this.closeAssetItemModal();
        },
        // emit function of userSelectComponent
        async userSelected(type,user){
            this.new_user.to_user_empno = user.EMPLOYEE_NUMBER;
            this.new_user.to_user_name = user.FULL_NAME;
            this.new_user.to_user_name_en = user.NAME_ENG;
            this.new_user.to_user_email = user.EMAIL;
            this.new_user.to_user_posi = user.JIKWI_NAME;
            this.new_user.to_user_posi_en = user.JIKWI_NAME_ENG;
            var org = await this.getOrganization(this.new_user.to_user_empno);
            this.new_user.to_user_div_name = org.div_name;
            this.new_user.to_user_org_id = org.org_id;
            this.new_user.to_user_org_name = org.org_name;
            this.new_user.to_user_org_nas_code = org.nas_code;
            this.new_user.to_user_org_au_code = org.au_code;
        },
        // emit function of assetItemComponent
        updateData(){
            this.loadData();
        },
        async getOrganization(empno){
            this.showProgressModal=true;
            var vm = this;
            var return_value = ""
            await axios.get('./api/getOrganization',
                 { params:{ empno: empno ,} })
                .then(function(res){    return_value = res.data; })
                .catch(function(err){
                    vm.closeModal();
                    warningModal.show_modal(err);
                });
            this.showProgressModal=false;
            return return_value;
        },
        updateAssetItem(item){
            for(var i=0; i<this.item_list.length; i++){
                if(this.item_list[i] == this.selected_item){
                    this.item_list[i] = JSON.parse(JSON.stringify(item));
                    this.selected_item = this.item_list[i];
                    break;
                }
            }
            this.closeAssetItemModal();
        },
        async loadData(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/assetExecutionItemList/'+this.doc_id,null)
                .then(function(res){
                    vm.item_list = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewAssetItem(item){
            this.viewAssetItemModal=true;
            this.mode = this.$props.pmode;
            this.selected_item = item;
        },
        closeAssetItemModal(){
            this.viewAssetItemModal=false;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.mode = "new";
            this.selected_item = { };
            this.$refs.assetSearchModalComponent.openSearchModal();
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Select one or more items!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            var tempList = [];
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    if(!this.checked_ids.includes(this.item_list[i].id)){
                        tempList.push(this.item_list[i]);
                    }
                }
            }
            this.item_list = tempList;
            this.checked_ids = [];
            this.$emit('reload-appline', this.item_list);
        },
        set_user(event){
            if(event) event.preventDefault();
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Select one or more items!");
                return;
            }
            this.new_user = {};
            this.userSettingModal = true;
        },
        updateNewUser(event){
            if(event) event.preventDefault();
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    if(this.checked_ids.includes(this.item_list[i].id)){
                        this.item_list[i].to_user_email = this.new_user.to_user_email;
                        this.item_list[i].to_user_empno = this.new_user.to_user_empno;
                        this.item_list[i].to_user_name = this.new_user.to_user_name;
                        this.item_list[i].to_user_name_en = this.new_user.to_user_name_en;
                        this.item_list[i].to_user_posi = this.new_user.to_user_posi;
                        this.item_list[i].to_user_posi_en = this.new_user.to_user_posi_en;
                        this.item_list[i].to_user_div_name = this.new_user.to_user_div_name;
                        this.item_list[i].to_user_org_name = this.new_user.to_user_org_name;
                        this.item_list[i].to_user_org_au_code = this.new_user.to_user_org_au_code;
                        this.item_list[i].to_user_org_nas_code = this.new_user.to_user_org_nas_code;
                        this.item_list[i].to_user_org_id = this.new_user.to_user_org_id;
                    }
                }
            }
            this.userSettingModal = false;
            this.$emit('reload-appline', this.item_list);
        },
        cancelNewUser(event){
            if(event) event.preventDefault();
            this.new_user = {};
            this.userSettingModal = false;
        },
        checkAllTransferItem(event){
            this.checked_ids = [];
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    if(!this.allChecked){
                        this.checked_ids.push(this.item_list[i].id);
                    }
                }
            }
        },
        selectedAsset(items){
            var is_exists = false;
            for(var i=0; i<items.length; i++){
                is_exists = false;
                for(var j=0; j<this.item_list.length; j++){
                    if(this.item_list[j].id == items[i].id){
                        is_exists = true;
                    }
                }
                if(!is_exists){
                    this.item_list.push(items[i]);
                }
            }
        },
        async form_validation(){
            var requiredElements = document.querySelector("#edit_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.item_list){
                all_item_length = this.item_list.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
