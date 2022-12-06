<template>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">계획</b><b v-else>Plan</b>
            </div>
            <div class="col-auto ms-auto">
                <button v-if="this.$props.acl >= 7 && this.$props.pmode == 'execution'"
                        class="btn btn-primary shadow-sm py-1 me-2" style="min-width:80px;"
                        @click="massPlanUploadModal=true">Excel Upload</button>
                <button class="btn btn-secondary shadow-sm py-1" style="min-width:80px;" @click="excelDownload">Excel Download</button>
            </div>
        </div>
    </div>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary py-1">
        <div class="hstack">
            <div class="col-auto me-auto">
                <div class="input-group">
                    <span v-if="this.$props.pmode == 'plan'" class="input-group-text py-1"> {{parent_org_item.year + 1}} Year</span>
                    <span v-else class="input-group-text py-1"> {{parent_org_item.year}} Year</span>
                    <div class="form-control p-0" style="width:60px; padding:0.1em 0.5em;">
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
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:60px;">Creator</span>
                    <input class="form-control shadow-sm py-1" placeholder="Search Text" v-model="search_text" @keyup.enter="searchData">
                    <button class="btn btn-primary shadow-sm py-1" style="width:60px;" @click="searchData">Search</button>
                </div>
            </div>
        </div>
    </div>

    <div class="table-responsive">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th v-if="this.$props.acl >= 7" class="py-1 text-center">
                    <input class="form-check-input" type="checkbox"
                           :class="{'bg-secondary':checkNotMatch}" v-model="checked_all" @click="checkAll">
                </th>
                <th class="py-1 text-center">PK</th>
                <th v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'"
                    class="py-1 text-center text-nowrap">
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
                <th class="py-1 text-center text-nowrap">Model Name</th>
                <th class="py-1 text-center">Month</th>
                <th v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="py-1 text-center text-nowrap">Unit Cost</th>
                <th v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="py-1 text-center">Count</th>
                <th v-if="this.$props.pmode != 'budgetPlan'" class="py-1 text-center text-nowrap">Total Cost</th>
                <th v-else class="py-1 text-center text-nowrap">Remain Cost</th>
                <th class="py-1 text-center" style="width:30%;">Description</th>
                <th class="py-1 text-center">
                    <i v-if="!fullView" class="bi bi-plus-square-fill text-primary"
                       style="cursor:pointer" @click="fullView=!fullView"></i>
                    <i v-else class="bi bi-dash-square-fill text-secondary"
                       style="cursor:pointer" @click="fullView=!fullView"></i>
                </th>
                <th v-if="fullView"
                    v-for="opt in tdata.plan_option_column_list"
                    class="py-1 text-center text-nowrap">
                    <b>{{opt.column_name}}</b>
                </th>
                <th v-if="fullView" class="py-1 text-center text-nowrap">Trip Location</th>
                <th v-if="fullView" class="py-1 text-center text-nowrap">Number of people</th>
                <th v-if="fullView" class="py-1 text-center text-nowrap">Nights & Days</th>
            </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item in tdata.itemList" class="bg-opacity-25" :class="{'bg-warning': checked_ids.includes(item.id)}"
                    style="cursor:pointer">
                    <td v-if="this.$props.acl >= 7" class="text-center">
                        <input type="checkbox" v-model="checked_ids" :value="item.id">
                    </td>
                    <td class="text-center text-nowrap">{{ item.id }}</td>
                    <td v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'"
                        class="text-start text-nowrap">
                        <span v-if="toggle_id1" class="text-danger">[{{ item.org_id }}]</span>
                        <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                        {{ item.org_name }}
                    </td>
                    <td class="text-start text-primary text-nowrap">
                        <span v-if="toggle_id2" class="text-danger">[{{ item.account_id }}]</span>
                        <span v-if="toggle_code2" class="text-danger"><{{ item.account_code }}></span>
                        <span style="cursor:pointer" @click="viewBudgetItem(item)">
                            <span v-if="viewPath">{{ item.account_path }}</span>
                            <span v-else>{{ item.account_name }}</span>
                        </span>
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-start text-nowrap">{{ item.model_name }}</td>
                    <td class="text-end">{{ item.month }}</td>
                    <td v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="text-end">
                        {{ markedCost(item.unit_cost) }}
                    </td>
                    <td v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="text-end">
                        {{ item.unit_count }}
                    </td>
                    <td v-if="this.$props.pmode == 'budgetPlan'" class="text-end">{{ markedCost(item.total_cost-item.transfer_cost) }}</td>
                    <td v-else class="text-end">{{ markedCost(item.total_cost) }}</td>
                    <td class="text-start" style="min-width:300px;"><span v-html="item.description"></span></td>
                    <td class="py-1 text-center text-nowrap">
                        <i class="bi bi-card-list" style="cursor:pointer" @click="viewBudgetItem(item)"></i>
                    </td>
                    <td v-if="fullView && item.plan_option_column_list.length > 0"
                        v-for="opt in item.plan_option_column_list" class="py-1 text-center text-nowrap">
                        {{ opt }}
                    </td>
                    <td v-else-if="fullView"
                        v-for="opt in tdata.plan_option_column_list" class="py-1 text-center text-nowrap">
                    </td>
                    <td v-if="fullView" class="py-1 text-center text-nowrap">
                        <span v-if="item.plan_biz_data">{{ item.plan_biz_data.trip_location }}</span>
                    </td>
                    <td v-if="fullView" class="py-1 text-center text-nowrap">
                        <span v-if="item.plan_biz_data">{{ item.plan_biz_data.number_of_people }}</span>
                    </td>
                    <td v-if="fullView" class="py-1 text-center text-nowrap">
                        <span v-if="item.plan_biz_data">
                            {{ item.plan_biz_data.nights }} Nights {{ item.plan_biz_data.days }} Days
                        </span>
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
                                        <li><a class="dropdown-item" :class="{active: page_num == 1000}" href="#" @click="page(tdata.active_page, 1000, $event)">1000</a></li>
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
                                <button v-if="this.$props.acl >= 5 && this.$props.pmode == 'plan' && tdata.allow_modify"
                                        :class="{'btn-secondary' : parent_acc_item.rght - parent_acc_item.lft > 1}"
                                        type="button" class="btn btn-primary shadow-sm" style="width:100px;" @click="newPlanItem">New</button>
                                <button v-if="this.$props.acl >= 7 && this.$props.pmode == 'execution'"
                                        type="button" class="btn btn-danger shadow-sm"
                                        style="width:100px;" @click="deletePlanItem">Delete</button>
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
        <div v-if="switchData == 'basic'" class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
             :class="{'modal-lg':edit_item.business_trip_enable || account_plan_option_enable}">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Budget Plan</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='list'"></button>
                </div>
                <div id="planFormId" class="modal-body" style="min-height:100px;">
                    <div class="row text-start">
                        <div class="col-6 vstack align-top p-1">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1" style="cursor:pointer"
                                     :class="[switchData == 'basic' ? 'bg-primary ':'bg-white text-black-50']" @click="changeSwitchData('basic')">
                                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'basic' ? 'text-danger':'text-black-50']"></i>
                                    <b class="me-3">Basic Information</b>
                                </div>
                                <div v-if="mode != 'new' && mode != 'modify'" class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1" style="cursor:pointer"
                                     :class="[switchData == 'history' ? 'bg-primary ':'bg-white text-black-50']" @click="changeSwitchData('history')">
                                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'history' ? 'text-danger':'text-black-50']"></i>
                                    <b class="me-3">History Information</b>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Organization</b>
                                </label>
                                <label class="form-control">{{edit_item.org_name}} ({{edit_item.org_id}})</label>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Account</b>
                                </label>
                                <label class="form-control">{{edit_item.account_name}} ({{edit_item.account_code}})</label>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Model Name</b>
                                </label>
                                <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                       name="Model Name" v-model="edit_item.model_name" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Month</b>
                                </label>
                                <select class="form-select form-control text-start bg-white"
                                        :disabled="mode == 'view'" name="Month" v-model="edit_item.month" required>
                                    <option v-for="i in 12" :value="i">{{i}}</option>
                                </select>
                            </div>
                            <div v-if="!edit_item.business_trip_enable" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Unit Cost</b>
                                </label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Unit Cost" v-model="edit_item.unit_cost" required>
                            </div>
                            <div v-if="!edit_item.business_trip_enable" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Quantity</b>
                                </label>
                                <input class="form-control bg-white number" type="text" :disabled="mode == 'view'"
                                       name="Quantity" v-model="edit_item.unit_count" required>
                            </div>
                            <div v-if="!edit_item.business_trip_enable" class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <b>Total Cost</b>
                                </label>
                                <input class="form-control bg-warning number bg-opacity-25" type="text" disabled
                                       name="Total Cost" v-model="cal_totalCost">
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Description</b>
                                </label>
                                <textarea class="form-control bg-white" rows="3" :disabled="mode == 'view'"
                                       name="Description" v-model="edit_item.description" required></textarea>
                            </div>
                        </div>

                        <div v-if="edit_item.business_trip_enable" class="col-6 vstack align-top p-1">
                            <account-businesstrip-option-component
                                ref="accountBusinessTripOptionComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="parent_acc_item.div_name"
                                :pmode="mode"
                                :biz_data="edit_item.plan_biz_data"
                                @select-item="bizTripSelected">
                            </account-businesstrip-option-component>
                        </div>

                        <div v-if="edit_item.account_id" class="vstack align-top p-1"
                             :class="{'col-6': account_plan_option_enable}">
                            <account-plan-option-component
                                ref="accountPlanOptionComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :pmode="mode"
                                :account_id="edit_item.account_id"
                                :plan_id="edit_item.id"
                                @open-account-plan-option="account_plan_option_enable=true"
                                @close-account-plan-option="account_plan_option_enable=false">
                            </account-plan-option-component>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <iftag v-if="this.$props.pmode =='plan' && this.$props.acl >= 5 && tdata.allow_modify">
                            <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="submitFormModal">Submit</div>
                            <div v-if="mode == 'new'" class="btn btn-primary me-4" style="min-width:100px;"
                                 @click="submitCopyFormModal">Submit & Continue</div>
                            <div v-if="mode == 'view' && edit_item.transfer_cost == 0" class="btn btn-primary me-4" style="width:100px;"
                                 @click="modifyBudgetItem">Modify</div>
                            <div v-if="mode == 'view' && edit_item.transfer_cost == 0" class="btn btn-danger me-4" style="width:100px;"
                                 @click="deleteFormModal">Delete</div>

                            <div v-if="mode == 'modify' && edit_item.transfer_cost == 0" class="btn btn-primary me-4" style="width:100px;"
                                 @click="updateFormModal">Update</div>
                            <div v-if="mode == 'modify' && edit_item.transfer_cost == 0" class="btn btn-secondary" style="width:100px;"
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

        <div v-else class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Budget Plan</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='list'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">
                    <div class="row text-start">
                        <div class="col-6 vstack align-top p-1">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1" style="cursor:pointer"
                                     :class="[switchData == 'basic' ? 'bg-primary ':'bg-white text-black-50']" @click="changeSwitchData('basic')">
                                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'basic' ? 'text-danger':'text-black-50']"></i>
                                    <b class="me-3">Basic Information</b>
                                </div>
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1" style="cursor:pointer"
                                     :class="[switchData == 'history' ? 'bg-primary ':'bg-white text-black-50']" @click="changeSwitchData('history')">
                                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'history' ? 'text-danger':'text-black-50']"></i>
                                    <b class="me-3">History Information</b>
                                </div>
                            </div>
                            <div>
                                <budget-plan-history-component
                                    ref="budgetPlanHistoryComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :acl="this.$props.acl"
                                    :div_name="parent_org_item.div_name"
                                    :year="parent_org_item.year"
                                    :version="0"
                                    :item_id="edit_item.id"
                                    :parent_id="edit_item.parent_id">
                                </budget-plan-history-component>
                            </div>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary" style="width:100px;" @click="mode='list'">Close</div>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <div v-if="massPlanUploadModal">
        <budget-plan-mass-upload-component
            ref="budgetPlanMassUploadComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="parent_org_item.div_name"
            :year="parent_org_item.year"
            :version="0"
            @close-component="massPlanUploadModal=false"
            @update-result="updateResult">
        </budget-plan-mass-upload-component>
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
             'parent_org_item','parent_acc_item','start_month','end_month','check_child_organization'],
    components: {
        'account-businesstrip-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountBusinessTripOptionComponent.vue', vueLoaderOptions) ),
        'account-plan-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountPlanOptionComponent.vue', vueLoaderOptions) ),
        'budget-plan-mass-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanMassUploadComponent.vue', vueLoaderOptions) ),
        'budget-plan-history-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanHistoryComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            parent_org_item : this.$props.parent_org_item,
            parent_acc_item : this.$props.parent_acc_item,
            startMonth : this.$props.start_month,
            endMonth : this.$props.end_month,
            checkChildOrganization : this.$props.check_child_organization,
            checkChildAccount : true,
            switchData : "basic",
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
            account_plan_option_enable : false,

            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
            fullView : false,
            massPlanUploadModal : false,
        }
    },
    mounted(){
        if(this.parent_acc_item == ""){
            this.parent_acc_item = { 'id' : 0};
        }
        this.page(this.tdata.active_page, this.page_num );
    },
    methods: {
        // emit function
        updateResult(){
            this.massPlanUploadModal=false;
            this.$emit('update-data');
            this.page(this.active_page, this.page_num);
        },
        changeSwitchData(data){
            this.switchData = data;
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
        newPlanItem(){
            if(this.parent_acc_item.rght - this.parent_acc_item.lft > 1){
                warningModal.show_modal("Please select a child accounts!");
                return;
            }
            this.mode = "new";
            this.showFormModal = "show";
            this.edit_item = {};
            this.edit_item.org_name = this.parent_org_item.org_name;
            this.edit_item.org_id = this.parent_org_item.id;
            this.edit_item.account_name = this.parent_acc_item.account_name;
            this.edit_item.account_id = this.parent_acc_item.id;
            this.edit_item.account_code = this.parent_acc_item.account_code;
            this.edit_item.business_trip_enable = this.parent_acc_item.business_trip_enable;
            this.edit_item.month = this.endMonth;
        },
        modifyBudgetItem(){
            this.mode = "modify";
            if(this.$refs.accountPlanOptionComponent){
                this.$refs.accountPlanOptionComponent.loadMasterOption();
            }
        },
        checkAll(){
            this.checked_all = !this.checked_all;
            this.checked_ids = [];
            if(this.checked_all){
                if(this.tdata.itemList){
                    for(var i=0; i<this.tdata.itemList.length; i++){
                        this.checked_ids.push(this.tdata.itemList[i].id);
                    }
                }
            }
        },
        async viewBudgetItem(item){
            this.mode = "view";
            this.selected_item = item;
            if(this.$props.pmode == "budgetPlan" || this.$props.pmode == "budgetAssign"){
                if(!this.checked_ids.includes(item.id))
                    this.checked_ids.push(item.id);
            }else{
                this.checked_ids = [item.id];
            }
            this.edit_item = JSON.parse(JSON.stringify(item));
        },
        cancelFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
            this.mode = "view";
            if(this.$refs.accountPlanOptionComponent){
                this.$refs.accountPlanOptionComponent.loadOptionData();
            }
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#planFormId")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }

            // number check
            var numberElements = document.querySelectorAll("#planFormId")[0].querySelectorAll("input.number");
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
            if(this.form_validation()) return false;

            if(this.$refs.accountBusinessTripOptionComponent){
                var trip_data = await this.$refs.accountBusinessTripOptionComponent.getData();
                this.edit_item.business_trip = trip_data;
            }
            if(this.$refs.accountPlanOptionComponent){
                var response = await this.$refs.accountPlanOptionComponent.getData();
                this.edit_item.option_list = response;
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/detailBudgetItem/0', vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        async submitCopyFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;

            if(this.$refs.accountBusinessTripOptionComponent){
                var trip_data = await this.$refs.accountBusinessTripOptionComponent.getData();
                this.edit_item.business_trip = trip_data;
            }
            if(this.$refs.accountPlanOptionComponent){
                var response = await this.$refs.accountPlanOptionComponent.getData();
                this.edit_item.option_list = response;
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/detailBudgetItem/0', vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
            this.mode = "new";

            // BusinessTripOption data copy
            if(this.edit_item.business_trip_enable){
                this.$nextTick(() => {
                    this.$refs.accountBusinessTripOptionComponent.setData(this.edit_item.business_trip);
                });
            }
            // PlanOption data copy
            if(this.edit_item.option_list.length > 0){
                this.$nextTick(() => {
                    this.$refs.accountPlanOptionComponent.setData(this.edit_item.option_list);
                });
            }
        },
        async updateFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;

            if(this.$refs.accountBusinessTripOptionComponent){
                var trip_data = await this.$refs.accountBusinessTripOptionComponent.getData();
                this.edit_item.business_trip = trip_data;
            }
            if(this.$refs.accountPlanOptionComponent){
                var response = await this.$refs.accountPlanOptionComponent.getData();
                this.edit_item.option_list = response;
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/detailBudgetItem/'+vm.edit_item.id, vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        deleteFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/detailBudgetItem/'+vm.edit_item.id,
                { params:{ checked_ids : vm.checked_ids } } )
                .then(function(res){
                    vm.selected_item = {};
                    vm.mode = "list";
                    vm.checked_ids = [];
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-data');
            await this.page(this.active_page, this.page_num);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetPlanList/'+this.parent_org_item.id+'/'+this.parent_acc_item.id,
                { params:{ load_mode:vm.$props.pmode,
                           active_page: num, page_num: page_num,
                           start_month: vm.startMonth,
                           end_month: vm.endMonth,
                           include_child_organization: vm.checkChildOrganization,
                           include_child_account: vm.checkChildAccount,
                           search_text : vm.search_text } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.refresh_check_ids();
        },
        refresh_check_ids(){
            if(this.tdata.itemList){
                var checked_ids = this.checked_ids;
                this.checked_ids = [];
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(checked_ids.includes(this.tdata.itemList[i].id) )
                        this.checked_ids.push(this.tdata.itemList[i].id);
                }
            }
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
            if(this.tdata.total_article > 2000){
                if(this.$props.lang == "kr")
                    warningModal.show_modal("2000 개 까지만 출력 됩니다.");
                else
                    warningModal.show_modal("Up to 20000 are extracted.");
            }
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{
                    load_mode:vm.$props.pmode,
                    start_month: vm.startMonth,
                    end_month: vm.endMonth,
                    include_child_organization: vm.checkChildOrganization,
                    include_child_account: vm.checkChildAccount,
                    search_text : vm.search_text
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/budgetPlanExcel/'+this.parent_org_item.id+'/'+this.parent_acc_item.id, config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "budget_plan_list.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/budgetPlanExcel/'+this.parent_org_item.id+'/'+this.parent_acc_item.id, null )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        },
        deletePlanItem(){
            if(this.tdata.itemList){
                var temp_ids = [];
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(this.checked_ids.includes(this.tdata.itemList[i].id)){
                        temp_ids.push(this.tdata.itemList[i].id);
                    }
                }
                this.checked_ids = temp_ids;
            }

            if(this.checked_ids.length ==0){
                warningModal.show_modal("Please select one or more items!");
                return true;
            }
            this.edit_item.id = 0;
            confirmModal.show_modal(this);
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
        cal_totalCost(){
            if(this.edit_item){
                if(this.edit_item.unit_count && this.edit_item.unit_cost){
                    this.edit_item.total_cost = this.edit_item.unit_count * this.edit_item.unit_cost;
                    return this.edit_item.total_cost;
                }
            }
            this.edit_item.total_cost = "";
            return this.edit_item.total_cost;
        },
        totalSelectedCost(){
            if(this.tdata.itemList){
                var sum = 0;
                var count = 0;
                var objs = [];
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(this.checked_ids.includes(this.tdata.itemList[i].id) ){
                        count +=1;
                        if(this.$props.pmode == "budgetPlan"){
                            sum += this.tdata.itemList[i].total_cost - this.tdata.itemList[i].transfer_cost;
                        }else
                            sum += this.tdata.itemList[i].total_cost;
                        objs.push(this.tdata.itemList[i]);
                    }
                }
                this.$emit('total-selected-cost', count, sum, objs);
                return sum;
            }
            this.$emit('total-remain-cost', 0, 0, {});
            return 0;
        },
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.itemList){
                all_item_length = this.tdata.itemList.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.checked_all = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.checked_all = false;
                return false;
            }
            return true;
        },
    },
}
</script>
