axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const lang = document.currentScript.getAttribute('lang');
const init_div_list = document.currentScript.getAttribute('div_list');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'organization-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationListComponent.vue', vueLoaderOptions) ),
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
        'budget-list-for-account-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetListForAccountComponent.vue', vueLoaderOptions) ),
        'budget-list-for-organization-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetListForOrganizationComponent.vue', vueLoaderOptions) ),
        'budget-graph-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetGraphComponent.vue', vueLoaderOptions) ),
        'budget-plan-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetPlanListComponent.vue', vueLoaderOptions) ),
        'budget-confirm-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetConfirmListComponent.vue', vueLoaderOptions) ),
        'budget-carry-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetCarryListComponent.vue', vueLoaderOptions) ),
        'budget-adjust-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetAdjustListComponent.vue', vueLoaderOptions) ),
        'budget-execute-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetExecuteListComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            div_list : [],
            target_div_name : "",
            mode : 'execution',
            switchData : 'org',
            orgListSwitch : true,
            accountListSwitch : true,
            selectedOrg : {},
            selectedAccount : {},
            maxHeight : 10000,
            start_month:1,
            end_month:12,
            search_status:'',
            checkChildOrganization : false,
            targetColumn : '',

            selectedOrgForTransferOfPlan : {},
            selectedOrgForTransferOfAssign : {},
            selected_count : 0,
            selected_cost:0,
            transfer_cost : 0,
            selected_objects : {},
            selected_delete_count :0,
            selected_delete_cost : 0,
            selected_delete_objects : {},
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
        this.target_div_name = this.div_list[0];
    },
    methods: {
        // emit of organizationListComponent
        async orgSelected(item) {
            this.selectedOrg = item;
            if(this.$refs.budgetListForAccountComponent){
                this.$refs.budgetListForAccountComponent.$props.selectedOrg = item;
                await this.$refs.budgetListForAccountComponent.loadData();
            }
        },
        // emit of accountListComponent
        async accountSelected(item,target_div_name) {
            this.selectedAccount = item;
            this.target_div_name = target_div_name;
            if(this.$refs.budgetListForOrganizationComponent){
                this.$refs.budgetListForOrganizationComponent.$props.selectedAccount = item;
                this.$refs.budgetListForOrganizationComponent.target_div_name = target_div_name;
                await this.$refs.budgetListForOrganizationComponent.loadData();
            }
        },
        // emit of budgetListForAccountComponent
        toggleOrgListSwitch(){
            if(this.orgListSwitch)
                $('#orgListSwitch').hide(100);
            else
                $('#orgListSwitch').show(100);
            this.orgListSwitch = !this.orgListSwitch;
        },
        // emit of budgetListForAccountComponent
        toggleAccountListSwitch(){
            if(this.accountListSwitch)
                $('#accountListSwitch').hide(100);
            else
                $('#accountListSwitch').show(100);
            this.accountListSwitch = !this.accountListSwitch;
        },
        // emit of budgetListForAccountComponent
        bfaSelected(org_item, acc_item, target, startMonth, endMonth, checkChildOrganization){
            this.selectedOrg = org_item;
            this.selectedAccount = acc_item;
            this.start_month = startMonth;
            this.end_month = endMonth;
            this.checkChildOrganization = checkChildOrganization;
            this.targetColumn = target;
            if(target == "closing_result"){
                this.search_status = "Approved";
                this.result_status = 1;
            }else if(target == "closing_waiting"){
                this.search_status = "Approved";
                this.result_status = 0;
            }else if(target == "execute_month"){
                this.search_status = "";
                this.result_status = 2;
            }

            // organizationListComponent 의 isOnAuCode switch
            if(this.$refs.organizationListComponent){
                if(this.targetColumn.includes('confirm')){
                    this.$refs.organizationListComponent.isOnAuCode = true;
                }else{
                    this.$refs.organizationListComponent.isOnAuCode = false;
                }
            }
            if(this.$refs.budgetListForOrganizationComponent){
                if(this.targetColumn.includes('confirm')){
                    this.$refs.budgetListForOrganizationComponent.isOnAuCode = true;
                }else{
                    this.$refs.budgetListForOrganizationComponent.isOnAuCode = false;
                }
            }

            if(this.$refs.budgetGraphComponent){
                this.$refs.budgetGraphComponent.startMonth = this.start_month;
                this.$refs.budgetGraphComponent.endMonth = this.end_month;
                this.$refs.budgetGraphComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetGraphComponent.parent_org_item = org_item;
                this.$refs.budgetGraphComponent.parent_acc_item = acc_item;
                this.$refs.budgetGraphComponent.reloadChart();
            }else if(this.$refs.budgetPlanListComponent){
                this.$refs.budgetPlanListComponent.startMonth = this.start_month;
                this.$refs.budgetPlanListComponent.endMonth = this.end_month;
                this.$refs.budgetPlanListComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetPlanListComponent.search_text = "";
                this.$refs.budgetPlanListComponent.loadData(org_item, acc_item, target);
            }else if(this.$refs.budgetConfirmListComponent){
                this.$refs.budgetConfirmListComponent.startMonth = this.start_month;
                this.$refs.budgetConfirmListComponent.endMonth = this.end_month;
                this.$refs.budgetConfirmListComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetConfirmListComponent.search_text = "";
                this.$refs.budgetConfirmListComponent.loadData(org_item, acc_item, target);
            }else if(this.$refs.budgetCarryListComponent){
                this.$refs.budgetCarryListComponent.startMonth = this.start_month;
                this.$refs.budgetCarryListComponent.endMonth = this.end_month;
                this.$refs.budgetCarryListComponent.target_column = this.targetColumn;
                this.$refs.budgetCarryListComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetCarryListComponent.search_text = "";
                this.$refs.budgetCarryListComponent.search_status = "";
                this.$refs.budgetCarryListComponent.loadData(org_item, acc_item);
            }else if(this.$refs.budgetAdjustListComponent){
                this.$refs.budgetAdjustListComponent.startMonth = this.start_month;
                this.$refs.budgetAdjustListComponent.endMonth = this.end_month;
                this.$refs.budgetAdjustListComponent.target_column = this.targetColumn;
                this.$refs.budgetAdjustListComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetAdjustListComponent.search_text = "";
                this.$refs.budgetAdjustListComponent.search_status = "";
                this.$refs.budgetAdjustListComponent.loadData(org_item, acc_item);
            }else if(this.$refs.budgetExecuteListComponent){
                this.$refs.budgetExecuteListComponent.startMonth = this.start_month;
                this.$refs.budgetExecuteListComponent.endMonth = this.end_month;
                this.$refs.budgetExecuteListComponent.target_column = this.targetColumn;
                this.$refs.budgetExecuteListComponent.checkChildOrganization = this.checkChildOrganization;
                this.$refs.budgetExecuteListComponent.search_text = "";
                this.$refs.budgetExecuteListComponent.search_status = this.search_status;
                this.$refs.budgetExecuteListComponent.result_status = this.result_status;
                this.$refs.budgetExecuteListComponent.loadData(org_item, acc_item);
            }
        },
        // emit of budgetPlanListComponent
        updateBudgetData(){
            if(this.$refs.budgetListForAccountComponent){
                this.$refs.budgetListForAccountComponent.loadData(null,0);
            }
            if(this.$refs.budgetListForOrganizationComponent){
                this.$refs.budgetListForOrganizationComponent.loadData(null,0);
            }
        },
        // emit of organizationListComponentForTransferOfAssign
        totalSelectedCost(count, sum, objs){
            this.selected_count = count;
            this.selected_cost = sum;
            this.transfer_cost = sum;
            this.selected_objects = objs;
        },
        // emit of budgetPlanListComponentForTransferOfAssign
        selectedDeletePlanItem(count, sum, objs){
            this.selected_delete_count = count;
            this.selected_delete_cost = sum;
            this.selected_delete_objects = objs;
        },
        // emit of organizationListComponentForTransferOfPlan
        async orgSelectedForTransferOfPlan(item){
            this.selectedOrgForTransferOfPlan = item;
            if(this.$refs.budgetPlanListComponentForTransferOfPlan){
                this.$refs.budgetPlanListComponentForTransferOfPlan.parent_org_item = item;
                await this.$refs.budgetPlanListComponentForTransferOfPlan.refreshPage();
            }
        },
        // emit of organizationListComponentForTransferOfAssign
        async orgSelectedForTransferOfAssign(item){
            this.selectedOrgForTransferOfAssign = item;
            if(this.$refs.budgetPlanListComponentForTransferOfAssign){
                this.$refs.budgetPlanListComponentForTransferOfAssign.parent_org_item = item;
                await this.$refs.budgetPlanListComponentForTransferOfAssign.refreshPage();
            }
        },
        // end of emit

        changeDiv(){
            this.selectedCategory = {};
            this.selectedOrg = {};
        },
        updateTrasferPlanData(){
            this.$refs.organizationListComponentForTransferOfPlan.refresh();
            this.$refs.organizationListComponentForTransferOfAssign.refresh();
        },

        changeSwitchData(sdata){
            this.switchData = sdata;
            this.targetColumn = "";
        },
        newExecution(){
            this.newWindow('1200','750','',"newExecutionForm");
            document.submitForm.target = "newExecutionForm";
            document.submitForm.action = "./execution/0/contents/";
            document.submitForm.submit();
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },

        async budgetPlaning(){
            loadingModalEl.show();
            if(this.$refs.budgetListForAccountComponent){
                this.$refs.budgetListForAccountComponent.selectedColumn = "";
            }
            if(this.$refs.budgetListForOrganizationComponent){
                this.$refs.budgetListForOrganizationComponent.selectedColumn = "";
            }
            this.switchData = "org";
            this.mode = "plan";
            if(this.$refs.organizationListComponent){
                this.$refs.organizationListComponent.targetYear = this.$refs.organizationListComponent.$props.year;
                await this.$refs.organizationListComponent.loadData(null,true);
            }
            loadingModalEl.hide();
        },
        async budgetExecuting(){
            loadingModalEl.show();
            if(this.$refs.budgetListForAccountComponent){
                this.$refs.budgetListForAccountComponent.selectedColumn = "";
            }
            if(this.$refs.budgetListForOrganizationComponent){
                this.$refs.budgetListForOrganizationComponent.selectedColumn = "";
            }
            this.switchData = "org";
            this.mode = "execution";
            if(this.$refs.organizationListComponent){
                this.$refs.organizationListComponent.targetYear = this.$refs.organizationListComponent.$props.year;
                await this.$refs.organizationListComponent.loadData(null,true);
            }
            loadingModalEl.hide();
        },
        contractHeight(){
            this.maxHeight = 300;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        async applyBudgetPlanTransfer(){
            if(!this.selectedOrgForTransferOfAssign.id){
                warningModal.show_modal("Please, select target organization.");
                return;
            }
            if(this.transfer_cost > this.selected_cost){
                warningModal.show_modal("Can not transfer cost over than total selected one.");
                return;
            }
            if(this.transfer_cost <= 0){
                warningModal.show_modal("Please, input transfer cost over than 0.");
                return;
            }

            if(this.selected_objects[0].year != this.selectedOrgForTransferOfAssign.year){
                warningModal.show_modal("Please, select next year one for target organization.");
                return;
            }

            loadingModalEl.show();
            var vm = this;
            var objects = JSON.parse(JSON.stringify(vm.selected_objects));
            if(vm.transfer_cost < vm.selected_cost){
                objects[0].new_transfer_cost = vm.transfer_cost;
            }
            await axios.put('./api/transferBudgetPlan/'+vm.selectedOrgForTransferOfAssign.id, objects )
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
            this.updateTrasferPlanData();
        },
        async deleteBudgetPlanTransfer(){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/transferBudgetPlan/' + vm.selectedOrgForTransferOfAssign.id,
                    { data : vm.selected_delete_objects } )
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
            this.updateTrasferPlanData();
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        cal_selected_cost(){
            return this.markedCost(this.selected_cost);
        },
        cal_transfer_cost(){
            return this.markedCost(this.transfer_cost);
        },
        cal_remain_cost(){
            if(this.selected_cost - this.transfer_cost > 0)
                return this.markedCost( this.selected_cost - this.transfer_cost);
            return 0;
        },
        monthDay(){
            return (val) => {
                if(!val) return "";
                return val.substr(5,5);
            };
        },
    }

})
menuapp.mount('#vue3-top-object')
