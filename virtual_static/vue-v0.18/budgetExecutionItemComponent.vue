<template>

    <!-- New Item Modal -->
    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
             :class="{'modal-lg': (accountItem.option && accountItem.option.length > 0)
                || (accountItem.optionPSC && accountItem.optionPSC.length > 0)
                || accountItem.next_app_step >= 90}">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Execution Item</h4>
                    <button type="button" v-if="account_mode != 'auto_add'" class="btn-close btn-close btn-close-white"
                            @click="closeExecutionFormModal"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="row" id="account_form">
                        <div class="col pt-1 px-2 mb-3"
                             :class="{'col-lg-6':(accountItem.option && accountItem.option.length > 0)
                                    || (accountItem.optionPSC && accountItem.optionPSC.length > 0) }">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Basic Information</b>
                                </div>
                                <button v-if="accountItem.account_id && popupExists"
                                        type="button" class="btn btn-lightyellow ms-auto" style="padding:0.1em 0.5em;"
                                        @click="openPopupNotice">
                                    <span class="text-danger"><i class="bi bi-info-square me-2"></i>Notice</span>
                                </button>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Organization</b>
                                </label>
                                <div class="form-control text-start input-group p-0 rnd-tooltip">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Organization" v-model="accountItem.org_name" readonly required>
                                    <input type="hidden" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Organization" v-model="accountItem.au_code" readonly required>
                                    <div v-if="account_mode == 'new'" class="input-group-tex">
                                        <organization-account-select-component
                                                ref="organizationAccountSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :year="accountItem.execution_year"
                                                :month="accountItem.execution_month"
                                                :div_name="this.$props.div_name"
                                                :acl="this.$props.acl"
                                                @select-target="setOrganizationAndAccount"></organization-account-select-component>
                                    </div>
                                    <div class="rnd-tooltip-content px-2 text-nowrap">
                                        [ {{ accountItem.org_id }} ]
                                        {{ accountItem.org_name }}
                                        ({{ accountItem.nas_code }})
                                    </div>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Account</b>
                                </label>
                                <div class="form-control text-start input-group p-0 rnd-tooltip">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Account" v-model="accountItem.account_name" readonly required>
                                    <input type="hidden" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Account" v-model="accountItem.account_code" readonly required>
                                    <div v-if="account_mode == 'new'" class="input-group-tex">
                                        <organization-account-select-component
                                                ref="organizationAccountSelectComponent2"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :year="accountItem.execution_year"
                                                :month="accountItem.execution_month"
                                                :div_name="this.$props.div_name"
                                                :acl="this.$props.acl"
                                                :preset_orgid="this.$props.preset_orgid"
                                                @select-target="setOrganizationAndAccount"></organization-account-select-component>
                                    </div>
                                    <div class="rnd-tooltip-content px-2 text-nowrap">
                                        [ {{ accountItem.account_id }} ]
                                        {{ accountItem.account_name }}
                                        ({{ accountItem.account_code }})
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Month</b>
                                </label>
                                <div class="form-control text-start input-group p-0 border-0">
                                    <input type="hidden" v-model="accountItem.execution_year">
                                    <lable class="form-control text-start bg-white">{{ accountItem.execution_year }}</lable>
                                    <div class="form-control p-0">
                                        <select v-model="accountItem.execution_month"
                                                class="form-select border-0 bg-white"
                                                :disabled="!accountItem.account_code || account_mode == 'view'" @change="changeMonth">
                                            <option v-for="n in (12)" :value="n"
                                                    :disabled="accountItem.execution_month > n">{{ n }}</option>
                                        </select>
                                    </div>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Name</b>
                                </label>

                                <div class="form-control text-start input-group p-0">
                                    <input type="text" class="form-control text-start border-0 border-end"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           name="Project Name" v-model="accountItem.project_name" readonly required>
                                    <div v-if="account_mode != 'view' && !accountItem.account_with_project" class="input-group-tex">
                                        <project-select-component
                                                ref="projectSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :div_name="this.$props.div_name"
                                                @select-target="setProject"></project-select-component>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Project Code</b>
                                </label>
                                <input class="form-control text-start" type="text" :class="{'bg-white' :account_mode == 'view'}"
                                       name="Project Code" v-model="accountItem.project_code" readonly required>
                            </div>
                            <div v-if="account_mode != 'view'" class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Remain Cost</b>
                                </label>
                                <input type="hidden" v-model="accountItem.remain_cost">
                                <lable class="form-control text-start bg-white">{{ markedCost(accountItem.remain_cost) }}</lable>
                            </div>

                            <div v-if="!accountItem.pcb_sample_cost_enable && !accountItem.pcb_stencil_cost_enable"
                                 class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Unit Cost</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text" :disabled="account_mode == 'view'"
                                       name="Unit Cost" v-model="accountItem.unit_cost" required >
                            </div>
                            <div v-if="!accountItem.pcb_sample_cost_enable && !accountItem.pcb_stencil_cost_enable"
                                 class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Quantity</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text" :disabled="account_mode == 'view'"
                                       name="Quantity" v-model="accountItem.unit_count" required >
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Total Cost</b>
                                </label>
                                <input class="form-control text-start bg-white" type="text" disabled required
                                       name="Total Cost" v-model="cal_totalCost">
                            </div>
                            <div v-if="accountItem.pcb_sample_cost_enable" class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;"><b>Cost Calculate</b></label>
                                <input class="form-control text-start bg-warning bg-opacity-25" type="text" disabled
                                       name="Cost Calculate" v-model="accountItem.pcb_sample_cost_calculate">
                            </div>

                            <div v-if="accountItem.pcb_sample_cost_enable &&
                                       accountItem.pcb_sample_cost_calculate == 'Manual' " class="input-group mt-1">
                                <label class="form-control text-start bg-warning bg-opacity-25">
                                    <span v-if="this.$props.lang == 'kr'" class="text-danger">
                                        ※ 계약 단가가 아닐 경우 반드시 견적서를 첨부하시기 바랍니다.
                                    </span>
                                    <span v-else class="text-danger">
                                        ※ When non contract cost, you have to attached estimate sheet.
                                    </span>
                                </label>
                            </div>

                            <div v-if="account_mode != 'view'" class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>To-Be</b>
                                </label>
                                <lable class="form-control text-start bg-white">
                                    <span :class="[accountItem.remain_cost >= accountItem.total_cost ?
                                                                  'text-secondary' : 'text-danger fw-bold']">
                                        {{ markedCost(accountItem.remain_cost - accountItem.total_cost) }}
                                    </span>
                                </lable>
                            </div>

                            <div v-if="accountItem.work_order_enable && accountItem.next_app_step > 0"
                                 class="hstack border-bottom border-primary mt-4">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Work Order Information</b>
                                </div>
                            </div>
                            <div v-if="accountItem.work_order_enable && accountItem.next_app_step > 0"
                                 class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <b>Work Order</b>
                                </label>
                                <input class="form-control text-start bg-warning bg-opacity-25" type="text" disabled
                                       name="Work Order" v-model="accountItem.work_order">
                            </div>
                            <div v-if="accountItem.correct_id">
                                <div class="hstack border-bottom border-danger mt-4">
                                    <div class="col-auto border border-bottom-0 border-danger
                                                rounded-top py-1 px-2 bg-danger bg-opacity-25">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <b>Correction Information</b>
                                    </div>
                                </div>
                                <div class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                        <b>Correct Execution</b>
                                    </label>
                                    <div class="form-control text-start input-group p-0">
                                        <span class="form-control text-start border-0 border-end">
                                            {{ accountItem.correct_master_id }}-{{ accountItem.correct_seq_no }}
                                        </span>
                                        <span v-if="accountItem.correct_master_id"
                                              class="input-group-addon input-group-text border-0"
                                              style="padding:0.1em 0.5em; cursor:pointer"
                                              @click="viewBudgetItem(accountItem.correct_master_id)">
                                            <i class="bi bi-info-circle"></i>
                                        </span>
                                    </div>
                                </div>
                                <div class="input-group mt-1">
                                    <div class="input-group">
                                        <label class="input-group-text text-start text-wrap" style="width:160px;">
                                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                            <b>Correct Cost</b>
                                        </label>
                                        <span class="form-control text-start bg-white" type="text">
                                            {{ markedCost(accountItem.correct_cost) }}
                                        </span>
                                    </div>
                                </div>
                                <form name="submitForm" method="get"></form>
                            </div>

                        </div>

                        <!-- PCB Sample Cost Enable --------------------------------------------->
                        <div v-if="accountItem.pcb_sample_cost_enable || accountItem.pcb_stencil_cost_enable
                                    || accountItem.correction_enable"
                             class="col-lg-6 pt-1 px-2 mb-3">

                            <div v-if="accountItem.correction_enable"
                                     class="hstack border-bottom border-danger">
                                <div class="col-auto border border-bottom-0 border-primary
                                            rounded-top py-1 px-2 bg-danger bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Correction Information</b>
                                </div>
                            </div>
                            <div v-if="accountItem.correction_enable" class="input-group mt-1 mb-4">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0">
                                        <i class="bi bi-asterisk text-danger"></i>
                                    </span>
                                    <b>Original Execution</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="hidden" name="Original Execution"
                                           v-model="accountItem.original_id" required>
                                    <span class="form-control text-start border-0 border-end">
                                        {{ accountItem.original_master_id }}-{{ accountItem.original_seq_no }}
                                    </span>
                                    <div v-if="account_mode != 'view'" class="input-group-tex">
                                        <correct-target-select-component
                                                ref="correctTargetSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :div_name="this.$props.div_name"
                                                :account_code="accountItem.account_code"
                                                @select-target="setCorrectOriginal">
                                        </correct-target-select-component>
                                    </div>
                                    <span v-else-if="account_mode == 'view' && accountItem.original_master_id"
                                          class="input-group-addon input-group-text border-0"
                                          style="padding:0.1em 0.5em; cursor:pointer"
                                          @click="viewBudgetItem(accountItem.original_master_id)">
                                        <i class="bi bi-info-circle"></i>
                                    </span>
                                </div>
                                <form name="submitForm" method="get"></form>
                            </div>

                            <div v-if="!accountItem.pcb_sample_cost_enable && accountItem.pcb_stencil_cost_enable" class="col mb-3">
                                <div class="hstack border-bottom border-primary">
                                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <b>Stencil Information</b>
                                    </div>
                                </div>

                                <div v-for="opt in accountItem.optionStencil" class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <span class="badge small p-0">
                                            <i v-if="opt.column_required" class="bi bi-asterisk text-danger"></i>
                                        </span>
                                        <b>{{ opt.column_name }}</b>
                                    </label>

                                    <select v-if="opt.data_type == 'list' || opt.data_type == 'component'"
                                            class="form-select form-control text-start bg-white"
                                            :disabled="account_mode == 'view'" :required="opt.column_required"
                                            :name="opt.column_name" v-model="opt.column_data_value" @change="calStencilCost(opt)">
                                        <option v-for="(value, key) in opt.column_data" :value="value">{{key}}</option>
                                    </select>
                                    <textarea v-else-if="opt.data_type == 'textarea'" class="form-control text-start bg-white"
                                              rows="3" class="form-select form-control text-start bg-white"
                                              :disabled="account_mode == 'view'" :required="opt.column_required"
                                              :name="opt.column_name" v-model="opt.column_data_value">
                                    </textarea>
                                    <div v-else-if="opt.data_type == 'date'" :id="opt.column_name" class="form-control text-start input-group date p-0">
                                        <input type="text" class="form-control text-start bg-white border-0" aria-describedby="opt.column_name"
                                               v-model="opt.column_data_value" readonly style="padding:0.1em 0.5em;">
                                        <span class="input-group-addon input-group-text border-0" style="padding:0.1em 0.5em;">
                                            <i class="bi bi-calendar-date"></i>
                                        </span>
                                    </div>

                                    <input v-else-if="opt.column_interface == 'STENCIL_COST'" class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view' || accountItem.manual }"
                                           :disabled="account_mode == 'view' || !accountItem.manual"
                                           :name="opt.column_name" v-model="opt.column_data_value" :required="opt.column_required">

                                    <input v-else class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view'}" :disabled="account_mode == 'view' || opt.data_type == 'fix'"
                                           :name="opt.column_name" v-model="opt.column_data_value" :required="opt.column_required"
                                           @input="resetStencilCost(opt)">

                                    <input v-if="opt.column_data_value == '__MANUAL__'" type="text" class="form-control col text-start"
                                           :name="opt.column_name" v-model="opt.column_data_value2" :required="opt.column_required">

                                    <label v-if="opt.column_guide" class="w-100 m-0 pe-2 pb-2 text-end text-success">
                                        {{ opt.column_guide }}
                                    </label>
                                </div>

                                <div v-if="!expanPCBInfo" class="hstack border-bottom border-primary mt-3">
                                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <b>Relation PCB Information</b>
                                    </div>
                                    <div v-if="!accountItem.pcb_sample_cost_enable" class="col-auto ms-auto">
                                        <button v-if="!expanPCBInfo" type="button" class="btn p-0 m-0" @click="expanPCBInfo=true">
                                            <i class="bi bi-plus-square-fill text-primary"></i>
                                        </button>
                                        <button v-else type="button" class="btn p-0 m-0" @click="expanPCBInfo=false">
                                            <i class="bi bi-dash-square-fill text-secondary"></i>
                                        </button>
                                    </div>
                                </div>

                                <div class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <b>PCB P/N</b>
                                    </label>
                                    <input class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           v-model="accountItem.pcb_part_number" readonly required>
                                </div>
                                <div class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <b>Revision</b>
                                    </label>
                                    <input class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           v-model="accountItem.pcb_part_revision" readonly required>
                                </div>

                            </div>

                            <div v-if="(accountItem.pcb_sample_cost_enable || expanPCBInfo) && switchTab != 'cost_split'"
                                class="col">
                                <div class="hstack border-bottom border-primary">
                                    <div class="col-auto border border-bottom-0 border-primary rounded-top
                                         py-1 px-2 bg-primary bg-opacity-25"
                                         :class="[switchTab == 'pcb_cost' ? 'bg-primary ':'bg-white text-black-50']"
                                         style="cursor:pointer" @click="changeSwitchData('pcb_cost')">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <b v-if="accountItem.pcb_sample_cost_enable">PCB Information</b>
                                        <b v-else>Relation PCB Information</b>
                                    </div>
                                    <div v-if="accountItem.pcb_sample_cost_enable"
                                         class="col-auto mx-1 border border-bottom-0 border-primary rounded-top
                                                py-1 px-2 bg-primary bg-opacity-25"
                                                :class="[switchTab == 'cost_split' ? 'bg-primary ':'bg-white text-black-50']"
                                                style="cursor:pointer" @click="changeSwitchData('cost_split')">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <span class="col me-2"><b>Cost Split</b></span>
                                    </div>
                                    <div v-if="!accountItem.pcb_sample_cost_enable" class="col-auto ms-auto">
                                        <button v-if="!expanPCBInfo" type="button" class="btn p-0 m-0" @click="expanPCBInfo=true">
                                            <i class="bi bi-plus-square-fill text-primary"></i>
                                        </button>
                                        <button v-else type="button" class="btn p-0 m-0" @click="expanPCBInfo=false">
                                            <i class="bi bi-dash-square-fill text-secondary"></i>
                                        </button>
                                    </div>
                                </div>

                                <div v-for="opt in accountItem.optionPSC" class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <span class="badge small p-0">
                                            <i v-if="opt.column_required" class="bi bi-asterisk text-danger"></i>
                                        </span>
                                        <b>{{ opt.column_name }}</b>
                                    </label>

                                    <select v-if="opt.data_type == 'list' || opt.data_type == 'component'"
                                            class="form-select form-control text-start bg-white"
                                            :disabled="account_mode == 'view' || !accountItem.pcb_sample_cost_enable" :required="opt.column_required"
                                            :name="opt.column_name" v-model="opt.column_data_value" @change="resetPCBCost(opt)">
                                        <option v-for="(value, key) in opt.column_data" :value="value">{{key}}</option>
                                    </select>
                                    <textarea v-else-if="opt.data_type == 'textarea'" class="form-control text-start bg-white"
                                              rows="3" class="form-select form-control text-start bg-white"
                                              :disabled="account_mode == 'view'" :required="opt.column_required"
                                              :name="opt.column_name" v-model="opt.column_data_value">
                                    </textarea>
                                    <div v-else-if="opt.data_type == 'date'" :id="opt.column_name" class="form-control text-start input-group date p-0">
                                        <input type="text" class="form-control text-start bg-white border-0" aria-describedby="opt.column_name"
                                               v-model="opt.column_data_value" readonly style="padding:0.1em 0.5em;">
                                        <span class="input-group-addon input-group-text border-0" style="padding:0.1em 0.5em;">
                                            <i class="bi bi-calendar-date"></i>
                                        </span>
                                    </div>

                                    <div v-else-if="opt.column_interface =='ATTRIBUTE2'" class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start border-0 border-end"
                                               :class="{'bg-white' :account_mode == 'view'}"
                                               :name="opt.column_name" v-model="opt.column_data_value" readonly required>
                                        <div v-if="account_mode != 'view' && accountItem.pcb_sample_cost_enable" class="input-group-tex">
                                            <pcb-pno-select-component
                                                    ref="pcbPartNumberSelectComponent"
                                                    :site="this.$props.site"
                                                    :lang="this.$props.lang"
                                                    @select-target="setPCBPart"></pcb-pno-select-component>
                                        </div>
                                    </div>
                                    <div v-else-if="opt.column_interface =='ATTRIBUTE3'" class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start border-0 border-end"
                                               :class="{'bg-white' :account_mode == 'view'}"
                                               :name="opt.column_name" v-model="opt.column_data_value" readonly required>
                                    </div>

                                    <input v-else-if="opt.column_interface == 'TOTAL_COST'" class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view' || accountItem.manual }"
                                           :disabled="account_mode == 'view' || !accountItem.manual  || !accountItem.pcb_sample_cost_enable"
                                           :name="opt.column_name" v-model="opt.column_data_value" :required="opt.column_required">

                                    <input v-else class="form-control text-start" type="text"
                                           :class="{'bg-white' :account_mode == 'view'}"
                                           :disabled="account_mode == 'view' || opt.data_type == 'fix' || !accountItem.pcb_sample_cost_enable"
                                           :name="opt.column_name" v-model="opt.column_data_value" :required="opt.column_required"
                                           @input="resetPCBCost(opt)">

                                    <input v-if="opt.column_data_value == '__MANUAL__'" type="text" class="form-control col text-start"
                                           :disabled="!accountItem.pcb_sample_cost_enable"
                                           :name="opt.column_name" v-model="opt.column_data_value2" :required="opt.column_required">

                                    <button v-if="account_mode != 'view' && opt.column_interface =='TOTAL_COST' &&
                                                accountItem.pcb_sample_cost_enable"
                                            class="input-group-text" @click="calPCBCost">
                                        <i class="bi bi-calculator"></i>
                                    </button>

                                    <label v-if="opt.column_guide" class="w-100 m-0 pe-2 pb-2 text-end text-success">
                                        {{ opt.column_guide }}
                                    </label>

                                </div>

                                <div class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <b>Stencil Order</b>
                                    </label>
                                    <div class="form-control bg-warning bg-opacity-25 ps-0">
                                        <input class="form-check-input" type="checkbox"
                                               :disabled="account_mode == 'view' || !accountItem.pcb_sample_cost_enable"
                                               v-model="accountItem.pcb_stencil_cost_enable">
                                        <lable class="ms-2 text-success">Make Stencil Ordering Item</lable>
                                    </div>
                                </div>
                            </div>

                            <div v-if="switchTab == 'cost_split'" class="col">
                                <div class="hstack border-bottom border-primary">
                                    <div class="col-auto border border-bottom-0 border-primary rounded-top
                                         py-1 px-2 bg-primary bg-opacity-25"
                                         :class="[switchTab == 'pcb_cost' ? 'bg-primary ':'bg-white text-black-50']"
                                         style="cursor:pointer" @click="changeSwitchData('pcb_cost')">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <b>PCB Information</b>
                                    </div>
                                    <div v-if="accountItem.pcb_sample_cost_enable"
                                         class="col-auto mx-1 border border-bottom-0 border-primary rounded-top
                                                py-1 px-2 bg-primary bg-opacity-25"
                                                :class="[switchTab == 'cost_split' ? 'bg-primary ':'bg-white text-black-50']"
                                                style="cursor:pointer" @click="changeSwitchData('cost_split')">
                                        <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                        <span class="col me-2"><b>Cost Split</b></span>
                                    </div>
                                </div>
                                <div class="table-responsive my-1">
                                    <table class="table table-hover table-bordered m-0">
                                        <thead style="background-color:#DDEEFF;">
                                            <tr>
                                                <th class="py-1 text-center text-nowrap">Organization</th>
                                                <th class="py-1 text-center text-nowrap">Quantity</th>
                                                <th class="py-1 text-center text-nowrap">Split Cost</th>
                                            </tr>
                                        </thead>
                                        <tbody v-for="sp in accountItem.optionSplit">
                                            <tr class="bg-opacity-25" :class="{'bg-secondary':sp.org_scope == 'Master'}">
                                                <td class="py-1 text-start text-nowrap">
                                                    <span :class="{'text-danger':sp.org_id < 0}">{{ sp.org_name }}</span>
                                                </td>
                                                <td class="py-1 text-end text-nowrap">{{ sp.org_qty }}</td>
                                                <td class="py-1 text-end text-nowrap">{{ markedCost(sp.org_cost) }}</td>
                                            </tr>
                                        </tbody>
                                    </table>
                                </div>
                            </div>
                        </div>

                        <div v-if="accountItem.pcb_sample_cost_enable" class="px-2">
                            <div class="col my-3">
                                <pcb-sample-order-list-info-component
                                        ref="pcbSampleOrderListComponent"
                                        :site="this.$props.site"
                                        :lang="this.$props.lang"
                                        :part_number="accountItem.pcb_part_number"
                                        :pmode="account_mode"
                                        @select-target="setPCBOrderHistory">
                                </pcb-sample-order-list-info-component>
                            </div>
                        </div>

                        <div v-if="(accountItem.option && accountItem.option.length > 0)"
                             class="col-lg-6 vstack align-top p-1 px-2">
                            <div v-if="accountItem.option && accountItem.option.length > 0"
                                 class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Additional Information</b>
                                </div>
                            </div>
                            <div v-for="opt in accountItem.option">
                                <div v-if="opt.column_interface !='RELATION_ACCOUNT_ID' &&
                                        opt.column_interface !='RELATION_COLUMN' " class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <span class="badge small p-0">
                                            <i v-if="opt.column_required" class="bi bi-asterisk text-danger"></i>
                                        </span>
                                        <b>{{ opt.column_name }}</b>
                                    </label>

                                    <select v-if="opt.data_type == 'list' || opt.data_type == 'component'"
                                            class="form-select form-control text-start bg-white"
                                            :disabled="account_mode == 'view'" :required="opt.column_required"
                                            :name="opt.column_name" v-model="opt.column_data_value" >
                                        <option v-for="(value, key) in opt.column_data" :value="value">{{key}}</option>
                                    </select>
                                    <div v-else-if="opt.data_type == 'pcb_part_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" :disabled="opt.data_readonly"
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required"
                                               @keyup.enter="partSearch(opt.column_data_value)">
                                        <div class="input-group-tex">
                                            <pcb-pno-select-component
                                                    ref="pcbPartNumberSelectComponent"
                                                    :site="this.$props.site"
                                                    :lang="this.$props.lang"
                                                    @select-target="setPCBPart"></pcb-pno-select-component>
                                        </div>
                                    </div>
                                    <div v-else-if="opt.data_type == 'part_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" :disabled="opt.data_readonly"
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required"
                                               @keyup.enter="partSearch(opt.column_data_value)">
                                        <button class="input-group-text border-0"
                                            @click="partSearch(opt.column_data_value)">
                                            <i class="bi bi-search"></i>
                                        </button>
                                    </div>
                                    <div v-else-if="opt.data_type == 'model_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" :disabled="opt.data_readonly"
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required"
                                               @keyup.enter="modelSearch(opt.column_data_value)">
                                        <button class="input-group-text border-0"
                                            @click="modelSearch(opt.column_data_value)">
                                            <i class="bi bi-search"></i>
                                        </button>
                                    </div>
                                    <div v-else-if="opt.data_type == 'asset_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" :disabled="opt.data_readonly"
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required"
                                               @keyup.enter="assetSearch(opt.column_data_value)">
                                        <button class="input-group-text border-0"
                                            @click="assetSearch(opt.column_data_value)">
                                            <i class="bi bi-search"></i>
                                        </button>
                                    </div>
                                    <div v-else-if="opt.data_type == 'asset_category_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" disabled
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required">
                                        <div v-if="account_mode != 'view'" class="input-group-tex">
                                            <asset-category-select-component
                                                    ref="assetCategorySelectComponent"
                                                    :site="this.$props.site"
                                                    :lang="this.$props.lang"
                                                    :div_name="this.$props.div_name"
                                                    :acl="this.$props.acl"
                                                    :org_id="accountItem.org_id"
                                                    :pmode="'budget'"
                                                    @select-target="selectedAssetCategory">
                                            </asset-category-select-component>
                                        </div>
                                        <div v-if="opt.data_type == 'asset_category_search' && accountItem.next_app_step > 0"
                                             class="input-group-tex m-0 p-1 px-2 border-start">
                                            <input class="form-check-input" type="checkbox"
                                               :disabled=" !(accountItem.next_app_step > 0
                                                             && ( (accountItem.next_appline && accountItem.next_appline.active )
                                                                  || '{{request.preset.user_id}}' == 'admin')
                                                            )"
                                               v-model="accountItem.asset_register_enable" @click="updateAssetRegisterValue">
                                        </div>
                                    </div>
                                    <div v-else-if="opt.data_type == 'freight_charge_search'" :id="opt.column_name"
                                         class="form-control text-start input-group p-0">
                                        <input type="text" class="form-control text-start bg-white border-0 px-2"
                                               aria-describedby="opt.column_name" :disabled="opt.data_readonly"
                                               v-model="opt.column_data_value" style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required"
                                               @keyup.enter="freightChargeSearch(opt.column_data_value)">
                                        <button v-if="account_mode != 'view'" class="input-group-text border-0"
                                            @click="freightChargeSearch(opt.column_data_value)">
                                            <i class="bi bi-search"></i>
                                        </button>
                                    </div>

                                    <textarea v-else-if="opt.data_type == 'textarea'" class="form-control text-start bg-white"
                                              rows="3" class="form-select form-control text-start bg-white"
                                              :disabled="account_mode == 'view'"
                                              :name="opt.column_name" :required="opt.column_required"
                                              v-model="opt.column_data_value">
                                    </textarea>

                                    <div v-else-if="opt.data_type == 'date'" :id="opt.column_name" class="form-control text-start input-group date p-0">
                                        <input type="text" class="form-control text-start bg-white border-0" aria-describedby="opt.column_name"
                                               v-model="opt.column_data_value" readonly style="padding:0.1em 0.5em;"
                                               :name="opt.column_name" :required="opt.column_required">
                                        <span class="input-group-addon input-group-text border-0">
                                            <i class="bi bi-calendar-date"></i>
                                        </span>
                                    </div>

                                    <label v-else-if="opt.data_type == 'fix'" class="form-control text-start bg-white" type="text"
                                           disabled :name="opt.column_name" :class="{'text-end' : isNumeric(opt.column_data_value)}"
                                           :name="opt.column_name" :required="opt.column_required">
                                        <span v-if="isNumeric(opt.column_data_value)">
                                            {{ markedCost(opt.column_data_value) }}
                                        </span>
                                        <span v-else>{{ opt.column_data_value }}</span>
                                    </label>

                                    <input v-else class="form-control text-start bg-white" type="text"
                                           :disabled="account_mode == 'view'"
                                           :name="opt.column_name" :required="opt.column_required"
                                           v-model="opt.column_data_value" >

                                    <button v-if="account_mode != 'view' && opt.column_interface =='TOTAL_COST'"
                                            class="input-group-text" @click="calOptionCost">
                                        <i class="bi bi-calculator"></i>
                                    </button>

                                    <label v-if="opt.column_guide" class="w-100 m-0 pe-2 pb-2 text-end text-success">
                                        {{ opt.column_guide }}
                                    </label>
                                </div>
                                <div v-if="opt.column_interface =='RELATION_ACCOUNT_ID'" class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <b>{{ opt.column_name }}</b>
                                    </label>
                                    <div class="form-control bg-warning bg-opacity-25 ps-2 text-start">
                                        <lable class="text-success">
                                            {{ opt.column_guide }}
                                        </lable>
                                    </div>
                                </div>
                                <div v-if="opt.column_interface =='RELATION_COLUMN'" class="input-group mt-1">
                                    <label class="input-group-text text-start text-wrap" style="width:160px;">
                                        <span class="badge small p-0">
                                            <i v-if="opt.column_required" class="bi bi-asterisk text-danger"></i>
                                        </span>
                                        <b>{{ opt.column_name }}</b>
                                    </label>
                                    <input class="form-control text-start bg-white" disabled
                                        v-model="opt.column_data_value" :required="opt.column_required">
                                    <label v-if="opt.column_guide" class="w-100 m-0 pe-2 pb-2 text-end text-success">
                                        {{ opt.column_guide }}
                                    </label>
                                </div>

                            </div>
                        </div>

                        <div v-if="accountItem.custom_dialog" class="px-2">
                            <div class="col my-3">
                                <account-custom-dialog-info-component
                                        ref="customDialogComponent"
                                        :site="this.$props.site"
                                        :lang="this.$props.lang"
                                        :account_item="accountItem"
                                        :pmode="account_mode"
                                        :custom_dialog="accountItem.custom_dialog"
                                        :div_name="this.$props.div_name">
                                </account-custom-dialog-info-component>
                            </div>
                        </div>

                        <div>
                            <part-search-modal-component
                                    ref="partSearchModalComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :search_string=""
                                    @select-target="selectedPart">
                            </part-search-modal-component>
                        </div>
                        <div>
                            <model-search-modal-component
                                    ref="modelSearchModalComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :search_string=""
                                    @select-target="selectedModel">
                            </model-search-modal-component>
                        </div>
                        <div>
                            <asset-search-modal-component
                                    ref="assetSearchModalComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :div_name="this.$props.div_name"
                                    :search_asset_number=""
                                    :display_mode="'simple'"
                                    @select-target="selectedAsset">
                            </asset-search-modal-component>
                        </div>
                        <div v-if="freightChargeSearchModal">
                            <freight-charge-search-modal-component
                                    ref="freightChargeSearchModalComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :div_name="this.$props.div_name"
                                    :search_string=""
                                    @select-target="selectedFreightCharge"
                                    @close-modal="closedFreightChargeModal">
                            </freight-charge-search-modal-component>
                        </div>
                    </div>

                    <div v-if="componentFormDialog" class="row">
                        <div class="col my-3 px-2">
                            <account-estimation-info-component
                                    ref="accountEstimationInfoComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :div_name="this.$props.div_name"
                                    :acl="this.$props.acl"
                                    :pmode="account_mode"
                                    :pdata="accountItem.estimation_data"
                                    @select-item="accountSelected2"
                                    @add-pic-user="addPICUser">
                            </account-estimation-info-component>
                        </div>
                    </div>

                    <div v-if="accountItem.next_app_step >= 90" class="row">
                        <div class="col my-3 px-2">
                            <budget-execution-result-component
                                    ref="budgetExecutionResultComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :acl="this.$props.acl"
                                    :pmode="account_mode"
                                    :parent_id="accountItem.id"
                                    @update-result="updateResult">
                            </budget-execution-result-component>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div v-if="(pmode == 'new' || pmode == 'modify') && account_mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitExecutionFormModal">Add Item</div>
                        <div v-if="!accountItem.pcb_sample_cost_enable && !accountItem.pcb_stencil_cost_enable"
                             class="btn btn-primary mx-2" style="min-width:100px;"
                             @click="continueExecutionFormModal">Add Item & Continue</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeExecutionFormModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && account_mode == 'auto_add'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitExecutionFormModal">Add Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelAutoAddItem">Cancel</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && account_mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyExecutionFormModal">Modify Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeExecutionFormModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && account_mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitExecutionFormModal">Update Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelExecutionFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeExecutionFormModal">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- New Item Modal -->

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
    props : ['site','lang','acl','doc_id','div_name','accountItem','execution_item_id','pmode'],
    components: {
        'organization-account-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationAccountSelectComponent.vue', vueLoaderOptions) ),
         'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
        'account-estimation-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountEstimationInfoComponent.vue', vueLoaderOptions) ),
        'project-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/projectSelectComponent.vue', vueLoaderOptions) ),
        'custom-pno-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assyPartNumberSelectComponent.vue', vueLoaderOptions) ),
        'account-custom-dialog-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/customDialogComponent.vue', vueLoaderOptions) ),
        'pcb-pno-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/pcbPartNumberSelectComponent.vue', vueLoaderOptions) ),
        'pcb-sample-order-list-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/pcbSampleOrderListComponent.vue', vueLoaderOptions) ),
        'budget-execution-result-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionResultComponent.vue', vueLoaderOptions) ),
        'account-list-popup-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListPopupComponent.vue', vueLoaderOptions) ),
        'part-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/partSearchModalComponent.vue', vueLoaderOptions) ),
        'model-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/modelSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'freight-charge-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/freightChargeSearchModalComponent.vue', vueLoaderOptions) ),
        'budget-execution-mass-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionMassUploadComponent.vue', vueLoaderOptions) ),
        'correct-target-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/correctTargetSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            account_mode : "view",
            accountItem : this.$props.accountItem,
            editItem : {},
            selectedItem : {},
            showProgressModal : false,
            expanPCBInfo:false,
            switchTab : "pcb_cost",
            split_mode : "",
            split_item : {},
            selected_split_item : {},
            result :{},
        }
    },
    mounted(){
        if(this.$props.pmode == "new"){
            this.accountItem = { 'id' : 0 };
            this.loadExecutionItem();
        }else if(this.pmode == "load"){
            this.loadExecutionItem();
        }
    },
    methods: {
        updateResult(){
            this.$emit('update-result');
        },
        async loadExecutionItem(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetExecutionItem/'+this.accountItem.id,null)
                .then(function(res){
                    vm.accountItem = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            if(this.$props.pmode == "new"){
                this.account_mode = "new";
            }
        },
        async setOrganizationAndAccount(item){
            if(!item.account_id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            if(item.rght - item.lft > 1){
                warningModal.show_modal("Select a child account!");
                return;
            }
            this.accountItem = item;
            this.executionItemFormModal = true;
            this.showProgressModal = true;
            var vm = this;
            //vm.accountItem.account_id = vm.accountItem.id
            await axios.get('./api/loadAccountOptions/'+ vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountContents = res.data.accountContents;
                    vm.accountItem.project_code = res.data.project_code;
                    vm.accountItem.project_name = res.data.project_name;
                    vm.accountItem.account_with_project = res.data.account_with_project;
                    vm.accountItem.option = res.data.accountOptions;
                    vm.accountItem.optionPSC = res.data.accountOptionsPSC;
                    vm.accountItem.optionStencil = res.data.accountOptionsStencil;
                    vm.accountItem.optionSplit = res.data.accountOptionsSplit;
                    vm.accountItem.work_order_enable = res.data.work_order_enable;
                    vm.accountItem.business_trip_enable = res.data.business_trip_enable;
                    vm.accountItem.correction_enable = res.data.correction_enable;
                    vm.accountItem.minus_execution_enable = res.data.minus_execution_enable;
                    vm.accountItem.pcb_sample_cost_enable = res.data.pcb_sample_cost_enable;
                    vm.accountItem.custom_dialog = res.data.custom_dialog;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            $('.input-group.date').datepicker({
                daysOfWeekHighlighted: "0",
                todayHighlight: true,
                autoclose: true,
                language: this.$props.lang,
                orientation: "bottom",
            }).on("changeDate", function(e) {
                // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                var date = e.target.getElementsByTagName('input')[0].value;
                for(var i=0; i<vm.accountItem.option.length; i++){
                    if(vm.accountItem.option[i].column_name == e.target.id)
                        vm.accountItem.option[i].column_data_value = date;
                }
            });

            if(this.$refs.accountListPopupComponent){
                this.$refs.accountListPopupComponent.account_id = this.accountItem.account_id;
                this.$refs.accountListPopupComponent.loadPopupData();
            }
        },
        async changeMonth(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+ vm.accountItem.org_id +'/'+ vm.accountItem.account_id,
                    { params:{  year : vm.accountItem.execution_year, month : vm.accountItem.execution_month } } )
                .then(function(res){
                    vm.accountItem.remain_cost = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        account_form_validation(){
            var requiredElements = document.querySelector("#account_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async calOptionCost(){
            if(this.accountItem.option.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getOptionCost/', vm.accountItem)
                    .then(function(res){
                        vm.accountItem = res.data;
                        vm.auto_calculate_item = JSON.parse(JSON.stringify(vm.accountItem));
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
            }
        },
        resetOptionCost(obj){
            if(!obj.column_interface) return;
            if(obj.column_interface == "") return;
            if(this.accountItem.option){
                for(var at=0; at<this.accountItem.option.length; at++){
                    if(this.accountItem.option[at].column_interface == "TOTAL_COST"){
                        this.accountItem.unit_cost = 0;
                        this.accountItem.total_cost = 0;
                        this.accountItem.option[at].column_data_value = "";
                    }
                }
            }
        },
        async calPCBCost(){
            if(this.accountItem.optionPSC.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getPcbSampleCost/', vm.accountItem.optionPSC)
                    .then(function(res){
                        if(res.data.manual){
                            server_message = res.data.message;
                            vm.accountItem.manual = true;
                            vm.accountItem.pcb_sample_cost_calculate = "Manual";
                            for(var at=0; at<vm.accountItem.optionPSC.length; at++){
                                if(vm.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                    vm.accountItem.sample_cost = 0;
                                    vm.accountItem.total_cost = vm.accountItem.sample_cost;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "SAMPLE_QUANTITY"){
                                    vm.accountItem.unit_count = parseInt(vm.accountItem.optionPSC[at].column_data_value);
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE2"){
                                    vm.accountItem.pcb_part_number = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE3"){
                                    vm.accountItem.pcb_part_revision = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__ONE_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__HALF_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__STANDARD_DELIVERY"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                            }
                        }else{
                            vm.accountItem.manual = false;
                            vm.accountItem.pcb_sample_cost_calculate = "Auto";
                            for(var at=0; at<vm.accountItem.optionPSC.length; at++){
                                if(vm.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                                    vm.accountItem.sample_cost = parseInt(res.data.sample_cost);
                                    vm.accountItem.optionPSC[at].column_data_value = vm.accountItem.sample_cost;
                                    vm.accountItem.total_cost = vm.accountItem.sample_cost;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "SAMPLE_QUANTITY"){
                                    vm.accountItem.unit_count = parseInt(vm.accountItem.optionPSC[at].column_data_value);
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE2"){
                                    vm.accountItem.pcb_part_number = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE3"){
                                    vm.accountItem.pcb_part_revision = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__ONE_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.one_panel_count;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__HALF_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.half_panel_count;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__STANDARD_DELIVERY"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.standard_delivery;
                                }
                            }
                        }


                     })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
                if(vm.accountItem.manual)
                    warningModal.show_modal(server_message);
            }
        },
        resetPCBCost(obj){
            if(!obj.column_interface)
                return;
            if(obj.column_interface == "")
                return;

            if(this.accountItem.optionPSC){
                for(var at=0; at<this.accountItem.optionPSC.length; at++){
                    if(this.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                        this.accountItem.sample_cost = 0;
                        this.accountItem.optionPSC[at].column_data_value = "";
                        this.accountItem.manual = false;
                        this.accountItem.pcb_sample_cost_calculate = "";
                    }
                }
            }
        },
        async calStencilCost(){
            if(this.accountItem.optionStencil.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getStencilCost/', vm.accountItem.optionStencil)
                    .then(function(res){
                        for(var at=0; at<vm.accountItem.optionStencil.length; at++){
                            if(vm.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                                vm.accountItem.stencil_count = parseInt(res.data.stencil_count);
                                vm.accountItem.stencil_cost = parseInt(res.data.stencil_cost);
                                vm.accountItem.optionStencil[at].column_data_value = vm.accountItem.stencil_cost;
                                vm.accountItem.total_cost = vm.accountItem.stencil_cost;
                            }
                            if(vm.accountItem.optionStencil[at].column_interface == "REQUEST_REMARKS"){
                                vm.accountItem.optionStencil[at].column_data_value = res.data.gpdm_remark;
                            }
                        }
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
            }
        },
        resetStencilCost(obj){
            if(!obj.column_interface)
                return;
            if(obj.column_interface == "")
                return;

            if(this.accountItem.optionStencil){
                for(var at=0; at<this.accountItem.optionStencil.length; at++){
                    if(this.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                        this.accountItem.stencil_cost = 0;
                        this.accountItem.optionStencil[at].column_data_value = "";
                    }
                }
            }
        },
        // emit for accountEstimationInfoComponent.form_validation()
        addPICUser(pic){
            this.applines.push(pic);
        },
        continueExecutionFormModal(){
            this.continue_mode = true;
            this.submitExecutionFormModal();
        },
        async submitExecutionFormModal(){
            if(this.account_form_validation()) return false;
            if(this.$refs.accountEstimationInfoComponent){
                var estimation_validate = await this.$refs.accountEstimationInfoComponent.form_validation();
                if(!estimation_validate){
                    return false;
                }
            }

            // column_interface == 'TOTAL_COST' 항목이 있을 경우 계산 결과 갱신 여부 확인
            var auto_calculate_check = false;
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].column_interface == 'TOTAL_COST'){
                    auto_calculate_check = true;
                }
            }
            if(auto_calculate_check){
                if(!this.auto_calculate_item){
                    warningModal.show_modal("Please, click Option Calculator button.");
                    return false;
                }
                if(this.auto_calculate_item.unit_count != this.accountItem.unit_count){
                    warningModal.show_modal("Please, click Option Calculator button.");
                    return false;
                }
                for(var i=0; i<this.accountItem.option.length; i++){
                    if(this.accountItem.option[i].column_data_value !=
                        this.auto_calculate_item.option[i].column_data_value){
                        warningModal.show_modal("Please, click Option Calculator button.");
                        return false;
                    }
                }
            }

            this.$emit('add-update-item',this.accountItem);
            this.accountItem = {};
        },
        async autoAddItem(org_accountItem, acc_id){
            this.add_items();
            this.account_mode = "auto_add";
            var item = {};
            item.id = acc_id;
            var vm = this;
            await axios.get('./api/loadAccountBudgetAmount/'+ org_accountItem.org_id +'/'+ acc_id,
                    { params:{  year : org_accountItem.execution_year, month : org_accountItem.execution_month } } )
                .then(function(res){
                    item.account_code = res.data.account_code;
                    item.account_name = res.data.account_name;
                    item.unit_count = org_accountItem.unit_count;
                    item.rght = res.data.rght;
                    item.lft = res.data.lft;
                    item.remain_cost = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            item.account_id = item.id;
            item.org_id = org_accountItem.org_id;
            item.org_name = org_accountItem.org_name;
            item.au_code = org_accountItem.au_code;
            item.nas_code = org_accountItem.nas_code;
            item.execution_year = org_accountItem.execution_year;
            item.execution_month = org_accountItem.execution_month;
            item.project_name = org_accountItem.project_name;
            item.project_code = org_accountItem.project_code;
            await this.setOrganizationAndAccount(item);

            this.updateRelationColumn(org_accountItem, this.accountItem);
        },
        updateRelationColumn(org_accountItem, rel_accountItem){
            var relation_key = "";
            for(var i=0; i<rel_accountItem.option.length; i++){
                if(rel_accountItem.option[i].column_interface == 'RELATION_COLUMN'){
                    relation_key = rel_accountItem.option[i].column_data;
                }
            }
            for(var i=0; i<org_accountItem.option.length; i++){
                if(org_accountItem.option[i].column_interface == relation_key){
                    for(var j=0; j<rel_accountItem.option.length; j++){
                        if(rel_accountItem.option[j].column_interface == 'RELATION_COLUMN'){
                            rel_accountItem.option[j].column_data_value = org_accountItem.option[i].column_data_value;
                        }
                    }
                }
            }
        },
        cancelAutoAddItem(event){
            if(event) event.preventDefault();
            this.delete_item = "execution_item";
            this.modal_ok();
            this.closeExecutionFormModal();
        },
        cancelExecutionFormModal(event){
            if(event) event.preventDefault();
            //this.modifyExecutionFormModal();
            this.accountItem = JSON.parse(JSON.stringify(this.selectAccountItem));
            this.account_mode = "view";

            if(this.$refs.pcbSampleOrderListComponent){
                this.$refs.pcbSampleOrderListComponent.search_string = this.accountItem.pcb_part_number;
                this.$refs.pcbSampleOrderListComponent.searchData();
            }
        },
        closeExecutionFormModal(event){
            if(event) event.preventDefault();
            this.account_mode = "view";
            this.$emit('close-execution-item-modal');
        },
        modifyExecutionFormModal(event){
            if(event) event.preventDefault();
            if(!this.selectAccountItem.account_id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            this.account_mode = "modify";
            this.continue_mode = false;
            this.executionItemFormModal = true;
            this.accountItem = JSON.parse(JSON.stringify(this.selectAccountItem));
            $('.input-group.date').datepicker({
                daysOfWeekHighlighted: "0",
                todayHighlight: true,
                autoclose: true,
                language: this.$props.lang,
                orientation: "bottom",
            }).on("changeDate", function(e) {
                // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                var date = e.target.getElementsByTagName('input')[0].value;
                for(var i=0; i<this.accountItem.option.length; i++){
                    if(this.accountItem.option[i].column_name == e.target.id)
                        this.accountItem.option[i].column_data_value = date;
                }
            });

            this.loadMasterAccountOption();
        },
        async loadMasterAccountOption(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+ vm.accountItem.org_id +'/'+ vm.accountItem.account_id , null)
                .then(function(res){
                    for(var op=0; op<res.data.accountOptions.length; op++){
                        if(vm.accountItem.option[op] &&
                            vm.accountItem.option[op].column_name == res.data.accountOptions[op].column_name ){
                            vm.accountItem.option[op].column_data = res.data.accountOptions[op].column_data;
                            vm.accountItem.option[op].data_type = res.data.accountOptions[op].data_type;
                            vm.accountItem.option[op].column_guide = res.data.accountOptions[op].column_guide;
                        }
                    }
                    for(var op=0; op<res.data.accountOptionsPSC.length; op++){
                        if(vm.accountItem.optionPSC[op].column_name == res.data.accountOptionsPSC[op].column_name ){
                            vm.accountItem.optionPSC[op].column_data = res.data.accountOptionsPSC[op].column_data;
                            vm.accountItem.optionPSC[op].data_type = res.data.accountOptionsPSC[op].data_type;
                            vm.accountItem.optionPSC[op].column_guide = res.data.accountOptionsPSC[op].column_guide;
                        }
                    }
                    for(var op=0; op<res.data.accountOptionsStencil.length; op++){
                        if(vm.accountItem.optionStencil[op].column_name == res.data.accountOptionsStencil[op].column_name ){
                            vm.accountItem.optionStencil[op].column_data = res.data.accountOptionsStencil[op].column_data;
                            vm.accountItem.optionStencil[op].data_type = res.data.accountOptionsStencil[op].data_type;
                            vm.accountItem.optionStencil[op].column_guide = res.data.accountOptionsStencil[op].column_guide;
                        }
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async loadAccountSummary(check=false){
            // workflow 가 진행중인 항목은 account summary update 하지 않음
            if(this.item.next_app_step > 0) return;
            this.showProgressModal = true;
            var vm = this;
            vm.edit_item = {};
            await axios.put('.api/loadAccountSummary/'+vm.execution_id, vm.item)
                .then(function(res){
                    vm.item.execution_account_summary = res.data.execution_account_summary;
                    vm.item.transfer_account_summary = res.data.transfer_account_summary;
                    if(check && res.data.message != ''){
                        warningModal.show_modal(res.data.message);
                    }
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            this.showProgressModal = false;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.account_mode = "new";
            this.continue_mode = false;
            this.executionItemFormModal = true;
            this.accountItem = {};
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(!this.selectAccountItem.account_id){
                warningModal.show_modal("Select a execution item!");
                return;
            }
            this.delete_item = "execution_item";
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            if(this.delete_item == "execution_item"){
                var tempList = [];
                var delete_rows = [];
                if(this.item.execution_item){
                    for(var i=0; i<this.item.execution_item.length; i++){
                        //if(this.item.execution_item[i] != this.selectAccountItem){
                        //    tempList.push(this.item.execution_item[i]);
                        if(this.item.execution_item[i] == this.selectAccountItem){
                            delete_rows.push(i);

                            for(var at=0; at<this.item.execution_item[i].option.length; at++){
                                // RELATION_ACCOUNT_ID 가 있는 항목이 삭제될 때 다음 row 삭제
                                if(this.item.execution_item[i].option[at].column_interface == "RELATION_ACCOUNT_ID"){
                                    delete_rows.push(i+1);
                                }
                                // RELATION_COLUMN 이 있는 항목이 삭제될 때 이전 row 삭제
                                // (단, 이전 row 에 RELATION_ACCOUNT_ID 이 존재해야 함)
                                if(this.item.execution_item[i].option[at].column_interface == "RELATION_COLUMN" && i > 0){
                                    for(var bf=0; bf<this.item.execution_item[i-1].option.length; bf++){
                                        if(this.item.execution_item[i-1].option[bf].column_interface == "RELATION_ACCOUNT_ID"){
                                            delete_rows.push(i-1);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for(var i=0; i<this.item.execution_item.length; i++){
                        if(! delete_rows.includes(i)){
                            tempList.push(this.item.execution_item[i]);
                        }
                    }
                }
                this.item.execution_item = tempList;

                // this.selectAccountItem.pcb_sample_cost_enable, pcb_stencil_cost_enable 이 true, true 인 경우
                // pcb_sample_cost_enable , pcb_stencil_cost_enable 가 true 인 항목 찾아 모두 삭제
                // pcb_stencil_cost_enable = false 로 변경
                if(this.selectAccountItem.pcb_sample_cost_enable && this.selectAccountItem.pcb_stencil_cost_enable){
                    for(var i=0; i<this.item.execution_item.length; i++){
                        if(this.item.execution_item[i].pcb_stencil_cost_enable){
                            this.item.execution_item.splice(i,1);
                            i--;
                        }
                    }
                }
                // this.selectAccountItem.pcb_sample_cost_enable, pcb_stencil_cost_enable 이 false, true 인 경우
                // pcb_sample_cost_enable , pcb_stencil_cost_enable 가 true 인 항목 찾아
                // pcb_stencil_cost_enable = false 로 변경
                if(!this.selectAccountItem.pcb_sample_cost_enable && this.selectAccountItem.pcb_stencil_cost_enable){
                    for(var i=0; i<this.item.execution_item.length; i++){
                        if(this.item.execution_item[i].pcb_sample_cost_enable && this.item.execution_item[i].pcb_stencil_cost_enable){
                            this.item.execution_item[i].pcb_stencil_cost_enable = false;
                        }
                    }
                }

                this.selectAccountItem = {};
                this.loadAccountSummary();
            }else if(this.delete_item == "transfer_account_summary"){
                var tempList = [];
                if(this.item.transfer_account_summary){
                    for(var i=0; i<this.item.transfer_account_summary.length; i++){
                        if(this.item.transfer_account_summary[i] != this.selectTransferAccountSummary)
                            tempList.push(this.item.transfer_account_summary[i]);
                    }
                }
                this.item.transfer_account_summary = tempList;
                this.selectTransferAccountSummary = {};
                this.loadAccountSummary();
            }else if(this.delete_item == "main"){
                loadingModalEl.show();
                var vm = this;
                await axios.delete('.api/loadContents/'+vm.execution_id,
                    { params : {'app_type': vm.$refs.approvalLineComponent.$props.app_type } })
                    .then(function(res){
                        vm.item = {};
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
                loadingModalEl.hide();
                window.close();
            }
        },
        async detailAccItem(item){
            this.account_mode = "view";
            this.executionItemFormModal = true;
            this.accountItem = JSON.parse(JSON.stringify(item));
            this.expanPCBInfo = false;
        },
        setProject(project){
            this.accountItem.project_name = project.project_name;
            this.accountItem.project_code = project.project_code;
            this.accountItem.account_with_project = false;
        },
        setPCBPart(part){
            for(var i=0; i<this.accountItem.optionPSC.length; i++){
                if(this.accountItem.optionPSC[i].column_interface == 'ATTRIBUTE2')
                    this.accountItem.optionPSC[i].column_data_value = part.PP_M1_NAME;
                if(this.accountItem.optionPSC[i].column_interface == 'ATTRIBUTE3')
                    this.accountItem.optionPSC[i].column_data_value = part.PP_M1_REVISION;
            }
            if(this.$refs.pcbSampleOrderListComponent){
                this.accountItem.pcb_part_number = part.PP_M1_NAME;
                this.$refs.pcbSampleOrderListComponent.search_string = this.accountItem.pcb_part_number;
                this.$refs.pcbSampleOrderListComponent.searchData();
            }

            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "pcb_part_search")
                    this.accountItem.option[i].column_data_value = part.PP_M1_NAME;
                else if(this.accountItem.option[i].column_interface == "PART_REVISION")
                    this.accountItem.option[i].column_data_value = part.PP_M1_REVISION;
            }
        },
        async setPCBAOrderHistory(data){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+ vm.accountItem.org_id +'/'+ vm.accountItem.account_id , null)
                .then(function(res){
                    vm.accountItem.option = res.data.accountOptions;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    this.showProgressModal = false;
                    return;
                });
            // PCB Assembly 발주 history 내용 중 option 의 column_interface 와 동일한 항목 값 변경
            for(var i=0; i<vm.accountItem.option.length; i++){
                for(const key in data){
                    if(key == "TOTAL_COST")
                        continue;
                    if(vm.accountItem.option[i].column_interface == key){
                        vm.accountItem.option[i].column_data_value = data[key]["column_data_value"]
                        vm.accountItem.option[i].column_data_value2 = data[key]["column_data_value2"]
                    }
                }
            }
            this.showProgressModal = false;
        },
        async setPCBOrderHistory(data){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+ vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountItem.optionPSC = res.data.accountOptionsPSC;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    this.showProgressModal = false;
                    return;
                });
            // PCB 발주 history 내용 중 optionPSC 의 column_interface 와 동일한 항목 값 변경
            for(var i=0; i<vm.accountItem.optionPSC.length; i++){
                for(const key in data){
                    if(key == "TOTAL_COST")
                        continue;
                    if(vm.accountItem.optionPSC[i].column_interface == key){
                        vm.accountItem.optionPSC[i].column_data_value = data[key]["column_data_value"]
                        vm.accountItem.optionPSC[i].column_data_value2 = data[key]["column_data_value2"]
                    }
                }
            }
            this.showProgressModal = false;
        },
        async updateAssetRegisterValue(){
            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/updateAssetRegisterValue/', vm.accountItem )
                .then(function(res){
                    vm.accountItem.asset_register_enable = res.data.asset_register_enable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            this.showProgressModal = false;
        },

        // Account Summary function
        selectTransferAccountSummaryItem(acc){
            if(acc.item_type == "execution")
                return;
            this.selectTransferAccountSummary = acc;
        },
        add_new_budget(event){
            if(event) event.preventDefault();
            this.account_mode = "new";
            this.transferAccountSummary = {};
            this.transferAccountSummary.item_type = "Add";
            this.transferAccountSummary.account_year = year;
            this.transferAccountSummary.account_month = month;
            this.accountSummaryInfoModal = true;
        },
        add_transfer(event){
            if(event) event.preventDefault();
            this.account_mode = "new";
            this.transferAccountSummary = {};
            this.transferAccountSummary.item_type = "Transfer";
            this.transferAccountSummary.from_account_year = year;
            this.transferAccountSummary.from_account_month = month;
            this.transferAccountSummary.account_year = year;
            this.transferAccountSummary.account_month = month;
            this.accountSummaryInfoModal = true;
        },
        delete_accounts_summary(event){
            if(event) event.preventDefault();
            if(!this.selectTransferAccountSummary.account_id){
                warningModal.show_modal("Select a accounts summary item!");
                return;
            }
            this.delete_item = "transfer_account_summary";
            confirmModal.show_modal(this);
        },
        async detailTransferAccountSummary(item){
            this.account_mode = "view";
            this.accountSummaryInfoModal = true;
            //this.transferAccountSummary = {};
            this.transferAccountSummary = JSON.parse(JSON.stringify(item));
            this.selectTransferAccountSummary = this.transferAccountSummary;
        },
        setOrganizationAndAccountTFrom(item){
            if(!item.id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            if(item.rght - item.lft > 1){
                warningModal.show_modal("Select a child account!");
                return;
            }
            this.transferAccountSummary.from_org_id = item.org_id;
            this.transferAccountSummary.from_org_name = item.org_name;
            this.transferAccountSummary.from_au_code = item.au_code;
            this.transferAccountSummary.from_account_id = item.id;
            this.transferAccountSummary.from_account_name = item.account_name;
            this.transferAccountSummary.from_account_code = item.account_code;
            this.transferAccountSummary.from_project_code = item.project_code;
            this.transferAccountSummary.from_project_name = item.project_name;
            this.transferAccountSummary.from_account_with_project = item.account_with_project;
            this.transferAccountSummary.from_account_remain = item.remain_cost;
            this.transferAccountSummary.from_account_month = item.execution_month;
        },
        setOrganizationAndAccountTTo(item){
            if(!item.id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            if(item.rght - item.lft > 1){
                warningModal.show_modal("Select a child account!");
                return;
            }
            this.transferAccountSummary.org_id = item.org_id;
            this.transferAccountSummary.org_name = item.org_name;
            this.transferAccountSummary.au_code = item.au_code;
            this.transferAccountSummary.account_id = item.id;
            this.transferAccountSummary.account_name = item.account_name;
            this.transferAccountSummary.account_code = item.account_code;
            this.transferAccountSummary.project_code = item.project_code;
            this.transferAccountSummary.project_name = item.project_name;
            this.transferAccountSummary.account_with_project = item.account_with_project;
            this.transferAccountSummary.account_remain = item.remain_cost ;
            this.transferAccountSummary.account_month = item.execution_month;
        },
        transfer_account_summary_form_validation(){
            var requiredElements = document.querySelector("#transfer_account_summary_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitAccountSummaryInfoFormModal(){
            if(this.transfer_account_summary_form_validation()) return false;
            if(this.account_mode == 'new'){
                var new_item = {};
                new_item = JSON.parse(JSON.stringify(this.transferAccountSummary));
                if(!this.item.transfer_account_summary)
                    this.item.transfer_account_summary = [];
                this.item.transfer_account_summary.push(new_item);
                this.selectTransferAccountSummary = new_item;
            }else if(this.account_mode == 'modify'){
                for(var i=0; i<this.item.transfer_account_summary.length; i++){
                    if(this.item.transfer_account_summary[i] == this.selectTransferAccountSummary){
                        this.item.transfer_account_summary[i] = JSON.parse(JSON.stringify(this.transferAccountSummary));
                        this.selectTransferAccountSummary = this.item.transfer_account_summary[i];
                    }
                }
            }
            this.item.budget_mode = budget_mode;
            await this.loadAccountSummary(check=true);

            this.accountSummaryInfoModal = false;
            this.account_mode = "view";
        },
        cancelAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.detailTransferAccountSummary(this.transferAccountSummary);
            //this.modifyAccountSummaryInfoFormModal();
            this.account_mode = "view";
        },
        closeAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.accountSummaryInfoModal = false;
            this.account_mode = "view";
        },
        modifyAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.account_mode = "modify";
            this.accountSummaryInfoModal = true;
            // this.transferAccountSummary = JSON.parse(JSON.stringify(this.selectTransferAccountSummary));
        },
        setProjectAccountSummaryFrom(project){
            this.transferAccountSummary.from_project_name = project.project_name;
            this.transferAccountSummary.from_project_code = project.project_code;
            this.transferAccountSummary.from_account_with_project = false;
        },
        setProjectAccountSummaryTo(project){
            this.transferAccountSummary.project_name = project.project_name;
            this.transferAccountSummary.project_code = project.project_code;
            this.transferAccountSummary.account_with_project = false;
        },
        isNumeric(num){
            num = String(num).replace(/^\s+|\s+$/g, "");
            var regex = /^[0-9]+(\.[0-9]+)?$/g;
            if( regex.test(num) ){
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            }else{ return false;  }
        },
        openPopupNotice(){
            if(this.$refs.accountListPopupComponent){
                this.$refs.accountListPopupComponent.popupModal = true;
            }
        },
        async partSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.partSearchModalComponent.search_string = text;
                    this.$refs.partSearchModalComponent.searchData();
                }else{
                    this.$refs.partSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for partSearch Result
        selectedPart(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "part_search")
                    this.accountItem.option[i].column_data_value = item.part_number;
                else if(this.accountItem.option[i].column_interface == "_PRODUCT_")
                    this.accountItem.option[i].column_data_value = item.description;
                else if(this.accountItem.option[i].column_interface == "_SPECIFICATION_")
                    this.accountItem.option[i].column_data_value = item.sepecification;
            }
            this.accountItem.unit_cost = item.part_cost;
        },
        async modelSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.modelSearchModalComponent.search_string = text;
                    this.$refs.modelSearchModalComponent.searchData();
                }else{
                    this.$refs.modelSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for modelSearch Result
        selectedModel(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "model_search")
                    this.accountItem.option[i].column_data_value = item.model_name;
                else if(this.accountItem.option[i].column_interface == "MODEL_COST")
                    this.accountItem.option[i].column_data_value = item.model_cost;
                else if(this.accountItem.option[i].column_interface == "PV_SET_STD_UNIT")
                    this.accountItem.option[i].column_data_value = item.pv_set_std_unit;
                else if(this.accountItem.option[i].column_interface == "PV_SET_CO_UNIT")
                    this.accountItem.option[i].column_data_value = item.pv_set_co_unit;
                else if(this.accountItem.option[i].column_interface == "GRADE")
                    this.accountItem.option[i].column_data_value = item.project_grade;
            }
            this.accountItem.project_name = item.project_name;
            this.accountItem.project_code = item.project_code;
            this.accountItem.account_with_project = false;
            this.accountItem.unit_cost = item.model_cost;
        },
        async assetSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.assetSearchModalComponent.search_asset_number = text;
                    this.$refs.assetSearchModalComponent.searchData();
                }else{
                    this.$refs.assetSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for assetSearch Result
        selectedAsset(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "asset_search")
                    this.accountItem.option[i].column_data_value = item.asset_number;
                else if(this.accountItem.option[i].column_interface == "ASSET_INPUT_COST")
                    this.accountItem.option[i].column_data_value = item.asset_cost;
                else if(this.accountItem.option[i].column_interface == "ASSET_REMAIN_COST")
                    this.accountItem.option[i].column_data_value = item.asset_remain_cost;
                else if(this.accountItem.option[i].column_interface == "ASSET_INPUT_DATE")
                    this.accountItem.option[i].column_data_value = item.create_date;
                else if(this.accountItem.option[i].column_interface == "ASSET_CATEGORY")
                    this.accountItem.option[i].column_data_value = item.asset_category;
                else if(this.accountItem.option[i].column_interface == "_PRODUCT_")
                    this.accountItem.option[i].column_data_value = item.asset_product;
                else if(this.accountItem.option[i].column_interface == "_MODEL_")
                    this.accountItem.option[i].column_data_value = item.asset_model;
                else if(this.accountItem.option[i].column_interface == "_MAKER_")
                    this.accountItem.option[i].column_data_value = item.asset_maker;
            }
        },
        // emit function for assetCategorySearch Result
        selectedAssetCategory(item){
            if(this.accountItem.option){
                for(var i=0; i<this.accountItem.option.length; i++){
                    if(this.accountItem.option[i].data_type == "asset_category_search"){
                        this.accountItem.option[i].column_data_value = item.asset_category;
                        this.accountItem.option[i].column_data_value2 = item.id;
                    }
                }
            }
        },
        async freightChargeSearch(text){
            this.freightChargeSearchModal = true;
            if(this.$refs.freightChargeSearchModalComponent){
                this.$refs.freightChargeSearchModalComponent.openSearchModal();
            }
        },
        // emit function for freightChargeSearchModalComponent Result
        selectedFreightCharge(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "freight_charge_search")
                    this.accountItem.option[i].column_data_value = item.freight_charge_name;
                else if(this.accountItem.option[i].column_interface == "FREIGHT_WEIGHT")
                    this.accountItem.option[i].column_data_value = item.freight_weight;
            }
            this.accountItem.unit_cost = item.freight_cost;
            this.freightChargeSearchModal = false;
        },
        // emit function for freightChargeSearchModalComponent Result
        closedFreightChargeModal(){
            this.freightChargeSearchModal = false;
        },
        async showMassUploadModal(event){
            if(event) event.preventDefault();
            this.$nextTick(() => {
                this.$refs.budgetExecutionMassUploadComponent.openModal();
            });
        },

        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
        viewBudgetItem(master_id){
            this.mode = "view";
            this.newWindow('1200','750','',"detailExecutionForm"+master_id);
            document.submitForm.target = "detailExecutionForm"+master_id;
            document.submitForm.action = "./document/"+master_id;
            document.submitForm.submit();
        },
        changeSwitchData(data){
            this.switchTab = data;
            this.selected_split_item = {};
        },
    },
    computed:{
        componentFormDialog(){
            if(! this.accountItem.option) return false;
            for(var e=0; e<this.accountItem.option.length; e++){
                if(this.accountItem.option[e].data_type == 'component'){
                    if(this.accountItem.option[e].column_data_value){
                        if(this.accountItem.option[e].column_data_value.includes("__E")){
                            // accountItem.estimation_data 가 없을 경우 object 생성
                            if(!this.accountItem.estimation_data)
                                this.accountItem.estimation_data = {};

                            this.accountItem.estimation_data.estimation_key = this.accountItem.option[e].column_data_value;
                            // estimation_key 값 변경시 vue component 의 값도 method 호출하여 변경
                            if(this.$refs.accountEstimationInfoComponent)
                                this.$refs.accountEstimationInfoComponent.changeEstId();

                            return true;
                        }
                    }
                }
            }
            if(this.accountItem.estimation_data)
                delete this.accountItem.estimation_data;
            return false;
        },
        cal_totalCost(){
            if(this.accountItem){
                // pcb sample 일 경우 sample_cost --> total_cost 적용
                if(this.accountItem.pcb_sample_cost_enable && this.accountItem.optionPSC){
                    for(var at=0; at<this.accountItem.optionPSC.length; at++){
                        if(this.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                            this.accountItem.total_cost = this.accountItem.optionPSC[at].column_data_value;
                            return this.markedCost(this.accountItem.total_cost);
                        }
                    }
                }
                // pcb stencil 일 경우 stencil_cost --> total_cost 적용
                if(!this.accountItem.pcb_sample_cost_enable && this.accountItem.pcb_stencil_cost_enable
                    && this.accountItem.optionStencil){
                    for(var at=0; at<this.accountItem.optionStencil.length; at++){
                        if(this.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                            this.accountItem.total_cost = this.accountItem.optionStencil[at].column_data_value;
                            return this.markedCost(this.accountItem.total_cost);
                        }
                    }
                }

                // 그외 일반적인 unit_count * unit_cost --> total_cost 적용
                if(this.accountItem.unit_count && this.accountItem.unit_cost){
                    this.accountItem.total_cost = parseInt(this.accountItem.unit_count * this.accountItem.unit_cost);
                    return this.markedCost(this.accountItem.total_cost);
                }
            }
            this.accountItem.total_cost = "";
            return this.markedCost(this.accountItem.total_cost);
        },
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
