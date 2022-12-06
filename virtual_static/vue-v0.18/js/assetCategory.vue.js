axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';
const init_div_list = document.currentScript.getAttribute('div_list');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'asset-category-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/assetCategoryListComponent.vue', vueLoaderOptions) ),
        'approval-line-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalLineComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            mgtAMode : 'info',
            selectedAssetCategory : {},
            rollbackAssetCategory : {},
            newAssetCategory :{},
            delmode : "",
            switchData : "category",
            div_list : [],
            target_div_name : "",
            target_type : "Registration",
            maxHeight : 10000,
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
        // emit of assetCategoryListComponent
        assetCategorySelected(item) {
            if(this.mgtAMode == 'move'){
                this.newAssetCategory.parent_id = item.id;
                this.newAssetCategory.category_name = item.category_name;
                return;
            }
            if(this.mgtAMode == 'modify'){
                this.$refs.assetCategoryListComponent.roll_back(this.rollbackAssetCategory);
                return;
            }
            this.selectedAssetCategory = item;
            this.rollbackAssetCategory = item;
        },

        // function of Asset Category Management
        changeDiv(){
            if(this.$refs.assetCategoryListComponent){
                this.$nextTick(() => {
                    this.$refs.assetCategoryListComponent.div_name = this.target_div_name;
                    this.$refs.assetCategoryListComponent.searchData();
                });
            }
            if(this.$refs.approvalLineComponent){
                this.$nextTick(() => {
                    this.$refs.approvalLineComponent.preset_item1 = this.target_div_name;
                    this.$refs.approvalLineComponent.loadData();
                });
            }
        },
        changeType(){
            this.$nextTick(() => {
                this.$refs.approvalLineComponent.preset_item2 = this.target_type;
                this.$refs.approvalLineComponent.loadData();
            });
        },
        contractHeight(){
            this.maxHeight = 500;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        addAssetCategory(){
            this.mgtAMode = 'add';
            this.newAssetCategory = {};
            this.newAssetCategory.category_enable = true;
        },
        modifyAssetCategory(){
            this.mgtAMode = 'modify';
            this.newAssetCategory = JSON.parse(JSON.stringify(this.selectedAssetCategory));
        },
        async saveAssetCategory(){
            loadingModalEl.show();
            var vm = this;
            vm.newAssetCategory.div_name = vm.target_div_name;
            if(this.mgtAMode == 'add'){
                if(!vm.selectedAssetCategory.id)
                    vm.selectedAssetCategory.id = 0;
                await axios.post('./api/setAssetCategoryList/'+vm.selectedAssetCategory.id, vm.newAssetCategory)
                    .then(function(res){
                        vm.mgtAMode = 'info';
                        vm.$refs.assetCategoryListComponent.addOpenItemList(vm.selectedAssetCategory.id);
                        vm.$refs.assetCategoryListComponent.loadData(null,vm.selectedAssetCategory.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtAMode == 'modify'){
                await axios.put('./api/setAssetCategoryList/'+ vm.selectedAssetCategory.id, vm.newAssetCategory)
                    .then(function(res){
                        vm.mgtAMode = 'info';
                        vm.selectedAssetCategory = res.data.asset_category;
                        vm.$refs.assetCategoryListComponent.loadData(null,vm.selectedAssetCategory.id);
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
            }else if(this.mgtAMode == 'move'){
                if(this.newAssetCategory.parent_id == null){
                    warningModal.show_modal("Please select parent to move!");
                }else{
                    await axios.get('./api/setAssetCategoryList/'+ vm.newAssetCategory.id,
                        { params:{ pid: vm.newAssetCategory.parent_id ,} })
                        .then(function(res){
                            vm.mgtAMode = 'info';
                            vm.$refs.assetCategoryListComponent.loadData(null,vm.newAssetCategory.id);
                            vm.$refs.assetCategoryListComponent.addOpenItemList(vm.newAssetCategory.parent_id);
                        })
                        .catch(function(err){
                            warningModal.show_modal(err);
                        });
                }
            }
            loadingModalEl.hide();
        },
        removeAssetCategory(){
            this.delmode = "";
            confirmModal.show_modal(this);
        },
        removeAssetCategoryAll(event){
            if(event){
                event.preventDefault();
                event.stopPropagation();
            }
            this.delmode = "all";
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/setAssetCategoryList/'+ vm.selectedAssetCategory.id,
                { data :{ delmode:this.delmode } })
            .then(function(res){
                vm.mgtAMode = 'info';
                vm.$refs.assetCategoryListComponent.loadData();
            })
            .catch(function(err){
                warningModal.show_modal(err);
            });
            loadingModalEl.hide();
        },
        cancelAssetCategory(){
            this.$refs.assetCategoryListComponent.roll_back(this.newAssetCategory,false);
            this.mgtAMode = 'info';
        },
        async moveAssetCategoryOrder(position){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/setAssetCategoryList/'+ vm.selectedAssetCategory.id,
                { params:{ position: position ,} })
                .then(function(res){
                    vm.mgtAMode = 'info';
                    vm.$refs.assetCategoryListComponent.loadData(null,'0');
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        moveAssetCategory(){
            this.mgtAMode = 'move';
            this.newAssetCategory = JSON.parse(JSON.stringify(this.selectedAssetCategory));
        },

        // For Approval Line Management
        async changeDiv(){
            if(this.$refs.approvalLineComponent){
                this.$refs.approvalLineComponent.setPresetItem1(this.target_div_name);
                await this.$refs.approvalLineComponent.loadData();
            }
        },
    },
}).mount('#vue3-top-object')
