<template>
    <div v-if="this.$props.pmode == 'mgmt'">
        <div class="hstack border-bottom border-primary">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-warning bg-opacity-25">
                <i class="bi bi-grid-3x3-gap-fill text-primary px-2"></i>
                <b>PopUp Message Management</b>
            </div>
            <button v-if="item.itemContents"
                    type="button" class="btn btn-lightyellow ms-auto" style="padding:0.1em 0.5em;"
                    @click="popupModal=true">
                <span class="text-danger"><i class="bi bi-info-square me-2"></i>View Pop-up</span>
            </button>
        </div>
        <div class="col" >
            <div v-show="mode == 'modify'" class="col">
                <div id="keditor_wrapper" name="contents" required>
                    <note-contents v-html="item.itemContents"></note-contents>
                </div>
            </div>
            <div v-show="mode != 'modify'" class="col">
                <div v-if="item.itemContents == ''"class="form-control text-center">There is no data.</div>
                <div v-else class="form-control" style="max-height:200px; overflow:auto;">
                    <note-contents v-html="item.itemContents"></note-contents>
                </div>
            </div>

            <div class="row mt-1">
                <div class="input-group">
                    <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                    <div v-if="mode == 'modify'" class="col">
                        <attached-file-component ref="attachedFileComponent"
                                                 :attached_list="item.attached_files"
                                                 :mode="mode"></attached-file-component>
                    </div>
                    <div v-else class="col">
                        <attached-file-component :attached_list="item.attached_files"></attached-file-component>
                    </div>
                </div>
            </div>
        </div>
        <div class="col text-end my-1">
            <div v-if="mode != 'modify' && this.$props.acl >= 7" class="d-flex">
                <div v-if="this.$props.acl >= 9" class="btn btn-danger me-1"
                     style="padding:0.1em 0.5em;" @click="openCopyToModal">Copy to ...</div>
                <div class="btn btn-success me-auto" style="padding:0.1em 0.5em;" @click="copyContentsBelow">Copy to Below</div>

                <div class="btn btn-darkblue" style="width:80px;padding:0.1em 0.5em;" @click="modifyContents">Modify</div>
                <div class="btn btn-danger ms-1" style="min-width:80px;padding:0.1em 0.5em;" @click="deleteContents">Delete</div>
            </div>
            <div v-else-if="this.$props.acl >= 7">
                <div class="btn btn-darkblue col me-1" style="width:80px;padding:0.1em 0.5em;" @click="updateContents">Update</div>
                <div class="btn btn-darkblue col" style="width:80px;padding:0.1em 0.5em;" @click="cancelContents">Cancel</div>
            </div>
        </div>
    </div>

    <div v-if="popupModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-warning bg-opacity-50">
                    <h4 class="col text-danger">Notice</h4>
                    <button type="button" class="btn-close btn-close" @click="closePopupNotice"></button>
                </div>
                <div class="modal-body" style="min-height:200px;">
                    <div class="border text-start p-2">
                        <note-contents v-html="item.itemContents"></note-contents>
                    </div>

                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                        <div class="col border">
                            <div v-if="dprogress > 0" class="border p-2 progress" style="height:20px;">
                                <button class="btn btn-warning btn-sm mx-1" @click="cancelDownload"> Download Cancel </button>
                                <div class="progress-bar bg-primary" role="progressbar" :style="{width: dprogress + '%'}" aria-valuenow="0">{{ dprogress }}%</div>
                            </div>
                            <div class="input-group px-2 pt-1" v-for="f in item.attached_files">
                                <div class="p-0">
                                    <a href="#" class="link-primary text-decoration-none" @click="file_download(f.id, f.display_name)">{{ f.display_name }}</a>
                                    ({{ markedSize(f.file_size) }})
                                </div>
                            </div>
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary" style="width:100px;" @click="closePopupNotice">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="copyToModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-danger" style="cursor:move">
                    <h4 class="col text-white">Copy to specific destination</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeCopyToModal"></button>
                </div>
                <div class="modal-body">

                    <div class="col">
                        <div class="input-group mt-1">
                            <span class="input-group-text"><b>Destination ID</b></span>
                            <input class="form-control bg-white" type="text" name="Destination ID" v-model="destination_id">
                        </div>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary me-1" style="width:100px;" @click="copyContentsTo">Confirm</div>
                        <div class="btn btn-secondary ms-1" style="width:100px;" @click="closeCopyToModal">Close</div>
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
    props : ['site','lang','acl','pmode','div_list','account_id'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            item : {},
            mode : "view",
            accountId : 0,
            showProgressModal : false,
            popupModal : false,
            destination_id : "",
            copyToModal : false,
            keditor : null,
        }
    },
    mounted(){
        if(this.$props.pmode != 'mgmt'){
            this.loadPopupData();
        }
    },
    methods : {
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_wrapper";
            if(id != null)
                editor_id = "#keditor_wrapper"+id;
            this.keditor =
                KEditor.build({
                    'instanceId':'1',
                    'wrapper': editor_id,
                    'form':document.forms[0].name,
                    'iconPath':'/static/keditor/images/icon/editor',
                    'decoPath':'/static/keditor/images/deco/contents',
                    'skinPath':'/static/keditor/images/icon/editor/skin/01',
                    'imageLinkKey':' ',
                    //'imageUploader':window.ImageUploader,
                    'imageUploadPath': function(type) {
                        var path = '';
                        if (type == 'paste') {
                            // 붙여넣기 이벤트시 호출되는 URL
                            // path = '/cgi/KEditorFileUpload.none.py?OpenForm&ImageLinkKey=' + window._KEDITOR_ImageLinkKey + '&type=CONTROL';
                            path = '';
                        } else {
                            // 이미지 삽입 레이어에서 호출되는 URL
                            path = '/' + window._KEDITOR_BASE_PATH + '/pages/ImageuploadPage.html?OpenForm&ImageLinkKey=' + window._KEDITOR_ImageLinkKey;
                        }
                        return path;
                    },
                    'beforeSaveDom':function(dom){
                        var src_tags = dom.getElementsByTagName("script");
                        for(var i = src_tags.length - 1; i >= 0; i--) __dom.remove_node(src_tags[i]);
                    },
                    'beforeSaveHtml':function(html){
                        // 웹 에디터 본문 HTML 저장 전 수행됨
                    },
                    'imageLimitSize':(10 * 1024 * 1024), // 이미지 업로드 사이즈 제한 10MB
                    'largeToolbar': true,
                    'core':{},
                });
                this.keditor['do'](function(adapter) {
                    adapter.setHeight(300);
                });
        },
        closePopupNotice(){
            //this.$emit('close-popup-notice');
            this.popupModal = false;
        },
        async loadPopupData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/accountPopupContents/'+vm.$props.account_id, null)
                .then(function(res){
                    vm.item = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.mode = "view";
            if(vm.item.itemContents == ""){
                this.popupModal = false;
                this.$emit('no-popup');
            }else{
                if(this.$props.pmode != 'view')
                    this.popupModal = true;
                this.$emit('yes-popup');
            }
        },
        async loadData(accountId){
            this.accountId = accountId;
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/accountPopupContents/'+vm.accountId, null)
                .then(function(res){
                    vm.item.itemContents = res.data.itemContents;
                    vm.item.attached_files = res.data.attached_files;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.mode = "view";
        },
        modifyContents(){
            this.mode = "modify";

            this.$nextTick(() => {
                var old_contents = this.item.itemContents;
                this.kEditorInitial();
                this.keditor.do(function(adapter) {
                    adapter.setHtml( KEditor.getInlineStyleHtml(old_contents) );
                    adapter.getHtml();
                });
            });
        },
        async deleteContents(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/accountPopupContents/'+vm.accountId, null)
                .then(function(res){
                    vm.item.itemContents = res.data.itemContents;
                    vm.item.attached_files = res.data.attached_files;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.mode = "view";
        },
        cancelContents(){
            this.mode = "view";
            this.loadData(this.accountId);
        },
        async updateContents(){
            this.showProgressModal = true;
            var vm = this;
            var data = {}

            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.accountId);
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                let formData = new FormData();
                formData.append('itemContents', this.keditor.getHtml());
                // make array data svr_file_names and up_file_names
                for(let i=0; i<response.svr_file_names.length; i++){
                    formData.append('files', response.svr_file_names[i]);
                    formData.append('file_names', response.up_file_names[i]);
                }
                await axios.put('./api/accountPopupContents/'+vm.accountId, formData)
                    .then(function(res){
                        vm.item.itemContents = res.data.itemContents;
                        vm.item.attached_files = res.data.attached_files;
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
            this.mode = "view";
        },
        async copyContentsBelow(){
            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/copyChildAccountPopupContents/'+vm.accountId, null)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.mode = "view";
        },
        openCopyToModal(){
            this.destination_id = "";
            this.copyToModal = true;
        },
        closeCopyToModal(){
            this.destination_id = "";
            this.copyToModal = false;
        },
        async copyContentsTo(){
            this.showProgressModal = true;
            var vm = this;
            var destination = { id : this.destination_id };
            await axios.put('./api/copyToAccountPopupContents/'+vm.accountId, destination)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.copyToModal = false;
            this.mode = "view";
        },
        async file_download(file_id, file_name){
            var vm = this;
            var config = {
                responseType: 'blob',
                cancelToken: cancelTokenSource.token,
                onDownloadProgress: function(progressEvent) {
                    vm.dprogress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            };
            await axios.get('./api/download/'+file_id, config)
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){ vm.errcheck = err;  });
            vm.dprogress = 0;
        },
        cancelDownload(){
            cancelTokenSource.cancel();
            cancelTokenSource = axios.CancelToken.source();
        },
    },
    computed:{
        markedSize(){
            return (data) => {
                var fsize = "";
                if (data < 1024) fsize = data + " B";
                else if (data < 1024 * 1024) fsize = parseInt (data / 1024) + " KB";
                else if (data < 1024 * 1024 * 1024) fsize = parseInt (data / (1024 * 1024)) + " MB";
                else fsize = parseInt (data / (1024 * 1024 * 1024)) + " GB";
                return fsize;
            };
        },
    }
}
</script>