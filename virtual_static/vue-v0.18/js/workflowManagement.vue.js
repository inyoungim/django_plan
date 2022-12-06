axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'approval-line-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalLineComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            data_list : [],
            page_list : [],
            previous_page : 0,
            next_page : 0,
            active_page : 1,
            page_num : 10,
            total_article : 0,
            search_text : '',
            search_input : '',
            mode : "list",
            active_item : {},

            stageList : [],
            selectedStage : {},
            new_stage : "",
            new_option : "Mandatory",
            new_reject_stage : "",
            new_stage_type : "Request",
            menu_active :true,
            app_preset_1 : "",
            app_preset_2 : "",
        }
    },
    mounted(){
        this.mode = "list";
        this.page(this.active_page, this.page_num );
    },
    methods: {
        async reloadAppline(){
            if(this.$refs.approvalLineComponent){
                this.$refs.approvalLineComponent.setPresetItem1(this.app_preset_1);
                this.$refs.approvalLineComponent.setPresetItem2(this.app_preset_2);
                await this.$refs.approvalLineComponent.loadData();
            }
        },
        new_page(){
            this.mode = "new";
            this.active_item = {};
            this.active_item.id = 0;
            this.stageList = [];
            this.selectedStage = {};
        },
        async item_detail(item_id){
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/masterDetail/'+ item_id, null)
                .then(function(res){
                    vm.active_item = res.data;
                    vm.stageList = res.data.stageList;
                    vm.mode = "view";
                    vm.selectedStage = {};
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        form_modify(event){
            if(event)
                event.preventDefault();
            this.mode = "modify";
            this.selectedStage = {};
            this.$refs.approvalLineComponent.mode = "disable";
        },
        form_cancel(event){
            if(event)
                event.preventDefault();
            this.item_detail(this.active_item.id);
            this.$refs.approvalLineComponent.mode = "view";
        },
        form_validation(){
            var request_stage_count = 0;
            var distribution_stage_count = 0;
            for(var i=0; i<this.stageList.length; i++){
                if(this.stageList[i].stage_type == "Request")
                    request_stage_count += 1;
                if(this.stageList[i].stage_type == "Distribution")
                    distribution_stage_count += 1;
            }
            if(request_stage_count != 1){
                warningModal.show_modal("Request stage is needed 1 stage.");
                return true;
            }
            // Single Distribution Check
            //if(distribution_stage_count > 1){
            //    warningModal.show_modal("Distribution stage is not allowed 2 or more stage.");
            //    return true;
            //}

            var requiredElements = document.querySelectorAll("form")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        async form_submit(event){
            if(event)
                event.preventDefault();
            if(this.form_validation())
                return false;

            var vm = this;
            vm.active_item.stageList = vm.stageList;
            await axios.post('./api/masterDetail/0', vm.active_item )
                    .then(function(res){
                        vm.mode = "view";
                        vm.active_item = res.data;
                        vm.stageList = res.data.stageList;
                        vm.selectedStage = {};
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                    });
        },
        async form_update(event){
            if(event)
                event.preventDefault();
            if(this.form_validation())
                return false;

            var vm = this;
            loadingModalEl.show();
            vm.active_item.stageList = vm.stageList;
            await axios.put('./api/masterDetail/'+vm.active_item.id, vm.active_item )
                .then(function(res){
                    vm.mode = "view";
                    vm.active_item = res.data;
                    vm.stageList = res.data.stageList;
                    vm.selectedStage = {};
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });

            if(vm.mode == "view"){
                vm.$refs.approvalLineComponent.loadData();
            }
            loadingModalEl.hide();
        },
        form_delete(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            loadingModalEl.show();
            var vm = this;
            await axios.delete('./api/masterDetail/'+vm.active_item.id)
                .then(function(res){
                    vm.back_to_list();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        async page(num, page_num, event){
            if(event)
                event.preventDefault();
            document.activeElement.blur();
            loadingModalEl.show();
            var vm = this;
            await axios.get('./api/masterList', {
                    params:{
                        active_page: num ,
                        page_num : page_num,
                        search_text : vm.search_text,
                    }
                })
                .then(function(res){
                    vm.data_list = res.data.data_list;
                    vm.page_list = res.data.page_list;
                    vm.previous_page = res.data.previous_page;
                    vm.active_page = res.data.active_page;
                    vm.next_page = res.data.next_page;
                    vm.total_article = res.data.total_article;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        search_data(event){
            if(event)
                event.preventDefault();
            this.search_text = this.search_input;
            this.page(this.active_page, this.page_num );
        },
        back_to_list(event){
            if(event)
                event.preventDefault();
            this.active_item = {};
            this.page(this.active_page, this.page_num );
        },

        selectStageRow(stage){
            this.selectedStage = stage;
        },
        addStage(event){
            if(event)
                event.preventDefault();

            if(this.new_stage == ""){
                warningModal.show_modal("New Stage Name is empty.");
                return;
            }
            for(var i=0; i<this.stageList.length; i++){
                if(this.stageList[i].stage == this.new_stage){
                    warningModal.show_modal("Already exists same stage.");
                    return;
                }
            }

            var stage = {};
            stage.stage = this.new_stage;
            stage.option = this.new_option;
            stage.reject_stage = this.new_reject_stage;
            stage.stage_type = this.new_stage_type;
            var insertOK = false;
            for(var i=0; i<this.stageList.length; i++){
                if(this.stageList[i].stage == this.selectedStage.stage){
                    this.stageList.splice(i+1,0,stage);
                    insertOK = true;
                    i++;
                }
            }
            if(! insertOK)
                this.stageList.push(stage);
            this.selectedStage = stage;
            this.new_stage = "";
        },
        deleteStage(stage, event){
            for(var i=0; i<this.stageList.length; i++){
                if(this.stageList[i].stage == stage.stage){
                    this.stageList.splice(i,1);
                    this.selectedStage = {};
                    i--;
                }
            }
        },
    },
    computed:{
        previous_text_color(){
            if( this.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.next_page == 0 )
                return "#ddd";
        },
    },
})

app.mount('#vue3-top-object');

