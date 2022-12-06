<template>

    <div class="col">
        <button class="input-group-text border-0" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Correction Target Execution Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="hstack my-1 justify-content-end">
                        <div class="ms-auto col-auto">

                                <label class="input-group-text">{{this.$props.div_name}}</label>

                        </div>
                        <div class="col px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Title</label>
                                <input class="form-control" v-model="title" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <div class="col px-1">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Creator</label>
                                <input class="form-control" v-model="creator" @keydown.enter.prevent="searchData">
                            </div>
                        </div>
                        <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">PK</th>
                                <th class="py-1 text-center" style="min-width:200px;">Title</th>
                                <th class="py-1 text-center">Organization</th>
                                <th class="py-1 text-center">Creator</th>
                                <th class="py-1 text-center text-nowrap">Create Date</th>
                                <th class="py-1 text-center text-nowrap">PCB P/N</th>
                                <th class="py-1 text-center text-nowrap">PCB Rev</th>
                                <th class="py-1 text-center text-nowrap">Total Cost</th>
                                <th class="py-1 text-center text-nowrap">Stocked Cost</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="item in tdata.itemList" class="bg-opacity-25"
                                style="cursor:pointer" :class="{'bg-warning': selectedItem.id == item.id}"
                                @click="selectedItem=item" @dblclick="selectSearchModal">
                                <td class="text-center text-primary text-nowrap">
                                    <span style="cursor:pointer" @click="viewBudgetItem(item)">
                                        {{item.parent}}-{{item.seq_no}}
                                    </span>
                                </td>
                                <td class="text-start text-nowrap" style="min-width:200px;">{{ item.title }}</td>
                                <td class="text-start text-nowrap">{{ item.org_name }}</td>
                                <td class="text-center text-nowrap">
                                    <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                                </td>
                                <td class="text-center text-nowrap">{{ item.create_date }}</td>
                                <td class="text-center text-nowrap">{{ item.pcb_part_number }}</td>
                                <td class="text-center text-nowrap">{{ item.pcb_part_revision }}</td>
                                <td class="text-end">{{ markedCost(item.total_cost) }}</td>
                                <td class="text-end">{{ markedCost(item.stocked_cost) }}</td>
                            </tr>
                            <tr v-if="!tdata.itemList || tdata.itemList.length == 0">
                                <td class="py-2 text-center" colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
                        <tfoot>
                            <tr>
                                <td colspan="100">
                                    <div class="hstack mt-3">
                                        <div class="col-md-3 col-12 text-start" role="group">
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
                                    </div>
                                </td>
                            </tr>
                        </tfoot>
                    </table>
                    <form name="correctSubmitForm" method="get"></form>
                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="selectSearchModal">Select</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeSearchModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
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
export default {
    props : ['site','lang','acl','div_name','account_code'],
    data(){
        return {
            tdata : {},
            selectedItem : {},
            targetItem : {},

            showSearchListModal : false,
            showProgressModal : false,
            page_num : 10,
        }
    },
    mounted(){
        //this.page(1,this.page_num);
    },
    methods: {
        openSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
            this.$emit('close-modal');
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/correctExecution',
                { params:{  div_name : vm.$props.div_name, active_page: num, page_num: page_num,
                            account_code : vm.account_code, title : vm.title, creator : vm.creator, } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        async searchData(event){
            if(event) event.preventDefault();
            await this.page(this.tdata.active_page, this.page_num );
        },
        selectSearchModal(){
            if(!this.selectedItem.id){
                warningModal.show_modal("Please, select a item.");
                return;
            }
            this.showSearchListModal = false;
            this.$emit('select-target', this.selectedItem);
        },
        newWindow(w,h,url,name){
            var winl = (screen.width - w) / 2;
            var wint = (screen.height - h) / 2;
            window.open(url,name,'statusbar=no,location=no,scrollbars=yes,status=yes,resizable=yes,width='+w+',height='+h+',top='+wint+',left='+winl)
        },
        viewBudgetItem(item, event){
            if(event) event.preventDefault();
            this.newWindow('1200','750','',"targetExecutionWindow"+item.parent);
            document.correctSubmitForm.target = "targetExecutionWindow"+item.parent;
            document.correctSubmitForm.action = "./"+item.parent;
            document.correctSubmitForm.submit();
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
        markedCost(){
            return (val) => {
                if(!val) return 0;
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
