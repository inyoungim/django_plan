<template>
    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">
        <div class="hstack mb-1">
            <button v-if="this.$props.pmode != 'addItem'" class="input-group-text py-0" @click="toggleOrgList">
                <i class="bi bi-arrow-left-right" style="cursor:pointer"></i>
            </button>
            <i class="bi bi-people-fill px-1">
                <span v-if="selectedOrgName" class="fst-normal text-danger">[{{this.$props.selectedOrg.id}}]</span>
            </i>
            <span v-if="selectedOrgName">{{selectedOrgName}}</span>
            <span v-else>None</span>

            <div v-if="selectedOrgName" class="ms-3 me-1">
                <input type="checkbox" v-model="checkChildOrganization" @change="loadData"> Include Children
            </div>
            <div v-if="selectedOrgName" class="ms-auto me-1">
                <input type="checkbox" v-model="viewSimple"> View only that have cost.
            </div>
        </div>

        <div v-if="this.$props.pmode == 'execution'" class="hstack">
            <div v-if="selectedOrgName" class="col mb-1 text-start">
                <div class="col input-group" style="width:320px;">
                    <lable v-if="this.$props.selectedOrg" class="input-group-text">Year</lable>
                    <div v-if="this.$props.selectedOrg"class="form-control ps-2"> {{this.$props.selectedOrg.year}}</div>

                    <lable class="input-group-text py-0">Month</lable>
                    <div class="form-control p-0" style="padding:0.1em 0.5em;">
                        <select v-model="startMonth" class="form-select border-0" @change="changeMonth('start')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                    <i class="input-group-text p-0" class="bi bi-dash"></i>
                    <div class="form-control p-0" style="padding:0.1em 0.5em;">
                        <select v-model="endMonth" class="form-select border-0" @change="changeMonth('end')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                </div>
            </div>
            <div v-if="selectedOrgName" class="col-auto ms-auto mb-1">
                <div class="input-group">
                    <label class="input-group-text py-1" style="min-width:100px;">Project Name(Code)</label>
                    <label class="input-group-text py-1" style="min-width:100px;">
                        {{ project_name }} <span v-if="project_code">({{ project_code }})</span>
                    </label>
                    <div class="input-group-text p-0">
                            <project-select-component
                                ref="projectSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :div_name="this.$props.div_name"
                                @select-target="setProject"></project-select-component>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor: pointer;" @click="clearProject"></i>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="this.$props.pmode == 'execution'" class="table-responsive">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;" >
                    <tr>
                        <th colspan="2" class="py-1 text-center align-middle">
                            Account
                            <span v-if="viewPath">Path</span><span v-else>Name</span>
                            <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                                <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                                <i v-else class="bi bi-signpost"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                <i v-else class="bi bi-tag"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_code = !toggle_code">
                                <i v-if="toggle_code" class="bi bi-c-square-fill text-danger"></i>
                                <i v-else class="bi bi-c-square"></i>
                            </label>
                        </th>
                        <th colspan="2" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">계획</span><span v-else>Plan</span>
                        </th>
                        <th colspan="3" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">조정</span><span v-else>Adjustment</span>
                        </th>
                        <th rowspan="2" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang=='kr'">가용</span><span v-else>Available</span>
                        </th>
                        <th colspan="2" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">실적</span><span v-else>Closing</span>
                        </th>
                        <th rowspan="2" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang=='kr'">잔여</span><span v-else>Remain</span>
                        </th>
                        <th rowspan="2" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang=='kr'">집행</span><span v-else>Execution</span>
                        </th>
                    </tr>
                    <tr>
                        <th colspan="2" class="p-0 text-start">
                            <div class="input-group">
                                <label class="input-group-text border-0" style="cursor:pointer" @click="enableFilter">
                                    <i v-if="!filter_enable" class="bi bi-funnel"></i>
                                    <i v-else class="bi bi-funnel-fill"></i>
                                </label>
                                <input class="form-control border-0 border-end" v-model="filter_name" :disabled="!filter_enable">
                                <label class="input-group-text border-0" style="cursor:pointer" @click="moveFocus">
                                    <i class="bi bi-send"></i>
                                </label>
                            </div>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">운영</span><span v-else>Operation</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">변동</span><span v-else>Flexible</span>
                        </th>

                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">이월</span><span v-else>Carry</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">추가</span><span v-else>Add</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">전용</span><span v-else>Transfer</span>
                        </th>

                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">대기</span><span v-else>Waiting</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">완료</span><span v-else>Result</span>
                        </th>
                    </tr>
                </thead>
                <tbody v-if="selectedOrgName" v-for="item,index in itemList">
                    <tr v-if="isView(item)" class="bg-opacity-25"
                        :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto"  style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span>
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span v-if="toggle_code" class="text-danger"><{{ item.account_code }}></span>
                                <span v-if="viewPath">{{ item.account_path }}</span>
                                <span v-else>{{ item.account_name }}</span>
                            </span>
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer; width:25px;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'graph'}"
                            @click="viewBudgetList(item,'graph')"><i class="bi bi-graph-up"></i></td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month'}"
                            @click="viewBudgetList(item,'plan_month')">{{ markedCost(item.planMonthCost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'confirm_month'}"
                            @click="viewBudgetList(item,'confirm_month')">{{ markedCost(item.confirmedMonthCost) }}</td>

                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'carry'}"
                            @click="viewBudgetList(item,'carry')">{{ markedCost(item.carriedMonthCost) }}</td>
                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'add'}"
                            @click="viewBudgetList(item,'add')">{{ markedCost(item.addedMonthCost) }}</td>
                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'transfer'}"
                            @click="viewBudgetList(item,'transfer')">{{ markedCost(item.transferredMonthCost) }}</td>

                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'available_month'}"
                            >{{ markedCost(item.availableMonthCost) }}</td>

                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'closing_waiting'}"
                            @click="viewBudgetList(item,'closing_waiting')">{{ markedCost(item.waitingMonthCost) }}</td>
                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'closing_result'}"
                            @click="viewBudgetList(item,'closing_result')">{{ markedCost(item.resultMonthCost) }}</td>

                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'execute_remain'}"
                            >{{ markedCost(item.remainMonthCost) }}</td>

                        <td class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'execute_month'}"
                            @click="viewBudgetList(item,'execute_month')">{{ markedCost(item.executedMonthCost) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div v-else-if="this.$props.pmode == 'plan'" class="table-responsive">
            <table class="table table-hover table-bordered" style="overflow: scroll;">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;" >
                    <tr>
                        <th colspan="1" class="py-1 text-center align-middle">Account</th>
                        <th colspan="13" class="py-1 text-center align-middle">Month</th>
                    </tr>
                    <tr>
                        <th class="p-0 text-start">
                            <div class="input-group">
                                <label class="input-group-text border-0" style="cursor:pointer" @click="enableFilter">
                                    <i v-if="!filter_enable" class="bi bi-funnel"></i>
                                    <i v-else class="bi bi-funnel-fill"></i>
                                </label>
                                <input class="form-control border-0 border-end" v-model="filter_name" :disabled="!filter_enable">
                                <label class="input-group-text border-0" style="cursor:pointer" @click="moveFocus">
                                    <i class="bi bi-send"></i>
                                </label>
                            </div>
                        </th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">1월</span><span v-else>Jan.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">2월</span><span v-else>Feb.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">3월</span><span v-else>Mar.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">4월</span><span v-else>Apr.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">5월</span><span v-else>May.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">6월</span><span v-else>Jun.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">7월</span><span v-else>Jul.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">8월</span><span v-else>Aug.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">9월</span><span v-else>Sep.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">10월</span><span v-else>Oct.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">11월</span><span v-else>Nov.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">12월</span><span v-else>Dec.</span></th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.selectedOrg">{{this.$props.selectedOrg.year + 1}} Year</span>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="item,index in itemList" class="shadow-sm">
                    <tr v-if="isView(item)" class="bg-opacity-25"
                        :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto"  style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                            <span style="cursor:pointer;" @click="viewBudgetList(item)">{{ item.account_name }}</span>
                            <div v-if="index == 0" class="ps-2">
                                <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                    <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                    <i v-else class="bi bi-tag"></i>
                                </label>
                            </div>
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 1 && 1 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',1)">{{ markedCost(item.planMonth1Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 2 && 2 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',2)">{{ markedCost(item.planMonth2Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 3 && 3 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',3)">{{ markedCost(item.planMonth3Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 4 && 4 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',4)">{{ markedCost(item.planMonth4Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 5 && 5 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',5)">{{ markedCost(item.planMonth5Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 6 && 6 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',6)">{{ markedCost(item.planMonth6Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 7 && 7 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',7)">{{ markedCost(item.planMonth7Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 8 && 8 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',8)">{{ markedCost(item.planMonth8Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 9 && 9 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',9)">{{ markedCost(item.planMonth9Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 10 && 10 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',10)">{{ markedCost(item.planMonth10Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 11 && 11 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',11)">{{ markedCost(item.planMonth11Cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 12 && 12 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',12)">{{ markedCost(item.planMonth12Cost) }}</td>
                        <td class="text-end text-success" class="bg-opacity-25 text-end text-success" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_year'}"
                            @click="viewBudgetList(item,'plan_year')">{{ markedCost(item.planYearCost) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>


        <div v-if="this.$props.pmode == 'addItem'" >
            <div class="col mt-2 mb-1 text-start">
                <div class="col input-group" style="width:230px;">
                    <lable v-if="this.$props.selectedOrg" class="input-group-text py-0">Year</lable>
                    <div v-if="this.$props.selectedOrg"class="form-control p-0 ps-2"> {{this.$props.selectedOrg.year}}</div>

                    <lable class="input-group-text py-0">Month</lable>
                    <div class="form-control p-0" style="padding:0.1em 0.5em;">
                        <select v-model="startMonth" class="form-select border-0" style="padding:0.1em 0.5em;" @change="changeMonth('all')">
                            <option v-for="n in (12)" :value="n"
                                    :disabled="this.$props.pmode == 'addItem' && this.$props.month > n">{{n}}</option>
                        </select>
                    </div>
                </div>
                <div class="input-group mt-1">
                    <label class="input-group-text py-1" style="cursor:pointer" @click="enableFilter">
                        <i v-if="!filter_enable" class="bi bi-funnel"></i>
                        <i v-else class="bi bi-funnel-fill"></i>
                    </label>
                    <input class="form-control py-1" v-model="filter_name" :disabled="!filter_enable">
                    <label class="input-group-text py-1" style="cursor:pointer" @click="moveFocus">
                        <i class="bi bi-send"></i>
                        <link href="/static/css/bootstrap-icons.css" rel="stylesheet" />
                    </label>
                </div>
            </div>
        </div>

        <div v-if="this.$props.pmode == 'addItem'" class="table-responsive" style="max-height:500px;">
            <table class="table table-hover table-bordered" style="overflow: scroll;">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;" >
                    <tr>
                        <th class="py-1 text-center">
                            Account
                            <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                                <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                                <i v-else class="bi bi-signpost"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                <i v-else class="bi bi-tag"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_code = !toggle_code">
                                <i v-if="toggle_code" class="bi bi-c-square-fill text-danger"></i>
                                <i v-else class="bi bi-c-square"></i>
                            </label>
                        </th>
                        <th class="py-1 text-center">Remain</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm" style="max-height:500px;">
                    <tr v-for="item,index in itemList" :id="item.id" v-show="isView(item)" class="bg-opacity-25"
                         :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start" style="cursor:pointer;"
                            @click="selectAccount(item)" @dblclick="dblClick">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto" style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span>
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span v-if="toggle_code" class="text-danger"><{{ item.account_code }}></span>
                                <span v-if="viewPath">{{ item.account_path }}</span>
                                <span v-else>{{ item.account_name }}</span>
                            </span>
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id}"
                            @click="selectAccount(item)" @dblclick="dblClick">
                            {{ markedCost(item.remainMonthCost) }}
                        </td>
                    </tr>
                </tbody>
            </table>
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
    props : ['site','lang','pmode','selectedOrg','month','acl','div_name'],
    components: {
        'project-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/projectSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            selectedOrg : this.$props.selectedOrg,
            startMonth : this.$props.month,
            endMonth : this.$props.month,
            project_name : "",
            project_code : "",
            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedColumn :"",
            viewSimple : true,
            showProgressModal : "",
            toggle_id : false,
            toggle_code : false,
            viewPath : false,
        }
    },
    mounted(){
        if(this.$props.pmode == 'addItem'){
            this.loadData();
            this.viewSimple = false;
        }
    },
    methods: {
        // emit of projectSelectComponent
        setProject(project){
            this.project_name = project.project_name;
            this.project_code = project.project_code;
            this.loadData();
        },
        clearProject(){
            this.project_name = "";
            this.project_code = "";
            this.loadData();
        },
        changeMonth(arg){
            if(arg == "all"){
                if(this.$props.pmode == 'addItem' && this.$props.month > this.startMonth){
                    warningModal.show_modal("You can not select past month.");
                    this.startMonth = this.$props.month;
                    return;
                }
                this.endMonth = this.startMonth;
            }else if(arg == "start"){
                if(this.startMonth > this.endMonth)
                    this.endMonth = this.startMonth;
            }else{
                if(this.startMonth > this.endMonth)
                    this.startMonth = this.endMonth;
            }
            this.loadData();
        },
        async loadData(event,selectedItemId=''){
            if(event) event.preventDefault();
            if(this.$props.selectedOrg.id == undefined){
                this.itemList = [];
                return;
            }
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/getBudgetAmount',
                    { params:{  mode : vm.$props.pmode,
                                organization_id: vm.$props.selectedOrg.id,
                                include_child_organization: vm.checkChildOrganization,
                                start_month : vm.startMonth,
                                end_month : vm.endMonth,
                                project_code : this.project_code
                    } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            if(!this.openItemList.includes(this.itemList[0].id))
                this.openItemList.push(this.itemList[0].id);

            // edit state : do not refresh others
            if(selectedItemId == '0'){
                return;
            }else if(selectedItemId == ''){
                selectedItemId = vm.selectedItem.id;
            }

            var selectedItemMatching = false;
            for(var i=0; i<vm.itemList.length; i++){
                if(vm.itemList[i].id == selectedItemId){
                    vm.selectedItem = vm.itemList[i];
                    vm.viewBudgetList(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            if(selectedItemMatching == false){
                vm.selectedItem = {};
            }
            this.expandAll();
        },
        addOpenItemList(target='current'){
            if(target == 'current'){
                if(this.openItemList.indexOf(this.selectedItem.id) == -1)
                    this.openItemList.push(this.selectedItem.id);
            }else{
                if(this.openItemList.indexOf(target) == -1)
                    this.openItemList.push(target);
            }
        },
        // open all parents node and select id node
        async openSelectItem(id){
            this.showProgressModal = "show";
            var vm = this;
            var result = [];
            await axios.get('./api/getAccountParents/'+id, null)
                .then(function(res){
                    result = res.data.idList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            for(var a=0; a<result.length; a++){
                if(!vm.openItemList.includes(result[a])){
                    vm.openItemList.push(result[a]);
                }
            }
            vm.selectItemID(id);
            this.showProgressModal = "";
        },
        toggle(item) {
            let index = this.openItemList.indexOf(item.id);
            if(index > -1){
                this.openItemList.splice(index,1);
                for(var i=0; i<this.itemList.length; i++){
                    if(this.itemList[i].tree_id == item.tree_id &&
                        this.itemList[i].lft > item.lft && this.itemList[i].rght < item.rght){
                        index = this.openItemList.indexOf(this.itemList[i].id);
                        if(index > -1)
                            this.openItemList.splice(index,1);
                        if(this.selectedItem == this.itemList[i]){
                            this.selectedItem = {};
                            this.viewBudgetList(this.selectedItem);
                        }
                    }
                }
            }else{
                this.openItemList.push(item.id);
            }
        },
        selectItemID(id) {
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
        },
        viewBudgetList(item,target='',month=''){
            this.selectedItem = item;
            if(target != '')
                this.selectedColumn = target;

            if(month != ''){
                this.startMonth = month;
                this.endMonth = month;
            }
            if(target.includes('year')){
                this.startMonth = 1;
                this.endMonth = 12;
            }
            var startMonth = this.startMonth;
            var endMonth = this.endMonth;

            this.$emit('select-bfa-item', this.$props.selectedOrg, this.selectedItem,
                    this.selectedColumn, startMonth, endMonth, this.checkChildOrganization);
        },
        toggleOrgList(){
            this.$emit('toggle-orglist');
        },
        selectAccount(item){
            this.selectedItem = item;
            this.selectedItem.account_id = item.id;
            this.$emit('select-item',item, this.$props.selectedOrg, this.startMonth);
        },
        dblClick(){
            this.$emit('dblclick-item');
        },
        expandAll(){
            this.openItemList = [];
            for(var i=0; i<this.itemList.length; i++){
                this.openItemList.push(this.itemList[i].id);
            }
        },
        enableFilter(){
            this.filter_enable = !this.filter_enable;
            if(this.filter_enable){
                this.expandAll();
            }else{
                this.filter_name = "";
            }
        },
        async moveFocus(){
            if(!this.selectedItem.id) return;
            this.filter_name = "";
            this.filter_enable = false;
            this.openItemList = [];
            await this.openSelectItem(this.selectedItem.id);
            if(!this.selectedItem.id) return;
            this.$nextTick(() => {
                document.getElementById(this.selectedItem.id).scrollIntoView({block:"center"});
            });
        }
    },
    computed:{
        isView(){
            return(item)=>{
                //if(!item.planYearCost && this.viewSimple)  return false;
                if(!item.new_enable) return false;
                if(item.parent == null) return true;
                if(this.viewSimple){
                    if( !item.addedMonthCost && !item.availableMonthCost &&
                        !item.carriedMonthCost && !item.executedMonthCost &&
                        !item.planMonthCost && !item.remainMonthCost &&
                        !item.resultMonthCost && !item.transferredMonthCost)
                        return false;
                }
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.account_path.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.account_name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name )
                        return true;
                    else
                        return false;
                }
                //if(this.openItemList.indexOf(item.parent) > -1) return true;
                return false;
            }
        },
        folderSymbol(){
            return(pid)=>{
                if(this.openItemList.indexOf(pid) > -1)
                    return "<i class='bi bi-dash-square-fill text-secondary'></i>";
                return "<i class='bi bi-plus-square-fill text-primary'></i>";
            }
        },
        level(){
            return(item)=>{
                return "<div style='width:"+ item.level * 1.5 + "em;'></div>";
            }
        },
        selectedOrgName(){
            if(this.$props.selectedOrg)
                return this.$props.selectedOrg.org_name;
            return "";
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
