<template>

    <div v-if="resultPage">
        <div class="col input-group">
            <span class="input-group-text text-start" style="width:100px;"><b>Result List</b></span>
            <div class="form-control p-1">
                <div class="col hstack mb-1">
                    <div class="col-auto px-1 me-auto"> Execution Request No : {{ doc_id }}</div>
                    <button v-if="work_order_enable && work_order_editable" class="btn btn-sm btn-primary mx-1"
                            style="min-width:80px; height:25px;" @click="showWorkOrderModal">Work Order</button>
                    <button v-if="this.$props.acl >= 7 && next_app_step >= 90" class="btn btn-sm btn-secondary mx-1"
                            style="min-width:80px; height:25px;" @click="showClosingModal">Closing</button>

                    <button v-if="maxHeight != 10000" type="button" class="btn btn-outline-danger"
                            style="padding:0.1em 0.5em;" @click="expandHeight">
                        <i class="bi bi-arrows-angle-expand"></i>
                    </button>
                    <button v-else type="button" class="btn btn-outline-primary"
                            style="padding:0.1em 0.5em;" @click="contractHeight">
                        <i class="bi bi-arrows-angle-contract"></i>
                    </button>
                </div>

                <div class="table-responsive m-0 p-0" :style="{'max-height':maxHeight +'px'}">
                    <table class="table table-hover table-bordered m-0">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">
                                    <input class="form-check-input" type="checkbox"
                                           :class="{'bg-secondary':checkNotMatch}"
                                           :disabled = "items.length == 0"
                                        v-model="allChecked" @click="checkAllExecutionItem">
                                </th>
                                <th class="py-1 text-center">No.</th>
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
                                <th class="py-1 text-start text-nowrap">
                                    Account
                                    <span v-if="viewPath">Path</span><span v-else>Name</span>
                                    <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                                        <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                                        <i v-else class="bi bi-signpost"></i>
                                    </label>
                                    <label class="ps-1" style="cursor:pointer" @click="toggle_id2 = !toggle_id2">
                                        <i v-if="toggle_id2" class="bi bi-tag-fill text-danger"></i>
                                        <i v-else class="bi bi-tag"></i>
                                    </label>
                                    <label class="ps-1" style="cursor:pointer" @click="toggle_code2 = !toggle_code2">
                                        <i v-if="toggle_code2" class="bi bi-c-square-fill text-danger"></i>
                                        <i v-else class="bi bi-c-square"></i>
                                    </label>
                                </th>
                                <th class="py-1 text-center">Mon</th>
                                <th class="py-1 text-center text-nowrap">Project Code</th>
                                <th v-if="work_order_enable" class="py-1 text-center p-0 text-nowrap">Part Number</th>
                                <th class="py-1 text-center text-nowrap">Unit Cost</th>
                                <th class="py-1 text-center text-nowrap">Quantity</th>
                                <th class="py-1 text-center text-nowrap">Total Cost</th>
                                <th v-if="work_order_enable" class="py-1 text-center p-0 text-nowrap">Work Order</th>
                                <th class="py-1 text-primary text-center text-nowrap" style="width:85px;">Result Cost</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="item in items" class="bg-opacity-25" :class="{'bg-warning' : checked_ids.includes(item.id) }">
                                <td class="py-1 text-center">
                                    <input class="form-check-input bg-opacity-50" type="checkbox"
                                           :class="[item.work_order_enable? 'bg-primary':'']"
                                        v-model="checked_ids" :value="item.id">
                                </td>
                                <td class="py-1 text-center text-nowrap"> {{ item.parent }}-{{ item.seq_no }}</td>
                                <td class="py-1 text-start text-nowrap">
                                    <span v-if="toggle_id1" class="text-danger">[{{ item.org_id }}]</span>
                                    <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                                    {{ item.org_name }}
                                </td>
                                <td class="py-1 text-start text-nowrap">
                                    <span v-if="toggle_id2" class="text-danger">[{{ item.account_id }}]</span>
                                    <span v-if="toggle_code2" class="text-danger"><{{ item.account_code }}></span>
                                    <span v-if="viewPath">{{ item.account_path }}</span>
                                    <span v-else>{{ item.account_name }}</span>
                                </td>
                                <td class="py-1 text-center text-nowrap"> {{item.execution_year}}-{{item.execution_month}} </td>
                                <td class="py-1 text-center"> {{item.project_code}} </td>
                                <td v-if="work_order_enable" class="py-1 text-center"> {{item.part_number}} </td>
                                <td class="py-1 text-end text-nowrap">
                                    <span v-if="item.pcb_sample_cost_split_slave" class="text-danger">(Cost Split)</span>
                                    <span v-else-if="item.pcb_sample_cost_enable">
                                        PCB ({{item.pcb_sample_cost_calculate}})
                                    </span>
                                    <span v-else-if="item.pcb_stencil_cost_enable">Stencil</span>
                                    <span v-else>{{markedCost(item.unit_cost)}}</span>
                                </td>
                                <td v-if="!item.pcb_sample_cost_enable && item.pcb_stencil_cost_enable"
                                    class="py-1 text-end">{{item.stencil_count}}</td>
                                <td v-else class="py-1 text-end">{{item.unit_count}}</td>
                                <td class="py-1 text-end text-nowrap">
                                    <span v-if="item.total_cost == 0">0</span>
                                    <span v-else>{{markedCost(item.total_cost)}}</span>
                                </td>
                                <td v-if="work_order_enable && item.work_order_enable" class="py-1 text-end text-nowrap"> {{item.work_order}} </td>
                                <td v-else-if="work_order_enable" class="py-1 text-end bg-secondary bg-opacity-25"></td>
                                <td class="py-1 text-end text-nowrap"
                                    style="cursor:pointer" @dblclick="viewBudgetExecutionItem(item)">
                                    <span v-if="item.result_status == 'Partial'" class="text-danger">({{ markedCost(item.result_cost) }})</span>
                                    <span v-else-if="item.result_status == 'Complete'">{{ markedCostWithZero(item.result_cost) }}</span>
                                </td>
                            </tr>
                            <tr v-if="items.length == 0">
                                <td colspan="50" class="text-center"> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>
        </div>
    </div>

    <!-- set Mass Work Order Modal -->
    <div v-if="workOrderModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Work Order </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelWorkOrder"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Work Order</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Work Order" v-model="new_work_order">
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="updateWorkOrder">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="cancelWorkOrder">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- set Mass Closing Process Modal -->
    <div v-if="closingModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Mass Closing Process </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelClosing"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="table-responsive m-0 p-0" style="overflow:auto; max-height:500px;" id="form_validation">
                        <table class="table table-hover table-bordered m-0">
                            <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                                <tr>
                                    <th class="py-1 text-center">
                                        <input class="form-check-input" type="checkbox"
                                               :class="{'bg-secondary':checkNotMatchClosing}"
                                               :disabled = "items.length == 0"
                                            v-model="allCheckedClosing" @click="checkAllClosingItem">
                                    </th>
                                    <th class="py-1 text-center">No.</th>
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
                                    <th class="py-1 text-start text-nowrap">
                                        Account
                                        <span v-if="viewPath">Path</span><span v-else>Name</span>
                                        <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                                            <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                                            <i v-else class="bi bi-signpost"></i>
                                        </label>
                                        <label class="ps-1" style="cursor:pointer" @click="toggle_id2 = !toggle_id2">
                                            <i v-if="toggle_id2" class="bi bi-tag-fill text-danger"></i>
                                            <i v-else class="bi bi-tag"></i>
                                        </label>
                                        <label class="ps-1" style="cursor:pointer" @click="toggle_code2 = !toggle_code2">
                                            <i v-if="toggle_code2" class="bi bi-c-square-fill text-danger"></i>
                                            <i v-else class="bi bi-c-square"></i>
                                        </label>
                                    </th>
                                    <th class="py-1 text-center">Mon</th>
                                    <th class="py-1 text-center text-nowrap">Project Code</th>
                                    <th v-if="work_order_enable" class="py-1 text-center text-nowrap">Part Number</th>
                                    <th class="py-1 text-center text-nowrap">Unit Cost</th>
                                    <th class="py-1 text-center text-nowrap">Quantity</th>
                                    <th class="py-1 text-center text-nowrap">Total Cost</th>
                                    <th v-if="work_order_enable" class="py-1 text-center text-nowrap">Work Order</th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="this.$props.lang == 'kr'"><b>전표 번호(주문 번호)</b></span>
                                        <span v-else><b>Document Number</b></span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="this.$props.lang == 'kr'"><b>법인 카드</b></span>
                                        <span v-else><b>Corporate Card</b></span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <b>Invoice Code</b>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <b>Vendor Code</b>
                                    </th>
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
                                        <b>Comments</b>
                                    </th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in checked_items" class="bg-opacity-25"
                                    :class="{'bg-warning' : final_checked_ids.includes(item.master.id) }">
                                    <td class="py-1 text-center">
                                        <input class="form-check-input bg-opacity-50" type="checkbox"
                                            v-model="final_checked_ids" :value="item.master.id">
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        {{item.master.parent}}-{{item.master.seq_no}}
                                    </td>
                                    <td class="text-start text-nowrap">
                                        <span v-if="toggle_id1" class="text-danger">[{{ item.master.org_id }}]</span>
                                        <span v-if="toggle_code1" class="text-danger"><{{ item.master.nas_code }}></span>
                                        {{ item.master.org_name }}
                                    </td>
                                    <td class="text-start text-nowrap">
                                        <span v-if="toggle_id2" class="text-danger">[{{ item.master.account_id }}]</span>
                                        <span v-if="toggle_code2" class="text-danger"><{{ item.master.account_code }}></span>
                                        <span v-if="viewPath">{{ item.master.account_path }}</span>
                                        <span v-else>{{ item.master.account_name }}</span>
                                    </td>
                                    <td class="py-1 text-center text-nowrap"> {{item.master.execution_year}}-{{item.master.execution_month}} </td>
                                    <td class="py-1 text-center"> {{item.master.project_code}} </td>
                                    <td v-if="work_order_enable" class="py-1 text-center"> {{item.master.part_number}} </td>
                                    <td v-if="item.master.pcb_sample_cost_enable" class="py-1 text-center text-nowrap">
                                        PCB ({{item.master.pcb_sample_cost_calculate}})
                                    </td>
                                    <td v-else-if="item.master.pcb_stencil_cost_enable" class="py-1 text-center">Stencil</td>
                                    <td v-else class="py-1 text-end">{{markedCost(item.master.unit_cost)}}</td>
                                    <td v-if="!item.master.pcb_sample_cost_enable && item.master.pcb_stencil_cost_enable"
                                        class="py-1 text-end">{{item.master.stencil_count}}</td>
                                    <td v-else class="py-1 text-end">{{item.master.unit_count}}</td>
                                    <td class="py-1 text-end">
                                        <span v-if="item.total_cost == 0">0</span>
                                        <span v-else>{{markedCost(item.master.total_cost)}}</span>
                                    </td>
                                    <td v-if="work_order_enable" class="py-1 text-end"> {{item.master.work_order}} </td>
                                    <td class="text-end p-0">
                                        <input class="form-control p-1 m-0 border-0" type="text" v-model="item.document_number">
                                    </td>
                                    <td class="text-end p-0">
                                        <input class="form-control p-1 m-0  border-0" type="text" v-model="item.corporate_card">
                                    </td>
                                    <td class="text-end p-0">
                                        <input class="form-control p-1 m-0  border-0" type="text" v-model="item.invoice_code">
                                    </td>
                                    <td class="text-end p-0">
                                        <input class="form-control p-1 m-0  border-0" type="text" v-model="item.vendor_code">
                                    </td>
                                    <td class="text-end p-0">
                                        <div class="form-control text-start input-group date p-0 border-0"
                                             :id="item.master.id" style="width:120px;">
                                            <input type="text" class="form-control text-start bg-white py-1 border-0"
                                                   v-model="item.end_result_day" readonly style="padding:0.1em 0.5em;"
                                                   :name="[this.$props.lang == 'kr' ? '실적 일자': 'End Result Day' ]" required>
                                            <span class="input-group-addon input-group-text border-0" style="padding:0.1em 0.5em;">
                                                <i class="bi bi-calendar-date"></i>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="text-end p-0">
                                        <div>
                                            <input class="form-control p-1 m-0  border-0 text-end" type="text"
                                               :name="[this.$props.lang == 'kr' ? '실적 수량': 'Result Quantity' ]" v-model="item.result_qty" required>
                                        </div>
                                    </td>
                                    <td class="text-end p-0">
                                        <div>
                                            <input class="form-control p-1 m-0  border-0 text-end" type="text"
                                               :name="[this.$props.lang == 'kr' ? '실적 금액': 'Result Cost' ]" v-model="item.result_cost" required>
                                        </div>
                                    </td>
                                    <td class="text-end p-0">
                                        <div>
                                            <select class="form-select form-control text-start bg-white py-1 border-0" style="width:110px;"
                                                    v-model="item.result_status" id="item.master.id" @change="updateStatus(item)"
                                                    :name="[this.$props.lang == 'kr' ? '실적 상태': 'Result Status' ]" required>
                                                <option value="Partial">Partial</option>
                                                <option value="Complete">Complete</option>
                                            </select>
                                        </div>
                                    </td>
                                    <td class="text-end p-0">
                                        <input class="form-control p-1 m-0  border-0" type="text"
                                               style="width:300px;" v-model="item.comments">
                                    </td>
                                </tr>
                                <tr v-if="checked_items.length == 0">
                                    <td colspan="50" class="text-center"> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="updateClosing">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="cancelClosing">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="executionItemFormModal">
        <budget-execution-item-component
            ref="budgetExecutionItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="this.$props.div_name"
            :doc_id="doc_id"
            :accountItem="selected_item"
            :pmode="'load'"
            @close-execution-item-modal="executionItemFormModal=false"
            @update-result="updateResult">
        </budget-execution-item-component>
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
    props : ['site','lang','acl','div_name','pmode','doc_id'],
    components: {
        'budget-execution-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            items : [],
            checked_items : [],
            checked_ids : [],
            final_checked_ids : [],
            mode : "view",
            new_work_order : "",
            allChecked : false,
            allCheckedClosing : false,
            resultPage : false,
            workOrderModal : false,
            closingModal : false,
            showProgressModal : false,
            work_order_enable : false,
            work_order_editable : false,
            maxHeight : 160,
            next_app_step : 0,
            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
            executionItemFormModal:false,
            selected_item : {},
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        // emit function of budgetExecutionItemComponent
        updateResult(){
            this.loadData();
        },

        contractHeight(){
            this.maxHeight = 160;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        async loadData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/resultList/'+vm.$props.doc_id, null)
                .then(function(res){
                    vm.items = res.data.items;
                    vm.work_order_editable = res.data.work_order_editable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            if(this.items.length > 0)
                this.resultPage = true;
            else
                this.resultPage = false;
            this.mode = "view";

            // check work_order item
            this.work_order_enable = false;
            for(var i=0; i<this.items.length; i++){
                if(this.items[i].work_order_enable){
                    this.work_order_enable = true;
                }
                if(this.items[i].next_app_step){
                    this.next_app_step = this.items[i].next_app_step;
                }
            }
        },
        async checkAllExecutionItem(event){
            this.checked_ids = [];
            if(this.items){
                for(var i=0; i<this.items.length; i++){
                    if(!this.allChecked){
                        this.checked_ids.push(this.items[i].id);
                    }
                }
            }
        },
        async checkAllClosingItem(event){
            this.final_checked_ids = [];
            for(var i=0; i<this.checked_items.length; i++){
                if(!this.allCheckedClosing){
                    this.final_checked_ids.push(this.checked_items[i].master.id);
                }
            }
        },
        showWorkOrderModal(event){
            if(event) event.preventDefault();
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return;
            }
            this.new_work_order = "";
            this.workOrderModal = true;
        },
        async updateWorkOrder(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var updateData = { "update_ids" : this.checked_ids, "new_work_order" : this.new_work_order }
            var vm = this;
            await axios.put('./api/workOrderList/'+vm.$props.doc_id, updateData)
                .then(function(res){
                    vm.items = res.data.items;
                    vm.work_order_editable = res.data.work_order_editable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.workOrderModal = false;
            this.$emit('update-work-order');
        },
        cancelWorkOrder(event){
            if(event) event.preventDefault();
            this.workOrderModal = false;
        },
        async showClosingModal(event){
            if(event) event.preventDefault();
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return;
            }

            this.showProgressModal = true;
            this.closingModal = true;

            var vm = this;
            await axios.get('./api/closingList/'+vm.$props.doc_id,
                    { params:{ ids : vm.checked_ids } })
                .then(function(res){
                    vm.checked_items = res.data.items;
                    vm.work_order_editable = res.data.work_order_editable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            for(var i=0; i<this.checked_items.length; i++){
                if(!this.checked_items[i].result_status){
                    this.checked_items[i].result_cost = this.checked_items[i].master.total_cost;
                    this.checked_items[i].end_result_day = this.checked_items[i].master.today;
                    this.checked_items[i].result_status = "Complete";
                }
            }

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
                    for(var i=0; i<vm.checked_items.length; i++){
                        if(vm.checked_items[i].master.id == e.target.id)
                            vm.checked_items[i].end_result_day = date;
                    }
                });
            });
            this.showProgressModal = false;
        },
        updateStatus(item){
            for(var i=0; i<this.checked_items.length; i++){
                if(this.checked_items[i].master.id == item.master.id)
                    this.checked_items[i].result_status = item.result_status;
            }
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                var check_id = parseInt(e.parentElement.parentElement.parentElement.firstChild.firstChild.value);
                if(this.final_checked_ids.includes(check_id)){
                    if(e.value == ""){
                        warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                        return true;
                    }
                }
            }
        },
        async updateClosing(event){
            if(event) event.preventDefault();
            if(this.final_checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return false;
            }
            if(this.form_validation()) return false;

            var final_checked_items = [];
            for(var i=0; i<this.checked_items.length; i++){
                var check_id = parseInt(this.checked_items[i].master.id);
                if(this.final_checked_ids.includes(check_id)){
                    final_checked_items.push(this.checked_items[i]);
                }
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/closingList/'+vm.$props.doc_id, final_checked_items)
                .then(function(res){
                    vm.items = res.data.items;
                    vm.work_order_editable = res.data.work_order_editable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            this.showProgressModal = false;
            this.closingModal = false;
        },
        cancelClosing(event){
            if(event) event.preventDefault();
            this.checked_items = [];
            this.closingModal = false;
        },
        viewBudgetExecutionItem(item, event){
            if(event) event.preventDefault();
            // execution_item_id 를 인자로 사용할 경우 서버에서 data 조회함.
            this.selected_item = item;
            this.executionItemFormModal = true;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        markedCostWithZero(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        checkNotMatch(){
            var all_item_length = 0;
            if(this.items){
                all_item_length = this.items.length;
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
        checkNotMatchClosing(){
            var all_item_length = 0;
            if(this.checked_items){
                var set = new Set();
                for(var i=0; i<this.checked_items.length; i++){
                    set.add(this.checked_items[i].id);
                }
                all_item_length = set.size;
            }
            if(this.final_checked_ids.length == all_item_length){
                this.allCheckedClosing = true;
                return false;
            }else if(this.final_checked_ids.length == 0){
                this.allCheckedClosing = false;
                return false;
            }
            return true;
        },
        cal_totalCost(){
            return (val1, val2) => {
                if(!val1) return "";
                if(!val2) return "";
                var val = parseInt(val1) * parseInt(val2);
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            }
        },
    },
}
</script>
