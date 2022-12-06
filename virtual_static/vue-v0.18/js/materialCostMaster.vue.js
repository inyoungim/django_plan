axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');
const lang = document.currentScript.getAttribute('lang');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
       'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
       'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data() {
        return {
            switchData : "set",
            period_data : ['202202','202203','202204'],
            basic_set : {},
            select_item : {},
            page_mode : "new",
            item_list : {},
            mail_list : [],
            mail_item : {},
            column_mode : "view",
            targetItem : {},
            input_mode_list : [],
            item_category_list : [],
            selectedColumn : {},
            column_list : [],
        }
    },
    mounted(){
        var date = new Date();
        var firstDayOfMonth = new Date( date.getFullYear(), date.getMonth() , 1 );
        var firstDayOfMonth2 = new Date( date.getFullYear(), date.getMonth() , 1 );
        var lastMonth = new Date ( firstDayOfMonth.setDate( firstDayOfMonth.getDate() - 1 ) );
        var nextMonth = new Date ( firstDayOfMonth2.setDate( firstDayOfMonth2.getDate() + 31 ) );

        mon1 = lastMonth.getFullYear()+("0" + (1 + lastMonth.getMonth())).slice(-2);
        mon2 = date.getFullYear()+("0" + (1 + date.getMonth())).slice(-2);
        mon3 = nextMonth.getFullYear()+("0" + (1 + nextMonth.getMonth())).slice(-2);
        this.basic_set.period_data = [mon1,mon2,mon3];
        this.select_item.period_name = "";
        this.select_item.sdate = "";
        this.select_item.exrate = "";

        self = this;
        $("#sdate").datepicker({
            daysOfWeekHighlighted: "0",
            todayHighlight: true,
            autoclose: true,
            language: lang,
            orientation: "bottom",
        }).on("changeDate", function() {self.select_item.sdate = $('#sdate').val()});
        $("#edate").datepicker({
            daysOfWeekHighlighted: "0",
            todayHighlight: true,
            autoclose: true,
            language: lang,
            orientation: "bottom",
        }).on("changeDate", function() {self.select_item.edate = $('#edate').val()});
    },
    methods: {
        async save_set(){
            if(event) event.preventDefault();
            if(this.main_form_validation()) return false;

            var vm = this;
            await axios.post('../api/1/setupSave/', vm.select_item )
                .then(function(res){
                    alert('저장완료');
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
        },
        main_form_validation(){
            var requiredElements = document.querySelectorAll("form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                console.log(e.name);
                console.log(e.value);
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async submitFormMain(method, event){
            if(event) event.preventDefault();

            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                // make array data svr_file_names and up_file_names
                vm.select_item.attache_files = [];
                vm.select_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.select_item.attache_files.push(response.svr_file_names[i]);
                    vm.select_item.attache_file_names.push(response.up_file_names[i]);
                }
                await axios.post('../api/0/lineupSave/', vm.select_item )
                    .then(function(res){
                        //await loadFormMain();
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            loadingModalEl.hide();
        },
        async loadFormMain(method, event){
            if(event) event.preventDefault();

            var vm = this;
            loadingModalEl.show();
            await axios.get('../api/0/lineupSave/', vm.select_item)
                .then(function(res){
                    vm.item_list = res.data.data_list;
                    console.log(res.data.data_list);
                }).catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
        },
        getFormat(){

        },
        async fnSwitch(str){
            this.switchData = str;
            if(str == 'line'){
                this.loadFormMain();
            }
            if(str=='item'){
                var vm = this;
                loadingModalEl.show();
                await axios.get('../api/0/columnSelectItems/', null)
                    .then(function(res){
                        vm.input_mode_list = res.data.input_mode;
                        vm.item_category_list = res.data.item_category;
                        vm.column_list = res.data.data_list;
                    }).catch(function(err){
                        warningModal.show_modal(err);
                        loadingModalEl.hide();
                        return;
                    });
                loadingModalEl.hide();
            }
        },
        async submitFormModal(method, event){
            if(event) event.preventDefault();
            var vm = this;
            loadingModalEl.show();
            await axios.post('../api/0/columnSelectItems/', vm.targetItem)
                .then(function(res){
                    vm.column_list = res.data.data_list;
                    vm.column_mode = "view";
                }).catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
        },
        async updateFormModal(method, event){
            if(event) event.preventDefault();
            var vm = this;
            loadingModalEl.show();
            await axios.put('../api/'+vm.targetItem.id+'/columnSelectItems/', vm.targetItem)
                .then(function(res){
                    vm.column_list = res.data.data_list;
                    vm.column_mode = "view";
                }).catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
        },
        targetSelected(stype,target){
            this.mail_item.stype = stype;
            if(stype == "USER"){
                this.mail_item.org_code = target.EMAIL;
                this.mail_item.nas_code = "";
                this.mail_item.org_name = target.FULL_NAME;
                this.mail_item.org_name_en = target.NAME_ENG;
            }else if(stype == "ORG"){
                this.mail_item.org_code = target.ORGAN;
                this.mail_item.nas_code = target.NAS_CODE;
                this.mail_item.org_name = target.OLD_ORGAN_NAME;
                this.mail_item.org_name_en = target.ORG_ENG_NAME;
            }else if(stype == "OTHER"){
                this.mail_item.org_code = target.ORGAN;
                this.mail_item.nas_code = "";
                this.mail_item.org_name = target.ORGAN;
                this.mail_item.org_name_en = target.ORGAN;
            }
            this.mail_list.push(this.mail_item);
            console.log(this.mail_list);
        },
        newColumn(){
            this.column_mode = "column_new";
            this.selectedColumn = {};
            this.targetItem = {};
        },
        modifyColumn(){
            if(this.selectedColumn.id){
                this.targetItem = JSON.parse(JSON.stringify(this.selectedColumn));
                this.column_mode = "column_modify";
            }else{
                warningModal.show_modal("Please, select one column.");
            }
        },
        deleteColumn(){
            if(!this.selectedColumn.id){
                warningModal.show_modal("Please, select one column.");
                return;
            }
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            if(vm.selectedColumn.id){
                await axios.delete('../api/'+vm.selectedColumn.id+'/columnSelectItems/')
                    .then(function(res){
                        vm.column_list = res.data.data_list;
                        vm.selectedColumn = {};
                    })
                    .catch(function(err){
                        vm.showProgressModal = "";
                        warningModal.show_modal(err);
                        return;
                    });
            }
            loadingModalEl.hide();
        },
    },
}).mount('#vue3-top-object')
