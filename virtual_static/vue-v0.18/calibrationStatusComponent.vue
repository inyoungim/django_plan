<template>

    <div class="vstack align-top border rounded p-2 text-nowrap" style="overflow-x:auto">

        <div class="hstack">
            <div class="col-auto input-group py-1" style="width:120px;">
                <lable class="input-group-text py-0">Year</lable>
                <select v-model="targetYear" class="form-select" style="padding:0.1em 0.5em;"
                        @change="loadData">
                    <option :value="this.$props.year -2">{{this.$props.year -2}}</option>
                    <option :value="this.$props.year -1">{{this.$props.year -1}}</option>
                    <option :value="this.$props.year +0">{{this.$props.year +0}}</option>
                    <option :value="this.$props.year +1">{{this.$props.year +1}}</option>
                </select>
            </div>
            <div class="col-auto input-group py-1 ms-1" style="width:120px;">
                <lable class="input-group-text py-0">Month</lable>
                <select v-model="targetMonth" class="form-select" style="padding:0.1em 0.5em;"
                        @change="loadData">
                    <option v-for="n in (12)" :value="n">{{n}}</option>
                </select>
            </div>

            <div class="ms-3 me-1">
                <input type="checkbox" v-model="include_child" @change="loadData"> Include Children
            </div>
            <div class="ms-auto me-1">
                <input type="checkbox" v-model="viewSimple"> View only that have data.
            </div>
        </div>

        <div class="table-responsive">
            <table class="table table-hover table-bordered mb-0">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;">
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
                        <th rowspan="1" class="py-1 text-center">Total</th>
                        <th colspan="2" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">교정 대상</span><span v-else>Calibration Target</span>
                        </th>
                        <th colspan="3" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">계측기 실</span><span v-else>Instrument Room</span>
                        </th>
                        <th colspan="2" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사</span><span v-else>Calibration Agency</span>
                        </th>
                        <th colspan="2" class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">교정 완료</span><span v-else>Complete Calibrations</span>
                        </th>
                        <th colspan="2" class="py-1 text-center align-middle">Progress</th>
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
                        <th class="py-1 text-center">Quantity</th>
                        <th class="py-1 text-center">Year</th>
                        <th class="py-1 text-center">Month</th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">미입고</span><span v-else>Waiting</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">입고</span><span v-else>Wearing</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">분실/반납</span><span v-else>Missing/Return</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">입고</span><span v-else>Wearing</span>
                        </th>
                        <th class="py-1 text-center">
                            <span v-if="this.$props.lang=='kr'">출고</span><span v-else>Release</span>
                        </th>
                        <th class="py-1 text-center">Year</th>
                        <th class="py-1 text-center">Month</th>
                        <th class="py-1 text-center">Year</th>
                        <th class="py-1 text-center">Month</th>
                    </tr>
                </thead>
                <tbody v-for="(item,index) in itemList" >
                    <tr v-if="isView(item)" class="bg-opacity-25"
                        :id="item.id" :class="{'bg-warning': selectedItem.id == item.id}">
                        <td class="hstack border-0 border-start">
                            <div v-html="level(item)"></div>
                            <span v-if="item.rght -1 > item.lft" class="col-auto" style="width:20px; cursor:pointer;"
                                  v-html="folderSymbol(item.id)" @click="toggle(item)"></span>
                            <span v-else class="col-auto" style="width:20px;"><i class="bi bi-record2-fill text-danger"></i></span>
                            <span style="cursor:pointer;" @click="viewList(item)">
                                <span v-if="toggle_id1" class="text-danger">[{{ item.id }}]</span>
                                <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                                <span v-if="viewPath">{{ item.org_path }}</span>
                                <span v-else>{{ item.org_name }}</span>
                            </span>
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer; width:25px;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'qty'}"
                            @click="viewList(item,'qty')">{{ item.quantity }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'target_year'}"
                            @click="viewList(item,'target_year')">{{ item.target_year_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'target_month'}"
                            @click="viewList(item,'target_month')">{{ item.target_month_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'waiting'}"
                            @click="viewList(item,'waiting')">{{ item.waiting_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'inst_room'}"
                            @click="viewList(item,'inst_room')">{{ item.inst_room_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'missing'}"
                            @click="viewList(item,'missing')">{{ item.missing_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'agency'}"
                            @click="viewList(item,'agency')">{{ item.agency_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'release'}"
                            @click="viewList(item,'release')">{{ item.release_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'complete_year'}"
                            @click="viewList(item,'complete_year')">{{ item.complete_year_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end" style="cursor:pointer;"
                            :class="{'bg-danger': selectedItem.id == item.id && selectedColumn == 'complete_month'}"
                            @click="viewList(item,'complete_month')">{{ item.complete_month_count }}</td>
                        <td class="text-end" class="bg-opacity-25 text-end">
                            {{ calRate(item.target_year_count,item.complete_year_count) }}
                        </td>
                        <td class="text-end" class="bg-opacity-25 text-end">
                            {{ calRate(item.target_month_count,item.complete_month_count) }}
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <div class="hstack mt-2">
            <div class="col-auto me-auto">
                <button v-if="this.$props.acl >=7"
                        class="btn btn-primary shadow-sm py-1"
                        style="min-width:80px;" @click="excelUpload">
                    <span v-if="this.$props.lang=='kr'">월 검교정 Excel Upload</span>
                    <span v-else>Excel Upload</span>
                </button>
            </div>
            <div class="col-auto ms-auto">
                <button v-if="this.$props.acl >=7"
                        class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                        @click="controlInstrumentState">
                    <span v-if="this.$props.lang=='kr'">입/출고 관리</span>
                    <span v-else>Control status</span>
                </button>
            </div>
        </div>
    </div>

    <div v-if="massUploadModal">
        <calibration-mass-upload-component
            ref="calibrationMassUploadComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :div_name="this.$props.div_name"
            :year="targetYear"
            :month="targetMonth"
            @close-component="massUploadModal=false"
            @update-data="updateData">
        </calibration-mass-upload-component>
    </div>

    <div v-if="instrumentStateControlModal">
        <instrument-state-control-component
                ref="InstrumentStateControlComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :year="targetYear"
                :month="targetMonth"
                @close-component="instrumentStateControlModal=false"
                @update-data="updateData">
        </instrument-state-control-component>
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
    props : ['site','lang','year','month','div_name','acl'],
    components: {
        'calibration-mass-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/calibrationMassUploadComponent.vue', vueLoaderOptions) ),
        'instrument-state-control-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/InstrumentStateControlComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            filter_enable : false,
            filter_name : "",

            targetYear : this.$props.year,
            targetMonth : this.$props.month,
            include_child : false,

            itemList : [],
            openItemList : [],
            selectedItem : {},
            selectedColumn :"",
            showProgressModal : false,
            viewSimple : false,

            massUploadModal : false,
            instrumentStateControlModal : false,
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
        // emit function of calibrationMassUploadComponent
        updateData(){
            this.massUploadModal = false;
            this.loadData();
        },
        changeViewPath(){
            this.viewPath = !this.viewPath;
            this.$emit('change-view-path', this.viewPath);
        },
        controlInstrumentState(){
            this.instrumentStateControlModal = true;
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/calibrationStatus',
                    { params:{  year : vm.targetYear,
                                month : vm.targetMonth,
                                div_name : vm.$props.div_name,
                                include_child : vm.include_child,
                    } }
                )
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";

            var selectedItemMatching = false;
            for(var i=0; i<vm.itemList.length; i++){
                if(vm.itemList[i].id == vm.selectedItem.id){
                    vm.selectedItem = vm.itemList[i];
                    vm.viewList(vm.selectedItem);
                    selectedItemMatching = true;
                    break;
                }
            }

            await this.expandAll(2);
        },
        expandAll(level=100){
            this.openItemList = [];
            for(var i=0; i<this.itemList.length; i++){
                if(this.itemList[i].level < level){
                    this.openItemList.push(this.itemList[i].id);
                }
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
                            this.viewList(this.selectedItem);
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
        viewList(item, target=''){
            this.selectedItem = item;
            if(target != '')
                this.selectedColumn = target;
            this.$emit('select-item', item, this.selectedColumn, this.targetYear, this.targetMonth, this.include_child);
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

        excelUpload(){
            this.massUploadModal = true;
        },
    },
    computed:{
        isView(){
            return(item)=>{
                if(!item.quantity && this.viewSimple)  return false;
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
        calRate(){
            return(total, count)=>{
                if(!total && !count) return "";
                if(!count || parseInt(count) == 0) return "0%";
                if(total == count) return "100%";

                var rate =( parseInt(count) *100 )/ parseInt(total);
                return rate.toFixed(1) + "%";
            }
        }
    },
}
</script>
