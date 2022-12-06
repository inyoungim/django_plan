<template>
    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">
        <div class="hstack">
            <div class="col-auto">
                <div class="hstack">
                    <div class="col-auto input-group" style="width:170px;">
                        <lable class="input-group-text py-1">Target Year</lable>
                        <select v-model="target_year" class="form-select" style="padding:0.1em 0.5em;"
                                @change="changeYear">
                            <option :value="target_year -2">{{target_year -2}}</option>
                            <option :value="target_year -1">{{target_year -1}}</option>
                            <option :value="target_year">{{target_year}}</option>
                            <option :value="target_year +1">{{target_year +1}}</option>
                        </select>
                    </div>
                    <div class="col-auto input-group ms-1 py-1" style="width:120px;">
                        <lable class="input-group-text py-1">Version</lable>
                        <select v-model="target_version" class="form-select" style="padding:0.1em 0.5em;"
                                @change="loadData">
                            <option v-for="ver in version_list" :value="ver">{{ ver }}</option>
                        </select>
                    </div>
                    <div class="col-auto input-group ms-1 py-1">
                        <lable class="input-group-text py-1" style="min-width:300px;">{{ version_comments }}</lable>
                    </div>
                </div>
            </div>
            <div class="col-auto ms-1">
                <div class="input-group">
                    <label class="input-group-text py-1">Organization</label>
                    <span class="input-group-text py-1" style="min-width:100px;">
                        <span v-if="selectedOrg">{{selectedOrg.org_name}}</span>
                    </span>
                    <div class="form-control text-start input-group p-0">
                        <organization-select-component
                                ref="organizationSelectComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :year="target_year-1"
                                :preset_orgid="selectedOrg.id"
                                @select-target="setOrganization">
                        </organization-select-component>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <i class="bi bi-eraser-fill ms-auto text-primary"
                           style="cursor:pointer" @click="clearOrganization"></i>
                    </div>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_child_organization"
                               @change="changeChildCheck"> Include Children
                    </div>
                </div>
            </div>
            <div class="col ms-auto me-1 text-end">
                <input type="checkbox" v-model="viewSimple"> View only that have cost.
            </div>

        </div>

        <div class="table-responsive">
            <table class="table table-hover table-bordered" style="overflow: scroll;">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;" >
                    <tr>
                        <th colspan="1" class="py-1 text-center align-middle">
                            Account
                            <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                                <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                                <i v-else class="bi bi-signpost"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                <i v-else class="bi bi-tag"></i>
                            </label>
                            <label class="ps-1" style="cursor:pointer" @click="toggle_code = !toggle_code">
                                <i v-if="toggle_code" class="bi bi-c-square-fill text-danger"></i>
                                <i v-else class="bi bi-c-square"></i>
                            </label>
                        </th>
                        <th colspan="13" class="py-1 text-center align-middle">Month</th>
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
                            <span v-if="this.selectedOrg">{{target_year}} Year</span>
                        </th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">1월</span><span v-else>Jan.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">2월</span><span v-else>Feb.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">3월</span><span v-else>Mar.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">4월</span><span v-else>Apr.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">5월</span><span v-else>May.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">6월</span><span v-else>Jun.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">7월</span><span v-else>Jul.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">8월</span><span v-else>Aug.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">9월</span><span v-else>Sep.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">10월</span><span v-else>Oct.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">11월</span><span v-else>Nov.</span></th>
                        <th class="py-1 text-center"><span v-if="this.$props.lang == 'kr'">12월</span><span v-else>Dec.</span></th>

                    </tr>
                </thead>
                <tbody v-for="item,index in itemList" class="shadow-sm">
                    <tr v-if="isView(item)" class="bg-opacity-25"
                        :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto"  style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span style="cursor:pointer;" @click="viewBudgetList(item)">
                                <span v-if="toggle_id" class="text-danger">[{{ item.id }}]</span>
                                <span v-if="toggle_code" class="text-danger"><{{ item.account_code }}></span>
                                <span v-if="viewPath">{{ item.account_path }}</span>
                                <span v-else>{{ item.account_name }}</span>
                            </span>
                            <div v-if="index == 0" class="ps-2">
                                <label class="py-1" style="cursor:pointer" @click="toggle_id = !toggle_id">
                                    <i v-if="toggle_id" class="bi bi-tag-fill text-danger"></i>
                                    <i v-else class="bi bi-tag"></i>
                                </label>
                            </div>
                        </td>
                        <td class="text-end text-success" class="bg-opacity-25 text-end text-success" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_year'}"
                            @click="viewBudgetList(item,'plan_year')">{{ markedCost(item.plan_year_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 1 && 1 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',1)">{{ markedCost(item.plan_month_1_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 2 && 2 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',2)">{{ markedCost(item.plan_month_2_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 3 && 3 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',3)">{{ markedCost(item.plan_month_3_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 4 && 4 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',4)">{{ markedCost(item.plan_month_4_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 5 && 5 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',5)">{{ markedCost(item.plan_month_5_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 6 && 6 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',6)">{{ markedCost(item.plan_month_6_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 7 && 7 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',7)">{{ markedCost(item.plan_month_7_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 8 && 8 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',8)">{{ markedCost(item.plan_month_8_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 9 && 9 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',9)">{{ markedCost(item.plan_month_9_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 10 && 10 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',10)">{{ markedCost(item.plan_month_10_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 11 && 11 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',11)">{{ markedCost(item.plan_month_11_cost) }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'plan_month' && startMonth == 12 && 12 == endMonth}"
                            @click="viewBudgetList(item,'plan_month',12)">{{ markedCost(item.plan_month_12_cost) }}</td>
                    </tr>
                </tbody>
            </table>
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
    props : ['site','lang','div_name','target_year','selected_org','check_child_org','acl'],
    components: {
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",
            selectedOrg : this.$props.selected_org,
            include_child_organization : this.$props.check_child_org,
            startMonth : 1,
            endMonth : 12,
            target_year : this.$props.target_year,
            target_version : 0,
            version_comments : '',
            version_list :[],
            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedColumn :"",
            viewSimple : true,
            showProgressModal : "",
            toggle_id : false,
            toggle_code : false,
            viewPath : false,
        }
    },
    mounted(){
        this.target_year = parseInt(this.target_year);
        this.loadData();
    },
    methods: {
        // emit function
        setOrganization(org){
            this.selectedOrg = org;
            this.loadData();
            this.$emit('set-organization',this.selectedOrg);
        },
        clearOrganization(){
            this.selectedOrg = {};
            this.loadData();
        },
        changeChildCheck(){
            this.loadData();
            this.$emit('change-org-child-check',this.include_child_organization);
        },
        changeYear(){
            this.selectedOrg = {};
            this.target_version = 0;
            this.loadData();
            this.$emit('change-year',this.target_year);
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            var org_id = 0;
            var account_id = 0;
            if(this.selectedOrg) var org_id = this.selectedOrg.id;
            await axios.get('./api/getBudgetPlanAmount',
                    { params:{  organization_id: org_id,
                                include_child_organization: vm.include_child_organization,
                                target_year : vm.target_year,
                                target_version : vm.target_version,
                                target_div : vm.$props.div_name,
                    } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.version_list = res.data.version_list;
                    vm.target_version = res.data.target_version;
                    vm.version_comments = res.data.version_comments;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            if(!this.openItemList.includes(this.itemList[0].id))
                this.openItemList.push(this.itemList[0].id);

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
                    vm.viewBudgetList(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }
            if(selectedItemMatching == false){
                vm.selectedItem = {};
            }
            this.expandAll();
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
            await axios.get('./api/getAccountParents/'+id, null)
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
                            this.viewBudgetList(this.selectedItem);
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
        viewBudgetList(item,target='',month=''){
            this.selectedItem = item;
            if(target != '')
                this.selectedColumn = target;

            if(month != ''){
                this.startMonth = month;
                this.endMonth = month;
            }
            if(target.includes('year')){
                this.startMonth = 1;
                this.endMonth = 12;
            }
            var startMonth = this.startMonth;
            var endMonth = this.endMonth;

            this.$emit('select-bfa-item', this.selectedOrg, this.selectedItem,
                    this.selectedColumn, startMonth, endMonth, this.include_child_organization);
        },
        toggleOrgList(){
            this.$emit('toggle-orglist');
        },
        dblClick(){
            this.$emit('dblclick-item');
        },
        expandAll(){
            this.openItemList = [];
            for(var i=0; i<this.itemList.length; i++){
                this.openItemList.push(this.itemList[i].id);
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
        }
    },
    computed:{
        isView(){
            return(item)=>{
                if(!item.new_enable) return false;
                if(item.parent == null) return true;
                if(!item.plan_year_cost && this.viewSimple)  return false;
                if(this.openItemList.indexOf(item.parent) > -1){
                    if(item.account_name.toUpperCase().includes(this.filter_name.toUpperCase()) ||
                        item.id == this.filter_name )
                        return true;
                    else
                        return false;
                }
                //if(this.openItemList.indexOf(item.parent) > -1) return true;
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
