<template>
    <div class="table-responsive">
        <div class="hstack my-1">
            <button v-if="this.$props.acl >= 5" type="button" class="btn btn-darkblue shadow-sm py-1"
                    style="min-width:100px;" @click="newDocument('Execution')">
                <span v-if="lang=='kr'">집행 품의</span><span v-else>New Execution</span>
            </button>
            <button v-if="this.$props.acl >= 5" type="button" class="btn btn-darkblue shadow-sm py-1 ms-2"
                    style="min-width:100px;" @click="newDocument('Adjustment')">
                <span v-if="lang=='kr'">조정 품의</span><span v-else>New Adjustment</span>
            </button>

            <form name="newDocumentForm" method="get">
                <input type="hidden" name="div_name" :value="this.$props.div_name">
                <input type="hidden" name="org_id" :value="org_item.id">
                <input type="hidden" name="budget_mode" value="Execution">
            </form>
            <form name="documentForm" method="get"></form>
        </div>
        <div class="hstack">
            <button class="input-group-text py-1 me-1" @click="expandSearchToggle">
                <i :class="[expandSearch? 'bi bi-dash-square-fill text-secondary' : 'bi bi-plus-square-fill text-primary']" style="cursor:pointer"></i>
            </button>

            <div class="col-auto">
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
                <div class="input-group">
                    <label class="input-group-text py-1">Organization</label>
                    <span class="input-group-text py-1" style="min-width:100px;">{{org_item.org_name}}</span>
                    <div class="form-control text-start input-group p-0">
                        <organization-select-component
                                ref="organizationSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :year="target_year"
                                @select-target="setOrganization">
                        </organization-select-component>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearOrganization"></i>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_child_organization"
                               @change="searchData"> Include Children
                    </div>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group">
                    <label class="input-group-text py-1">Account</label>
                    <span class="input-group-text py-1" style="min-width:100px;">{{account_item.account_name}}</span>
                    <div class="form-control text-start input-group p-0">
                        <account-select-component
                                ref="accountSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                @select-target="setAccount">
                        </account-select-component>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearAccount"></i>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_child_account"
                               @change="searchData"> Include Children
                    </div>
                </div>
            </div>
        </div>

        <div class="hstack gap-1 mt-1">
            <div class="col-auto">
                <div class="hstack">
                    <div class="input-group date me-1" id="start_date" style="width:220px;">
                        <label class="input-group-text py-1">Create Date</label>
                        <input type="text" class="form-control bg-white py-1" aria-describedby="date-range-1"
                               v-model="start_date" name="Start Date" readonly required>
                        <span class="input-group-addon input-group-text py-1" id="date-range-1">
                            <i class="bi bi-calendar-date"></i>
                        </span>
                    </div>
                    ~
                    <div class="input-group date" id="end_date" style="width:130px;">
                        <input type="text" class="form-control bg-white py-1" aria-describedby="date-range-2"
                               v-model="end_date" name="End Date" readonly required>
                        <span class="input-group-addon input-group-text py-1" id="date-range-2">
                            <i class="bi bi-calendar-date"></i>
                        </span>
                    </div>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Title</span>
                    <input class="form-control shadow-sm py-1" placeholder="Search Text" v-model="search_text" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Creator</span>
                    <input class="form-control shadow-sm py-1" placeholder="User Name"
                           v-model="search_creator" @keyup.enter="searchData">
                </div>
            </div>
            <button class="btn btn-primary shadow-sm py-1 ms-auto" style="width:80px;" @click="searchData">Search</button>

        </div>

        <div v-if="expandSearch" class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1">Work Order</span>
                    <input class="form-control shadow-sm py-1" v-model="search_work_order" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">Part Number</span>
                    <input class="form-control shadow-sm py-1" v-model="search_part_no" @keyup.enter="searchData">
                </div>
            </div>
        </div>

        <table class="table table-hover table-bordered mt-2">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center">PK</th>
                <th class="py-1 text-center" style="min-width:200px;">Title</th>
                <th class="py-1 text-center text-nowrap">Total Cost</th>
                <th class="py-1 text-center text-nowrap">Creator</th>
                <th class="py-1 text-center text-nowrap">Organization</th>
                <th class="py-1 text-center text-nowrap">Create Date</th>
                <th class="py-1 text-center text-nowrap">Status</th>
            </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item in tdata.itemList" class="bg-opacity-25"
                    :class="{'bg-warning':selected_item == item}" @click="selected_item=item">
                    <td class="text-center text-primary text-nowrap">
                        <span style="cursor:pointer" @click="viewDocument(item.id)">{{item.id}}</span>
                    </td>
                    <td class="text-start text-primary text-nowrap" style="min-width:200px;">
                        <span style="cursor:pointer" @click="viewDocument(item.id)">{{ item.title }}</span>
                    </td>
                    <td class="text-end">{{ markedCost(item.total_cost) }}</td>
                    <td class="text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_org }}</span><span v-else>{{ item.user_org_en }}</span>
                    </td>
                    <td class="text-center text-nowrap">{{ item.create_date }}</td>
                    <td class="text-center">
                        <span v-if="item.next_app_step == 90">Approved</span>
                        <span v-if="item.next_app_step > 0 && item.next_app_step < 90">In Progress</span>
                        <span v-if="item.next_app_step == 0">{{ item.status }}</span>
                    </td>
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
            :div_name="this.$props.div_name"
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
            :div_name="this.$props.div_name"
            @close-component="massClosingModal=false"
            @update-result="updateResult">
        </budget-mass-closing-component>
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
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month  + '-' + day;

var oneMonthAgo = new Date(today.getFullYear(), today.getMonth() - 1, today.getDate())
var oneMonthAgoYear = oneMonthAgo.getFullYear();
var oneMonthAgoMonth = ('0' + (oneMonthAgo.getMonth() + 1)).slice(-2);
var oneMonthAgoDay = ('0' + oneMonthAgo.getDate()).slice(-2);
var oneMonthAgoString = oneMonthAgoYear + '-' + oneMonthAgoMonth  + '-' + oneMonthAgoDay;

export default {
    props : ['site','lang','pmode','acl','div_name'],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
        'account-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            target_year : year,
            org_item : {},
            account_item : {},
            start_date : oneMonthAgoString,
            end_date : dateString,
            include_child_organization : true,
            include_child_account : true,
            search_creator:'',
            search_status: '',
            search_text:'',
            search_work_order: '',
            search_part_no: '',

            tdata : {},
            selected_item : {},
            page_num : 10,
            edit_item : {},

            showProgressModal : false,
            expandSearch : false,
            doc_id : 0,
            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        var vm = this;
        this.$nextTick(() => {
            $('.input-group.date').datepicker({
                daysOfWeekHighlighted: "0",
                todayHighlight: true,
                autoclose: true,
                language: this.$props.lang,
                orientation: "bottom",
            }).on("changeDate", function(e) {
                var date = e.target.getElementsByTagName('input')[0].value;
                if(e.target.id == "start_date")
                    vm.start_date = date;
                if(e.target.id == "end_date")
                    vm.end_date = date;
            });
        });

        this.page(1, this.page_num );
    },
    watch : {
        div_name(nVal){
            this.page(1, this.page_num );
        }
    },
    methods: {
        // emit function
        setOrganization(item){
            var tem_obj = this.org_item;
            this.org_item = item;
            if(tem_obj.id != item.id)
                this.page(1, this.page_num );
        },
        async setAccount(item){
            var tem_obj = this.account_item;
            this.account_item = item;
            if(tem_obj.id != item.id)
                this.page(1, this.page_num );
        },
        clearOrganization(){
            var tem_obj = this.org_item;
            this.org_item = {};
            if(tem_obj.id != this.org_item.id)
                this.page(1, this.page_num );
        },
        clearAccount(){
            var tem_obj = this.account_item;
            this.account_item = {};
            if(tem_obj.id != this.account_item.id)
                this.page(1, this.page_num );
        },

        expandSearchToggle(){
            this.expandSearch = !this.expandSearch;
            if(!this.expandSearch){
                if(this.search_work_order != '' || this.search_part_no != ''){
                    this.search_work_order = "";
                    this.search_part_no = "";
                    this.searchData();
                }
            }
        },
        newDocument(budget_mode){
            // this.newWindow('1200','750','',"budgetExecutionForm");
            document.newDocumentForm.budget_mode.value = budget_mode;
            document.newDocumentForm.target = "_blank";
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
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetExecutionDocumentList',
                { params:{ active_page: num, page_num: page_num,
                           div_name : vm.$props.div_name,
                           org_id : vm.org_item.id,
                           account_id : vm.account_item.id,
                           start_date: vm.start_date,
                           end_date: vm.end_date,
                           include_child_organization: vm.include_child_organization,
                           include_child_account: vm.include_child_account,
                           search_creator : vm.search_creator,
                           search_status : vm.search_status,
                           search_text : vm.search_text,
                           search_work_order: vm.search_work_order,
                           search_part_no: vm.search_part_no,
                         }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async loadData(org_item, acc_item){
            this.org_item = org_item;
            this.account_item = acc_item;
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
