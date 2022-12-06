<template>

    <div class="hstack mt-1">
        <button class="input-group-text me-1" @click="expandSearchToggle">
            <i :class="[expandSearch? 'bi bi-dash-square-fill text-secondary' : 'bi bi-plus-square-fill text-primary']" style="cursor:pointer"></i>
        </button>
        <div class="col-auto">
            <div class="input-group shadow-sm">
                <span class="input-group-text pe-1" style="width:80px;">Division</span>
                <span class="input-group-text pe-1" style="width:80px;">{{div_name}}</span>
            </div>
        </div>
        <div class="col ms-1">
            <div class="input-group shadow-sm">
                <label class="input-group-text" style="width:80px;"><b>Type</b></label>
                <select class="form-select py-1" v-model="search_item_type" @change="searchData">
                    <option value="">All</option>
                    <option value="Registration">
                        <span v-if="this.$props.lang == 'kr'">자산 등록</span>
                        <span v-else>Registration</span>
                    </option>
                    <option value="Transfer">
                        <span v-if="this.$props.lang == 'kr'">자산 이관</span>
                        <span v-else>Transfer</span>
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

        <div class="col ms-1">
            <div class="input-group shadow-sm">
                <span class="input-group-text pe-1" style="width:80px;">Title</span>
                <input class="form-control shadow-sm py-1"
                       v-model="search_title" @keyup.enter="searchData">
            </div>
        </div>
        <div class="col mx-1">
            <div class="input-group shadow-sm">
                <span class="input-group-text pe-1" style="width:80px;">Creator</span>
                <input class="form-control shadow-sm py-1"
                       v-model="search_user" @keyup.enter="searchData">
            </div>
        </div>

        <div class="col-auto ms-auto">
            <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
        </div>

    </div>
    <div v-if="expandSearch" class="hstack mt-1">
        <div class="col-auto">
            <div class="input-group shadow-sm">
                <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:110px;">자산 번호</span>
                <span v-else class="input-group-text pe-1" style="width:110px;">Asset Number</span>
                <input class="form-control shadow-sm py-1" placeholder="Asset Number"
                       v-model="search_asset_number" @keyup.enter="searchData">
            </div>
        </div>
        <div class="col-auto ms-1">
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

    <div class="table-responsive p-0">
        <table class="table table-hover table-bordered m-0 my-2">
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
                <tr class="bg-opacity-25"
                    :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                    <td class="py-1 text-center text-nowrap">
                        <span class="text-primary" style="cursor:pointer"
                              @click="viewExecution(item.id)">{{item.id}}</span>
                    </td>
                    <td class="py-1 text-start text-nowrap">
                        <span class="text-primary" style="cursor:pointer"
                              @click="viewExecution(item.id)">
                            <span v-if="item.item_type=='Registration'">
                                <span v-if="this.$props.lang=='kr'">자산 등록</span>
                                <span v-else>Registration</span>
                            </span>
                            <span v-if="item.item_type=='Transfer'">
                                <span v-if="this.$props.lang == 'kr'">자산 이관</span>
                                <span v-else>Transfer</span>
                            </span>
                            <span v-if="item.item_type=='Disuse'">
                                <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                                <span v-else>Disuse</span>
                            </span>
                            <span v-if="item.item_type=='Dispatch'">
                                <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                                <span v-else>Sample Dispatch</span>
                            </span>
                            <span v-if="item.item_type=='Missing'">
                                <span v-if="this.$props.lang == 'kr'">분실 품의</span>
                                <span v-else>Missing</span>
                            </span>
                            <option v-if="item.item_type=='Delete'">
                                <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                                <span v-else>Delete</span>
                            </option>
                        </span>
                    </td>
                    <td class="py-1 text-start text-nowrap">
                        <span class="text-primary" style="cursor:pointer"
                              @click="viewExecution(item.id)">{{item.title}}</span>
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
                                <button v-if="this.$props.acl > 3 "
                                    type="button" class="btn btn-primary shadow-sm" style="width:100px;"
                                        @click="newDocument">New</button>
                                <form name="newDocumentForm" method="get">
                                    <input type="hidden" name="div_name" :value="this.$props.div_name">
                                </form>
                                <form name="documentForm" method="get"></form>
                            </div>
                        </div>
                    </td>
                </tr>
            </tfoot>
        </table>
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
    props : ['site','lang','acl','div_name'],
    components: {
        'asset-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetContentsComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            div_name : this.$props.div_name,
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            showProgressModal : false,
            search_item_type : "",
            contentsModal : false,
            expandSearch : false,
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        expandSearchToggle(){
            this.expandSearch = !this.expandSearch;
        },
        async searchData(){
            this.active_page = 1;
            this.page(this.active_page, this.page_num, null);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/executionList',
                { params:{  div_name : vm.div_name,
                            active_page: num, page_num: page_num,
                            search_item_type: vm.search_item_type,
                            search_title: vm.search_title,
                            search_user: vm.search_user,
                            search_asset_number : vm.search_asset_number,
                            search_product : vm.search_product,
                            search_model : vm.search_model,
                        }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewExecution(pk){
            if(location.pathname.includes("/document/"+pk)){
                warningModal.show_modal("This document is already opened!");
            }else if(location.pathname.includes("/document/")){
                this.newWindow('1200','750','',"ehCForm"+pk);
                document.documentForm.target = "ehCForm"+pk;
                document.documentForm.action = "./"+pk;
                document.documentForm.submit();
            }else{
                this.newWindow('1200','750','',"ehCForm"+pk);
                document.documentForm.target = "ehCForm"+pk;
                document.documentForm.action = "./document/"+pk;
                document.documentForm.submit();
            }
        },
        newDocument(){
            this.doc_id = 0;
            this.contentsModal = true;
        },
        popupWindow(){
            this.contentsModal = false;

            this.newWindow('1200','750','',"ehCForm");
            document.newDocumentForm.target = "ehCForm";
            document.newDocumentForm.action = "./document/"+this.doc_id;
            document.newDocumentForm.submit();
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
    },
}
</script>
