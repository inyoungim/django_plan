axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
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
            page_mode : "list",
            active_item : {}
        }
    },
    mounted(){
        this.page_mode = "list";
        this.page(this.active_page, this.page_num );
    },
    methods: {
        new_page(){
            this.page_mode = "new";
            this.active_item = {};
        },
        async item_detail(item_id){
            loadingModalEl.show();
            this.active_item = {};
            var vm = this;
            await axios.get('./api/masterDetail/'+item_id, null)
                .then(function(res){
                    vm.active_item = res.data;
                    vm.page_mode = "detail";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            loadingModalEl.hide();
        },
        form_modify(event){
            if(event)
                event.preventDefault();
            this.page_mode = "modify";
        },
        form_cancel(event){
            if(event)
                event.preventDefault();
            this.item_detail(this.active_item.id);
        },
        form_validation(){
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
            await axios.post('./api/masterDetail/0', vm.active_item )
                    .then(function(res){
                        vm.page_mode = "detail";
                        vm.active_item = res.data;
                    })
                    .catch(function(err){
                        warningModal.show_modal(err);
                        return;
                    });
            this.page(this.active_page, this.page_num );
        },
        async form_update(event){
            if(event)
                event.preventDefault();
            if(this.form_validation())
                return false;

            var vm = this;
            loadingModalEl.show();
            await axios.put('./api/masterDetail/'+vm.active_item.id, vm.active_item )
                .then(function(res){
                    vm.page_mode = "detail";
                    vm.active_item = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    loadingModalEl.hide();
                    return;
                });
            loadingModalEl.hide();
            this.page(this.active_page, this.page_num );
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
                    //vm.page_mode = "list";
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
            this.page_mode = "list";
            this.page(this.active_page, this.page_num );
        }
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

