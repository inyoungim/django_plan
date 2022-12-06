<template>

    <div class="hstack mt-1">
        <div class="col-auto ms-auto">
            <div class="input-group shadow-sm">
                <span class="input-group-text pe-1" style="width:100px;">Comments</span>
                <input class="form-control shadow-sm"
                       v-model="search_comments" @keyup.enter="searchData">
            </div>
        </div>

        <div class="col-auto ms-1">
            <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
        </div>
    </div>

    <table class="table table-hover table-bordered m-0 my-2">
        <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center text-nowrap">PK</th>
                <th class="py-1 text-center text-nowrap">Year</th>
                <th class="py-1 text-center text-nowrap">Comments</th>
                <th class="py-1 text-center text-nowrap">Start Date</th>
                <th class="py-1 text-center text-nowrap">End Date</th>
                <th class="py-1 text-center text-nowrap">Creator</th>
                <th class="py-1 text-center text-nowrap">Create Date</th>
                <th class="py-1 text-center text-nowrap">
                    <span v-if="this.$props.lang == 'kr'">DATA 초기화</span>
                    <span v-else>Initialize Data</span>
                </th>
                <th class="py-1 text-center text-nowrap">Mailing Date</th>
            </tr>
        </thead>
        <tbody v-for="item,i in tdata.itemList">
            <tr v-if="expandAll || i < 10" class="bg-opacity-25"
                :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                <td class="py-1 text-center text-nowrap">
                    <span v-if="this.$props.acl >= 7 " class="text-primary" style="cursor:pointer"
                          @click="viewFormModal(item)">{{item.id}}</span>
                    <span v-else>{{item.id}}</span>
                </td>
                <td class="py-1 text-start text-nowrap">
                    <span v-if="this.$props.acl >= 7 " class="text-primary" style="cursor:pointer"
                          @click="viewFormModal(item)">{{item.year}}</span>
                    <span v-else>{{item.year}}</span>
                </td>
                <td class="py-1 text-start text-nowrap">
                    <span v-if="this.$props.acl >= 7 " class="text-primary" style="cursor:pointer"
                          @click="viewFormModal(item)">{{item.comments}}</span>
                    <span v-else>{{item.comments}}</span>
                </td>
                <td class="py-1 text-center text-nowrap">{{item.sdate}}</td>
                <td class="py-1 text-center text-nowrap">{{item.edate}}</td>
                <td class="py-1 text-center text-nowrap">
                    <span v-if="this.$props.lang == 'kr'">{{item.user_name}}</span>
                    <span v-else>{{item.user_name_en}}</span>
                </td>
                <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                <td class="py-1 text-center text-nowrap">
                    <button v-if="!item.initial_date && this.$props.acl >= 7"
                        type="button" class="btn btn-danger py-0" @click="initialize(item)">
                        <span v-if="this.$props.lang == 'kr'">DATA 초기화</span>
                        <span v-else>Initialize Data</span>
                    </button>
                    <span v-else>{{item.initial_date}}</span>
                </td>
                <td class="py-1 text-center text-nowrap">{{item.mailing_date}}</td>
            </tr>
        </tbody>
        <tbody v-if="tdata.itemList && tdata.itemList.length == 0 ">
            <tr>
                <td colspan="11" class="text-center"> There is no data. </td>
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
                            <button v-if="this.$props.acl >= 7 "
                                    type="button" class="btn btn-primary shadow-sm" style="width:80px;"
                                    @click="newFormModal">New</button>
                        </div>
                    </div>
                </td>
            </tr>
        </tfoot>
    </table>

    <div v-if="showInspectionSettingModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Inspection Setting </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>
                <div class="modal-body border" id="submit_form">
                    <div class="col hstack mt-1">
                        <div class="col input-group me-1">
                            <label class="input-group-text" style="width:100px;"><b>Year</b></label>
                            <label class="col input-group-text bg-white">{{ this.$props.year }}</label>
                        </div>
                    </div>
                    <div class="col hstack mt-1">
                        <div class="col input-group me-1">
                            <label class="input-group-text" style="width:100px;"><b>Comments</b></label>
                            <input type="text" class="form-control bg-white" name="Comments"
                                   :disabled="mode == 'view'"
                                   v-model="edit_item.comments" required>
                        </div>
                    </div>
                    <div v-if="mode =='view'" class="col hstack mt-1">
                        <div class="input-group date me-1">
                            <label class="input-group-text" style="width:100px;"><b>Start Date</b></label>
                            <span class="col input-group-text bg-white">{{edit_item.sdate}}</span>
                        </div>

                        <div class="input-group date">
                            <label class="input-group-text" style="width:100px;"><b>End Date</b></label>
                            <span class="col input-group-text bg-white">{{edit_item.edate}}</span>
                        </div>
                    </div>
                    <div v-else class="col hstack mt-1">
                        <div class="input-group date me-1" id="sdate" >
                            <label class="input-group-text" style="width:100px;"><b>Start Date</b></label>
                            <input type="text" class="form-control bg-white" aria-describedby="date-range-1"
                                   v-model="edit_item.sdate" name="Start Date" readonly required>
                            <span class="input-group-addon input-group-text" id="date-range-1">
                                <i class="bi bi-calendar-date"></i>
                            </span>
                        </div>

                        <div class="input-group date" id="edate" >
                            <label class="input-group-text" style="width:100px;"><b>End Date</b></label>
                            <input type="text" class="form-control bg-white" aria-describedby="date-range-2"
                                   v-model="edit_item.edate" name="End Date" readonly required>
                            <span class="input-group-addon input-group-text" id="date-range-2">
                                <i class="bi bi-calendar-date"></i>
                            </span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div v-if="mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Submit</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyFormModal">Modify</div>
                        <div class="btn btn-danger mx-2" style="width:100px;" @click="deleteFormModal">Delete</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Update</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeModal">Close</div>
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
    props : ['site','lang','acl','div_name','year'],
    data(){
        return {
            mode : "view",
            div_name : this.$props.div_name,
            tdata : {},
            selected_item : {},
            edit_item : {},
            page_num : 10,
            active_page: 1,
            showProgressModal : false,
            showInspectionSettingModal : false,
            initial_data : {},
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        async searchData(){
            this.active_page = 1;
            this.page(this.active_page, this.page_num, null);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/settingList',
                { params:{  div_name : vm.div_name,
                            active_page: num, page_num: page_num,
                            search_comments: vm.search_comments,
                        }
                })
                .then(function(res){
                    vm.tdata = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        newFormModal(){
            this.showInspectionSettingModal = true;
            this.mode = "new";
            this.edit_item = {};
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
                    if(e.target.id == "sdate")
                        vm.edit_item.sdate = date;
                    if(e.target.id == "edate")
                        vm.edit_item.edate = date;
                });
            });
        },
        viewFormModal(item){
            this.showInspectionSettingModal = true;
            this.mode = "view";
            this.edit_item = JSON.parse(JSON.stringify(item));
        },
        form_validation(){
            var requiredElements = document.querySelector("#submit_form").querySelectorAll("[required]");
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

            this.showProgressModal = true;
            var vm = this;
            vm.edit_item.div_name = vm.div_name;
            if(vm.mode == "new"){
                await axios.post('./api/settingList', vm.edit_item)
                    .then(function(res){ })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(vm.mode == "modify"){
                await axios.put('./api/settingList', vm.edit_item)
                    .then(function(res){ })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }
            this.showProgressModal = false;
            this.showInspectionSettingModal = false;
            this.searchData();
        },
        modifyFormModal(){
            this.mode = "modify";
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
                    if(e.target.id == "sdate")
                        vm.edit_item.sdate = date;
                    if(e.target.id == "edate")
                        vm.edit_item.edate = date;
                });
            });
        },
        cancelFormModal(){
            this.mode = "view";
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
        },
        closeModal(){
            this.mode = "view";
            this.showInspectionSettingModal=false;
        },
        deleteFormModal(event){
            if(event) event.preventDefault();
            this.confirm_target = "delete";
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            var vm = this;
            if(this.confirm_target == "delete"){
                this.showProgressModal = true;
                await axios.delete('./api/settingList',
                            { params:{  div_name :vm.div_name,  id:vm.edit_item.id } })
                    .then(function(res){ })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });

                this.showInspectionSettingModal=false;
                this.showProgressModal = false;
                this.searchData();
            }else{
                this.showProgressModal = true;
                await axios.put('./api/initialize', vm.initial_data )
                    .then(function(res){ })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
                this.searchData();
            }
        },
        initialize(item, event){
            if(event) event.preventDefault();

            this.initial_data = item ;
            this.confirm_target = "initialize";
            confirmModal.set_title("Initialize");
            confirmModal.set_contents("Are you sure to initial all inspection state?");
            confirmModal.show_modal(this);
        }
    },
}
</script>
