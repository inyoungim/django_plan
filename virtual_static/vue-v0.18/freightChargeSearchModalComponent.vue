<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Freight Charge Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack my-1 justify-content-end">
                        <div class="input-group-text">
                            {{ this.$props.div_name }}
                        </div>
                        <div class="col px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">
                                    <span v-if="this.$props.lang =='kr'">상차지</span>
                                    <span v-else>Start Location</span>
                                </label>
                                <input class="form-control" v-model="start_location" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <div class="col px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">
                                    <span v-if="this.$props.lang =='kr'">하차지</span>
                                    <span v-else>End Location</span>
                                </label>
                                <input class="form-control" v-model="end_location" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <div class="col px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">
                                    <span v-if="this.$props.lang =='kr'">중량</span>
                                    <span v-else>Weight</span>
                                </label>
                                <input class="form-control" v-model="freight_weight" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <button class="btn btn-primary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">
                                    <span v-if="this.$props.lang =='kr'">상차지</span>
                                    <span v-else>Start Location</span>
                                </th>
                                <th class="py-1 text-center">
                                    <span v-if="this.$props.lang =='kr'">하차지</span>
                                    <span v-else>End Location</span>
                                </th>
                                <th class="py-1 text-center">
                                    <span v-if="this.$props.lang =='kr'">중량(t)</span>
                                    <span v-else>Freight Weight</span>
                                </th>
                                <th class="py-1 text-center">Cost</th>
                            </tr>
                        </thead>
                         <tbody class="shadow-sm">
                            <tr v-for="data in tdata.searchList" class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': selectedItem.id == data.id}"
                                @click="selectedItem=data" @dblclick="selectSearchModal">
                                <td class="py-1 text-start">{{data.start_location}}</td>
                                <td class="py-1 text-start">{{data.end_location}}</td>
                                <td class="py-1 text-end">{{data.freight_weight}}</td>
                                <td class="py-1 text-end">{{ markedCost(data.freight_cost) }}</td>
                            </tr>
                            <tr v-if="!tdata.searchList">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="100">
                                    <div class="hstack mt-3">
                                        <div class="col-md-3 col-12 text-start" role="group">
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
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>

                </div>
                <div class="modal-footer">
                    <div v-if="this.$props.pmode == 'mgmt'" class="col text-end my-1">
                        <div v-if="this.$props.acl >= 7" class="d-flex">
                            <div class="btn btn-darkblue me-auto" style="min-width:80px;padding:0.1em 0.5em;" @click="excelUpload">Excel Upload</div>

                            <div class="btn btn-darkblue ms-auto" style="width:80px;padding:0.1em 0.5em;" @click="newItem">Add</div>
                            <div class="btn btn-darkblue ms-1" style="width:80px;padding:0.1em 0.5em;" @click="modifyItem">Modify</div>
                            <div class="btn btn-danger ms-1" style="width:80px;padding:0.1em 0.5em;" @click="deleteItem">Delete</div>
                        </div>
                    </div>
                    <div v-else class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectSearchModal">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeSearchModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Freight Charge Management Modal -->
    <div v-if="mode == 'new' || mode == 'modify' || mode == 'delete'" class="vue_modal" style="z-index: 9992;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Freight Charge </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="freight_charge_form">
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <span v-if="this.$props.lang =='kr'"><b>상차지</b></span>
                            <span v-else><b>Start Location</b></span>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Start Location" v-model="targetItem.start_location" required>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <span v-if="this.$props.lang =='kr'"><b>하차지</b></span>
                            <span v-else><b>End Location</b></span>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="End Location" v-model="targetItem.end_location" required>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <span v-if="this.$props.lang =='kr'"><b>중량(t)</b></span>
                            <span v-else><b>Freight Weight</b></span>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Freight Weight" v-model="targetItem.freight_weight" required>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Cost</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Cost" v-model="targetItem.freight_cost" required>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div v-if="mode == 'new'" class="btn btn-primary me-4" style="width:100px;"
                             @click="submitFormModal">Submit</div>
                        <div v-if="mode == 'new'" class="btn btn-primary me-4" style="min-width:100px;"
                             @click="submitFormModal('continue')">Submit & Continue</div>
                        <div v-if="mode == 'new'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Close</div>

                        <div v-if="mode == 'modify'" class="btn btn-primary me-4" style="width:100px;"
                             @click="updateFormModal">Update</div>
                        <div v-if="mode == 'modify'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Cancel</div>
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
                <div id="excelUploadForm" class="modal-body">
                    <div class="col text-start p-1">
                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:160px;">
                                <b>Reference Excel Data</b>
                            </label>
                            <label class="form-control bg-white">
                                <a href="#" class="link-primary text-decoration-none"
                                   @click="reference_file_download('Freight_charge_sample.xlsx')">Freight Charge Sample.xlsx</a>
                            </label>
                        </div>
                    </div>
                    <div class="col vstack align-top p-1">
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
    props : ['site','lang','acl','pmode','div_name','search_string'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            tdata : {},
            search_string :this.$props.search_string,
            selectedItem : {},
            targetItem : {},

            showSearchListModal : false,
            excelUploadModal : false,
            showProgressModal : false,
            page_num : 10,
        }
    },
    mounted(){
        this.page(1,this.page_num);
    },
    methods: {
        openSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
            this.$emit('close-modal');
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/freightChargeSearch',
                { params:{  div_name : vm.$props.div_name,
                            active_page: num, page_num: page_num,
                            start_location : vm.start_location, end_location : vm.end_location,
                            freight_weight : vm.freight_weight } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async refreshPage(event){
            if(event) event.preventDefault();
            await this.page(this.tdata.active_page, this.page_num );
        },
        async searchData(event){
            if(event) event.preventDefault();
            await this.page(this.tdata.active_page, this.page_num );
        },
        selectSearchModal(){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select a item.");
                return;
            }
            this.showSearchListModal = false;
            this.$emit('select-target', this.selectedItem);
        },

        newItem(){
            this.mode = "new";
            this.targetItem = {};
        },
        modifyItem(){
            if(this.selectedItem.id){
                this.targetItem = JSON.parse(JSON.stringify(this.selectedItem));
                this.mode = "modify";
            }else{
                warningModal.show_modal("Please, select one column.");
            }
        },
        cancelItem(){
            this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelector("#freight_charge_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitFormModal(mode=null){
            if(this.form_validation()) return false;
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem.div_name = vm.$props.div_name;
            await axios.post('./api/freightCharge/0', vm.targetItem)
                .then(function(res){ })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
            await this.page(this.tdata.active_page, this.page_num );


            if(mode == 'continue')
                this.mode = "new";
        },
        async updateFormModal(){
            if(this.form_validation()) return false;
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem.div_name = vm.$props.div_name;
            await axios.put('./api/freightCharge/'+vm.targetItem.id, vm.targetItem)
                .then(function(res){ })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
            await this.page(this.tdata.active_page, this.page_num );
        },
        deleteItem(){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            if(vm.selectedItem.id){
                await axios.delete('./api/freightCharge/'+vm.selectedItem.id,null)
                    .then(function(res){ })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = "";
            await this.page(this.tdata.active_page, this.page_num );
        },

        excelUpload(evnet){
            if(event) event.preventDefault();
            this.excelUploadModal = true;
        },
        async reference_file_download(file_name){
            var vm = this;
            var config = { responseType: 'blob', };
            await axios.get('./api/freightChargeExcelDownload',config )
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
            await axios.post('./api/freightChargeExcelUpload',response )
                .then(function(res){ })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.$refs.attachedFileComponent.initialize();
                    return;
                });
            this.excelUploadModal = false;
            this.searchData();
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
    },
}
</script>
