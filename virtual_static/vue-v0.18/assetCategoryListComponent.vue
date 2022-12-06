<template>

    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">
        <div class="col-auto">
            <span class="input-group-text p-1">
                <i class="bi bi-cart-fill text-primary px-1"></i>
                <div class="px-1">{{this.$props.div_name}}</div>
                <div class="px-1">Asset Category</div>

                <span v-if="viewPath">Path</span><span v-else>Name</span>
                <label class="ps-1" style="cursor:pointer" @click="changeViewPath">
                    <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                    <i v-else class="bi bi-signpost"></i>
                </label>
                <label class="ps-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                    <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                    <i v-else class="bi bi-tag"></i>
                </label>

            </span>
        </div>

        <div class="m-0 p-0">
            <div class="input-group mt-1">
                <label class="input-group-text py-1" style="cursor:pointer" @click="enableFilter">
                    <i v-if="!filter_enable" class="bi bi-funnel"></i>
                    <i v-else class="bi bi-funnel-fill"></i>
                </label>
                <input class="form-control py-1" v-model="filter_name" :disabled="!filter_enable">
                <label class="input-group-text py-1" style="cursor:pointer" @click="moveFocus">
                    <i class="bi bi-send"></i>
                </label>
            </div>

            <div v-for="item,index in itemList">
                <div v-if="isView(item) && (this.$props.pmode == 'mgmt' || item.category_enable)"
                     :id="item.id" class="hstack align-middle p-1 bg-opacity-50"
                     :class="{'bg-success': selectedItem.id == item.id}">
                    <div v-html="level(item)"></div>
                    <span v-if="item.rght -1 > item.lft" class="col-auto" style="cursor:pointer; width:20px;"
                          v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                    <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                    <div class="hstack" style="cursor:pointer"
                        @click="selectItem(item)"  @dblclick="this.$emit('dblclick-item')">
                        <i v-if="!item.category_enable" class="bi bi-eye-slash text-primary me-1"></i>
                        <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                        <i v-if="this.$props.pmode == 'mgmt' && item.asset_calibration"
                           class="bi bi-compass-fill text-success me-1"></i>
                        <span v-if="viewPath">{{ item.category_path }}</span>
                        <span v-else>{{ item.asset_category }}</span>
                    </div>
                </div>
            </div>
        </div>

    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal == 'show'" class="vue_modal" style="z-index: 9995;">
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
    props : ['site','lang','pmode','div_name','acl'],
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            itemList : [],
            selectedItem : {},
            openItemList : [],

            InitialDialogModal : "",
            showProgressModal : "",
            initial_target : "",
            toggle_id : false,
            viewPath : false,
        }
    },
    async mounted(){
        await this.loadData(null);
        if(this.itemList.length > 0)
            this.openItemList.push(this.itemList[0].id);
    },
    watch : {
        div_name(nVal){
            this.loadData(null);
        }
    },
    methods: {
        changeViewPath(){
            this.viewPath = !this.viewPath;
            this.$emit('change-view-path', this.viewPath);
        },
        async loadData(event,selectedItemId=''){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/getAssetCategoryList', { params:{ div_name: vm.$props.div_name ,} })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";

            // modify state : do not refresh others
            if(selectedItemId == '0'){
                return;
            }else if(selectedItemId == ''){
                vm.selectedItem = {};
                vm.selectItem(vm.selectedItem);
                return;
            }

            var selectedItemMatching = false;
            for(var i=0; i<vm.itemList.length; i++){
                if(vm.itemList[i].id == selectedItemId){
                    vm.selectedItem = vm.itemList[i];
                    vm.selectItem(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            if(selectedItemMatching == false){
                vm.selectedItem = {};
            }
        },
        addOpenItemList(target='current'){
            if(target == 'current'){
                if(this.openItemList.indexOf(this.selectedItem.id) == -1)
                    this.openItemList.push(this.selectedItem.id);
            }else{
                if(this.openItemList.indexOf(target) == -1)
                    this.openItemList.push(target);
            }
        },
        // open all parents node and select id node
        async openSelectItem(id){
            this.showProgressModal = "show";
            var vm = this;
            var result = [];
            await axios.get('./api/getAssetCategoryParents/'+id, null)
                .then(function(res){
                    result = res.data.idList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            for(var a=0; a<result.length; a++){
                if(!vm.openItemList.includes(result[a])){
                    vm.openItemList.push(result[a]);
                }
            }
            vm.selectItemID(id);
            this.showProgressModal = "";
        },
        toggle(item) {
            let index = this.openItemList.indexOf(item.id);
            if(index > -1){
                this.openItemList.splice(index,1);
                for(var i=0; i<this.itemList.length; i++){
                    if(this.itemList[i].tree_id == item.tree_id &&
                        this.itemList[i].lft > item.lft && this.itemList[i].rght < item.rght){
                        index = this.openItemList.indexOf(this.itemList[i].id);
                        if(index > -1)
                            this.openItemList.splice(index,1);
                        if(this.selectedItem == this.itemList[i]){
                            this.selectedItem = {};
                            this.selectItem(this.selectedItem);
                        }
                    }
                }
            }else{
                this.openItemList.push(item.id);
            }
        },
        selectItem(item) {
            this.selectedItem = item;
            this.$emit('select-item',item, this.$props.div_name);
        },
        clearItem() {
            this.selectedItem = {};
        },
        selectItemID(id) {
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == id){
                    this.selectItem(this.itemList[i]);
                    break;
                }
            }
        },
        roll_back(item,warning=true){
            this.selectedItem = item;
            if(warning)
                warningModal.show_modal("Please, select one after 'Cancel' modify dialog.");
        },
        enableFilter(){
            this.filter_enable = !this.filter_enable;
            if(this.filter_enable){
                this.openItemList = [];
                for(var i=0; i<this.itemList.length; i++){
                    this.openItemList.push(this.itemList[i].id);
                }
            }else{
                this.filter_name = "";
            }
        },
        async moveFocus(){
            if(!this.selectedItem.id) return;
            this.filter_name = "";
            this.filter_enable = false;
            this.openItemList = [];
            await this.openSelectItem(this.selectedItem.id);
            if(!this.selectedItem.id) return;
            this.$nextTick(() => {
                document.getElementById(this.selectedItem.id).scrollIntoView({block:"center"});
            });
        }
    },
    computed:{
        isView(){
            return(item)=>{
                if(item.parent == null)
                    return true;
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.asset_category.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name )
                        return true;
                    else
                        return false;
                }
                return false;
            }
        },
        folderSymbol(){
            return(pid)=>{
                if(this.openItemList.indexOf(pid) > -1)
                    return "<i class='bi bi-dash-square-fill text-secondary'></i>";
                return "<i class='bi bi-plus-square-fill text-primary'></i>";
            }
        },
        level(){
            return(item)=>{
                return "<div style='width:"+ item.level * 1.5 + "em;'></div>";
            }
        },
    },
}
</script>
