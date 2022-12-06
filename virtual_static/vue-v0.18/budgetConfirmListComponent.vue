<template>

    <div class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">확정</b><b v-else>Confirm</b>
            </div>
        </div>
    </div>

    <div class="border-bottom border-primary py-1">
        <div class="hstack">
            <div class="col-auto">
                <div class="input-group me-2">
                    <span class="input-group-text py-1" style="min-width:100px; padding:0.1em 0.5em;">AU Code</span>
                    <span class="input-group-text bg-white py-1" style="min-width:150px; padding:0.1em 0.5em;">
                        {{parent_org_item.au_code}}
                    </span>
                </div>
            </div>
            <div class="col-auto me-auto">
                <div class="input-group">
                    <span class="input-group-text py-1" style="min-width:100px; padding:0.1em 0.5em;">Account Name</span>
                    <span class="input-group-text bg-white py-1" style="min-width:150px; padding:0.1em 0.5em;">
                        {{parent_acc_item.account_name}}
                    </span>
                </div>
            </div>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center">Account (has value)</th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">1월</span><span v-else>Jan.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">2월</span><span v-else>Feb.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">3월</span><span v-else>Mar.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">4월</span><span v-else>Apr.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">5월</span><span v-else>May.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">6월</span><span v-else>Jun.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">7월</span><span v-else>Jul.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">8월</span><span v-else>Aug.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">9월</span><span v-else>Sep.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">10월</span><span v-else>Oct.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">11월</span><span v-else>Nov.</span></th>
                <th class="py-1 text-center" style="width:7%"><span v-if="this.$props.lang == 'kr'">12월</span><span v-else>Dec.</span></th>
            </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item in tdata.itemList" class="bg-opacity-25" :class="{'bg-warning': selected_item.id == item.id}">
                    <td v-if="this.$props.acl >= 7" class="text-start text-primary text-nowrap"
                    style="cursor:pointer" @click="viewConfirmItem(item)">{{ item.account_name }}</td>
                    <td v-else class="text-start text-nowrap">{{ item.account_name }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_1m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_2m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_3m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_4m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_5m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_6m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_7m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_8m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_9m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_10m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_11m }}</td>
                    <td class="text-center text-nowrap">{{ item.confirm_12m }}</td>
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
                                <button v-if="this.$props.acl >= 7"
                                        type="button" class="btn btn-primary shadow-sm" style="width:100px;" @click="newConfirmItem">Add</button>
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
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="lang=='kr'" class="col">예산 변동율 설정</h4><h4 v-else class="col">Budget Flexible Rate</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='list'"></button>
                </div>

                <div id="confirmFormId" class="modal-body" style="min-height:100px;">
                    <div class="hstack border-bottom border-primary">
                        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                            <b>Target Account</b>
                        </div>
                        <div v-if="mode == 'new'" class="col-auto ms-auto">
                            <button class="btn btn-primary me-2" style="min-width:80px;padding:0.1em 0.5em;"
                                    @click="addTargetAccount">Add</button>
                            <button class="btn btn-danger" style="min-width:80px;padding:0.1em 0.5em;"
                                    @click="deleteTargetAccount">Delete</button>
                        </div>
                    </div>
                    <div v-if="mode == 'new'" class="hstack">
                        <table class="table table-hover table-bordered m-0">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center">PK</th>
                                    <th class="py-1 text-center">Account Path</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="acc in edit_item.account_list" class="bg-opacity-25"
                                    style="cursor:pointer"
                                    :class="{'bg-warning': selected_account == acc}" @click="selected_account = acc">
                                    <td class="py-1 text-center text-nowrap">{{acc.account_id}}</td>
                                    <td class="py-1 text-start text-nowrap">{{acc.account_path}}</td>
                                </tr>
                            </tbody>
                        </table>
                    </div>
                    <div v-else class="hstack">
                        <div class="col">
                            <label class="input-group-text">{{ edit_item.account_name }}</label>
                        </div>
                    </div>

                    <div class="hstack border-bottom border-primary mt-3">
                        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                            <b>Monthly Rate (%)</b>
                        </div>
                    </div>
                    <div class="hstack border">
                        <div class="col-3 vstack align-top m-1">
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>1월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="1월" v-model="edit_item.confirm_1m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Jan.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Jan." v-model="edit_item.confirm_1m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>2월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="2월" v-model="edit_item.confirm_2m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Feb.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Feb." v-model="edit_item.confirm_2m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>3월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="3월" v-model="edit_item.confirm_3m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Mar.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Mar." v-model="edit_item.confirm_3m" required>
                            </div>
                        </div>
                        <div class="col-3 vstack align-top m-1">
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>4월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="4월" v-model="edit_item.confirm_4m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Apr.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Apr." v-model="edit_item.confirm_4m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>5월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="5월" v-model="edit_item.confirm_5m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>May.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="May." v-model="edit_item.confirm_5m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>6월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="6월" v-model="edit_item.confirm_6m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Jun.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Jun." v-model="edit_item.confirm_6m" required>
                            </div>
                        </div>

                        <div class="col-3 vstack align-top m-1">
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>7월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="7월" v-model="edit_item.confirm_7m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Jul.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Jul." v-model="edit_item.confirm_7m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>8월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="8월" v-model="edit_item.confirm_8m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Aug.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Aug." v-model="edit_item.confirm_8m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>9월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="9월" v-model="edit_item.confirm_9m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Sep.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Sep." v-model="edit_item.confirm_9m" required>
                            </div>
                        </div>
                        <div class="col-3 vstack align-top m-1">
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>10월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="10월" v-model="edit_item.confirm_10m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Oct.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Oct." v-model="edit_item.confirm_10m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>11월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="11월" v-model="edit_item.confirm_11m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Nov.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Nov." v-model="edit_item.confirm_11m" required>
                            </div>
                            <div v-if="this.$props.lang == 'kr'" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>12월</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="12월" v-model="edit_item.confirm_12m" required>
                            </div>
                            <div v-else class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;"><b>Dec.</b></label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Dec." v-model="edit_item.confirm_12m" required>
                            </div>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <iftag v-if="this.$props.pmode =='execution' && this.$props.acl >= 5">
                            <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="submitFormModal">Submit</div>
                            <div v-if="mode == 'view'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="modifyConfirmItem">Modify</div>
                            <div v-if="mode == 'view'" class="btn btn-danger me-4" style="width:100px;"
                                 @click="deleteFormModal">Delete</div>

                            <div v-if="mode == 'modify'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="updateFormModal">Update</div>
                            <div v-if="mode == 'modify'" class="btn btn-secondary" style="width:100px;"
                                 @click="cancelFormModal">Cancel</div>
                            <div v-else class="btn btn-secondary" style="width:100px;"
                             @click="mode='list'">Close</div>
                        </iftag>
                        <div v-else class="btn btn-secondary" style="width:100px;"
                             @click="mode='list'">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Account</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="showSearchListModal=false"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack">
                        <div class="col vstack align-top mx-1" style="min-height:20px;">
                            <account-list-component ref="accountListComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.parent_org_item.div_name"
                                @select-item="setAccount"
                                @dblclick-item="selectSearchModal"></account-list-component>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectSearchModal">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="showSearchListModal=false">Cancel</div>
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
             'parent_org_item','parent_acc_item','start_month','end_month','check_child_organization'],
    components: {
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            parent_org_item : this.$props.parent_org_item,
            parent_acc_item : this.$props.parent_acc_item,
            startMonth : this.$props.start_month,
            endMonth : this.$props.end_month,
            checkChildOrganization : this.$props.check_child_organization,
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            edit_item : {},
            showProgressModal : "",
            accountItem : {},
            selected_account : {},
            showSearchListModal : false,
        }
    },
    mounted(){
        this.page(this.tdata.active_page, this.page_num );
    },
    methods: {
        // emit of accountListComponent
        setAccount(item){
            this.accountItem = item;
        },
        async selectSearchModal(){
            var new_account = {};
            new_account.account_id = this.accountItem.id;
            new_account.account_code = this.accountItem.account_code;
            new_account.account_name = this.accountItem.account_name;
            new_account.account_path = this.accountItem.account_path;

            // 동일한 계정이 존재하면 skip
            for(var i=0; i<this.edit_item.account_list.length; i++){
                if(this.edit_item.account_list[i].account_id == new_account.account_id){
                    warningModal.show_modal("This account is already exists.");
                    return;
                }
            }
            this.edit_item.account_list.push(new_account);
            // this.showSearchListModal = false;
        },

        newConfirmItem(){
            this.mode = "new";
            this.showFormModal = "show";
            this.edit_item = {};
            this.edit_item.year = this.parent_org_item.year;
            this.edit_item.div_name = this.parent_org_item.div_name;
            this.edit_item.au_code = this.parent_org_item.au_code;
            this.edit_item.confirm_1m = 100;
            this.edit_item.confirm_2m = 100;
            this.edit_item.confirm_3m = 100;
            this.edit_item.confirm_4m = 100;
            this.edit_item.confirm_5m = 100;
            this.edit_item.confirm_6m = 100;
            this.edit_item.confirm_7m = 100;
            this.edit_item.confirm_8m = 100;
            this.edit_item.confirm_9m = 100;
            this.edit_item.confirm_10m = 100;
            this.edit_item.confirm_11m = 100;
            this.edit_item.confirm_12m = 100;

            var init_account = {};
            init_account.account_id = this.parent_acc_item.id;
            init_account.account_code = this.parent_acc_item.account_code;
            init_account.account_name = this.parent_acc_item.account_name;
            init_account.account_path = this.parent_acc_item.account_path;
            this.edit_item.account_list = [];
            this.edit_item.account_list.push(init_account);
        },
        viewConfirmItem(item){
            this.mode = "view";
            this.selected_item = item;
            this.edit_item = JSON.parse(JSON.stringify(item));
        },
        modifyConfirmItem(event){
            if(event) event.preventDefault();
            this.mode = "modify";
        },
        cancelFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
            this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#confirmFormId")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }

            // number check
            var numberElements = document.querySelectorAll("#confirmFormId")[0].querySelectorAll("input.number");
            for (var i = 0; i < numberElements.length; i++) {
                var e = numberElements[i];
                if(isNaN(e.value)){
                    warningModal.show_modal("Please input number in [ "+ e.name +" ] field not string.");
                    return true;
                }
            }
        },
        async submitFormModal(event){
            if(event) event.preventDefault();
            if(this.edit_item.account_list.length == 0){
                warningModal.show_modal("Please add one or more target account.");
                return true;
            }

            this.showProgressModal = "show";
            var vm = this;
            await axios.post('./api/budgetConfirmItem/0', vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            if(this.mode == "list"){
                this.$emit('update-data');
                await this.page(this.active_page, this.page_num);
            }
        },
        async updateFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;

            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/budgetConfirmItem/'+vm.edit_item.id, vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        deleteFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.delete('./api/budgetConfirmItem/'+vm.edit_item.id)
                .then(function(res){
                    vm.selected_item = {};
                    vm.mode = "list";
                })
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
            await axios.get('./api/budgetConfirmList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                { params:{ load_mode:vm.$props.pmode,
                           active_page: num, page_num: page_num } })
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

        addTargetAccount(){
            this.showSearchListModal = true;
        },
        deleteTargetAccount(){
            var tmp_account_list = [];
            if(this.edit_item.account_list){
                for(var i=0; i<this.edit_item.account_list.length; i++){
                    if(this.edit_item.account_list[i] != this.selected_account){
                        tmp_account_list.push(this.edit_item.account_list[i]);
                    }
                }
                this.edit_item.account_list = tmp_account_list;
                this.selected_account = {};
            }
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
    },
}
</script>
