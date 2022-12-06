<template>

    <div>
        <div class="hstack">
            <div class="col input-group ms-1">
                <div class="input-group-text bg-white">
                    <input class="form-check-input me-2" type="checkbox"
                           v-model="include_error_complete" @change="changeCondition">
                    <span v-if="this.$props.lang=='kr'">오처리 완료 항목 포함</span>
                    <span v-else>Include completed closing error item</span>
                </div>
            </div>

            <div class="col-auto input-group ms-auto" style="width:170px;">
                <lable class="input-group-text">Target Year</lable>
                <select v-model="target_year" class="form-select" @change="changeCondition">
                    <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                    <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                    <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                    <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                </select>
            </div>

        </div>

        <div class="col my-2">
            <div v-if="organization_pic_result.monitoring_user_list" class="table-responsive">
                <table class="table table-hover table-bordered mb-0" style="overflow-x:auto">
                    <thead class="bg-primary bg-opacity-25" tyle="position: sticky;top:0;">
                        <tr>
                            <th class="py-1 text-center"> Type </th>
                            <th class="py-1 text-center" class="bg-opacity-50" style="cursor:pointer"
                                :class="{'bg-warning ': monitoring_user_no == ''}" @click="filterData('')"> Total </th>
                            <th v-for="pic in organization_pic_result.monitoring_user_list"
                                class="col-auto py-1 text-center bg-opacity-50" style="cursor:pointer"
                                :class="{'bg-warning ': monitoring_user_no == pic.user_empno}"
                                @click="filterData(pic.user_empno)">
                                <span v-if="this.$props.lang=='kr'">{{pic.user_name}}</span>
                                <span v-else>{{pic.user_name_en}}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr class="bg-opacity-25">
                            <th class="py-1 text-center">
                                <span v-if="this.$props.lang=='kr'">실적 오처리</span>
                                <span v-else>Closing error</span>
                            </th>
                            <td class="py-1 text-center">{{ organization_pic_result.total_error_count }}</td>
                            <td v-for="pic in organization_pic_result.monitoring_user_list"
                                class="bg-opacity-25 text-center"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:0' }"
                                style="cursor:pointer" @click="viewItemList(pic, '1:0')">
                                <span>{{pic.this_year_error_count}}</span>
                            </td>
                        </tr>
                        <tr class="bg-opacity-25">
                            <th class="py-1 text-center">
                                <span v-if="this.$props.lang=='kr'">실적 미처리</span>
                                <span v-else>Waiting Closing</span>
                            </th>
                            <td class="py-1 text-center">{{ organization_pic_result.total_waiting_count }}</td>
                            <td v-for="pic in organization_pic_result.monitoring_user_list"
                                class="bg-opacity-25 text-center"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:0' }"
                                style="cursor:pointer" @click="viewItemList(pic, '2:0')">
                                <span>{{pic.this_year_waiting_count}}</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div v-for="type in monitoring_type_list" class="col my-2">
            <div class="table-responsive">
                <div v-if="type.row_material_account && this.$props.acl >= 7" class="col text-end my-1">
                    <button class="btn btn-primary" style="min-width:100px;"
                            @click="rowMaterialResultCorrectionModal=true">
                        <span v-if="this.$props.lang == 'kr'">원재료 실적보정</span>
                        <span v-else>Row Material Result Correction</span>
                    </button>
                </div>

                <table class="table table-hover table-bordered m-0">
                    <thead style="background-color:#FFEEDD;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">{{type.head_name}}</th>
                            <th class="py-1 text-center text-nowrap">Type</th>
                            <th class="py-1 text-center text-nowrap">{{target_year -1}} Year</th>
                            <th class="py-1 text-center text-nowrap">{{target_year}} Year</th>
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
                    <tbody v-for="pic in type.monitoring_user_list">
                        <tr v-if="monitoring_user_no == '' || monitoring_user_no == pic.user_empno
                                  || pic.group_type !='Organization' ">
                            <td v-if="type.group_type == 'Organization'" rowspan="3"
                                class="align-middle text-center text-nowrap" style="background-color:#FFFFFF;">{{pic.user_name}}</td>
                            <td v-else rowspan="2"
                                class="align-middle text-center text-nowrap" style="background-color:#FFFFFF;">{{pic.user_name}}</td>
                            <td class="text-end text-nowrap">
                                <span v-if="this.$props.lang=='kr'">실적 오처리</span>
                                <span v-else>Closing error</span>
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:-1' }"
                                @click="viewItemList(pic, '1:-1')">
                                {{ pic.pre_year_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:0' }"
                                @click="viewItemList(pic, '1:0')">
                                {{ pic.this_year_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:1' }"
                                @click="viewItemList(pic, '1:1')">
                                {{ pic.month_01_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:2' }"
                                @click="viewItemList(pic, '1:2')">
                                {{ pic.month_02_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:3' }"
                                @click="viewItemList(pic, '1:3')">
                                {{ pic.month_03_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:4' }"
                                @click="viewItemList(pic, '1:4')">
                                {{ pic.month_04_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:5' }"
                                @click="viewItemList(pic, '1:5')">
                                {{ pic.month_05_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:6' }"
                                @click="viewItemList(pic, '1:5')">
                                {{ pic.month_06_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:7' }"
                                @click="viewItemList(pic, '1:7')">
                                {{ pic.month_07_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:8' }"
                                @click="viewItemList(pic, '1:8')">
                                {{ pic.month_08_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:9' }"
                                @click="viewItemList(pic, '1:9')">
                                {{ pic.month_09_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:10' }"
                                @click="viewItemList(pic, '1:10')">
                                {{ pic.month_10_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:11' }"
                                @click="viewItemList(pic, '1:11')">
                                {{ pic.month_11_error_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '1:12' }"
                                @click="viewItemList(pic, '1:12')">
                                {{ pic.month_12_error_count }}
                            </td>
                        </tr>
                        <tr v-if="monitoring_user_no == '' || monitoring_user_no == pic.user_empno
                                  || pic.group_type !='Organization' ">
                            <td class="text-end text-nowrap">
                                <span v-if="this.$props.lang=='kr'">실적 미처리</span>
                                <span v-else>Waiting Closing</span>
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:-1' }"
                                @click="viewItemList(pic, '2:-1')">
                                {{ pic.pre_year_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:0' }"
                                @click="viewItemList(pic, '2:0')">
                                {{ pic.this_year_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:1' }"
                                @click="viewItemList(pic, '2:1')">
                                {{ pic.month_01_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:2' }"
                                @click="viewItemList(pic, '2:2')">
                                {{ pic.month_02_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:3' }"
                                @click="viewItemList(pic, '2:3')">
                                {{ pic.month_03_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:4' }"
                                @click="viewItemList(pic, '2:4')">
                                {{ pic.month_04_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:5' }"
                                @click="viewItemList(pic, '2:5')">
                                {{ pic.month_05_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:6' }"
                                @click="viewItemList(pic, '2:6')">
                                {{ pic.month_06_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:7' }"
                                @click="viewItemList(pic, '2:7')">
                                {{ pic.month_07_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:8' }"
                                @click="viewItemList(pic, '2:8')">
                                {{ pic.month_08_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:9' }"
                                @click="viewItemList(pic, '2:9')">
                                {{ pic.month_09_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:10' }"
                                @click="viewItemList(pic, '2:10')">
                                {{ pic.month_10_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:11' }"
                                @click="viewItemList(pic, '2:11')">
                                {{ pic.month_11_waiting_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '2:12' }"
                                @click="viewItemList(pic, '2:12')">
                                {{ pic.month_12_waiting_count }}
                            </td>
                        </tr>
                        <tr v-if="(monitoring_user_no == '' || monitoring_user_no == pic.user_empno)
                                    && type.group_type == 'Organization' ">
                            <td class="text-end text-nowrap">
                                <span v-if="this.$props.lang=='kr'">전자 세금 계산서</span>
                                <span v-else>Electronic Tax Invoice</span>
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:-1' }"
                                @click="viewItemList(pic, '4:-1')">
                                    {{ markedNumber(pic.pre_year_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:0' }"
                                @click="viewItemList(pic, '4:0')">
                                    {{ markedNumber(pic.this_year_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:1' }"
                                @click="viewItemList(pic, '4:1')">
                                    {{ markedNumber(pic.month_01_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:2' }"
                                @click="viewItemList(pic, '4:2')">
                                    {{ markedNumber(pic.month_02_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:3' }"
                                @click="viewItemList(pic, '4:3')">
                                    {{ markedNumber(pic.month_03_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:4' }"
                                @click="viewItemList(pic, '4:4')">
                                    {{ markedNumber(pic.month_04_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:5' }"
                                @click="viewItemList(pic, '4:5')">
                                    {{ markedNumber(pic.month_05_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:6' }"
                                @click="viewItemList(pic, '4:6')">
                                    {{ markedNumber(pic.month_06_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:7' }"
                                @click="viewItemList(pic, '4:7')">
                                    {{ markedNumber(pic.month_07_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:8' }"
                                @click="viewItemList(pic, '4:8')">
                                    {{ markedNumber(pic.month_08_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:9' }"
                                @click="viewItemList(pic, '4:9')">
                                    {{ markedNumber(pic.month_09_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:10' }"
                                @click="viewItemList(pic, '4:10')">
                                    {{ markedNumber(pic.month_10_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:11' }"
                                @click="viewItemList(pic, '4:11')">
                                    {{ markedNumber(pic.month_11_invoice_count) }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '4:12' }"
                                @click="viewItemList(pic, '4:12')">
                                    {{ markedNumber(pic.month_12_invoice_count) }}
                            </td>
                        </tr>
                        <tr v-if="(monitoring_user_no == '' || monitoring_user_no == pic.user_empno)
                                    || type.group_type != 'Organization' "
                            class="bg-secondary bg-opacity-25">
                            <td v-if="type.group_type == 'Organization'" class="text-end text-nowrap" colspan="2">
                                <span v-if="this.$props.lang=='kr'">총 품의 건수</span>
                                <span v-else>Total Execution Count</span>
                            </td>
                            <td v-else class="text-end text-nowrap" colspan="2">
                                <span v-if="this.$props.lang=='kr'">총 품의 건수</span>
                                <span v-else>Total Execution Count</span>
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:-1' }"
                                @click="viewItemList(pic, '3:-1')">
                                {{ pic.pre_year_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:0' }"
                                @click="viewItemList(pic, '3:0')">
                                {{ pic.this_year_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:1' }"
                                @click="viewItemList(pic, '3:1')">
                                {{ pic.month_01_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:2' }"
                                @click="viewItemList(pic, '3:2')">
                                {{ pic.month_02_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:3' }"
                                @click="viewItemList(pic, '3:3')">
                                {{ pic.month_03_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:4' }"
                                @click="viewItemList(pic, '3:4')">
                                {{ pic.month_04_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:5' }"
                                @click="viewItemList(pic, '3:5')">
                                {{ pic.month_05_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:6' }"
                                @click="viewItemList(pic, '3:6')">
                                {{ pic.month_06_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:7' }"
                                @click="viewItemList(pic, '3:7')">
                                {{ pic.month_07_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:8' }"
                                @click="viewItemList(pic, '3:8')">
                                {{ pic.month_08_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:9' }"
                                @click="viewItemList(pic, '3:9')">
                                {{ pic.month_09_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:10' }"
                                @click="viewItemList(pic, '3:10')">
                                {{ pic.month_10_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:11' }"
                                @click="viewItemList(pic, '3:11')">
                                {{ pic.month_11_total_count }}
                            </td>
                            <td class="text-end text-nowrap bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-danger': selected_pic_no == pic.seq_no && selected_cell == '3:12' }"
                                @click="viewItemList(pic, '3:12')">
                                {{ pic.month_12_total_count }}
                            </td>
                        </tr>

                    </tbody>

                </table>
            </div>
        </div>

    </div>

    <div v-if="taxInvoiceListModal" class="col">
        <tax-invoice-list-component
                ref="taxInvoiceListComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :empno="invoice_empno"
                :year="invoice_year"
                :month="invoice_month"
                @close-modal="taxInvoiceListModal=false">
        </tax-invoice-list-component>
    </div>

    <div v-if="budgetExecutionResultErrorModal" class="col">
        <budget-execution-result-error-component
                ref="budgetExecutionResultErrorComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :year="target_year"
                :month="target_month"
                :org_id_list="org_id_list"
                :acc_id_list="acc_id_list"
                :exception_acc_id_list="exception_acc_id_list"
                :include_error_complete="include_error_complete"
                @update-result="changeCondition"
                @close-modal="budgetExecutionResultErrorModal=false">
        </budget-execution-result-error-component>
    </div>
    <div v-if="budgetExecutionResultMonitoringModal" class="col">
        <budget-execution-result-monitoring-component
                ref="budgetExecutionResultMonitoringComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :year="target_year"
                :month="target_month"
                :search_condition="search_condition"
                :org_id_list="org_id_list"
                :acc_id_list="acc_id_list"
                :exception_acc_id_list="exception_acc_id_list"
                @update-data="changeCondition"
                @close-modal="budgetExecutionResultMonitoringModal=false">
        </budget-execution-result-monitoring-component>
    </div>

    <div v-if="rowMaterialResultCorrectionModal" class="col">
        <row-material-result-correction-component
                ref="rowMaterialResultCorrectionComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :year="target_year"
                :month="target_month"
                @update-data="changeCondition"
                @close-modal="rowMaterialResultCorrectionModal=false">
        </row-material-result-correction-component>
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
    props : ['site','lang','acl','div_name','year'],
    components: {
        'tax-invoice-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/taxInvoiceListComponent.vue', vueLoaderOptions) ),
        'budget-execution-result-error-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionResultErrorComponent.vue', vueLoaderOptions) ),
        'budget-execution-result-monitoring-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionResultMonitoringComponent.vue', vueLoaderOptions) ),
        'row-material-result-correction-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/rowMaterialResultCorrectionComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            target_year : this.$props.year,
            target_month : 0,
            search_condition : "",
            org_id_list : [],
            acc_id_list : [],
            exception_acc_id_list : [],
            include_error_complete : false,

            invoice_empno : "",
            invoice_year : "",
            invoice_month : "",
            monitoring_type_list : [],
            organization_pic_result : [],
            monitoring_user_no : "",
            selected_pic_no : '',
            selected_cell : '',

            taxInvoiceListModal : false,
            budgetExecutionResultErrorModal : false,
            budgetExecutionResultMonitoringModal : false,
            rowMaterialResultCorrectionModal : false,
            showProgressModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    watch : {
        div_name(nVal){
            this.loadData();
        }
    },
    methods: {
        changeCondition(){
            this.loadData();
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/resultMonitoringList',
                    { params:{  div_name : vm.$props.div_name, year : vm.target_year,
                                search_text : vm.search_user,
                                include_error_complete : vm.include_error_complete } }
                )
                .then(function(res){
                    vm.monitoring_type_list = res.data.monitoring_type_list;
                    vm.organization_pic_result = res.data.organization_pic_result;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        filterData(empno){
            if(this.monitoring_user_no == empno)
                this.monitoring_user_no = "";
            else
                this.monitoring_user_no = empno;
        },
        viewItemList(pic, cell){
            this.selected_pic_no  = pic.seq_no;
            this.selected_cell  = cell;

            var cell_data = cell.split(":");

            if(cell_data[0] == 1){
                this.target_month = cell_data[1];
                this.org_id_list = pic.organization_id_list;
                this.acc_id_list = pic.account_id_list;
                this.exception_acc_id_list = pic.except_account_id_list;
                this.budgetExecutionResultErrorModal = true;
            }else if(cell_data[0] == 2){
                this.target_month = cell_data[1];
                this.search_condition = "waiting";
                this.org_id_list = pic.organization_id_list;
                this.acc_id_list = pic.account_id_list;
                this.exception_acc_id_list = pic.except_account_id_list;
                this.budgetExecutionResultMonitoringModal = true;
            }else if(cell_data[0] == 3){
                this.target_month = cell_data[1];
                this.search_condition = "all";
                this.org_id_list = pic.organization_id_list;
                this.acc_id_list = pic.account_id_list;
                this.exception_acc_id_list = pic.except_account_id_list;
                this.budgetExecutionResultMonitoringModal = true;
            }else if(cell_data[0] == 4){
                this.invoice_empno = pic.user_empno;
                if(cell_data[1] == -1){
                    this.invoice_year = this.target_year -1;
                }else{
                    this.invoice_year = this.target_year;
                }this.invoice_month = cell_data[1];
                this.taxInvoiceListModal = true;
            }
        },
    },
    computed:{
        markedNumber(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
