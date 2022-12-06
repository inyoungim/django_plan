<template>
    <div class="form-control p-0 border-0">
        <div v-if="this.$props.pmode == 'new' || this.$props.pmode == 'modify'" class="d-flex mb-1">
            <div class="me-auto">
                <button class="btn btn-sm btn-primary " style="width:100px; height:25px;"
                        @click="add_items">Add Item</button>
                <button class="btn btn-sm btn-danger ms-2" style="width:100px; height:25px;"
                        @click="delete_items">Delete Item</button>
            </div>
        </div>
        <div class="table-responsive m-0 p-0">
            <table class="table table-hover table-bordered m-0">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th class="py-1 text-center">PK</th>
                        <th class="py-1 text-center">Category</th>
                        <th class="py-1 text-center">Asset Number</th>
                        <th class="py-1 text-center"><span v-if="lang=='kr'">품명</span><span v-else>Product Name</span></th>
                        <th class="py-1 text-center"><span v-if="lang=='kr'">모델명</span><span v-else>Model Name</span></th>
                        <th class="py-1 text-center"><span v-if="lang=='kr'">제조사</span><span v-else>Maker</span></th>
                        <th class="py-1 text-center">User Name</th>
                        <th class="py-1 text-center">Organization</th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="item in item_list"
                        class="bg-opacity-25"
                        :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.id}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_category}}</td>
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewAssetItem(item)">{{item.asset_number}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_product}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_model}}</td>
                        <td class="py-1 text-start text-nowrap">{{item.asset_maker}}</td>
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


    <!-- Detail View Modal -->
    <div v-if="viewAssetItemModal">
        <asset-item-component
            ref="assetItemComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :asset_item="selected_item"
            :div_name="this.$props.div_name"
            :pmode="this.$props.pmode"
            :app_type="this.$props.app_type"
            :doc_id="this.$props.doc_id"
            @close-modal="closeAssetItemModal"
            @add-item="addAssetItem"
            @update-data="updateData"
            @update-item="updateAssetItem">
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
    props : ['site','lang','pmode','acl','app_type','doc_id','div_name','item_type'],
    components: {
        'asset-item-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetItemComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            doc_id : this.$props.doc_id,
            item_list : [],
            selected_item : {},
            showProgressModal : false,
            viewAssetItemModal : false,
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
            for(var i=0; i<this.item_list.length; i++){
                if(this.item_list[i].asset_number == item.asset_number && item.asset_number != 'TBD'){
                    warningModal.show_modal("Asset Number is duplicated!");
                    this.closeAssetItemModal();
                    return;
                }
            }
            this.item_list.push(item);
            this.closeAssetItemModal();
            this.$emit('reload-appline', this.item_list);
        },
        updateData(){
            this.loadData();
        },
        updateAssetItem(item){
            for(var i=0; i<this.item_list.length; i++){
                if(this.item_list[i] == this.selected_item){
                    this.item_list[i] = JSON.parse(JSON.stringify(item));
                    this.selected_item = this.item_list[i];
                    break;
                }
            }
            this.closeAssetItemModal();
            this.$emit('reload-appline', this.item_list);
        },
        async loadData(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/assetExecutionItemList/'+this.doc_id,null)
                .then(function(res){
                    vm.item_list = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewAssetItem(item){
            this.selected_item = item;
            this.viewAssetItemModal=true;
        },
        closeAssetItemModal(){
            this.viewAssetItemModal=false;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.selected_item = {};
            this.viewAssetItemModal = true;
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(!this.selected_item.asset_category){
                warningModal.show_modal("Select a execution item!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            var tempList = [];
            if(this.item_list){
                for(var i=0; i<this.item_list.length; i++){
                    if(this.item_list[i] != this.selected_item)
                        tempList.push(this.item_list[i]);
                }
            }
            this.item_list = tempList;
            this.$emit('reload-appline', this.item_list);
        },
    },
    computed:{
    },
}
</script>
