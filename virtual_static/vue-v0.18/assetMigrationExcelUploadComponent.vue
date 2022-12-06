<template>
    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="lang=='kr'" class="col">자산 Data Migration</h4>
                    <h4 v-else class="col">Asset Data Migration</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeComponent"></button>
                </div>
                <div class="modal-body" style="min-height:150px;">
                    <div class="col">
                        <div class="input-group">
                            <label class="input-group-text" style="width:160px;">
                                <b>New Excel Data</b>
                            </label>
                            <label class="form-control p-1 pb-0">
                                <attached-file-component
                                    ref="attachedFileComponent"
                                    :attached_list="[]"
                                    :type="'single'"
                                    :mode="'new'"></attached-file-component>
                            </label>
                            <button class="btn btn-primary ms-1" style="width:120px;" @click="uploadStart">
                                Start Upload
                            </button>
                        </div>
                    </div>

                    <table v-if="dataItemList.length > 0" class="table table-hover table-bordered mt-3"
                        style="overflow: scroll;">
                        <thead style="background-color:#DDEEFF;">
                            <th class="py-1 text-center text-nowrap">Validation</th>
                            <th v-for="head in dataHeadList" class="py-1 text-center text-nowrap">{{head}}</th>
                         </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="d in dataItemList" class="py-1 text-center">
                                <td class="bg-opacity-25" :class="{'bg-danger': !d.validation_check}">
                                    <span v-if="d.validation_check">OK</span>
                                    <span v-else class="text-danger">NG</span>
                                </td>
                                <td v-for="(key,i) in dataKeyList" class="py-1 text-start text-nowrap bg-opacity-25"
                                    :class="{'bg-danger' : (!d.category_check && i == 4) || (!d.nas_code_check && i == 21)}">
                                        {{d[key]}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="dataItemList.length == 0" class="mt-3">
                        There is no uploaded data.
                    </div>

                </div>
                <div class="modal-footer">
                    <div v-if="dataItemList.length > 0" class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="applyData">Apply</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeComponent">Cancel</div>
                    </div>
                    <div v-else class="col text-center">
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeComponent">Close</div>
                    </div>
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
let cancelTokenSource = axios.CancelToken.source();
export default {
    props : ['site','lang','acl','div_name'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            dataKeyList : [],
            dataHeadList : [],
            dataItemList : [],

            showModal : false,
            showProgressModal : false,
            dprogress : 0,
        }
    },
    methods: {
        closeComponent(){
            this.$emit('close-component');
        },
        async uploadStart(event){
            var response = await this.$refs.attachedFileComponent.uploadStart(null);
            if( response.svr_file_names.length == 0){
                warningModal.show_modal("Please input excel file.");
                this.$refs.attachedFileComponent.initialize();
                return;
            }
            if( response.result == false ){
                warningModal.show_modal(response.err);
                return;
            }
            this.showProgressModal = true;

            var vm = this;
            response.div_name = vm.$props.div_name;
            response.year = vm.$props.year;
            response.version = vm.$props.version;
            await axios.post('./api/assetMigrationExcelUpload', response )
                .then(function(res){
                    vm.dataKeyList = res.data.key_list;
                    vm.dataHeadList = res.data.item_head;
                    vm.dataItemList = res.data.item_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.$refs.attachedFileComponent.initialize();
                    return;
                });
            this.showProgressModal = false;
        },
        async applyData(){
            for(var i=0; i<this.dataItemList.length; i++){
                if(!this.dataItemList[i].validation_check){
                    warningModal.show_modal("Can not apply with validation error!");
                    return;
                }
            }

            this.showProgressModal = true;
            var vm = this;
            var data = {};
            data.dataKeyList = this.dataKeyList;
            data.dataHeadList = this.dataHeadList;
            data.dataItemList = this.dataItemList;
            data.div_name = this.$props.div_name;
            data.year = this.$props.year;
            data.version = this.$props.version;
            await axios.put('./api/assetMigrationExcelUpload',data )
                .then(function(res){ })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-result');
        },
    },
}
</script>