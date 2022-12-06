<template>
    <div class="vstack align-top border rounded p-0 table-responsive">
        <div class="hstack py-2 bg-primary bg-opacity-25">
            <i class="bi bi-justify px-1 pt-1"></i><b>Menu List</b>
        </div>

        <div class="m-0 p-1">
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

            <div v-for="menu,index in menuList">
                <div v-if="isView(menu)" class="hstack align-middle p-1 bg-opacity-50"
                     :id="menu.id"  :class="{'bg-success': selectedMenu.id == menu.id}">
                    <div v-html="level(menu)"></div>

                    <span v-if="menu.name.toLowerCase() == 'space' || menu.name.toLowerCase() == '-----'" style="width:20px;"></span>
                    <span v-else-if="menu.rght -1 > menu.lft" class="col-auto" style="cursor:pointer; width:20px;"
                          v-html="folderSymbol(menu.id)" @click="toggle(menu)"></span>
                    <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>

                    <div v-if="$props.mode =='admin'" class="hstack" @click="selectMenu(menu)" style="cursor:pointer">
                        <div v-if="!menu.acl_inherit">
                            <i class="bi bi-shield-lock-fill text-danger"></i>
                        </div>
                        <span v-if="toggle_id" class="text-danger">[{{ menu.id }}]</span>
                        {{ menu.name }}
                    </div>
                    <div v-else>
                        <div v-if="menu.name.toLowerCase() != 'space' && menu.name.toLowerCase() != '-----'"
                             @click="selectMenu(menu)" style="cursor:pointer">
                            <span v-if="toggle_id" class="text-danger">[{{ menu.id }}]</span>
                            {{ menu.name }}
                        </div>
                        <div v-else style="height:5px;"></div>
                    </div>
                    <div v-if="index == 0" class="ps-2">
                        <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                            <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                            <i v-else class="bi bi-tag"></i>
                        </label>
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
    props : ['site','lang','mode','menus','selected_id'],
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            menuList : this.$props.menus,
            selectedMenu : {},
            openMenuList : [1],
            rollbackItem : {},
            showProgressModal : "",
            toggle_id : false,
        }
    },
    async mounted(){
        if(this.$props.mode =='admin')
            await this.loadData();
        this.openMenuList = [];
        for(var i=0; i<this.menuList.length; i++){
            this.openMenuList.push(this.menuList[i].id);
            if(this.$props.selected_id && this.$props.selected_id == this.menuList[i].id){
                this.selectedMenu = this.menuList[i];
            }
        }
        if(this.$props.selected_id)
            this.selectMenu(this.selectedMenu);
        else
            this.selectMenu(this.menuList[0]);
    },
    methods: {
        async loadData(selectedMenuId=''){
            var vm = this;
            await axios.get('./api/menuIndex', null)
                .then(function(res){
                    vm.menuList = res.data.menuList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            // modify state : do not refresh others
            if(selectedMenuId == '0'){
                return;
            }else if(selectedMenuId == ''){
                vm.selectedMenu = {};
                vm.selectMenu(vm.selectedMenu);
                return;
            }

            var selectedMenuMatching = false;
            for(var i=0; i<vm.menuList.length; i++){
                if(vm.menuList[i].id == selectedMenuId){
                    vm.selectedMenu = vm.menuList[i];
                    vm.selectMenu(vm.selectedMenu);
                    selectedMenuMatching = true;
                    break;
                }
            }
            if(selectedMenuMatching == false)
                vm.selectedMenu = {};
        },
        addOpenMenuList(target='current'){
            if(target == 'current'){
                if(this.openMenuList.indexOf(this.selectedMenu.id) == -1)
                    this.openMenuList.push(this.selectedMenu.id);
            }else{
                if(this.openMenuList.indexOf(target) == -1)
                    this.openMenuList.push(target);
            }
        },
        // open all parents node and select id node
        async openSelectMenu(id){
            this.showProgressModal = "show";
            var vm = this;
            var result = [];
            await axios.get('./api/getMenuParents/'+id, null)
                .then(function(res){
                    result = res.data.idList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            for(var a=0; a<result.length; a++){
                if(!vm.openMenuList.includes(result[a])){
                    vm.openMenuList.push(result[a]);
                }
            }
            vm.selectItemID(id);
            this.showProgressModal = "";
        },
        selectItemID(id) {
            for(var i=0; i<this.menuList.length; i++){
                if(this.menuList[i].id == id){
                    this.selectedMenu = this.menuList[i];
                    break;
                }
            }
        },
        toggle(item) {
            let index = this.openMenuList.indexOf(item.id);
            if(index > -1){
                this.openMenuList.splice(index,1);
                for(var i=0; i<this.menuList.length; i++){
                    if(this.menuList[i].tree_id == item.tree_id &&
                        this.menuList[i].lft > item.lft && this.menuList[i].rght < item.rght){
                        index = this.openMenuList.indexOf(this.menuList[i].id);
                        if(index > -1)
                            this.openMenuList.splice(index,1);
                        if(this.selectedMenu == this.menuList[i]){
                            this.selectedMenu = {};
                            this.selectMenu(this.selectedMenu);
                        }
                    }
                }
            }else{
                this.openMenuList.push(item.id);
            }
        },
        selectMenu(item) {
            this.selectedMenu = item;
            this.$emit('select-menu',item);
        },
        roll_back(item,warning=true){
            this.selectedMenu = item;
            if(warning)
                warningModal.show_modal("Please, select one after 'Cancel' modify dialog.");
        },
        enableFilter(){
            this.filter_enable = !this.filter_enable;
            if(this.filter_enable){
                this.openMenuList = [];
                for(var i=0; i<this.menuList.length; i++){
                    this.openMenuList.push(this.menuList[i].id);
                }
            }else{
                this.filter_name = "";
            }
        },
        async moveFocus(){
            if(!this.selectedMenu.id) return;
            this.filter_name = "";
            this.filter_enable = false;
            this.openMenuList = [];
            await this.openSelectMenu(this.selectedMenu.id);
            if(!this.selectedMenu.id) return;
            this.$nextTick(() => {
                document.getElementById(this.selectedMenu.id).scrollIntoView({block:"center"});
            });
        }
    },
    computed:{
        isView(){
            return(item)=>{
                if(item.parent_id == null)
                    return true;
                if(this.openMenuList.indexOf(item.parent_id) > -1){
                    if(item.name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
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
                if(this.openMenuList.indexOf(pid) > -1)
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
