axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');
const lang = document.currentScript.getAttribute('lang');
const year = document.currentScript.getAttribute('year');
const month = document.currentScript.getAttribute('month');
const budget_mode = document.currentScript.getAttribute('budget_mode');
const div_name = document.currentScript.getAttribute('div_name');
const preset_orgid = document.currentScript.getAttribute('preset_orgid');
const doc_id = document.currentScript.getAttribute('doc_id');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
        'work-order-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/workOrderComponent.vue', vueLoaderOptions) ),
        'gerp-result-view-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/gerpResultViewComponent.vue', vueLoaderOptions) ),
        'approval-line-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalLineComponent.vue', vueLoaderOptions) ),
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'organization-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationSelectComponent.vue', vueLoaderOptions) ),
        'account-amount-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountAmountSelectComponent.vue', vueLoaderOptions) ),
        'organization-account-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationAccountSelectComponent.vue', vueLoaderOptions) ),
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
        'account-estimation-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountEstimationInfoComponent.vue', vueLoaderOptions) ),
        'project-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/projectSelectComponent.vue', vueLoaderOptions) ),
        'custom-pno-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assyPartNumberSelectComponent.vue', vueLoaderOptions) ),
        'account-custom-dialog-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/customDialogComponent.vue', vueLoaderOptions) ),
        'pcb-pno-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/pcbPartNumberSelectComponent.vue', vueLoaderOptions) ),
        'pcb-sample-order-list-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/pcbSampleOrderListComponent.vue', vueLoaderOptions) ),
        'budget-execution-result-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionResultComponent.vue', vueLoaderOptions) ),
        'account-list-popup-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListPopupComponent.vue', vueLoaderOptions) ),
        'part-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/partSearchModalComponent.vue', vueLoaderOptions) ),
        'model-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/modelSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetSearchModalComponent.vue', vueLoaderOptions) ),
        'asset-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategorySelectComponent.vue', vueLoaderOptions) ),
        'freight-charge-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/freightChargeSearchModalComponent.vue', vueLoaderOptions) ),
        'budget-execution-mass-upload-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecutionMassUploadComponent.vue', vueLoaderOptions) ),
        'correct-target-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/correctTargetSelectComponent.vue', vueLoaderOptions) ),
        'distribution-modal-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/distributionModalComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "",
            status : "",
            item : {},
            edit_item : {},
            keditor : null,
            account_mode : "view",
            selectAccountItem : {},
            selectedOrgItem : {},
            selectExecutionAccountSummary : {},
            selectTransferAccountSummary : {},
            executionItemFormModal : false,
            accountSummaryInfoModal : false,
            freightChargeSearchModal : false,
            fullView : false,
            showProgressModal : false,
            accountItem : {},
            transferAccountSummary : {},
            accountContents : "",
            applines : [],
            doc_id : doc_id,
            result :{},
            expanPCBInfo:false,
            switchTab : "pcb_cost",
            split_mode : "",
            split_item : {},
            selected_split_item : {},
            popupNoticeModal:true,
            popupExists:false,

            partSearchModal:false,
            maxHeight : 160,
            continue_mode : false,
            showDistributionModal : false,
            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        if(this.doc_id == '0'){
            this.new_page();
            return;
        }
        this.item_detail();
    },
    methods: {
        // emit of ApprovalLineComponent
        applineLoaded(nextAppline, applines){
            this.item.next_appline = nextAppline;
            this.item.applines = applines;
            if(nextAppline.step || nextAppline.active){
                this.item.next_app_step = nextAppline.step;
                this.mode = "view";
            }
        },
        // emit of ApprovalLineComponent
        activeAppline(){
            this.mode = "appline_active";
        },
        // emit of budgetExecutionMassUploadComponent
        massAddEachItem(item_list){
            if(!this.item.execution_item)
                this.item.execution_item = [];

            loadingModalEl.show();
            for(var i=0; i<item_list.length; i++){
                this.item.execution_item.push(item_list[i]);
            }
            loadingModalEl.hide();
            this.loadAccountSummary('preset_applines');
        },
        // emit of correctTargetSelectComponent
        async setCorrectOriginal(item){
            this.accountItem.original_master_id = item.parent;
            this.accountItem.original_id = item.id;
            this.accountItem.original_seq_no = item.seq_no;

            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/budgetExecutionItem/'+item.id, null)
                .then(function(res){
                    vm.accountItem.optionPSC = res.data.optionPSC;
                    vm.accountItem.optionSplit = res.data.optionSplit;
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            loadingModalEl.hide();
        },
        // emit of organizationSelectComponent for cost split
        setSplitOrg(item){
            this.split_item.org_id = item.id;
            this.split_item.nas_code = item.nas_code;
            this.split_item.org_name = item.org_name;
        },
        // emit of externalOrganizationSelectComponent
        extOrgSelected(stype,org){
            this.split_item.org_id = -1;
            this.split_item.nas_code = org.ORGAN;
            this.split_item.org_name = org.OLD_ORGAN_NAME;
        },
        // emit of budgetExecutionResultComponent
        updateResult(){
            if(this.$refs.workOrderComponent){
                this.$refs.workOrderComponent.updateResult();
            }
            console.log("111");
        },

        // initial editor of KEditor
        kEditorInitial(id=null){
            var editor_id = "#keditor_wrapper_be";
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

        contractHeight(){
            this.maxHeight = 160;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        switchFullView(){
            this.fullView = !this.fullView;
            if(this.fullView && this.maxHeight < 10000)
                this.maxHeight = 10000;
        },

        new_page(){
            this.mode = "new";
            var title_init = "";
            if(site == 'hq'){
                title_init = "**월_**실_**팀 ***계정 or ***목적 품의";
            }else{
                title_init = "**Month_**Office_**Team budget execution document of ***Account or ***Purpose";
            }
            this.item = { "item_type" : budget_mode, "div_name":div_name, "title": title_init };
            this.kEditorInitial();
        },
        async item_detail(){
            loadingModalEl.show();
            var vm = this;
            vm.edit_item = {};
            await axios.get('./api/loadContents/'+vm.doc_id, null)
                .then(function(res){    vm.item = res.data; })
                .catch(function(err){   warningModal.show_modal(err);   });
            loadingModalEl.hide();
            this.mode = "view";

            this.loadAccountSummary(null);
        },
        modifyFormMain(event){
            if(event) event.preventDefault();
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
            this.item_detail();
            this.$refs.approvalLineComponent.cancelModifyAppLine();
        },
        closeFormMain(event){
            if(event) event.preventDefault();
            try{
                top.window.close();
            }catch(e){
                window.close();
            }
            window.close();
        },
        async distributeFormMain(event){
            if(event) event.preventDefault();
            this.showDistributionModal = true;
        },
        async main_form_validation(){
            var requiredElements = document.querySelectorAll("form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }

            for (var i = 0; i < this.item.execution_account_summary.length; i++) {
                if(!this.item.execution_account_summary[i].minus_execution_enable &&
                    this.item.execution_account_summary[i].org_id > 0 &&
                    (this.item.execution_account_summary[i].account_available
                        - this.item.execution_account_summary[i].account_execute < 0) ){
                    warningModal.show_modal("Available budget is not enough!");
                    return false;
                }
                if( this.item.execution_account_summary[i].account_transfer > 0 &&
                    (this.item.execution_account_summary[i].account_available
                        - this.item.execution_account_summary[i].account_execute > 10) ){
                    if(lang == "kr"){
                        warningModal.show_modal("전용 예산은 집행 부족 예산 보다 초과 할 수 없습니다.");
                    }else{
                        warningModal.show_modal("Transfer Budget more than execution is not allowed!");
                    }
                    return false;
                }
            }
            for (var j = 0; j < this.item.transfer_account_summary.length; j++) {
                if(this.item.transfer_account_summary[j].from_account_available < 0 ||
                   this.item.transfer_account_summary[j].account_available < 0 ){
                    warningModal.show_modal("Available budget is not enough!");
                    return false;
                }
            }

            if(budget_mode == "Execution"){
                if(!this.item.execution_item){
                    warningModal.show_modal("Please add budget account for execution.");
                    return false;
                }else{
                    if(this.item.execution_item.length == 0){
                        warningModal.show_modal("Please add budget account for execution.");
                        return false;
                    }else{
                        // 자동 추가된 stencil 항목 validation 을 위해
                        for (var i = 0; i < this.item.execution_item.length; i++) {
                            if(this.item.execution_item[i].total_cost == ""
                                && !this.item.execution_item[i].pcb_sample_cost_enable
                                && this.item.execution_item[i].pcb_stencil_cost_enable){
                                warningModal.show_modal("Please, fill out form of Stencil Execution item!");
                                return false;
                            }
                            if(this.item.execution_item[i].total_cost == "" ){
                                warningModal.show_modal("Please, fill out form (make total cost over than 0) of "
                                    + this.item.execution_item[i].account_name +" Execution item!");
                                return false;
                            }
                        }
                    }
                }
            }

            if(! await this.$refs.approvalLineComponent.validateAppLine()){
                return false;
            }
            return true;
        },
        async submitFormMain(method, event){
            if(event) event.preventDefault();
            await this.loadAccountSummary(null);
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }else{
                if(this.item.transfer_account_summary.length == 0){
                    if(this.item.execution_account_summary.length == 0){
                        warningModal.show_modal("Please one or more budget accounts item.");
                        return false;
                    }
                }
                if(budget_mode == "Execution"){
                    if(!this.item.execution_item){
                        warningModal.show_modal("Please add budget account for execution.");
                        return false;
                    }else{
                        if(this.item.execution_item.length == 0){
                            warningModal.show_modal("Please add budget account for execution.");
                            return false;
                        }else{
                            // 자동 추가된 stencil 항목 validation 을 위해
                            for (var i = 0; i < this.item.execution_item.length; i++) {
                                if(this.item.execution_item[i].total_cost == ""
                                    && !this.item.execution_item[i].pcb_sample_cost_enable
                                    && this.item.execution_item[i].pcb_stencil_cost_enable){
                                    warningModal.show_modal("Please, fill out form of Stencil Execution item!");
                                    return false;
                                }
                                if(this.item.execution_item[i].total_cost == "" ){
                                    warningModal.show_modal("Please, fill out form (make total cost over than 0) of "
                                        + this.item.execution_item[i].account_name +" Execution item!");
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.item.item_type = budget_mode;
                vm.item.contents = this.keditor.getHtml();
                // make array data svr_file_names and up_file_names
                vm.item.attache_files = [];
                vm.item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.item.attache_files.push(response.svr_file_names[i]);
                    vm.item.attache_file_names.push(response.up_file_names[i]);
                }
                await axios.post('./api/loadContents/'+vm.doc_id, vm.item )
                    .then(function(res){
                        vm.item = res.data;
                        vm.doc_id = vm.item.id;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            await this.$refs.approvalLineComponent.updateAppLine('checkpass');
            if(method == "request"){
                await this.$refs.approvalLineComponent.confirmApproval();
            }
            this.mode = "view";
            loadingModalEl.hide();
        },
        async updateFormMain(method, event){
            if(event) event.preventDefault();
            await this.loadAccountSummary(null);
            if(method == "request"){
                if(! await this.main_form_validation()) return false;
            }else{
                if(this.item.transfer_account_summary.length == 0){
                    if(this.item.execution_account_summary.length == 0){
                        warningModal.show_modal("Please one or more budget accounts item.");
                        return false;
                    }
                }
                if(budget_mode == "Execution"){
                    if(!this.item.execution_item){
                        warningModal.show_modal("Please add budget account for execution.");
                        return false;
                    }else{
                        if(this.item.execution_item.length == 0){
                            warningModal.show_modal("Please add budget account for execution.");
                            return false;
                        }else{
                            // 자동 추가된 stencil 항목 validation 을 위해
                            for (var i = 0; i < this.item.execution_item.length; i++) {
                                if(this.item.execution_item[i].total_cost == ""
                                    && !this.item.execution_item[i].pcb_sample_cost_enable
                                    && this.item.execution_item[i].pcb_stencil_cost_enable){
                                    warningModal.show_modal("Please, fill out form of Stencil Execution item!");
                                    return false;
                                }
                                if(this.item.execution_item[i].total_cost == "" ){
                                    warningModal.show_modal("Please, fill out form (make total cost over than 0) of "
                                        + this.item.execution_item[i].account_name +" Execution item!");
                                    return false;
                                }
                            }
                        }
                    }
                }
            }

            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(vm.item.id);
            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                //vm.item.item_type = budget_mode;
                vm.item.contents = this.keditor.getHtml();
                // make array data svr_file_names and up_file_names
                vm.item.attache_files = [];
                vm.item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.item.attache_files.push(response.svr_file_names[i]);
                    vm.item.attache_file_names.push(response.up_file_names[i]);
                }
                await axios.put('./api/loadContents/'+vm.doc_id, vm.item )
                    .then(function(res){
                        vm.item = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        loadingModalEl.hide();
                        return;
                    });
            }
            await this.$refs.approvalLineComponent.updateAppLine('checkpass');
            if(method == "request"){
                await this.$refs.approvalLineComponent.confirmApproval();
            }
            this.mode = "view";
            loadingModalEl.hide();
        },
        deleteFormMain(event){
            if(event) event.preventDefault();
            this.delete_item = "main";
            confirmModal.show_modal(this);
        },
        setOrganization(item){
            this.accountItem.org_id = item.id;
            this.accountItem.org_name = item.org_name;
            this.accountItem.nas_code = item.nas_code;
            this.accountItem.au_code = item.au_code;
            this.accountItem.execution_year = item.year;
            this.selectedOrgItem = item;
            if(this.accountItem.account_id){
                this.changeMonth();
                this.loadAccountOptions(this.accountItem.org_id);
            }
        },
        async setAccount(item){
            this.accountItem.account_id = item.id;
            this.accountItem.account_path = item.account_path;
            this.accountItem.account_name = item.account_name;
            this.accountItem.account_code = item.account_code;
            this.accountItem.execution_year = item.execution_year;
            this.accountItem.execution_month = item.execution_month;
            if(this.accountItem.org_id) this.changeMonth();

            if(!this.accountItem.org_id){
                var org_id = 0;
            }else{
                var org_id = this.accountItem.org_id;
            }
            this.loadAccountOptions(org_id);
        },
        async loadAccountOptions(org_id){
            this.executionItemFormModal = true;
            this.switchTab = "pcb_cost";
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+org_id+'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountContents = res.data.accountContents;
                    vm.accountItem.project_code = res.data.project_code;
                    vm.accountItem.project_name = res.data.project_name;
                    vm.accountItem.account_with_project = res.data.account_with_project;
                    vm.accountItem.option = res.data.accountOptions;
                    vm.accountItem.optionPSC = res.data.accountOptionsPSC;
                    vm.accountItem.optionStencil = res.data.accountOptionsStencil;
                    vm.accountItem.optionSplit = res.data.accountOptionsSplit;
                    vm.accountItem.work_order_enable = res.data.work_order_enable;
                    vm.accountItem.business_trip_enable = res.data.business_trip_enable;
                    vm.accountItem.correction_enable = res.data.correction_enable;
                    vm.accountItem.minus_execution_enable = res.data.minus_execution_enable;
                    vm.accountItem.pcb_sample_cost_enable = res.data.pcb_sample_cost_enable;
                    vm.accountItem.custom_dialog = res.data.custom_dialog;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    for(var i=0; i<vm.accountItem.option.length; i++){
                        if(vm.accountItem.option[i].column_name == e.target.id)
                            vm.accountItem.option[i].column_data_value = date;
                    }
                });
            });

            if(this.$refs.accountListPopupComponent){
                this.$refs.accountListPopupComponent.account_id = this.accountItem.account_id;
                this.$refs.accountListPopupComponent.loadPopupData();
            }
        },
        async setOrganizationAndAccount(item){
            if(!item.account_id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            if(item.rght - item.lft > 1){
                warningModal.show_modal("Select a child account!");
                return;
            }
            this.accountItem = item;
            this.executionItemFormModal = true;
            this.switchTab = "pcb_cost";
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountContents = res.data.accountContents;
                    vm.accountItem.project_code = res.data.project_code;
                    vm.accountItem.project_name = res.data.project_name;
                    vm.accountItem.account_with_project = res.data.account_with_project;
                    vm.accountItem.option = res.data.accountOptions;
                    vm.accountItem.optionPSC = res.data.accountOptionsPSC;
                    vm.accountItem.optionStencil = res.data.accountOptionsStencil;
                    vm.accountItem.optionSplit = res.data.accountOptionsSplit;
                    vm.accountItem.work_order_enable = res.data.work_order_enable;
                    vm.accountItem.business_trip_enable = res.data.business_trip_enable;
                    vm.accountItem.correction_enable = res.data.correction_enable;
                    vm.accountItem.minus_execution_enable = res.data.minus_execution_enable;
                    vm.accountItem.pcb_sample_cost_enable = res.data.pcb_sample_cost_enable;
                    vm.accountItem.custom_dialog = res.data.custom_dialog;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;

            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    for(var i=0; i<vm.accountItem.option.length; i++){
                        if(vm.accountItem.option[i].column_name == e.target.id)
                            vm.accountItem.option[i].column_data_value = date;
                    }
                });
            });

            if(this.$refs.accountListPopupComponent){
                this.$refs.accountListPopupComponent.account_id = this.accountItem.account_id;
                this.$refs.accountListPopupComponent.loadPopupData();
            }
        },
        async changeMonth(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountBudgetAmount/'+vm.accountItem.org_id +'/'+ vm.accountItem.account_id,
                    { params:{  year : vm.accountItem.execution_year, month : vm.accountItem.execution_month } } )
                .then(function(res){
                    vm.accountItem.remain_cost = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        async changeMonthFrom(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountBudgetAmount/'+vm.transferAccountSummary.from_org_id +'/'+ vm.transferAccountSummary.from_account_id,
                    { params:{  year : vm.transferAccountSummary.from_account_year, month : vm.transferAccountSummary.from_account_month } } )
                .then(function(res){
                    vm.transferAccountSummary.from_account_remain = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        async changeMonthTo(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountBudgetAmount/'+vm.transferAccountSummary.org_id +'/'+ vm.transferAccountSummary.account_id,
                    { params:{  year : vm.transferAccountSummary.account_year, month : vm.transferAccountSummary.account_month } } )
                .then(function(res){
                    vm.transferAccountSummary.account_remain = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        account_form_validation(){
            var requiredElements = document.querySelector("#account_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async calOptionCost(){
            if(this.accountItem.option.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getOptionCost', vm.accountItem)
                    .then(function(res){
                        vm.accountItem = res.data;
                        vm.auto_calculate_item = JSON.parse(JSON.stringify(vm.accountItem));
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
            }
        },
        resetOptionCost(obj){
            if(!obj.column_interface) return;
            if(obj.column_interface == "") return;
            if(this.accountItem.option){
                for(var at=0; at<this.accountItem.option.length; at++){
                    if(this.accountItem.option[at].column_interface == "TOTAL_COST"){
                        this.accountItem.unit_cost = 0;
                        this.accountItem.total_cost = 0;
                        this.accountItem.option[at].column_data_value = "";
                    }
                }
            }
        },
        async calPCBCost(){
            if(this.accountItem.optionPSC.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getPcbSampleCost', vm.accountItem.optionPSC)
                    .then(function(res){
                        if(res.data.manual){
                            server_message = res.data.message;
                            vm.accountItem.manual = true;
                            vm.accountItem.pcb_sample_cost_calculate = "Manual";
                            for(var at=0; at<vm.accountItem.optionPSC.length; at++){
                                if(vm.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                    vm.accountItem.pcb_sample_cost = 0;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "SAMPLE_QUANTITY"){
                                    vm.accountItem.pcb_sample_qty = parseInt(vm.accountItem.optionPSC[at].column_data_value);
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE2"){
                                    vm.accountItem.pcb_part_number = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE3"){
                                    vm.accountItem.pcb_part_revision = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__ONE_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__HALF_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__STANDARD_DELIVERY"){
                                    vm.accountItem.optionPSC[at].column_data_value = "";
                                }
                            }
                        }else{
                            vm.accountItem.manual = false;
                            vm.accountItem.pcb_sample_cost_calculate = "Auto";
                            for(var at=0; at<vm.accountItem.optionPSC.length; at++){
                                if(vm.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                                    vm.accountItem.pcb_sample_cost = parseInt(res.data.sample_cost);
                                    vm.accountItem.optionPSC[at].column_data_value = vm.accountItem.pcb_sample_cost;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "SAMPLE_QUANTITY"){
                                    vm.accountItem.pcb_sample_qty = parseInt(vm.accountItem.optionPSC[at].column_data_value);
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE2"){
                                    vm.accountItem.pcb_part_number = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "ATTRIBUTE3"){
                                    vm.accountItem.pcb_part_revision = vm.accountItem.optionPSC[at].column_data_value;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__ONE_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.one_panel_count;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__HALF_PANEL_COUNT"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.half_panel_count;
                                }
                                if(vm.accountItem.optionPSC[at].column_interface == "__STANDARD_DELIVERY"){
                                    vm.accountItem.optionPSC[at].column_data_value = res.data.standard_delivery;
                                }
                            }
                        }
                     })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
                if(vm.accountItem.manual)
                    warningModal.show_modal(server_message);

                this.accountItem.split_master_org_id = this.accountItem.org_id;
                this.accountItem.split_master_nas_code = this.accountItem.nas_code;
                this.accountItem.split_master_org_name = this.accountItem.org_name;
                this.updateSplitItem();
            }
        },
        resetPCBCost(obj){
            if(!obj.column_interface)
                return;
            if(obj.column_interface == "")
                return;

            if(this.accountItem.optionPSC){
                for(var at=0; at<this.accountItem.optionPSC.length; at++){
                    if(this.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                        this.accountItem.pcb_sample_cost = 0;
                        this.accountItem.optionPSC[at].column_data_value = "";
                        this.accountItem.manual = false;
                        this.accountItem.pcb_sample_cost_calculate = "";
                    }
                }
            }
        },
        async calStencilCost(){
            if(this.accountItem.optionStencil.length > 0){
                var server_message = "";
                this.showProgressModal = true;
                var vm = this;
                await axios.put('./api/getStencilCost', vm.accountItem.optionStencil)
                    .then(function(res){
                        for(var at=0; at<vm.accountItem.optionStencil.length; at++){
                            if(vm.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                                vm.accountItem.stencil_count = parseInt(res.data.stencil_count);
                                vm.accountItem.stencil_cost = parseInt(res.data.stencil_cost);
                                vm.accountItem.optionStencil[at].column_data_value = vm.accountItem.stencil_cost;
                                vm.accountItem.total_cost = vm.accountItem.stencil_cost;
                            }
                            if(vm.accountItem.optionStencil[at].column_interface == "REQUEST_REMARKS"){
                                vm.accountItem.optionStencil[at].column_data_value = res.data.gpdm_remark;
                            }
                        }
                    })
                    .catch(function(err){
                        vm.showProgressModal = false;
                        warningModal.show_modal(err);
                    });
                this.showProgressModal = false;
            }
        },
        resetStencilCost(obj){
            if(!obj.column_interface)
                return;
            if(obj.column_interface == "")
                return;

            if(this.accountItem.optionStencil){
                for(var at=0; at<this.accountItem.optionStencil.length; at++){
                    if(this.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                        this.accountItem.stencil_cost = 0;
                        this.accountItem.optionStencil[at].column_data_value = "";
                    }
                }
            }
        },
        // emit for accountEstimationInfoComponent.form_validation()
        addPICUser(pic){
            this.applines.push(pic);
        },
        continueExecutionFormModal(){
            this.continue_mode = true;
            this.submitExecutionFormModal();
        },
        copyExecutionFormModal(){
            // column_interface == 'RELATION_COLUMN' 항목이 있을 경우 복사기능 불가
            var copy_gen_item_check = true;
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].column_interface == 'RELATION_COLUMN'){
                    copy_gen_item_check = false;
                    break;
                }
            }
            if(!copy_gen_item_check){
                warningModal.show_modal("Relation Item not allowed copy new item.");
                return false;
            }

            this.account_mode = "new";
            this.continue_mode = false;
            this.executionItemFormModal = true;
            this.switchTab = "pcb_cost";
            this.accountItem = JSON.parse(JSON.stringify(this.selectAccountItem));
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    for(var i=0; i<vm.accountItem.option.length; i++){
                        if(vm.accountItem.option[i].column_name == e.target.id)
                            vm.accountItem.option[i].column_data_value = date;
                    }
                });
            });
            this.loadMasterAccountOption();
        },
        async submitExecutionFormModal(){
            if(this.account_form_validation()) return false;
            if(this.$refs.accountEstimationInfoComponent){
                var estimation_validate = await this.$refs.accountEstimationInfoComponent.form_validation();
                if(!estimation_validate){
                    return false;
                }
            }

            // column_interface == 'TOTAL_COST' 항목이 있을 경우 계산 결과 갱신 여부 확인
            var auto_calculate_check = false;
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].column_interface == 'TOTAL_COST'){
                    auto_calculate_check = true;
                }
            }
            if(auto_calculate_check){
                if(!this.auto_calculate_item){
                    warningModal.show_modal("Please, click Option Calculator button.");
                    return false;
                }
                if(this.auto_calculate_item.unit_count != this.accountItem.unit_count){
                    warningModal.show_modal("Please, click Option Calculator button.");
                    return false;
                }
                for(var i=0; i<this.accountItem.option.length; i++){
                    if(this.accountItem.option[i].column_data_value !=
                        this.auto_calculate_item.option[i].column_data_value){
                        warningModal.show_modal("Please, click Option Calculator button.");
                        return false;
                    }
                }
            }

            var next_accountItem = {};
            if(this.account_mode == 'new' || this.account_mode == 'auto_add'){
                var return_success = await this.validationBudgetSplit();
                if(!return_success) return;

                if(this.accountContents){
                    var old_contents = this.keditor.getHtml();
                    var new_contents = this.accountContents;
                    this.keditor.do(function(adapter){
                        adapter.setHtml( KEditor.getInlineStyleHtml(old_contents) + new_contents );
                        adapter.getHtml();
                    });
                }
                var previousStep = 0;
                for(var a=0; a<this.applines.length; a++){
                    if(this.applines[a].step == previousStep)
                        this.applines[a].new_step = "SAME";
                    else
                        this.applines[a].new_step = "NEXT";
                    this.$refs.approvalLineComponent.mergeAppline(this.applines[a]);
                    previousStep = this.applines[a].step;
                }

                // estimation_data 에 request_pic 가 있을 경우 배포자에 추가
                if(this.accountItem.estimation_data){
                    if(this.accountItem.estimation_data.request_pic){
                        var pic_appline = this.accountItem.estimation_data.request_pic;
                        this.$refs.approvalLineComponent.mergeAppline(pic_appline);
                    }
                }
                // estimation_data 에 request_pic 가 있을 경우 배포자에 추가 끝

            }else if(this.account_mode == 'modify'){
                var return_success = await this.validationBudgetSplit();
                if(!return_success) return;
            }
            await this.loadAccountSummary('preset_applines');

            // column_interface == 'RELATION_ACCOUNT_ID' 항목이 있을 경우 집행 항목 검사 (자동 추가,삭제)
            var auto_gen_item_check = false;
            var auto_gen_item_acc_id = 0;
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].column_interface == 'RELATION_ACCOUNT_ID'){
                    auto_gen_item_check = true;
                    auto_gen_item_acc_id = this.accountItem.option[i].column_data;
                }
            }

            if(this.account_mode == 'new' && auto_gen_item_check){
                this.autoAddItem(this.accountItem, auto_gen_item_acc_id);
            }else if(this.account_mode == 'new' && this.continue_mode){
                // continue_mode 일 경우 this.executionItemFormModal 을 닫지 않고 계속 진행
                this.continue_mode = false;
                return;
            }else{
                if(this.account_mode == 'modify' && auto_gen_item_check){
                    // column_interface == 'RELATION_ACCOUNT_ID' 항목이 있을 경우 RELATION_COLUMN 도 같이 update
                    //this.updateRelationColumn(this.accountItem, next_accountItem);
                }
                this.executionItemFormModal = false;
                this.account_mode = "view";
            }
            this.accountItem = {};
        },
        async autoAddItem(org_accountItem, acc_id){
            this.add_items();
            this.account_mode = "auto_add";
            var item = {};
            item.id = acc_id;
            var vm = this;
            await axios.get('./api/loadAccountBudgetAmount/'+org_accountItem.org_id +'/'+ acc_id,
                    { params:{  year : org_accountItem.execution_year, month : org_accountItem.execution_month } } )
                .then(function(res){
                    item.account_code = res.data.account_code;
                    item.account_name = res.data.account_name;
                    item.unit_count = org_accountItem.unit_count;
                    item.rght = res.data.rght;
                    item.lft = res.data.lft;
                    item.remain_cost = res.data.remain_cost;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

            item.account_id = item.id;
            item.org_id = org_accountItem.org_id;
            item.org_name = org_accountItem.org_name;
            item.au_code = org_accountItem.au_code;
            item.nas_code = org_accountItem.nas_code;
            item.execution_year = org_accountItem.execution_year;
            item.execution_month = org_accountItem.execution_month;
            item.project_name = org_accountItem.project_name;
            item.project_code = org_accountItem.project_code;
            await this.setOrganizationAndAccount(item);
            if(this.accountItem.project_code == ""){
                this.accountItem.project_name = org_accountItem.project_name;
                this.accountItem.project_code = org_accountItem.project_code;
            }

            this.updateRelationColumn(org_accountItem, this.accountItem);
        },
        updateRelationColumn(org_accountItem, rel_accountItem){
            var relation_key = "";
            if(rel_accountItem.option){
                for(var i=0; i<rel_accountItem.option.length; i++){
                    if(rel_accountItem.option[i].column_interface == 'RELATION_COLUMN'){
                        relation_key = rel_accountItem.option[i].column_data;
                    }
                }
            }
            for(var i=0; i<org_accountItem.option.length; i++){
                if(org_accountItem.option[i].column_interface == relation_key && relation_key != ""){
                    for(var j=0; j<rel_accountItem.option.length; j++){
                        if(rel_accountItem.option[j].column_interface == 'RELATION_COLUMN'){
                            rel_accountItem.option[j].column_data_value = org_accountItem.option[i].column_data_value;
                        }
                    }
                }
            }
        },
        cancelAutoAddItem(event){
            if(event) event.preventDefault();
            this.delete_item = "execution_item";
            this.modal_ok();
            this.closeExecutionFormModal();
        },
        cancelExecutionFormModal(event){
            if(event) event.preventDefault();
            //this.modifyExecutionFormModal();
            this.accountItem = JSON.parse(JSON.stringify(this.selectAccountItem));
            this.account_mode = "view";

            if(this.$refs.pcbSampleOrderListComponent){
                this.$refs.pcbSampleOrderListComponent.search_string = this.accountItem.pcb_part_number;
                this.$refs.pcbSampleOrderListComponent.searchData();
            }
        },
        closeExecutionFormModal(event){
            if(event) event.preventDefault();
            this.executionItemFormModal = false;
            this.account_mode = "view";
            this.accountItem = {};
        },
        modifyExecutionFormModal(event){
            if(event) event.preventDefault();
            if(!this.selectAccountItem.account_id){
                warningModal.show_modal("Select a budget account!");
                return;
            }
            this.account_mode = "modify";
            this.continue_mode = false;
            this.executionItemFormModal = true;
            // this.switchTab = "pcb_cost";
            this.accountItem = JSON.parse(JSON.stringify(this.selectAccountItem));
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    // changeDate event 에 id 와 column_name 이 동일할 경우 id의 column_date_value 할당
                    var date = e.target.getElementsByTagName('input')[0].value;
                    for(var i=0; i<vm.accountItem.option.length; i++){
                        if(vm.accountItem.option[i].column_name == e.target.id)
                            vm.accountItem.option[i].column_data_value = date;
                    }
                });
            });
            this.loadMasterAccountOption();
        },
        async loadMasterAccountOption(){
            this.showProgressModal = true;
            var vm = this;

            // pcb_sample_cost_enable 이면서 pcb_sample_cost_split_slave 인 항목은 loadAccountOptions skip
            if(vm.accountItem.pcb_sample_cost_enable && vm.accountItem.pcb_sample_cost_split_slave){
                this.showProgressModal = false;
                return;
            }
            await axios.get('./api/loadAccountOptions/'+vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    for(var op=0; op<res.data.accountOptions.length; op++){
                        if(vm.accountItem.option[op] &&
                            vm.accountItem.option[op].column_name == res.data.accountOptions[op].column_name ){
                            vm.accountItem.option[op].column_data = res.data.accountOptions[op].column_data;
                            vm.accountItem.option[op].data_type = res.data.accountOptions[op].data_type;
                            vm.accountItem.option[op].column_guide = res.data.accountOptions[op].column_guide;
                        }
                    }
                    for(var op=0; op<res.data.accountOptionsPSC.length; op++){
                        if(vm.accountItem.optionPSC[op].column_name == res.data.accountOptionsPSC[op].column_name ){
                            vm.accountItem.optionPSC[op].column_data = res.data.accountOptionsPSC[op].column_data;
                            vm.accountItem.optionPSC[op].data_type = res.data.accountOptionsPSC[op].data_type;
                            vm.accountItem.optionPSC[op].column_guide = res.data.accountOptionsPSC[op].column_guide;
                        }
                    }
                    for(var op=0; op<res.data.accountOptionsStencil.length; op++){
                        if(vm.accountItem.optionStencil[op].column_name == res.data.accountOptionsStencil[op].column_name ){
                            vm.accountItem.optionStencil[op].column_data = res.data.accountOptionsStencil[op].column_data;
                            vm.accountItem.optionStencil[op].data_type = res.data.accountOptionsStencil[op].data_type;
                            vm.accountItem.optionStencil[op].column_guide = res.data.accountOptionsStencil[op].column_guide;
                        }
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async validationBudgetSplit(del_rows=[]){
            // execution_item 항목 중 pcb_sample_cost_enable, pcb_stencil_cost_enable 이 true 인 항목이 있을 경우
            // 서버 에서 execution item 재구성(split cost) 추가
            var split_validation = false;
            var vm = this;
            var data = {
                'mode' : this.account_mode,
                'execution_item' : this.item.execution_item,
                'account_item' : this.accountItem,
                'selected_item' : this.selectAccountItem,
                'delete_rows': del_rows
            }

            await axios.put('./api/validationBudgetSplit/'+vm.doc_id, data)
            .then(function(res){
                if(res.data.message != ''){
                    warningModal.show_modal(res.data.message);
                }else{
                    vm.item.execution_item = res.data.execution_item;
                    vm.selectAccountItem = res.data.selected_Item;
                    split_validation = true;
                }
            })
            .catch(function(err){   warningModal.show_modal(err);   });
            return split_validation;
        },
        async loadAccountSummary(include, check=false){
            // workflow 가 진행중인 항목은 account summary update 하지 않음
            if(this.item.next_app_step > 0) return;
            this.showProgressModal = true;
            var vm = this;
            vm.edit_item = {};
            vm.item.mode = vm.mode;
            var response_appline = [];
            await axios.put('./api/loadAccountSummary/'+vm.doc_id, vm.item)
                .then(function(res){
                    vm.item.execution_account_summary = res.data.execution_account_summary;
                    vm.item.transfer_account_summary = res.data.transfer_account_summary;
                    response_appline = res.data.app_preset_line;
                    if(check && res.data.message != ''){
                        warningModal.show_modal(res.data.message);
                    }
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            this.showProgressModal = false;
            if(include == 'preset_applines' && response_appline.length > 0)
                this.$refs.approvalLineComponent.changeApplines(response_appline);
        },
        async add_items(event){
            if(event) event.preventDefault();
            this.account_mode = "new";
            this.continue_mode = false;
            this.executionItemFormModal = true;
            this.switchTab = "pcb_cost";
            this.accountItem = { 'unit_count' : 1};

            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/getPresetOrganization',{ params : {'org_id': preset_orgid } })
                .then(function(res){
                    vm.accountItem.org_id = res.data.id;
                    vm.accountItem.org_name = res.data.org_name;
                    vm.accountItem.nas_code = res.data.nas_code;
                    vm.accountItem.au_code = res.data.au_code;
                    vm.selectedOrgItem = res.data;
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            this.showProgressModal = false;
        },
        delete_items(event){
            if(event) event.preventDefault();
            if(!this.selectAccountItem.account_id){
                warningModal.show_modal("Select a execution item!");
                return;
            }
            this.delete_item = "execution_item";
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            if(this.delete_item == "execution_item"){

                var tempList = [];
                var delete_rows = [];
                if(this.item.execution_item){
                    for(var i=0; i<this.item.execution_item.length; i++){
                        //if(this.item.execution_item[i] != this.selectAccountItem){
                        //    tempList.push(this.item.execution_item[i]);
                        if(this.item.execution_item[i] == this.selectAccountItem){
                            delete_rows.push(i);

                            for(var at=0; at<this.item.execution_item[i].option.length; at++){
                                // RELATION_ACCOUNT_ID 가 있는 항목이 삭제될 때 다음 row 삭제
                                if(this.item.execution_item[i].option[at].column_interface == "RELATION_ACCOUNT_ID"){
                                    delete_rows.push(i+1);
                                }
                                // RELATION_COLUMN 이 있는 항목이 삭제될 때 이전 row 삭제
                                // (단, 이전 row 에 RELATION_ACCOUNT_ID 이 존재해야 함)
                                if(this.item.execution_item[i].option[at].column_interface == "RELATION_COLUMN" && i > 0){
                                    for(var bf=0; bf<this.item.execution_item[i-1].option.length; bf++){
                                        if(this.item.execution_item[i-1].option[bf].column_interface == "RELATION_ACCOUNT_ID"){
                                            delete_rows.push(i-1);
                                        }
                                    }
                                }
                            }
                        }
                    }

                    for(var i=0; i<this.item.execution_item.length; i++){
                        if(! delete_rows.includes(i)){
                            tempList.push(this.item.execution_item[i]);
                        }
                    }
                }

                this.item.execution_item = tempList;
                var return_success = await this.validationBudgetSplit();
                if(!return_success) return;

                this.selectAccountItem = {};
                await this.loadAccountSummary('preset_applines');
            }else if(this.delete_item == "budget_split"){
                var tempList = [];
                if(this.accountItem.optionSplit){
                    // split 정보 update
                    for(var i=0; i<this.accountItem.optionSplit.length; i++){
                        if(this.accountItem.optionSplit[i].org_scope == "Master"){
                            this.accountItem.optionSplit[i].org_qty = parseInt(this.accountItem.optionSplit[i].org_qty)
                                + parseInt(this.selected_split_item.org_qty) ;
                            this.accountItem.optionSplit[i].org_cost = parseInt(this.accountItem.optionSplit[i].org_cost)
                                + parseInt(this.selected_split_item.org_cost) ;
                        }else if(this.accountItem.optionSplit[i] == this.selected_split_item){
                            this.accountItem.optionSplit[i].org_qty = 0;
                            this.accountItem.optionSplit[i].org_cost = 0;
                        }

                        if(this.accountItem.optionSplit[i].nas_code == this.accountItem.nas_code){
                            this.accountItem.unit_count = this.accountItem.optionSplit[i].org_qty;
                            this.accountItem.total_cost = this.accountItem.optionSplit[i].org_cost;
                        }
                        if(this.accountItem.optionSplit[i] != this.selected_split_item){
                            tempList.push(this.accountItem.optionSplit[i]);
                        }
                    }
                }
                this.accountItem.optionSplit = tempList;
                this.selected_split_item = {};
            }else if(this.delete_item == "transfer_account_summary"){
                var tempList = [];
                if(this.item.transfer_account_summary){
                    for(var i=0; i<this.item.transfer_account_summary.length; i++){
                        if(this.item.transfer_account_summary[i] != this.selectTransferAccountSummary)
                            tempList.push(this.item.transfer_account_summary[i]);
                    }
                }
                this.item.transfer_account_summary = tempList;
                this.selectTransferAccountSummary = {};
                this.loadAccountSummary('preset_applines');
            }else if(this.delete_item == "main"){
                loadingModalEl.show();
                var vm = this;
                await axios.delete('./api/loadContents/'+vm.doc_id,
                    { params : {'app_type': vm.$refs.approvalLineComponent.$props.app_type } })
                    .then(function(res){
                        vm.item = {};
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
                loadingModalEl.hide();
                window.close();
            }
        },
        async detailAccItem(item){
            this.account_mode = "view";
            this.executionItemFormModal = true;
            this.switchTab = "pcb_cost";
            this.accountItem = JSON.parse(JSON.stringify(item));
            this.expanPCBInfo = false;
        },
        setProject(project){
            this.accountItem.project_name = project.project_name;
            this.accountItem.project_code = project.project_code;
            this.accountItem.account_with_project = false;
        },
        setPCBPart(part){
            for(var i=0; i<this.accountItem.optionPSC.length; i++){
                if(this.accountItem.optionPSC[i].column_interface == 'ATTRIBUTE2')
                    this.accountItem.optionPSC[i].column_data_value = part.PP_M1_NAME;
                if(this.accountItem.optionPSC[i].column_interface == 'ATTRIBUTE3')
                    this.accountItem.optionPSC[i].column_data_value = part.PP_M1_REVISION;
            }
            if(this.$refs.pcbSampleOrderListComponent){
                this.accountItem.pcb_part_number = part.PP_M1_NAME;
                this.$refs.pcbSampleOrderListComponent.search_string = this.accountItem.pcb_part_number;
                this.$refs.pcbSampleOrderListComponent.searchData();
            }

            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "pcb_part_search")
                    this.accountItem.option[i].column_data_value = part.PP_M1_NAME;
                else if(this.accountItem.option[i].column_interface == "PART_REVISION")
                    this.accountItem.option[i].column_data_value = part.PP_M1_REVISION;
            }
        },
        async setPCBAOrderHistory(data){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountItem.option = res.data.accountOptions;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    this.showProgressModal = false;
                    return;
                });
            // PCB Assembly 발주 history 내용 중 option 의 column_interface 와 동일한 항목 값 변경
            for(var i=0; i<vm.accountItem.option.length; i++){
                for(const key in data){
                    if(key == "TOTAL_COST")
                        continue;
                    if(vm.accountItem.option[i].column_interface == key){
                        vm.accountItem.option[i].column_data_value = data[key]["column_data_value"]
                        vm.accountItem.option[i].column_data_value2 = data[key]["column_data_value2"]
                    }
                }
            }
            this.showProgressModal = false;
        },
        async setPCBOrderHistory(data){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/loadAccountOptions/'+vm.accountItem.org_id +'/'+ vm.accountItem.account_id, null)
                .then(function(res){
                    vm.accountItem.optionPSC = res.data.accountOptionsPSC;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    this.showProgressModal = false;
                    return;
                });
            // PCB 발주 history 내용 중 optionPSC 의 column_interface 와 동일한 항목 값 변경
            for(var i=0; i<vm.accountItem.optionPSC.length; i++){
                for(const key in data){
                    if(key == "TOTAL_COST")
                        continue;
                    if(vm.accountItem.optionPSC[i].column_interface == key){
                        vm.accountItem.optionPSC[i].column_data_value = data[key]["column_data_value"]
                        vm.accountItem.optionPSC[i].column_data_value2 = data[key]["column_data_value2"]
                    }
                }
            }
            this.showProgressModal = false;
        },
        async updateAssetRegisterValue(){
            this.showProgressModal = true;
            var vm = this;
            await axios.put('./api/updateAssetRegisterValue', vm.accountItem )
                .then(function(res){
                    vm.accountItem.asset_register_enable = res.data.asset_register_enable;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            this.showProgressModal = false;

            // local data (loaded) update
            if(this.item.execution_item){
                for(var i=0; i<this.item.execution_item.length; i++){
                    if(this.item.execution_item[i].id == this.accountItem.id){
                        this.item.execution_item[i].asset_register_enable = this.accountItem.asset_register_enable;
                        break;
                    }
                }
            }
        },

        // Account Summary function
        selectExecutionAccountSummaryItem(acc){
            this.selectExecutionAccountSummary = acc;
            this.selectTransferAccountSummary = {};
        },
        selectTransferAccountSummaryItem(acc){
            if(acc.item_type == "execution")
                return;
            this.selectTransferAccountSummary = acc;
            this.selectExecutionAccountSummary = {};
        },
        async add_new_budget(event){
            if(event) event.preventDefault();
            if(this.selectExecutionAccountSummary){
                if(this.selectExecutionAccountSummary.org_id < 0){
                    warningModal.show_modal("External Organization do not need to 'Add New Budget'.");
                    return;
                }
            }
            this.account_mode = "new";
            if(this.selectExecutionAccountSummary)
                this.transferAccountSummary = JSON.parse(JSON.stringify(this.selectExecutionAccountSummary));
            else
                this.transferAccountSummary = {};
            this.transferAccountSummary.item_type = "Add";
            this.transferAccountSummary.account_year = year;
            this.transferAccountSummary.account_month = month;
            if(this.transferAccountSummary.org_id && this.transferAccountSummary.account_id)
                this.changeMonthTo();
            this.accountSummaryInfoModal = true;

            var load_org_id = preset_orgid;
            if(this.transferAccountSummary.org_id){
                load_org_id = this.transferAccountSummary.org_id;
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/getPresetOrganization',{ params : {'org_id': load_org_id } })
                .then(function(res){
                    vm.transferAccountSummary.org_id = res.data.id;
                    vm.transferAccountSummary.org_name = res.data.org_name;
                    vm.transferAccountSummary.au_code = res.data.au_code;
                    vm.selectedOrgItemTo = res.data;
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            this.showProgressModal = false;
        },
        async add_transfer(event){
            if(event) event.preventDefault();
            if(this.selectExecutionAccountSummary){
                if(this.selectExecutionAccountSummary.org_id < 0){
                    warningModal.show_modal("External Organization do not need to 'Add Transfer Budget'.");
                    return;
                }
            }
            this.account_mode = "new";
            if(this.selectExecutionAccountSummary)
                this.transferAccountSummary = JSON.parse(JSON.stringify(this.selectExecutionAccountSummary));
            else
                this.transferAccountSummary = {};
            this.transferAccountSummary.item_type = "Transfer";
            this.transferAccountSummary.from_account_year = year;
            this.transferAccountSummary.from_account_month = month;
            this.transferAccountSummary.from_project_code = this.transferAccountSummary.project_code;
            this.transferAccountSummary.from_project_name = this.transferAccountSummary.project_name;
            this.transferAccountSummary.account_year = year;
            this.transferAccountSummary.account_month = month;
            if(this.transferAccountSummary.org_id && this.transferAccountSummary.account_id)
                this.changeMonthTo();
            this.accountSummaryInfoModal = true;

            var load_org_id = preset_orgid;
            if(this.transferAccountSummary.org_id){
                load_org_id = this.transferAccountSummary.org_id;
            }

            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/getPresetOrganization',{ params : {'org_id': load_org_id } })
                .then(function(res){
                    vm.transferAccountSummary.from_org_id = res.data.id;
                    vm.transferAccountSummary.from_org_name = res.data.org_name;
                    vm.transferAccountSummary.from_au_code = res.data.au_code;
                    vm.selectedOrgItemFrom = res.data;

                    vm.transferAccountSummary.org_id = res.data.id;
                    vm.transferAccountSummary.org_name = res.data.org_name;
                    vm.transferAccountSummary.au_code = res.data.au_code;
                    vm.selectedOrgItemTo = res.data;
                })
                .catch(function(err){   warningModal.show_modal(err);   });
            this.showProgressModal = false;
        },
        delete_accounts_summary(event){
            if(event) event.preventDefault();
            if(!this.selectTransferAccountSummary.account_id){
                warningModal.show_modal("Select a item ['Add' or 'Transfer'] type!");
                return;
            }
            this.delete_item = "transfer_account_summary";
            confirmModal.show_modal(this);
        },
        async detailTransferAccountSummary(item){
            this.account_mode = "view";
            this.accountSummaryInfoModal = true;
            //this.transferAccountSummary = {};
            this.transferAccountSummary = JSON.parse(JSON.stringify(item));
            this.selectTransferAccountSummary = this.transferAccountSummary;
        },
        async setOrganizationFrom(item){
            this.transferAccountSummary.from_org_id = item.id;
            this.transferAccountSummary.from_org_name = item.org_name;
            this.transferAccountSummary.from_au_code = item.au_code;
            this.transferAccountSummary.from_account_year = item.year;
            this.selectedOrgItemFrom = item;
            if(this.transferAccountSummary.from_account_id){
                await this.changeMonthFrom();
            }
        },
        async setOrganizationTo(item){
            this.transferAccountSummary.org_id = item.id;
            this.transferAccountSummary.org_name = item.org_name;
            this.transferAccountSummary.au_code = item.au_code;
            this.transferAccountSummary.account_year = item.year;
            this.selectedOrgItemTo = item;
            if(this.transferAccountSummary.account_id){
                await this.changeMonthTo();
            }
        },
        setAccountFrom(item){
            this.transferAccountSummary.from_account_id = item.id;
            this.transferAccountSummary.from_account_name = item.account_name;
            this.transferAccountSummary.from_account_code = item.account_code;
            this.transferAccountSummary.from_account_with_project = item.account_with_project;
            if(item.account_with_project){
                this.transferAccountSummary.from_project_code = item.project_code;
                this.transferAccountSummary.from_project_name = item.project_name;
            }
            this.transferAccountSummary.from_account_remain = item.remain_cost ;
            this.transferAccountSummary.from_account_year = item.execution_year;
            this.transferAccountSummary.from_account_month = item.execution_month;
        },
        setAccountTo(item){
            this.transferAccountSummary.account_id = item.id;
            this.transferAccountSummary.account_name = item.account_name;
            this.transferAccountSummary.account_code = item.account_code;
            this.transferAccountSummary.account_with_project = item.account_with_project;
            if(item.account_with_project){
                this.transferAccountSummary.project_code = item.project_code;
                this.transferAccountSummary.project_name = item.project_name;
            }
            this.transferAccountSummary.account_remain = item.remain_cost ;
            this.transferAccountSummary.account_year = item.execution_year;
            this.transferAccountSummary.account_month = item.execution_month;
        },
        transfer_account_summary_form_validation(){
            var requiredElements = document.querySelector("#transfer_account_summary_form").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitAccountSummaryInfoFormModal(){
            if(this.transfer_account_summary_form_validation()) return false;
            if(this.account_mode == 'new'){
                var new_item = {};
                new_item = JSON.parse(JSON.stringify(this.transferAccountSummary));
                if(!this.item.transfer_account_summary)
                    this.item.transfer_account_summary = [];
                this.item.transfer_account_summary.push(new_item);
                this.selectTransferAccountSummary = new_item;
            }else if(this.account_mode == 'modify'){
                for(var i=0; i<this.item.transfer_account_summary.length; i++){
                    if(this.item.transfer_account_summary[i] == this.selectTransferAccountSummary){
                        this.item.transfer_account_summary[i] = JSON.parse(JSON.stringify(this.transferAccountSummary));
                        this.selectTransferAccountSummary = this.item.transfer_account_summary[i];
                    }
                }
            }
            this.item.budget_mode = budget_mode;
            await this.loadAccountSummary('preset_applines', check=true);

            this.accountSummaryInfoModal = false;
            this.account_mode = "view";
        },
        cancelAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.detailTransferAccountSummary(this.transferAccountSummary);
            //this.modifyAccountSummaryInfoFormModal();
            this.account_mode = "view";
        },
        closeAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.accountSummaryInfoModal = false;
            this.account_mode = "view";
        },
        modifyAccountSummaryInfoFormModal(event){
            if(event) event.preventDefault();
            this.account_mode = "modify";
            this.accountSummaryInfoModal = true;
            // this.transferAccountSummary = JSON.parse(JSON.stringify(this.selectTransferAccountSummary));
        },
        setProjectAccountSummaryFrom(project){
            this.transferAccountSummary.from_project_name = project.project_name;
            this.transferAccountSummary.from_project_code = project.project_code;
            this.transferAccountSummary.from_account_with_project = false;
        },
        setProjectAccountSummaryTo(project){
            this.transferAccountSummary.project_name = project.project_name;
            this.transferAccountSummary.project_code = project.project_code;
            this.transferAccountSummary.account_with_project = false;
        },
        isNumeric(num){
            num = String(num).replace(/^\s+|\s+$/g, "");
            var regex = /^[0-9]+(\.[0-9]+)?$/g;
            if( regex.test(num) ){
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            }else{ return false;  }
        },
        openPopupNotice(){
            if(this.$refs.accountListPopupComponent){
                this.$refs.accountListPopupComponent.popupModal = true;
            }
        },
        async partSearch(option, text){
            this.$nextTick(() => {
                this.$refs.partSearchModalComponent.option = option;
                if(text){
                    this.$refs.partSearchModalComponent.search_string = text;
                    this.$refs.partSearchModalComponent.searchData();
                }else{
                    this.$refs.partSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for partSearch Result
        selectedPart(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "part_search")
                    this.accountItem.option[i].column_data_value = item.part_number;
                else if(this.accountItem.option[i].column_interface == "_PRODUCT_")
                    this.accountItem.option[i].column_data_value = item.description;
                else if(this.accountItem.option[i].column_interface == "_SPECIFICATION_")
                    this.accountItem.option[i].column_data_value = item.sepecification;
            }
            this.accountItem.unit_cost = item.part_cost;
        },
        async modelSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.modelSearchModalComponent.search_string = text;
                    this.$refs.modelSearchModalComponent.searchData();
                }else{
                    this.$refs.modelSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for modelSearch Result
        selectedModel(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "model_search")
                    this.accountItem.option[i].column_data_value = item.model_name;
                else if(this.accountItem.option[i].column_interface == "MODEL_COST")
                    this.accountItem.option[i].column_data_value = item.model_cost;
                else if(this.accountItem.option[i].column_interface == "PV_SET_STD_UNIT")
                    this.accountItem.option[i].column_data_value = item.pv_set_std_unit;
                else if(this.accountItem.option[i].column_interface == "PV_SET_CO_UNIT")
                    this.accountItem.option[i].column_data_value = item.pv_set_co_unit;
                else if(this.accountItem.option[i].column_interface == "GRADE")
                    this.accountItem.option[i].column_data_value = item.project_grade;
            }
            this.accountItem.project_name = item.project_name;
            this.accountItem.project_code = item.project_code;
            this.accountItem.account_with_project = false;
            this.accountItem.unit_cost = item.model_cost;
        },
        async assetSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.assetSearchModalComponent.search_asset_number = text;
                    this.$refs.assetSearchModalComponent.searchData();
                }else{
                    this.$refs.assetSearchModalComponent.openSearchModal();
                }
            });
        },
        // emit function for assetSearch Result
        selectedAsset(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "asset_search")
                    this.accountItem.option[i].column_data_value = item.asset_number;
                else if(this.accountItem.option[i].column_interface == "ASSET_INPUT_COST")
                    this.accountItem.option[i].column_data_value = item.asset_cost;
                else if(this.accountItem.option[i].column_interface == "ASSET_REMAIN_COST")
                    this.accountItem.option[i].column_data_value = item.asset_remain_cost;
                else if(this.accountItem.option[i].column_interface == "ASSET_INPUT_DATE")
                    this.accountItem.option[i].column_data_value = item.create_date;
                else if(this.accountItem.option[i].column_interface == "ASSET_CATEGORY")
                    this.accountItem.option[i].column_data_value = item.asset_category;
                else if(this.accountItem.option[i].column_interface == "_PRODUCT_")
                    this.accountItem.option[i].column_data_value = item.asset_product;
                else if(this.accountItem.option[i].column_interface == "_MODEL_")
                    this.accountItem.option[i].column_data_value = item.asset_model;
                else if(this.accountItem.option[i].column_interface == "_MAKER_")
                    this.accountItem.option[i].column_data_value = item.asset_maker;
            }
        },
        // emit function for assetCategorySearch Result
        selectedAssetCategory(item){
            if(this.accountItem.option){
                for(var i=0; i<this.accountItem.option.length; i++){
                    if(this.accountItem.option[i].data_type == "asset_category_search"){
                        this.accountItem.option[i].column_data_value = item.asset_category;
                        this.accountItem.option[i].column_data_value2 = item.id;
                    }
                }
            }
        },
        async freightChargeSearch(text){
            this.freightChargeSearchModal = true;
            if(this.$refs.freightChargeSearchModalComponent){
                this.$refs.freightChargeSearchModalComponent.openSearchModal();
            }
        },
        // emit function for freightChargeSearchModalComponent Result
        selectedFreightCharge(item){
            for(var i=0; i<this.accountItem.option.length; i++){
                if(this.accountItem.option[i].data_type == "freight_charge_search")
                    this.accountItem.option[i].column_data_value = item.freight_charge_name;
                else if(this.accountItem.option[i].column_interface == "FREIGHT_WEIGHT")
                    this.accountItem.option[i].column_data_value = item.freight_weight;
            }
            this.accountItem.unit_cost = item.freight_cost;
            this.freightChargeSearchModal = false;
        },
        // emit function for freightChargeSearchModalComponent Result
        closedFreightChargeModal(){
            this.freightChargeSearchModal = false;
        },
        async showMassUploadModal(event){
            if(event) event.preventDefault();
            this.$nextTick(() => {
                this.$refs.budgetExecutionMassUploadComponent.openModal();
            });
        },

        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
        viewBudgetItem(master_id){
            this.newWindow('1200','750','',"detailExecutionForm"+master_id);
            document.submitForm.target = "detailExecutionForm"+master_id;
            document.submitForm.action = "./"+master_id;
            document.submitForm.submit();
        },
        changeSwitchData(data){
            this.switchTab = data;
            this.selected_split_item = {};
        },
        changeSplitOrgScope(){
            this.split_item.org_id = ""
            this.split_item.org_name = ""
        },
        addSplitItem(){
            this.split_mode = "new";
            this.split_item = { 'org_scope' : 'Internal' };
        },
        modifySplitItem(){
            if(!this.selected_split_item.org_id){
                warningModal.show_modal("Please select a item!");
                return false;
            }
            this.split_item = JSON.parse(JSON.stringify(this.selected_split_item));
            this.split_mode = "modify";
        },
        deleteSplitItem(){
            if(!this.selected_split_item.org_id){
                warningModal.show_modal("Please select a item!");
                return false;
            }
            this.split_mode = "delete"
            this.delete_item = "budget_split";
            confirmModal.show_modal(this);
        },
        saveSplitItem(){
            if(!this.split_item.org_id){
                warningModal.show_modal("Please select organization!");
                return false;
            }
            if(!this.isNumeric(this.split_item.org_qty)){
                warningModal.show_modal("Please input number in [ Quantity ] field!");
                return false;
            }
            if(this.split_mode == "new"){
                if(!this.accountItem.optionSplit){
                    this.accountItem.optionSplit = [];
                }
                if(this.split_item.nas_code == this.accountItem.split_master_nas_code){
                    warningModal.show_modal("Budget organization do not need to add!");
                    return false;
                }
                if(this.split_total_count() + parseInt(this.split_item.org_qty) > this.accountItem.pcb_sample_qty){
                    warningModal.show_modal("Sum of quantity is over than original quantity!");
                    return false;
                }
                this.accountItem.optionSplit.push(this.split_item);
            }else if(this.split_mode == "modify"){
                if(this.split_item.nas_code == this.accountItem.split_master_nas_code){
                    warningModal.show_modal("Budget organization do not need to add!");
                    return false;
                }
                if(this.split_total_count() - parseInt(this.selected_split_item.org_qty)
                    + parseInt(this.split_item.org_qty) > this.accountItem.pcb_sample_qty){
                    warningModal.show_modal("Sum of quantity is over than original quantity!");
                    return false;
                }

                for(var i=0; i<this.accountItem.optionSplit.length; i++){
                    if(this.accountItem.optionSplit[i].nas_code == this.split_item.nas_code){
                        this.accountItem.optionSplit[i].org_qty = this.split_item.org_qty;
                    }
                }
            }
            this.updateSplitItem();
            this.split_mode = "";
        },
        updateSplitItem(){
            // optionPSC 가 있고 manual cost 입력일 경우 입력된 값을 sample_cost 에 할당 후 계산
            if(this.accountItem.optionPSC && this.accountItem.manual){
                for(var at=0; at<this.accountItem.optionPSC.length; at++){
                    if(this.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                        this.accountItem.pcb_sample_cost = parseInt(this.accountItem.optionPSC[at].column_data_value);
                    }
                }
            }

            if(this.accountItem.optionSplit){
                var unit_cost = Math.ceil(this.accountItem.pcb_sample_cost / this.accountItem.pcb_sample_qty);
                // split slave 정보 update
                var slave_cost_sum = 0;
                for(var i=0; i<this.accountItem.optionSplit.length; i++){
                    if(this.accountItem.optionSplit[i].org_scope != "Master"){
                        this.accountItem.optionSplit[i].org_cost = this.accountItem.optionSplit[i].org_qty * unit_cost;
                        slave_cost_sum += this.accountItem.optionSplit[i].org_cost;
                        if(this.accountItem.optionSplit[i].nas_code == this.accountItem.nas_code){
                            this.accountItem.unit_count = this.accountItem.optionSplit[i].org_qty;
                            this.accountItem.total_cost = this.accountItem.optionSplit[i].org_cost;
                        }
                    }
                }
                // split master 정보 update
                for(var i=0; i<this.accountItem.optionSplit.length; i++){
                    if(this.accountItem.optionSplit[i].org_scope == "Master"){
                        this.accountItem.optionSplit[i].org_qty = this.accountItem.pcb_sample_qty - this.split_total_count();
                        this.accountItem.optionSplit[i].org_cost = this.accountItem.pcb_sample_cost - slave_cost_sum;
                        if(this.accountItem.optionSplit[i].nas_code == this.accountItem.nas_code){
                            this.accountItem.unit_count = this.accountItem.optionSplit[i].org_qty;
                            this.accountItem.total_cost = this.accountItem.optionSplit[i].org_cost;
                        }
                    }
                }
            }
        },
        split_total_count(){
            var split_total_count = 0;
            for(var i=0; i<this.accountItem.optionSplit.length; i++){
                if(this.accountItem.optionSplit[i].org_scope != "Master"){
                    split_total_count += parseInt(this.accountItem.optionSplit[i].org_qty);
                }
            }
            return split_total_count;
        },
        isNumeric(num){
            num = String(num).replace(/^\s+|\s+$/g, "");
            var regex = /^[0-9]+(\.[0-9]+)?$/g;
            if( regex.test(num) ){
                num = num.replace(/,/g, "");
                return isNaN(num) ? false : true;
            }else{ return false;  }
        },
    },
    computed:{
        componentFormDialog(){
            if(! this.accountItem.option) return false;
            for(var e=0; e<this.accountItem.option.length; e++){
                if(this.accountItem.option[e].data_type == 'component'){
                    if(this.accountItem.option[e].column_data_value){
                        if(this.accountItem.option[e].column_data_value.includes("__E")){
                            // accountItem.estimation_data 가 없을 경우 object 생성
                            if(!this.accountItem.estimation_data)
                                this.accountItem.estimation_data = {};

                            this.accountItem.estimation_data.estimation_key = this.accountItem.option[e].column_data_value;
                            // estimation_key 값 변경시 vue component 의 값도 method 호출하여 변경
                            if(this.$refs.accountEstimationInfoComponent)
                                this.$refs.accountEstimationInfoComponent.changeEstId();

                            return true;
                        }
                    }
                }
            }
            if(this.accountItem.estimation_data)
                delete this.accountItem.estimation_data;
            return false;
        },
        cal_totalCost(){
            if(this.accountItem){
                // pcb sample 일 경우 pcb_sample_cost --> total_cost 적용
                if(this.accountItem.pcb_sample_cost_enable && this.accountItem.optionPSC){

                    return this.markedCost(this.accountItem.total_cost);
                    /*
                    for(var at=0; at<this.accountItem.optionPSC.length; at++){
                        if(this.accountItem.optionPSC[at].column_interface == "TOTAL_COST"){
                            this.accountItem.total_cost = this.accountItem.optionPSC[at].column_data_value;
                            return this.markedCost(this.accountItem.total_cost);
                        }
                    }
                    */
                }
                // pcb stencil 일 경우 stencil_cost --> total_cost 적용
                if(!this.accountItem.pcb_sample_cost_enable && this.accountItem.pcb_stencil_cost_enable
                    && this.accountItem.optionStencil){
                    for(var at=0; at<this.accountItem.optionStencil.length; at++){
                        if(this.accountItem.optionStencil[at].column_interface == "STENCIL_COST"){
                            this.accountItem.total_cost = this.accountItem.optionStencil[at].column_data_value;
                            return this.markedCost(this.accountItem.total_cost);
                        }
                    }
                }

                // 그외 일반적인 unit_count * unit_cost --> total_cost 적용
                if(this.accountItem.unit_count && this.accountItem.unit_cost){
                    this.accountItem.total_cost = parseInt(this.accountItem.unit_count * this.accountItem.unit_cost);
                    return this.markedCost(this.accountItem.total_cost);
                }
            }
            this.accountItem.total_cost = "";
            return this.markedCost(this.accountItem.total_cost);
        },
        cal_total_execution_cost(){
            var total_execution_cost =0;
            if(this.item.execution_account_summary){
                for(var i=0; i<this.item.execution_account_summary.length; i++){
                    total_execution_cost += this.item.execution_account_summary[i].account_execute;
                }
            }
            return this.markedCost(total_execution_cost);
        },
        markedCost(){
            return (val) => {
                if(val == 0) return 0;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        cal_fromAvailableCost(){
            if(this.transferAccountSummary.from_account_remain){
                if(this.transferAccountSummary.account_transfer)
                    this.transferAccountSummary.from_account_transfer = parseInt(this.transferAccountSummary.account_transfer) * -1;
                this.transferAccountSummary.from_account_available =
                    parseInt(this.transferAccountSummary.from_account_remain) + parseInt(this.transferAccountSummary.from_account_transfer);
                return this.markedCost(this.transferAccountSummary.from_account_available);
            }
            this.transferAccountSummary.from_account_available = "";
            return this.markedCost(this.transferAccountSummary.from_account_available);
        },
        cal_toAvailableCost(){
            if(this.transferAccountSummary){
                if(this.transferAccountSummary.account_add){
                    this.transferAccountSummary.account_available =
                    parseInt(this.transferAccountSummary.account_remain) + parseInt(this.transferAccountSummary.account_add);
                    return this.markedCost(this.transferAccountSummary.account_available);
                }else if(this.transferAccountSummary.account_transfer){
                    this.transferAccountSummary.account_available =
                    parseInt(this.transferAccountSummary.account_remain) + parseInt(this.transferAccountSummary.account_transfer);
                    return this.markedCost(this.transferAccountSummary.account_available);
                }
            }
            this.transferAccountSummary.account_available = "";
            return this.markedCost(this.transferAccountSummary.account_available);
        },
        showWorkOrderComponent(){
            if(this.item.execution_item){
                for(var i=0; i<this.item.execution_item.length; i++){
                    if( parseInt(this.item.execution_item[i].next_app_step) >= 90){
                        return true;
                    }
                    if(this.item.execution_item[i].work_order_enable){
                        return true;
                    }
                }
            }
            return false;
        }
    },
}).mount('#vue3-top-object');

