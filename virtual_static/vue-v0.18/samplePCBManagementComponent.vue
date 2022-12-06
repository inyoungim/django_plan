<template>

    <div class="my-1">
        <div class="col hstack">
            <div class="input-group me-1" style="width:150px;">
                <span class="input-group-addon input-group-text"> Division </span>
                <div class="form-control p-0">
                    <select v-model="target_div_name" class="form-select border-0"
                        @change="search_data" :disabled="div_list.length <= 1">
                        <option value="ALL">ALL</option>
                        <option v-for="div in div_list" :value="div">{{div}}</option>
                    </select>
                </div>
            </div>

            <div class="input-group mx-1" style="width:250px;">
                <span class="input-group-addon input-group-text"> Request Type </span>
                <div class="form-control p-0">
                    <select v-model="request_type" class="form-select border-0" @change="search_data" >
                        <option value="">ALL</option>
                        <option value="lgePCBSampleRequest">Sample PCB</option>
                        <option value="lgeStencilRequest">Stencil</option>
                    </select>
                </div>
            </div>

            <div class="input-group mx-1" style="width:220px;">
                <span class="input-group-addon input-group-text"> Status </span>
                <div class="form-control p-0">
                    <select v-model="status" class="form-select border-0" @change="search_data" >
                        <option value="Not_Stocked">
                            <span v-if="lang=='kr'">입고 처리 미완료</span>
                            <span v-else>Not Stocked</span>
                        </option>
                        <option value="Stocked">
                            <span v-if="lang=='kr'">입고 처리 완료</span>
                            <span v-else>Stocked</span>
                        </option>
                        <option value="Wait_Closing">
                            <span v-if="lang=='kr'">실적 처리 미완료</span>
                            <span v-else>Wait Closing All</span>
                        </option>
                        <option value="End_Result">
                            <span v-if="lang=='kr'">실적 처리 완료</span>
                            <span v-else>Closed</span>
                        </option>
                    </select>
                </div>
            </div>

            <div class="input-group mx-1" style="width:450px;">
                <span class="input-group-addon input-group-text"> Stocked Date </span>
                <div class="form-control text-start input-group date p-0 border-0" id="stocked_sdate">
                    <input type="text" class="form-control text-start bg-white py-1"
                           v-model="stocked_sdate" readonly style="padding:0.1em 0.5em;">
                    <span class="input-group-addon input-group-text">
                        <i class="bi bi-calendar-date"></i>
                    </span>
                </div>
                <span class="input-group-addon input-group-text" style="cursor:pointer"
                    @click="stocked_sdate=''"><i class="bi bi-eraser-fill"></i></span>

                <div class="form-control text-start input-group date ms-2 p-0 border-0" id="stocked_edate">
                    <input type="text" class="form-control text-start bg-white py-1"
                           v-model="stocked_edate" readonly style="padding:0.1em 0.5em;">
                    <span class="input-group-addon input-group-text">
                        <i class="bi bi-calendar-date"></i>
                    </span>
                </div>
                <span class="input-group-addon input-group-text" style="cursor:pointer"
                    @click="stocked_edate=''"><i class="bi bi-eraser-fill"></i></span>
            </div>

        </div>
        <div class="col hstack mt-1">
            <div class="input-group me-1" style="width:300px;">
                <span class="input-group-text" >GPDM Request No.</span>
                <input class="form-control shadow-sm" placeholder="Search Text" v-model="gpdm_request_no" @keyup.enter="search_data">
            </div>
            <div class="input-group mx-1" style="width:300px;">
                <span class="input-group-text" >Part Number</span>
                <input class="form-control shadow-sm" placeholder="Search Text" v-model="part_number" @keyup.enter="search_data">
            </div>
            <div class="input-group mx-1" style="width:300px;">
                <span class="input-group-text" >Request User</span>
                <input class="form-control shadow-sm" placeholder="Search Text" v-model="request_user" @keyup.enter="search_data">
            </div>

            <button class="btn btn-primary ms-auto" style="width:100px;" @click="search_data">Search</button>
        </div>
        <div v-if="this.$props.acl >= 7" class="col hstack mt-1">
            <button v-if="this.$props.acl > 5 " style="padding:0.1em 0.5em;min-width:80px;"
                    class="btn btn-primary me-1" @click="showStockModal">
                <span v-if="lang=='kr'">입고 처리</span>
                <span v-else>Stock</span>
            </button>
            <button v-if="this.$props.acl > 5 " style="padding:0.1em 0.5em;min-width:80px;"
                    class="btn btn-secondary me-1" @click="viewClosingModal">
                <span v-if="lang=='kr'">실적 처리</span>
                <span v-else>Closing</span>
            </button>
            <button v-if="this.$props.acl > 5 " style="padding:0.1em 0.5em;min-width:80px;"
                    class="btn btn-success me-1" @click="excelDownload">Excel</button>
        </div>

    </div>

    <div class="table-responsive">
        <table class="table table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr class="table-primary">
                    <th class="py-1 text-center">
                        <input class="form-check-input" type="checkbox"
                               :class="{'bg-secondary':checkNotMatch}"
                               :disabled = "!tdata.data_list"
                            v-model="allChecked" @click="checkAllItem">
                    </th>
                    <th class="py-1 text-center text-nowrap">Request Type</th>
                    <th class="py-1 text-center text-nowrap">GPDM Request No.</th>
                    <th class="py-1 text-center text-nowrap">RND Request No.</th>
                    <th class="py-1 text-center text-nowrap">Part Number</th>
                    <th class="py-1 text-center text-nowrap">Revision</th>
                    <th class="py-1 text-center text-nowrap">Event</th>
                    <th class="py-1 text-center text-nowrap">Maker</th>
                    <th class="py-1 text-center text-nowrap">Requestor</th>
                    <th class="py-1 text-center text-nowrap">Request Department</th>
                    <th class="py-1 text-center text-nowrap">Quantity</th>
                    <th class="py-1 text-center text-nowrap">Ordered Date</th>
                    <th class="py-1 text-center text-nowrap">Request Cost</th>
                    <th class="py-1 text-center text-nowrap">CPC Comment</th>
                    <th class="py-1 text-center text-nowrap">Stocked Date</th>
                    <th class="py-1 text-center text-nowrap">Stocked Cost</th>
                    <th class="py-1 text-center text-nowrap">Correct Cost</th>
                </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="d,i in tdata.data_list" class="bg-opacity-25" :class="{'bg-warning' : checked_items.includes(d) }">
                    <td class="py-1 text-center">
                        <input class="form-check-input bg-opacity-50" type="checkbox"
                            v-model="checked_items" :value="d">
                    </td>
                    <td class="py-1 text-start text-nowrap">{{ d.request_type }}</td>
                    <td class="py-1 text-center text-nowrap text-primary"
                        style="cursor:pointer" @click="viewPDMLink(d.gpdm_request_no)">
                        {{ d.gpdm_request_no }}
                    </td>
                    <td class="py-1 text-center text-nowrap text-primary"
                        style="cursor:pointer" @click="viewBudgetItem(d.master)">
                        {{ d.master }}-{{ d.seq_no }}
                    </td>
                    <td class="py-1 text-center text-nowrap">{{ d.part_number }}</td>
                    <td class="py-1 text-center text-nowrap">{{ d.part_revision }}</td>
                    <td class="py-1 text-center text-nowrap">{{ d.event }}</td>
                    <td class="py-1 text-center text-nowrap">{{ d.maker }}</td>
                    <td class="py-1 text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ d.user_name }}</span><span v-else>{{ d.user_name_en }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ d.user_org }}</span><span v-else>{{ d.user_org_en }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap">{{ d.sample_quantity }}</td>
                    <td class="py-1 text-center text-nowrap">{{ d.ordered_date }}</td>
                    <td class="py-1 text-end text-nowrap">{{ markedCost(d.request_cost) }}</td>
                    <td class="py-1 text-start text-nowrap">{{ d.cpc_comment }}</td>
                    <td class="py-1 text-center text-nowrap">{{ d.stocked_date }}</td>
                    <td class="py-1 text-end text-nowrap bg-opacity-25"
                        :class="{'bg-danger' : d.request_cost < d.stocked_cost}">
                        {{ markedCost(d.stocked_cost) }}
                    </td>
                    <td class="py-1 text-end text-nowrap">
                        <span v-if="d.correct_cost >= d.stocked_cost && d.correct_next_app_step >= 90">
                            {{ markedCost(d.correct_cost) }}</span>
                        <span v-else-if="d.correct_cost" class="text-danger">( {{ markedCost(d.correct_cost) }} )</span>
                    </td>
                </tr>
                <tr v-if="!tdata.data_list || tdata.data_list.length == 0">
                    <td colspan="50" class="text-center"> There is no data. </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="panel-footer mt-3">
        <div class="row">
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
            <div class="col-md-3 col-12 text-end"></div>
        </div>
    </div>

    <!-- Stock Modal -->
    <div v-if="stockModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Sample PCB Stock Process </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelStock"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="table-responsive m-0 p-0" style="overflow:auto" id="form_validation">
                        <table class="table table-bordered m-0">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center">
                                        <input class="form-check-input" type="checkbox"
                                               :class="{'bg-secondary':finalCheckNotMatch}"
                                               :disabled = "edited_items.length == 0"
                                            v-model="finalAllChecked" @click="finalCheckAllItem">
                                    </th>
                                    <th class="py-1 text-center text-nowrap">Request Type</th>
                                    <th class="py-1 text-center text-nowrap">GPDM Request No.</th>
                                    <th class="py-1 text-center text-nowrap">RND Request No.</th>
                                    <th class="py-1 text-center text-nowrap">Part Number</th>
                                    <th class="py-1 text-center text-nowrap">Revision</th>
                                    <th class="py-1 text-center text-nowrap">Event</th>
                                    <th class="py-1 text-center text-nowrap">Maker</th>
                                    <th class="py-1 text-center text-nowrap">Requestor</th>
                                    <th class="py-1 text-center text-nowrap">Request Department</th>
                                    <th class="py-1 text-center text-nowrap">Quantity</th>
                                    <th class="py-1 text-center text-nowrap">Ordered Date</th>
                                    <th class="py-1 text-center text-nowrap">Request Cost</th>
                                    <th class="py-1 text-center text-nowrap">CPC Comment</th>
                                    <th class="py-1 text-center text-nowrap">Stocked Date</th>
                                    <th class="py-1 text-center text-nowrap">Stocked Cost</th>
                                    <th class="py-1 text-center text-nowrap">Correct Cost</th>
                                </tr>
                            </thead>
                            <tbody>
                                <tr v-for="item in edited_items" class="bg-opacity-25"
                                    :class="{'bg-warning' : final_checked_ids.includes(item.id) }">
                                    <td class="py-1 text-center">
                                        <input class="form-check-input bg-opacity-50" type="checkbox"
                                            v-model="final_checked_ids" :value="item.id">
                                    </td>
                                    <td class="py-1 text-start text-nowrap">{{ item.request_type }}</td>
                                    <td class="py-1 text-center text-nowrap text-primary"
                                        style="cursor:pointer" @click="viewPDMLink(item.gpdm_request_no)">
                                        {{ item.gpdm_request_no }}
                                    </td>
                                    <td class="py-1 text-center text-nowrap text-primary"
                                        style="cursor:pointer" @click="viewBudgetItem(item.master)">
                                        {{ item.master }}-{{ item.seq_no }}
                                    </td>
                                    <td class="py-1 text-center text-nowrap">{{ item.part_number }}</td>
                                    <td class="py-1 text-center text-nowrap">{{ item.part_revision }}</td>
                                    <td class="py-1 text-center text-nowrap">{{ item.event }}</td>
                                    <td class="py-1 text-center text-nowrap">{{ item.maker }}</td>
                                    <td class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">
                                        <span v-if="lang=='kr'">{{ item.user_org }}</span><span v-else>{{ item.user_org_en }}</span>
                                    </td>
                                    <td class="py-1 text-center text-nowrap">{{ item.sample_quantity }}</td>
                                    <td class="py-1 text-center text-nowrap">{{ item.ordered_date }}</td>
                                    <td class="py-1 text-end text-nowrap bg-opacity-25"
                                        :class="{'bg-danger' : item.request_cost < item.stocked_cost}">
                                        {{ markedCost(item.request_cost) }}
                                    </td>
                                    <td class="py-1 text-start text-nowrap">{{ item.cpc_comment }}</td>
                                    <td class="py-1 text-center text-nowrap">
                                        <div class="form-control text-start input-group date p-0 border-0"
                                             :id="item.id" style="width:120px;">
                                            <input type="text" class="form-control text-start bg-white py-1 border-0"
                                                   v-model="item.stocked_date" readonly style="padding:0.1em 0.5em;"
                                                   name="Stocked Date" required>
                                            <span class="input-group-addon input-group-text border-0" style="padding:0.1em 0.5em;">
                                                <i class="bi bi-calendar-date"></i>
                                            </span>
                                        </div>
                                    </td>
                                    <td class="py-1 text-end text-nowrap" :class="{'bg-danger' : item.request_cost < item.stocked_cost}">
                                        <input class="form-control text-end p-1 m-0  border-0 bg-opacity-25"
                                               :class="{'bg-danger' : item.request_cost < item.stocked_cost}"
                                               type="text" v-model="item.stocked_cost">
                                    </td>
                                    <td class="py-1 text-end text-nowrap">
                                        <span v-if="item.correct_cost >= item.stocked_cost && item.correct_next_app_step >= 90">
                                            {{ markedCost(item.correct_cost) }}
                                        </span>
                                        <span v-else-if="item.correct_cost" class="text-danger">( {{ markedCost(item.correct_cost) }} )</span>
                                    </td>
                                </tr>
                                <tr v-if="edited_items.length == 0">
                                    <td colspan="50" class="text-center"> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;" @click="updateStock">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="cancelStock">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <form name="submitForm" method="get"></form>
    <form name="pdmLinkForm" method="get"><input type=hidden name='name' value=''></form>

    <!-- Closing Modal -->
    <div v-if="closingModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable"
            :class="{'modal-lg': validationMessage !='OK'}">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Sample PCB Closing Process </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closingModal=false"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">

                    <div class="hstack border-bottom border-primary">
                        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                            <b>Mass Closing</b>
                        </div>
                    </div>

                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span><b>Selected Count</b></span>
                        </label>
                        <lable class="form-control text-start bg-white">{{checked_items.length}}</lable>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span><b>Validation Result</b></span>
                        </label>
                        <lable class="form-control text-start bg-white"
                               :class="{'text-danger': validationMessage !='OK' }">
                            <span v-html="validationMessage"></span>
                        </lable>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span v-if="this.$props.lang == 'kr'"><b>실적 일자</b></span>
                            <span v-else><b>End Result Day</b></span>
                        </label>
                        <lable class="form-control text-start bg-white">{{today}}</lable>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div v-if="validationMessage=='OK'" class="btn btn-primary me-4" style="width:100px;"
                             @click="updateClosing">Update</div>
                        <div class="btn btn-secondary" style="width:100px;"  @click="closingModal=false">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal" class="vue_modal" style="z-index: 9991;">
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
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var today = year + '-' + month  + '-' + day;

export default {
    props : ['site','lang','div_list','acl'],
    data(){
        return {
            div_list : [],
            target_div_name : "",
            request_type : "",
            status : "Not_Stocked",
            stocked_sdate : "",
            stocked_edate : "",
            gpdm_request_no : "",
            part_number : "",
            request_user : "",
            tdata : {},
            page_num : 10,
            page_mode : "list",
            active_list : [],
            edit_item : {},
            showProgressModal : false,
            stockModal : false,
            closingModal : false,
            validationMessage :"",

            checked_items : [],
            edited_items : [],
            allChecked : false,
            final_checked_ids : [],
            final_allChecked : false,
        }
    },
    mounted(){
        var div_list = this.$props.div_list.split(",");
        for(var i=0; i<div_list.length; i++){
            this.div_list.push(div_list[i]);
        }
        this.target_div_name = this.div_list[0];
        this.page(1, this.page_num );

        var vm = this;
        this.$nextTick(() => {
            $('.input-group.date').datepicker({
                daysOfWeekHighlighted: "0",
                todayHighlight: true,
                autoclose: true,
                language: this.$props.lang,
                orientation: "bottom",
            }).on("changeDate", function(e) {
                var date = e.target.getElementsByTagName('input')[0].value;
                if(e.target.id == "stocked_sdate")
                    vm.stocked_sdate = date;
                if(e.target.id == "stocked_edate")
                    vm.stocked_edate = date;
            });
        }, 100);
    },
    methods: {
        initialData(){
            this.edit_item = {};
            this.checked_items = [];
            this.edited_items = [];
            this.allChecked = false;
            this.final_checked_ids = [];
            this.final_allChecked = false;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/index', {
                    params:{
                        div_name : vm.target_div_name,
                        active_page: num ,
                        page_num : page_num,
                        request_type : vm.request_type,
                        status : vm.status,
                        stocked_sdate : vm.stocked_sdate,
                        stocked_edate : vm.stocked_edate,
                        gpdm_request_no : vm.gpdm_request_no,
                        part_number : vm.part_number,
                        request_user : vm.request_user,
                    }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.page_mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.initialData();
        },
        async showStockModal(event){
            if(event) event.preventDefault();

            if(this.checked_items.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return;
            }
            this.edited_items = JSON.parse(JSON.stringify(this.checked_items));
            this.stockModal = true;
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    var date = e.target.getElementsByTagName('input')[0].value;
                    for(var i=0; i<vm.edited_items.length; i++){
                        if(vm.edited_items[i].id == e.target.id)
                            vm.edited_items[i].stocked_date = date;
                    }
                });
            });
        },
        cancelStock(){
            this.stockModal = false;
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                var check_id = parseInt(e.parentElement.parentElement.parentElement.firstChild.firstChild.value);
                if(this.final_checked_ids.includes(check_id)){
                    if(e.value == ""){
                        warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                        return true;
                    }
                }
            }
        },
        async updateStock(){
            if(event) event.preventDefault();

            var final_checked_items = [];
            for(var i=0; i<this.edited_items.length; i++){
                var check_id = parseInt(this.edited_items[i].id);
                if(this.final_checked_ids.includes(check_id)){
                    final_checked_items.push(this.edited_items[i]);
                }
            }
            if(final_checked_items.length == 0){
                warningModal.show_modal("Please select one or more data.");
                return true;
            }

            this.showProgressModal = true;
            var vm = this;
            var response = {};
            await axios.put('./api/index', final_checked_items )
                .then(function(res){
                    response = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.showProgressModal = false;
                    return;
                });
            if(response.success && parseInt(response.success) > 0){
                vm.stockModal = false;
                vm.showProgressModal = false;
                vm.page(vm.tdata.active_page, vm.page_num);
            }else{
                vm.showProgressModal = false;
                warningModal.show_modal("There is no update item(s).");
            }
        },
        search_data(event){
            if(event) event.preventDefault();
            this.page(this.tdata.active_page, this.page_num );
        },
        async checkAllItem(event){
            this.checked_items = [];
            if(this.tdata.data_list){
                for(var i=0; i<this.tdata.data_list.length; i++){
                    if(!this.allChecked){
                        this.checked_items.push(this.tdata.data_list[i]);
                    }
                }
            }
        },
        async finalCheckAllItem(event){
            this.final_checked_ids = [];
            if(this.edited_items){
                for(var i=0; i<this.edited_items.length; i++){
                    if(!this.finalAllChecked){
                        this.final_checked_ids.push(this.edited_items[i].id);
                    }
                }
            }
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
        viewBudgetItem(id, event){
            if(event) event.preventDefault();
            this.newWindow('1200','750','',"targetExecutionWindow"+id);
            document.submitForm.target = "targetExecutionWindow"+id;
            document.submitForm.action = "../document/"+id;
            document.submitForm.submit();
        },
        viewPDMLink(id, event){
            if(event) event.preventDefault();
            this.newWindow('1200','750','',"pdmLinkWindow"+id);
            document.pdmLinkForm.target = "pdmLinkWindow"+id;
            document.pdmLinkForm.name.value = id;
            document.pdmLinkForm.action = "http://gpdm.lge.com/enovia/jsp/request/requestPowerView.jsp";
            document.pdmLinkForm.submit();
        },
        viewClosingModal(){
            if(this.checked_items.length == 0){
                warningModal.show_modal("Please select one or more data.");
                return true;
            }

            this.validationMessage = "";
            for(var i=0; i<this.checked_items.length; i++){
                if( parseInt(this.checked_items[i].request_cost) < parseInt(this.checked_items[i].stocked_cost)){
                    if(!this.checked_items[i].correct_next_app_step){
                        this.validationMessage += "[ "+ this.checked_items[i].master +"-"+this.checked_items[i].seq_no + " ]"+
                            " stocked cost over then request one.<br>";
                    }
                    else if(this.checked_items[i].correct_next_app_step < 90 ){
                        this.validationMessage += "[ "+ this.checked_items[i].master +"-"+this.checked_items[i].seq_no + " ]"+
                            " correction budget is not approved yet.<br>";
                    }
                    else if( parseInt(this.checked_items[i].correct_cost) < parseInt(this.checked_items[i].stocked_cost) ){
                        this.validationMessage += "[ "+ this.checked_items[i].master +"-"+this.checked_items[i].seq_no + " ]"+
                            " stocked cost over then correct request one.<br>";
                    }
                }
                if(!this.checked_items[i].stocked_cost){
                    this.validationMessage += "[ "+ this.checked_items[i].master +"-"+this.checked_items[i].seq_no + " ]"+
                            " stocked cost is null.<br>";
                }
            }

            if(this.validationMessage == "")
                this.validationMessage = "OK"

            this.today = today;
            this.closingModal = true;
        },
        async updateClosing(){
            if(event) event.preventDefault();

            confirmModal.set_title("Sample PCB 실적 처리");
            confirmModal.set_contents("선택된 모든 Data 의 실적을 최신 상태로 update 합니다!");
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            var response = {};
            await axios.put('./api/endResult', vm.checked_items )
                .then(function(res){
                    response = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            vm.showProgressModal = false;
            this.closingModal = false;
        },
        async excelDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{
                    div_name : vm.target_div_name,
                    request_type : vm.request_type,
                    status : vm.status,
                    stocked_sdate : vm.stocked_sdate,
                    stocked_edate : vm.stocked_edate,
                    gpdm_request_no : vm.gpdm_request_no,
                    part_number : vm.part_number,
                    request_user : vm.request_user,
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/excelDownload', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "Sample_PCB.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/excelDownload', null)
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        }
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
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.data_list){
                all_item_length = this.tdata.data_list.length;
            }
            if(this.checked_items.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_items.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
        finalCheckNotMatch(){
            var all_item_length = 0;
            if(this.edited_items){
                var set = new Set();
                for(var i=0; i<this.edited_items.length; i++){
                    set.add(this.edited_items[i].id);
                }
                all_item_length = set.size;
            }
            if(this.final_checked_ids.length == all_item_length){
                this.finalAllChecked = true;
                return false;
            }else if(this.final_checked_ids.length == 0){
                this.finalAllChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
