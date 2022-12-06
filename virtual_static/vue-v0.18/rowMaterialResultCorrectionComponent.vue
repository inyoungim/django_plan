<template>

    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xxl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col" v-if="this.$props.lang == 'kr'">원재료 실적보정</h4>
                    <h4 class="col" v-else>Row Material Result Correction</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="table-responsive" style="max-height:500px;">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF; position: sticky;top:0;">
                            <tr>
                                <th class="py-1 text-center">No.</th>
                                <th class="py-1 text-center text-nowrap">Part Number</th>
                                <th class="py-1 text-center text-nowrap">Work Order</th>
                                <th class="py-1 text-center text-nowrap">
                                    <span v-if="lang=='kr'">입고 조직명</span>
                                    <span v-else>Wearing Organization</span>
                                </th>
                                <th class="py-1 text-center text-nowrap">
                                    <span v-if="lang=='kr'">품의 조직명</span>
                                    <span v-else>Execution Organization</span>
                                </th>
                                <th class="py-1 text-center text-nowrap">GERP Qty.</th>
                                <th class="py-1 text-center text-nowrap">Execution Qty.</th>
                                <th class="py-1 text-center text-nowrap">GERP Date</th>
                                <th class="py-1 text-center text-nowrap">Result Date</th>
                                <th class="py-1 text-center text-nowrap">GERP Cost</th>
                                <th class="py-1 text-center text-nowrap">Result Cost</th>
                                <th class="py-1 text-center text-nowrap">Execution Document</th>
                                <th class="py-1 text-center text-nowrap">Execution Item</th>
                                <th class="py-1 text-center text-nowrap">Validation Result</th>
                            </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="(item,i) in tdata.itemList">
                                    <td class="text-center text-nowrap">{{ i+1 }}</td>
                                    <td class="text-start text-nowrap">{{ item.part_number }}</td>
                                    <td class="text-start text-nowrap">{{ item.work_order }}</td>
                                    <td class="text-start text-nowrap">
                                        ({{item.gerp_org_code}}) {{ item.gerp_org_name }}
                                    </td>
                                    <td class="text-start text-nowrap bg-opacity-25"
                                        :class="{'bg-danger': item.valid_fail_list.includes(4)}">
                                        <span v-if="item.rnd_org_code">
                                            ({{item.rnd_org_code}}) {{ item.rnd_org_name }}
                                        </span>
                                    </td>
                                    <td class="text-end text-nowrap">{{ item.gerp_qty }}</td>
                                    <td class="text-end text-nowrap bg-opacity-25"
                                        :class="{'bg-danger': item.valid_fail_list.includes(6)}">
                                        {{ item.rnd_qty }}
                                    </td>
                                    <td class="text-center text-nowrap">{{ item.gerp_date }}</td>
                                    <td class="text-center text-nowrap bg-opacity-25"
                                        :class="{'bg-danger': item.valid_fail_list.includes(8)}">
                                        {{ item.rnd_date }}
                                    </td>
                                    <td class="text-end text-nowrap">{{ markedCost(item.gerp_cost) }}</td>
                                    <td class="text-end text-nowrap bg-opacity-25"
                                        :class="{'bg-success': item.valid_fail_list.includes(10)}">
                                        {{ markedCost(item.rnd_cost) }}
                                    </td>
                                    <td class="text-center text-nowrap">
                                        <span v-if="item.rnd_doc_no" class="text-primary"
                                              style="cursor:pointer" @click="viewDocument(item.rnd_doc_no)">
                                            {{item.rnd_doc_no}}-{{item.rnd_doc_seq_no}}
                                        </span>
                                        <span v-else>{{item.rnd_doc_no}}-{{item.rnd_doc_seq_no}}</span>
                                    </td>
                                    <td class="text-center text-nowrap">
                                        <span v-if="item.rnd_item_id" class="text-primary"
                                              style="cursor:pointer" @click="viewBudgetExecutionItem(item.rnd_item_id)">
                                            {{item.rnd_item_id}}
                                        </span>
                                        <span v-else>{{item.seq_no}}</span>
                                    </td>
                                    <td class="text-start text-nowrap"
                                        :class="{'text-danger': item.validation_result != ''}">
                                        {{ item.validation_result }}
                                    </td>
                                </tr>
                                <tr v-if="!tdata.itemList || tdata.itemList.length == 0">
                                    <td class="text-center text-nowrap" colspan="50">There is no data.</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div v-if="mode=='list'" class="btn btn-primary mx-2" style="min-width:100px;"
                             @click="verifyStart">Verify Start
                        </div>
                        <div v-if="mode=='verify'" class="btn btn-success mx-2" style="min-width:100px;"
                             @click="applyStart">Apply Start
                        </div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
                    </div>
                    <form name="documentForm" method="get"></form>
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
    props : ['site','lang','pmode','acl', 'div_name', 'year','month',
                'org_id_list', 'acc_id_list', 'exception_acc_id_list','search_condition'],
    components: {
        'budget-execution-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : 'list',
            tdata : {},
            selected_item : {},
            showProgressModal : false,
            executionItemFormModal:false,
        }
    },
    mounted(){
    },
    methods: {
        closeModal(){
            this.$emit('close-modal');
        },
        updateResult(){
            this.$emit('update-data');
            this.refreshPage();
        },
        viewDocument(doc_id){
            this.newWindow('1200','750','',"budgetExecutionForm");
            document.documentForm.target = "budgetExecutionForm";
            document.documentForm.action = "./document/"+doc_id;
            document.documentForm.submit();
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
        viewBudgetExecutionItem(id){
            // execution_item_id 를 인자로 사용할 경우 서버에서 data 조회함.
            this.selected_item = { id: id };
            this.executionItemFormModal = true;
        },
        async verifyStart(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/rowMaterialCorrection',
                { params:{ div_name : vm.$props.div_name, year : vm.$props.year, } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.mode = "verify";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async applyStart(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/rowMaterialCorrection', vm.tdata)
                .then(function(res){
                    vm.tdata = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            if(vm.tdata.result_msg != ""){
                warningModal.show_modal(vm.tdata.result_msg);
            }
        },
        async refreshPage(){
            await this.verifyStart();
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
