<template>

    <div class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">조정</b><b v-else>Adjustment</b>
                <b v-if="lang=='kr'" class="ms-2">(이월)</b><b v-else class="ms-2">(Carry)</b>
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
            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm py-1" style="width:80px;" @click="refreshPage">Search</button>
            </div>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center">PK</th>
                <th class="py-1 text-center">Type</th>
                <th class="py-1 text-center">Organization</th>
                <th class="py-1 text-center">Account</th>
                <th class="py-1 text-center">Carry Month</th>
                <th class="py-1 text-center">Apply Month</th>
                <th class="py-1 text-center">Carry Cost</th>
                <th class="py-1 text-center">Creator</th>
                <th class="py-1 text-center">Create Date</th>
            </tr>
            </thead>
            <tbody v-for="item in tdata.itemList">
                <tr class="bg-opacity-25" :class="{'bg-warning': selected_item == item}">
                    <td class="text-center">{{item.id}}</td>
                    <td class="text-center">{{item.item_type}}</td>
                    <td class="text-start text-nowrap">{{ item.org_name }}</td>
                    <td class="text-start text-primary text-nowrap">{{ item.account_name }}</td>
                    <td v-if="item.item_type=='To'" class="text-center text-nowrap">
                        ( {{item.account_year}} )
                        <span v-if="item.account_month < 10">0</span>{{ item.account_month -1 }}
                        <i class="bi bi-arrow-right-short"></i>
                        <span v-if="item.account_month < 10">0</span>{{ item.account_month }}
                    </td>
                    <td v-if="item.item_type=='From'" class="text-center text-nowrap">
                        ( {{item.account_year}} )
                        <span v-if="item.account_month < 10">0</span>{{ item.account_month }}
                        <i class="bi bi-arrow-right-short"></i>
                        <span v-if="item.account_month < 10">0</span>{{ item.account_month +1 }}
                    </td>
                    <td class="text-center text-nowrap">
                        {{item.account_year}}-<span v-if="item.account_month < 10">0</span>{{ item.account_month }}
                    </td>
                    <td class="text-end text-nowrap" :class="{'text-danger':item.account_carry < 0}">
                        {{ markedCost(item.account_carry) }}
                    </td>
                    <td class="text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-center text-nowrap">{{ item.create_date }}</td>
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
                                <button v-if="this.$props.acl >= 7" type="button" class="btn btn-primary shadow-sm"
                                        style="width:100px;" @click="newCarryItem">Make Carry</button>
                            </div>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
        <input type="hidden" v-model="totalSelectedCost">
    </div>

    <!-- Detail Form Modal -->
    <div v-if="mode == 'new' || mode =='modify' || mode =='view'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="lang=='kr'" class="col">예산 이월</h4><h4 v-else class="col">Budget Carry Over</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='list'"></button>
                </div>
                <div id="carryFormId" class="modal-body" style="min-height:100px;">
                    <div class="hstack border-bottom border-primary">
                        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                            <b v-if="this.$props.lang=='kr'">이월</b><b v-else>Carry over</b>
                        </div>
                    </div>

                    <div class="col m-0">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Account</b></label>
                            <input class="form-control bg-white" type="text" disabled v-model="edit_item.account_name">
                        </div>
                    </div>

                    <div class="hstack">
                        <div class="col me-1">
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:100px;"><b>From</b></label>
                                <select v-model="edit_item.from_month" class="form-select"
                                        style="padding:0.1em 0.5em;" name="From Month" required>
                                    <option v-for="n in (12)" :value="n">{{n}}</option>
                                </select>
                            </div>
                        </div>
                        <div class="col ms-1">
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:100px;"><b>To</b></label>
                                <select v-model="edit_item.to_month" class="form-select"
                                        style="padding:0.1em 0.5em;" name="To Month" required>
                                    <option value="next">
                                        <span v-if="lang=='kr'">다음 달</span>
                                        <span v-else>Next Month</span>
                                    </option>
                                    <option value="extinct">
                                        <span v-if="lang=='kr'">소멸</span>
                                        <span v-else>Extinct</span>
                                    </option>
                                </select>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <iftag v-if="this.$props.acl >= 7">
                            <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="submitFormModal">(Re)Generate</div>
                            <div v-if="mode == 'new'" class="btn btn-danger me-4" style="width:100px;"
                                 @click="deleteFormModal">Clear All</div>
                            <div class="btn btn-secondary" style="width:100px;"
                             @click="mode='list'">Close</div>
                        </iftag>
                        <div v-else class="btn btn-secondary" style="width:100px;"
                             @click="mode='list'">Close</div>
                    </div>
                </div>
            </div>
        </div>
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
        'budget-carry-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetCarryItemComponent.vue', vueLoaderOptions) ),
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
            target_column: this.$props.target_column,
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
            carryItemDetailModal:false,
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
        newCarryItem(){
            this.mode = "new";
            this.showFormModal = "show";
            this.edit_item = {};
            this.edit_item.year = this.parent_org_item.year;
            this.edit_item.div_name = this.parent_org_item.div_name;
            this.edit_item.from_month = this.start_month;
            this.edit_item.to_month = "next";
            this.edit_item.au_code = this.parent_org_item.au_code;
            this.edit_item.account_name = this.parent_acc_item.account_name;
            this.edit_item.account_id = this.parent_acc_item.id;
            this.edit_item.account_code = this.parent_acc_item.account_code;
        },
        viewCarryItem(item){
            this.mode = "view";
            this.selected_item = item;
            this.edit_item = JSON.parse(JSON.stringify(item));
        },
        modifyCarryItem(event){
            if(event) event.preventDefault();
            this.mode = "modify";
        },
        cancelFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
            this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#carryFormId")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;
            if(this.edit_item.from_month == 12 && this.edit_item.to_month == "next"){
                warningModal.show_modal("Do not carry out to next year.");
                return true;
            }

            this.showProgressModal = "show";
            var vm = this;
            vm.edit_item.include_child_organization = vm.checkChildOrganization;
            vm.edit_item.include_child_account = vm.checkChildAccount;
            await axios.put('./api/budgetCarryList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                vm.edit_item )
                .then(function(res){ vm.mode = "list";  })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        async deleteFormModal(event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.delete('./api/budgetCarryList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                { params:{ include_child_organization: vm.checkChildOrganization,
                           include_child_account: vm.checkChildAccount,
                           from_month : vm.edit_item.from_month,
                           to_month : vm.edit_item.to_month
                          }
                } )
                .then(function(res){ vm.mode = "list"; })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/budgetCarryList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                { params:{ active_page: num, page_num: page_num,
                           start_month: vm.startMonth,
                           end_month: vm.endMonth,
                           include_child_organization: vm.checkChildOrganization,
                           include_child_account: vm.checkChildAccount,
                           search_creator : vm.search_creator
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
