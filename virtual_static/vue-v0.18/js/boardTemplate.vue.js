axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const init_div_list = document.currentScript.getAttribute('div_list');

var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month  + '-' + day;
var today = new Date(dateString);

const boardid = document.currentScript.getAttribute('boardid');
const lang = document.currentScript.getAttribute('lang');

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
        'comments-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/commentsComponent.vue', vueLoaderOptions) ),
        'menu-list-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/menuListComponent.vue', vueLoaderOptions) ),
        'board-move-to-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/boardMoveToComponent.vue', vueLoaderOptions) ),
        'distribution-board-modal-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/distributionBoardModalComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            tdata : {},
            page_num : 10,
            page_mode : "list",
            div_list : [],
            div_name : "",
            active_list : [],
            edit_item : {},
            keditor : null,
            board_reply : false,
            popupModal : false,
            moveToModal : false,
            menuSelectModal : false,
            selectedMenu : {},
            showDistributionModal : false,
            doc_id : 0,
        }
    },
    mounted(){
        if(init_div_list.includes(",")){
            var div_list = init_div_list.split(",");
            for(var i=0; i<div_list.length; i++){
                this.div_list.push(div_list[i]);
            }
        }else{
            this.div_list.push(init_div_list);
        }
        if(this.div_list.length > 1)
            this.div_name = "ALL";
        else
            this.div_name = this.div_list[0];

        if(boardid == null || boardid == '')
            this.page(this.tdata.active_page, this.page_num );
        else
            this.item_detail(boardid);
    },
    methods: {
        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_wrapper";
            if(id != null)
                editor_id = "#keditor_wrapper"+id;
            this.keditor =
                KEditor.build({
                    'instanceId':'1',
                    'wrapper': editor_id,
                    'form':'keditor_form',
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
        // emit function of boardMoveToComponent
        async moveToSelected(){
            var item = this.$refs.boardMoveToComponent.selected_item;
            if(!item.id){
                warningModal.show_modal("Please, select target board!");
                return;
            }
            if(item.board_type != this.active_list[0].board_type){
                warningModal.show_modal("Board type is different!");
                return;
            }
            this.moveToModal = false;
            loadingModalEl.show();
            var vm = this;
            var data = { 'to_bid' : item.id , 'group_id' : vm.active_list[0].group_id };
            await axios.put('./api/moveArticle', data )
                .then(function(res){  })
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
            vm.edit_item = {};
            vm.back_to_list();
        },
        changeDiv(){
            this.search_data();
        },
        async new_page(){
            this.page_mode = "new";
            this.active_list = [];
            this.edit_item = {};
            this.edit_item.div_name = this.div_name;
            this.kEditorInitial();
            this.$nextTick(() => {
                if(this.$refs.attachedFileComponentN){
                    this.$refs.attachedFileComponentN.$props.mode = this.page_mode;
                    this.$refs.attachedFileComponentN.initialize();
                }
            });
        },
        make_reply(item){
            this.page_mode = "reply";
            this.edit_item = {};
            this.edit_item.title = "[RE] " + item.title;
            this.edit_item.div_name = item.div_name;

            this.kEditorInitial();
            var old_contents = item.contents;
            this.keditor.do(function(adapter) {
                adapter.setHtml( KEditor.getInlineStyleHtml(old_contents) );
                adapter.getHtml();
            });

            this.$nextTick(() => {
                if(this.$refs.attachedFileComponentN){
                    this.$refs.attachedFileComponentN.$props.mode = this.page_mode;
                    this.$refs.attachedFileComponentN.initialize();
                }
            });

            var location = document.getElementById("vue3-top-object").scrollHeight;
            window.scrollTo({top: location -100 , behavior:'smooth'});
        },
        async item_detail(item_id){
            this.doc_id = item_id;
            loadingModalEl.show();
            var vm = this;
            vm.active_list = [];
            vm.edit_item = {};
            await axios.get('./api/detail/'+item_id)
                .then(function(res){
                    vm.active_list = res.data;
                    vm.page_mode = "detail";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        form_modify(item, event){
            if(event)
                event.preventDefault();
            this.page_mode = "modify";
            this.edit_item = item;
            this.$nextTick(() => {
                this.kEditorInitial(item.id);
                this.keditor.do(function(adapter) {
                    adapter.setHtml( KEditor.getInlineStyleHtml(item.contents) );
                    adapter.getHtml();
                });
            });
        },
        form_cancel(event){
            if(event)
                event.preventDefault();
            this.item_detail(this.active_list[0].id);
        },
        form_validation(){
            var requiredElements = document.querySelectorAll("form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async form_submit(event){
            if(event)
                event.preventDefault();

            if(this.form_validation())
                return false;

            var vm = this;
            var response = {};
            response = await vm.$refs.attachedFileComponentN.uploadStart(null);

            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                if(vm.page_mode == "new")
                    vm.edit_item.group_id = 0;
                else if(vm.page_mode == "reply")
                    vm.edit_item.group_id = vm.active_list[0].id;

                let formData = new FormData();
                formData.append('div_name', vm.edit_item.div_name)
                formData.append('title', vm.edit_item.title);
                formData.append('group_id', vm.edit_item.group_id);
                formData.append('contents', this.keditor.getHtml());
                // make array data svr_file_names and up_file_names
                for(let i=0; i<response.svr_file_names.length; i++){
                    formData.append('files', response.svr_file_names[i]);
                    formData.append('file_names', response.up_file_names[i]);
                }
                await axios.post('./api/detail/0', formData )
                    .then(function(res){
                        vm.edit_item = {};
                        vm.active_list = res.data;
                        vm.page_mode = "detail";
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }
            loadingModalEl.hide();
        },
        async form_update(event){
            if(event)
                event.preventDefault();
            if(this.form_validation())
                return false;

            var vm = this;
            var response = {};
            response = await vm.$refs.attachedFileComponentM[0].uploadStart(vm.edit_item.id);
            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                if(vm.page_mode == "new")
                    vm.edit_item.group_id = vm.edit_item.id;
                else if(vm.page_mode == "reply")
                    vm.edit_item.group_id = vm.active_list[0].id;

                let formData = new FormData();
                formData.append('div_name', vm.edit_item.div_name)
                formData.append('title', vm.edit_item.title);
                formData.append('group_id', vm.edit_item.group_id);
                if (vm.page_mode == "new" || vm.page_mode == 'reply'){
                    formData.append('contents', this.keditor.getHtml());
                }else{
                    formData.append('contents', this.keditor.getHtml());
                }
                // make array data svr_file_names and up_file_names
                for(let i=0; i<response.svr_file_names.length; i++){
                    formData.append('files', response.svr_file_names[i]);
                    formData.append('file_names', response.up_file_names[i]);
                }
                await axios.put('./api/detail/'+vm.edit_item.id, formData )
                    .then(function(res){
                        vm.edit_item = {};
                        vm.active_list = res.data;
                        vm.page_mode = "detail";
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }
            loadingModalEl.hide();
        },
        form_delete(item,event){
            if(event)
                event.preventDefault();
            this.edit_item = item;
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/detail/'+vm.edit_item.id, { params:{ div_name : vm.div_name } } )
                .then(function(res){
                    vm.edit_item = {};
                    vm.back_to_list();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async page(num, page_num, event){
            if(event)
                event.preventDefault();
            document.activeElement.blur();
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/list', {
                    params:{
                        div_name : vm.div_name,
                        active_page: num ,
                        page_num : page_num,
                        search_text : vm.tdata.search_text,
                    }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.page_mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        search_data(event){
            if(event)
                event.preventDefault();
            this.page(this.tdata.active_page, this.page_num );
        },
        back_to_list(event){
            if(event)
                event.preventDefault();
            this.page(this.tdata.active_page, this.page_num );
        },
        make_link_info(event){
            if(event)
                event.preventDefault();

            obj = eval("infolinkid");
            obj.style.display = "inline";

            var selection = document.getSelection();
            var text = document.createRange();
            text.selectNode(obj);
            selection.removeAllRanges();
            selection.addRange(text);
            document.execCommand('copy')
            obj.style.display = "none";

            warningModal.show_modal("Copied information link.<br>Paste it in what you want.");
        },
        showPopupModal(){
            this.popupModal=true;
            this.edit_item = JSON.parse(JSON.stringify(this.active_list[0]));
            if(!this.edit_item.popup.div_name){
                this.edit_item.popup.div_name = this.edit_item.div_name;
            }
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    var date = e.target.getElementsByTagName('input')[0].value;
                    if(e.target.id == "sdate")
                        vm.edit_item.popup.popup_sdate = date;
                    if(e.target.id == "edate")
                        vm.edit_item.popup.popup_edate = date;
                });
            });
        },
        showMoveToModal(){
            this.moveToModal=true;
        },
        openMenuSelectModal(event){
            if(event) event.preventDefault();
            this.menuSelectModal = true;
        },
        // emit for menuSelectModal
        menuSelected(item){
            this.selectedMenu = item;
        },
        targetMenuSelect(){
            this.edit_item.popup.target_id = this.selectedMenu.id;
            this.edit_item.popup.target_menu = this.selectedMenu.name;
            this.menuSelectModal = false;
        },
        targetMenuCancel(){
            this.menuSelectModal = false;
        },
        async popupUpdate(event){
            if(event) event.preventDefault();
            this.edit_item.popup.popup_sdate = this.$refs.sdate.value;
            this.edit_item.popup.popup_edate = this.$refs.edate.value;
            if(this.edit_item.popup.div_name == ""){
                warningModal.show_modal("Please input target division.");
                return;
            }
            if(this.edit_item.popup.popup_sdate == ""){
                warningModal.show_modal("Please input Start Date.");
                return;
            }
            if(this.edit_item.popup.target_id == ""){
                warningModal.show_modal("Please input End Date.");
                return;
            }
            if(!this.edit_item.popup.target_id || this.edit_item.popup.target_id == ""){
                warningModal.show_modal("Please select a Target (id and menu )");
                return;
            }
            loadingModalEl.show();
            var vm = this;
            await axios.put('./api/updatePopup/'+this.edit_item.id, this.edit_item.popup)
                .then(function(res){
                    vm.active_list[0].popup = res.data.popup;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
            this.popupModal=false;
        },
        async popupClear(event){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/updatePopup/'+this.edit_item.id, null)
                .then(function(res){
                    vm.active_list[0].popup = {};
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
            this.popupModal=false;
        },
        async distributeFormMain(event){
            if(event) event.preventDefault();
            this.doc_id =
            this.showDistributionModal = true;
        },
    },
    computed:{
        previous_text_color(){
            if( this.tdata.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.tdata.next_page == 0 )
                return "#ddd";
        },
        attached_icon(){
            return(num) =>{
                if(num > 0)
                    return "<i class='bi bi-paperclip'></i>";
                return "";
            }
        },
        url_link(){
            if(this.active_list.length > 0)
                return "?boardid=" + this.active_list[0].id ;
            return "";
        },
        info_title(){
            if(this.active_list.length > 0)
                return this.active_list[0].title ;
            return "";
        },
        isInvalid(){
            return(item) => {
                var sdate = new Date(item.popup.popup_sdate);
                var edate = new Date(item.popup.popup_edate);
                if( sdate <= today && today <= edate)
                    return false;
                return true;
            }
        },
    },
})

app.mount('#vue3-top-object');

