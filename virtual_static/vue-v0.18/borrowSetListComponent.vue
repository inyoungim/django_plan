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
                        <th class="py-1 text-center">Model Name</th>
                        <th class="py-1 text-center">
                            <span v-if="lang=='kr'">출고 요청일</span>
                            <span v-else>Request Date</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="lang=='kr'">수량</span>
                            <span v-else>Quantity</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="lang=='kr'">반납 예정일</span>
                            <span v-else>Due Date</span>
                        </th>
                    </tr>
                </thead>
                <tbody class="shadow-sm">
                    <tr v-for="item in item_list"
                        class="bg-opacity-25"
                        :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewBorrowSet(item)">{{item.parent}}-{{item.id}}</td>
                        <td class="py-1 text-center text-nowrap text-primary"
                            style="cursor:pointer" @click="viewBorrowSet(item)">{{item.model_name}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.request_date}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.request_qty}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.due_plan_date}}</td>
                    </tr>
                    <tr v-if="item_list.length == 0">
                        <td colspan="50" class="text-center"> There is no data. </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>


    <!-- Detail View Modal -->
    <div v-if="viewBorrowSetModal">
        <borrow-set-component
            ref="borrowSetComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :target_item="selected_item"
            :div_name="this.$props.div_name"
            :pmode="this.$props.pmode"
            @close-modal="closeBorrowSetModal"
            @add-item="addBorrowSet"
            @update-item="updateBorrowSet">
        </borrow-set-component>
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
    props : ['site','lang','pmode','acl','doc_id','div_name'],
    components: {
        'borrow-set-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowSetComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            doc_id : this.$props.doc_id,
            item_list : [],
            selected_item : {},
            showProgressModal : false,
            viewBorrowSetModal : false,
        }
    },
    mounted(){
        if(this.doc_id != 0){
            this.loadData();
        }
    },
    methods: {
        // emit function of borrowSetComponent
        addBorrowSet(item){
            this.item_list.push(item);
            this.closeBorrowSetModal();
            this.selected_item = item;
        },
        async validation(){
            if(this.item_list.length == 0){
                await warningModal.show_modal("Please, insert one or more Sample SET item!");
                return false;
            }
            return true;
        },
        updateBorrowSet(item){
            for(var i=0; i<this.item_list.length; i++){
                if(this.item_list[i] == this.selected_item){
                    this.item_list[i] = JSON.parse(JSON.stringify(item));
                    this.selected_item = this.item_list[i];
                    break;
                }
            }
            this.closeBorrowSetModal();
        },
        getData(){
            return this.item_list;
        },
        async loadData(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/setlist/'+this.doc_id,null)
                .then(function(res){
                    vm.item_list = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewBorrowSet(item){
            this.viewBorrowSetModal=true;
            this.selected_item = item;
        },
        closeBorrowSetModal(){
            this.viewBorrowSetModal=false;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.selected_item = { "id" : 0 };
            this.viewBorrowSetModal = true;
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(!this.selected_item.model_name){
                warningModal.show_modal("Select a item!");
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
            this.selected_item = {};
        },
    },
    computed:{
    },
}
</script>
