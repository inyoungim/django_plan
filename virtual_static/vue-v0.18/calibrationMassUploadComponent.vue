<template>
    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Excel Upload</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeComponent"></button>
                </div>
                <div class="modal-body text-start" style="min-height:150px;">
                    <div v-if="calibrationItemList.length == 0" class="col">
                        <div class="input-group">
                            <label class="input-group-text" style="width:160px;">
                                <b>Reference Excel Data</b>
                            </label>
                            <label class="form-control bg-white">
                                <a href="#" class="link-primary text-decoration-none"
                                   @click="reference_file_download('Calibration_List_Sample.xlsx')">Calibration List Sample.xlsx</a>
                            </label>
                        </div>
                    </div>
                    <div v-if="calibrationItemList.length == 0" class="hstack">
                        <div class="input-group mt-1">
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
                        </div>
                        <button class="btn btn-primary ms-1" style="width:120px;" @click="uploadStart">
                            Start Upload
                        </button>
                    </div>

                    <table v-if="calibrationItemList.length > 0" class="table table-hover table-bordered mt-3"
                        style="overflow: scroll;">
                        <thead style="background-color:#DDEEFF;">
                            <th v-for="head in calHeadList" class="py-1 text-center text-nowrap">{{head}}</th>
                         </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="cal_row in calibrationItemList" class="py-1 text-center">
                                <td v-for="cal_column in cal_row"
                                    class="py-1 text-center text-nowrap bg-opacity-25"
                                    :class="{'bg-danger': !cal_row.validation_check}">
                                    {{cal_column}}
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="calibrationItemList.length == 0" class="mt-3 text-center">
                        There is no uploaded data.
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="applyData">Apply</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeComponent">Cancel</div>
                        <div v-if="calibrationItemList.length > 0"
                             class="btn btn-secondary mx-2" style="mit-width:100px;"
                             @click="calibrationItemList=[]">Back to Dialog</div>
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
    props : ['site','lang','acl','div_name','year','month'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            calHeadList : [],
            calibrationItemList :[],

            showProgressModal : false,
            dprogress : 0,
        }
    },
    mounted(){
        this.calHeadList = [];
        this.calibrationItemList = [];
    },
    methods: {
        closeComponent(event){
            if(event) event.preventDefault();
            this.$emit('close-component');
        },
        async reference_file_download(file_name){
            var vm = this;
            var config = { responseType: 'blob', };
            await axios.get('./api/calibrationExcelDownload',config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){ vm.errcheck = err;  });
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
            await axios.post('./api/calibrationExcelUpload',response )
                .then(function(res){
                    vm.calHeadList = res.data.item_head;
                    vm.calibrationItemList = res.data.item_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.$refs.attachedFileComponent.initialize();
                    return;
                });
            this.showProgressModal = false;
        },
        async applyData(){
            for(var i=0; i<this.calibrationItemList.length; i++){
                if(!this.calibrationItemList[i].validation_check){
                    if(this.$props.lang == 'kr')
                        warningModal.show_modal("자산 번호가 존재 하지 않는 항목이 있어 적용 할 수 없습니다.");
                    else
                        warningModal.show_modal("Please, tray again after check asset number and fix it.");
                    return;
                }
            }

            this.showProgressModal = true;
            var vm = this;
            var data = {};
            data.calHeadList = this.calHeadList;
            data.calibrationItemList = this.calibrationItemList;
            data.div_name = this.$props.div_name;
            data.year = this.$props.year;
            data.month = this.$props.month;
            await axios.put('./api/calibrationExcelUpload',data )
                .then(function(res){ })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-data');
        },
    },
}
</script>