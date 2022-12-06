axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
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

            detail_mode : "",
            targetType : "",
            target_item : {},
            showProgressModal:"",
            showFormModal : "",
        }
    },
    mounted(){
        this.page(this.active_page, this.page_num );
    },
    methods: {
        // new Register Modal Function //
        newRegister(){
            this.detail_mode = "new";
            this.target_item = {};
            this.target_item.order_no = 0;
            this.targetType = "";
            this.showFormModal = "show";

            this.$refs.userSelectComponent.loadTarget({});
        },

        // CRUD Function //
        // emit of userSelectComponent
        targetSelected(stype, target){
            var order_no = this.target_item.order_no;
            this.targetType = stype;
            this.target_item = target;
            this.target_item.order_no = order_no;
        },
        formValidation(){
            if (this.targetType == ""){
                warningModal.show_modal("Please input in [ Target ] field!");
                return true;
            }
            if (!this.target_item.div_name){
                warningModal.show_modal("Please input in [ Division ] field!");
                return true;
            }
            return false;
        },
        async submitFormModal(){
            if(this.formValidation()) return true;

            var vm = this;
            var error = "";
            await axios.post('./api/detail/0', vm.target_item )
                    .then(function(res){
                        vm.target_item = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        error = err;
                    });

            if(error == ""){
                this.showFormModal = "";
                this.back_to_list();
            }
        },
        closeFormModal(event){
            if(event) event.preventDefault();
            this.showFormModal = "";
        },

        async itemDetail(item_id){
            this.showProgressModal = "show";
            this.detail_mode = "view";
            this.target_item = {};
            var vm = this;
            await axios.get('./api/detail/'+item_id, null)
                .then(function(res){
                    vm.target_item = res.data;
                    vm.targetType = res.data.targetType;
                    vm.showFormModal = "show";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
            this.$refs.userSelectComponent.loadTarget(this.target_item);
        },
        modifyFormModal(){
            this.detail_mode = "modify";
        },
        async updateFormModal(){
            if(this.formValidation()) return true;

            var vm = this;
            var error = "";
            await axios.put('./api/detail/'+vm.target_item.id, vm.target_item )
                    .then(function(res){
                        vm.target_item = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        error = err;
                    });

            if(error == ""){
                this.page(this.active_page, this.page_num );
                this.detail_mode = "view";
            }
        },
        cancelFormModal(){
            this.detail_mode = "view";
        },
        deleteFormModal(){
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            this.showProgressModal = "show";
            var vm = this;
            await axios.delete('./api/detail/'+vm.target_item.id)
                .then(function(res){
                    vm.showFormModal = "";
                    vm.back_to_list();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
        },

        // page load Function //
        async page(num, page_num, event){
            if(event) event.preventDefault();
            document.activeElement.blur();
            loadingModalEl.show();
            this.detail_mode = "";
            var vm = this;
            await axios.get('./api/list/', {
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
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        search_data(event){
            if(event) event.preventDefault();
            this.search_text = this.search_input;
            this.page(this.active_page, this.page_num );
        },
        back_to_list(event){
            if(event) event.preventDefault();
            this.target_item = {};
            this.page(this.active_page, this.page_num );
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

