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
            switchData : "input",
            select_item : {},
            page_mode : "new",
            head_list : [],
            item_list : [],
            data_list : [],
            selectedColumn : {},
            modifyItem : {},
            column_mode : "" ,
            location_list : [],
            inch_list : [],
            series_list : [],
            tool_list : [],
            search_item : {},
            tdata : {},
            page_num : 10,
            copyColumn : {},
            copy_message : "",
            dprogress : 0,
            initial_data : {},
            initialselected : {},
            initialItem : {},
            logic_data : {},
            logicselected : {},
        }
    },
    mounted(){
        this.tdata.location_name2 = "ALL";
        this.tdata.inch = "ALL";
        this.tdata.series_name = "ALL";
        this.tdata.tool_name = "ALL";
        this.tdata.total_article = 0;
        this.search_item.previous_page  = 0;
        this.search_item.next_page = 0;
        this.page(this.search_item.active_page, this.page_num );
//      담당별 필드를 구해올 것
    },
    methods: {
        itemModify(){
            //팝업 띄워서 수정 사항 적을 것
            if(!this.selectedColumn.period_name){
                warningModal.show_modal("Please, select one.");
                return false;
            }
            this.modifyItem = JSON.parse(JSON.stringify(this.selectedColumn));
            this.column_mode = "column_modify";
        },
        async itemSave(){
            if(event) event.preventDefault();
            var vm = this;
            loadingModalEl.show();
            loadingModalEl.hide();
        },
        async submitFormModal(){
            id = this.modifyItem.id;
            if(id == "" || id == null || id == undefined ){
                id = 0;
            }
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            this.modifyItem.input_mode = this.tdata.input_mode;
            console.log(vm.modifyItem);
            await axios.put('./api/'+id+'/costItem/', vm.modifyItem)
            .then(function(res){
                vm.column_mode = "";
                vm.page(vm.tdata.active_page, vm.tdata.page_num );
            })
            .catch(function(err){
                warningModal.show_modal(err);
            });
            loadingModalEl.hide();
        },
        async page(num, page_num, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            vm.tdata.active_page = num;
//            console.log(vm.tdata.active_page);
            vm.tdata.page_num = page_num;
            await axios.post('./api/0/costItem/', vm.tdata)
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    //console.log(vm.tdata);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        itemCopy(){
            this.copyColumn = this.selectedColumn;
            this.copy_message = "Copy Info : "+ this.copyColumn.system_index +" Copyed";
        },
        async itemPaste(){
            this.modifyItem = JSON.parse(JSON.stringify(this.copyColumn));
            this.modifyItem.id = this.selectedColumn.id;
            this.modifyItem.input_mode = this.tdata.input_mode;

            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            console.log(vm.modifyItem);
            await axios.put('./api/'+vm.modifyItem.id+'/costItem/', vm.modifyItem)
                .then(function(res){
                    vm.column_mode = "";
                    vm.page(vm.tdata.active_page, vm.tdata.page_num );
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async getExcelForm(){
            //Excel Form 다운로드
            var vm = this;
            var error_check = false;
            this.showProgressModal = true;
            var config = {
                responseType: 'blob',
                params:{ 'input_mode': vm.tdata.input_mode,
                    'location_name2': vm.tdata.location_name2,
                    'inch': vm.tdata.inch,
                    'series_name': vm.tdata.series_name,
                    'tool_name': vm.tdata.tool_name,
                 }
            };
            await axios.get('./api/0/costExcelDownload/',config
                )
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

            await axios.delete('./api/0/costExcelDownload/', null )
                .then(function (res) { })
                .catch(function (err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;

        },
        async uploadExcel(){
            //엑셀 업로드
            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            loadingModalEl.show();
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.select_item.attache_files = [];
                vm.select_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.select_item.attache_files.push(response.svr_file_names[i]);
                    vm.select_item.attache_file_names.push(response.up_file_names[i]);
                }
                vm.select_item.input_mode = vm.tdata.input_mode;
                await axios.post('./api/0/excelSave/', vm.select_item )
                    .then(function(res){
                        //await loadFormMain();
                        vm.column_mode = "";
                        vm.page(vm.tdata.active_page, vm.tdata.page_num );
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            loadingModalEl.hide();
        },
        // Initial Excel Process
        async initialInit(){
            var vm=this;
            vm.switchData = 'initial';
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            await axios.get('./api/0/initialInfo/', null)
            .then(function(res){
                vm.initial_data = res.data;
            })
            .catch(function(err){
                warningModal.show_modal(err);
            });
            loadingModalEl.hide();
        },
        initialModify(){
            if(!this.initialselected){
                warningModal.show_modal("Please, select one.");
                return false;
            }
            this.initialItem = JSON.parse(JSON.stringify(this.initialselected));
            this.column_mode = "initial_modify";
        },
        async initialUpate(){
            var vm=this;
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            await axios.put('./api/'+vm.initialItem.id+'/initialInfo/', vm.initialItem)
            .then(function(res){
                vm.initial_data = res.data;
            })
            .catch(function(err){
                warningModal.show_modal(err);
            });
            loadingModalEl.hide();
            console.log(this.initialItem);
        },
        async logicInit(){
            var vm=this;
            vm.switchData = 'logic';
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            await axios.get('./api/0/logicInfo/', null)
            .then(function(res){
                vm.logic_data = res.data;
            })
            .catch(function(err){
                warningModal.show_modal(err);
            });
            loadingModalEl.hide();
        },
    },
    computed: {
        previous_text_color(){
            if( this.search_item.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.search_item.next_page == 0 )
                return "#ddd";
        },
    }

}).mount('#vue3-top-object')