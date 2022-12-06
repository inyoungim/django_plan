axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');
const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
       'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data() {
        return {
            div_list : [],
            div_name : "",
            page_mode : "new",
            switchData : "HQ_Save",
            po_pop : "",
            po_info : "",
            po_data : {},
            review_data: {},
            box_data : {},
            logistic_data : {},
            report_data : {},
            page_num : "",
            poselected : {},
            select_item: {},
            request_item : {},
            so_item : {},
            column_mode : "",
            chart_data : [],
            searchList : [],
            so_text : "",
            po_text : "",
            search_text : "",
            showProgressModal:false,
            max_acl : "",
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
        this.div_name = this.div_list[0];
        self = this;
        this.chart_data.labels = ['1','2','3','4','5'];
        this.chart_data.datasets = [{'backgroundColor': 'transparent', 'borderColor': 'rgb(75, 192, 192)', 'label': 'Total', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [0, 0, 2, 0, 0]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(255, 150, 150)', 'label': 'Rnd Input', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [0, 0, 1, 1, 0]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(150, 150, 255)', 'label': 'Assemble', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [0, 0, 0, 1, 1]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(255, 150, 255)', 'label': 'Transfer', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [0, 0, 2, 4, 5]}];
        this.loadChart();
        this.request_item.pay_yn = "Not";
        this.linupmode();
    },
    methods: {
        linupmode(){
            this.switchData = 'HQ_Save';
            this.poselected = {};
            this.page(1, 10, "HQ_Save" );
        },
        lineupNew(){
            this.column_mode = "lineup_new";
            this.so_item  = {};
        },
        lineupModify(){
            if(this.poselected.state == "HQ_Save"){
                this.column_mode = "lineup_modify";
                this.so_item = this.poselected;
            }else{
                warningModal.show_modal("This state isn't modify-able");
            }
            //여기서 Block 를 해야되는데.. 상태 체크 ㄱㄱ싱
            console.log(this.poselected);
        },
        lineupExcel(){
            this.column_mode = "lineup_excel";
            this.select_item = {};
        },
        async saveExcel(){
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
                await axios.post('./api/excelSave/0', vm.select_item )
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
        poNew(){
            this.request_item = {};
            this.column_mode= "new";
        },
        mailing(pk, mail_num, comments){
            var vm = this;

            var mail_obj = {};
            if(vm.comments != ""){
                mail_obj.comments = comments;
            }

            vm.column_mode = ""; // 팝업 닫기
            mail_obj.target_num = mail_num;
            vm.showProgressModal = true;
            axios.post('./api/sendmail/'+pk, mail_obj)
                .then(function(res){
                    warningModal.show_modal(res.data.msg);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            vm.showProgressModal = false;
        },
        poModify(){
            this.column_mode= "modify";
            this.request_item = this.poselected;
            if(this.request_item.state == "HQ_Save" && this.request_item.consigned_to==""){
                this.onPoSearch();
            }
        },
        poDelete(){
            if(event)
                event.preventDefault();
            this.request_item = this.poselected;
            confirmModal.show_modal(this);
        },
        setPo(po_info){
            var vm = this;
            vm.so_item.po_no = po_info.PURCHASE_ORDER_NO;
            vm.so_item.sales_order = po_info.ORDER_NO;
            vm.so_item.model_name = po_info.MODEL_CODE;
            vm.so_item.order_suffix = po_info.SUFFIX_CODE;
            vm.so_item.qty = po_info.ORDER_QTY;
            vm.so_item.flow_status_code = po_info.LINE_STATUS_CODE;
            vm.so_item.sales_department_name = po_info.SALES_DEPARTMENT_NAME;
            this.po_info = false;
        },
        setTarget(so_info){
            var vm = this;
            if(vm.switchData=="HQ_Save"){
                vm.so_item.sales_order = so_info.PO_NO;
                vm.so_item.model_name = so_info.MODEL;
                vm.so_item.order_suffix = so_info.ORDER_SUFFIX;
                vm.so_item.qty = so_info.QUANTITY;
                vm.so_item.flow_status_code = so_info.FLOW_STATUS_CODE;
            }else if (vm.switchData=="Plan_Save"){
                vm.request_item.sales_order = so_info.PO_NO;
                vm.request_item.buyer = so_info.BUYER_NAME;
                vm.request_item.model_name = so_info.MODEL;
                vm.request_item.qty = so_info.QUANTITY;
                vm.request_item.order_suffix = so_info.ORDER_SUFFIX;
                vm.request_item.cost = so_info.UNIT_SELLING_PRICE;
                vm.request_item.currency = so_info.UNIT_GUBUN;
                vm.request_item.transportation = so_info.TRANS_CONDITION;
                vm.request_item.purpose_request = so_info.ATTRIBUTE5;
                vm.request_item.shipping_mark = so_info.ATTRIBUTE6;
                vm.request_item.consigned_to = so_info.CONSIGNEE_ADD;
                vm.request_item.notify_party = so_info.NOTIFY_PARTY;
                if(vm.request_item.sales_order.startsWith("23")){
                    vm.request_item.pay_yn = "Pay";
                    vm.request_item.make_dept = "Assembly Room";
                }else{
                    vm.request_item.pay_yn = "Not";
                    vm.request_item.make_dept = "Engneering Room";
                }
            }
            this.po_pop = false;
        },
        async lineupDel(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            var id_info = vm.poselected.id

            if(vm.switchData == "lineup" && vm.poselected.state == "HQ_Save"){
                await axios.delete('./api/lineUp/'+id_info)
                .then(function(res){
                    vm.page(vm.po_data.active_page, vm.page_num, vm.poselected.state);
                    vm.column_mode = "lineup_del"
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }else if(vm.switchData == "input" && vm.poselected.state == "Plan_Save"){
                await axios.delete('./api/lineUp/'+id_info)
                .then(function(res){
                    vm.page(vm.po_data.active_page, vm.page_num, vm.poselected.state);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }else{
                warningModal.show_modal("This state can't delete");
            }
            this.showProgressModal = "";
        },
        async saveLinup(){
            if(event)
                event.preventDefault();
            var vm = this;
            var temp_item = {};
            vm.showProgressModal = true;
            vm.so_item.div_name = this.div_name;
            if(vm.so_item.sales_order!=undefined){
                vm.so_item.due_date = vm.$refs.due_date.value;
                if(vm.column_mode=='lineup_modify'){
                    await axios.put('./api/lineUp/'+vm.so_item.id, vm.so_item)
                    .then(function(res){
                        vm.page(vm.po_data.active_page, vm.page_num, vm.switchData);
                        vm.column_mode = "";
                        console.log(res.data);
                    })
                }else if(vm.column_mode=='lineup_new'){
                    await axios.post('./api/lineUp/0', vm.so_item)
                    .then(function(res){
                        vm.page(vm.po_data.active_page, vm.page_num, vm.switchData);
                        vm.column_mode = "";
                        console.log(res.data);
                    })
                }
            }else{
                warningModal.show_modal("Please input Sales Order NO");
                $("#po_no").focus();
                vm.showProgressModal = false;
            }
            vm.showProgressModal = false;
        },
        async searchPo(){
            if(event)
                event.preventDefault();
            var vm = this;
            this.showProgressModal = true;
            if(vm.po_text != ""){
                vm.request_item.order_no = vm.po_text;
                await axios.put('./api/getPoInfo/0', vm.request_item)
                .then(function(res){
                    console.log(res.data);
                    vm.searchList = res.data;
                })
            }
            this.showProgressModal = false;
        },
        async searchSo(){
            if(event)
                event.preventDefault();
            var vm = this;
            var temp_item = {};
            this.showProgressModal = true;
            if(vm.so_text != ""){
                vm.request_item.sales_order = vm.so_text;
                await axios.post('./api/getPoInfo/0', vm.request_item)
                .then(function(res){
                    vm.searchList = res.data;
                })
            }
            this.showProgressModal = false;
        },
        async saveNew(save_mode, isMail, to_num){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            vm.request_item.state = save_mode;
            vm.request_item.column_mode = this.column_mode;
            vm.request_item.switchData = this.switchData;
            if(this.column_mode== "new"){
                await axios.post('./api/saveOrder/0', vm.request_item)
                .then(function(res){
                    vm.column_mode = "";
                    warningModal.show_modal("Save Complete!");
                    if(isMail){
                        vm.mailing(res.data.data_list.id, to_num, save_mode)
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }else if(this.column_mode== "modify"){
                alert(vm.request_item.purpose_request);
                if(vm.request_item.purpose_request == undefined){
                    warningModal.show_modal("Please input Purpose Request");
                    return false;
                }
                var id = vm.request_item.id;
                await axios.put('./api/saveOrder/'+id, vm.request_item)
                .then(function(res){
                    vm.column_mode = "";
                    warningModal.show_modal("Modify Complete!");
                    if(isMail){
                        vm.mailing(id, to_num, save_mode)
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }else if(this.column_mode=="item_modify"){
                var id = vm.request_item.id;
                await axios.put('./api/saveOrder/'+id, vm.request_item)
                .then(function(res){
                    vm.column_mode = "";
                    warningModal.show_modal("Update Complete!");
                    if(isMail){
                        vm.mailing(id, to_num, save_mode)
                    }
                    if(vm.switchData == "hw_review"){
                        vm.review_page(1);
                    }else if(vm.switchData == "box_info"){
                        vm.box_page(1);
                    }else if(vm.switchData == "logistic"){
                        vm.logistic_page(1);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }

            loadingModalEl.hide();
        },
        async onPoSearch(){
            if(event)
                event.preventDefault();
            var vm = this;

            this.showProgressModal = true;
            if(vm.request_item.sales_order != undefined){
                await axios.post('./api/getPoInfo/0', vm.request_item)
                .then(function(res){
                    console.log(res.data);
                    if(res.data.length >= 1){
                        vm.request_item.buyer = res.data[0].BUYER_NAME;
                        vm.request_item.model_name = res.data[0].MODEL;
                        vm.request_item.qty = res.data[0].QUANTITY;
                        vm.request_item.order_suffix = res.data[0].ORDER_SUFFIX;
                        vm.request_item.cost = res.data[0].UNIT_SELLING_PRICE;
                        vm.request_item.currency = res.data[0].UNIT_GUBUN;
                        vm.request_item.transportation = res.data[0].TRANS_CONDITION;
                        vm.request_item.purpose_request = res.data[0].ATTRIBUTE5;
                        vm.request_item.shipping_mark = res.data[0].ATTRIBUTE6;
                        vm.request_item.consigned_to = res.data[0].CONSIGNEE_ADD;
                        vm.request_item.notify_party = res.data[0].NOTIFY_PARTY;
                        if(vm.request_item.sales_order.startsWith("23")){
                            vm.request_item.pay_yn = "Pay";
                            vm.request_item.make_dept = "Assembly Room";
                        }else{
                            vm.request_item.pay_yn = "Not";
                            vm.request_item.make_dept = "Engneering Room";
                        }

                    }else{
                        warningModal.show_modal("There is no data");
                    }
                })
            }else{
                warningModal.show_modal("Please Input Sales Order NO");
            }
            this.showProgressModal = false;
        },
        async page(num, page_num, state, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            vm.po_data.active_page = num;
            // 자 이제 해봅시다. ㅋㅋ
//            console.log(vm.tdata.active_page);
            vm.po_data.state = state;
            vm.po_data.sdate = vm.$refs.hq_sdate.value;
            vm.po_data.edate = vm.$refs.hq_edate.value;
            await axios.get('./api/saveOrder/0',
                { params:{ 'search_text': vm.search_text,
                'sdate':vm.po_data.sdate,
                'edate':vm.po_data.edate,
                'page_num': page_num,
                'state': state,
                'div_name': vm.div_name,
                'active_page':vm.po_data.active_page,
                 }, })
                .then(function(res){
                    vm.po_data = res.data;
                    vm.max_acl = res.data.max_acl;
                    vm.page_num = res.data.page_num;
//                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async review_page(num, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/saveOrder/0',
                {params:{
                'search_text':vm.search_text,
                'state':'Dev_Review',
                },})
                .then(function(res){
                    vm.review_data = res.data;
                    vm.max_acl = res.data.max_acl;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async box_page(num, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/saveOrder/0',
                {params:{
                'search_text':vm.search_text,
                'state':'Box_Review',
                },})
                .then(function(res){
                    vm.box_data = res.data;
                    vm.max_acl = res.data.max_acl;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async logistic_page(num, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/saveOrder/0',
                {params:{
                'search_text':vm.search_text,
                'state':'Logistic_Review',
                },})
                .then(function(res){
                    vm.logistic_data = res.data;
                    vm.max_acl = res.data.max_acl;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async report_page(num, event){
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            vm.po_data.sdate = vm.$refs.sdate.value;
            vm.po_data.edate = vm.$refs.edate.value;
            await axios.get('./api/saveOrder/0',
                {params:{
                'search_text':vm.search_text,
                'sdate':vm.po_data.sdate,
                'edate':vm.po_data.edate,
                'state':'',
                },})
                .then(function(res){
                    vm.max_acl = res.data.max_acl;
                    vm.report_data = res.data;
                    vm.chart_data = res.data.chartData;
                    vm.lineChart.data = res.data.chartData
                    vm.lineChart.update();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async loadChart(){
            let option1 = {
                plugins:{
                    legend:{
                        display: false,
                        position:'bottom'
                    }
                },
                // click event of "Chart data point"
                onClick: function(point, event) {
                    if(event.length <= 0) return;
                },
            };
            const lineChart = document.getElementById('lineChart');
            var vm = this;
            this.lineChart = new Chart(lineChart,{ type:'bar', data:{},options:option1 });
            vm.lineChart.data = vm.chart_data;
            this.lineChart.update();
        },
        async item_promote(str, mail_num){
            // 상태가 Plan Save 상태가 아니면 Input 상태에서는 Promote 할수 없도록 할 것
            // 아무것도 선택하지 않았을때는 왜이러냐고 Warning 할 것
            if(event)
                event.preventDefault();
            loadingModalEl.show();
            var vm = this;
            if(vm.poselected.id != undefined){
                console.log(vm.poselected.state);
                if(vm.poselected.state == "HQ_Save"){
                    loadingModalEl.hide();
                    warningModal.show_modal("Modify item First");
                    return ;
                }
                vm.poselected.state = str;
                var id_info = vm.poselected.id
                await axios.put('./api/itemPromote/'+id_info, vm.poselected)
                .then(function(res){
                    vm.column_mode = "";
                    if(vm.switchData == "hw_review"){
                        vm.review_page(1);
                        vm.mailing(id_info, mail_num, str);
                    }else if(vm.switchData == "box_info"){
                        vm.box_page(1);
                        vm.mailing(id_info, mail_num, str);
                    }else if(vm.switchData == "logistic"){
                        vm.logistic_page(1);
                        vm.mailing(id_info, mail_num, str);
                    }else{
                        vm.page(this.po_data.active_page, this.page_num, 'Plan_Save' );
                        vm.mailing(id_info, mail_num, str);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }else{
                warningModal.show_modal("Please Check one item");
            }
            loadingModalEl.hide();
        },
        search_data(){
            this.page(this.po_data.active_page, this.page_num,  this.switchData );
        },
        inputmode(){
            this.switchData = 'Plan_Save';
            this.poselected = {};
            this.page(this.po_data.active_page, this.page_num, "Plan_Save" );
        },
        hwreviewmode(){
            this.switchData = 'hw_review';
            this.poselected = {};
            this.review_page(1);
        },
        boxreviewmode(){
            this.switchData = 'box_info';
            this.poselected = {};
            this.box_page(1);
        },
        logisticreviewmode(){
            this.switchData = 'logistic'
            this.poselected = {};
            this.logistic_page(1);
        },
        reportmode(){
            this.switchData = 'report'
            this.poselected = {};
            this.report_page(1);
        },
        hwModify(){
            if(!this.poselected.id){
//                console.log(this.poselected);
                alert("Please Select One Item!");
                return false;
            }
            this.column_mode= "item_modify";
            this.request_item = this.poselected;
        },
    },
    computed: {
        message_refund : function(){
            if(this.request_item.refund_yn)
                return "Need return";
            else
                return "Not need return"
        }
    }

}).mount('#vue3-top-object')