<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">User Defined Project</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack my-1 justify-content-end">
                        <div class="input-group-text">
                            {{ this.$props.div_name }}
                        </div>
                        <div class="col-auto px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Project Code / Project Name</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                            </div>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="5%"><i class="bi bi-c-square"></i></th>
                                <th class="py-1 text-center">Project Name</th>
                                <th class="py-1 text-center">Project Code</th></th>
                            </tr>
                        </thead>
                         <tbody class="shadow-sm">
                            <tr v-for="data in tdata.searchList" class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': selectedItem.id == data.id}"
                                @click="selectedItem=data">
                                <td class="py-1 text-center" width="5%"><i class="bi bi-c-square"></i></td>
                                <td class="py-1 text-start">{{data.project_name}}</td>
                                <td class="py-1 text-start">{{data.project_code}}</td>
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
                <div class="modal-header py-2 bg-primary bg-opacity-25">
                    <h4 class="col"> User Defined Project </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="udf_form">
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Project Name</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Project Name" v-model="targetItem.project_name" required>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:160px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Project Code</b>
                        </label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Project Code" v-model="targetItem.project_code" required>
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
    data(){
        return {
            mode : "view",
            tdata : {},
            search_string :this.$props.search_string,
            selectedItem : {},
            targetItem : {},

            showSearchListModal : false,
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
            await axios.get('./api/userDefinedProject/0',
                { params:{
                    div_name : vm.$props.div_name,
                    active_page: num, page_num: page_num,
                    search_string : vm.search_string } })
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
        closeSearchModal(){
            this.selectedItem = {};
            this.showSearchListModal = false;
            this.$emit('close-modal');
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
            var requiredElements = document.querySelector("#udf_form").querySelectorAll("[required]");
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
            await axios.post('./api/userDefinedProject/0', vm.targetItem)
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
            await axios.put('./api/userDefinedProject/'+vm.targetItem.id, vm.targetItem)
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
                await axios.delete('./api/userDefinedProject/'+vm.selectedItem.id,null)
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
