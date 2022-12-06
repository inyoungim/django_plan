<template>

    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">

        <div class="hstack">
            <button class="input-group-text me-1" @click="expandSearchToggle">
                <i :class="[expandSearch? 'bi bi-dash-square-fill text-secondary' : 'bi bi-plus-square-fill text-primary']" style="cursor:pointer"></i>
            </button>

            <div class="col-auto me-1">
                <div class="hstack">
                    <div class="col-auto input-group" style="width:170px;">
                        <lable class="input-group-text">Target Year</lable>
                        <select v-model="target_year" class="form-select" style="padding:0.1em 0.5em;" @change="changeYear">
                            <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                            <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                            <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                            <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                        </select>
                    </div>
                    <div class="col-auto input-group ms-1" style="width:120px;">
                        <lable class="input-group-text">Version</lable>
                        <select v-model="target_version" class="form-select" style="padding:0.1em 0.5em;"
                                @change="changeVersion">
                            <option v-for="ver in version_list" :value="ver">{{ ver }}</option>
                        </select>

                    </div>
                    <div class="col-auto input-group ms-1">
                        <lable class="input-group-text" style="height:32px; min-width:200px;">{{ version_comments }}</lable>
                    </div>
                </div>
            </div>

            <div class="col-auto me-1">
                <div class="input-group">
                    <div class="input-group-text col px-2"><span class="text-danger"><b>My</b></span></div>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="myitem"
                               @change="refreshPage">
                    </div>
                </div>
            </div>

            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text" style="width:90px;">User Name</span>
                    <input class="form-control shadow-sm py-1" style="width:120px;"
                           :disabled="myitem"
                           placeholder="User Name" v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:100px;">자산 번호</span>
                    <span v-else class="input-group-text pe-1" style="width:110px;">Asset Number</span>
                    <input class="form-control shadow-sm py-1" placeholder="Asset Number" style="width:150px;"
                           v-model="search_asset_number" @keyup.enter="searchData">
                </div>
            </div>
        </div>

        <div class="hstack mt-1">
            <div class="col-auto me-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1 py-1" style="width:120px;">Inspection Status</span>
                    <select v-model="search_status" class="form-select py-1" style="width:100px;" @change="searchData">
                        <option value="">All</option>
                        <option value="Waiting">
                            <span v-if="this.$props.lang == 'kr'">실사 대기</span>
                            <span v-else>Waiting</span>
                        </option>
                        <option value="Using">
                            <span v-if="this.$props.lang == 'kr'">사용</span>
                            <span v-else>Using</span>
                        </option>
                        <option value="Disuse">
                            <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                            <span v-else>Disuse</span>
                        </option>
                        <option value="Dispatch">
                            <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                            <span v-else>Dispatch</span>
                        </option>
                        <option value="Missing">
                            <span v-if="this.$props.lang == 'kr'">분실</span>
                            <span v-else>Missing</span>
                        </option>
                        <option value="Delete">
                            <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                            <span v-else>Delete</span>
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-auto me-1">
                <div class="input-group">
                    <label class="input-group-text py-1">Organization</label>
                    <span class="input-group-text py-1" style="min-width:100px;">{{org_item.org_name}}</span>
                    <div class="form-control text-start input-group p-0 ">
                        <organization-select-component
                                ref="organizationSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :year="year"
                                :preset_orgid="org_item.id"
                                @select-target="setOrganization">
                        </organization-select-component>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearOrganization"></i>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_org_child"
                               @change="searchData"> Include Children
                    </div>
                </div>
            </div>
            <div class="col-auto mx-1">
                <div class="input-group">
                    <label class="input-group-text py-1">Category</label>
                    <span class="input-group-text py-1" style="min-width:100px;">{{category_item.asset_category}}</span>
                    <div class="form-control text-start input-group p-0">
                        <asset-category-select-component
                                ref="organizationAccountSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :pmode="'selectall'"
                                @select-target="setCategory">
                        </asset-category-select-component>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearCategory"></i>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_category_child"
                               @change="searchData"> Include Children
                    </div>
                </div>
            </div>

            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
            </div>
        </div>

        <div v-if="expandSearch" class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:110px;">품명</span>
                    <span v-else class="input-group-text pe-1" style="width:110px;">Product Name</span>
                    <input class="form-control shadow-sm py-1" placeholder="Search Text"
                           v-model="search_product" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:110px;">모델명</span>
                    <span v-else class="input-group-text pe-1" style="width:110px;">Product Model</span>
                    <input class="form-control shadow-sm py-1" placeholder="Search Text"
                           v-model="search_model" @keyup.enter="searchData">
                </div>
            </div>
        </div>

        <div class="mt-2">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th v-if="mode !='view'" class="py-1 text-center">
                            <input class="form-check-input" type="checkbox"
                                   :class="{'bg-secondary':checkNotMatch}"
                                v-model="allChecked" @click="checkAItem">
                        </th>
                        <th class="py-1 text-center text-nowrap">PK</th>
                        <!--
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">등록 형태</span><span v-else>Registration Type</span>
                        </th>
                        -->
                        <th class="py-1 text-center text-nowrap">Category</th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">자산 번호</span><span v-else>Asset Number</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">품명</span><span v-else>Product Name</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">모델명</span><span v-else>Product Model</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">취득 날짜</span><span v-else>Date</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">사용자</span><span v-else>User Name</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">사용 부서</span><span v-else>User Organization</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">실사 상태</span><span v-else>Inspection State</span>
                            <span class="ms-1">
                                <i v-if="!fullView" class="bi bi-plus-square-fill text-primary"
                                   style="cursor:pointer" @click="fullView=!fullView"></i>
                                <i v-else class="bi bi-dash-square-fill text-secondary"
                                   style="cursor:pointer" @click="fullView=!fullView"></i>
                            </span>
                        </th>
                        <th v-if="fullView" class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">실사자</span><span v-else>Inspector</span>
                        </th>
                        <th v-if="fullView" class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">실사자 부서</span><span v-else>Inspector Organization</span>
                        </th>
                        <th v-if="fullView" class="py-1 text-center text-nowrap">Region</th>
                        <th v-if="fullView" class="py-1 text-center text-nowrap">Location</th>
                        <th v-if="fullView" class="py-1 text-center text-nowrap">Detail Location</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="item in tdata.itemList" class="bg-opacity-25"
                        :class="{'bg-warning' : checked_ids.includes(item.id) }">
                        <td v-if="mode !='view'" class="py-1 text-center">
                            <input class="form-check-input bg-opacity-50" type="checkbox"
                                v-model="checked_ids" :value="item.id">
                        </td>
                        <td class="py-1 text-start text-primary text-nowrap"
                            style="cursor:pointer" @click="viewAssetItem(item)">
                            {{item.id}}
                        </td>
                        <!-- <td class="py-1 text-start text-nowrap">{{item.registration_type}}</td> -->
                        <td class="py-1 text-start text-primary text-nowrap"
                            style="cursor:pointer" @click="viewAssetItem(item)">
                            {{item.asset_category}}
                        </td>
                        <td class="py-1 text-start text-primary text-nowrap"
                            style="cursor:pointer" @click="viewAssetItem(item)">
                            {{item.asset_number}}
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                        <td class="py-1 text-start text-nowrap">
                            <span v-if="this.$props.lang == 'kr'">{{item.user_name}}</span>
                            <span v-else>{{item.user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.user_org_name}}</td>
                        <td class="py-1 text-center text-nowrap">
                            <span v-if="item.status !='Waiting' ">{{item.status}}</span>
                            <span v-else class="text-danger bg-opacity-25">Waiting</span>
                        </td>
                        <td v-if="fullView" class="py-1 text-center text-nowrap">
                            <span v-if="this.$props.lang == 'kr'">{{item.inspect_user_name}}</span>
                            <span v-else>{{item.inspect_user_name_en}}</span>
                        </td>
                        <td v-if="fullView" class="py-1 text-center text-nowrap">{{item.inspect_user_org_name}}</td>
                        <td v-if="fullView" class="py-1 text-center text-nowrap">{{item.region}}</td>
                        <td v-if="fullView" class="py-1 text-center text-nowrap">{{item.location}}</td>
                        <td v-if="fullView" class="py-1 text-center text-nowrap">{{item.detail_location}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="100" class="px-0">
                            <div class="row mt-3 mx-0 p-0">
                                <div class="col-md-3 col-12 text-start px-1" role="group">
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
                                <div class="col-md-3 col-12 text-end px-1">
                                    <button v-if="this.$props.acl >= 5"
                                            type="button" class="btn btn-primary shadow-sm" style="width:100px;"
                                            @click="doInspection">Inspection</button>
                                </div>
                            </div>

                        </td>
                    </tr>
                </tfoot>

            </table>
        </div>
    </div>

    <!-- do Inspection Modal -->
    <div v-if="doInspectionModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xxl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Inspection Dialog </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelInspection"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="table-responsive m-0 p-0" style="overflow:auto" id="form_validation">
                        <table class="table table-hover table-bordered m-0">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center">
                                        <input class="form-check-input" type="checkbox"
                                               :class="{'bg-secondary':checkNotMatchInspection}"
                                            v-model="allCheckedInspection" @click="checkAInspectionItem">
                                    </th>
                                    <th class="py-1 text-center">PK</th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">자산 번호</span><span v-else>Asset Number</span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">품명</span><span v-else>Product Name</span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">모델명</span><span v-else>Product Model</span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">실사 상태</span><span v-else>Inspection State</span>
                                    </th>
                                    <th class="py-1 text-center text-nowrap">Region</th>
                                    <th class="py-1 text-center text-nowrap">Location</th>
                                    <th class="py-1 text-center text-nowrap">Detail Location</th>
                                    <th class="py-1 text-center text-nowrap">Comments</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in checked_items" class="bg-opacity-25"
                                    :class="{'bg-warning' : final_checked_ids.includes(item.id) }">
                                    <td class="py-1 text-center">
                                        <input class="form-check-input bg-opacity-50" type="checkbox"
                                            v-model="final_checked_ids" :value="item.id">
                                    </td>
                                    <td class="py-1 text-center text-nowrap"> {{item.id}}</td>
                                    <td class="py-1 text-start text-nowrap"> {{item.asset_number}} </td>
                                    <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                                    <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                                    <td class="py-1 text-center text-nowrap">
                                        <select class="form-select form-control text-start bg-white py-1 border-0"
                                                v-model="item.status"
                                                :name="[this.$props.lang == 'kr' ? '실사 상태': 'Inspection State' ]" required>
                                            <option value="Using">
                                                <span v-if="this.$props.lang == 'kr'">사용</span>
                                                <span v-else>Using</span>
                                            </option>
                                            <option value="Disuse">
                                                <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                                                <span v-else>Disuse</span>
                                            </option>
                                            <option value="Dispatch">
                                                <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                                                <span v-else>Dispatch</span>
                                            </option>
                                            <option value="Missing">
                                                <span v-if="this.$props.lang == 'kr'">분실</span>
                                                <span v-else>Missing</span>
                                            </option>
                                            <option value="Delete">
                                                <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                                                <span v-else>Delete</span>
                                            </option>
                                        </select>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        <input type="text" class="form-control text-start bg-white py-1 border-0"
                                               v-model="item.region" style="padding:0.1em 0.5em;"
                                               :placeholder="[this.$props.lang == 'kr' ? 'ex) 평택, 마곡': 'ex) LGEIC' ]"
                                               :name="[this.$props.lang == 'kr' ? '지역': 'Region' ]" required>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        <input type="text" class="form-control text-start bg-white py-1 border-0"
                                               v-model="item.location" style="padding:0.1em 0.5em;"
                                               :placeholder="[this.$props.lang == 'kr' ? 'ex) R1, G1': 'Building Name' ]"
                                               :name="[this.$props.lang == 'kr' ? '위치': 'Location' ]" required>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        <input type="text" class="form-control text-start bg-white py-1 border-0"
                                               v-model="item.detail_location" style="padding:0.1em 0.5em;"
                                               :placeholder="[this.$props.lang == 'kr' ? 'ex) R1동 2층': 'Floor' ]"
                                               :name="[this.$props.lang == 'kr' ? '상세 위치': 'Detail Location' ]" required>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        <input type="text" class="form-control text-start bg-white py-1 border-0"
                                               v-model="item.comments" style="padding:0.1em 0.5em;"
                                               :placeholder="[this.$props.lang == 'kr' ? '사용중 or 사유 입력': 'Using or Reason' ]"
                                               name="Comments" required>
                                    </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-start">

                    </div>
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="updateInspection">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="cancelInspection">Cancel</div>
                    </div>
                    <div class="col text-end">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="massInspection">Mass Input</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- mass Inspection Modal -->
    <div v-if="massInspectionModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Mass Inspection Data Input Dialog </h4>
                    <button type="button" class="btn-close btn-close btn-close-white"
                            @click="massInspectionModal=false"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="col">
                        <div class="input-group shadow-sm">
                            <label class="input-group-text" style="width:160px;">
                                <span v-if="lang=='kr'"><b>실사 상태</b></span>
                                <span v-else><b>Inspection State</b></span>
                            </label>
                            <select class="form-select form-control text-start bg-white py-1"
                                    v-model="mass_data.status" @change="updateMassData(1)">
                                <option value="Using">
                                    <span v-if="this.$props.lang == 'kr'">사용</span>
                                    <span v-else>Using</span>
                                </option>
                                <option value="Disuse">
                                    <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                                    <span v-else>Disuse</span>
                                </option>
                                <option value="Dispatch">
                                    <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                                    <span v-else>Dispatch</span>
                                </option>
                                <option value="Missing">
                                    <span v-if="this.$props.lang == 'kr'">분실</span>
                                    <span v-else>Missing</span>
                                </option>
                                <option value="Delete">
                                    <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                                    <span v-else>Delete</span>
                                </option>
                            </select>
                        </div>
                    </div>
                    <div class="col mt-1">
                        <div class="input-group shadow-sm">
                            <label class="input-group-text" style="width:160px;"><b>Region</b></label>
                            <input class="form-control" v-model="mass_data.region" @change="updateMassData(2)">
                        </div>
                    </div>
                    <div class="col mt-1">
                        <div class="input-group shadow-sm">
                            <label class="input-group-text" style="width:160px;"><b>Location</b></label>
                            <input class="form-control" v-model="mass_data.location" @change="updateMassData(3)">
                        </div>
                    </div>
                    <div class="col mt-1">
                        <div class="input-group shadow-sm">
                            <label class="input-group-text" style="width:160px;"><b>Detail Location</b></label>
                            <input class="form-control" v-model="mass_data.detail_location" @change="updateMassData(4)">
                        </div>
                    </div>
                    <div class="col mt-1">
                        <div class="input-group shadow-sm">
                            <label class="input-group-text" style="width:160px;"><b>Comments</b></label>
                            <input class="form-control" v-model="mass_data.comments" @change="updateMassData(5)">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary" style="width:100px;"  @click="massInspectionModal=false">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Detail View Modal -->
    <div v-if="viewAssetItemModal">
        <asset-item-component
            ref="assetItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :asset_item="selected_item"
            :div_name="this.$props.div_name"
            :asset_item_id="selected_item.parent"
            :pmode="'load'"
            @close-modal="closeAssetItemModal"
            @update-data="updateData">
        </asset-item-component>
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
    props : ['site','lang','acl','div_name','year','version','myitem','parent_org_item','parent_category_item',],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            target_year : this.$props.year,
            target_version : this.$props.version,
            version_list : [],
            version_comments : "",
            org_item : this.$props.parent_org_item,
            category_item : this.$props.parent_category_item,
            include_org_child : false,
            include_category_child : false,
            mode : 'list',
            tdata : {},
            selected_item : {},
            checked_ids : [],
            checked_items : [],
            page_num : 10,
            active_page: 1,
            search_status : "Waiting",
            edit_item : {},
            showProgressModal : false,
            expandSearch : false,
            viewAssetItemModal : false,
            fullView : false,
            myitem : this.$props.myitem,
            doInspectionModal : false,
            massInspectionModal : false,
            final_checked_ids : [],
            final_checked_items : [],
            mass_data : {},
        }
    },
    mounted(){
        this.refreshPage();
    },
    watch : {
        div_name(nVal){
            this.searchData();
        }
    },
    methods: {
        // emit function of organizationSelectComponent
        setOrganization(item){
            var tem_obj = this.org_item;
            this.org_item = item;
            if(tem_obj.id != item.id)
                this.page(1, this.page_num );
        },
        // emit function of assetCategorySelectComponent
        setCategory(item){
            var tem_obj = this.category_item;
            this.category_item = item;
            if(tem_obj.id != item.id)
                this.page(1, this.page_num );
        },
        // emit function of assetItemComponent
        updateData(){
            this.searchData();
        },
        changeYear(){
            this.org_item = {};
            this.searchData();
            this.$emit('change-year', this.target_year);
        },
        changeVersion(){
            this.searchData();
            this.$emit('change-version', this.target_version);
        },
        toggleConditionTab(){
            this.$emit('toggle-condition');
        },
        expandSearchToggle(){
            this.expandSearch = !this.expandSearch;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            await axios.get('./api/inspection',
                { params:{ active_page: num, page_num: page_num,
                           div_name : vm.$props.div_name,
                           target_year: vm.target_year,
                           target_version: vm.target_version,
                           parent_org_id: vm.org_item.id,
                           parent_category_id: vm.category_item.id,
                           include_org_child : vm.include_org_child,
                           include_category_child : vm.include_category_child,
                           search_status : vm.search_status,
                           search_user : vm.search_user,
                           search_asset_number : vm.search_asset_number,
                           search_product : vm.search_product,
                           search_model : vm.search_model,
                           myitem : vm.myitem,
                          } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.target_version = res.data.target_version;
                    vm.version_list = res.data.version_list;
                    vm.version_comments = res.data.version_comments;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            this.selected_item = {};
            this.checked_ids = [];
            this.checked_items = [];
            this.final_checked_ids = [];
            this.final_checked_items = [];
        },
        async refreshPage(){
            if(this.myitem){
                this.search_user = "";
            }
            await this.page(this.tdata.active_page, this.page_num );
        },
        searchData(){
            this.page(this.tdata.active_page, this.page_num );
        },
        viewAssetItem(item){
            this.viewAssetItemModal=true;
            this.selected_item = item;
        },
        closeAssetItemModal(){
            this.viewAssetItemModal=false;
        },
        clearOrganization(){
            var tem_obj = this.org_item;
            this.org_item = {};
            if(tem_obj.id != this.org_item.id)
                this.page(1, this.page_num );

            this.$emit('clear-organization');
        },
        clearCategory(){
            var tem_obj = this.category_item;
            this.category_item = {};
            if(tem_obj.id != this.category_item.id)
                this.page(1, this.page_num );
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
        async checkAInspectionItem(event){
            this.final_checked_ids = [];
            this.final_checked_items = [];
            for(var i=0; i<this.checked_items.length; i++){
                if(!this.allCheckedInspection){
                    this.final_checked_ids.push(this.checked_items[i].id);
                    this.final_checked_items.push(this.checked_items[i]);
                }
            }
        },
        doInspection(event){
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return false;
            }

            this.checked_items = [];
            if(this.tdata.itemList){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(this.checked_ids.includes(this.tdata.itemList[i].id)){
                        this.checked_items.push(this.tdata.itemList[i]);
                    }
                }
            }
            this.doInspectionModal = true;
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                var check_id = parseInt(e.parentElement.parentElement.firstChild.firstChild.value);
                if(this.final_checked_ids.includes(check_id)){
                    if(e.value == ""){
                        warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                        return true;
                    }
                }
            }
        },
        async updateInspection(event){
            if(event) event.preventDefault();
            if(this.final_checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return false;
            }
            if(this.form_validation()) return false;

            this.final_checked_items = [];
            for(var i=0; i<this.checked_items.length; i++){
                var check_id = parseInt(this.checked_items[i].id);
                if(this.final_checked_ids.includes(check_id)){
                    this.final_checked_items.push(this.checked_items[i]);
                }
            }

            this.showProgressModal = true;
            var vm = this;
            var data = {};
            data.div_name = vm.$props.div_name;
            data.target_year = vm.target_year;
            data.target_version = vm.target_version;
            data.data_list = vm.final_checked_items;
            await axios.put('./api/inspection', data )
                .then(function(res){
                    //vm.tdata = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.doInspectionModal = false;
            this.refreshPage();
        },
        cancelInspection(event){
            if(event) event.preventDefault();
            this.checked_items = [];
            this.doInspectionModal = false;
        },
        massInspection(event){
            if(event) event.preventDefault();

            if(this.final_checked_ids.length == 0){
                warningModal.show_modal("Please, select one or more items");
                return;
            }
            this.final_checked_items = [];
            for(var i=0; i<this.checked_items.length; i++){
                var check_id = parseInt(this.checked_items[i].id);
                if(this.final_checked_ids.includes(check_id)){
                    this.final_checked_items.push(this.checked_items[i]);
                }
            }
            this.massInspectionModal = true;
            this.mass_data = {};
        },
        updateMassData(no){
            for(var i=0; i<this.final_checked_items.length; i++){
                if(no == 1) this.final_checked_items[i].status = this.mass_data.status;
                if(no == 2) this.final_checked_items[i].region = this.mass_data.region;
                if(no == 3) this.final_checked_items[i].location = this.mass_data.location;
                if(no == 4) this.final_checked_items[i].detail_location = this.mass_data.detail_location;
                if(no == 5) this.final_checked_items[i].comments = this.mass_data.comments;
            }
        }
    },
    computed:{
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
        checkNotMatchInspection(){
            var all_item_length = 0;
            if(this.checked_items){
                var set = new Set();
                for(var i=0; i<this.checked_items.length; i++){
                    set.add(this.checked_items[i].id);
                }
                all_item_length = set.size;
            }
            if(this.final_checked_ids.length == all_item_length){
                this.allCheckedInspection = true;
                return false;
            }else if(this.final_checked_ids.length == 0){
                this.allCheckedInspection = false;
                return false;
            }
            return true;
        },

    },
}
</script>
