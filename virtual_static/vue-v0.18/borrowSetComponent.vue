<template>

    <!-- New Item Modal -->
    <div class="vue_modal" style="z-index: 9990;">

        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Sample SET</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeFormModal"></button>
                </div>
                <div class="modal-body" id="form_borrow_set" style="min-height:100px;">
                    <div class="row">
                        <div class="col pt-1 px-2 mb-3">
                            <div class="hstack border-bottom border-primary">
                                <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                    <i class="bi bi-grid-3x3-gap-fill px-2"></i>
                                    <b>Request Information</b>
                                </div>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b>Model Name</b>
                                </label>
                                <div class="input-group-text form-control text-start p-0">
                                    <input type="text" class="form-control text-start border-0"
                                           :class="{'bg-white' :mode == 'view'}"
                                           name="Model Name" v-model="edit_item.model_name" readonly required>
                                    <button v-if="mode !='view'" class="input-group-text border-0 border-start"
                                        @click="modelSearch(edit_item.model_name)">
                                        <i class="bi bi-search"></i>
                                    </button>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">출고 요청일</b><b v-else>Request Date</b>
                                </label>

                                <div v-if="mode =='view'" class="form-control text-start">
                                    {{edit_item.request_date}}
                                </div>
                                <div v-else class="form-control text-start input-group date p-0" id="request_date">
                                    <input type="text" class="form-control text-start bg-white border-0"
                                           :name="[this.$props.lang == 'kr' ? '출고 요청일' : 'Request Date']"
                                           :disabled="mode == 'view'"
                                           v-model="edit_item.request_date" readonly required>
                                    <span class="input-group-addon input-group-text border-0">
                                        <i class="bi bi-calendar-date"></i>
                                    </span>
                                </div>
                            </div>
                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">수량</b><b v-else>Quantity</b>
                                </label>
                                <input type="text" class="form-control text-start bg-white"
                                       :name="[this.$props.lang == 'kr' ? '수량' : 'Quantity']"
                                       :disabled="mode == 'view'"
                                       v-model="edit_item.request_qty" required>
                            </div>

                            <div class="input-group mt-1">
                                <label class="input-group-text text-start text-wrap" style="width:160px;">
                                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                                    <b v-if="lang=='kr'">반납 예정일</b><b v-else>Due Date</b>
                                </label>
                                <div v-if="mode =='view'" class="form-control text-start">
                                    {{edit_item.due_plan_date}}
                                </div>
                                <div v-else class="form-control text-start input-group date p-0" id="due_plan_date">
                                    <input type="text" class="form-control text-start bg-white border-0"
                                           :name="[this.$props.lang == 'kr' ? '반납 예정일' : 'Due Date']"
                                           :disabled="mode == 'view'"
                                           v-model="edit_item.due_plan_date" readonly required>
                                    <span class="input-group-addon input-group-text border-0">
                                        <i class="bi bi-calendar-date"></i>
                                    </span>
                                </div>
                            </div>

                        </div>
                    </div>

                    <div v-if="item.request_next_app_step >= 90" class="row">
                        <div class="col my-3 px-2">
                            <borrow-set-management-component
                                    ref="borrowSetManagementComponent"
                                    :site="this.$props.site"
                                    :lang="this.$props.lang"
                                    :acl="this.$props.acl"
                                    :pmode="account_mode"
                                    :parent_id="item.id"
                                    @update-result="updateResult">
                            </borrow-set-management-component>
                        </div>
                    </div>
                </div>

                <div class="modal-footer">
                    <div v-if="(pmode == 'new' || pmode == 'modify') && mode == 'new'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Add Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeFormModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && mode == 'view'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="modifyFormModal">Modify Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeFormModal">Close</div>
                    </div>
                    <div v-else-if="(pmode == 'new' || pmode == 'modify') && mode == 'modify'" class="col">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="submitFormModal">Update Item</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="cancelFormModal">Cancel</div>
                    </div>
                    <div v-else class="col">
                        <div class="btn btn-secondary" style="width:100px;" @click="closeFormModal">Close</div>
                    </div>

                </div>
            </div>
        </div>
        <form name="submitForm" method="get"></form>
    </div>
    <!-- New Item Modal -->

    <div>
        <model-search-modal-component
                ref="modelSearchModalComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :search_string=""
                @select-target="selectedModel">
        </model-search-modal-component>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal" class="vue_modal" style="z-index: 9995;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered mx-auto" style="width:200px;">
            <div class="modal-content text-center">
                <div class="progress w-100">
                    <div class="progress-bar bg-success indeterminate3"></div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
var today = new Date();
var year = today.getFullYear();
var month = ('0' + (today.getMonth() + 1)).slice(-2);
var day = ('0' + today.getDate()).slice(-2);
var dateString = year + '-' + month  + '-' + day;
var today = new Date(dateString);

export default {
    props : ['site','lang','acl','pmode','target_item','div_name'],
    components: {
        'model-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/modelSearchModalComponent.vue', vueLoaderOptions) ),
        'borrow-set-management-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowSetManagementComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            item : this.$props.target_item,
            edit_item : {},
            showProgressModal : false,
        }
    },
    mounted(){
        if(!this.$props.target_item.model_name){
            this.mode = "new";
            this.activateEditMode();
            this.item.request_date = dateString;
        }
        this.edit_item = JSON.parse(JSON.stringify(this.item));
    },
    methods: {
        // emit function for modelSearchModalComponent
        selectedModel(item){
            this.edit_item.model_name = item.model_name;
        },
        // emit function for borrowSetManagementComponent
        updateResult(){
            this.$emit('update-item');
        },
        activateEditMode(){
            var vm = this;
            this.$nextTick(() => {
                $('.input-group.date').datepicker({
                    daysOfWeekHighlighted: "0",
                    todayHighlight: true,
                    autoclose: true,
                    language: this.$props.lang,
                    orientation: "bottom",
                }).on("changeDate", function(e) {
                    var date = e.target.getElementsByTagName('input')[0].value;
                    if(e.target.id == "request_date")
                        vm.edit_item.request_date = date;
                    if(e.target.id == "due_plan_date")
                        vm.edit_item.due_plan_date = date;
                });
            });
        },
        async modelSearch(text){
            this.$nextTick(() => {
                if(text){
                    this.$refs.modelSearchModalComponent.search_string = text;
                    this.$refs.modelSearchModalComponent.searchData();
                }else{
                    this.$refs.modelSearchModalComponent.openSearchModal();
                }
            });
        },
        form_validation(){
            var requiredElements = document.querySelector("#form_borrow_set").querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return true;
                }
            }
        },
        viewFormModal(){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
        },
        loadData(item){
            this.item = item;
            this.edit_item = JSON.parse(JSON.stringify(this.item));
        },
        async submitFormModal(){
            if(this.form_validation()) return false;
            if(this.mode == 'new'){
                this.edit_item.id = 0;
                this.$emit('add-item',this.edit_item);
            }else if(this.mode == 'modify'){
                this.$emit('update-item',this.edit_item);
            }
            this.mode = "view";
        },
        modifyFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "modify";
            this.activateEditMode();
        },
        cancelFormModal(event){
            if(event) event.preventDefault();
            this.edit_item = JSON.parse(JSON.stringify(this.item));
            this.mode = "view";
        },
        closeFormModal(event){
            if(event) event.preventDefault();
            this.mode = "view";
            this.$emit('close-modal');
        },
    },
    computed:{

    },
}
</script>
