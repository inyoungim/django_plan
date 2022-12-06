<template>

    <div v-if="pmode =='mgmt'" class="col">
        <div class="vue_modal" style="z-index: 9991;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <h4 class="col">Business Trip Cost Management</h4>
                        <button type="button" class="btn-close btn-close btn-close-white" @click="this.$emit('close-modal')"></button>
                    </div>

                    <div class="modal-body" style="min-height:150px; max-height:400px;">
                        <div class="hstack my-1 justify-content-end">
                            <div class="input-group-text">
                                {{ this.$props.div_name }}
                            </div>
                            <div class="col-auto px-1">
                                <div class="input-group shadow-sm">
                                    <label class="input-group-text">Trip Location</label>
                                    <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                    <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                                </div>
                            </div>
                        </div>

                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center">No</th>
                                    <th class="py-1 text-center" >Trip Category</th>
                                    <th class="py-1 text-center" >Trip Location</th>
                                    <th class="py-1 text-center" >Airplane Price</th>
                                    <th class="py-1 text-center" >Fuel Tax</th>
                                    <th class="py-1 text-center" >Room Charge</th>
                                    <th class="py-1 text-center" >Activity Cost</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="(location,i) in searchList" class="bg-opacity-25"
                                    :class="{'bg-warning': target_item == location}" style="cursor:pointer"
                                    @click="setTarget(location)" style="cursor:pointer">
                                    <td class="py-1 text-center">{{i+1}}</td>
                                    <td class="py-1 text-center">{{location.trip_category}}</td>
                                    <td class="py-1 text-start">{{markedCost(location.trip_location)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.airplane_price)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.fuel_tax)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.room_charge)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.activity_cost)}}</td>
                                </tr>
                                <tr v-if="searchList.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>

                        </table>
                    </div>
                    <div class="modal-footer">
                        <div class="col text-end my-1">
                            <div class="d-flex">
                                <div class="btn btn-darkblue me-auto" style="min-width:80px;padding:0.1em 0.5em;" @click="excelUpload">Excel Upload</div>
                                <div class="btn btn-darkblue ms-auto" style="width:80px;padding:0.1em 0.5em;" @click="newBizTripCost">Add</div>
                                <div class="btn btn-darkblue ms-1" style="width:80px;padding:0.1em 0.5em;" @click="modifyBizTripCost">Modify</div>
                                <div class="btn btn-danger ms-1" style="width:80px;padding:0.1em 0.5em;" @click="deleteBizTripCost">Delete</div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-else class="col">
        <button class="input-group-text border-0" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="bizTripManagementModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Business Trip Cost Management</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeBizTripCost"></button>
                </div>
                <div id="bizTripFormId" class="modal-body" style="min-height:100px;">
                    <div class="col vstack align-top p-1">
                        <input type="hidden" v-model="edit_item.div_name">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Trip Category</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Trip Category" v-model="edit_item.trip_category" required>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Trip Location</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Trip Location" v-model="edit_item.trip_location" required>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Airplane Price</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Airplane Price" v-model="edit_item.airplane_price" required>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Fuel Tax</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Fuel Tax" v-model="edit_item.fuel_tax" required>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Room Charge</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Room Charge" v-model="edit_item.room_charge" required>
                        </div>
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:120px;">
                                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                <b>Activity Cost</b>
                            </label>
                            <input class="form-control bg-white" type="text" :disabled="mode == 'view'"
                                   name="Activity Cost" v-model="edit_item.activity_cost" required>
                        </div>

                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <iftag v-if="this.$props.acl >= 5">
                            <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="submitFormModal">Save</div>
                            <div v-if="mode == 'modify'" class="btn btn-primary me-4" style="width:100px;"
                                 @click="updateFormModal">Update</div>
                            <div v-if="mode == 'modify'" class="btn btn-secondary" style="width:100px;"
                                 @click="closeBizTripCost">Cancel</div>
                            <div v-else class="btn btn-secondary" style="width:100px;"
                             @click="closeBizTripCost">Close</div>
                        </iftag>
                        <div v-else class="btn btn-secondary" style="width:100px;"
                             @click="closeBizTripCost">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Business Trip Location Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="hstack">
                        <div class="col-auto ms-auto me-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Trip Location</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
                        </div>
                    </div>

                    <div class="table-responsive p-0 mt-2">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-pin-map"></i></th>
                                    <th class="py-1 text-center" >Trip Category</th>
                                    <th class="py-1 text-center" >Trip Location</th>
                                    <th class="py-1 text-center" >Airplane Price</th>
                                    <th class="py-1 text-center" >Fuel Tax</th>
                                    <th class="py-1 text-center" >Room Charge</th>
                                    <th class="py-1 text-center" >Activity Cost</th>
                                </tr>
                            </thead>
                             <tbody class="shadow-sm">
                                <tr v-for="location in searchList" @click="setTarget(location)" style="cursor:pointer">
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-pin-map"></i></th>
                                    <td class="py-1 text-center">{{location.trip_category}}</td>
                                    <td class="py-1 text-start">{{location.trip_location}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.airplane_price)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.fuel_tax)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.room_charge)}}</td>
                                    <td class="py-1 text-end">{{markedCost(location.activity_cost)}}</td>
                                </tr>
                                <tr v-if="searchList.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col">
                        <button type="button" class="btn btn-secondary shadow-sm ms-1" style="width:100px"
                                @click="closeSearchModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="excelUploadModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Excel Upload</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="excelUploadModal=false"></button>
                </div>
                <div id="excelUploadForm" class="modal-body text-start">
                    <div class="col">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:160px;">
                                <b>Reference Excel Data</b>
                            </label>
                            <label class="form-control bg-white">
                                <a href="#" class="link-primary text-decoration-none"
                                   @click="reference_file_download('Business_Trip_Location_Sample.xlsx')">Business Trip Location Sample.xlsx</a>
                            </label>
                        </div>
                    </div>
                    <div class="col vstack align-top">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:160px;">
                                <b>New Excel Data</b>
                            </label>
                            <label class="form-control p-1 pb-0">
                                <attached-file-component
                                    ref="attachedFileComponent"
                                    :attached_list="[]"
                                    :type="'single'"
                                    :mode="'new'"></attached-file-component>
                            </label>
                        </div>


                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-4" style="width:100px;"
                             @click="applyUpload">Apply</div>
                        <div class="btn btn-secondary" style="width:100px;"
                         @click="excelUploadModal=false">Close</div>
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
    props : ['site','lang','pmode','acl','div_name'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "list",
            searchList : [],
            search_string :"",
            target_item : {},

            bizTripManagementModal : false,
            showSearchListModal : false,
            excelUploadModal : false,
            showProgressModal : false,
            maxHeight : 200,
        }
    },
    mounted(){
        if(this.$props.pmode == "mgmt"){
            this.parent_acc_item = { 'id' : 0};
        }
        this.searchData();
    },
    methods: {
        contractHeight(){
            this.maxHeight = 200;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        excelUpload(evnet){
            if(event) event.preventDefault();
            this.excelUploadModal = true;
        },
        async reference_file_download(file_name){
            var vm = this;
            var config = { responseType: 'blob', };
            await axios.get('./api/bizTripLocationExcelDownload',config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){ vm.errcheck = err;  });
        },
        async applyUpload(event){
            var response = await this.$refs.attachedFileComponent.uploadStart(null);
            if( response.svr_file_names.length == 0){
                warningModal.show_modal("Please input excel file.");
                this.$refs.attachedFileComponent.initialize();
                return;
            }
            if( response.result == false ){
                warningModal.show_modal(response.err);
                return;
            }
            var vm = this;
            response.div_name = vm.$props.div_name;
            await axios.post('./api/bizTripLocationExcelUpload',response )
                .then(function(res){ })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.$refs.attachedFileComponent.initialize();
                    return;
                });
            this.excelUploadModal = false;
            this.searchData();
        },
        openSearchModal(event){
            if(event) event.preventDefault();
            this.searchList = [];
            this.search_string = "";
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/bizTripLocation',
                { params:{ 'div_name': vm.$props.div_name, 'search_text': vm.search_string }, })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchList = res.data.searchList;
                    }else{
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        setTarget(data){
            this.target_item = data;
            this.showSearchListModal = false;
            this.$emit('select-target', this.target_item);
        },
        clearTarget(){
            this.target_item = {};
            this.showSearchListModal = false;
        },
        newBizTripCost(event){
            if(event) event.preventDefault();
            this.edit_item = {'div_name': this.$props.div_name  };
            this.bizTripManagementModal = true;
            this.mode = "new";
        },
        modifyBizTripCost(event){
            if(event) event.preventDefault();
            if(!this.target_item.id){
                warningModal.show_modal("Please select a item!");
                return;
            }
            this.edit_item = JSON.parse(JSON.stringify(this.target_item));
            this.bizTripManagementModal = true;
            this.mode = "modify";
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#bizTripFormId")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
            if(!this.isNumeric(this.edit_item.airplane_price)){
                warningModal.show_modal("Please input number in [ Airplane Price ] field!");
                return true;
            }
            if(!this.isNumeric(this.edit_item.fuel_tax)){
                warningModal.show_modal("Please input number in [ Fuel Tax ] field!");
                return true;
            }
            if(!this.isNumeric(this.edit_item.room_charge)){
                warningModal.show_modal("Please input number in [ Room Charge ] field!");
                return true;
            }
            if(!this.isNumeric(this.edit_item.activity_cost)){
                warningModal.show_modal("Please input number in [ Activity Cost ] field!");
                return true;
            }
            return false;
        },
        async submitFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;

            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/bizTripLocation', vm.edit_item )
                .then(function(res){
                    vm.searchList = res.data.searchList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.bizTripManagementModal = false;
            for(var i=0; i<this.searchList.length; i++){
                if(this.searchList[i].trip_location == this.edit_item.trip_location)
                    this.target_item = this.searchList[i];
            }
        },
        async updateFormModal(event){
            if(event) event.preventDefault();
            if(this.form_validation()) return false;

            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/bizTripLocation', vm.edit_item )
                .then(function(res){
                    vm.searchList = res.data.searchList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.bizTripManagementModal = false;

            for(var i=0; i<this.searchList.length; i++){
                if(this.searchList[i].id == this.edit_item.id)
                    this.target_item = this.searchList[i];
            }
        },
        cancelBizTripCost(event){
            if(event) event.preventDefault();
            this.edit_item = this.target_item;
        },
        closeBizTripCost(event){
            if(event) event.preventDefault();
            this.bizTripManagementModal = false;
            this.mode = "list";
        },
        deleteBizTripCost(event){
            if(event) event.preventDefault();
            if(!this.target_item.id){
                warningModal.show_modal("Please select a item!");
                return;
            }
            this.edit_item = JSON.parse(JSON.stringify(this.target_item));
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/bizTripLocation',
                { params:{ 'div_name': vm.$props.div_name, 'target_id': vm.target_item.id } })
                .then(function(res){
                    vm.searchList = res.data.searchList;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.bizTripManagementModal = false;
            this.target_item = {};
            this.edit_item = {};
        },
        isNumeric(num){
            num = String(num).replace(/^\s+|\s+$/g, "");
            var regex = /^[0-9]+(\.[0-9]+)?$/g;
            if( regex.test(num) ){
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            }else{ return false;  }
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return 0;
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
