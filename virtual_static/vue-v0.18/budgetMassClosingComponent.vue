<template>
    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-xl modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="lang=='kr'" class="col">일괄 실적</h4><h4 v-else class="col">Mass Closing</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeComponent"></button>
                </div>
                <div class="modal-body" style="min-height:150px;">

                    <div class="col" id="excelUploadForm">
                        <div class="input-group">
                            <label class="input-group-text" style="width:160px;">
                                <b>Account Template</b>
                            </label>
                            <lable class="form-control bg-white text-start">
                                <span v-if="accountItem.id">
                                    [{{accountItem.id}}] {{accountItem.account_name}} ({{accountItem.account_code}})
                                </span>
                            </lable>
                            <button class="input-group-text" @click="accountSelectModal=true">
                                <i class="bi bi-search"></i>
                            </button>
                            <button class="btn btn-secondary ms-1" style="width:120px;" @click="downloadTemplate">
                                Start Download
                            </button>
                        </div>

                        <div class="col vstack">
                            <div v-if="dprogress > 0" class="progress" style="height:20px;">
                                <button class="btn btn-warning btn-sm mx-1" @click="cancelDownload"> Download Cancel </button>
                                <div class="progress-bar bg-primary" role="progressbar" :style="{width: dprogress + '%'}" aria-valuenow="0">{{ dprogress }}%</div>
                            </div>
                        </div>

                    </div>
                    <div class="col">
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
                            <button class="btn btn-primary ms-1" style="width:120px;" @click="uploadStart">
                                Start Upload
                            </button>
                        </div>
                    </div>

                    <table v-if="accountItemList.length > 0" class="table table-hover table-bordered mt-3"
                        style="overflow: scroll;">
                        <thead style="background-color:#DDEEFF;">
                            <th v-for="head in accountHeadList" class="py-1 text-center text-nowrap">{{head}}</th>
                         </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="acc in accountItemList" class="py-1 text-center">
                                <td v-for="(key,i) in accountKeyList" class="py-1 text-center text-nowrap bg-opacity-25"
                                    :class="{'bg-danger': !acc.validation_check}">
                                    <span :class="{'text-danger' : ( !acc.org_name_check && i == 2 ||
                                            !acc.col3_check && i == 3 || !acc.col4_check && i == 4
                                        ) }">
                                        {{acc[key]}}
                                    </span>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                    <div v-if="accountItemList.length == 0" class="mt-3">
                        There is no uploaded data.
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="applyData">Apply</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeComponent">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>


    <div v-if="accountSelectModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Account Selector</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="accountSelectModal=false"></button>
                </div>
                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <account-list-component ref="accountListComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :month="this.$props.month"
                                :acl="this.$props.acl"
                                :div_name="this.$props.div_name"
                                :pmode="mode"
                                @select-item="accountSelected"></account-list-component>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectAccount">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="accountSelectModal=false">Cancel</div>
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
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            accountItem : {},
            tempAccountItem : {},
            accountKeyList : [],
            accountHeadList : [],
            accountItemList :[],

            showModal : false,
            showProgressModal : false,
            accountSelectModal:false,
            dprogress : 0,
        }
    },
    mounted(){
        this.accountKeyList = [];
        this.accountHeadList = [];
        this.accountItemList = [];
    },
    methods: {
        // emit function
        accountSelected(item){
            this.tempAccountItem = item;
        },
        closeComponent(){
            this.$emit('close-component');
        },

        openModal(event){
            if(event) event.preventDefault();
            this.showModal = true;
            this.accountKeyList = [];
            this.accountHeadList = [];
            this.accountItemList = [];
        },
        closeModal(event){
            if(event) event.preventDefault();
            this.showModal = false;
        },
        selectAccount(){
            this.accountItem = this.tempAccountItem;
            this.accountSelectModal = false;
        },
        async downloadTemplate(){
            if(!this.accountItem.id){
                warningModal.show_modal("Please, select a account.");
                return;
            }

            var vm = this;
            var error_check = false;
            this.showProgressModal = true;
            await axios.get('./api/massExcelDownload/'+this.accountItem.id,
                { params:{ 'mode': 'check' } } )
                .then(function(res){  })
                .catch(function(err){
                    warningModal.show_modal(err);
                    error_check = true;
                });
            this.showProgressModal = false;
            if(error_check)
                return;

            var config = {
                responseType: 'blob',
                cancelToken: cancelTokenSource.token,
                onDownloadProgress: function(progressEvent) {
                    vm.dprogress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/massExcelDownload/'+this.accountItem.id, config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "Template.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    return;
                });
            vm.dprogress = 0;

            await axios.delete('./api/massExcelDownload/'+this.accountItem.id, null )
                .then(function (res) { })
                .catch(function (err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        async uploadStart(event){
            if(!this.accountItem.id){
                warningModal.show_modal("Please, select a account.");
                return;
            }

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
            response.div_name = vm.accountItem.div_name;
            await axios.post('./api/massExcelUpload/'+this.accountItem.id,response )
                .then(function(res){
                    vm.accountKeyList = res.data.key_list;
                    vm.accountHeadList = res.data.item_head;
                    vm.accountItemList = res.data.item_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.$refs.attachedFileComponent.initialize();
                    return;
                });
            this.showProgressModal = false;
        },
        async applyData(){
            this.showProgressModal = true;
            var vm = this;
            var data = {};
            data.accountKeyList = this.accountKeyList;
            data.accountHeadList = this.accountHeadList;
            data.accountItemList = this.accountItemList;
            data.div_name = this.accountItem.div_name;
            await axios.put('./api/massExcelUpload/'+this.accountItem.id,data )
                .then(function(res){ })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('update-result');
            this.showModal = false;
        },
    },
}
</script>