<template>
    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">

        <div class="hstack">
            <button class="input-group-text py-1 me-1" @click="toggleConditionTab">
                <i class="bi bi-arrow-left-right" style="cursor:pointer"></i>
            </button>

            <button class="input-group-text py-1 me-1" @click="expandSearchToggle">
                <i :class="[expandSearch? 'bi bi-dash-square-fill text-secondary' : 'bi bi-plus-square-fill text-primary']" style="cursor:pointer"></i>
            </button>
            <div class="input-group-text py-1 me-1">{{this.$props.div_name}}</div>
            <div class="col-auto me-1">
                <div class="input-group">
                    <div class="input-group-text col p-1" style="min-width:150px;">
                        <i class="bi bi-people-fill text-primary px-1"></i>
                        <span v-if="parent_org_item">
                            {{this.$props.parent_org_item.org_name}}
                        </span>
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearOrganization"></i>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_org_child"
                               @change="refreshPage"> Include Children
                    </div>
                </div>
            </div>
            <div class="col-auto">
                <div class="input-group">
                    <div class="input-group-text col p-1" style="min-width:150px;">
                        <i class="bi bi-cart-fill text-primary px-1"></i>
                        <span v-if="parent_category_item">
                            {{this.$props.parent_category_item.asset_category}}
                        </span>
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearCategory"></i>
                    </div>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_category_child"
                               @change="refreshPage"> Include Children
                    </div>
                </div>
            </div>
        </div>

        <div class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:70px;">Status</span>
                    <select class="form-select py-1" style="width:150px;" v-model="search_status" @change="searchData">
                        <option value="">All</option>
                        <option value="Using">
                            <span v-if="this.$props.lang == 'kr'">자산 등록</span>
                            <span v-else>Registration</span>
                        </option>
                        <option value="Disuse">
                            <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                            <span v-else>Disuse</span>
                        </option>
                        <option value="Dispatch">
                            <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                            <span v-else>Sample Dispatch</span>
                        </option>
                        <option value="Missing">
                            <span v-if="this.$props.lang == 'kr'">분실 품의</span>
                            <span v-else>Missing</span>
                        </option>
                        <option value="Delete">
                            <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                            <span v-else>Delete</span>
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:70px;">User</span>
                    <input class="form-control shadow-sm py-1" style="width:140px;"
                           placeholder="User Name" v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:110px;">자산 번호</span>
                    <span v-else class="input-group-text pe-1" style="width:110px;">Asset Number</span>
                    <input class="form-control shadow-sm py-1" placeholder="Asset Number"
                           v-model="search_asset_number" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm" style="width:80px;" @click="excelDownload">Excel</button>
                <button class="btn btn-primary shadow-sm ms-2" style="width:80px;" @click="searchData">Search</button>
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
                            <span v-if="lang=='kr'">상태</span><span v-else>Status</span>
                        </th>
                    </tr>
                </thead>
                <tbody v-for="item in tdata.itemList">
                    <tr class="bg-opacity-25" :class="{'bg-warning': selected_item==item}" @click="selected_item=item">
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
                        <td class="py-1 text-center text-nowrap">
                            <span v-if="this.$props.lang == 'kr'">{{item.user_name}}</span>
                            <span v-else>{{item.user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.user_org_name}}</td>
                        <td class="py-1 text-center text-nowrap">
                            <span v-if="item.asset_status == 'Using'">
                                <span v-if="this.$props.lang == 'kr'">자산 등록</span>
                                <span v-else>Registration</span>
                            </span>
                            <span v-else-if="item.asset_status == 'Disuse'">
                                <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                                <span v-else>Disuse</span>
                            </span>
                            <span v-else-if="item.asset_status == 'Dispatch'">
                                <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                                <span v-else>Sample Dispatch</span>
                            </span>
                            <span v-else-if="item.asset_status == 'Missing'">
                                <span v-if="this.$props.lang == 'kr'">분실 품의</span>
                                <span v-else>Missing</span>
                            </span>
                            <span v-else-if="item.asset_status == 'Delete'">
                                <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                                <span v-else>Delete</span>
                            </span>
                            <span v-else>
                                {{item.asset_status}}
                            </span>
                        </td>
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

                                    <button v-if="this.$props.acl >= 9" class="btn btn-danger shadow-sm mx-1"
                                            style="min-width:80px;"
                                            @click="assetMigrationExcelUploadModal=true">Excel Upload</button>

                                    <button v-if="this.$props.acl >= 5 "
                                        type="button" class="btn btn-primary shadow-sm" style="width:80px;"
                                            @click="newDocument">New</button>
                                    <form name="documentForm" method="get">
                                        <input type="hidden" name="div_name" :value="this.$props.div_name">
                                    </form>
                                </div>
                            </div>

                        </td>
                    </tr>
                </tfoot>

            </table>
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
            :asset_item_id="selected_item.id"
            :pmode="'load'"
            @close-modal="closeAssetItemModal"
            @update-data="updateData">
        </asset-item-component>
    </div>

    <div v-if="contentsModal">
        <div class="vue_modal" style="z-index: 9991;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <button class="btn px-2 py-0" @click="popupWindow">
                            <i class="btn bi bi-layers text-white py-0" style="cursor:pointer"></i>
                        </button>

                        <h4 class="col">Asset Request</h4>

                        <button type="button" class="btn-close btn-close-white" @click="contentsModal=false"></button>
                    </div>

                    <asset-contents-component
                            ref="assetContentsComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :div_name="this.$props.div_name"
                            :acl="this.$props.acl"
                            :app_type="'asset'"
                            :doc_id="doc_id"
                            @update-document-id="updateDocId"
                            @close-modal="contentsModal=false">
                    </asset-contents-component>

                </div>
            </div>
        </div>
    </div>

    <div v-if="assetMigrationExcelUploadModal">
        <asset-migration-excel-upload-component
            ref="assetMigrationExcelUploadComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="this.$props.div_name"
            @close-component="assetMigrationExcelUploadModal=false"
            @update-result="updateResult">
        </asset-migration-excel-upload-component>
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
    props : ['site','lang','parent_org_item','parent_category_item','acl','div_name'],
    components: {
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
        'asset-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetContentsComponent.vue', vueLoaderOptions) ),
        'asset-migration-excel-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetMigrationExcelUploadComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            search_status : "",
            edit_item : {},
            showProgressModal : false,
            expandSearch : false,
            viewAssetItemModal : false,
            contentsModal : false,
            doc_id : 0,
            assetMigrationExcelUploadModal : false,
        }
    },
    mounted(){
    },
    watch : {
        div_name(nVal){
            this.searchData();
        }
    },
    methods: {
        // emit function borrowContentsComponent
        updateDocId(id){
            this.doc_id = id;
        },
        // emit function of assetItemComponent
        updateData(){
            this.searchData();
        },
        // emit function
        updateResult(){
            this.assetMigrationExcelUploadModal=false;
            this.searchData();
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

            await axios.get('./api/assetList',
                { params:{ div_name : vm.$props.div_name,
                           active_page: num, page_num: page_num,
                           parent_org_id: vm.$props.parent_org_item.id,
                           parent_category_id: vm.$props.parent_category_item.id,
                           include_org_child : vm.include_org_child,
                           include_category_child : vm.include_category_child,
                           search_status : vm.search_status,
                           search_user : vm.search_user,
                           search_asset_number : vm.search_asset_number,
                           search_product : vm.search_product,
                           search_model : vm.search_model,
                          } })
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
        async excelDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{   div_name : vm.$props.div_name,
                           parent_org_id: vm.$props.parent_org_item.id,
                           parent_category_id: vm.$props.parent_category_item.id,
                           include_org_child : vm.include_org_child,
                           include_category_child : vm.include_category_child,
                           search_status : vm.search_status,
                           search_user : vm.search_user,
                           search_asset_number : vm.search_asset_number,
                           search_product : vm.search_product,
                           search_model : vm.search_model,
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/assetListExcel', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "asset_list.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/assetListExcel', null )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        },
        async refreshPage(){
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
            this.$emit('clear-organization');
        },
        clearCategory(){
            this.$emit('clear-category');
        },
        newDocument(){
            this.doc_id = 0;
            this.contentsModal = true;
        },
        popupWindow(){
            this.contentsModal = false;

            this.newWindow('1200','750','',"ehCForm");
            document.documentForm.target = "ehCForm";
            document.documentForm.action = "./document/"+this.doc_id;
            document.documentForm.submit();
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
    },
    computed:{

    },
}
</script>
