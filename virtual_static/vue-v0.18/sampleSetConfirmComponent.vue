<template>

    <div class="vstack align-top p-0 text-nowrap" style="overflow-x:auto">

        <div class="hstack">
            <div>
                <button v-if="this.$props.acl >= 5 "
                        type="button" class="btn btn-primary shadow-sm py-1" style="width:80px"
                        @click="openConfirmModal('Confirm')">Confirm</button>
                <button v-if="this.$props.acl >= 5 "
                        type="button" class="btn btn-danger shadow-sm ms-1 py-1" style="width:80px"
                        @click="openConfirmModal('Reject')">Reject</button>
            </div>

            <div class="input-group-text ms-auto">{{this.$props.div_name}}</div>
            <div class="input-group-text mx-1">My Items Only</div>
            <div class="col-auto mx-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:100px;">Model Name</span>
                    <input class="form-control shadow-sm py-1" placeholder="Model Name"
                           v-model="search_model" @keyup.enter="searchData">
                </div>
            </div>
            <!--
            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:100px;">User Name</span>
                    <input class="form-control shadow-sm py-1" style="width:140px;"
                           placeholder="User Name" v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>
            -->
            <div class="col-auto">
                <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
            </div>
        </div>

        <div class="table-responsive p-0 mt-2">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th class="py-1 text-center text-nowrap">
                            <input class="form-check-input" type="checkbox"
                                   :class="{'bg-secondary':checkNotMatch}"
                                v-model="allChecked" @click="checkAItem">
                        </th>
                        <th class="py-1 text-center text-nowrap">Model Name</th>
                        <th class="py-1 text-center text-nowrap">Serial</th>
                        <th class="py-1 text-center text-nowrap">Chassis</th>
                        <th class="py-1 text-center text-nowrap">Grade</th>
                        <th class="py-1 text-center text-nowrap">Event</th>
                        <th class="py-1 text-center text-nowrap">Plan</th>
                        <th class="py-1 text-center text-nowrap">Result</th>
                        <th class="py-1 text-center text-nowrap">User Item</th>
                        <th class="py-1 text-center text-nowrap">User Name</th>
                        <th class="py-1 text-center text-nowrap">Organization</th>
                        <th class="py-1 text-center text-nowrap">Requested Date</th>
                    </tr>
                </thead>
                <tbody v-for="item,i in items">
                    <tr class="bg-opacity-25">
                        <td class="py-1 text-center">
                            <input class="form-check-input" type="checkbox"
                                v-model="checked_items" :value="item">
                        </td>
                        <td class="py-1 text-center text-nowrap">{{item.model_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.serial_seq}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.chassis_code}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.grade_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.event_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.plan_assemble_qty}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.result_assembly_qty}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.user_item_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.user_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.user_org}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div v-if="showConfirmModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move"
                     :class="{'bg-danger':confirm_item.modal_type=='Reject' }">
                    <h4 class="col"> {{confirm_item.modal_type}} </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelForm"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="form_validation">
                    <div v-if="confirm_item.modal_type == 'Confirm'" class="vstack">
                        <div class="input-group">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Confirm Type</b>
                            </label>
                            <input class="form-control shadow-sm" v-model="confirm_item.item_type" readonly>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Asset Category</b>
                            </label>
                            <div class="input-group-text form-control text-start p-0">
                                <input type="hidden" v-model="confirm_item.asset_category_id">
                                <input type="text" class="form-control text-start border-0"
                                       name="Asset Category" v-model="confirm_item.asset_category" readonly required>
                                <div class="input-group-tex border-start">
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
                            <span v-if="this.$props.lang == 'kr'"
                                  class="col text-success bg-white">
                                <p class="m-0">Asset Category : 자사샘플 > TV > PP(시작)</p>
                                <p class="m-0">Sample SET 수령을 확인 하면, 자산으로 자동 등록됩니다.</p>
                            </span>
                            <span v-else class="col text-success bg-white">
                                <p class="m-0">When you confirm receive sample SET, it will be registered at asset system.</p>
                            </span>
                        </div>
                    </div>
                    <div v-else class="vstack">
                        <div class="col input-group">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Reject Reason</b>
                            </label>
                            <div class="form-control p-0" style="padding:0.1em 0.5em;">
                                <select v-model="confirm_item.reject_reason" class="form-select border-0"
                                        name="Reject Reason" required>
                                    <option value="Different Quantity">Different Quantity</option>
                                    <option value="Different User">Different User</option>
                                </select>
                            </div>
                        </div>
                        <div v-if="confirm_item.reject_reason == 'Different Quantity' " class="col input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Reject Comments</b>
                            </label>
                            <input class="form-control shadow-sm"
                                   name="Reject Comments" v-model="confirm_item.reject_comments" required>
                        </div>
                        <div v-else class="col input-group mt-1">
                            <label class="input-group-text text-start text-wrap" style="width:160px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>New User</b>
                            </label>
                            <input v-if="this.$props.lang=='kr'"
                                   class="form-control text-start" type="text"
                                   :class="{'bg-white' :mode == 'view'}"
                                   :disabled="mode == 'view'"
                                   name="User Name"
                                   v-model="confirm_item.new_user.user_name" readonly required>
                            <input v-else
                                   class="form-control text-start" type="text"
                                   :class="{'bg-white' :mode == 'view'}"
                                   :disabled="mode == 'view'"
                                   name="User Name"
                                   v-model="confirm_item.new_user.user_name_en" readonly required>

                            <user-select-component
                                   ref="userSelectComponent"
                                   :site="this.$props.site"
                                   :lang="this.$props.lang"
                                   :pmode="'simple'"
                                   :stype="'USER'"
                                   @select-target="userSelected"></user-select-component>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col">
                        <button v-if="confirm_item.modal_type == 'Confirm'"
                                type="button" class="btn btn-primary shadow-sm" style="width:100px"
                                @click="confirmForm">Confirm</button>
                        <button v-else
                                type="button" class="btn btn-danger shadow-sm ms-1" style="width:100px"
                                @click="rejectForm">Reject</button>
                        <button type="button" class="btn btn-secondary shadow-sm ms-1" style="width:100px"
                                @click="cancelForm">Cancel</button>
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
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            items : {},
            checked_items : [],
            allChecked : false,
            showProgressModal : false,
            showConfirmModal : false,
            confirm_item : {},
        }
    },
    mounted(){
        this.searchData();
    },
    watch : {
        div_name(nVal){
            this.searchData();
        }
    },
    methods: {
        // emit function for assetCategorySearch Result
        selectedAssetCategory(item){
            this.confirm_item.asset_category = item.asset_category;
            this.confirm_item.asset_category_id = item.id;
        },
        // emit function of userSelectComponent
        async userSelected(type,user){
            this.confirm_item.new_user.user_empno = user.EMPLOYEE_NUMBER;
            this.confirm_item.new_user.user_name = user.FULL_NAME;
            this.confirm_item.new_user.user_name_en = user.NAME_ENG;
            this.confirm_item.new_user.user_email = user.EMAIL;
            this.confirm_item.new_user.user_posi = user.JIKWI_NAME;
            this.confirm_item.new_user.user_posi_en = user.JIKWI_NAME_ENG;
            this.confirm_item.new_user.user_org = user.OLD_ORG_NAME;
            this.confirm_item.new_user.user_org_en = user.ORGAN_NAME_ENG;
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            await axios.get('./api/sampleSetReceiveList',
                { params:{ div_name : vm.$props.div_name, search_model : vm.search_model, search_user : vm.search_user, } })
                .then(function(res){
                    vm.items = res.data;
                    vm.checked_items = [];
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        checkAItem(event){
            this.checked_items = [];
            if(this.items){
                for(var i=0; i<this.items.length; i++){
                    if(!this.allChecked){
                        this.checked_items.push(this.items[i]);
                    }
                }
            }
        },
        openConfirmModal(type){
            if(event) event.preventDefault();
            if(this.checked_items.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return false;
            }
            this.confirm_item = { 'new_user':{}, };
            this.confirm_item.modal_type = type;
            this.confirm_item.item_type = type
            if(this.confirm_item.modal_type == "Reject"){
                this.confirm_item.reject_reason = "Different Quantity";
            }
            this.showConfirmModal = true;
        },
        async confirmForm(event){
            if(event) event.preventDefault();
            if(!this.form_validation()) return false;

            this.showProgressModal = true;
            var vm = this;
            vm.confirm_item.target_items = vm.checked_items;
            vm.confirm_item.div_name = vm.$props.div_name;
            await axios.post('./api/confirmReceiveList', vm.confirm_item)
                .then(function(res){
                    vm.searchData();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.showConfirmModal = false;
        },
        rejectForm(event){
            if(event) event.preventDefault();
            if(!this.form_validation()) return false;

            this.confirm_target = "reject";
            confirmModal.set_contents("Are you sure to reject?")
            confirmModal.show_modal(this);
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            var response_data = {};
            vm.confirm_item.target_items = vm.checked_items;
            vm.confirm_item.div_name = vm.$props.div_name;
            await axios.post('./api/rejectReceiveList', vm.confirm_item)
                .then(function(res){
                    response_data = res.data;
                    vm.searchData();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.showConfirmModal = false;

            if(this.confirm_item.reject_reason == "Different User"){
                this.mailing(response_data);
            }
        },
        cancelForm(){
            this.showConfirmModal = false;
        },
        mailing(data){
            var vm = this;
            axios.post('./api/sendmail', data)
                .then(function(res){ })
            .catch(function(err){
                warningModal.show_modal(err);
            });
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.items){
                all_item_length = this.items.length;
            }
            if(this.checked_items.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_items.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
