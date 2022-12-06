<template>

    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xxl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Execution Item List</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="table-responsive" style="max-height:500px;">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF; position: sticky;top:0;">
                            <tr>
                                <th class="py-1 text-center">No.</th>
                                <th class="py-1 text-center" style="min-width:200px;">Title</th>
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
                                <th class="py-1 text-center">Creator</th>
                                <th class="py-1 text-center">Create Date</th>
                                <th class="py-1 text-center text-nowrap">Project Code</th>
                                <th class="py-1 text-center text-nowrap">Total Cost</th>
                                <th class="py-1 text-center text-nowrap">Status</th>
                                <th class="py-1 text-center text-nowrap">Result Cost</th>
                                <th class="py-1 text-center text-nowrap">Result Status</th>
                            </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="item in tdata.itemList"
                                    class="bg-opacity-25"
                                    :class="{'bg-warning':selected_item == item}" @click="selected_item=item">
                                    <td class="text-center text-nowrap">{{item.parent}}-{{item.seq_no}}</td>
                                    <td class="text-start text-primary text-nowrap" style="min-width:200px;">
                                        <span style="cursor:pointer" @click="viewDocument(item.parent)">{{ item.title }}</span>
                                    </td>
                                    <td class="text-start text-nowrap">
                                        <span v-if="toggle_id1" class="text-danger">[{{ item.org_id }}]</span>
                                        <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                                        {{ item.org_name }}
                                    </td>
                                    <td class="text-start text-primary text-nowrap">
                                        <span v-if="toggle_id2" class="text-danger">[{{ item.account_id }}]</span>
                                        <span v-if="toggle_code2" class="text-danger"><{{ item.account_code }}></span>
                                        <span style="cursor:pointer" @click="viewBudgetExecutionItem(item)">
                                            <span v-if="viewPath">{{ item.account_path }}</span>
                                            <span v-else>{{ item.account_name }}</span>
                                        </span>
                                    </td>
                                    <td class="text-center text-nowrap">
                                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                                    </td>
                                    <td class="text-center text-nowrap">{{ item.create_date }}</td>
                                    <td class="text-center text-nowrap">{{ item.project_code }}</td>
                                    <td class="text-end">{{ markedCost(item.total_cost) }}</td>
                                    <td class="text-center">{{ item.status }}</td>
                                    <td class="text-end" style="cursor:pointer" @click="viewBudgetExecutionItem(item)">
                                        <span v-if="item.result_status == 'Partial'" class="text-danger">({{ markedCost(item.result_cost) }})</span>
                                        <span v-else-if="item.result_status == 'Complete'">{{ markedCost(item.result_cost) }}</span>
                                    </td>
                                    <td class="text-center" style="cursor:pointer" @click="viewBudgetExecutionItem(item)">{{ item.result_status }}</td>
                                </tr>
                                <tr v-if="tdata.itemList && tdata.itemList.length == 0">
                                    <td class="text-center text-nowrap" colspan="50">There is no data.</td>
                                </tr>
                            </tbody>
                            <tfoot>
                                <tr>
                                    <td colspan="100">
                                        <div class="hstack mt-3">
                                            <div class="col-md-3 col-12 text-start" role="group">
                                                <div class="dropdown">
                                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownNumberButton"
                                                        data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"> {{page_num}} </button>
                                                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNumberButton" style="min-width:50px;" >
                                                        <li><a class="dropdown-item" :class="{active: page_num == 10}" href="#" @click="page(tdata.active_page, 10, $event)">10</a></li>
                                                        <li><a class="dropdown-item" :class="{active: page_num == 20}" href="#" @click="page(tdata.active_page, 20, $event)">20</a></li>
                                                        <li><a class="dropdown-item" :class="{active: page_num == 50}" href="#" @click="page(tdata.active_page, 50, $event)">50</a></li>
                                                        <li><a class="dropdown-item" :class="{active: page_num == 100}" href="#" @click="page(tdata.active_page, 100, $event)">100</a></li>
                                                    </ul>
                                                    Total {{ tdata.total_article }} articles
                                                </div>
                                            </div>
                                            <div class="col-md-6 col-12">
                                                <ul class="pagination justify-content-center mb-0">

                                                    <li class="page-item" :class="{disabled : tdata.previous_page == 0}" >
                                                        <a class="page-link text-center mx-1 px-3" aria-label="Previous"
                                                           :style="{color:previous_text_color}"
                                                           href="#" @click="page(tdata.previous_page, page_num, $event)"> &Lang;&Lang; </a>
                                                    </li>

                                                    <li v-for="p in tdata.page_list" :class="['page-item', { active: tdata.active_page === p }]">
                                                        <a class="page-link" href="#" @click="page(p, page_num, $event)">{{ p }}</a>
                                                    </li>

                                                    <li class="page-item" :class="{disabled : tdata.next_page == 0}">
                                                        <a class="page-link text-center mx-1 px-3" aria-label="Next"
                                                           :style="{color:next_text_color}"
                                                            href="#"  @click="page(tdata.next_page, page_num, $event)"> &Rang;&Rang; </a>
                                                        </a>
                                                    </li>

                                                </ul>
                                            </div>
                                            <div class="col-md-3 col-12 text-end">
                                                <form name="documentForm" method="get"></form>
                                            </div>
                                        </div>

                                    </td>
                                </tr>
                            </tfoot>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
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
            page_num : 10,
            active_page: 1,
            showProgressModal : false,
            executionItemFormModal:false,

            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        this.page(this.tdata.active_page, this.page_num );
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
        viewBudgetExecutionItem(item){
            // execution_item_id 를 인자로 사용할 경우 서버에서 data 조회함.
            this.selected_item = item;
            this.executionItemFormModal = true;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetExecutionResultList',
                { params:{ div_name : vm.$props.div_name,
                           year : vm.$props.year,
                           month: vm.$props.month,
                           org_id_list : vm.$props.org_id_list,
                           acc_id_list : vm.$props.acc_id_list,
                           exception_acc_id_list : vm.$props.exception_acc_id_list,
                           search_condition : vm.$props.search_condition,
                           active_page: num, page_num: page_num,
                           }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async refreshPage(){
            await this.page(this.tdata.active_page, this.page_num );
        },
        searchData(){
            this.page(this.tdata.active_page, this.page_num );
        },
    },
    computed:{
        previous_text_color(){
            if( this.tdata.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.tdata.next_page == 0 )
                return "#ddd";
        },
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
