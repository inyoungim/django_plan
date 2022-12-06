<template>
    <div class="hstack" style="overflow:auto">
        <div class="vstack col align-top text-nowrap">
            <div class="hstack ms-auto">
                <div class="col-auto input-group py-1 ms-auto" style="width:120px;">
                    <lable class="input-group-text py-0">Year</lable>
                    <select v-model="targetYear" class="form-select" @change="loadData">
                        <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                        <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                        <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                        <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                    </select>
                </div>
                <div v-if="this.$props.acl >= 7" class="col input-group py-1">
                    <button class="btn btn-primary ms-2" style="min-width:100px;" @click="managementList">
                        <span v-if="this.$props.lang=='kr'">{{ this.$props.user_group.group_name }} 관리</span>
                        <span v-else>Management {{ this.$props.user_group.group_name }}</span>
                    </button>
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-bordered mb-0" style="overflow-x:auto">
                    <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                        <tr>
                            <th class="col-4 py-1 text-start">
                                <div class="input-group">
                                    <label class="input-group-text border-0" style="cursor:pointer" @click="enableFilter">
                                        <i v-if="!filter_enable" class="bi bi-funnel"></i>
                                        <i v-else class="bi bi-funnel-fill"></i>
                                    </label>
                                    <input class="form-control border-0 border-end" v-model="filter_name" :disabled="!filter_enable">
                                    <label class="input-group-text border-0" style="cursor:pointer" @click="moveFocus">
                                        <i class="bi bi-send"></i>
                                    </label>
                                </div>
                            </th>
                            <th v-for="pic in picList" class="col-auto py-1 text-center" style="cursor:pointer;"
                                class="bg-opacity-50" :class="{'bg-warning': view_pic_data.id == pic.id}"
                                @dblclick="viewPICData(pic)">
                                <span v-if="this.$props.lang=='kr'">{{pic.user_name}}</span>
                                <span v-else>{{pic.user_name_en}}</span>
                            </th>
                        </tr>
                    </thead>
                    <tbody v-for="(item,index) in itemList" >
                        <tr v-if="isView(item)" class="bg-opacity-25" :id="item.id">
                            <td class="hstack border-0 border-start">
                                <div v-html="level(item)"></div>
                                <span v-if="item.rght -1 > item.lft" class="col-auto" style="width:20px; cursor:pointer;"
                                      v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                                <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span>{{ item.org_name }}</span>
                                <div v-if="index == 0" class="ps-2">
                                    <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                        <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                        <i v-else class="bi bi-tag"></i>
                                    </label>
                                </div>
                            </td>
                            <td v-for="pic in picList" class="bg-opacity-25 text-center py-2" style="cursor:pointer;"
                                :class="{'bg-danger': selectedPIC.id == pic.id && selectedItem == item}"
                                @click="selectedPIC=pic; selectedItem=item" @dblclick="changePIC(item,pic)">
                                <span v-if="pic.assign_ids.includes(item.id)">
                                    <span v-if="this.$props.lang=='kr'">{{pic.user_name}}</span>
                                    <span v-else>{{pic.user_name_en}}</span>
                                </span>
                                <span v-if="notAssigned(item)" class="text-danger">None</span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </div>

    <div v-if="showBudgetHandlingPersonListComponent">
        <budget-handling-person-list-component
                ref="budgetHandlingPersonListComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :year="this.$props.year"
                :user_group="this.$props.user_group"
                @update-data="refreshData"
                @close-modal="showBudgetHandlingPersonListComponent=false">
        </budget-handling-person-list-component>
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
    props : ['site','lang','acl','div_name','year','user_group'],
    components: {
        'budget-handling-person-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetHandlingPersonListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            targetYear : this.$props.year,
            switchData : "approval_preset_list",

            itemList : [],
            picList : [],
            openItemList : [],
            selectedItem : {},
            selectedPIC : {},
            selectedColumn :"",
            showProgressModal : false,
            toggle_id : false,
            view_pic_data : {},

            showBudgetHandlingPersonListComponent : false,
        }
    },
    async mounted(){
        await this.loadData();
        await this.expandAll(2);
    },
    watch : {
        user_group(nVal){
            this.loadData();
            this.expandAll(2);
        }
    },
    methods: {
        refreshData(){
            this.loadData();
            this.expandAll(2);
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/approvalUserGroupOrganizationList/'+ vm.$props.user_group.id,
                    { params:{  div_name : vm.$props.div_name, year : vm.targetYear } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.picList = res.data.picList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        async changePIC(item,pic){
            if(event) event.preventDefault();
            if(this.$props.acl < 7) return;
            this.showProgressModal = true;
            var vm = this;
            var data = { div_name : vm.$props.div_name, year : vm.targetYear, assigned : item, pic : pic };
            await axios.put('./api/approvalUserGroupOrganizationList/'+ vm.$props.user_group.id, data )
                .then(function(res){
                    vm.picList = res.data.picList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        // open all parents node and select id node
        async openSelectItem(id){
            this.showProgressModal = true;
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
            this.showProgressModal = false;
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
                    }
                }
            }else{
                this.openItemList.push(item.id);
            }
        },
        selectItemID(id) {
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].id == id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
        },
        expandAll(level=100){
            this.openItemList = [];
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].level < level){
                    this.openItemList.push(this.itemList[i].id);
                }
            }
        },
        enableFilter(){
            this.filter_enable = !this.filter_enable;
            if(this.filter_enable){
                this.expandAll();
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

        managementList(){
            this.showBudgetHandlingPersonListComponent = true;
        },
        viewPICData(pic){
            if(this.view_pic_data == pic){
                this.view_pic_data = {};
            }else{
                this.view_pic_data = pic;
                this.expandAll();
            }
        },
    },
    computed:{
        isView(){
            return(item)=>{
                // item.new_enable 이 false 이면 display 하지 않음.
                if(!item.new_enable) return false;
                if(item.parent == null) return true;
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.org_name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name ){
                        if(this.view_pic_data.id){
                            if(this.view_pic_data.assign_ids.includes(item.id))
                                return true;
                            else
                                return false;
                        }else{
                            return true;
                        }
                    }else{
                        return false;
                    }
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
        notAssigned(){
            return(item)=>{
                for(var i=0; i<this.picList.length; i++){
                    if(this.picList[i].assign_ids.includes(item.id)){
                        return false;
                    }
                }
                return true;
            }
        },
    },
}
</script>
