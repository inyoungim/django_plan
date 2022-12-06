axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');
const lang = document.currentScript.getAttribute('lang');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
       'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
    },
    data() {
        return {
            switchData : "input",
            column_mode : "view",
            select_item : {},
            active_page : 1,
            page_num : 10,
            page_mode : "new",
            period_list : ['202211','202210','202209','202208','202206', '202205', '202204', '202203'],
            period_name : "202210",
            data_list : [],
            chart_data : [],
            itemList : [],
            selectedItem : {},
            tdata : {},
            showProgressModal: false,
        }
    },
    mounted(){
//      담당별 필드를 구해올 것
        this.chart_data.labels = ['202202','202203','202204','202205','202206'];
        this.chart_data.datasets = [{'backgroundColor': 'transparent', 'borderColor': 'rgb(75, 192, 192)', 'label': 'Sound', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [500, 600, 600, 650, 650]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(255, 150, 150)', 'label': 'HDMI', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [800, 800, 800, 850, 850]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(150, 150, 255)', 'label': 'Wifi', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [300, 300, 320, 320, 310]}, {'backgroundColor': 'transparent', 'borderColor': 'rgb(255, 150, 255)', 'label': 'Dongle', 'fill': true, 'tension': 0.3, 'borderWidth': 2, 'data': [100, 100, 120, 120, 110]}];
        this.active_page = 1;
        this.page(this.active_page, this.page_num, null);
        this.loadChart();
    },
    methods: {
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/royaltySearch/0',
                { params:{ active_page: num, page_num: page_num, period_name : vm.period_name, } })
                .then(function(res){
                    vm.tdata = res.data;
                    console.log(vm.tdata);
                    vm.active_page = res.data.active_page;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async getExcelForm(){
            var vm = this;
            var config = { responseType: 'blob', };
            await axios.get('./api/royaltyFormExcelDownload',config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "royalty_form.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){ vm.errcheck = err;  });
        },
        loadChart(){
            let option1 = {
                plugins:{
                    legend:{
                        display: true,
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
            this.lineChart = new Chart(lineChart,{ type:'line', data:{},options:option1 });
            vm.lineChart.data = vm.chart_data;
            this.lineChart.update();
        },
        async adminInit(){
            this.switchData = 'admin';
            var vm = this;
            loadingModalEl.show();
            await axios.get('./api/columnItem/0', null)
                .then(function(res){
                    console.log(res.data.data_list);
                    vm.itemList = res.data.data_list;
                });
            loadingModalEl.hide();
        },
        async addItem(){
            //Item Add 수행할 것
            var vm = this;
            loadingModalEl.show();
            await axios.post('./api/columnItem/0', vm.select_item)
                .then(function(res){
                    vm.itemList = res.data.data_list;
                    vm.column_mode = "view";
                });
            loadingModalEl.hide();

        },
        selectItem(item ){
            var vm=this;
            vm.selectedItem = item;
        },
        addColumn(){
            this.column_mode='item_add';
            this.select_item = {};
        },
        excelUploadMode(){
            this.column_mode='excel_upload';
//            this.$refs.attachedFileComponent.attached_list = [];
            this.select_item.attached_files = [];
        },
        async downloadResultExcel(){
            var vm = this;
            vm.select_item.period_name = vm.period_name;
            vm.showProgressModal = true;
            var config = {
                responseType: 'blob',
                params:{ 'period_name': vm.period_name,
                 }
            };
            await axios.get('./api/uploadExcel/0',config)
                .then(function(res){
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "royalty_item_list.xlsx");
                    document.body.appendChild(link);
                    alert(link);
                    link.click();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            vm.showProgressModal = false;
        },
        async uploadResultExcel(){
            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            vm.showProgressModal = true;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.select_item.attache_files = [];
                vm.select_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.select_item.attache_files.push(response.svr_file_names[i]);
                    vm.select_item.attache_file_names.push(response.up_file_names[i]);
                }
                vm.select_item.column_mode = vm.column_mode;
                vm.select_item.period_name = vm.period_name;
                await axios.put('./api/uploadExcel/0', vm.select_item )
                    .then(function(res){
                        vm.column_mode = "view";
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            vm.showProgressModal = false;
        },
        async uploadExcel(){
            //파일 업로드 하는 내용 적을 것
            var vm = this;
            var response_id = 0;
            var response = {};
            response = await vm.$refs.attachedFileComponent.uploadStart(null);
            vm.showProgressModal = true;
            if( response.result == false ){
                warningModal.show_modal(response.err);
            }else{
                vm.select_item.attache_files = [];
                vm.select_item.attache_file_names = [];
                for(let i=0; i<response.svr_file_names.length; i++){
                    vm.select_item.attache_files.push(response.svr_file_names[i]);
                    vm.select_item.attache_file_names.push(response.up_file_names[i]);
                }
                vm.select_item.column_mode = vm.column_mode;
                vm.select_item.period_name = vm.period_name;
                await axios.post('./api/uploadExcel/0', vm.select_item )
                    .then(function(res){
                        vm.column_mode = "view";
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            vm.showProgressModal = false;
        },
    },
    computed: {

    }

}).mount('#vue3-top-object')