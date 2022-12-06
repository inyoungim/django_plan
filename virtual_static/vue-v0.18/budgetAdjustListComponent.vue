<template>

    <div class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">조정</b><b v-else>Adjustment</b>
                <span v-if="this.$props.target_column.includes('add')">
                    <b v-if="lang=='kr'" class="ms-2">(추가)</b><b v-else class="ms-2">(Add)</b>
                </span>
                <span v-if="this.$props.target_column.includes('transfer')">
                    <b v-if="lang=='kr'" class="ms-2">(전용)</b><b v-else class="ms-2">(Transfer)</b>
                </span>
            </div>
        </div>
    </div>

    <div class="border-bottom border-primary py-1">
        <div class="hstack">
            <div class="col-auto">
                <div class="input-group">
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
                    <span class="input-group-text py-1" style="width:70px;">Creator</span>
                    <input class="form-control shadow-sm py-1" placeholder="User Name" v-model="search_creator" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:70px;">Status</span>
                    <div class="form-control p-0" style="width:150px; padding:0.1em 0.5em;">
                        <select v-model="search_status" class="form-select border-0" style="padding:0.1em 0.5em;" @change="searchData">
                            <option value="">All</option>
                            <option value="Saved">Saved (+Rejected)</option>
                            <option value="In Progress">In Progress</option>
                            <option value="Approved">Approved</option>
                        </select>
                    </div>
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
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center">PK</th>
                <th class="py-1 text-center" style="min-width:200px;">Title</th>
                <th class="py-1 text-start text-nowrap">
                    Organization
                    <label class="ps-1" style="cursor:pointer" @click="toggle_id1 = !toggle_id1">
                        <i v-if="toggle_id1" class="bi bi-tag-fill text-danger"></i>
                        <i v-else class="bi bi-tag"></i>
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
                <th class="py-1 text-center text-nowrap">Add</th>
                <th class="py-1 text-center text-nowrap">Transfer</th>
                <th class="py-1 text-center text-nowrap">Status</th>
            </tr>
            </thead>
            <tbody v-for="item in tdata.itemList">
                <tr v-if="item.from_account_id"
                    class="bg-opacity-25" :class="{'bg-warning': selected_item == item}">
                    <td v-if="item.account_id" rowspan=2 class="text-center align-middle">{{item.parent}}-{{item.id}}</td>
                    <td v-else class="text-center">{{item.parent}}-{{item.id}}</td>
                    <td v-if="item.account_id" rowspan=2 class="text-start align-middle text-primary text-nowrap" style="min-width:200px;">
                        <span style="cursor:pointer" @click="viewDocument(item.parent)">{{ item.title }}</span>
                    </td>
                    <td v-else class="text-start text-primary text-nowrap" style="min-width:200px;">
                        <span style="cursor:pointer" @click="viewDocument(item.parent)">{{ item.title }}</span>
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="toggle_id1" class="text-danger">[{{ item.from_org_id }}]</span>
                        {{ item.from_org_name }}
                    </td>
                    <td class="text-start text-primary text-nowrap">
                        <span v-if="toggle_id2" class="text-danger">[{{ item.from_account_id }}]</span>
                        <span v-if="toggle_code2" class="text-danger"><{{ item.from_account_code }}></span>
                        <span style="cursor:pointer" @click="viewBudgetAdjustItem(item)">
                            <span v-if="viewPath">{{ item.from_account_path }}</span>
                            <span v-else>{{ item.from_account_name }}</span>
                        </span>
                    </td>
                    <td class="text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-center text-nowrap">{{ item.create_date }}</td>
                    <td class="text-center text-nowrap">{{ item.from_project_code }}</td>
                    <td class="text-end text-nowrap">{{ markedCost(item.from_account_add) }}</td>
                    <td class="text-end text-nowrap">{{ markedCost(item.from_account_transfer) }}</td>
                    <td v-if="item.account_id" rowspan=2 class="text-center align-middle">{{ item.status }}</td>
                    <td v-else class="text-center">{{ item.status }}</td>
                </tr>
                <tr v-if="item.account_id"
                    class="bg-opacity-25" :class="{'bg-warning': selected_item == item}">
                    <td v-if="!item.from_account_id" class="text-center">{{item.parent}}-{{item.id}}</td>
                    <td v-if="!item.from_account_id" class="text-start text-primary text-nowrap" style="min-width:200px;">
                        <span style="cursor:pointer" @click="viewDocument(item.parent)">{{ item.title }}</span>
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="toggle_id1" class="text-danger">[{{ item.org_id }}]</span>
                        {{ item.org_name }}
                    </td>
                    <td class="text-start text-primary text-nowrap">
                        <span v-if="toggle_id2" class="text-danger">[{{ item.account_id }}]</span>
                        <span v-if="toggle_code2" class="text-danger"><{{ item.account_code }}></span>
                        <span style="cursor:pointer" @click="viewBudgetAdjustItem(item)">
                            <span v-if="viewPath">{{ item.account_path }}</span>
                            <span v-else>{{ item.account_name }}</span>
                        </span>
                    </td>
                    <td class="text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-center text-nowrap">{{ item.create_date }}</td>
                    <td class="text-center text-nowrap">{{ item.project_code }}</td>
                    <td class="text-end text-nowrap">{{ markedCost(item.account_add) }}</td>
                    <td class="text-end text-nowrap">{{ markedCost(item.account_transfer) }}</td>
                    <td v-if="!item.from_account_id" rowspan=2 class="text-center">{{ item.status }}</td>
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
                                    <input type="hidden" name="budget_mode" value="Adjustment">
                                </form>
                                <form name="documentForm" method="get"></form>
                            </div>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
        <input type="hidden" v-model="totalSelectedCost">
    </div>

    <div v-if="contentsModal">
        <div class="vue_modal" style="z-index: 9991;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <button class="btn px-2 py-0" @click="popupWindow">
                            <i class="btn bi bi-layers text-white py-0" style="cursor:pointer"></i>
                        </button>

                        <h4 class="col">Budget Execution</h4>

                        <button type="button" class="btn-close btn-close-white" @click="contentsModal=false"></button>
                    </div>

                    <budget-contents-component
                            ref="budgetContentsComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :div_name="parent_org_item.div_name"
                            :acl="this.$props.acl"
                            :doc_id="doc_id"
                            :preset_orgid="this.$props.preset_orgid"
                            :budget_mode="'Adjustment'"
                            @update-document-id="updateDocId"
                            @close-modal="contentsModal=false">
                    </budget-contents-component>

                </div>
            </div>
        </div>
    </div>

    <div v-if="adjustItemDetailModal">
        <budget-adjust-item-component
            ref="budgetAdjustItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :execution_item_id="selected_item.id"
            @close-adjust-result-modal="closeAdjustItemModal">
        </budget-adjust-item-component>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal == 'show'" class="vue_modal" style="z-index: 9995;">
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
             'search_status','target_column'],
    components: {
        'budget-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetContentsComponent.vue', vueLoaderOptions) ),
        'budget-adjust-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetAdjustItemComponent.vue', vueLoaderOptions) ),
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
            search_status: '',
            target_column: this.$props.target_column,
            search_text:'',
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            edit_item : {},
            showFormModal : "",
            showProgressModal : "",
            checked_ids:[],
            checked_all:false,
            adjustItemDetailModal:false,

            contentsModal : false,
            doc_id : 0,
            toggle_id1 : false,
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
        viewBudgetAdjustItem(item){
            this.selected_item = item;
            this.adjustItemDetailModal = true;
        },
        closeAdjustItemModal(){
            this.adjustItemDetailModal = false;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/budgetAdjustList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                { params:{ active_page: num, page_num: page_num,
                           start_month: vm.startMonth,
                           end_month: vm.endMonth,
                           include_child_organization: vm.checkChildOrganization,
                           include_child_account: vm.checkChildAccount,
                           search_type : vm.target_column,
                           search_creator : vm.search_creator,
                           search_status : vm.search_status,
                           search_text : vm.search_text, } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
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
