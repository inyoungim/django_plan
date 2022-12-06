<template>

    <!-- New Item Modal -->
    <div class="row">
        <div class="col-lg-6 vstack align-top p-1 px-2">
            <div class="hstack border-bottom border-primary">
                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25" style="cursor:pointer"
                     :class="[switchData == 'docHistory' ? 'bg-primary ':'bg-white text-black-50']" @click="changeSwitchData('docHistory')">
                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'docHistory' ? 'text-danger':'text-black-50']"></i>
                    <b>Execution History</b>
                </div>
                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1" style="cursor:pointer"
                     :class="[switchData == 'propHistory' ? 'bg-success':'bg-white text-black-50']"  @click="changeSwitchData('propHistory')">
                    <i class="bi bi-grid-3x3-gap-fill px-2" :class="[switchData == 'propHistory' ? 'text-danger':'text-black-50']"></i>
                    <b>Property Change History</b>
                </div>

                <div class="col-auto ms-auto">
                    <button v-if="expandAll" type="button" class="btn btn-outline-primary" style="padding:0.1em 0.5em;" @click="contractHeight">
                        <i class="bi bi-arrows-angle-contract"></i>
                    </button>
                    <button v-else type="button" class="btn btn-outline-danger" style="padding:0.1em 0.5em;" @click="expandHeight">
                        <i class="bi bi-arrows-angle-expand"></i>
                    </button>
                </div>
            </div>

            <div v-if="switchData == 'docHistory'" class="m-0 p-0">
                <table class="table table-hover table-bordered m-0 mb-3">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">PK</th>
                            <th class="py-1 text-center text-nowrap">Type</th>
                            <th class="py-1 text-center text-nowrap">Title</th>
                            <th class="py-1 text-center text-nowrap">Creator</th>
                            <th class="py-1 text-center text-nowrap">Create Date</th>
                            <th class="py-1 text-center text-nowrap">Status</th>
                        </tr>
                    </thead>
                    <tbody v-for="item,i in tdata.itemList">
                        <tr v-if="expandAll || i < 5" class="bg-opacity-25"
                            :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                            <td class="py-1 text-center text-nowrap">
                                <span class="text-primary" style="cursor:pointer"
                                      @click="viewExecution(item.parent)">{{item.parent}}</span>
                            </td>
                            <td class="py-1 text-start text-nowrap">
                                <span class="text-primary" style="cursor:pointer"
                                      @click="viewExecution(item.parent)">{{item.item_type}}</span>
                            </td>
                            <td class="py-1 text-start text-nowrap">
                                <span class="text-primary" style="cursor:pointer"
                                      @click="viewExecution(item.parent)">{{item.title}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'">{{item.user_name}}</span>
                                <span v-else>{{item.user_name_en}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.status}}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="tdata.itemList && tdata.itemList.length == 0 ">
                        <tr>
                            <td colspan="11" class="text-center"> There is no data. </td>
                        </tr>
                    </tbody>
                    <tfoot v-if="expandAll">
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
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <form name="assetDocumentForm" method="get"></form>
            </div>

            <div v-if="switchData == 'propHistory'" class="m-0 p-0">
                <table class="table table-hover table-bordered m-0 mb-3">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">PK</th>
                            <th class="py-1 text-center text-nowrap">Asset Category</th>
                            <th class="py-1 text-center text-nowrap">
                                <b v-if="lang=='kr'">품명</b><b v-else>Product Name</b>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <b v-if="lang=='kr'">모델명</b><b v-else>Model Name</b>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <b v-if="lang=='kr'">제조사</b><b v-else>Maker</b>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                <b v-if="lang=='kr'">입고 금액</b><b v-else>Receiving amount</b>
                            </th>
                            <th class="py-1 text-center text-nowrap">Creator</th>
                            <th class="py-1 text-center text-nowrap">Create Date</th>
                        </tr>
                    </thead>
                    <tbody v-for="item,i in tdata.itemList">
                        <tr v-if="expandAll || i < 5" class="bg-opacity-25"
                            :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                            <td class="py-1 text-center text-nowrap">
                                <span class="text-primary" style="cursor:pointer"
                                      @click="viewPropsDocument(item)">{{item.id}}</span>
                            </td>
                            <td class="py-1 text-start text-nowrap">{{item.asset_category}}</td>
                            <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                            <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                            <td class="py-1 text-start text-nowrap">{{item.asset_maker}}</td>
                            <td class="py-1 text-end text-nowrap">{{markedCost(item.asset_cost)}}</td>
                            <td class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang=='kr'">{{item.user_name}}</span>
                                <span v-else>{{item.user_name_en}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="tdata.itemList && tdata.itemList.length == 0 ">
                        <tr>
                            <td colspan="11" class="text-center"> There is no data. </td>
                        </tr>
                    </tbody>
                    <tfoot v-if="expandAll">
                        <tr>
                            <td colspan="100" class="px-0">
                                <div class="row mt-3 mx-0 p-0">
                                    <div class="col-md-3 col-12 text-start px-1" role="group">
                                        <div class="dropdown">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownNumberButton2"
                                                data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"> {{page_num}} </button>
                                            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNumberButton2" style="min-width:50px;" >
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
                                    <div class="col-md-3 col-12 text-end">
                                        <div v-if="this.$props.acl >=7" class="col text-end">
                                            <div class="btn btn-primary py-1 ms-auto" style="min-width:100px;"
                                                 @click="modifyPropertyFormModal">Change Property</div>
                                        </div>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
                <div v-if="!expandAll">
                    <div v-if="this.$props.acl >=7" class="col text-end">
                        <div class="btn btn-primary py-1 ms-auto" style="min-width:100px;"
                             @click="modifyPropertyFormModal">Change Property</div>
                    </div>
                </div>
            </div>

        </div>
    </div>

    <!-- Property Document Modal -->
    <div v-if="showPropsDocumentModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Asset Property</h4>
                    <button type="button" class="btn-close btn-close btn-close-white"
                            @click="closePropertyFormModal"></button>
                </div>
                <div class="modal-body" id="asset_form" style="min-height:100px;">
                    <div class="row">
                        <div class="col pt-1 px-2 mb-3">
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Asset Category</b>
                                </label>
                                <div class="input-group-text form-control text-start p-0">
                                    <input type="hidden" v-model="edit_item.asset_category_id">
                                    <input type="text" class="form-control text-start border-0"
                                           :class="{'bg-white' :mode == 'view'}"
                                           name="Asset Category" v-model="edit_item.asset_category" readonly required>
                                    <div v-if="mode != 'view'" class="input-group-tex border-start">
                                        <asset-category-select-component
                                                ref="organizationAccountSelectComponent"
                                                :site="this.$props.site"
                                                :lang="this.$props.lang"
                                                :acl="this.$props.acl"
                                                :div_name="this.$props.div_name"
                                                @select-target="selectedAssetCategory">
                                        </asset-category-select-component>
                                    </div>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">품명</b><b v-else>Product Name</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '품명' : 'Product Name']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_product" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">모델명</b><b v-else>Model Name</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '모델명' : 'Model Name']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_model" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">제조사</b><b v-else>Maker</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '제조사' : 'Maker']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_maker" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">입고 금액</b><b v-else>Receiving amount</b>
                                </label>
                                <input type="text" class="form-control text-start"
                                       :class="{'bg-white' :(mode == 'view' || mode == 'changeCategory')}"
                                       :name="[this.$props.lang == 'kr' ? '입고 금액' : 'Receiving amount']"
                                       :disabled="(mode == 'view' || mode == 'changeCategory')"
                                       v-model="edit_item.asset_cost" required>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Comments</b>
                                </label>
                                <textarea class="form-control bg-white" :disabled="mode == 'view'"
                                          rows="3" name="Comments" v-model="edit_item.comments" required>
                                </textarea>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text" style="width:160px;"><b>Attached</b></label>
                                <div class="col text-start" v-if="mode == 'new'">
                                    <attached-file-component
                                            ref="attachedFileComponent"
                                            :attached_list="edit_item.attached_files"
                                            :mode="mode">
                                    </attached-file-component>
                                </div>
                                <div class="col text-start" v-else>
                                    <attached-file-component
                                            :attached_list="edit_item.attached_files"
                                            :base_url="'property/'">
                                    </attached-file-component>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div v-if="mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitPropertyFormModal">Save</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closePropertyFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closePropertyFormModal">Close</div>
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
    props : ['site','lang','acl','div_name','parent_id'],
    components: {
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            parent_id : this.$props.parent_id,
            expandAll : false,
            switchData : 'docHistory',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            showProgressModal : false,

            mode : 'view',
            showPropsDocumentModal : false,
            edit_item : {},
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        // emit of assetCategoryListComponent
        selectedAssetCategory(item){
            this.edit_item.asset_category_id = item.id;
            this.edit_item.asset_category = item.asset_category;
        },
        contractHeight(){
            this.expandAll = false;
        },
        expandHeight(){
            this.expandAll = true;
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
            this.page(1,this.page_num, null);
        },
        async loadData(){
            this.active_page = 1;
            this.page(this.active_page, this.page_num, null);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            if(this.switchData == 'docHistory'){
                await axios.get('./api/executionHistory/'+vm.parent_id,
                    { params:{ active_page: num, page_num: page_num, } })
                    .then(function(res){
                        vm.tdata = res.data;
                        vm.page_num = page_num;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else{
                await axios.get('./api/propertyHistory/'+vm.parent_id,
                    { params:{ active_page: num, page_num: page_num, } })
                    .then(function(res){
                        vm.tdata = res.data;
                        vm.page_num = page_num;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }
            this.showProgressModal = false;
        },
        viewExecution(pk){
            if(location.pathname.includes("/document/"+pk)){
                warningModal.show_modal("This document is already opened!");
            }else if(location.pathname.includes("/document/")){
                this.newWindow('1200','750','',"ehCForm"+pk);
                document.assetDocumentForm.target = "ehCForm"+pk;
                document.assetDocumentForm.action = "./"+pk;
                document.assetDocumentForm.submit();
            }else{
                this.newWindow('1200','750','',"ehCForm"+pk);
                document.assetDocumentForm.target = "ehCForm"+pk;
                document.assetDocumentForm.action = "./document/"+pk;
                document.assetDocumentForm.submit();
            }
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },

        async viewPropsDocument(item){
            this.mode = "view";
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/propertyData/'+item.id, null)
                    .then(function(res){
                        vm.edit_item = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            this.showProgressModal = false;
            this.showPropsDocumentModal = true;
        },
        modifyPropertyFormModal(){
            this.edit_item = {};
            if(this.tdata.itemList.length > 0){
                this.edit_item.asset_category_id = this.tdata.itemList[0].asset_category_id;
                this.edit_item.asset_category = this.tdata.itemList[0].asset_category;
                this.edit_item.asset_product = this.tdata.itemList[0].asset_product;
                this.edit_item.asset_model = this.tdata.itemList[0].asset_model;
                this.edit_item.asset_maker = this.tdata.itemList[0].asset_maker;
                this.edit_item.asset_cost = this.tdata.itemList[0].asset_cost;
            }
            this.mode = "new";
            this.showPropsDocumentModal = true;
        },
        closePropertyFormModal(){
            this.edit_item = {};
            this.showPropsDocumentModal = false;
            this.mode = "view";
        },
        form_validation(){
            var requiredElements = document.querySelector("#asset_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitPropertyFormModal(){
            if(this.form_validation()) return false;

            var vm = this;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            this.showProgressModal = true;
            var axios_return = false;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.edit_item.attache_files = [];
                vm.edit_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.edit_item.attache_files.push(response.svr_file_names[i]);
                    vm.edit_item.attache_file_names.push(response.up_file_names[i]);
                }
                var svr_result = false;
                await axios.post('./api/propertyHistory/'+ vm.parent_id, vm.edit_item)
                    .then(function(res){
                        svr_result = true;
                     })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
                this.showProgressModal = false;
                if(svr_result){
                    vm.edit_item = {};
                    vm.showPropsDocumentModal = false;
                    vm.mode = "view";
                    vm.$emit('update-item');
                    vm.loadData();
                }
            }
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    }
}
</script>
