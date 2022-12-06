<template>
    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">
        <div class="hstack">
            <div class="col">
                <div class="hstack">
                    <div class="col-auto input-group" style="width:170px;">
                        <lable class="input-group-text">Target Year</lable>
                        <select v-model="target_year" class="form-select" style="padding:0.1em 0.5em;"
                                @change="changeYear">
                            <option :value="target_year -2">{{target_year -2}}</option>
                            <option :value="target_year -1">{{target_year -1}}</option>
                            <option :value="target_year">{{target_year}}</option>
                            <option :value="target_year +1">{{target_year +1}}</option>
                        </select>
                    </div>
                    <div class="col-auto input-group ms-1" style="width:320px;">
                        <lable class="input-group-text">Version</lable>
                        <select v-model="target_version" class="form-select" style="padding:0.1em 0.5em;"
                                @change="changeVersion">
                            <option v-for="ver in version_list" :value="ver">{{ ver }}</option>
                        </select>
                        <lable class="input-group-text" style="height:32px; min-width:200px;">{{ version_comments }}</lable>
                    </div>
                    <div class="col input-group ms-1">
                        <lable class="input-group-text">
                            <input type="checkbox" v-model="include_org_child" @change="loadData"/>
                            <span class="ms-2">Include Organization children</span>
                        </lable>
                    </div>
                </div>
            </div>
            <div class="col ms-auto me-1 text-end">
                <input type="checkbox" v-model="viewSimple"/> View only that have data.
            </div>

        </div>

        <div class="table-responsive mt-2">
            <table class="table table-hover table-bordered" style="overflow: scroll;">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;" >
                    <tr>
                        <th colspan="1" class="py-1 text-center align-middle">
                            Organization
                            <span v-if="viewPath">Path</span><span v-else>Name</span>
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
                        </th>
                        <th rowspan="2" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang == 'kr'">실사 대상</span><span v-else>Total Count</span>
                        </th>
                        <th rowspan="2" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang == 'kr'">미 실사</span><span v-else>Waiting</span>
                        </th>
                        <th colspan="6" class="py-1 text-center align-middle">
                            <span v-if="this.$props.lang == 'kr'">실사</span><span v-else>Inspection</span>
                        </th>
                    </tr>
                    <tr>
                        <th class="p-0 text-start">
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
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang == 'kr'">사용</span>
                            <span v-else>Using</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                            <span v-else>Disuse</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                            <span v-else>Dispatch</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang == 'kr'">분실</span>
                            <span v-else>Missing</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                            <span v-else>Delete</span>
                        </th>
                        <th class="py-1 text-center">Sum</th>
                    </tr>
                </thead>
                <tbody v-for="item,index in itemList">
                    <tr v-if="isView(item)" class="bg-opacity-25"
                        :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto"  style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span>
                                <span v-if="toggle_id1" class="text-danger">[{{ item.id }}]</span>
                                <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                                <span v-if="viewPath">{{ item.org_path }}</span>
                                <span v-else>{{ item.org_name }}</span>
                            </span>
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Total'}"
                            @click="selectCell(item, 'Total')" @dblclick="viewInspectionList(item,'Total')">
                            {{ markedCost(item.Total) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Waiting'}"
                            @click="selectCell(item, 'Waiting')" @dblclick="viewInspectionList(item,'Waiting')">
                            {{ markedCost(item.Waiting) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Using'}"
                            @click="selectCell(item, 'Using')" @dblclick="viewInspectionList(item,'Using')">
                            {{ markedCost(item.Using) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Disuse'}"
                            @click="selectCell(item, 'Disuse')" @dblclick="viewInspectionList(item,'Disuse')">
                            {{ markedCost(item.Disuse) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Dispatch'}"
                            @click="selectCell(item, 'Dispatch')" @dblclick="viewInspectionList(item,'Dispatch')">
                            {{ markedCost(item.Dispatch) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Missing'}"
                            @click="selectCell(item, 'Missing')" @dblclick="viewInspectionList(item,'Missing')">
                            {{ markedCost(item.Missing) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'Delete'}"
                            @click="selectCell(item, 'Delete')" @dblclick="viewInspectionList(item,'Delete')">
                            {{ markedCost(item.Delete) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end">{{ markedCost(item.Sum) }}</td>
                    </tr>
                </tbody>
            </table>
        </div>

        <div v-if="this.$props.acl >=7" class="col hstack ms-auto">
            <div class="mx-2">
                <span v-if="this.$props.lang == 'kr'">실사 종료일에는 07:00 에 자동으로 메일링 됩니다.</span>
                <span v-else>Automatic mailing at 07 AM inspection end date.</span>
            </div>
            <button class="btn btn-primary shadow-sm ms-auto"
                style="min-width:80px;" @click="mailingData">
                <span v-if="this.$props.lang == 'kr'">미 실사자 대상 메일링</span>
                <span v-else>Mailing to inspection waiting users</span>
            </button>
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
    props : ['site','lang','div_name','year','version','selected_org','check_child_org','acl'],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            selectedOrg : this.$props.selected_org,
            include_org_child : this.$props.check_child_org,
            target_year : this.$props.year,
            target_version : this.$props.version,
            version_list : [],
            version_comments : "",
            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedColumn :"",
            viewSimple : true,
            showProgressModal : "",

            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        // emit function
        setOrganization(org){
            this.selectedOrg = org;
            this.loadData();
            this.$emit('set-organization',this.selectedOrg);
        },
        changeViewPath(){
            this.viewPath = !this.viewPath;
            this.$emit('change-view-path', this.viewPath);
        },
        clearOrganization(){
            this.selectedOrg = {};
            this.loadData();
        },
        changeChildCheck(){
            this.loadData();
            this.$emit('change-org-child-check',this.include_org_child);
        },
        changeYear(){
            this.selectedOrg = {};
            this.loadData();
            this.$emit('change-year',this.target_year);
        },
        changeVersion(){
            this.loadData();
            this.$emit('change-version', this.target_version);
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/getAssetInspectionSummary',
                    { params:{  div_name : vm.$props.div_name,
                                target_year: vm.target_year,
                                target_version: vm.target_version,
                                include_org_child: vm.include_org_child,
                    } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.target_version = res.data.target_version;
                    vm.version_list = res.data.version_list;
                    vm.version_comments = res.data.version_comments;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            if(this.itemList.length > 0){
                if(!this.openItemList.includes(this.itemList[0].id))
                    this.openItemList.push(this.itemList[0].id);
            }

            // edit state : do not refresh others
            if(vm.selectedItemId == '0'){
                return;
            }else if(vm.selectedItemId == ''){
                vm.selectedItemId = vm.selectedItem.id;
            }

            var selectedItemMatching = false;
            for(var i=0; i<vm.itemList.length; i++){
                if(vm.itemList[i].id == vm.selectedItemId){
                    vm.selectedItem = vm.itemList[i];
                    vm.viewInspectionList(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            if(selectedItemMatching == false){
                vm.selectedItem = {};
            }
            this.expandAll(2);
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
                            this.viewInspectionList(this.selectedItem);
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
        selectCell(item, target=''){
            this.selectedItem = item;
            if(target != '')
                this.selectedColumn = target;
        },
        viewInspectionList(item,target='',month=''){
            this.selectedItem = item;
            if(target != '')
                this.selectedColumn = target;

            this.$emit('select-cell-item', this.selectedOrg, this.selectedItem,
                    this.selectedColumn, this.include_org_child);
        },
        toggleOrgList(){
            this.$emit('toggle-orglist');
        },
        dblClick(){
            this.$emit('dblclick-item');
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
        async mailingData(){
            if(this.$props.lang=='kr'){
                confirmModal.set_title("Confirm");
                confirmModal.set_contents("미 실사 자산에 대하여 메일을 발송 합니다.");
                confirmModal.show_modal(this);
            }else{
                confirmModal.set_title("Confirm");
                confirmModal.set_contents("Are you sure to execute mailing?");
                confirmModal.show_modal(this);
            }
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            var mail_obj = {
                'div_name' : vm.$props.div_name,
                'year' : vm.target_year,
                'version' : vm.target_version,
            };
            await axios.post('./api/sendmail', mail_obj)
                .then(function(res){
                    warningModal.show_modal(res.data.msg);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
        },
    },
    computed:{
        isView(){
            return(item)=>{
                if(!item.new_enable) return false;
                if(item.parent == null) return true;
                if(!item.Total && this.viewSimple)  return false;
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
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
