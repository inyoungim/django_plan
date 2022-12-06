<template>
    <div class="form-control p-0 border-0">
        <div v-if="this.$props.pmode == 'new' || this.$props.pmode == 'modify'" class="d-flex mb-1">
            <div class="me-auto">
                <button class="btn btn-sm btn-primary " style="width:80px; height:25px;"
                        @click="add_items">Add Item</button>
                <button class="btn btn-sm btn-danger ms-2" style="width:80px; height:25px;"
                        @click="delete_items">Delete Item</button>
            </div>
        </div>
        <div id="edit_form" class="table-responsive m-0 p-0">
            <table class="table table-hover table-bordered m-0">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th v-if="pmode !='view'" class="py-1 text-center">
                            <input class="form-check-input" type="checkbox"
                                   :class="{'bg-secondary':checkNotMatch}"
                                v-model="allChecked" @click="checkAItem">
                        </th>
                        <th class="py-1 text-center text-nowrap">PK</th>
                        <th class="py-1 text-center text-nowrap">Asset Category</th>
                        <th class="py-1 text-center text-nowrap">OIL Interface</th>
                        <th class="py-1 text-center text-nowrap">Asset Number</th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">품명</span><span v-else>Product Name</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">모델명</span><span v-else>Model Name</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span v-if="lang=='kr'">제조사</span><span v-else>Maker</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <span v-if="lang=='kr'">실물 확인 스펙</span><span v-else>Physical check Spec.</span>
                        </th>
                        <th class="py-1 text-center text-nowrap">User Name</th>
                        <th class="py-1 text-center text-nowrap">Organization</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="item in item_list" class="bg-opacity-25"
                        :class="{'bg-warning' : checked_ids.includes(item.id) }">
                        <td v-if="pmode !='view'" class="py-1 text-center">
                            <input class="form-check-input bg-opacity-50" type="checkbox"
                                v-model="checked_ids" :value="item.id">
                        </td>
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.id}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.asset_category}}</td>
                        <td class="py-1 text-center text-nowrap">
                            <span v-if="item.oil_interface">Yes</span>
                        </td>
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.asset_number}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_maker}}</td>
                        <td class="py-1 text-start text-nowrap">
                            <span v-if="this.$props.pmode == 'view'">{{item.physical_spec}}</span>
                            <input v-else type="text" class="form-control p-0 text-start border-0"
                                   :class="{'bg-white' :mode == 'view'}"
                                   :name="[this.$props.lang == 'kr' ? '실물 확인 스펙' : 'Physical check Spec.']"
                                   :disabled="pmode == 'view'"
                                   v-model="item.physical_spec"
                                   placeholder="ex) 48인치 OLED TV" required>
                        </td>
                        <td class="py-1 text-start text-nowrap">
                            <span v-if="this.$props.lang =='kr'">{{item.user_name}}</span>
                            <span v-else>{{item.user_name_en}}</span>
                        </td>
                        <td class="py-1 text-start text-nowrap">{{item.user_org_name}}</td>
                    </tr>
                    <tr v-if="item_list.length == 0">
                        <td colspan="50" class="text-center"> There is no data. </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>

    <div>
        <asset-search-modal-component
            ref="assetSearchModalComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="this.$props.div_name"
            :select_mode="'checkbox'"
            @select-target="selectedAsset">
        </asset-search-modal-component>
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
            :pmode="'view'"
            @update-data="updateData"
            @close-modal="closeAssetItemModal">
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
    props : ['site','lang','pmode','acl','doc_id','div_name','item_type'],
    components: {
        'asset-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            doc_id : this.$props.doc_id,
            mode : this.$props.pmode,
            item_list : [],
            selected_item : {},
            checked_ids : [],
            viewAssetItemModal : false,
            showProgressModal : false,
        }
    },
    mounted(){
        if(this.doc_id != 0){
            this.loadData();
        }
    },
    methods: {
        // emit function of assetItemComponent
        addAssetItem(item){
            this.item_list.push(item);
            this.closeAssetItemModal();
        },
        // emit function of assetItemComponent
        updateData(){
            this.loadData();
        },
        async loadData(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/assetExecutionItemList/'+this.doc_id,null)
                .then(function(res){
                    vm.item_list = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewAssetItem(item){
            this.viewAssetItemModal=true;
            this.mode = this.$props.pmode;
            this.selected_item = item;
        },
        closeAssetItemModal(){
            this.viewAssetItemModal=false;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.mode = "new";
            this.selected_item = { };
            this.$refs.assetSearchModalComponent.openSearchModal();
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(this.checked_ids.length == 0){
                warningModal.show_modal("Select one or more items!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            var tempList = [];
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    if(!this.checked_ids.includes(this.item_list[i].id)){
                        tempList.push(this.item_list[i]);
                    }
                }
            }
            this.item_list = tempList;
            this.checked_ids = [];
            this.$emit('reload-appline', this.item_list);
        },
        checkAItem(event){
            var next_app_step = 0;
            this.checked_ids = [];
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    next_app_step = this.item_list[i].next_app_step;
                    if(!this.allChecked){
                        this.checked_ids.push(this.item_list[i].id);
                    }
                }
            }

            if(next_app_step > 0 && next_app_step < 90){
                this.updateOIL();
            }
        },
        selectedAsset(items){
            var is_exists = false;
            for(var i=0; i<items.length; i++){
                is_exists = false;
                for(var j=0; j<this.item_list.length; j++){
                    if(this.item_list[j].id == items[i].id){
                        is_exists = true;
                    }
                }
                if(!is_exists){
                    this.item_list.push(items[i]);
                }
            }
            this.$emit('reload-appline', this.item_list);
        },
        validation(){
            var requiredElements = document.querySelectorAll("#edit_form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.item_list){
                all_item_length = this.item_list.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
