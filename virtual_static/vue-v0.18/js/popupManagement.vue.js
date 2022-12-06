axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month  + '-' + day;
var today = new Date(dateString);

const app = Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
            'popup-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/popupComponent.vue', vueLoaderOptions) ),
            'menu-list-component': Vue.defineAsyncComponent(
                () => loadModule('/static/vue-v0.18/menuListComponent.vue', vueLoaderOptions) ),
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
            page_mode : "list",
            active_item : {},
            menuSelectModal : false,
            selectedMenu : {},
        }
    },
    mounted(){
        this.page_mode = "list";
        this.page(this.active_page, this.page_num );
    },
    methods: {
        openMenuSelectModal(event){
            if(event) event.preventDefault();
            this.menuSelectModal = true;
        },
        // emit for menuSelectModal
        menuSelected(item){
            this.selectedMenu = item;
        },
        targetMenuSelect(){
            this.active_item.target_id = this.selectedMenu.id;
            this.active_item.target_menu = this.selectedMenu.name;
            this.menuSelectModal = false;
        },
        targetMenuCancel(){
            this.menuSelectModal = false;
        },
        new_page(){
            this.page_mode = "new";
            this.active_item = {};
            this.$refs.sdate.value = "";
            this.$refs.edate.value = "";
        },
        async item_detail(item_id){
            loadingModalEl.show();
            this.active_item = {};
            var vm = this;
            await axios.get('./api/popupDetail/'+item_id, null)
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
            if(event) event.preventDefault();
            this.page_mode = "modify";
        },
        form_cancel(event){
            if(event) event.preventDefault();
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
            vm.active_item.popup_sdate = vm.$refs.sdate.value;
            vm.active_item.popup_edate = vm.$refs.edate.value;
            await axios.post('./api/popupDetail/0', vm.active_item )
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
            vm.active_item.popup_sdate = vm.$refs.sdate.value;
            vm.active_item.popup_edate = vm.$refs.edate.value;
            await axios.put('./api/popupDetail/'+vm.active_item.id, vm.active_item )
                .then(function(res){
                    vm.page_mode = "detail";
                    vm.active_item = res.data;
                })
                .catch(function(err){
                    loadingModalEl.hide();
                    warningModal.show_modal(err);
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
            await axios.delete('./api/popupDetail/'+vm.active_item.id)
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
            await axios.get('./api/popupList', {
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
        back_to_list(event){
            if(event)
                event.preventDefault();
            this.active_item = {};
            this.page_mode = "list";
            this.page(this.active_page, this.page_num );
        },
        viewPopup(event){
            if(event)
                event.preventDefault();

            if(this.active_item)
                this.$refs.popupComponent.loadData(id=this.active_item.parent_id);
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
        isInvalid(){
            return(item) => {
                var sdate = new Date(item.popup_sdate);
                var edate = new Date(item.popup_edate);
                if( sdate <= today && today <= edate)
                    return false;
                return true;
            }
        },
    },
})

app.mount('#vue3-top-object');

