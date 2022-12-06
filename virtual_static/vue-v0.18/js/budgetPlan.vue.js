axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');
const init_year = document.currentScript.getAttribute('init_year');
const init_org_id = document.currentScript.getAttribute('init_org_id');
const init_org_name = document.currentScript.getAttribute('init_org_name');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'budget-plan-item-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanItemListComponent.vue', vueLoaderOptions) ),
        'budget-plan-summary-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanSummaryComponent.vue', vueLoaderOptions) ),
        'guideline-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/guidelineModalComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            mode : "",
            div_list : [],
            div_name : "",
            target_year : "",
            startMonth : 1,
            endMonth :12,
            check_child_org : false,
            switchData : 'table',
            selected_org : {},
            selected_account : {},

            modify_period : false,
            modify_period_display : "none",
            exceptionList : [],
            exception_user : {},
            planningDate: {},
            planningDateList : [],
            periodEditModal:false,
            maxHeight : 10000,
            guidelineModal : false,
        };
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
        if(init_org_id){
            this.selected_org.id = init_org_id;
            this.selected_org.org_name = init_org_name;
        }
        this.div_name = this.div_list[0];
        this.target_year = parseInt(init_year);
        this.loadPlanningPeriod();
    },
    methods: {
        // emit of exception user
        targetSelected(stype, item){
            this.exception_user = item;
        },
        // emit of organizationListComponent
        async orgSelected(item) {
            this.selected_org = item;
        },
        changeOrgChildCheck(check){
            this.check_child_org = check;
        },
        // emit of accountListComponent
        async accountSelected(item) {
            this.selected_account = item;
        },
        // emit of
        searchDetailItem(org, account, type, smonth, emonth, check_child_org){
            this.switchData = "table";
            this.preset_org_item = org;
            this.startMonth = smonth;
            this.endMonth = emonth;
            this.check_child_org = check_child_org;
        },
        contractHeight(){
            this.maxHeight = 600;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        changeSwitchData(sdata){
            this.switchData = sdata;
        },
        changeDiv(){
            if(this.$refs.budgetPlanItemListComponent){
                this.$nextTick(() => {
                    this.$refs.budgetPlanItemListComponent.clearOrgAndAccount();
                });
            }
            if(this.$refs.budgetPlanSummaryComponent){
                this.$nextTick(() => {
                    this.selected_org = {};
                    this.$refs.budgetPlanSummaryComponent.clearOrganization();
                });
            }
            this.loadPlanningPeriod();
        },
        changeYear(year){
            this.target_year = year;
            this.loadPlanningPeriod();
        },
        async loadPlanningPeriod(){
            if(event) event.preventDefault();
            var vm = this;
            await axios.get('./api/planningDate',
                    { params:{ div_name:vm.div_name, year:vm.target_year } })
                    .then(function(res){
                        vm.modify_period = false;
                        vm.planningDateList = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
        },
        async viewPlanningPeriod(){
            await this.searchException();
            this.modify_period=true;
            this.modify_period_display = "display";
        },
        planningPeriodVersionUp(){
            this.periodEditModal = true;
            if(this.planningDateList.length ==0){
                this.planningDate = { 'div_name':this.div_name, 'year':this.$target_year, 'version':1 };
            }else{
                this.planningDate = JSON.parse(JSON.stringify(this.planningDateList[this.planningDateList.length-1]));
                this.planningDate.sdate = "";
                this.planningDate.edate = "";
                this.planningDate.version += 1;
                this.planningDate.comments = "";
            }
            this.mode = "new";
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
                        vm.planningDate.sdate = date;
                    if(e.target.id == "edate")
                        vm.planningDate.edate = date;
                });
            });
        },
        async planningPeriodVersionDown(){
            if(this.planningDateList.length ==0){
                warningModal.show_modal("There is no data.");
                return;
            }
            confirmModal.set_title("Delete Version");
            confirmModal.set_contents("Are you sure to delete latest version?");
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var version = this.planningDateList[this.planningDateList.length-1].version;
            var vm = this;
            await axios.delete('./api/planningDate',
                    { params:{ div_name:vm.div_name, year:vm.target_year, version:version } })
                    .then(function(res){
                        vm.planningDateList = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            this.modify_period = false;
            loadingModalEl.hide();
            this.$refs.budgetPlanItemListComponent.changeTargetVersion();
        },
        planningPeriodModify(){
            if(this.planningDateList.length ==0){
                warningModal.show_modal("There is no data.");
                return;
            }
            this.periodEditModal = true;
            this.planningDate = JSON.parse(JSON.stringify(this.planningDateList[this.planningDateList.length-1]));
            var vm = this;
            this.mode = "modify";
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
                        vm.planningDate.sdate = date;
                    if(e.target.id == "edate")
                        vm.planningDate.edate = date;
                });
            });
        },
        async updatePlanningPeriod(){
            if(event) event.preventDefault();
            if(!this.planningDate.sdate){
                warningModal.show_modal("Please, input Start Date.");
                return;
            }
            if(!this.planningDate.edate){
                warningModal.show_modal("Please, input End Date.");
                return;
            }
            if(this.planningDate.sdate > this.planningDate.edate){
                warningModal.show_modal("The start date must be earlier than the end date.");
                return;
            }
            loadingModalEl.show();
            var vm = this;
            vm.planningDate.year = this.target_year;
            await axios.put('./api/planningDate', vm.planningDate )
                    .then(function(res){
                        vm.planningDateList = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            this.periodEditModal = false;
            this.modify_period = false;
            loadingModalEl.hide();

            this.$refs.budgetPlanItemListComponent.searchData();
        },
        async searchException(){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/planningException',
                    { params:{ div_name:vm.div_name } } )
                .then(function(res){
                        vm.exceptionList = res.data.exceptionList;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            loadingModalEl.hide();
        },
        async addException(){
            if(!this.exception_user.EMPLOYEE_NUMBER){
                warningModal.show_modal("Please, select target user.");
                return;
            }
            loadingModalEl.show();
            var vm = this;
            var data = vm.exception_user;
            data.div_name = vm.div_name;
            await axios.post('./api/planningException', data )
                .then(function(res){
                        vm.exceptionList = res.data.exceptionList;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            loadingModalEl.hide();
            if(this.$refs.userSelectComponent)
                this.$refs.userSelectComponent.clearTarget();
        },
        selectException(user){
            this.exception_user = user;
        },
        async deleteException(){
            if(!this.exception_user.id){
                warningModal.show_modal("Please, select target user.");
                return;
            }
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/planningException',
                { data : {id: vm.exception_user.id , div_name : vm.div_name } } )
                .then(function(res){
                        vm.exceptionList = res.data.exceptionList;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            loadingModalEl.hide();
            if(this.$refs.userSelectComponent)
                this.$refs.userSelectComponent.clearTarget();
        },
    },
    computed:{
        monthDay(){
            return (val) => {
                if(!val) return "";
                return val.substr(5,5);
            };
        },
    }

})
menuapp.mount('#vue3-top-object')
