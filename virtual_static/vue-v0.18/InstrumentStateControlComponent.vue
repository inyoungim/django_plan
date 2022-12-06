<template>

    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <div class="col">
                        <h4 v-if="this.$props.lang=='kr'">계측기 상태 관리</h4>
                        <h4 v-else>Control state of Instrument</h4>
                    </div>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="table-responsive p-0 mt-2">
                        <table class="table table-hover table-bordered">
                            <thead>
                                <tr class="border-0">
                                    <th colspan="6" class="px-0 py-1 border-0">
                                        <div class="col hstack">
                                            <div class="col-auto ms-auto">
                                                <div class="input-group">
                                                    <label class="input-group-text text-start text-wrap">{{ this.$props.div_name }}</label>
                                                </div>
                                            </div>
                                            <div class="col-auto ms-1">
                                                <div class="input-group">
                                                    <label class="input-group-text text-start text-wrap">
                                                        <span v-if="this.$props.lang=='kr'">자산 번호</span>
                                                        <span v-else>Asset Number</span>
                                                    </label>
                                                    <input class="form-control" ref="cursor"
                                                           v-model="search_asset_number"
                                                           @keydown.enter.prevent="assetSearchData">
                                                    <button class="input-group-text btn btn-primary"
                                                        @click="assetSearchData">Search & Add</button>
                                                </div>
                                            </div>
                                        </div>
                                    </th>
                                    <th colspan="3" class="px-0 py-1 border-0">
                                        <div class="col hstack">
                                            <div class="col-auto ms-auto">
                                                <div class="input-group">
                                                    <label class="input-group-text text-start text-wrap">
                                                        <span v-if="this.$props.lang=='kr'">담당자</span>
                                                        <span v-else>Person in charge</span>
                                                    </label>
                                                    <input v-if="this.$props.lang=='kr'"
                                                           class="form-control text-start" type="text"
                                                           :class="{'bg-white' :mode == 'view'}"
                                                           :disabled="mode == 'view'"
                                                           name="User Name"
                                                           v-model="new_user.user_name" readonly required>
                                                    <input v-else
                                                           class="form-control text-start" type="text"
                                                           :class="{'bg-white' :mode == 'view'}"
                                                           :disabled="mode == 'view'"
                                                           name="User Name"
                                                           v-model="new_user.user_name_en" readonly required>
                                                    <div class="col-auto fw-normal text-end">
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
                                        </div>
                                    </th>
                                </tr>
                            </thead>
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th colspan="6" class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">자산 정보</span>
                                        <span v-else>Asset Information</span>
                                    </th>
                                    <th colspan="2" class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">담당자 정보</span>
                                        <span v-else>Person Information</span>
                                    </th>
                                    <th colspan="1" class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">검교정</span>
                                        <span v-else>Calibration</span>
                                    </th>
                                    <th colspan="1" class="py-1 text-center"></th>
                                </tr>
                            </thead>
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center">
                                        <input class="form-check-input" type="checkbox"
                                               :class="{'bg-secondary':checkNotMatch}"
                                            v-model="allChecked" @click="checkAItem">
                                    </th>
                                    <th class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">자산 번호</span>
                                        <span v-else>Asset Number</span>
                                    </th>
                                    <th class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">품명</span>
                                        <span v-else>Product Name</span>
                                    </th>
                                    <th class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">모델명</span>
                                        <span v-else>Model Name</span>
                                    </th>
                                    <th class="py-1 text-start text-nowrap">
                                        Organization
                                        <label class="ps-1" style="cursor:pointer" @click="toggle_id1 = !toggle_id1">
                                            <i v-if="toggle_id1" class="bi bi-tag-fill text-danger"></i>
                                            <i v-else class="bi bi-tag"></i>
                                        </label>
                                        <label class="ps-1" style="cursor:pointer" @click="toggle_code1 = !toggle_code1">
                                            <i v-if="toggle_code1" class="bi bi-c-square-fill text-danger"></i>
                                            <i v-else class="bi bi-c-square"></i>
                                        </label>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">User Name</th>
                                    <th class="py-1 text-center text-nowrap">Organization</th>
                                    <th class="py-1 text-center text-nowrap">User Name</th>
                                    <th class="py-1 text-center text-nowrap">Status</th>
                                    <th colspan="1" class="py-1 text-center"><i class="bi bi-x-square"></i></th>
                                </tr>
                            </thead>
                             <tbody class="shadow-sm">
                                <tr v-for="item in instrument_list">
                                    <td class="py-1 text-center">
                                        <input class="form-check-input bg-opacity-50" type="checkbox"
                                            v-model="checked_ids" :value="item.id">
                                    </td>
                                    <td class="py-1 text-center">{{item.asset_number}}</td>
                                    <td class="py-1 text-start">{{item.asset_product}}</td>
                                    <td class="py-1 text-start">{{item.asset_model}}</td>
                                    <td class="py-1 text-start">
                                        <span v-if="toggle_id1" class="text-danger">[{{ item.user_org_id }}]</span>
                                        <span v-if="toggle_code1" class="text-danger"><{{ item.user_org_nas_code }}></span>
                                        {{item.user_org_name}}
                                    </td>
                                    <td class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">{{item.user_name}}</span>
                                        <span v-else>{{item.user_name_en}}</span>
                                    </td>
                                    <td class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">{{new_user.user_org_name}}</span>
                                        <span v-else>{{new_user.user_org_name_en}}</span>
                                    </td>
                                    <td class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">{{new_user.user_name}}</span>
                                        <span v-else>{{new_user.user_name_en}}</span>
                                    </td>
                                    <td class="py-1 text-center">
                                        <span v-if="this.$props.lang=='kr'">{{item.cal_status}}</span>
                                        <span v-else>{{item.cal_status_en}}</span>
                                    </td>
                                    <td class="py-1 text-center">
                                        <i class="bi bi-x-square text-danger" style="cursor:pointer" @dblclick="deleteRow(item)"></i>
                                    </th>
                                </tr>
                                <tr v-if="instrument_list.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col"></div>
                    <div class="col-auto">
                        <button v-if="checkState(2)" class="btn btn-primary shadow-sm mx-1"
                                @click="changeInstrumentState('3','계측기실(입고)','Instrument room(wearing)')">
                            <span v-if="this.$props.lang=='kr'">계측기실(입고)</span>
                            <span v-else>Instrument room(wearing)</span>
                        </button>
                        <button v-else class="btn btn-secondary shadow-sm mx-1">
                            <span v-if="this.$props.lang=='kr'">계측기실(입고)</span>
                            <span v-else>Instrument room(wearing)</span>
                        </button>

                        <button v-if="checkState(3)" class="btn btn-primary shadow-sm mx-1"
                                @click="changeInstrumentState('4','검교정 협력사(입고)','Calibration agency(wearing)')">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사(입고)</span>
                            <span v-else>Calibration agency(wearing)</span>
                        </button>
                        <button v-else class="btn btn-secondary shadow-sm mx-1">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사(입고)</span>
                            <span v-else>Calibration agency(wearing)</span>
                        </button>

                        <button v-if="checkState(4)" class="btn btn-primary shadow-sm mx-1"
                                @click="changeInstrumentState('5','검교정 협력사(출고)','Calibration agency(release)')">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사(출고)</span>
                            <span v-else>Calibration agency(release)</span>
                        </button>
                        <button v-else class="btn btn-secondary shadow-sm mx-1">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사(출고)</span>
                            <span v-else>Calibration agency(release)</span>
                        </button>
                    </div>
                    <div class="col text-end">
                        <button type="button" class="btn btn-secondary shadow-sm mx-1" style="width:100px"
                                @click="closeModal">Close</button>
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

    <!-- Warning Modal -->
    <div v-if="showWarningModal" class="vue_modal" style="z-index: 9995;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">
                <div class="bg-warning" class="modal-header">
                    <h5 class="modal-title w-100 text-light">Warning</h5>
                </div>
                <div class="modal-body">
                    <div class="row align-items-center" style="min-height:100px;">
                        <div class="w-100">
                            <span v-html="warning_message"></span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <button type="button" class="btn btn-secondary m-2" style="min-width:100px;"
                                ref="warningFocus" @click="closeWarningModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Confirm Modal -->
    <div v-if="showConfirmModal" class="vue_modal" style="z-index: 9995;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered">
            <div class="modal-content text-center">
                <div class="bg-danger" class="modal-header">
                    <h5 class="modal-title w-100 text-light">Confirm</h5>
                </div>
                <div class="modal-body">
                    <div class="row align-items-center" style="min-height:100px;">
                        <div class="w-100">
                            <span v-html="confirm_message"></span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <button type="button" class="btn btn-danger m-2" style="min-width:100px;"
                                ref="confirmFocus" @click="confirmConfirmModal">Confirm</button>
                        <button type="button" class="btn btn-secondary m-2" style="min-width:100px;"
                                @click="closeConfirmModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
export default {
    props : ['site','lang','div_name'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            instrument_list : [],
            checked_ids : [],
            new_user : {},
            search_asset_number :"",
            selected_list : [],
            toggle_id1 : false,
            toggle_code1 : false,

            showSearchListModal : false,
            showProgressModal : false,

            showWarningModal : false,
            showConfirmModal : false,
            warning_message : "",
            confirm_message : "",
            action_no : "",
        }
    },
    mounted(){
        this.instrument_list = [];
        this.checked_ids = [];
        this.search_asset_number = "";
        this.$refs.cursor.focus();
    },
    methods: {
        // emit function of userSelectComponent
        async userSelected(type,user){
            this.new_user.user_empno = user.EMPLOYEE_NUMBER;
            this.new_user.user_name = user.FULL_NAME;
            this.new_user.user_name_en = user.NAME_ENG;
            this.new_user.user_email = user.EMAIL;
            this.new_user.user_posi = user.JIKWI_NAME;
            this.new_user.user_posi_en = user.JIKWI_NAME_ENG;
            this.new_user.user_org_name = user.OLD_ORG_NAME;
            this.new_user.user_org_name_en = user.ORGAN_NAME_ENG;
        },
        closeModal(event){
            if(event) event.preventDefault();
            this.$emit('close-component');
        },
        async assetSearchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            var searched_asset = {};
            await axios.get('./api/calibrationInstrumentSearch',
                { params:{ 'div_name': vm.$props.div_name,  'asset_number': vm.search_asset_number }, })
                .then(function(res){
                    searched_asset = res.data;
                })
                .catch(function(err){
                    if(err.response.data.detail)
                        vm.warning_message = err.response.data.detail;
                    else
                        vm.warning_message = err;
                    vm.showWarningModal = true;
                });
            this.showProgressModal = false;

            if(searched_asset.id){
                for(var i=0; i<this.instrument_list.length; i++){
                    if(this.instrument_list[i].asset_number == searched_asset.asset_number){
                        if(this.$props.lang=='kr'){
                            this.warning_message = "동일한 자산번호가 이미 추가되었습니다.";
                        }else{
                            this.warning_message = "Already same asset number is added.";
                        }
                        this.showWarningModal = true;
                        this.$nextTick(() => {
                            this.$refs.warningFocus.focus();
                        });
                        return;
                    }
                }
                this.instrument_list.push(searched_asset);
                this.search_asset_number = "";
                this.$refs.cursor.focus();
            }else{
                this.$nextTick(() => {
                    vm.$refs.warningFocus.focus();
                });
            }
        },
        closeWarningModal(){
            this.showWarningModal = false;
            this.search_asset_number = "";
            this.$refs.cursor.focus();
        },
        checkAItem(event){
            this.checked_ids = [];
            if(this.instrument_list){
                for(var i=0; i<this.instrument_list.length; i++){
                    if(!this.allChecked){
                        this.checked_ids.push(this.instrument_list[i].id);
                    }
                }
            }
        },
        deleteRow(item){
            var temp_list = [];
            var temp_checked_ids = [];
            for(var i=0; i<this.instrument_list.length; i++){
                if(this.instrument_list[i] != item){
                    temp_list.push(this.instrument_list[i]);
                    if(this.checked_ids.includes(this.instrument_list[i].id)){
                        temp_checked_ids.push(this.instrument_list[i].id);
                    }
                }
            }
            this.instrument_list = temp_list;
            this.checked_ids = temp_checked_ids;
        },
        changeInstrumentState(action_no, state_kr, state_en){
            if(this.checked_ids.length == 0){
                if(this.$props.lang=='kr'){
                    this.warning_message = "항목을 1개 이상 체크 하세요!";
                }else{
                    this.warning_message = "Check one or more item.";
                }
                this.showWarningModal = true;
                return;
            }
            if(!this.new_user.user_empno){
                if(this.$props.lang=='kr'){
                    this.warning_message = "담당자 정보를 입력 하세요!";
                }else{
                    this.warning_message = "Please, input person in charge.";
                }
                this.showWarningModal = true;
                return;
            }

            this.showConfirmModal = true;
            if(this.$props.lang=='kr'){
                this.confirm_message = state_kr + "를 진행하시겠습니까?";
            }else{
                this.confirm_message = "Are you sure to " + state_en + "?";
            }
            this.$nextTick(() => {
                this.$refs.confirmFocus.focus();
            });
            this.action_no = action_no;
        },
        closeConfirmModal(){
            this.showConfirmModal = false;
            this.search_asset_number = "";
            this.$refs.cursor.focus();
        },
        async confirmConfirmModal(){
            this.showProgressModal = true;
            var vm = this;
            var data = {};
            data.action_no = this.action_no;
            data.new_user = this.new_user;
            data.data_list = [];
            for(var i=0; i<this.instrument_list.length; i++){
                if(this.checked_ids.includes(this.instrument_list[i].id)){
                    data.data_list.push(this.instrument_list[i]);
                }
            }
            await axios.put('./api/controlInstrumentState', data)
                .then(function(res){ })
                .catch(function(err){
                    if(err.response.data.detail)
                        vm.warning_message = err.response.data.detail;
                    else
                        vm.warning_message = err;
                    vm.showWarningModal = true;
                });
            this.showProgressModal = false;
            this.showConfirmModal = false;
            if(! this.showWarningModal){
                this.closeModal();
                this.$emit('update-data');
            }
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.instrument_list){
                all_item_length = this.instrument_list.length;
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
        checkState(){
            return(status_no)=>{
                for(var i=0; i<this.instrument_list.length; i++){
                    if(this.instrument_list[i].cal_status_no == status_no){
                        return true;
                    }
                }
                return false;
            }
        }
    },
}
</script>
