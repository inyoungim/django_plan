<template>

    <!-- New Item Modal -->
    <div class="row">
        <div class="col-lg-6 vstack align-top p-1 px-2 mt-3">
            <div class="hstack border-bottom border-danger">
                <div class="col-auto border border-bottom-0 border-danger rounded-top py-1 px-2 bg-danger bg-opacity-25">
                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                    <b v-if="this.$props.lang=='kr'">출고/반납 정보</b>
                    <b v-else>Release Information</b>
                </div>
                <div class="ms-auto">
                    <button v-if="this.$props.acl >=7" class="btn btn-sm btn-primary " style="width:100px; height:25px;"
                            @click="add_item">Add Item</button>
                    <button  v-if="this.$props.acl >=7" class="btn btn-sm btn-danger ms-2" style="width:100px; height:25px;"
                            @click="delete_item">Delete Item</button>
                </div>
            </div>

            <div class="table-responsive m-0 p-0">
                <table class="table table-hover table-bordered m-0 mb-3">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">PK</th>
                            <th class="py-1 text-center text-nowrap">Type</th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">날짜</span>
                                <span v-else>Date</span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">수량</span>
                                <span v-else>Quantity</span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">작성자</span>
                                <span v-else>User Name</span>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">작성일</span>
                                <span v-else>Modified Date</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="item in item_list">
                        <tr class="bg-opacity-25"
                            :class="{'bg-warning': selectedItem == item}" @click="selectedItem = item">
                            <td  v-if="this.$props.acl >=7" class="py-1 text-center text-primary text-nowrap"
                                style="cursor:pointer" @click="viewFormModal(item)">{{item.id}}</td>
                            <td  v-else class="py-1 text-center text-nowrap">{{item.id}}</td>
                            <td v-if="this.$props.acl >=7" class="py-1 text-center text-primary text-nowrap"
                                style="cursor:pointer" @click="viewFormModal(item)">
                                <span v-if="item.type=='Release' &&this.$props.lang=='kr'">출고</span>
                                <span v-else-if="item.type=='Return' &&this.$props.lang=='kr'">반납</span>
                                <span v-else>{{item.type}}</span>
                            </td>
                            <td  v-else class="py-1 text-center text-nowrap">
                                <span v-if="item.type=='Release' &&this.$props.lang=='kr'">출고</span>
                                <span v-else-if="item.type=='Return' &&this.$props.lang=='kr'">반납</span>
                                <span v-else>{{item.type}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{item.date}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.quantity}}</td>
                            <td class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">{{item.user_name}}</span>
                                <span v-else>{{item.user_name_en}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{item.modify_date}}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="item_list.length == 0 ">
                        <tr>
                            <td colspan="11" class="text-center"> There is no data. </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>

    <div v-if="managementFormModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white text-center">
                    <h4 v-if="this.$props.lang=='kr'">반출/반납 정보</h4>
                    <h4 v-else>Release Information</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeFormModal"></button>
                </div>

                <div class="modal-body" id="form_result">

                    <table class="table table-hover table-bordered m-0 mb-3">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center text-nowrap" style="width:100px;">Type</th>
                                <th class="py-1 text-center text-nowrap">
                                    <label v-if="this.$props.lang=='kr'">날짜</label>
                                    <label v-else>Date</label>
                                </th>
                                <th class="py-1 text-center text-nowrap">
                                    <label v-if="this.$props.lang=='kr'">수량</label>
                                    <label v-else>Quantity</label>
                                </th>
                            </tr>
                        </thead>
                        <tbody>
                            <tr>
                                <td class="py-1 text-center text-nowrap">
                                    <div class="form-control p-0">
                                        <select v-model="edit_item.type" class="form-select border-0"
                                            :disabled="mode == 'view'">
                                            <option value="Release">
                                                <label v-if="this.$props.lang=='kr'">출고</label>
                                                <label v-else>Release</label>
                                            </option>
                                            <option value="Return">
                                                <label v-if="this.$props.lang=='kr'">반납</label>
                                                <label v-else>Return</label>
                                            </option>
                                        </select>
                                    </div>
                                </td>
                                <td class="py-1 text-center text-nowrap">
                                    <div v-if="mode =='view'" class="form-control text-start bg-white">
                                        {{edit_item.date}}
                                    </div>
                                    <div v-else class="form-control text-start input-group date p-0 border-0" id="date">
                                        <input type="text" class="form-control text-start bg-white"
                                               :name="[this.$props.lang == 'kr' ? '날짜' : 'Date']"
                                               :disabled="mode == 'view'"
                                               v-model="edit_item.date" required>
                                        <span class="input-group-addon input-group-text border-1">
                                            <i class="bi bi-calendar-date"></i>
                                        </span>
                                    </div>
                                </td>
                                <td class="py-1 text-end text-nowrap">
                                    <input type="text" class="form-control text-start bg-white"
                                           :name="[this.$props.lang == 'kr' ? '수량' : 'Quantity']"
                                           :disabled="mode == 'view'"
                                           v-model="edit_item.quantity" required>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

                <div class="modal-footer">
                    <div v-if="mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Add Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeFormModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyFormModal">Modify Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeFormModal">Close</div>
                    </div>
                    <div v-else-if="mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Update Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeFormModal">Close</div>
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
    props : ['site','lang','acl','parent_id'],
    data(){
        return {
            mode : "list",
            item_list : [],
            selectedItem : {},
            edit_item : {},
            managementFormModal : false,
            showProgressModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        async loadData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/result/' + vm.$props.parent_id ,null)
                .then(function(res){    vm.item_list = res.data.item_list; })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.mode = "list";
        },
        add_item(){
            this.edit_item = {};
            this.mode = "new";
            this.managementFormModal = true;
            // v-if 로 DOM 을 생성하는 경우, DOM 생성후 datepicker setting 해야 하므로 delay 필요
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    if(e.target.id == "date")
                        vm.edit_item.date = date;
                });
            });
        },
        delete_item(){
            if(event) event.preventDefault();
            if(!this.selectedItem.id){
                warningModal.show_modal("Select a result item!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/result/' + vm.$props.parent_id , { params:{id:vm.selectedItem.id } })
                .then(function(res){
                    vm.item_list = res.data.item_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.$emit('update-result');
        },
        viewFormModal(item){
            this.mode = "view";
            this.edit_item = item;
            this.managementFormModal = true;
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_result")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
        async submitFormModal(){
            if(!this.form_validation()) return false;

            var vm = this;
            if(this.mode == "new"){
                await axios.post('./api/result/' + vm.$props.parent_id , vm.edit_item)
                    .then(function(res){
                        vm.item_list = res.data.item_list;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else{
                await axios.put('./api/result/' + vm.$props.parent_id , vm.edit_item)
                    .then(function(res){
                        vm.item_list = res.data.item_list;
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                        return;
                    });
            }
            vm.showProgressModal = false;
            this.managementFormModal=false;
            this.$emit('update-result');
        },
        modifyFormModal(){
            this.mode = "modify";
            this.edit_item = JSON.parse(JSON.stringify(this.selectedItem));
            // v-if 로 DOM 을 생성하는 경우, DOM 생성후 datepicker setting 해야 하므로 delay 필요
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    if(e.target.id == "date")
                        vm.edit_item.date = date;
                });
            });
        },
        cancelFormModal(){
            this.edit_item = this.selectedItem;
            this.mode = "view";
        },
        closeFormModal(){
            this.managementFormModal=false;
        },
    },
    computed:{
    },
}
</script>
