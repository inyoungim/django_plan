<template>

    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Budget Planning Guideline</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body text-start" style="min-height:150px;">

                    <div v-show="mode == 'modify'" class="col">
                        <div id="keditor_account_popup" name="contents" required>
                            <note-contents v-html="item.itemContents"></note-contents>
                        </div>
                    </div>
                    <div v-show="mode != 'modify'" class="col">
                        <div v-if="item.itemContents == ''" class="form-control text-center" style="height:200px;">
                            <span class="align-middle">There is no data.</span>
                        </div>
                        <div v-else class="form-control" style="min-height:200px; overflow:auto;">
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
                <div class="modal-footer">
                    <div v-if="mode == 'modify'" class="col text-center">
                        <div class="btn btn-primary mx-1" style="width:80px;" @click="updateContents">Update</div>
                        <div class="btn btn-secondary mx-1" style="width:80px;" @click="cancelContents">Cancel</div>
                    </div>
                    <div v-else class="col text-center">
                        <div v-if="this.$props.acl >= 7"
                             class="btn btn-primary mx-1" style="width:80px;" @click="modifyContents">Modify</div>
                        <div class="btn btn-secondary mx-1" style="width:80px;" @click="closeModal">Close</div>
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
    props : ['site','lang','acl','div_name','year'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            item : {},
            mode : "view",
            showProgressModal : false,
            keditor : null,
        }
    },
    mounted(){
        this.loadData();
    },
    methods : {
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_account_popup";
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
        async loadData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/guidelineContents',
                    { params:{ div_name:vm.$props.div_name, year:vm.$props.year } })
                .then(function(res){
                    vm.item.id = res.data.id;
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
        cancelContents(){
            this.mode = "view";
            this.loadData();
        },
        closeModal(){
            this.$emit('close-modal');
        },
        async updateContents(){
            this.showProgressModal = true;
            var vm = this;
            var data = {}

            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(this.item.id);
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                let formData = new FormData();
                formData.append('div_name', vm.$props.div_name);
                formData.append('year', vm.$props.year);
                formData.append('itemContents', this.keditor.getHtml());
                // make array data svr_file_names and up_file_names
                for(let i=0; i<response.svr_file_names.length; i++){
                    formData.append('files', response.svr_file_names[i]);
                    formData.append('file_names', response.up_file_names[i]);
                }
                await axios.put('./api/guidelineContents', formData)
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
    }
}
</script>