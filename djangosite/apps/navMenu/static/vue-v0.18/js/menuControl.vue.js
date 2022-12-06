axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');

const menuapp = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'menu-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/menuListComponent.vue', vueLoaderOptions) ),
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            menuMode : 'info',
            selectedMenu : {},
            rollbackMenu : {},
            aclList : [],
            selectedAcl : {},
            search_type : "USER",
            search_text : '',
            searchList : [],
            selectedSearchItem : {},
            newMenu : null,
            aclLevel : 1,
        };
    },
    computed:{
        activeAclCursor(){
            return(item)=>{
                if( item.parent_id == this.selectedMenu.id)
                    return 'pointer';
                return '';
            }
        },
    },
    methods: {
        menuSelected(item) {
            if(this.menuMode == 'move'){
                this.newMenu.parentId = item.id;
                this.newMenu.parentName = item.name;
                return;
            }

            if(this.menuMode == 'modify'){
                this.$refs.menuListComponent.roll_back(this.rollbackMenu);
                return;
            }

            this.selectedMenu = item;
            this.rollbackMenu = item;
            this.selectedAcl = {};
            if(!this.selectedMenu.id){
                this.aclList = [];
                return;
            }

            var vm = this;
            axios.get('./api/acl/'+item.id, null)
                .then(function(res){
                    vm.aclList = res.data.aclList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
        },
        selectAcl(item) {
            if(item.parent_id == this.selectedMenu.id)
                this.selectedAcl = item;
            else
                this.selectedAcl = {};
        },
        // emit of userSelectComponent
        targetSelected(stype,target){
            if(stype == "USER"){
                this.selectedSearchItem.id = target.EMAIL;
                this.selectedSearchItem.name = target.FULL_NAME;
                this.selectedSearchItem.name_en = target.NAME_ENG;
                this.selectedSearchItem.organ = target.OLD_ORG_NAME;
                this.selectedSearchItem.organ_en = target.ORGAN_NAME_ENG;
            }else if(stype == "ORG"){
                this.selectedSearchItem.id = target.ORGAN;
                this.selectedSearchItem.name = target.OLD_ORGAN_NAME;
                this.selectedSearchItem.name_en = target.ORG_ENG_NAME;
                this.selectedSearchItem.organ = null;
                this.selectedSearchItem.organ_en = null;
            }else if(stype == "OTHER"){
                this.selectedSearchItem.id = target.ORGAN;
                this.selectedSearchItem.name = target.OLD_ORGAN_NAME;
                this.selectedSearchItem.name_en = target.ORG_ENG_NAME;
                this.selectedSearchItem.organ = null;
                this.selectedSearchItem.organ_en = null;
            }
        },
        addMenu(){
            this.menuMode = 'add';
            this.newMenu = {'acl_inherit':true };
        },
        async save(){
            loadingModalEl.show();
            var vm = this;
            let formData = new FormData();
            formData.append('name', vm.newMenu.name);
            formData.append('aot', vm.newMenu.acl_inherit);
            formData.append('path', vm.newMenu.path);
            if(this.menuMode == 'add'){
                if(!vm.selectedMenu.id)
                    vm.selectedMenu.id = 0;
                await axios.post('./api/menuDetail/'+vm.selectedMenu.id, formData)
                    .then(function(res){
                        vm.menuMode = 'info';
                        vm.$refs.menuListComponent.addOpenMenuList();
                        vm.$refs.menuListComponent.loadData(res.data.addedMenu.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.menuMode == 'modify'){
                var oldMenuData = JSON.parse(JSON.stringify(this.selectedMenu));
                await axios.put('./api/menuDetail/'+vm.selectedMenu.id, formData)
                    .then(function(res){
                        vm.menuMode = 'info';
                        vm.$refs.menuListComponent.loadData(vm.selectedMenu.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });

                if(oldMenuData.level == 0){
                    if(oldMenuData.acl_inherit && ( vm.newMenu.acl_inherit == 'false' || vm.newMenu.acl_inherit == false))
                        location.reload();
                    if(!oldMenuData.acl_inherit && ( vm.newMenu.acl_inherit == 'true' || vm.newMenu.acl_inherit == true))
                        location.reload();
                }
            }else if(this.menuMode == 'move'){
                if(this.newMenu.parentId == null){
                    warningModal.show_modal("Please parent menu to move!");
                }else{
                    await axios.get('./api/menuDetail/'+vm.newMenu.id,
                        { params:{ pid: vm.newMenu.parentId ,} })
                        .then(function(res){
                            vm.menuMode = 'info';
                            vm.$refs.menuListComponent.loadData(vm.newMenu.id);
                            vm.$refs.menuListComponent.addOpenMenuList(vm.newMenu.parentId);
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }
            }
            loadingModalEl.hide();
        },
        modifyMenu(){
            this.menuMode = 'modify';
            this.newMenu = JSON.parse(JSON.stringify(this.selectedMenu));
            if(this.newMenu.acl_inherit == 1)
                this.newMenu.acl_inherit = "true";
            else
                this.newMenu.acl_inherit = "false";
        },
        removeMenu(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/menuDetail/'+vm.selectedMenu.id)
                .then(function(res){
                    vm.menuMode = 'info';
                    vm.$refs.menuListComponent.loadData();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        cancel(){
            this.$refs.menuListComponent.roll_back(this.rollbackMenu,false);
            this.menuMode = 'info';
            this.newMenu = null;
        },
        async moveOrder(position){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/menuDetail/'+vm.selectedMenu.id,
                { params:{ position: position ,} })
                .then(function(res){
                    vm.menuMode = 'info';
                    vm.$refs.menuListComponent.loadData('0');
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        moveMenu(){
            this.menuMode = 'move';
            this.newMenu = JSON.parse(JSON.stringify(this.selectedMenu));
            if(this.newMenu.acl_inherit == 1)
                this.newMenu.acl_inherit = "true";
            else
                this.newMenu.acl_inherit = "false";
        },
        async addAcl(){
            if(!this.selectedMenu.id){
                warningModal.show_modal("Please, select menu!");
                return;
            }
            if(!this.selectedSearchItem.id){
                warningModal.show_modal("Please, select User or Organization!");
                return;
            }
            var vm = this;

            let formData = new FormData();
            formData.append('acl_target', vm.selectedSearchItem.id);
            formData.append('acl_target_name', vm.selectedSearchItem.name);
            formData.append('acl_target_name_en', vm.selectedSearchItem.name_en);
            formData.append('acl_value', vm.aclLevel);
            if(vm.aclLevel == 1){   aclLevelName = "View";  }
            if(vm.aclLevel == 3){   aclLevelName = "Read";  }
            if(vm.aclLevel == 5){   aclLevelName = "Write";  }
            if(vm.aclLevel == 6){   aclLevelName = "Write (+)";  }
            if(vm.aclLevel == 7){   aclLevelName = "Management";  }
            if(vm.aclLevel == 8){   aclLevelName = "Management (+)";  }
            if(vm.aclLevel == 9){   aclLevelName = "Admin";  }
            formData.append('acl_value_name', aclLevelName);

            await axios.post('./api/acl/'+vm.selectedMenu.id , formData)
                .then(function(res){
                    vm.aclList = res.data.aclList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });

        },
        async removeAcl(){
            if(!this.selectedMenu.id){
                warningModal.show_modal("Please, select menu!");
                return;
            }
            if(!this.selectedAcl.id){
                warningModal.show_modal("Please, select Acl list!");
                return;
            }

            var vm = this;
            await axios.delete('./api/acl/'+vm.selectedMenu.id,
                { params:{ aclid: vm.selectedAcl.id , }} )
                .then(function(res){
                    vm.aclList = res.data.aclList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
        },
    },

})
menuapp.mount('#vue3-top-object')
