<template>
    <div class="hstack" style="overflow:auto">
        <div class="vstack col-6 align-top border rounded p-2 text-nowrap">
            <div class="hstack">
                <div class="col-auto input-group py-1" style="width:120px;">
                    <lable class="input-group-text py-0">Year</lable>
                    <select v-model="targetYear" class="form-select" style="padding:0.1em 0.5em;"
                            @change="changeYear">
                        <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                        <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                        <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                        <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                    </select>
                </div>

                <div class="ms-auto me-1">
                    <input type="checkbox" v-model="viewSimple"> View only that have data.
                </div>
            </div>

            <div class="table-responsive">
                <table class="table table-hover table-bordered mb-0">
                    <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                        <tr>
                            <th class="py-1 text-start">
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
                            <th class="py-1 text-center">Mailing List</th>
                        </tr>
                    </thead>
                    <tbody v-for="(item,index) in itemList" >
                        <tr v-if="isView(item)" class="bg-opacity-25"
                            :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                            <td class="hstack border-0 border-start" style="cursor:pointer;" @click="viewMailingList(item)">
                                <div v-html="level(item)"></div>
                                <span v-if="item.rght -1 > item.lft" class="col-auto" style="width:20px; cursor:pointer;"
                                      v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                                <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span style="cursor:pointer;" @click="viewMailingList(item)">{{ item.org_name }}</span>
                                <div v-if="index == 0" class="ps-2">
                                    <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                        <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                        <i v-else class="bi bi-tag"></i>
                                    </label>
                                </div>
                            </td>
                            <td class="bg-opacity-25 text-start" style="cursor:pointer;"
                                :class="{'bg-danger': selectedItem.id == item.id }"
                                @click="viewMailingList(item)">
                                <span v-for="user,index in item.mailing_list">
                                    <span v-if="index > 0">, </span>
                                    <span v-if="this.$props.lang=='kr'">{{user.user_name}}</span>
                                    <span v-else>{{user.user_name_en}}</span>
                                </span>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>

        <div class="vstack col-6 align-top border rounded p-2 ms-2" style="overflow-x:auto">
            <div class="hstack border-bottom border-primary">
                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1"
                     style="cursor:pointer"
                     :class="[switchData == 'mailing_list' ? 'bg-primary ':'bg-white text-black-50']"
                     @click="switchData = 'mailing_list'">
                    <i class="bi bi-grid-3x3-gap-fill px-2"
                       :class="[switchData == 'mailing_list' ? 'text-danger':'text-black-50']"></i>
                    <b>Mailing List</b>
                </div>
                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-opacity-25 ms-1"
                     style="cursor:pointer"
                     :class="[switchData == 'mailing_contents' ? 'bg-primary ':'bg-white text-black-50']"
                     @click="switchData = 'mailing_contents'">
                    <i class="bi bi-grid-3x3-gap-fill px-2"
                       :class="[switchData == 'mailing_contents' ? 'text-danger':'text-black-50']"></i>
                    <b>Mailing Contents</b>
                </div>
            </div>

            <div v-if="switchData == 'mailing_list'" class="table-responsive">
                <div v-if="selectedItem.id && this.$props.acl >=7"
                     class="hstack justify-content-end my-1">
                    <div class="col me-1">
                        <user-select-component ref="userSelectComponent"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       :pmode="'new'"
                                       :stype="'USER'"
                                       @select-target="targetSelected">
                        </user-select-component>
                    </div>
                    <div class="btn btn-primary col-auto mx-1" style="width:80px;"
                         @click="updateMailingList('add')">Add</div>
                    <div class="btn btn-primary col-auto" style="width:80px;"
                         @click="updateMailingList('del')">Remove</div>
                </div>

                <table v-if="selectedItem.id" class="table table-hover table-bordered mb-0">
                    <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                        <tr>
                            <th class="py-1 text-center" width="5%"><i class="bi bi-person-fill"></i></th>
                            <th class="py-1 text-start"> User Name </th>
                            <th class="py-1 text-center"> Mail Address </th>
                        </tr>
                    </thead>
                    <tbody v-for="user in selectedItem.mailing_list">
                        <tr class="bg-opacity-25" :class="{'bg-warning': selectedUser == user}"
                            style="cursor:pointer" @click="selectedUser=user">
                            <th class="py-1 text-center" width="5%"><i class="bi bi-person"></i></th>
                            <td class="py-1 text-start">
                                <span v-if="this.$props.lang=='kr'">{{user.user_name}}</span>
                                <span v-else>{{user.user_name_en}}</span>
                            </td>
                            <td class="py-1 text-start">{{user.user_email}}</td>
                        </tr>
                    </tbody>
                </table>
            </div>

            <div v-if="switchData == 'mailing_contents'">
                <div class="col mx-1 my-3">
                    <inspection-mailing-contents-component
                            ref="inspectionMailingContentsComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :div_name="this.$props.div_name"
                            :acl="this.$props.acl"
                            @update-contents="updateContents">
                    </inspection-mailing-contents-component>
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
    props : ['site','lang','year','div_name','acl'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'inspection-mailing-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/inspectionMailingContentsComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            targetYear : this.$props.year,
            switchData : "mailing_list",

            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedColumn :"",
            showProgressModal : false,
            viewSimple : false,
            toggle_id : false,
            selectedUser : {},
            targetUser : {},
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        // emit function
        targetSelected(stype, user){
            this.targetUser = user;
        },
        changeYear(){
            this.selectedItem = {};
            this.loadData();
            this.$emit('change-year',this.targetYear);
        },
        viewMailingList(item) {
            this.selectedItem = item;
            this.selectedUser = {};
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/inspectionMailingList',
                    { params:{  year : vm.targetYear,
                                div_name : vm.$props.div_name,
                    } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;

            var selectedItemMatching = false;
            for(var i=0; i<vm.itemList.length; i++){
                if(vm.itemList[i].id == vm.selectedItem.id){
                    vm.selectedItem = vm.itemList[i];
                    vm.viewMailingList(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            this.expandAll(2);
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
                        if(this.selectedItem == this.itemList[i]){
                            this.selectedItem = {};
                            this.viewMailingList(this.selectedItem);
                        }
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
        async updateMailingList(mode){
            if(mode == "add"){
                if(this.targetUser.EMPLOYEE_NUMBER == undefined){
                    if(this.$props.lang=='kr'){
                        this.warning_message = "User 를 선택 하세요!";
                    }else{
                        this.warning_message = "Please, select a user.";
                    }
                    warningModal.show_modal(this.warning_message);
                    return;
                }
            }
            if(mode == "del"){
                if(this.selectedUser.user_empno == undefined){
                    if(this.$props.lang=='kr'){
                        this.warning_message = "User 를 선택 하세요!";
                    }else{
                        this.warning_message = "Please, select a user.";
                    }
                    warningModal.show_modal(this.warning_message);
                    return;
                }
            }

            this.showProgressModal = true;
            var vm = this;
            var data = {};
            if(mode == "add"){
                data.user = vm.targetUser;
            }else if(mode == "del"){
                data.user = vm.selectedUser;
            }
            data.div_name = vm.$props.div_name;
            data.year = vm.selectedItem.year;
            data.org_id = vm.selectedItem.id;
            data.mode = mode;
            await axios.put('./api/inspectionMailingList', data)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.selectedUser = {};
            for(var i=0; i<this.itemList.length; i++){
                if(this.selectedItem.id == this.itemList[i].id){
                    this.selectedItem = this.itemList[i];
                    break;
                }
            }
        },
    },
    computed:{
        isView(){
            return(item)=>{
                if(item.mailing_list.length == 0  && this.viewSimple)  return false;
                if(item.parent == null) return true;
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.org_name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
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
