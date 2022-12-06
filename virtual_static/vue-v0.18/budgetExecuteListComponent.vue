<template>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">집행</b><b v-else>Execution</b>
            </div>

            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;" @click="excelDownload">Excel Download</button>
            </div>
            <div v-if="this.$props.acl >= 7" class="col-auto ms-1">
                <button class="btn btn-darkorange shadow-sm py-1 me-auto" style="min-width:80px;"
                     @click="massClosingModal=true">
                    <i class="bi bi-currency-dollar"></i>
                    <span v-if="lang=='kr'">일괄 실적</span><span v-else>Mass Closing</span>
                </button>
                <button class="btn btn-darkred shadow-sm py-1 ms-1" style="min-width:80px;"
                     @click="virtualExecutionModal=true">
                    <span class="text-white">
                        <span v-if="lang=='kr'">가품의</span><span v-else>Virtual document</span>
                    </span>
                </button>
            </div>
        </div>
    </div>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary py-1">

        <div class="hstack">
            <button class="input-group-text py-1 me-1" @click="expandSearchToggle">
                <i :class="[expandSearch? 'bi bi-dash-square-fill text-secondary' : 'bi bi-plus-square-fill text-primary']" style="cursor:pointer"></i>
            </button>
            <div class="col-auto">
                <div class="input-group">
                    <span v-if="target_column.includes('closing')" class="input-group-text py-1">
                        <div v-if="lang=='kr'">실적일 기준</div><div v-else>Result Date</div>
                    </span>
                    <span v-else class="input-group-text py-1">
                        <div v-if="lang=='kr'">집행일 기준</div><div v-else>Execution Date</div>
                    </span>
                    <span class="input-group-text py-1"> {{parent_org_item.year}} Year</span>
                    <div class="form-control p-0" style="width:85px; padding:0.1em 0.5em;">
                        <select v-model="startMonth" class="form-select border-0" style="padding:0.1em 0.5em;" @change="changeMonth('start')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                    <i class="input-group-text p-0" class="bi bi-dash"></i>
                    <div class="form-control p-0" style="width:60px; padding:0.1em 0.5em;">
                        <select v-model="endMonth" class="form-select border-0" style="padding:0.1em 0.5em;" @change="changeMonth('end')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group">
                    <span class="input-group-text py-1">{{parent_org_item.org_name}}</span>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="checkChildOrganization"
                               @change="refreshPage"> Include Children
                    </div>
                    <span class="input-group-text py-1">{{parent_acc_item.account_name}}</span>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="checkChildAccount"
                               @change="refreshPage"> Include Children
                    </div>
                </div>
            </div>
        </div>

        <div class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span v-if="lang=='kr'" class="input-group-text py-1" style="width:100px;">실적 상태</span>
                    <span v-else class="input-group-text py-1" style="width:100px;">Closing Status</span>
                    <select v-model="result_status" class="form-select py-1" style="width:110px;"
                            disabled @change="searchData">
                        <option value="2">All</option>
                        <option value="0"><span v-if="lang=='kr'">대기</span><span v-else>Waiting</span></option>
                        <option value="1"><span v-if="lang=='kr'">완료</span><span v-else>End Result</span></option>
                    </select>
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Status</span>
                    <select v-model="search_status" class="form-select py-1" style="width:150px;" @change="searchData">
                        <option value="">All</option>
                        <option value="Saved">Saved (+Rejected)</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approved">Approved</option>
                    </select>
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Creator</span>
                    <input class="form-control shadow-sm py-1" placeholder="User Name" v-model="search_creator" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Title</span>
                    <input class="form-control shadow-sm py-1" placeholder="Search Text" v-model="search_text" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm py-1" style="width:80px;" @click="searchData">Search</button>
            </div>
        </div>

        <div v-if="expandSearch" class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1">Estimation Type</span>
                    <select v-model="estimation_key" class="form-select bg-white py-1"
                            style="width:150px;" @change="searchData">
                        <option :value=""></option>
                        <option :value="'__E1'">
                            <span v-if="lang=='kr'">GP 계약/구매</span><span v-else>GP Contract</span>
                        </option>
                        <option :value="'__E2'">
                            <span v-if="lang=='kr'">자체 계약/구매</span><span v-else>Self Contract</span>
                        </option>
                        <option :value="'__E3'">
                            <span v-if="lang=='kr'">서브원</span><span v-else>ServerOne</span>
                        </option>
                        <option :value="'__E4'">
                            <span v-if="lang=='kr'">법인 카드</span><span v-else>Corporate Care</span>
                        </option>
                    </select>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">Execution ID (PK)</span>
                    <input class="form-control shadow-sm py-1" v-model="search_pk" @keyup.enter="searchData">
                </div>
            </div>
        </div>

    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
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
                    class="bg-opacity-25" :class="{'bg-warning': checked_ids.includes(item.id)}"
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
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="100">
                        <div class="hstack mt-3">
                            <div class="col-md-3 col-12" role="group">
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
                                <button v-if="this.$props.acl >= 5" type="button" class="btn btn-primary shadow-sm"
                                        style="width:100px;" @click="newDocument">New</button>

                                <form name="newDocumentForm" method="get">
                                    <input type="hidden" name="div_name" :value="parent_org_item.div_name">
                                    <input type="hidden" name="org_id" :value="parent_org_item.id">
                                    <input type="hidden" name="budget_mode" value="Execution">
                                </form>
                                <form name="documentForm" method="get"></form>

                            </div>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div v-if="executionItemFormModal">
        <budget-execution-item-component
            ref="budgetExecutionItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="parent_org_item.div_name"
            :doc_id="doc_id"
            :accountItem="selected_item"
            :pmode="'load'"
            @close-execution-item-modal="executionItemFormModal=false"
            @update-result="updateResult">
        </budget-execution-item-component>
    </div>

    <div v-if="massClosingModal">
        <budget-mass-closing-component
            ref="budgetMassClosingComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="parent_org_item.div_name"
            @close-component="massClosingModal=false"
            @update-result="updateResult">
        </budget-mass-closing-component>
    </div>

    <div v-if="virtualExecutionModal">
        <budget-virtual-execution-component
            ref="budgetVirtualExecutionComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="parent_org_item.div_name"
            :parent_org_item="parent_org_item"
            :parent_acc_item="parent_acc_item"
            @close-component="virtualExecutionModal=false"
            @update-result="updateResult">
        </budget-virtual-execution-component>
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
    props : ['site','lang','pmode','acl',
             'parent_org_item','parent_acc_item','start_month','end_month','check_child_organization',
             'search_status','result_status','target_column'],
    components: {
        'budget-execution-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionItemComponent.vue', vueLoaderOptions) ),
        'budget-mass-closing-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetMassClosingComponent.vue', vueLoaderOptions) ),
        'budget-virtual-execution-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetVirtualExecutionComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            parent_org_item : this.$props.parent_org_item,
            parent_acc_item : this.$props.parent_acc_item,
            startMonth : this.$props.start_month,
            endMonth : this.$props.end_month,
            checkChildOrganization : this.$props.check_child_organization,
            checkChildAccount : true,
            search_creator:'',
            search_status: this.$props.search_status,
            result_status: this.$props.result_status,
            target_column: this.$props.target_column,
            search_text:'',
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            edit_item : {},
            showFormModal : "",
            showProgressModal : false,
            checked_ids:[],
            checked_all:false,
            executionItemFormModal:false,
            massClosingModal : false,
            virtualExecutionModal : false,
            expandSearch : false,
            estimation_key : "",
            doc_id : 0,
            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        if(this.parent_acc_item == ""){
            this.parent_acc_item = { 'id' : 0};
        }
        this.page(this.tdata.active_page, this.page_num );
    },
    methods: {
        expandSearchToggle(){
            this.expandSearch = !this.expandSearch;
            var tempkey = this.estimation_key;
            if(!this.expandSearch){
                this.estimation_key = "";
            }
            if(tempkey != this.estimation_key){
                this.searchData();
            }
        },

        updateResult(){
            this.$emit('update-data');
            this.refreshPage();
        },
        changeMonth(arg){
            if(arg == "start"){
                if(this.startMonth > this.endMonth)
                    this.endMonth = this.startMonth;
            }else{
                if(this.startMonth > this.endMonth)
                    this.startMonth = this.endMonth;
            }
            this.page(this.tdata.active_page, this.page_num );
        },
        newDocument(){
            this.newWindow('1200','750','',"budgetExecutionForm");
            document.newDocumentForm.target = "budgetExecutionForm";
            document.newDocumentForm.action = "./document/"+this.doc_id;
            document.newDocumentForm.submit();
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
            await axios.get('./api/budgetExecutionList',
                { params:{ div_name : vm.parent_org_item.div_name,
                           org_id : vm.parent_org_item.id,
                           account_id : vm.parent_acc_item.id,
                           active_page: num, page_num: page_num,
                           start_month: vm.startMonth,
                           end_month: vm.endMonth,
                           include_child_organization: vm.checkChildOrganization,
                           include_child_account: vm.checkChildAccount,
                           search_creator : vm.search_creator,
                           search_status : vm.search_status,
                           result_status : vm.result_status,
                           search_text : vm.search_text,
                           period_type : vm.target_column,
                           estimation_key : vm.estimation_key,
                           search_pk : vm.search_pk,} })
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
        async loadData(org_item, acc_item){
            this.parent_org_item = org_item;
            this.parent_acc_item = acc_item;
            await this.page(this.tdata.active_page, this.page_num );
        },
        searchData(){
            this.page(this.tdata.active_page, this.page_num );
        },
        async excelDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{
                    div_name : vm.parent_org_item.div_name,
                    org_id : vm.parent_org_item.id,
                    account_id : vm.parent_acc_item.id,
                    start_month: vm.startMonth,
                    end_month: vm.endMonth,
                    include_child_organization: vm.checkChildOrganization,
                    include_child_account: vm.checkChildAccount,
                    search_creator : vm.search_creator,
                    search_status : vm.search_status,
                    result_status : vm.result_status,
                    search_text : vm.search_text,
                    period_type : vm.target_column,
                    estimation_key : vm.estimation_key,
                    search_pk : vm.search_pk,
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/budgetExecutionExcel', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "execution_list.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/budgetExecutionExcel', null )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        }
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
