<template>
    <div class="hstack border-bottom border-primary">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <i class="bi bi-grid-3x3-gap-fill text-primary px-2"></i>
            <b>Preload Contents Management</b>
        </div>
    </div>
    <div class="col" >
        <div v-show="mode == 'contents_modify'" class="col">
            <div id="keditor_wrapper_2" name="contents" required>
                <note-contents v-html="itemContents"></note-contents>
            </div>
        </div>
        <div v-show="mode != 'contents_modify'" class="col">
            <div v-if="itemContents == ''"class="form-control text-center">There is no data.</div>
            <div v-else class="form-control" style="max-height:200px; overflow:auto;">
                <note-contents v-html="itemContents"></note-contents>
            </div>
        </div>
    </div>
    <div class="col text-end my-1">
        <div v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="d-flex">
            <div v-if="this.$props.acl >= 9" class="btn btn-danger me-1"
                 style="padding:0.1em 0.5em;" @click="openCopyToModal('contents')">Copy to ...</div>
            <div class="btn btn-success me-auto" style="padding:0.1em 0.5em;" @click="copyContentsBelow">Copy to Below</div>

            <div class="btn btn-darkblue" style="width:80px;padding:0.1em 0.5em;" @click="modifyContents">Modify</div>
            <div class="btn btn-danger ms-1" style="min-width:80px;padding:0.1em 0.5em;" @click="deleteContents">Delete</div>
        </div>
        <div v-else-if="this.$props.acl >= 7">
            <div class="btn btn-darkblue col me-1" style="width:80px;padding:0.1em 0.5em;" @click="updateContents">Update</div>
            <div class="btn btn-darkblue col" style="width:80px;padding:0.1em 0.5em;" @click="cancelContents">Cancel</div>
        </div>
    </div>

    <div class="col my-2" style="height:20px;"></div>

    <div class="hstack border-bottom border-primary">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <i class="bi bi-grid-3x3-gap-fill text-primary px-2"></i>
            <b>Account Option Column</b>
        </div>
        <div class="ms-auto col-auto">
            <input class="form-check-input" type="checkbox" v-model="showInterfaceColumn">
            Interface Column
        </div>
    </div>
    <div class="table-responsive m-0 p-0">
        <table class="table table-hover table-bordered m-0">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center" width="50px">No</th>
                    <th v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="py-1 text-center" width="50px">
                        <i class="bi bi-arrow-up"></i>
                        <i class="bi bi-arrow-down"></i>
                    </th>
                    <th class="py-1 text-center" width="20px">
                        <span class="badge small p-0">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                        </span>
                    </th>
                    <th class="py-1 text-start" width="150px">Name</th>
                    <th v-if="showInterfaceColumn" class="py-1 text-start">Interface</th>
                    <th class="py-1 text-start">Data</th>
                </tr>
            </thead>
            <tbody v-for="item in itemList">
                <tr class="bg-opacity-25" style="cursor:pointer"
                    :class="{'bg-warning': selectedColumn.id == item.id}"
                    @click="selectedColumn = item" @dblclick="modifyColumn">
                    <td class="py-1 text-center">{{item.order_no}}</td>
                    <td v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="py-1 text-center">
                        <div>
                            <i class="bi bi-arrow-up" @click="moveUpColumn(item)"></i>
                            <i class="bi bi-arrow-down" @click="moveDownColumn(item)"></i>
                        </div>
                    </td>
                    <td class="py-1 text-center">
                        <input class="form-check-input" type="checkbox" v-model="item.column_required" disabled>
                    </td>
                    <td class="py-1 text-start">{{item.column_name}}</td>
                    <td v-if="showInterfaceColumn" class="py-1 text-start">{{item.column_interface}}</td>
                    <td class="py-1 text-start">{{item.column_data}}</td>
                </tr>
                <tr v-if="item.column_guide" class="bg-opacity-25" style="cursor:pointer"
                    :class="{'bg-warning': selectedColumn.id == item.id}" @click="selectedColumn = item">
                    <td colspan="6" class="m-0 pe-2 pb-2 text-end text-success">
                        {{item.column_guide}}
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
    <div class="col text-end my-1">
        <div v-if="mode != 'contents_modify' && this.$props.acl >= 7" class="d-flex">
            <div v-if="this.$props.acl >= 9" class="btn btn-danger me-1"
                 style="padding:0.1em 0.5em;" @click="openCopyToModal('column')">Copy to ...</div>
            <div class="btn btn-success me-auto" style="padding:0.1em 0.5em;" @click="copyColumnBelow">Copy to Below</div>

            <div class="btn btn-darkblue me-1" style="width:80px;padding:0.1em 0.5em;" @click="newColumn">Add</div>
            <div class="btn btn-darkblue me-1" style="width:80px;padding:0.1em 0.5em;" @click="modifyColumn">Modify</div>
            <div class="btn btn-danger me-1" style="width:80px;padding:0.1em 0.5em;" @click="deleteColumn">Delete</div>
            <div class="btn btn-danger" style="min-width:80px;padding:0.1em 0.5em;" @click="deleteColumnAll">Delete All</div>
        </div>
    </div>

    <!-- Account Option Column Management Modal -->
    <div v-if="mode == 'column_new' || mode == 'column_modify' || mode == 'column_delete'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Account Option Column </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="mode='view'"></button>
                </div>
                <div class="modal-body" style="min-height:100px;">
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Name</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Name" v-model="targetItem.column_name">
                        <button class="input-group-text" @click="accountOptionColumnModal=true">
                            <i class="bi bi-search"></i>
                        </button>

                        <label class="input-group-text" style="width:100px;">
                            <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                            <b>Mandatory</b>
                        </label>
                        <div class="input-group-text bg-white">
                            <input class="form-check-input" type="checkbox" v-model="targetItem.column_required">
                        </div>
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Interface</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Data" v-model="targetItem.column_interface" :disabled="this.$props.acl < 9">
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Data</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Data" v-model="targetItem.column_data">
                    </div>
                    <div class="input-group mt-1">
                        <label class="input-group-text" style="width:100px;"><b>Guide</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Guide" v-model="targetItem.column_guide">
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div v-if="mode == 'column_new'" class="btn btn-primary me-4" style="width:100px;"
                             @click="submitFormModal">Submit</div>
                        <div v-if="mode == 'column_new'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Close</div>

                        <div v-if="mode == 'column_modify'" class="btn btn-primary me-4" style="width:100px;"
                             @click="updateFormModal">Update</div>
                        <div v-if="mode == 'column_modify'" class="btn btn-secondary" style="width:100px;"
                             @click="mode='view'">Cancel</div>
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
                        <div v-if="destination_type=='contents'" class="btn btn-primary me-1"
                             style="width:100px;" @click="copyContentsTo">Confirm</div>
                        <div v-else class="btn btn-primary me-1"
                             style="width:100px;" @click="copyColumnTo">Confirm</div>
                        <div class="btn btn-secondary ms-1" style="width:100px;" @click="closeCopyToModal">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="accountOptionColumnModal" class="col mx-1 my-3">
        <account-option-column-component
                ref="accountOptionColumnComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                @select-target="selectAccountOptionColumn"
                @close-modal="accountOptionColumnModal=false">
        </account-option-column-component>
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
    props : ['site','lang','div_list','acl'],
    components: {
        'account-option-column-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountOptionColumnComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            itemList : [],
            itemContents : "",
            mode : "view",
            accountId : 0,
            selectedColumn : {},
            targetItem : {},
            showProgressModal : "",
            deleteAllColumn : false,
            destination_id : "",
            destination_type : "",
            copyToModal : false,
            accountOptionColumnModal : false,
            showInterfaceColumn : false,
            keditor : null,
        }
    },
    methods : {
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_wrapper_2";
            if(id != null)
                editor_id = "#keditor_wrapper_2"+id;
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
        selectAccountOptionColumn(item){
            this.targetItem.column_name = item.column_name;
            this.targetItem.column_interface = item.column_interface;
            if(!this.targetItem.column_data || this.targetItem.column_data == "")
                this.targetItem.column_data = item.column_data;
        },
        async loadData(accountId){
            this.accountId = accountId;
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/accountOptionContents/'+vm.accountId, null)
                .then(function(res){
                    vm.itemContents = res.data.itemContents;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            await axios.get('./api/accountOptionColumn/'+vm.accountId, null)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        modifyContents(){
            this.mode = "contents_modify";

            this.$nextTick(() => {
                var old_contents = this.itemContents;
                this.kEditorInitial();
                this.keditor.do(function(adapter) {
                    adapter.setHtml( KEditor.getInlineStyleHtml(old_contents) );
                    adapter.getHtml();
                });
            });
        },
        cancelContents(){
            this.mode = "view";
            this.loadData(this.accountId);
        },
        async updateContents(){
            this.showProgressModal = "show";
            var vm = this;
            var data = {}
            data.itemContents = this.keditor.getHtml();
            await axios.put('./api/accountOptionContents/'+vm.accountId, data)
                .then(function(res){
                    vm.itemContents = res.data.itemContents;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        deleteContents(){
            this.mode = "contents_delete";
            confirmModal.show_modal(this);
        },
        openCopyToModal(type){
            if(type == 'contents'){
                this.destination_type = "contents";
            }else{
                this.destination_type = "column";
            }
            this.destination_id = "";
            this.copyToModal = true;
        },
        closeCopyToModal(){
            this.destination_id = "";
            this.copyToModal = false;
        },
        async copyContentsTo(){
            this.showProgressModal = "show";
            var vm = this;
            var destination = { id : this.destination_id };
            await axios.put('./api/copyToAccountOptionContents/'+vm.accountId, destination)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.copyToModal = false;
            this.mode = "view";
        },
        async copyColumnTo(){
            this.showProgressModal = "show";
            var vm = this;
            var destination = { id : this.destination_id };
            await axios.put('./api/copyToAccountOptionColumn/'+vm.accountId, destination)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.copyToModal = false;
            this.mode = "view";
        },
        async copyContentsBelow(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/copyChildAccountOptionContents/'+vm.accountId, null)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        async copyColumnBelow(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/copyChildAccountOptionColumn/'+vm.accountId, null)
                .then(function(res){ warningModal.show_modal(res.data.message); })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        newColumn(){
            this.mode = "column_new";
            this.selectedColumn = {};
            this.targetItem = {};
        },
        modifyColumn(){
            if(this.$props.acl < 7) return;
            if(this.selectedColumn.id){
                this.targetItem = JSON.parse(JSON.stringify(this.selectedColumn));
                this.mode = "column_modify";
            }else{
                warningModal.show_modal("Please, select one column.");
            }
        },
        cancelColumn(){
            this.mode = "view";
            this.loadData(this.accountId);
        },
        async submitFormModal(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.post('./api/accountOptionColumn/'+vm.accountId, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        async updateFormModal(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.put('./api/accountOptionColumn/'+vm.accountId, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                    vm.selectedColumn = {};
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        deleteColumn(){
            if(!this.selectedColumn.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        deleteColumnAll(){
            this.selectedColumn = {};
            this.deleteAllColumn = true;
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;

            if(this.mode == "contents_delete"){
                var data = {}
                data.itemContents = ""
                await axios.put('./api/accountOptionContents/'+vm.accountId, data)
                    .then(function(res){
                        vm.itemContents = res.data.itemContents;
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
                this.mode = "view";
            }else if(vm.selectedColumn.id){
                await axios.delete('./api/accountOptionColumn/'+vm.selectedColumn.id)
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.selectedColumn = {};
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }else if(vm.deleteAllColumn){
                await axios.delete('./api/accountOptionColumnAll/'+vm.accountId)
                    .then(function(res){
                        vm.itemList = res.data.itemList;
                        vm.selectedColumn = {};
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = "";
        },
        async moveUpColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "up";
            await axios.put('./api/accountOptionColumn/'+vm.accountId, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
        async moveDownColumn(item){
            this.showProgressModal = "show";
            var vm = this;
            vm.targetItem = JSON.parse(JSON.stringify(item));
            vm.targetItem.move_to = "down";
            await axios.put('./api/accountOptionColumn/'+vm.accountId, vm.targetItem)
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            this.mode = "view";
        },
    },
}
</script>

