<template>

    <div class="table-responsive">
        <div class="hstack">
            <div class="col-auto">
                <div class="hstack">
                    <div class="col-auto input-group py-1" style="width:170px;">
                        <lable class="input-group-text py-1">Target Year</lable>
                        <select v-model="target_year" class="form-select" style="padding:0.1em 0.5em;"
                                @change="changeYear">
                            <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                            <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                            <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                            <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                        </select>
                    </div>
                    <div class="col-auto input-group ms-1 py-1" style="width:120px;">
                        <lable class="input-group-text py-1">Version</lable>
                        <select v-model="tdata.target_version" class="form-select" style="padding:0.1em 0.5em;"
                                @change="searchData">
                            <option v-for="ver in tdata.version_list" :value="ver">{{ ver }}</option>
                        </select>

                    </div>
                    <div class="col-auto input-group ms-1 py-1">
                        <lable class="input-group-text py-1" style="min-width:300px;">{{ tdata.version_comments }}</lable>
                    </div>
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:100px;">Model Name</span>
                    <input class="form-control shadow-sm py-1" placeholder="Model Name"
                           v-model="search_model" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:100px;">Creator</span>
                    <input class="form-control shadow-sm py-1" placeholder="User Name"
                           v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>

        </div>

        <div class="hstack">
            <div class="col-auto">
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
                                :year="target_year-1"
                                :preset_orgid="this.$props.preset_orgid"
                                @select-target="setOrganization">
                        </organization-select-component>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearOrganization"></i>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_child_organization"
                               @change="changeChildCheck"> Include Children
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
                                :year="target_year-1"
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

            <button class="btn btn-primary shadow-sm py-1 ms-auto" style="width:80px;" @click="execlDownload">Excel</button>
            <button class="btn btn-primary shadow-sm py-1 ms-1" style="width:80px;" @click="searchData">Search</button>
        </div>

        <div class="accordion my-2">
            <div class="accordion-item">
                <h2 class="accordion-header">
                    <button class="accordion-button" type="button" data-bs-toggle="collapse" data-bs-target="#collapseOne">
                        Difference
                    </button>
                </h2>
                <div id="collapseOne" class="accordion-collapse collapse show border-0">
                    <div class="accordion-body m-0 p-1 table-responsive">
                        <table class="table table-hover table-bordered m-0">
                            <thead style="background-color:#FFEEDD;">
                                <tr>
                                    <th class="py-1 text-center text-nowrap">Classification</th>
                                    <th class="py-1 text-center text-nowrap">Total Cost</th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">1월</span><span v-else>Jan.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">2월</span><span v-else>Feb.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">3월</span><span v-else>Mar.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">4월</span><span v-else>Apr.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">5월</span><span v-else>May.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">6월</span><span v-else>Jun.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">7월</span><span v-else>Jul.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">8월</span><span v-else>Aug.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">9월</span><span v-else>Sep.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">10월</span><span v-else>Oct.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">11월</span><span v-else>Nov.</span></th>
                                    <th class="py-1 text-center text-nowrap"><span v-if="this.$props.lang == 'kr'">12월</span><span v-else>Dec.</span></th>
                                </tr>
                            </thead>
                            <tbody v-if="tdata.pre_year" class="shadow-sm">
                                <tr>
                                    <td class="text-center text-nowrap">{{target_year -1}} Year Execution</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.total_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_1_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_2_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_3_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_4_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_5_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_6_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_7_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_8_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_9_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_10_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_11_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.pre_year.month_12_cost) }}</td>
                                </tr>
                                <tr v-if="tdata.plan_year">
                                    <td class="text-center text-nowrap">{{target_year}} Year Planning</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.total_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_1_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_2_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_3_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_4_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_5_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_6_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_7_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_8_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_9_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_10_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_11_cost) }}</td>
                                    <td class="text-end text-nowrap">{{ markedCost(tdata.plan_year.month_12_cost) }}</td>
                                </tr>
                                <tr v-if="tdata.pre_year && tdata.plan_year">
                                    <td class="text-center text-nowrap">Difference</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.total_cost , tdata.pre_year.total_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.total_cost , tdata.pre_year.total_cost) }}
                                    </td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_1_cost , tdata.pre_year.month_1_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_1_cost , tdata.pre_year.month_1_cost ) }}
                                    </td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_2_cost , tdata.pre_year.month_2_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_2_cost , tdata.pre_year.month_2_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_3_cost , tdata.pre_year.month_3_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_3_cost , tdata.pre_year.month_3_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_4_cost , tdata.pre_year.month_4_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_4_cost , tdata.pre_year.month_4_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_5_cost , tdata.pre_year.month_5_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_5_cost , tdata.pre_year.month_5_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_6_cost , tdata.pre_year.month_6_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_6_cost , tdata.pre_year.month_6_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_7_cost , tdata.pre_year.month_7_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_7_cost , tdata.pre_year.month_7_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_8_cost , tdata.pre_year.month_8_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_8_cost , tdata.pre_year.month_8_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_9_cost , tdata.pre_year.month_9_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_9_cost , tdata.pre_year.month_9_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_10_cost , tdata.pre_year.month_10_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_10_cost , tdata.pre_year.month_10_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_11_cost , tdata.pre_year.month_11_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_11_cost , tdata.pre_year.month_11_cost) }}</td>
                                    <td class="text-end text-nowrap"
                                        :class="{'text-danger' : markedDiffCost(tdata.plan_year.month_12_cost , tdata.pre_year.month_12_cost).includes('+') }">
                                        {{ markedDiffCost(tdata.plan_year.month_12_cost , tdata.pre_year.month_12_cost) }}</td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                </div>
            </div>
        </div>

        <table class="table table-hover table-bordered mt-2">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center">
                        <input class="form-check-input" type="checkbox"
                               :class="{'bg-secondary':checkNotMatch}"
                            v-model="allChecked" @click="checkAItem">
                    </th>
                    <th class="py-1 text-center">PK</th>
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
                    <th class="py-1 text-center text-nowrap">User Name</th>
                    <th class="py-1 text-center text-nowrap">Model Name</th>
                    <th class="py-1 text-center text-nowrap">Month</th>
                    <th class="py-1 text-center text-nowrap">Unit Cost</th>
                    <th class="py-1 text-center text-nowrap">Quantity</th>
                    <th class="py-1 text-center text-nowrap">Total Cost</th>
                    <th class="py-1 text-center text-nowrap">Description</th>
                    <th v-if="tdata.target_version > 1" class="py-1 text-center text-nowrap">Review Comments</th>
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
                <tr v-for="item in tdata.itemList" class="bg-opacity-25"
                    :class="{'bg-warning': checked_ids.includes(item.id)}">
                    <td class="text-center">
                        <input class="form-check-input bg-opacity-50" type="checkbox"
                                v-model="checked_ids" :value="item.id">
                    </td>
                    <td class="text-center text-nowrap">{{ item.id }}</td>
                    <td class="text-start text-nowrap">
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
                    <td class="text-end">{{ markedCost(item.unit_cost) }}</td>
                    <td class="text-end">{{ item.unit_count }}</td>
                    <td class="text-end">{{ markedCost(item.total_cost-item.transfer_cost) }}</td>
                    <td class="text-start"><span v-html="item.description"></span></td>
                    <td v-if="tdata.target_version > 1" class="text-start">
                        <span v-html="item.review_comment"></span>
                    </td>
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
                                <div v-if="this.$props.acl >= 5 && tdata.allow_modify">
                                    <button type="button" class="btn btn-primary shadow-sm"
                                            style="width:80px;" @click="newPlanItem">New</button>
                                    <button type="button" class="btn btn-primary shadow-sm ms-1"
                                            style="width:80px;" @click="excelUpload">Upload</button>
                                    <button type="button" class="btn btn-danger shadow-sm ms-2"
                                            style="width:80px;" @click="deletePlanItem">Delete</button>
                                    <!-- <button type="button" class="btn btn-primary shadow-sm ms-2"
                                            style="width:80px;" @click="modifyPlanItem">Modify</button> -->
                                </div>
                            </div>
                        </div>

                    </td>
                </tr>
            </tfoot>
        </table>
    </div>

    <div v-if="mode == 'new' || mode =='modify' || mode =='view'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div v-if="switchData == 'basic'" class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
             :class="{'modal-lg':edit_item.business_trip_enable || edit_item.account_plan_option_enable}">
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
                                <label class="input-group-text text-start text-wrap" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Organization</b>
                                </label>
                                <div class="form-control text-start input-group p-0 rnd-tooltip">
                                    <input type="hidden"
                                           class="form-control text-start border-0"
                                           name="Organization" v-model="edit_item.org_name" readonly required>
                                    <input type="hidden" class="form-control text-start border-0 border-end"
                                           name="Organization ID" v-model="edit_item.org_id" readonly required>
                                    <span class="form-control text-start border-0 border-start border-end" readonly>
                                        {{edit_item.org_name}}
                                        <span v-if="edit_item.org_id">({{edit_item.org_id}})</span>
                                    </span>
                                    <div v-if="mode !='view'" class="input-group-text border-0 p-0">
                                        <organization-select-component
                                                ref="organizationSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :acl="this.$props.acl"
                                                :div_name="this.$props.div_name"
                                                :year="this.$props.year-1"
                                                :preset_orgid="this.$props.preset_org_item.id"
                                                @select-target="setOrganizationForPlan">
                                        </organization-select-component>
                                    </div>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Account</b>
                                </label>
                                <div class="form-control text-start input-group p-0">
                                    <input type="hidden" class="form-control text-start border-0"
                                           name="Account" v-model="edit_item.account_name" readonly required>
                                    <input type="hidden" class="form-control text-start border-0 border-end"
                                           name="Account" v-model="edit_item.account_code" readonly required>
                                    <span class="form-control text-start border-0 border-start border-end" readonly>
                                        {{edit_item.account_name}}
                                        <span v-if="edit_item.account_code">({{edit_item.account_code}})</span>
                                    </span>
                                    <div v-if="mode =='new'" class="input-group-text border-0 p-0">
                                        <account-select-component
                                                ref="accountSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :acl="this.$props.acl"
                                                :div_name="this.$props.div_name"
                                                :pmode="'account'"
                                                @select-target="setAccountForPlan">
                                        </account-select-component>
                                    </div>
                                </div>
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
                            <div v-if="tdata.target_version > 1" class="input-group mt-1">
                                <label class="input-group-text text-start" style="width:120px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Review<br>Comments</b>
                                </label>
                                <textarea class="form-control bg-white" rows="3" :disabled="mode == 'view'"
                                       name="Review Comments" v-model="edit_item.review_comment" required></textarea>
                            </div>
                        </div>

                        <div v-if="edit_item.business_trip_enable" class="col-6 vstack align-top p-1">
                            <account-businesstrip-option-component
                                ref="accountBusinessTripOptionComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :pmode="mode"
                                :biz_data="edit_item.plan_biz_data"
                                @select-item="bizTripSelected">
                            </account-businesstrip-option-component>
                        </div>

                        <div v-if="edit_item.account_id" class="vstack align-top p-1"
                             :class="{'col-6': edit_item.account_plan_option_enable}">
                            <account-plan-option-component
                                ref="accountPlanOptionComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :pmode="mode"
                                :account_id="edit_item.account_id"
                                :plan_id="edit_item.id"
                                @open-account-plan-option="edit_item.account_plan_option_enable=true"
                                @close-account-plan-option="edit_item.account_plan_option_enable=false">
                            </account-plan-option-component>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <iftag v-if="this.$props.acl >= 5 && tdata.allow_modify">
                            <div v-if="mode == 'new'" class="btn btn-primary me-2" style="width:100px;"
                                 @click="submitFormModal">Submit</div>
                            <div v-if="mode == 'new'" class="btn btn-primary me-2" style="min-width:100px;"
                                 @click="submitCopyFormModal">Submit & Continue</div>
                            <div v-if="mode == 'view'" class="btn btn-primary me-2" style="width:100px;"
                                 @click="modifyBudgetItem">Modify</div>
                            <div v-if="mode == 'view'" class="btn btn-primary me-2" style="min-width:100px;"
                                 @click="copyBudgetItem">Copy New Item</div>
                            <div v-if="mode == 'view'" class="btn btn-danger me-2" style="width:100px;"
                                 @click="deleteFormModal">Delete</div>

                            <div v-if="mode == 'modify'" class="btn btn-primary me-2" style="width:100px;"
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
                                    :div_name="this.$props.div_name"
                                    :year="this.$props.year"
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
            :div_name="this.$props.div_name"
            :year="this.$props.year"
            :version="tdata.target_version"
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
    props : ['site','lang','acl','div_name','year','preset_org_item','check_child_org'],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
        'account-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountSelectComponent.vue', vueLoaderOptions) ),
        'budget-plan-history-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanHistoryComponent.vue', vueLoaderOptions) ),
        'account-businesstrip-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountBusinessTripOptionComponent.vue', vueLoaderOptions) ),
        'account-plan-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountPlanOptionComponent.vue', vueLoaderOptions) ),
        'budget-plan-mass-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanMassUploadComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            org_item : this.$props.preset_org_item,
            account_item : {},
            target_year : this.$props.year,
            include_child_organization : this.$props.check_child_org,
            include_child_account : true,
            switchData : "basic",
            search_model: '',
            search_user: '',
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            edit_item : {},
            showProgressModal : false,
            checked_ids:[],
            checked_items : [],
            checked_all:false,

            pre_year : {},
            plan_year : {},

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
        // emit function
        updateResult(){
            this.massPlanUploadModal=false;
            this.page(this.active_page, this.page_num);
        },
        changeSwitchData(data){
            this.switchData = data;
        },
        async setAccount(item){
            var tem_obj = this.account_item;
            this.account_item = item;
            if(tem_obj.id != item.id)
                this.page(1, this.page_num );
        },
        setOrganizationForPlan(item){
            this.edit_item.org_id = item.id;
            this.edit_item.org_name = item.org_name;
        },
        async setAccountForPlan(item){
            this.edit_item.account_id = item.id;
            this.edit_item.account_name = item.account_name;
            this.edit_item.account_code = item.account_code;
            this.edit_item.business_trip_enable = item.business_trip_enable;
            this.edit_item.plan_biz_data = {};
            if(this.$refs.accountPlanOptionComponent){
                this.$refs.accountPlanOptionComponent.account_id = item.id;
                if(this.mode == 'new' || this.mode == 'modify'){
                    this.$refs.accountPlanOptionComponent.loadData(item.id);
                }
            }
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
        clearOrgAndAccount(){
            this.org_item = {};
            this.account_item = {};
        },
        changeYear(){
            this.org_item = {};
            this.account_item = {};
            this.searchData();
            this.$emit('change-year',this.target_year);
        },
        changeChildCheck(){
            this.searchData();
            this.$emit('change-org-child-check',this.include_child_organization);
        },
        newPlanItem(){
            this.mode = "new";
            this.switchData = "basic";
            this.showFormModal = "show";
            this.edit_item = {};
            if(this.org_item.id){
                this.edit_item.org_name = this.org_item.org_name;
                this.edit_item.org_id = this.org_item.id;
            }
            if(this.account_item.id && this.account_item.rght - this.account_item.lft == 1 ){
                this.edit_item.account_name = this.account_item.account_name;
                this.edit_item.account_id = this.account_item.id;
                this.edit_item.account_code = this.account_item.account_code;
                this.edit_item.business_trip_enable = this.account_item.business_trip_enable;
            }
            this.edit_item.month = 1;
        },
        excelUpload(){
            if(!this.tdata.target_version){
                warningModal.show_modal("Please make new version.");
                return true;
            }
            this.massPlanUploadModal = true;
        },
        modifyBudgetItem(){
            this.mode = "modify";
        },
        copyBudgetItem(){
            this.mode = "new";
        },
        checkAItem(event){
            this.checked_ids = [];
            if(this.tdata.itemList){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(!this.allChecked){
                        this.checked_ids.push(this.tdata.itemList[i].id);
                        this.checked_items.push(this.tdata.itemList[i]);
                    }
                }
            }
        },
        modifyPlanItem(){
            this.viewBudgetItem(this.selected_item);
            this.mode = "modify";
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
            confirmModal.show_modal(this);
        },
        async viewBudgetItem(item){
            this.mode = "view";
            this.selected_item = item;
            this.checked_ids = [item.id];
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
            vm.edit_item.version = vm.tdata.target_version;
            await axios.post('./api/detailBudgetItem/0', vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.checked_ids = [this.selected_item.id];
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
            vm.edit_item.version = vm.tdata.target_version;
            await axios.post('./api/detailBudgetItem/0', vm.edit_item )
                .then(function(res){
                    vm.selected_item = res.data;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.checked_ids = [this.selected_item.id];
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
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/detailBudgetItem/0',
                { params:{ checked_ids : vm.checked_ids } })
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
            await axios.get('./api/budgetPlanItemList',
                { params:{ active_page: num, page_num: page_num,
                           div_name : vm.$props.div_name,
                           target_year: vm.target_year,
                           target_version: vm.tdata.target_version,
                           org_id : this.org_item.id,
                           account_id : this.account_item.id,
                           include_child_organization: vm.include_child_organization,
                           include_child_account: vm.include_child_account,
                           search_model : vm.search_model,
                           search_user : vm.search_user} })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            this.$emit('set-organization',this.org_item);
            this.$emit('set-account',this.account_item);
        },
        async execlDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{   div_name : vm.$props.div_name,
                           target_year: vm.target_year,
                           target_version: vm.tdata.target_version,
                           org_id : this.org_item.id,
                           account_id : this.account_item.id,
                           include_child_organization: vm.include_child_organization,
                           include_child_account: vm.include_child_account,
                           search_model : vm.search_model,
                           search_user : vm.search_user
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/budgetPlanItemListExcel', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "plan_item_list.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/budgetPlanItemListExcel', null )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        },
        changeTargetVersion(ver){
            if(this.tdata.target_version != ver){
                this.tdata = {};
                this.searchData();
            }
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
        markedDiffCost(){
            return (val1, val2) => {
                if(!val1 && !val2) return "";
                if(!val1) val1 = 0;
                if(!val2) val2 = 0;
                var val = val1 - val2;
                if(val > 0)
                    return "+" + String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
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
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.itemList){
                all_item_length = this.tdata.itemList.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
