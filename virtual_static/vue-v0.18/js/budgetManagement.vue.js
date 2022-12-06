axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const init_div_list = document.currentScript.getAttribute('div_list');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'organization-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/organizationListComponent.vue', vueLoaderOptions) ),
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
        'account-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListComponent.vue', vueLoaderOptions) ),
        'account-plan-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountPlanOptionComponent.vue', vueLoaderOptions) ),
        'account-list-popup-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListPopupComponent.vue', vueLoaderOptions) ),
        'account-list-option-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountListOptionComponent.vue', vueLoaderOptions) ),
        'approval-user-group-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalUserGroupComponent.vue', vueLoaderOptions) ),
        'approval-user-group-division-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalUserGroupDivisionComponent.vue', vueLoaderOptions) ),
        'approval-user-group-organization-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalUserGroupOrganizationComponent.vue', vueLoaderOptions) ),
        'approval-user-group-account-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalUserGroupAccountComponent.vue', vueLoaderOptions) ),
        'approval-user-group-category-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalUserGroupCategoryComponent.vue', vueLoaderOptions) ),
        'approval-line-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalLineComponent.vue', vueLoaderOptions) ),
        'budget-option-tool-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/budgetOptionToolComponent.vue', vueLoaderOptions) ),
        'project-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/projectSelectComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            div_list : [],
            target_div_name : "",
            mgtOMode : 'info',
            selectedOrg : {},
            rollbackOrg : {},
            newOrg :{},
            mappingList : [],
            selectedMap : {},

            stype :"",
            target :{},

            mgtAMode : 'info',
            selectedAccount : {},
            rollbackAccount : {},
            newAccount :{},
            switchData : "org",

            delmode : "",
            appline_editable : true,
            maxHeight : 10000,
            userGroup : "",
            selected_user_group : {},
            showApprovalUserGroupComponent : false,
            user_group_list : [],
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
        orgSelected(item) {
            if(this.mgtOMode == 'move'){
                this.newOrg.parentId = item.id;
                this.newOrg.parent_name = item.org_name;
                return;
            }
            if(this.mgtOMode == 'modify'){
                this.$refs.organizationListComponent.roll_back(this.rollbackOrg);
                return;
            }

            this.selectedOrg = item;
            this.rollbackOrg = item;
            this.selectedMap = {};
            this.mappingList = [];

            if(!this.selectedOrg.id)
                return;

            this.loadMappedOrg();
        },
        // emit of userSelectComponent
        targetSelected(stype,target){
            if(stype == "USER"){
                this.target.org_code = target.EMAIL;
                this.target.nas_code = "";
                this.target.au_code = "";
                this.target.org_name = target.FULL_NAME;
                this.target.org_name_en = target.NAME_ENG;
            }else if(stype == "ORG"){
                this.target.org_code = target.ORGAN;
                this.target.nas_code = target.NAS_CODE;
                this.target.au_code = target.AU_CODE;
                this.target.org_name = target.OLD_ORGAN_NAME;
                this.target.org_name_en = target.ORG_ENG_NAME;
            }else if(stype == "OTHER"){
                this.target.org_code = target.ORGAN;
                this.target.nas_code = "";
                this.target.au_code = "";
                this.target.org_name = target.ORGAN;
                this.target.org_name_en = target.ORGAN;
            }
        },
        // emit of accountListComponent
        accountSelected(item) {
            if(this.mgtAMode == 'move'){
                this.newAccount.parentId = item.id;
                this.newAccount.parent_name = item.account_name;
                return;
            }
            if(this.mgtAMode == 'modify'){
                this.$refs.accountListComponent.roll_back(this.rollbackAccount);
                return;
            }

            this.selectedAccount = item;
            this.rollbackAccount = item;
            if(this.selectedAccount.id ){
                this.$refs.accountPlanOptionComponent.loadData(this.selectedAccount.id);
                this.$refs.accountListPopupComponent.loadData(this.selectedAccount.id);
                this.$refs.accountListOptionComponent.loadData(this.selectedAccount.id);
            }
            if(!this.selectedAccount.id)
                return;
        },
        // emit of projectSelectComponent
        setProject(project){
            this.newAccount.project_name = project.project_name;
            this.newAccount.project_code = project.project_code;
        },
        clearProject(){
            this.newAccount.project_name = "";
            this.newAccount.project_code = "";
        },

        // emit of approvalUserGroupComponent
        refreshUserGroupList(ug_list){
            this.user_group_list = ug_list;
        },

        // function of budget Organization Management
        changeDiv(){
            this.selectedCategory = {};
            this.selectedOrg = {};

            this.changeTab(this.switchData);
        },
        contractHeight(){
            this.maxHeight = 500;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        async changeTab(tab_name){
            this.switchData = tab_name;

            if(this.switchData == "usergroup"){
                if(event) event.preventDefault();
                loadingModalEl.show();
                var vm = this;
                await axios.get('./api/approvalUserGroups',
                        { params:{  div_name : vm.target_div_name } })
                    .then(function(res){
                        vm.user_group_list = res.data.itemList;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
                loadingModalEl.hide();

                if(this.user_group_list.length > 0){
                    this.userGroup = this.user_group_list[0].group_name;
                    this.selected_user_group = this.user_group_list[0];
                }else{
                    this.userGroup = "";
                    this.selected_user_group = {};
                }
            }
        },
        addOrg(){
            this.mgtOMode = 'add';
            this.newOrg = {};
        },
        modifyOrg(){
            this.mgtOMode = 'modify';
            this.newOrg = JSON.parse(JSON.stringify(this.selectedOrg));
        },
        async saveOrg(){
            loadingModalEl.show();
            var vm = this;
            vm.newOrg.div_name = vm.selectedOrg.div_name;
            vm.newOrg.year = vm.selectedOrg.year;
            if(this.mgtOMode == 'add'){
                if(!vm.selectedOrg.id)
                    vm.selectedOrg.id = 0;
                await axios.post('./api/setOrgList/'+vm.selectedOrg.id, vm.newOrg)
                    .then(function(res){
                        vm.mgtOMode = 'info';
                        vm.$refs.organizationListComponent.addOpenItemList(vm.selectedOrg.id);
                        vm.$refs.organizationListComponent.loadData(null,false,res.data.addedOrg.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtOMode == 'modify'){
                await axios.put('./api/setOrgList/'+vm.selectedOrg.id, vm.newOrg)
                    .then(function(res){
                        vm.mgtOMode = 'info';
                        vm.$refs.organizationListComponent.loadData(null,false,vm.selectedOrg.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtOMode == 'move'){
                if(this.newOrg.parentId == null){
                    warningModal.show_modal("Please select parent to move!");
                }else{
                    await axios.get('./api/setOrgList/'+vm.newOrg.id,
                        { params:{ pid: vm.newOrg.parentId ,} })
                        .then(function(res){
                            vm.mgtOMode = 'info';
                            vm.$refs.organizationListComponent.loadData(null,false,vm.newOrg.id);
                            vm.$refs.organizationListComponent.addOpenItemList(vm.newOrg.parentId);
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }
            }
            loadingModalEl.hide();
        },
        removeOrg(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            if(vm.switchData == 'org'){
                await axios.delete('./api/setOrgList/'+vm.selectedOrg.id, null)
                    .then(function(res){
                        vm.mgtOMode = 'info';
                        vm.$refs.organizationListComponent.loadData();
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else{
                await axios.delete('./api/setAccountList/'+vm.selectedAccount.id,
                    { data :{ delmode:this.delmode } })
                .then(function(res){
                    vm.mgtAMode = 'info';
                    vm.$refs.accountListComponent.loadData();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            }
            loadingModalEl.hide();
        },
        cancelOrg(){
            this.$refs.organizationListComponent.roll_back(this.rollbackOrg,false);
            this.mgtOMode = 'info';
            this.newOrg = null;
        },
        async moveOrgOrder(position){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/setOrgList/'+vm.selectedOrg.id,
                { params:{ position: position ,} })
                .then(function(res){
                    vm.mgtOMode = 'info';
                    vm.$refs.organizationListComponent.loadData(null,false,'0');
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        moveOrg(){
            this.mgtOMode = 'move';
            this.newOrg = JSON.parse(JSON.stringify(this.selectedOrg));
        },

        // operation of hr organization
        async loadMappedOrg(){
            loadingModalEl.show();
            this.target = {};
            this.$refs.userSelectComponent.clearTarget();
            var vm = this;
            await axios.get('./api/mappedList/'+vm.selectedOrg.id, null)
                .then(function(res){
                    vm.mappingList = res.data.mappingList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async addMappedOrg(){
            if(!this.selectedOrg.id){
                warningModal.show_modal("Please, select organization!");
                return;
            }
            if(!this.target.org_code){
                warningModal.show_modal("Please, select target organization!");
                return;
            }

            loadingModalEl.show();
            var vm = this;
            vm.mapData = {};
            vm.mapData = vm.target;
            vm.mapData.year = vm.selectedOrg.year;
            await axios.post('./api/mappedList/'+vm.selectedOrg.id, vm.mapData)
                .then(function(res){
                    vm.mappingList = res.data.mappingList;
                    vm.target = {};
                    vm.$refs.userSelectComponent.clearTarget();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async removeMappedOrg(){
            if(!this.selectedOrg.id){
                warningModal.show_modal("Please, select organization!");
                return;
            }
            if(!this.selectedMap.id){
                warningModal.show_modal("Please, select mapped organization!");
                return;
            }

            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/mappedList/'+vm.selectedMap.id, null)
                .then(function(res){
                    vm.mappingList = res.data.mappingList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },

        // function of budget Account Management
        addAccount(){
            this.mgtAMode = 'add';
            this.newAccount = {};
            this.newAccount.new_enable = true;
            this.newAccount.work_order_enable = false;
            this.newAccount.business_trip_enable = false;
            this.newAccount.minus_execution_enable = false;
            this.newAccount.correction_enable = false;
            this.newAccount.pcb_sample_cost_enable = false;
        },
        modifyAccount(){
            this.mgtAMode = 'modify';
            this.newAccount = JSON.parse(JSON.stringify(this.selectedAccount));
        },
        async saveAccount(){
            loadingModalEl.show();
            var vm = this;
            vm.newAccount.div_name = vm.target_div_name;
            if(this.mgtAMode == 'add'){
                if(!vm.selectedAccount.id)
                    vm.selectedAccount.id = 0;
                await axios.post('./api/setAccountList/'+vm.selectedAccount.id, vm.newAccount)
                    .then(function(res){
                        vm.mgtAMode = 'info';
                        vm.$refs.accountListComponent.addOpenItemList(vm.selectedAccount.id);
                        vm.$refs.accountListComponent.loadData(null,res.data.account.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtAMode == 'modify'){
                await axios.put('./api/setAccountList/'+vm.selectedAccount.id, vm.newAccount)
                    .then(function(res){
                        vm.mgtAMode = 'info';
                        vm.selectedAccount = res.data.account;
                        vm.$refs.accountListComponent.loadData(null,vm.selectedAccount.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtAMode == 'move'){
                if(this.newAccount.parentId == null){
                    warningModal.show_modal("Please select parent to move!");
                }else{
                    await axios.get('./api/setAccountList/'+vm.newAccount.id,
                        { params:{ pid: vm.newAccount.parentId ,} })
                        .then(function(res){
                            vm.mgtAMode = 'info';
                            vm.$refs.accountListComponent.loadData(null,vm.newAccount.id);
                            vm.$refs.accountListComponent.addOpenItemList(vm.newAccount.parentId);
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }
            }
            loadingModalEl.hide();
        },
        removeAccount(){
            this.delmode = "";
            confirmModal.show_modal(this);
        },
        removeAccountAll(event){
            if(event){
                event.preventDefault();
                event.stopPropagation();
            }
            this.delmode = "all";
            confirmModal.show_modal(this);
        },
        // modal_ok 는 **Org 와 ***Account 통합사용 해야 함
        cancelAccount(){
            this.$refs.accountListComponent.roll_back(this.rollbackAccount,false);
            this.mgtAMode = 'info';
            this.newArg = null;
        },
        async moveAccountOrder(position){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/setAccountList/'+vm.selectedAccount.id,
                { params:{ position: position ,} })
                .then(function(res){
                    vm.mgtAMode = 'info';
                    vm.$refs.accountListComponent.loadData(null,'0');
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        moveAccount(){
            this.mgtAMode = 'move';
            this.newAccount = JSON.parse(JSON.stringify(this.selectedAccount));
        },

        // For Approval Line Management
        async organizationSelectedForAppline(item){
            loadingModalEl.show();
            if(this.$refs.approvalLineComponent){
                this.$refs.approvalLineComponent.setPresetItem1(item.id);
                this.$nextTick(() => {
                    this.$refs.approvalLineComponent.loadData();
                });
            }
            this.selectedOrg = item;
            loadingModalEl.hide();
        },
        async accountSelectedForAppline(item){
            loadingModalEl.show();
            if(this.$refs.approvalLineComponent){
                this.$refs.approvalLineComponent.setPresetItem2(item.id);
                this.$nextTick(() => {
                    this.$refs.approvalLineComponent.loadData();
                });
            }
            this.selectedAccount = item;
            loadingModalEl.hide();
        },
        async copyChildAllAppline(){
            loadingModalEl.show();
            var vm = this;
            var data
            await axios.put('./api/copyChildAllAppline',
                { 'org_id' : vm.selectedOrg.id , 'account_id' : vm.selectedAccount.id })
                    .then(function(res){
                        warningModal.show_modal(res.data.message);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            loadingModalEl.hide();
            this.reloadAppline();
        },
        async copyToOrgAppline(){
            loadingModalEl.show();
            var vm = this;
            var data = { 'org_id' : vm.selectedOrg.id , 'account_id' : vm.selectedAccount.id,
                         'destination_id' : vm.destination_id }
            await axios.put('./api/copyToOrgAppline', data)
                    .then(function(res){
                        warningModal.show_modal(res.data.message);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            loadingModalEl.hide();
            this.reloadAppline();
        },
        async copyChildOrgAppline(){
            loadingModalEl.show();
            var vm = this;
            await axios.put('./api/copyChildOrgAppline',
                { 'org_id' : vm.selectedOrg.id , 'account_id' : vm.selectedAccount.id })
                    .then(function(res){
                        warningModal.show_modal(res.data.message);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            loadingModalEl.hide();
            this.reloadAppline();
        },
        async copyToAccountAppline(){
            loadingModalEl.show();
            var vm = this;
            var data = { 'org_id' : vm.selectedOrg.id , 'account_id' : vm.selectedAccount.id,
                         'destination_id' : vm.destination_id }
            await axios.put('./api/copyToAccountAppline', data)
                    .then(function(res){
                        warningModal.show_modal(res.data.message);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            loadingModalEl.hide();
            this.reloadAppline();
        },
        async copyChildAccountAppline(){
            loadingModalEl.show();
            var vm = this;
            await axios.put('./api/copyChildAccountAppline',
                { 'org_id' : vm.selectedOrg.id , 'account_id' : vm.selectedAccount.id })
                .then(function(res){
                        warningModal.show_modal(res.data.message);
                    })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
            this.reloadAppline();
        },
        manageUserGroup(){
            this.showApprovalUserGroupComponent = true;
        },
        changUserGroup(){
            for(var i=0; i<this.user_group_list.length; i++){
                if(this.user_group_list[i].group_name == this.userGroup){
                    this.selected_user_group = this.user_group_list[i];
                    break;
                }
            }
        },
    },
}).mount('#vue3-top-object')
