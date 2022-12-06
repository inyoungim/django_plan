<template>
    <div class="col" >
        <div v-show="mode == 'modify'" class="col">
            <div id="keditor_asset_inspection" name="contents" required>
                <note-contents v-html="itemContents"></note-contents>
            </div>
        </div>
        <div v-show="mode != 'modify'" class="col">
            <div v-if="itemContents == ''"class="form-control text-center">There is no data.</div>
            <div v-else class="form-control" style="min-height:200px; overflow:auto;">
                <note-contents v-html="itemContents"></note-contents>
            </div>
        </div>
    </div>
    <div class="col text-end my-1">
        <div v-if="mode != 'modify' && this.$props.acl >= 7" class="ms-auto">
            <div class="btn btn-darkblue" style="width:80px;padding:0.1em 0.5em;" @click="modifyContents">Modify</div>
        </div>
        <div v-else-if="this.$props.acl >= 7" class="ms-auto">
            <div class="btn btn-darkblue col me-1" style="width:80px;padding:0.1em 0.5em;" @click="updateContents">Update</div>
            <div class="btn btn-darkblue col" style="width:80px;padding:0.1em 0.5em;" @click="cancelContents">Cancel</div>
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
    props : ['site','lang','div_name','acl'],
    data(){
        return {
            mode : "view",
            itemContents : "",
            showProgressModal : false,
            keditor : null,
        }
    },
    mounted(){
        this.loadData();
    },
    watch : {
        div_name(nVal){
            this.loadData();
        }
    },
    methods : {
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_asset_inspection";
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
            await axios.get('./api/inspectionMailingContents', { params:{ div_name: vm.$props.div_name } })
                .then(function(res){
                    vm.itemContents = res.data.itemContents;
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
            this.loadData();
        },
        async updateContents(){
            this.showProgressModal = true;
            var vm = this;
            var data = {}
            data.div_name = this.$props.div_name;
            data.itemContents = this.keditor.getHtml();
            await axios.put('./api/inspectionMailingContents', data)
                .then(function(res){
                    vm.itemContents = res.data.itemContents;
                })
                .catch(function(err){
                    vm.showProgressModal = false;
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.mode = "view";
        },
    },
}
</script>

