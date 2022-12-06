<template>
    <div class="modal-body" style="min-height:200px;">
        <div id="form_asset_contents" class="text-start">
            <div class="row g-1">
                <div class="col-3">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Type</b></label>
                        <select class="form-select py-1"
                                v-model="item.item_type" :disabled="mode != 'new'" @change="changeType">
                            <option value="Registration">
                                <span v-if="this.$props.lang == 'kr'">자산 등록</span>
                                <span v-else>Registration</span>
                            </option>
                            <option value="Transfer">
                                <span v-if="this.$props.lang == 'kr'">자산 이관</span>
                                <span v-else>Transfer</span>
                            </option>
                            <option value="Disuse">
                                <span v-if="this.$props.lang == 'kr'">자산 폐기</span>
                                <span v-else>Disuse</span>
                            </option>
                            <option value="Dispatch">
                                <span v-if="this.$props.lang == 'kr'">샘플 발송</span>
                                <span v-else>Sample Dispatch</span>
                            </option>
                            <option value="Missing">
                                <span v-if="this.$props.lang == 'kr'">분실 품의</span>
                                <span v-else>Missing</span>
                            </option>
                            <option v-if="this.$props.acl >= 7" value="Delete">
                                <span v-if="this.$props.lang == 'kr'">전산 폐기</span>
                                <span v-else>Delete</span>
                            </option>
                        </select>
                    </div>
                </div>
                <div v-if="mode != 'new'" class="col">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Creator</b></label>
                        <span v-if="this.$props.lang == 'kr'" class="form-control bg-white text-secondary">
                            {{ item.user_name }} | {{ item.user_org }}
                        </span>
                        <span v-else class="form-control bg-white text-secondary">
                            {{ item.user_name_en }} | {{ item.user_org_en }}
                        </span>

                        <div v-if="next_app_line.admin" class="ms-1">
                            <button class="btn btn-danger" @click="deleteFormMain">Delete All Data</button>
                        </div>
                    </div>
                </div>
                <div class="col-12">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Title</b></label>
                        <input class="form-control bg-white" :disabled="mode != 'new' && mode != 'modify'"
                               type="text" name="Title" v-model="item.title" required>
                    </div>
                </div>
            </div>

            <div v-if="item.item_type =='Registration' " class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text text-start" style="width:100px;"><b>Registration<br>Items</b></span>
                    <div class="form-control p-1">
                        <asset-execution-item-list-component
                            ref="assetExecutionItemListComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :div_name="this.$props.div_name"
                            :pmode="mode"
                            :app_type="this.$props.app_type"
                            :doc_id="doc_id"
                            :item_type="item.item_type"
                            @reload-appline="loadAppline">
                        </asset-execution-item-list-component>
                    </div>
                </div>
            </div>
            <div v-else-if="item.item_type =='Transfer' " class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text text-start" style="width:100px;"><b>Transfer<br>Items</b></span>
                    <div class="form-control p-1">
                        <asset-transfer-item-list-component
                            ref="assetTransferItemListComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :div_name="this.$props.div_name"
                            :pmode="mode"
                            :app_type="this.$props.app_type"
                            :doc_id="doc_id"
                            :item_type="item.item_type"
                            @reload-appline="loadAppline">
                        </asset-transfer-item-list-component>
                    </div>
                </div>
            </div>
            <div v-else-if="item.item_type =='Disuse' || item.item_type =='Delete' || item.item_type =='Dispatch' || item.item_type =='Missing'"
                 class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text text-start" style="width:100px;"><b>{{item.item_type}}<br>Items</b></span>
                    <div class="form-control p-1">
                        <asset-disuse-item-list-component
                            ref="assetDisuseItemListComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :div_name="this.$props.div_name"
                            :pmode="mode"
                            :app_type="this.$props.app_type"
                            :doc_id="doc_id"
                            :item_type="item.item_type"
                            @reload-appline="loadAppline">
                        </asset-disuse-item-list-component>
                    </div>
                </div>
            </div>

            <div class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text" style="width:100px;"><b>Content</b></span>
                    <div v-show="mode == 'new' || mode == 'modify'" class="col">
                        <div id="keditor_asset_contents" name="contents" required></div>
                    </div>
                    <div v-if="mode != 'new' && mode != 'modify'" class="col">
                        <div class="form-control" style="min-height:200px;"><note-contents v-html="item.contents"></note-contents></div>
                    </div>
                </div>
            </div>

            <div class="row mt-1">
                <div class="input-group">
                    <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                    <div class="col vstack" v-if="mode == 'new' || mode == 'modify'">
                        <div v-if="item.item_type == 'Disuse'" class="border border-bottom-0 p-2">
                            <span v-if="this.$props.lang == 'kr'">
                                1. 현물이 보유중인 물품은 "현물보유 폐기양식"만 작성하여 첨부
                                    (첨부 양식 :
                                        <a href="#" class="link-primary text-decoration-none"
                                            @click="reference_file_download('reference_disposal_asset_template.ppt')">현물보유_폐기양식.ppt</a>)
                            </span>
                            <span v-else>
                                1. For missing, attach file of "Lost Inspector".
                                    (Template file :
                                        <a href="#" class="link-primary text-decoration-none"
                                            @click="reference_file_download('reference_disposal_asset_template.ppt')">Disposal_asset_template.ppt</a>)
                            </span>
                        </div>
                        <div v-if="item.item_type == 'Dispatch'" class="border border-bottom-0 p-2">
                            <span v-if="this.$props.lang == 'kr'">
                                1. 사외로 송부한 샘플은 "Sample PO 내용" 첨부<br>
                            </span>
                            <span v-else>
                                1. For dispatch, attach file about "Sample PO".
                            </span>
                        </div>
                        <div v-if="item.item_type == 'Missing'" class="border border-bottom-0 p-2">
                            <span v-if="this.$props.lang == 'kr'">
                                1. 분실된 자산은 "분실 경위서"를 작성하여 첨부
                                    (첨부 양식 :
                                        <a href="#" class="link-primary text-decoration-none"
                                            @click="reference_file_download('reference_lost_inspector_template.ppt')">분실_경위서.ppt</a>)
                            </span>
                            <span v-else>
                                1. For dispatch, attach file about "Sample PO".
                                2. For missing, attach file of "Lost Inspector".
                                    (Template file :
                                        <a href="#" class="link-primary text-decoration-none"
                                            @click="reference_file_download('reference_lost_inspector_template.ppt')">Lost_inspector_template.ppt</a>)
                            </span>
                        </div>

                        <attached-file-component
                                ref="attachedFileComponent"
                                :attached_list="item.attached_files"
                                :mode="mode">
                        </attached-file-component>
                    </div>
                    <div class="col" v-else-if="item.attached_files">
                        <attached-file-component
                                :attached_list="item.attached_files">
                        </attached-file-component>
                    </div>
                </div>
            </div>

            <div v-if="this.$props.div_name" class="col mt-3">
                <approval-line-component
                            ref="approvalLineComponent"
                            :pmode="mode"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :div_name="this.$props.div_name"
                            :app_type="this.$props.app_type"
                            :appid="doc_id"
                            :preset_item1="this.$props.div_name"
                            :preset_item2="item.item_type"
                            @load-complete="applineLoaded"
                            @valid-ok="applineValidatedOk"
                            @active-appline="activeAppline" >
                    </approval-line-component>
            </div>


        </div>
    </div>
    <div class="modal-footer">
        <div v-if="mode == 'new'" class="col text-center my-2">
            <button class="btn btn-primary ms-2" style="width:100px;" @click="submitFormMain('request',$event)">Request</button>
            <button class="btn btn-primary ms-2" style="width:100px;" @click="submitFormMain('save',$event)">Save</button>
            <button class="btn btn-secondary ms-2" style="width:100px;" @click="closeFormMain">Close</button>
        </div>
        <div v-else-if="mode == 'modify'" class="col text-center my-2">
            <button class="btn btn-primary ms-2" style="width:100px;" @click="updateFormMain('request',$event)">Request</button>
            <button class="btn btn-primary ms-2" style="width:100px;" @click="updateFormMain('save',$event)">Save</button>
            <button class="btn btn-secondary ms-2" style="width:100px;" @click="cancelFormMain">Cancel</button>
        </div>
        <div v-else-if="mode == 'view' && next_app_line.step == 0 && (next_app_line.active || next_app_line.admin)"
            class="col text-center my-2">
            <button class="btn btn-primary ms-2" style="width:100px;" @click="modifyFormMain">Modify</button>
            <button class="btn btn-danger ms-2" style="width:100px;" @click="deleteFormMain">Delete</button>
            <button class="btn btn-secondary ms-2" style="width:100px;" @click="closeFormMain">Close</button>
        </div>
        <div v-if="next_app_line.step >=90" class="col text-center my-2">
            <button class="btn btn-primary ms-2" style="min-width:100px;"
                            @click="distributeFormMain">Distribute</button>
            <button class="btn btn-secondary ms-2 " style="width:100px;" @click="closeFormMain">Close</button>
        </div>
    </div>

    <div v-if="showDistributionModal" class="col">
        <distribution-modal-component
            ref="distributionModalComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :doc_id="doc_id"
            @close-modal="showDistributionModal=false">
        </distribution-modal-component>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal" class="vue_modal" style="z-index: 9991;">
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
    props : ['site','lang','div_name','acl','app_type','doc_id'],
    components: {
        'asset-execution-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetExecutionItemListComponent.vue', vueLoaderOptions) ),
        'asset-transfer-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetTransferItemListComponent.vue', vueLoaderOptions) ),
        'asset-disuse-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetDisuseItemListComponent.vue', vueLoaderOptions) ),
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
        'approval-line-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalLineComponent.vue', vueLoaderOptions) ),
        'distribution-modal-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/distributionModalComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            doc_id : this.$props.doc_id,
            item : {},
            next_app_line : {},
            contentsModal : false,
            managementModal : false,
            showProgressModal : false,
            showDistributionModal : false,
            keditor : null,
        }
    },
    mounted(){
        if(this.doc_id && this.doc_id > 0){
            this.loadContents();
        }else{
            this.mode = "new";
            this.item = {"item_type": "Registration" };
            this.kEditorInitial();
        }
    },
    methods: {
        // emit function of approvalLineComponent
        applineLoaded(nextAppline, applines){
            this.next_app_line.step = nextAppline.step;
            this.next_app_line.active = nextAppline.active;
            this.next_app_line.owner = nextAppline.isOwner;
            this.next_app_line.admin = nextAppline.admin;
        },
        // emit function of assetExecutionItemListComponent, assetTransferItemListComponent, assetDisuseItemListComponent
        async loadAppline(item_list){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            var item = { "mode": this.mode, "div_name": this.$props.div_name,
                "item_type" : this.item.item_type, "item_list" : item_list };
            var response_appline = [];
            await axios.put('./api/loadPresetAppline/'+this.doc_id, item )
                .then(function(res){
                    response_appline = res.data.app_preset_line;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            if(response_appline && response_appline.length > 0)
                this.$refs.approvalLineComponent.changeApplines(response_appline);
        },
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_asset_contents";
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
        async changeType(){
            if(this.$refs.approvalLineComponent){
                this.$refs.approvalLineComponent.setPresetItem2(this.item.item_type);
                this.$nextTick(() => {
                    this.$refs.approvalLineComponent.loadData(this.mode);
                });
            }
        },
        async loadContents(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/contents/'+this.doc_id, null )
                .then(function(res){
                    vm.item = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            if(this.$refs.assetExecutionItemListComponent){
                this.$refs.assetExecutionItemListComponent.doc_id = vm.doc_id;
                await this.$refs.assetExecutionItemListComponent.loadData();
            }
            vm.mode = "view";
        },
        modifyFormMain(){
            this.mode = "modify";

            this.$nextTick(() => {
                var old_contents = this.item.contents;
                this.kEditorInitial();
                this.keditor.do(function(adapter) {
                    adapter.setHtml( KEditor.getInlineStyleHtml(old_contents) );
                    adapter.getHtml();
                });
            });
        },
        cancelFormMain(event){
            if(event) event.preventDefault();
            this.mode = "view";
            this.loadContents();
            this.$refs.approvalLineComponent.cancelModifyAppLine();
        },
        closeFormMain(){
            this.$emit('close-modal');
        },
        async distributeFormMain(event){
            if(event) event.preventDefault();
            this.showDistributionModal = true;
        },
        async main_form_validation(){
            var requiredElements = document.querySelectorAll("#form_asset_contents")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            if(this.$refs.assetDisuseItemListComponent){
                if(! await this.$refs.assetDisuseItemListComponent.validation()){
                    return false;
                }
            }

            if(! await this.$refs.approvalLineComponent.validateAppLine()){
                return false;
            }
            if(this.item.item_type == "Missing" && this.$refs.attachedFileComponent.file_list.length == 0){
                if(this.$props.lang == 'kr')
                    warningModal.show_modal("자산 분실 경위서를 첨부 해주시기 바랍니다.");
                else
                    warningModal.show_modal("Please attach one or more evidence file.");
                return false;
            }
            if( (this.item.item_type == "Disuse" || this.item.item_type == "Dispatch")
                && this.$refs.attachedFileComponent.file_list.length == 0){
                if(this.$props.lang == 'kr')
                    warningModal.show_modal("자산 폐기양식을 첨부 해주시기 바랍니다.");
                else
                    warningModal.show_modal("Please attach one or more evidence file.");
                return false;
            }

            return true;
        },
        async submitFormMain(method, event){
            if(event) event.preventDefault();
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }

            var vm = this;
            if(!this.doc_id){
                this.doc_id = 0;
                vm.item.div_name = this.$props.div_name;
            }
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            this.showProgressModal = true;
            var axios_return = false;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                if(this.item.item_type == "Registration"){
                    this.item.item_list = this.$refs.assetExecutionItemListComponent.item_list;
                }else if(this.item.item_type == "Transfer"){
                    this.item.item_list = this.$refs.assetTransferItemListComponent.item_list;
                }else{
                    this.item.item_list = this.$refs.assetDisuseItemListComponent.item_list;
                }

                vm.item.contents = this.keditor.getHtml();
                vm.item.attache_files = [];
                vm.item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.item.attache_files.push(response.svr_file_names[i]);
                    vm.item.attache_file_names.push(response.up_file_names[i]);
                }
                await axios.post('./api/contents/'+vm.doc_id , vm.item )
                    .then(function(res){
                        vm.item = res.data;
                        vm.doc_id = vm.item.id;
                        axios_return = true;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }

            if(axios_return){
                await this.$refs.approvalLineComponent.updateAppLine('checkpass');
                if(method == "request")
                    await this.$refs.approvalLineComponent.confirmApproval();
                this.mode = "view";
                this.$emit('update-document-id',vm.doc_id);
            }
            this.showProgressModal = false;

            if(this.$refs.assetExecutionItemListComponent){
                this.$refs.assetExecutionItemListComponent.doc_id = vm.doc_id;
                await this.$refs.assetExecutionItemListComponent.loadData();
            }
        },
        async updateFormMain(method, event){
            if(event) event.preventDefault();
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }

            var vm = this;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.item.id);
            this.showProgressModal = true;
            var axios_return = false;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                if(this.item.item_type == "Registration"){
                    this.item.item_list = this.$refs.assetExecutionItemListComponent.item_list;
                }else if(this.item.item_type == "Transfer"){
                    this.item.item_list = this.$refs.assetTransferItemListComponent.item_list;
                }else{
                    this.item.item_list = this.$refs.assetDisuseItemListComponent.item_list;
                }

                vm.item.contents = this.keditor.getHtml();
                vm.item.attache_files = [];
                vm.item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.item.attache_files.push(response.svr_file_names[i]);
                    vm.item.attache_file_names.push(response.up_file_names[i]);
                }
                await axios.put('./api/contents/'+vm.doc_id , vm.item )
                    .then(function(res){
                        vm.item = res.data;
                        vm.doc_id = vm.item.id;
                        axios_return = true;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            if(axios_return){
                await this.$refs.approvalLineComponent.updateAppLine('checkpass');
                if(method == "request")
                    await this.$refs.approvalLineComponent.confirmApproval();
                this.mode = "view";
                this.$emit('update-document-id',vm.doc_id);
            }
            this.showProgressModal = false;

            if(this.$refs.assetExecutionItemListComponent){
                this.$refs.assetExecutionItemListComponent.doc_id = vm.doc_id;
                await this.$refs.assetExecutionItemListComponent.loadData();
            }
        },
        deleteFormMain(event){
            if(event) event.preventDefault();
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            await axios.delete('./api/contents/'+vm.doc_id, null)
                .then(function(res){
                    vm.item = {};
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    this.showProgressModal = false;
                    return;
                });
            this.showProgressModal = false;
            this.closeFormMain();
        },
        async reference_file_download(file_name){
            var vm = this;
            var config = { responseType: 'blob', };
            await axios.get('./api/referenceFileDownload/'+file_name, config )
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

    },
    computed:{
    },
}
</script>
