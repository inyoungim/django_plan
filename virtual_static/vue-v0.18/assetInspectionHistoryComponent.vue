<template>

    <!-- New Item Modal -->
    <div class="row">
        <div class="col-lg-6 vstack align-top p-1 px-2">
            <div class="hstack border-bottom border-primary">
                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                    <b>Inspection History</b>
                </div>
                <div class="col-auto ms-auto">
                    <button v-if="expandAll" type="button" class="btn btn-outline-primary" style="padding:0.1em 0.5em;" @click="contractHeight">
                        <i class="bi bi-arrows-angle-contract"></i>
                    </button>
                    <button v-else type="button" class="btn btn-outline-danger" style="padding:0.1em 0.5em;" @click="expandHeight">
                        <i class="bi bi-arrows-angle-expand"></i>
                    </button>
                </div>
            </div>

            <div class="m-0 p-0">
                <table class="table table-hover table-bordered m-0 mb-3">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">PK</th>
                            <th class="py-1 text-center text-nowrap">Year</th>
                            <th class="py-1 text-center text-nowrap">Date</th>
                            <th class="py-1 text-center text-nowrap">Status</th>
                            <th class="py-1 text-center text-nowrap">Region</th>
                            <th class="py-1 text-center text-nowrap">Location</th>
                            <th class="py-1 text-center text-nowrap">Detail Location</th>
                            <th class="py-1 text-center text-nowrap"><b>Comments</b></th>
                        </tr>
                    </thead>
                    <tbody v-for="item,i in tdata.itemList">
                        <tr v-if="expandAll || i < 10" class="bg-opacity-25"
                            :class="{'bg-warning': selected_item == item}" @click="selected_item = item">
                            <td class="py-1 text-center text-nowrap">{{item.id}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.year}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.create_date}}</td>
                            <td class="py-1 text-center text-nowrap">
                                <span v-if="item.status == 'Waiting' && this.$props.lang == 'kr'">실사 대기</span>
                                <span v-else-if="item.status == 'Using' && this.$props.lang == 'kr'">사용</span>
                                <span v-else-if="item.status == 'Disuse' && this.$props.lang == 'kr'">자산 폐기</span>
                                <span v-else-if="item.status == 'Dispatch' && this.$props.lang == 'kr'">샘플 발송</span>
                                <span v-else-if="item.status == 'Missing' && this.$props.lang == 'kr'">분실</span>
                                <span v-else-if="item.status == 'Delete' && this.$props.lang == 'kr'">전산 폐기</span>
                                <span v-else>{{item.status}}</span>
                            </td>
                            <td class="py-1 text-center text-nowrap">{{item.region}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.location}}</td>
                            <td class="py-1 text-center text-nowrap">{{item.detail_location}}</td>
                            <td class="py-1 text-start text-nowrap">{{item.comments}}</td>
                        </tr>
                    </tbody>
                    <tbody v-if="tdata.itemList && tdata.itemList.length == 0 ">
                        <tr>
                            <td colspan="11" class="text-center"> There is no data. </td>
                        </tr>
                    </tbody>
                    <tfoot v-if="expandAll">
                        <tr>
                            <td colspan="100" class="px-0">
                                <div class="row mt-3 mx-0 p-0">
                                    <div class="col-md-3 col-12 text-start px-1" role="group">
                                        <div class="dropdown">
                                            <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownNumberButton"
                                                data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"> {{page_num}} </button>
                                            <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNumberButton" style="min-width:50px;" >
                                                <li><a class="dropdown-item" :class="{active: page_num == 10}" href="#" @click="page(tdata.active_page, 10, $event)">10</a></li>
                                                <li><a class="dropdown-item" :class="{active: page_num == 20}" href="#" @click="page(tdata.active_page, 20, $event)">20</a></li>
                                                <li><a class="dropdown-item" :class="{active: page_num == 50}" href="#" @click="page(tdata.active_page, 50, $event)">50</a></li>
                                                <li><a class="dropdown-item" :class="{active: page_num == 100}" href="#" @click="page(tdata.active_page, 100, $event)">100</a></li>
                                            </ul>
                                            Total {{ tdata.total_article }} articles
                                        </div>
                                    </div>
                                    <div class="col-md-6 col-12">
                                        <ul class="pagination justify-content-center mb-0">

                                            <li class="page-item" :class="{disabled : tdata.previous_page == 0}" >
                                                <a class="page-link text-center mx-1 px-3" aria-label="Previous"
                                                   :style="{color:previous_text_color}"
                                                   href="#" @click="page(tdata.previous_page, page_num, $event)"> &Lang;&Lang; </a>
                                            </li>

                                            <li v-for="p in tdata.page_list" :class="['page-item', { active: tdata.active_page === p }]">
                                                <a class="page-link" href="#" @click="page(p, page_num, $event)">{{ p }}</a>
                                            </li>

                                            <li class="page-item" :class="{disabled : tdata.next_page == 0}">
                                                <a class="page-link text-center mx-1 px-3" aria-label="Next"
                                                   :style="{color:next_text_color}"
                                                    href="#"  @click="page(tdata.next_page, page_num, $event)"> &Rang;&Rang; </a>
                                                </a>
                                            </li>
                                        </ul>
                                    </div>
                                </div>
                            </td>
                        </tr>
                    </tfoot>
                </table>
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
    props : ['site','lang','acl','parent_id'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "list",
            parent_id : this.$props.parent_id,
            expandAll : false,
            tdata : {},
            selected_item : {},
            page_num : 10,
            active_page: 1,
            edit_item : {},
            showProgressModal : false,
            inspectionFormModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        contractHeight(){
            this.expandAll = false;
        },
        expandHeight(){
            this.expandAll = true;
        },
        async loadData(){
            this.active_page = 1;
            this.page(this.active_page, this.page_num, null);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            await axios.get('./api/inspectionHistory/'+vm.parent_id,
                { params:{ active_page: num, page_num: page_num, } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.mode = "list";
        },
        add_Inspection(){
            this.edit_item = {};
            this.mode = "new";
            this.inspectionFormModal = true;
        },
        delete_Inspection(){
            if(event) event.preventDefault();
            if(!this.selected_item.id){
                warningModal.show_modal("Select a item!");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/inspectionHistory/'+vm.selectedItem.id, null)
                .then(function(res){
                    vm.result = res.data.result;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        viewInspectionFormModal(item){
            this.mode = "view";
            this.editItem = item;
            this.inspectionFormModal = true;
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            return true;
        },
        async submitInspectionFormModal(){
            if(!this.form_validation()) return false;

            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.editItem.id);
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.showProgressModal = true;
                // make array data svr_file_names and up_file_names
                vm.edit_item.attache_files = [];
                vm.edit_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.edit_item.attache_files.push(response.svr_file_names[i]);
                    vm.edit_item.attache_file_names.push(response.up_file_names[i]);
                }
                if(this.mode == "new"){
                    await axios.post('./api/inspectionHistory/'+vm.parent_id, vm.edit_item)
                        .then(function(res){
                            vm.result = res.data.result;
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }else{
                    await axios.put('./api/inspectionHistory/'+vm.edit_item.id, vm.edit_item)
                        .then(function(res){
                            vm.result = res.data.result;
                        })
                        .catch(function(err){
                            vm.showProgressModal = false;
                            warningModal.show_modal(err);
                            return;
                        });
                }
                vm.showProgressModal = false;
            }
            this.inspectionFormModal=false;
            this.$emit('update-result');
        },
        modifyInspectionFormModal(){
            this.mode = "modify";
            this.edit_item = JSON.parse(JSON.stringify(this.selected_item));
        },
        cancelInspectionFormModal(){
            this.edit_item = this.selected_item;
            this.mode = "view";
        },
        closeInspectionFormModal(){
            this.inspectionFormModal=false;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
