<template>

    <!-- New Item Modal -->
    <div class="vue_modal" style="z-index: 9990;">

        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Asset Item</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>
                <div class="modal-body" id="asset_form" style="min-height:100px;">
                    <div class="row">
                        <div class="col pt-1 px-2 mb-3">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Basic Information</b>
                                </div>
                                <!--
                                <div v-if="edit_item.next_app_step > 0 && this.$props.acl >= 9" class="ms-auto">
                                    <div v-if="mode == 'view'"
                                         class="btn btn-primary py-0 mx-1" style="height:25px"
                                         @click="changeCategory">Change Category</div>
                                    <div v-if="mode == 'changeCategory'"
                                         class="btn btn-primary py-0 mx-1" style="height:25px"
                                         @click="updateCategory">Update</div>
                                    <div v-if="mode == 'changeCategory'"
                                         class="btn btn-secondary py-0 mx-1" style="height:25px"
                                         @click="cancelCategory">Cancel</div>
                                </div>
                                -->
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Asset Category</b>
                                </label>
                                <div class="input-group-text form-control text-start p-0">
                                    <input type="hidden" v-model="edit_item.asset_category_id">
                                    <input type="text" class="form-control text-start border-0"
                                           :class="{'bg-white' :mode == 'view'}"
                                           name="Asset Category" v-model="edit_item.asset_category" readonly required>
                                    <div v-if="mode != 'view'" class="input-group-tex border-start">
                                        <asset-category-select-component
                                                ref="organizationAccountSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :acl="this.$props.acl"
                                                :div_name="this.$props.div_name"
                                                @select-target="selectedAssetCategory">
                                        </asset-category-select-component>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Asset Number</b>
                                </label>
                                <div class="input-group-text form-control text-start p-0">
                                    <span v-if="edit_item.registration_type == 'New Asset' &&
                                            (mode != 'view' && mode != 'changeCategory')"
                                          class="form-control text-start border-0" readonly>{{edit_item.asset_number}}</span>
                                    <input v-else type="text" :disabled="(mode == 'view' || mode == 'changeCategory')"
                                           class="form-control bg-white text-start border-0"
                                           name="Asset Number"
                                           v-model="edit_item.asset_number" required>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">품명</b><b v-else>Product Name</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '품명' : 'Product Name']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_product" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">모델명</b><b v-else>Model Name</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '모델명' : 'Model Name']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_model" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">제조사</b><b v-else>Maker</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '제조사' : 'Maker']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_maker" required>
                            </div>
                            <div v-if="mode =='new' && edit_item.registration_type == 'New Asset'"
                                 class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">수량</b><b v-else>Quantity</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '수량' : 'Quantity']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.quantity" required>
                            </div>
                        </div>

                        <div class="col pt-1 px-2 mb-3">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Additional Information</b>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                 <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Registration Type</b>
                                </label>
                                <select class="form-select py-1"
                                        v-model="edit_item.registration_type"
                                        :disabled="(mode == 'view' || mode == 'changeCategory')"
                                        @change="changeRegisrationType">
                                    <option value="New Asset">New Asset</option>
                                    <option value="Exist Asset Number">Exist Asset Number</option>
                                </select>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-nowrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Create Date</b>
                                </label>
                                <div class="input-group-text form-control text-start bg-white">
                                    {{edit_item.create_date}}
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">입고 금액</b><b v-else>Receiving amount</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '입고 금액' : 'Receiving amount']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_cost" required>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>User Name</b>
                                </label>

                                    <input v-if="this.$props.lang=='kr'"
                                           class="form-control text-start" type="text"
                                           :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                           :disabled="(mode == 'view' || mode == 'changeCategory')"
                                           name="User Name"
                                           v-model="edit_item.user_name" readonly required>
                                    <input v-else
                                           class="form-control text-start" type="text"
                                           :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                           :disabled="(mode == 'view' || mode == 'changeCategory')"
                                           name="User Name"
                                           v-model="edit_item.user_name_en" readonly required>

                                <div v-if="(mode != 'view' && mode != 'changeCategory')">
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
                                <div class="input-group-text form-control text-start">
                                    {{edit_item.user_org_name}}
                                </div>
                            </div>
                        </div>
                    </div>

                    <div v-if="edit_item.next_app_step > 0" class="row">
                        <div class="col pt-1 px-2 mb-3">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Asset Memo</b>
                                </div>
                                <div class="col-auto ms-auto">
                                    <div v-if="mode == 'view'" class="btn btn-primary py-0 mx-1"
                                         style="height:25px" @click="modifyMemo">Modify</div>
                                    <div v-if="mode == 'modifyMemo'" class="btn btn-primary py-0 mx-1"
                                         style="height:25px" @click="updateMemo">Update</div>
                                    <div v-if="mode == 'modifyMemo'" class="btn btn-secondary py-0 mx-1"
                                         style="height:25px" @click="cancelMemo">Cancel</div>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <input type="text" class="form-control text-start"
                                       :disabled="mode != 'modifyMemo'" v-model="edit_item.asset_memo">
                            </div>
                        </div>
                    </div>

                    <div v-if="(this.$props.pmode == 'view' || this.$props.pmode == 'load') && edit_item.id" class="col my-3">
                        <execution-history-component
                                ref="executionHistoryComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :pmode="mode"
                                :parent_id="edit_item.id"
                                @update-item="updateHistory">
                        </execution-history-component>
                    </div>

                    <div v-if="(this.$props.pmode == 'view' || this.$props.pmode == 'load') && edit_item.id" class="col my-3">
                        <inspection-history-component
                                ref="inspectionHistoryComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :pmode="mode"
                                :parent_id="edit_item.id"
                                @update-result="updateHistory">
                        </inspection-history-component>
                    </div>

                </div>

                <div class="modal-footer">
                    <div v-if="(pmode == 'new' || pmode == 'modify') && mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitExecutionFormModal">Add Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyExecutionFormModal">Modify Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitExecutionFormModal">Update Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelExecutionFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeModal">Close</div>
                    </div>

                </div>
            </div>
        </div>
        <form name="submitForm" method="get"></form>
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
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month  + '-' + day;
var today = new Date(dateString);

export default {
    props : ['site','lang','acl','pmode','asset_item','asset_item_id','div_name','app_type','doc_id'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'execution-history-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetExecutionHistoryComponent.vue', vueLoaderOptions) ),
        'inspection-history-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetInspectionHistoryComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            item : this.$props.asset_item,
            edit_item : {},
            showProgressModal : false,
        }
    },
    async mounted(){
        if(!this.item.asset_category){
            this.mode = "new";
            this.item.registration_type = "New Asset";
            this.item.asset_number = "TBD";
            this.item.create_date = dateString;
        }
        if(this.$props.pmode == 'load'){
            this.edit_item.id = this.$props.asset_item_id;
            await this.loadData();
        }
        this.edit_item = JSON.parse(JSON.stringify(this.item));
    },
    methods: {
        // emit function for assetCategorySearch Result
        selectedAssetCategory(item){
            this.edit_item.asset_category = item.asset_category;
            this.edit_item.asset_category_id = item.id;
        },
        // emit function for userSelectComponent
        async userSelected(type,user){
            this.edit_item.user_empno = user.EMPLOYEE_NUMBER;
            this.edit_item.user_name = user.FULL_NAME;
            this.edit_item.user_name_en = user.NAME_ENG;
            this.edit_item.user_email = user.EMAIL;
            this.edit_item.user_posi = user.JIKWI_NAME;
            this.edit_item.user_posi_en = user.JIKWI_NAME_ENG;
            var org = await this.getOrganization(this.edit_item.user_empno);
            this.edit_item.user_div_name = org.div_name;
            this.edit_item.user_org_id = org.org_id;
            this.edit_item.user_org_name = org.org_name;
            this.edit_item.user_org_nas_code = org.nas_code;
            this.edit_item.user_org_au_code = org.au_code;
        },
        // emit fucntion
        updateHistory(){
            this.loadData();
            this.$emit('update-data');
        },
        changeRegisrationType(){

            if(this.edit_item.registration_type == "New Asset"){
                this.edit_item.asset_number = "TBD";
            }else{
                this.edit_item.asset_number = "";
            }
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
        async loadData(){
            if(!this.edit_item.id)
                this.edit_item.id = 0;

            this.showProgressModal=true;
            var vm = this;
            await axios.get('./api/assetItem/'+vm.edit_item.id,
                 { params:{  } })
                .then(function(res){    vm.item = res.data; })
                .catch(function(err){
                    vm.closeModal();
                    warningModal.show_modal(err);
                });
            this.showProgressModal=false;
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            if(this.edit_item.id)
                this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelector("#asset_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitExecutionFormModal(){
            if(this.form_validation()) return false;
            this.edit_item.asset_number = this.edit_item.asset_number.replace(/\s/g,'');
            if(this.mode == 'new'){
                if(this.edit_item.registration_type == 'New Asset'){
                    if(isNaN(this.edit_item.quantity)){
                        if(this.$props.lang == 'kr'){
                            warningModal.show_modal("수량 항목에는 정수를 입력해 주세요!");
                        }else{
                            warningModal.show_modal("Please, input number in Quantity field!");
                        }
                        return;
                    }
                    for(var i=0; i<this.edit_item.quantity; i++){
                        this.edit_item.id = 0;
                        this.$emit('add-item',this.edit_item);
                    }
                    this.mode = "view";
                }else{
                    this.showProgressModal=true;
                    var vm = this;
                    var response = false;
                    await axios.get('./api/assetItemDuplicationCheck',
                        { params:{ 'asset_number' : vm.edit_item.asset_number  } })
                        .then(function(res){
                            response = true;
                         })
                        .catch(function(err){
                            warningModal.show_modal(err);
                            return;
                        });
                    this.showProgressModal=false;

                    if(response){
                        this.edit_item.id = 0;
                        this.$emit('add-item',this.edit_item);
                        this.mode = "view";
                    }
                }
            }else if(this.mode == 'modify'){
                this.$emit('update-item',this.edit_item);
                this.mode = "view";
            }
        },

        modifyExecutionFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "modify";
        },
        cancelExecutionFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
        },
        closeModal(event){
            if(event) event.preventDefault();
            this.mode = "view";
            this.$emit('close-modal');
        },
        changeCategory(event){
            if(event) event.preventDefault();
            this.mode = "changeCategory";
        },
        async updateCategory(event){
            if(event) event.preventDefault();

            this.showProgressModal=true;
            var vm = this;
            await axios.put('./api/assetItem/'+vm.edit_item.id, vm.edit_item)
                .then(function(res){    vm.item = res.data; })
                .catch(function(err){
                    vm.closeModal();
                    warningModal.show_modal(err);
                });
            this.showProgressModal=false;
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
            this.$emit('update-item', this.edit_item);
        },
        cancelCategory(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
        },
        modifyMemo(event){
            this.mode = "modifyMemo";
        },
        async updateMemo(event){
            if(event) event.preventDefault();

            this.showProgressModal=true;
            var vm = this;
            await axios.put('./api/assetItem/'+vm.edit_item.id, vm.edit_item)
                .then(function(res){    vm.item = res.data; })
                .catch(function(err){
                    vm.closeModal();
                    warningModal.show_modal(err);
                });
            this.showProgressModal=false;
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
            this.$emit('update-item', this.edit_item);
        },
        cancelMemo(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
        },
    },
    computed:{

    },
}
</script>
