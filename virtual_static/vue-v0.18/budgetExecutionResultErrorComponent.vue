<template>

    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xxl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Execution Result Error List</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="table-responsive" style="max-height:500px;">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF; position: sticky;top:0;">
                            <tr>
                                <th class="py-1 text-center">No.</th>
                                <th class="py-1 text-center text-nowrap">Closing Date</th>
                                <th class="py-1 text-center text-nowrap">Error Type</th>
                                <th class="py-1 text-center text-nowrap">GERP DATA</th>
                                <th class="py-1 text-center text-nowrap">RND DATA</th>
                                <th class="py-1 text-center text-nowrap">Creator</th>
                                <th class="py-1 text-center" style="min-width:200px;">Title</th>
                                <th class="py-1 text-center text-primary text-nowrap">Action Result</th>
                                <th class="py-1 text-center text-nowrap">Action Date</th>
                                <th class="py-1 text-center text-nowrap">Comments</th>
                            </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="item in tdata.itemList"
                                    class="bg-opacity-25"
                                    :class="{'bg-warning':selected_item == item}" @click="selected_item=item">
                                    <td class="text-center text-nowrap">{{item.parent_id}}-{{item.parent_seq_no}}</td>
                                    <td class="text-center text-nowrap">{{item.error_date}}</td>
                                    <td class="text-center text-nowrap">{{item.error_type}}</td>
                                    <td class="text-center text-nowrap">{{item.gerp_data}}</td>
                                    <td class="text-center text-nowrap">{{item.rnd_data}}</td>
                                    <td class="text-center text-nowrap">
                                        <span v-if="lang=='kr'">{{item.user_name}}</span>
                                        <span v-else>{{item.user_name_en}}</span>
                                    </td>
                                    <td class="text-start text-primary text-nowrap">
                                        <span style="cursor:pointer" @click="viewDocument(item.parent_id)">{{ item.title }}</span>
                                    </td>
                                    <td class="text-center text-primary text-nowrap"
                                        style="cursor:pointer" @click="viewCloseActionModal(item)">{{item.close_status}}</td>
                                    <td class="text-center text-nowrap">{{item.close_date}}</td>
                                    <td class="text-start text-nowrap">{{item.close_comment}}</td>
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

    <!-- closeActionModal -->
    <div v-if="closeActionModal" class="vue_modal" style="z-index: 9990;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <h4 class="col"> Action Result </h4>
                        <button type="button" class="btn-close btn-close btn-close-white" @click="closeActionModal=false"></button>
                    </div>
                    <div class="modal-body" style="min-height:100px;">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Action Result</b></label>
                            <select v-model="action.close_status" class="form-select p-0 pt-1 ps-2">
                                <option value="">Waiting</option>
                                <option value="Complete">Complete</option>
                            </select>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Comments</b></label>
                            <textarea class="form-control bg-white" rows="3" name="Comments"
                                      v-model="action.close_comment" required>
                            </textarea>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <div class="col text-center">
                            <div class="btn btn-primary me-4" style="width:100px;" @click="updateActionModal">Update</div>
                            <div class="btn btn-secondary" style="width:100px;" @click="closeActionModal=false">Close</div>
                        </div>
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
    props : ['site','lang','pmode','acl', 'div_name', 'year','month',
                'org_id_list', 'acc_id_list', 'exception_acc_id_list','include_error_complete'],
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
            closeActionModal : false,
            action : {},

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
            await axios.get('./api/budgetExecutionResultErrorList',
                { params:{ div_name : vm.$props.div_name,
                           year : vm.$props.year,
                           month: vm.$props.month,
                           org_id_list : vm.$props.org_id_list,
                           acc_id_list : vm.$props.acc_id_list,
                           exception_acc_id_list : vm.$props.exception_acc_id_list,
                           include_error_complete : vm.$props.include_error_complete,
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
        viewCloseActionModal(item){
            this.action = { id : item.id , close_status : item.close_status, close_comment : item.close_comment };
            if(!item.close_status)
                this.action.close_status = "";
            this.closeActionModal = true;
        },
        async updateActionModal(){
            this.showProgressModal = true;
            var vm = this;
            var return_data = "";
            await axios.put('./api/budgetExecutionResultErrorList', this.action)
                .then(function(res){
                    return_data = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });

            if(return_data.id){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(this.tdata.itemList[i].id == return_data.id){
                        this.tdata.itemList[i].close_status = return_data.close_status;
                        this.tdata.itemList[i].close_date = return_data.close_date;
                        this.tdata.itemList[i].close_comment = return_data.close_comment;
                    }
                }
            }
            this.showProgressModal = false;
            this.closeActionModal = false;
            this.$emit('update-result');
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
