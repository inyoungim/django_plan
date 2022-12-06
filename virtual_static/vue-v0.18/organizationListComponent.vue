<template>
    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">
        <div class="hstack bg-primary bg-opacity-25 p-1">
            <div class="input-group" style="width:80px;">
                <div class="form-control p-0" style="padding:0.1em 0.5em;">
                    <select v-model="targetYear" class="form-select border-0" style="padding:0.1em 0.5em;"
                        @change="loadData"
                        :disabled="(this.$props.pmode == 'plan' && this.$props.acl < 9)
                                    || (this.$props.pmode == 'asset')">
                        <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                        <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                        <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                        <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                    </select>
                </div>
            </div>

            <span class="input-group-text" style="padding:0.1em 0.5em;">
                <i class="bi bi-people-fill text-primary px-1"></i>
                <div class="px-1">{{this.$props.div_name}}</div>

                <span v-if="viewPath">Organization Path</span><span v-else>Organization Name</span>
                <label class="ps-1" style="cursor:pointer" @click="changeViewPath">
                    <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                    <i v-else class="bi bi-signpost"></i>
                </label>
                <label class="ps-1" style="cursor:pointer" @click="toggle_id1 = !toggle_id1">
                    <i v-if="toggle_id1" class="bi bi-tag-fill text-danger"></i>
                    <i v-else class="bi bi-tag"></i>
                </label>
                <label class="ps-1" style="cursor:pointer" @click="toggle_code1 = !toggle_code1">
                    <i v-if="toggle_code1" class="bi bi-c-square-fill text-danger"></i>
                    <i v-else class="bi bi-c-square"></i>
                </label>
            </span>

            <div v-if="this.$props.acl >= 7 && this.$props.pmode == 'mgmt'" class="btn btn-darkblue ms-auto"
                     style="width:100px; padding:0.1em 0.5em;" @click="openInitialDialog">New Org.</div>
            <div v-else></div>

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
                    <link href="/static/css/bootstrap-icons.css" rel="stylesheet" />
                </label>
            </div>

            <div v-for="(item,index) in itemList">
                <div v-if="isView(item)" :id="item.id" class="hstack align-middle p-1 bg-opacity-50"
                     :class="{'bg-success': selectedItem.id == item.id}">
                    <div v-html="level(item)"></div>

                    <span v-if="item.rght -1 > item.lft" class="col-auto" style="cursor:pointer; width:20px;"
                          v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                    <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                    <div v-if="this.$props.pmode != 'mgmt' && item.nas_code == '' ">

                        <span v-if="toggle_id1" class="text-danger">[{{ item.id }}]</span>
                        <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                        <span v-if="viewPath">{{ item.org_path }}</span>
                        <span v-else>{{ item.org_name }}</span>

                    </div>
                    <div v-else @click="selectItem(item)" @dblclick="selectItemOK(item)" style="cursor:pointer">
                        <i v-if="!item.new_enable" class="bi bi-eye-slash text-primary"></i>

                        <span v-if="toggle_id1" class="text-danger">[{{ item.id }}]</span>
                        <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                        <span v-if="viewPath">{{ item.org_path }}</span>
                        <span v-else>{{ item.org_name }}</span>

                    </div>
                    <div v-if="isOnAuCode" class="ms-auto">
                        <span v-if="item.au_code" class="px-1 bg-opacity-50" :class="calColor(item)">{{item.au_code}}</span>
                    </div>
                    <div v-if="this.$props.pmode == 'budgetPlan'" class="ms-auto" @click="selectItem(item)" style="cursor:pointer"> {{ markedCost(item.remain_cost) }}</div>
                    <div v-if="this.$props.pmode == 'budgetAssign'" class="ms-auto" @click="selectItem(item)" style="cursor:pointer"> {{ markedCost(item.total_cost) }}</div>
                </div>
            </div>
        </div>

    </div>

    <!-- Organization Initialize Dialog -->
    <div v-if="InitialDialogModal == 'show'" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 v-if="itemList.length > 0" class="col">New Organization Initialize</h5>
                    <h5 v-else class="col">Root Organization Create</h5>
                    <button type="button" class="btn-close btn-close-white" @click="InitialDialogModal=''"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div v-if="itemList.length > 0" class="text-start">
                        <user-select-component ref="userSelectComponent"
                                               :site="this.$props.site"
                                               :lang="this.$props.lang"
                                               :pmode="'new'"
                                               :stype="'ORG'"
                                                @select-target="targetSelected"></user-select-component>

                        <div class="input-group mt-2">
                            <label class="input-group-text" style="width:100px;"><b>Parent</b></label>
                            <input class="form-control" v-model="selectedItem.org_name" disabled>
                        </div>
                    </div>
                    <div v-else>
                        <div class="input-group mt-2">
                            <label class="input-group-text" style="width:100px;"><b>Root Name</b></label>
                            <input class="form-control" v-model="new_org_name">
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col">
                        <div v-if="itemList.length > 0" class="btn btn-primary me-3" style="width:100px;" @click="orgInitial">Create</div>
                        <div v-else class="btn btn-primary me-3" style="width:100px;" @click="rootOrgCreate">Create</div>
                        <div class="btn btn-secondary " style="width:100px;" @click="InitialDialogModal=''">Cancel</div>
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
    props : ['site','lang','pmode','year','div_name','acl','myorg','preset_orgid','display_option'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            targetYear : this.$props.year,
            itemList : [],
            selectedItem : {},
            openItemList : [],

            InitialDialogModal : "",
            showProgressModal : "",
            initial_target : "",
            isOnAuCode : false,
            auCode_list : [],

            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    async mounted(){
        if(this.$props.pmode == "mgmt"){
            this.isOnAuCode = true;
        }
        if(this.$props.preset_orgid){
            await this.loadData(null,false,this.$props.preset_orgid);
        }else{
            await this.loadData(null,this.$props.myorg);
        }
        if(this.itemList.length > 0)
            this.openItemList.push(this.itemList[0].id);
    },
    watch : {
        div_name(nVal){
            this.loadData();
        }
    },
    methods: {
        changeViewPath(){
            this.viewPath = !this.viewPath;
            this.$emit('change-view-path', this.viewPath);
        },
        openInitialDialog(){
            if(this.itemList.length > 0 &&  !this.selectedItem.id){
                warningModal.show_modal("Please, select Parent organization.");
                return false;
            }
            this.showProgressModal = "show";
            this.InitialDialogModal = "show";
            this.showProgressModal = "";
            this.new_org_name = "";
        },
        targetSelected(stype,org){
            this.initial_target = org.ORGAN;
        },
        async rootOrgCreate(){
            this.showProgressModal = "show";
            var vm = this;
            var target = {};
            target.start_organ = this.initial_target;
            target.parent_id = this.selectedItem.id;
            target.new_org_name = this.new_org_name;
            target.div_name = this.$props.div_name;
            target.year = this.targetYear;
            await axios.post('./api/orgInitialize', target)
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            this.showProgressModal = "";
            this.InitialDialogModal = "";
            this.loadData();
        },
        async orgInitial(){
            if(this.initial_target == ""){
                warningModal.show_modal("Please, select Target organization.");
                return false;
            }
            this.showProgressModal = "show";
            var vm = this;
            var target = {};
            target.start_organ = this.initial_target;
            target.parent_id = this.selectedItem.id;
            target.div_name = this.$props.div_name;
            target.year = this.targetYear;
            await axios.post('./api/orgInitialize', target)
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            this.showProgressModal = "";
            this.InitialDialogModal = "";
            this.loadData();
        },
        async loadData(event,myorg=false,selectedItemId=''){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/getOrgList',
                    { params:{ 'div_name':vm.$props.div_name, 'year': vm.targetYear, 'load_mode':vm.$props.pmode } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    if(myorg && res.data.myorg_id)
                        vm.openSelectItem(res.data.myorg_id);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";

            // make auCode_list
            for(var i=0; i<this.itemList.length; i++){
                if(!this.auCode_list.includes(this.itemList[i].au_code))
                    this.auCode_list.push(this.itemList[i].au_code);
            }

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
                    // vm.selectItem(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            if(selectedItemMatching == false){
                vm.selectedItem = {};
            }else{
                vm.openSelectItem(vm.selectedItem.id);
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
            await axios.get('./api/getOrgParents/'+id, null)
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
            this.$emit('select-item',item);
        },
        selectItemOK(item) {
            this.selectedItem = item;
            this.$emit('select-item-ok',item);
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
                warningModal.show_modal("Please, select one after 'Cancel' edit dialog.");
        },
        refresh(){
            this.loadData(null,false,this.selectedItem.id);
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
        },
    },
    computed:{
        isView(){
            return(item)=>{
                // display_option == 'active' 일때 item.new_enable 이 false 이면 display 하지 않음.
                if(this.$props.display_option == 'active' && !item.new_enable){
                    return false;
                }
                if(item.parent == null){
                    return true;
                }
                if(this.openItemList.indexOf(item.parent) > -1){
                    if( item.org_name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name )
                        return true;
                    else
                        return false;
                    //return true;
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
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        calColor(){
            return(item)=>{
                var colorNo = 0;
                for(var j=0; j<this.auCode_list.length; j++){
                    if(this.auCode_list[j] == item.au_code)
                        break;
                    colorNo += 1;
                }
                if(colorNo % 5 == 0)
                    return "bg-primary";
                if(colorNo % 5 == 1)
                    return "bg-secondary";
                if(colorNo % 5 == 2)
                    return "bg-danger";
                if(colorNo % 5 == 3)
                    return "bg-warning";
                if(colorNo % 5 == 4)
                    return "bg-success";
                return "";
            }
        }
    },
}
</script>
