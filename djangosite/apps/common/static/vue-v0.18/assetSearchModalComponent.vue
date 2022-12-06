<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Asset Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">

                    <div class="hstack mt-1">
                        <div class="col-auto">
                            <div class="input-group shadow-sm">
                                <span class="input-group-text pe-1" style="width:120px;">Division</span>
                                <span class="input-group-text pe-1" style="width:120px;">{{this.$props.div_name}}</span>
                            </div>
                        </div>
                        <div class="col-auto ms-1">
                            <div class="input-group shadow-sm">
                                <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:120px;">자산 상태</span>
                                <span v-else class="input-group-text pe-1" style="width:120px;">Asset Status</span>
                                <select v-model="search_status" class="form-select py-1" style="width:170px;"
                                        @change="searchData" disabled>
                                    <option value="">All</option>
                                    <option value="Using">Using</option>
                                    <option value="Disuse">Disuse</option>
                                </select>
                            </div>
                        </div>
                        <div class="col-auto ms-1">
                            <div class="input-group shadow-sm">
                                <span class="input-group-text pe-1" style="width:120px;">Category</span>
                                <div class="input-group-text form-control text-start p-0">
                                    <input type="text" class="form-control text-start border-0"
                                           name="Asset Category" v-model="search_asset_category" readonly>
                                    <div class="input-group-tex border-start">
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
                        </div>
                    </div>
                    <div class="hstack mt-1">
                        <div class="col">
                            <div class="input-group shadow-sm">
                                <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:120px;">자산 번호</span>
                                <span v-else class="input-group-text pe-1" style="width:120px;">Asset Number</span>
                                <input class="form-control shadow-sm py-1"
                                       v-model="search_asset_number" @keyup.enter="searchData">
                            </div>
                        </div>
                        <div class="col ms-1">
                            <div class="input-group shadow-sm">
                                <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:120px;">사용자</span>
                                <span v-else class="input-group-text pe-1" style="width:120px;">User Name</span>
                                <input class="form-control shadow-sm py-1"
                                       v-model="search_user" @keyup.enter="searchData">
                            </div>
                        </div>
                        <div class="col mx-1">
                            <div class="input-group shadow-sm">
                                <span v-if="lang=='kr'" class="input-group-text pe-1" style="width:120px;">품명</span>
                                <span v-else class="input-group-text pe-1" style="width:120px;">Product Name</span>
                                <input class="form-control shadow-sm py-1"
                                       v-model="search_product" @keyup.enter="searchData">
                            </div>
                        </div>

                        <div class="col-auto ms-auto">
                            <button class="btn btn-primary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered mt-2">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th v-if="this.$props.select_mode == 'checkbox'" class="py-1 text-center">
                                    <input class="form-check-input" type="checkbox"
                                           :class="{'bg-secondary':checkNotMatch}"
                                        v-model="allChecked" @click="checkAllSearchItem">
                                </th>
                                <th class="py-1 text-center text-nowrap">PK</th>
                                <th class="py-1 text-center text-nowrap">Category</th>
                                <th class="py-1 text-center text-nowrap">
                                    <span v-if="lang=='kr'">자산 번호</span><span v-else>Asset Number</span>
                                </th>
                                <th class="py-1 text-center text-nowrap">
                                    <span v-if="lang=='kr'">품명</span><span v-else>Product Name</span>
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
                            <tr class="bg-opacity-25"
                                :class="{'bg-warning': selected_item==item && this.$props.select_mode != 'checkbox'}">
                                <td v-if="this.$props.select_mode == 'checkbox'" class="py-1 text-center">
                                    <input class="form-check-input bg-opacity-50" type="checkbox"
                                        v-model="checked_items" :value="item">
                                </td>
                                <td v-if="this.$props.display_mode=='simple'"
                                    class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="selected_item=item" @dblclick="targetSelect">
                                    {{item.id}}
                                </td>
                                <td v-else class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="viewAssetItem(item)">
                                    {{item.id}}
                                </td>
                                <td v-if="this.$props.display_mode=='simple'"
                                    class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="selected_item=item" @dblclick="targetSelect">
                                    {{item.asset_category}}
                                </td>
                                <td v-else class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="viewAssetItem(item)">
                                    {{item.asset_category}}
                                </td>
                                <td v-if="this.$props.display_mode=='simple'"
                                    class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="selected_item=item" @dblclick="targetSelect">
                                    {{item.asset_number}}
                                </td>
                                <td v-else class="py-1 text-start text-primary text-nowrap"
                                    style="cursor:pointer" @click="viewAssetItem(item)">
                                    {{item.asset_number}}
                                </td>
                                <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                                <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                                <td class="py-1 text-start text-nowrap">
                                    <span v-if="this.$props.lang == 'kr'">{{item.user_name}}</span>
                                    <span v-else>{{item.user_name_en}}</span>
                                </td>
                                <td class="py-1 text-start text-nowrap">{{item.user_org_name}}</td>
                                <td class="py-1 text-center text-nowrap">
                                    <span v-if="item.next_app_step < 90">Pending</span>
                                    <span v-else>{{item.asset_status}}</span>
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
                                    </div>

                                </td>
                            </tr>
                        </tfoot>

                    </table>

                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <button class="btn btn-primary mx-2" type="button" style="min-width:90px;" @click="targetSelect">Select</button>
                        <button class="btn btn-primary mx-2" type="button" style="min-width:90px;" @click="targetCancel">Cancel</button>
                    </div>
                </div>
            </div>
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
            :pmode="'view'"
            @close-modal="closeAssetItemModal"
            @update-data="updateData">
        </asset-item-component>
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
    props : ['site','lang','pmode','div_name','search_string','select_mode','display_mode'],
    components: {
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : 'list',
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            search_asset_category : "",
            search_status : "Using",
            showSearchListModal : false,
            showProgressModal : false,
            viewAssetItemModal : false,
            checked_items : [],
            allChecked : false,
        }
    },
    mounted(){
        if(this.$props.search_string)
            this.page(1, this.page_num );
        this.tdata = {

        };
    },
    methods: {
        // emit function
        selectedAssetCategory(item){
            this.search_asset_category = item.asset_category;
            this.parent_category_id = item.id;
            this.searchData();
        },
        // emit function of assetItemComponent
        updateData(){
            this.searchData();
        },
        openSearchModal(){
            this.showSearchListModal = true;
        },
        closeSearchModal(){
            this.showSearchListModal = false;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            await axios.get('./api/assetList',
                { params:{ div_name : vm.$props.div_name,
                           active_page: num, page_num: page_num,
                           parent_category_id : vm.parent_category_id,
                           search_asset_number : vm.search_asset_number,
                           search_user : vm.search_user,
                           search_status : vm.search_status,
                           search_app_state : 90,
                           search_product : vm.search_product,
                          } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });

            this.selected_item = {};
            this.checked_items = [];

            this.showProgressModal = false;
            this.showSearchListModal = true;
        },
        async refreshPage(){
            await this.page(this.tdata.active_page, this.page_num );
        },
        searchData(event){
            if(event) event.preventDefault();
            this.page(this.tdata.active_page, this.page_num );
        },
        viewAssetItem(item){
            this.viewAssetItemModal=true;
            this.selected_item = item;
        },
        closeAssetItemModal(){
            this.viewAssetItemModal=false;
        },
        targetSelect(){
            if(this.$props.select_mode == 'checkbox'){
                if(this.checked_items.length == 0){
                    warningModal.show_modal("Please, select one or more items.");
                    return false;
                }
                this.showSearchListModal = false;
                this.$emit('select-target', this.checked_items);
                this.checked_items = [];
            }else{
                if(this.selected_item == {}){
                    warningModal.show_modal("Please, select a item.");
                    return false;
                }
                this.showSearchListModal = false;
                this.$emit('select-target', this.selected_item);
            }
        },
        targetCancel(){
            this.selected_item = {};
            this.checked_items = [];
            this.showSearchListModal = false;
        },
        async checkAllSearchItem(event){
            this.checked_items = [];
            if(this.tdata.itemList){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(!this.allChecked){
                        this.checked_items.push(this.tdata.itemList[i]);
                    }
                }
            }
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
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.itemList){
                all_item_length = this.tdata.itemList.length;
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
    },
}
</script>
