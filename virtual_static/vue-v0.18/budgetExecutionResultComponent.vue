<template>

    <!-- New Item Modal -->
    <div class="row">
        <div class="col-lg-6 vstack align-top p-1 px-2 mt-3">
            <div class="hstack border-bottom border-danger">
                <div class="col-auto border border-bottom-0 border-danger rounded-top py-1 px-2 bg-danger bg-opacity-25">
                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                    <b>Result Information</b>
                </div>
                <div v-if="this.$props.acl >= 7" class="ms-auto">
                    <button class="btn btn-sm btn-primary " style="width:100px; height:25px;"
                            @click="add_result">Add Item</button>
                    <button class="btn btn-sm btn-danger ms-2" style="width:100px; height:25px;"
                            @click="delete_result">Delete Item</button>
                </div>
            </div>

            <div class="table-responsive m-0 p-0">
                <table class="table table-hover table-bordered m-0 mb-3">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">PK</th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>실적 일자</b></span>
                                <span v-else><b>End Result Day</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>실적 수량</b></span>
                                <span v-else><b>Result Quantity</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>실적 금액</b></span>
                                <span v-else><b>Result Cost</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>실적 상태</b></span>
                                <span v-else><b>Result Status</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>담당자</b></span>
                                <span v-else><b>User Name</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'"><b>처리일</b></span>
                                <span v-else><b>Update Date</b></span>
                            </th>
                            <th class="py-1 text-center text-nowrap"><b>Comments</b></th>
                            <th class="py-1 text-center text-nowrap">
                                <i v-if="simpleView" class="bi bi-plus-square-fill text-primary" style="cursor:pointer" @click="simpleView=!simpleView"></i>
                                <i v-else class="bi bi-dash-square-fill text-secondary" style="cursor:pointer" @click="simpleView=!simpleView"></i>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-if="result.result_items && result.result_items.length > 0" v-for="ritem in result.result_items">
                        <tr class="bg-opacity-25"
                            :class="{'bg-warning': selectedItem == ritem}" @click="selectedItem = ritem">
                            <td class="py-1 text-center text-nowrap"
                                style="cursor:pointer" @click="viewResultFormModal(ritem)">{{ritem.id}}</td>
                            <td class="py-1 text-center text-nowrap">{{ritem.end_result_day}}</td>
                            <td class="py-1 text-end text-nowrap">{{ritem.result_qty}}</td>
                            <td class="py-1 text-end text-nowrap">{{markedCost(ritem.result_cost)}}</td>
                            <td class="py-1 text-center text-nowrap">{{ritem.result_status}}</td>
                            <td class="py-1 text-center text-nowrap">
                                <span v-if="lang=='kr'">{{ ritem.user_name }}</span><span v-else>{{ ritem.user_name_en }}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{ritem.update_date}}</td>
                            <td class="py-1 text-start">{{ritem.comments}}</td>
                            <td class="py-1 text-center text-nowrap">
                                <i class="bi bi-card-list" style="cursor:pointer" @click="viewResultFormModal(ritem)"></i>
                            </td>
                        </tr>
                        <tr v-if="result.result_items && result.result_items.length > 0 && !simpleView"
                            class="bg-opacity-25" @click="selectedItem = ritem">
                            <td class="py-1 text-center text-nowrap"></td>
                            <td colspan="8" class="p-0">
                                <table class="table table-bordered m-0">
                                    <tr>
                                        <th class="p-1 text-start" style="width:150px; background-color:#DDEEFF;">
                                            <span v-if="this.$props.lang == 'kr'"><b>전표 번호(주문 번호)</b></span>
                                            <span v-else><b>Document Number</b></span>
                                        </th>
                                        <td class="col-3 p-1 text-start">{{ritem.document_number}}</td>
                                        <th class="p-1 text-start" style="width:150px; background-color:#DDEEFF;">
                                            <span v-if="this.$props.lang == 'kr'"><b>법인 카드</b></span>
                                            <span v-else><b>Corporate Card</b></span>
                                        </th>
                                        <td class="col-3 p-1 text-start">{{ritem.corporate_card}}</td>
                                    </tr>
                                    <tr>
                                        <th class="col-3 p-1 text-start" style="width:150px; background-color:#DDEEFF;">
                                            <b>Invoice Code</b>
                                        </th>
                                        <td class="col-3 p-1 text-start">{{ritem.invoice_code}}</td>
                                        <th class="p-1 text-start" style="width:150px; background-color:#DDEEFF;">
                                            <b>Vendor Code</b>
                                        </th>
                                        <td class="col-3 p-1 text-start">{{ritem.vendor_code}}</td>
                                    </tr>
                                    <tr>
                                        <th class="p-1 text-start" style="width:150px; background-color:#DDEEFF;">
                                            <b>Attached Document</b>
                                        </th>
                                        <td colspan="3" class="col-3 p-1 text-start">
                                            <attached-file-component
                                                    :base_url="'result/'" :attached_list="ritem.attached_files">
                                            </attached-file-component>
                                        </td>
                                    </tr>
                                </table>
                            </td>
                        </tr>
                    </tbody>
                    <tbody v-if="result.result_items && result.result_items.length == 0 ">
                        <tr>
                            <td colspan="11" class="text-center"> There is no data. </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div v-if="resultFormModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Execution Result</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeResultFormModal"></button>
                </div>

                <div class="modal-body" id="form_validation">
                    <div class="col hstack">
                        <div class="col vstack align-top">
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span v-if="this.$props.lang == 'kr'"><b>전표 번호(주문 번호)</b></span>
                                    <span v-else><b>Document Number</b></span>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.document_number" :disabled="mode == 'view'">
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span v-if="this.$props.lang == 'kr'"><b>법인 카드</b></span>
                                    <span v-else><b>Corporate Card</b></span>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.corporate_card" :disabled="mode == 'view'">
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <b>Invoice Code</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.invoice_code" :disabled="mode == 'view'">
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <b>Vendor Code</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.vendor_code" :disabled="mode == 'view'">
                            </div>
                        </div>
                        <div class="col vstack align-top ps-1">
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <span v-if="this.$props.lang == 'kr'"><b>실적 일자</b></span>
                                    <span v-else><b>End Result Day</b></span>
                                </label>

                                <div v-if="mode == 'view'" class="form-control text-start input-group p-0 border-0">
                                    <input type="text" class="form-control text-start bg-white"
                                           v-model="editItem.end_result_day" readonly style="padding:0.1em 0.5em;">
                                </div>
                                <div v-else class="form-control text-start input-group date p-0 border-0">
                                    <input type="text" class="form-control text-start bg-white"
                                           v-model="editItem.end_result_day" readonly style="padding:0.1em 0.5em;"
                                           :name="[this.$props.lang == 'kr' ? '실적 일자': 'End Result Day' ]" required>
                                    <span class="input-group-addon input-group-text" style="padding:0.1em 0.5em;">
                                        <i class="bi bi-calendar-date"></i>
                                    </span>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <span v-if="this.$props.lang == 'kr'"><b>실적 수량</b></span>
                                    <span v-else><b>Result Quantity</b></span>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.result_qty" :disabled="mode == 'view'"
                                       :name="[this.$props.lang == 'kr' ? '실적 수량': 'Result Quantity' ]" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <span v-if="this.$props.lang == 'kr'"><b>실적 금액</b></span>
                                    <span v-else><b>Result Cost</b></span>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.result_cost" :disabled="mode == 'view'"
                                       :name="[this.$props.lang == 'kr' ? '실적 금액': 'Result Cost' ]" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <span v-if="this.$props.lang == 'kr'"><b>실적 상태</b></span>
                                    <span v-else><b>Result Status</b></span>
                                </label>
                                <select class="form-select form-control text-start bg-white"
                                        v-model="editItem.result_status" :disabled="mode == 'view'"
                                        :name="[this.$props.lang == 'kr' ? '실적 상태': 'Result Status' ]" required>
                                    <option value="Partial">Partial</option>
                                    <option value="Complete">Complete</option>
                                </select>

                            </div>
                            <div v-if="mode == 'view'" class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span v-if="this.$props.lang == 'kr'"><b>담당자</b></span>
                                    <span v-else><b>User Name</b></span>
                                </label>
                                <span v-if="lang=='kr'" class="form-control text-start bg-white">{{ editItem.user_name }}</span>
                                <span v-else class="form-control text-start bg-white">{{ editItem.user_name_en }}</span>
                            </div>
                            <div v-if="mode == 'view'" class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;">
                                    <span v-if="this.$props.lang == 'kr'"><b>처리일</b></span>
                                    <span v-else><b>Update Date</b></span>
                                </label>
                                <input class="form-control text-start bg-white" type="text"
                                       v-model="editItem.update_date" disabled>
                            </div>
                        </div>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Comments</b>
                        </label>
                        <input class="form-control text-start bg-warning bg-opacity-25" type="text"
                               v-model="editItem.comments" :disabled="account_mode == 'view'"
                               name="Comments" required>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;"><b>Attached Document</b></label>
                        <div class="col text-start" v-if="mode == 'new' || mode == 'modify'">
                            <attached-file-component ref="attachedFileComponent"
                                                     :base_url="'result/'"
                                                     :attached_list="editItem.attached_files"
                                                     :mode="mode"></attached-file-component>
                        </div>
                        <div class="col" v-else>
                            <attached-file-component
                                    :base_url="'result/'" :attached_list="editItem.attached_files">
                            </attached-file-component>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div v-if="mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitResultFormModal">Add Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeResultFormModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyResultFormModal">Modify Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeResultFormModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitResultFormModal">Update Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelExecutionFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeResultFormModal">Close</div>
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
    props : ['site','lang','acl','parent_id'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "list",
            result : {},
            parent_id : this.$props.parent_id,
            selectedItem : {},
            editItem : {},
            showProgressModal : false,
            resultFormModal : false,
            simpleView : true,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        async loadData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/executionResult/'+vm.parent_id,null)
                .then(function(res){    vm.result = res.data.result; })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.mode = "list";

            //if(this.result.result_items.length > 1)
            //    this.simpleView = true;
            //else
            //    this.simpleView = false;
        },
        add_result(event){
            if(event) event.preventDefault();

            this.editItem = {};
            this.mode = "new";
            this.resultFormModal = true;
            // this.editItem.result_qty = this.result.execution_count;
            // v-if 로 DOM 을 생성하는 경우, DOM 생성후 datepicker setting 해야 하므로 delay 필요
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    vm.editItem.end_result_day = date;
                });
            });
        },
        delete_result(){
            if(event) event.preventDefault();
            if(!this.selectedItem.id){
                warningModal.show_modal("Select a result item!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/executionResult/'+vm.selectedItem.id, null)
                .then(function(res){
                    vm.result = res.data.result;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            //if(this.result.result_items.length > 1)
            //    this.simpleView = true;
            //else
            //    this.simpleView = false;
            this.$emit('update-result');
        },
        viewResultFormModal(item){
            this.mode = "view";
            this.editItem = item;
            this.resultFormModal = true;
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
        async submitResultFormModal(){
            if(!this.form_validation()) return false;

            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.editItem.id);
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.showProgressModal = true;
                // make array data svr_file_names and up_file_names
                vm.editItem.attache_files = [];
                vm.editItem.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.editItem.attache_files.push(response.svr_file_names[i]);
                    vm.editItem.attache_file_names.push(response.up_file_names[i]);
                }
                if(this.mode == "new"){
                    await axios.post('./api/executionResult/'+vm.parent_id, vm.editItem)
                        .then(function(res){
                            vm.result = res.data.result;
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }else{
                    await axios.put('./api/executionResult/'+vm.editItem.id, vm.editItem)
                        .then(function(res){
                            vm.result = res.data.result;
                        })
                        .catch(function(err){
                            vm.showProgressModal = false;
                            warningModal.show_modal(err);
                            return;
                        });
                }
                vm.showProgressModal = false;
            }
            this.resultFormModal=false;
            //if(this.result.result_items.length > 1)
            //    this.simpleView = true;
            //else
            //    this.simpleView = false;
            this.$emit('update-result');
        },
        modifyResultFormModal(){
            this.mode = "modify";
            this.editItem = JSON.parse(JSON.stringify(this.selectedItem));
            // v-if 로 DOM 을 생성하는 경우, DOM 생성후 datepicker setting 해야 하므로 delay 필요
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    vm.editItem.end_result_day = date;
                });
            });
        },
        cancelExecutionFormModal(){
            this.editItem = this.selectedItem;
            this.mode = "view";
        },
        closeResultFormModal(){
            this.resultFormModal=false;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
