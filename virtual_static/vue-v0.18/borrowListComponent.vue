<template>

    <div class="my-1">
        <div class="col hstack">
            <div class="input-group me-1" style="width:200px;">
                <span class="input-group-addon input-group-text"> Division </span>
                <div class="form-control p-0">
                    <select v-model="target_div_name" class="form-select border-0"
                        @change="search_data" :disabled="div_list.length <= 1">
                        <option value="ALL">ALL</option>
                        <option v-for="div in div_list" :value="div">{{div}}</option>
                    </select>
                </div>
            </div>
            <div class="input-group mx-1" style="width:200px;">
                <span class="input-group-text" >PK</span>
                <input class="form-control shadow-sm" placeholder="Document ID"
                       v-model="document_id" @keyup.enter="search_data">
            </div>
            <div class="input-group mx-1" style="width:300px;">
                <span class="input-group-text" >Model Name</span>
                <input class="form-control shadow-sm" placeholder="Model Name"
                       v-model="model_name" @keyup.enter="search_data">
            </div>
            <div class="input-group me-1" style="width:300px;">
                <span v-if="lang=='kr'" class="input-group-addon input-group-text">요청자</span>
                <span v-else class="input-group-addon input-group-text">Requestor</span>
                <input class="form-control shadow-sm" placeholder="User Name"
                       v-model="request_user" @keyup.enter="search_data">
            </div>
            <div class="input-group mx-1" style="width:300px;">
                <span v-if="lang=='kr'" class="input-group-addon input-group-text">요청서 상태</span>
                <span v-else class="input-group-addon input-group-text">Status</span>
                <div class="form-control p-0">
                    <select v-model="status" class="form-select border-0" @change="search_data" >
                        <option value="">ALL</option>
                        <option value="Saved">Saved (+Rejected)</option>
                        <option value="In Progress">In Progress</option>
                        <option value="Approved">Approved</option>
                    </select>
                </div>
            </div>

            <button class="btn btn-primary ms-auto" style="width:100px;" @click="search_data">Search</button>
        </div>
        <form name="documentForm" method="get">
            <input type="hidden" name="div_name" :value="target_div_name">
        </form>
    </div>

    <div class="table-responsive">
        <table class="table table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr class="table-primary">
                    <th class="py-1 text-center text-nowrap">PK</th>

                    <th class="py-1 text-center  text-nowrap">Model Name</th>
                    <th class="py-1 text-center  text-nowrap">
                        <span v-if="lang=='kr'">요청자</span>
                        <span v-else>Requestor</span>
                    </th>
                    <th class="py-1 text-center  text-nowrap">
                        <span v-if="lang=='kr'">출고 요청일</span>
                        <span v-else>Request Date</span>
                    </th>
                    <th class="py-1 text-center  text-nowrap">
                        <span v-if="lang=='kr'">수량</span>
                        <span v-else>Qty.</span>
                    </th>
                    <th class="py-1 text-center  text-nowrap">
                        <span v-if="lang=='kr'">요청서 상태</span>
                        <span v-else>Req. Status</span>
                    </th>
                    <th class="py-1 text-center text-primary  text-nowrap">
                        <span v-if="lang=='kr'">출고일</span>
                        <span v-else>Release Date</span>
                    </th>
                     <th class="py-1 text-center text-primary  text-nowrap">
                        <span v-if="lang=='kr'">수량</span>
                        <span v-else>Qty.</span>
                    </th>
                     <th class="py-1 text-center text-primary  text-nowrap">
                        <span v-if="lang=='kr'">반납일</span>
                        <span v-else>Due Date</span>
                    </th>
                     <th class="py-1 text-center text-primary  text-nowrap">
                        <span v-if="lang=='kr'">수량</span>
                        <span v-else>Qty.</span>
                    </th>
                     <th class="py-1 text-center text-primary  text-nowrap">
                        <span v-if="lang=='kr'">반납 요청일</span>
                        <span v-else>Due Date</span>
                    </th>
                </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item,i in tdata.data_list" class="bg-opacity-25"
                    :class="{'bg-warning' : selected_item == item}">
                    <td class="py-1 text-start text-nowrap text-primary"
                        style="cursor:pointer" @click="viewDocument(item.parent)">
                        {{ item.parent }}-{{ item.id }}
                    </td>
                    <td class="py-1 text-start text-nowrap text-primary"
                        style="cursor:pointer" @click="viewDocument(item.parent)">
                        {{ item.model_name }}
                    </td>
                    <td class="py-1 text-center text-nowrap">
                        <span v-if="this.$props.lang == 'kr'">{{ item.user_name }}</span>
                        <span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap">{{ item.request_date }}</td>
                    <td class="py-1 text-center text-nowrap">{{ item.request_qty }}</td>
                    <td class="py-1 text-center text-nowrap">{{ item.request_status }}</td>
                    <td class="py-1 text-center text-nowrap"
                        style="cursor:pointer" @click="viewItem(item)">
                        {{ item.release_date }}
                    </td>
                    <td class="py-1 text-center text-nowrap bg-opacity-25"
                        :class="{'bg-danger' : item.release_qty > item.return_qty}"
                        style="cursor:pointer" @click="viewItem(item)">
                        <span v-if="item.release_date">{{ item.release_qty }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap"
                        style="cursor:pointer" @click="viewItem(item)">
                        <span v-if="item.return_sdate < item.return_edate">
                            {{ item.return_sdate }} ~ {{ item.return_edate }}
                        </span>
                        <span v-else>{{ item.return_sdate }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap bg-opacity-25"
                        :class="{'bg-danger' : item.release_qty > item.return_qty && item.return_qty > 0}"
                        style="cursor:pointer" @click="viewItem(item)">
                        <span v-if="item.return_sdate">{{ item.return_qty }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap"
                        style="cursor:pointer" @click="viewItem(item)">
                        <span v-if="item.request_next_app_step >=90">{{ item.due_date }}</span>
                    </td>
                </tr>
                <tr v-if="!tdata.data_list || tdata.data_list.length == 0">
                    <td colspan="50" class="text-center"> There is no data. </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div class="panel-footer mt-3">
        <div class="row">
            <div class="col-md-3 col-12" role="group">
                <div class="dropdown">
                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownNumberButton"
                        data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"> {{page_num}} </button>
                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNumberButton" style="min-width:50px;" >
                        <li><a class="dropdown-item" :class="{active: page_num == 10}" href="#" @click="page(tdata.active_page, 10, $event)">10</a></li>
                        <li><a class="dropdown-item" :class="{active: page_num == 20}" href="#" @click="page(tdata.active_page, 20, $event)">20</a></li>
                        <li><a class="dropdown-item" :class="{active: page_num == 50}" href="#" @click="page(tdata.active_page, 50, $event)">50</a></li>
                        <li><a class="dropdown-item" :class="{active: page_num == 100}" href="#" @click="page(tdata.active_page, 100, $event)">100</a></li>
                    </ul>
                    Total {{ tdata.total_article }} articles
                </div>
            </div>
            <div class="col-md-6 col-12">
                <ul class="pagination justify-content-center mb-0">

                    <li class="page-item" :class="{disabled : tdata.previous_page == 0}" >
                        <a class="page-link text-center mx-1 px-3" aria-label="Previous"
                           :style="{color:previous_text_color}"
                           href="#" @click="page(tdata.previous_page, page_num, $event)"> &Lang;&Lang; </a>
                    </li>

                    <li v-for="p in tdata.page_list" :class="['page-item', { active: tdata.active_page === p }]">
                        <a class="page-link" href="#" @click="page(p, page_num, $event)">{{ p }}</a>
                    </li>

                    <li class="page-item" :class="{disabled : tdata.next_page == 0}">
                        <a class="page-link text-center mx-1 px-3" aria-label="Next"
                           :style="{color:next_text_color}"
                            href="#"  @click="page(tdata.next_page, page_num, $event)"> &Rang;&Rang; </a>
                        </a>
                    </li>

                </ul>
            </div>
            <div class="col-md-3 col-12 text-end">
                <button v-if="this.$props.acl > 3 "
                        type="button" class="btn btn-primary shadow-sm" style="width:100px;" @click="newDocument">New</button>
            </div>
        </div>
    </div>

    <!-- Detail View Modal -->
    <div v-if="viewBorrowSetModal">
        <borrow-set-component
            ref="borrowSetComponent"
            :site="this.$props.site"
            :lang="this.$props.lang"
            :acl="this.$props.acl"
            :target_item="selected_item"
            :div_name="this.$props.div_name"
            :pmode="'mgmt'"
            @close-modal="closeBorrowSetModal"
            @add-item="addBorrowSet"
            @update-item="updateBorrowSet">
        </borrow-set-component>
    </div>

    <div v-if="contentsModal">
        <div class="vue_modal" style="z-index: 9991;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <button class="btn px-2 py-0" @click="popupWindow">
                            <i class="btn bi bi-layers text-white py-0" style="cursor:pointer"></i>
                        </button>

                        <h4 class="col">PV SET Borrow Request</h4>

                        <button type="button" class="btn-close btn-close-white" @click="contentsModal=false"></button>
                    </div>

                    <borrow-contents-component
                            ref="borrowContentsComponent"
                            :site="this.$props.site"
                            :lang="this.$props.lang"
                            :div_name="target_div_name"
                            :acl="this.$props.acl"
                            :doc_id="doc_id"
                            @update-document-id="updateDocId"
                            @close-modal="contentsModal=false"
                            @refresh-data="search_data">
                    </borrow-contents-component>

                </div>
            </div>
        </div>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal" class="vue_modal" style="z-index: 9991;">
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
var today = year + '-' + month  + '-' + day;

export default {
    props : ['site','lang','div_list','acl'],
    components: {
        'borrow-contents-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowContentsComponent.vue', vueLoaderOptions) ),
        'borrow-set-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/borrowSetComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            div_list : [],
            target_div_name : "",

            tdata : {},
            selected_item : {},
            page_num : 10,
            status : "",
            contentsModal : false,
            viewBorrowSetModal : false,
            showProgressModal : false,
            doc_id : 0,
        }
    },
    mounted(){
        var div_list = this.$props.div_list.split(",");
        for(var i=0; i<div_list.length; i++){
            this.div_list.push(div_list[i]);
        }
        this.target_div_name = this.div_list[0];
        this.page(1, this.page_num );
    },
    methods: {
        // emit function borrowContentsComponent
        updateDocId(id){
            this.doc_id = id;
        },
        // emit function borrowSetComponent
        closeBorrowSetModal(){
            this.viewBorrowSetModal = false;
        },
        updateBorrowSet(){
            this.viewBorrowSetModal = false;
            this.search_data();
        },
        viewItem(item){

            this.selected_item = item;
            this.viewBorrowSetModal = true;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/index', {
                    params:{
                        active_page: num ,
                        page_num : page_num,
                        status : vm.status,
                        div_name : vm.target_div_name,
                        request_user : vm.request_user,
                        document_id : vm.document_id,
                        model_name : vm.model_name,
                    }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        newDocument(){
            if(this.target_div_name == "ALL"){
                warningModal.show_modal("Please, select a specific division!");
                return;
            }
            this.doc_id = 0;
            this.contentsModal = true;
        },
        viewDocument(doc_id){
            this.doc_id = doc_id;
            this.contentsModal = true;
        },

        form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                var check_id = parseInt(e.parentElement.parentElement.parentElement.firstChild.firstChild.value);
                if(this.final_checked_ids.includes(check_id)){
                    if(e.value == ""){
                        warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                        return true;
                    }
                }
            }
        },
        async updateStock(){
            if(event) event.preventDefault();

            var final_checked_items = [];
            for(var i=0; i<this.edited_items.length; i++){
                var check_id = parseInt(this.edited_items[i].id);
                if(this.final_checked_ids.includes(check_id)){
                    final_checked_items.push(this.edited_items[i]);
                }
            }
            if(final_checked_items.length == 0){
                warningModal.show_modal("Please select one or more data.");
                return true;
            }

            this.showProgressModal = true;
            var vm = this;
            var response = {};
            await axios.put('./api/samplePCBList', final_checked_items )
                .then(function(res){
                    response = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    vm.showProgressModal = false;
                    return;
                });
            if(response.success && parseInt(response.success) > 0){
                vm.stockModal = false;
                vm.showProgressModal = false;
                vm.page(vm.tdata.active_page, vm.page_num);
            }else{
                vm.showProgressModal = false;
                warningModal.show_modal("There is no update item(s).");
            }
        },
        search_data(event){
            if(event) event.preventDefault();
            this.page(this.tdata.active_page, this.page_num );
        },


        async excelDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{
                    div_name : vm.target_div_name,
                    request_type : vm.request_type,
                    status : vm.status,
                    stocked_sdate : vm.stocked_sdate,
                    stocked_edate : vm.stocked_edate,
                    gpdm_request_no : vm.gpdm_request_no,
                    part_number : vm.part_number,
                    request_user : vm.request_user,
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/excelDownload', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "Sample_PCB.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/excelDownload',
                     { params : { div_name : vm.target_div_name } } )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        },
        popupWindow(){
            this.contentsModal = false;
            this.newWindow('1200','750','',"ehCForm");
            document.documentForm.target = "ehCForm";
            document.documentForm.action = "./document/"+this.doc_id;
            document.documentForm.submit();
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
    },
    computed:{
        previous_text_color(){
            if( this.tdata.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.tdata.next_page == 0 )
                return "#ddd";
        },
    },
}
</script>
