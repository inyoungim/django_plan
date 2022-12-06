<template>

    <div class="modal-body" style="min-height:200px;">
        <div id="form_borrow_contents" class="text-start">
            <div class="row g-1">
                <div class="col">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Type</b></label>
                        <span v-if="this.$props.lang == 'kr'"
                              class="form-control bg-white text-secondary text-start">
                            PV SET 차용 품의
                        </span>
                        <span v-else class="form-control bg-white text-secondary text-start">
                            Request borrow PV SET
                        </span>
                    </div>
                </div>
                <div v-if="mode == 'view'" class="col">
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
                <div class="w-100">
                    <div class="col input-group">
                        <label class="input-group-text" style="width:100px;"><b>Title</b></label>
                        <input class="form-control bg-white" :disabled="mode != 'new' && mode != 'modify'"
                               type="text" name="Title" v-model="item.title" required>
                    </div>
                </div>
            </div>

            <div class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text text-start" style="width:100px;"><b>Sample SET</b></span>
                    <div class="form-control p-1">
                        <borrow-set-list-component
                            ref="borrowSetListComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :pmode="mode"
                            :doc_id="doc_id"
                            :div_name="this.$props.div_name">
                        </borrow-set-list-component>
                    </div>
                </div>
            </div>

            <div class="row mt-1" >
                <div class="col input-group">
                    <span class="input-group-text" style="width:100px;"><b>Content</b></span>
                    <div v-show="mode == 'new' || mode == 'modify'" class="col">
                        <div id="keditor_borrow_cotents" name="contents" required></div>
                    </div>
                    <div v-if="mode != 'new' && mode != 'modify'" class="col">
                        <div class="form-control" style="min-height:200px;"><note-contents v-html="item.contents"></note-contents></div>
                    </div>
                </div>
            </div>

            <div class="row mt-1">
                <div class="input-group">
                    <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                    <div class="col" v-if="mode == 'new' || mode == 'modify'">
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

            <div v-if="this.$props.div_name || doc_id" class="col mt-3">
                <approval-line-component
                            ref="approvalLineComponent"
                            :pmode="mode"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :acl="this.$props.acl"
                            :div_name="this.$props.div_name"
                            :app_type="'borrow'"
                            :appid="doc_id"
                            :preset_item1="this.$props.div_name"
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
    props : ['site','lang','div_name','acl', 'doc_id'],
    components: {
        'borrow-set-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowSetListComponent.vue', vueLoaderOptions) ),
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
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_borrow_cotents";
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
        async loadContents(){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/contents/'+this.doc_id, null )
                .then(function(res){
                    vm.item = res.data;
                    vm.mode = "view";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            if(!this.item.id){
                warningModal.show_modal("Please, refresh data.");
                this.$emit('close-modal');
            }
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
            var requiredElements = document.querySelectorAll("#form_borrow_contents")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }

            var resp = await this.$refs.borrowSetListComponent.validation();
            if(!resp ){
                return false;
            }

            if(! await this.$refs.approvalLineComponent.validateAppLine()){
                return false;
            }
            return true;
        },
        async submitFormMain(method, event){
            if(event) event.preventDefault();
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }else{
                var resp = await this.$refs.borrowSetListComponent.validation();
                if(!resp ){
                    return false;
                }
            }

            var vm = this;
            if(!this.doc_id){
                this.doc_id = 0;
                vm.item.div_name = this.$props.div_name;
            }
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            vm.item.item_list = vm.$refs.borrowSetListComponent.getData();
            this.showProgressModal = true;
            var axios_return = false;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
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

            if(this.$refs.borrowSetListComponent){
                this.$refs.borrowSetListComponent.loadData(vm.item.item_list);
            }
        },
        async updateFormMain(method, event){
            if(event) event.preventDefault();
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }else{
                var resp = await this.$refs.borrowSetListComponent.validation();
                if(!resp ){
                    return false;
                }
            }

            var vm = this;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.item.id);
            vm.item.item_list = vm.$refs.borrowSetListComponent.getData();
            this.showProgressModal = true;
            var axios_return = false;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
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

            if(this.$refs.borrowSetListComponent){
                this.$refs.borrowSetListComponent.loadData(vm.item.item_list);
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
            this.$emit('refresh-data');
        },

    },
    computed:{
    },
}
</script>
