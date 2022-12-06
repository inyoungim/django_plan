<template>

    <div class="vstack align-top p-0 text-nowrap" style="overflow-x:auto">

        <div class="hstack">
            <div>
                <button v-if="this.$props.acl >= 7"
                        type="button" class="btn btn-success shadow-sm py-1"
                        @click="moveToReceiveList">Move to Receive list</button>
            </div>
            <div class="input-group-text ms-auto">{{this.$props.div_name}}</div>
            <div class="col-auto mx-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:100px;">Model Name</span>
                    <input class="form-control shadow-sm py-1" placeholder="Model Name"
                           v-model="search_model" @keyup.enter="searchData">
                </div>
            </div>
            <!--
            <div class="col-auto ms-1">
                <div class="input-group shadow-sm">
                    <span class="input-group-text pe-1" style="width:100px;">User Name</span>
                    <input class="form-control shadow-sm py-1" style="width:140px;"
                           placeholder="User Name" v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>
            -->
            <div class="col-auto">
                <button class="btn btn-primary shadow-sm" style="width:80px;" @click="searchData">Search</button>
            </div>
        </div>

        <div class="table-responsive p-0 mt-2">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                    <tr>
                        <th class="py-1 text-center text-nowrap">
                            <input class="form-check-input" type="checkbox"
                                   :class="{'bg-secondary':checkNotMatch}"
                                v-model="allChecked" @click="checkAItem">
                        </th>
                        <th class="py-1 text-center text-nowrap">Model Name</th>
                        <th class="py-1 text-center text-nowrap">Serial</th>
                        <th class="py-1 text-center text-nowrap">Chassis</th>
                        <th class="py-1 text-center text-nowrap">Grade</th>
                        <th class="py-1 text-center text-nowrap">Event</th>
                        <th class="py-1 text-center text-nowrap">Plan</th>
                        <th class="py-1 text-center text-nowrap">Result</th>
                        <th class="py-1 text-center text-nowrap">User Item</th>
                        <th class="py-1 text-center text-nowrap">User Name</th>
                        <th class="py-1 text-center text-nowrap">Organization</th>
                        <th class="py-1 text-center text-nowrap">Transfer Date</th>
                    </tr>
                </thead>
                <tbody v-for="item,i in tdata.itemList">
                    <tr class="bg-opacity-25">
                        <td class="py-1 text-center">
                            <input class="form-check-input" type="checkbox"
                                v-model="checked_items" :value="item">
                        </td>
                        <td class="py-1 text-center text-nowrap">{{item.MODEL_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.SERIAL_SEQ}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.CHASSIS_CODE}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.GRADE_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.EVENT_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.PLAN_ASSEMBLE_QTY}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.RESULT_ASSEMBLE_QTY}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.USER_ITEM_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.USER_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.ORGAN_NAME}}</td>
                        <td class="py-1 text-center text-nowrap">{{item.TRANSFER_DATE}}</td>
                    </tr>
                </tbody>
                <tfoot>
                    <tr>
                        <td colspan="100">
                            <div class="hstack mt-3">
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
                            </div>
                        </td>
                    </tr>
                </tfoot>
            </table>
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
    props : ['site','lang','acl','div_name'],
    data(){
        return {
            tdata : {},
            page_num : 10,
            active_page: 1,
            checked_items : [],
            allChecked : false,
            showProgressModal : false,
        }
    },
    mounted(){
        this.searchData();
    },
    watch : {
        div_name(nVal){
            this.searchData();
        }
    },
    methods: {
        async searchData(event){
            this.page(1, this.page_num);
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;

            await axios.get('./api/index',
                { params:{ active_page: num, page_num: page_num,
                           div_name: vm.$props.div_name,
                           search_model : vm.search_model,
                           search_user : vm.search_user, }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.checked_items = [];
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        checkAItem(event){
            this.checked_items = [];
            if(this.tdata.itemList){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(!this.allChecked){
                        this.checked_items.push(this.tdata.itemList[i]);
                    }
                }
            }
        },
        async moveToReceiveList(event){
            if(event) event.preventDefault();
            if(this.checked_items.length == 0){
                warningModal.show_modal("Please, select one or more items.");
                return false;
            }

            this.showProgressModal = true;
            var vm = this;
            var response_data = {};
            for(var i=0; i<vm.checked_items.length; i++){
                vm.checked_items[i].div_name = vm.$props.div_name;
            }
            await axios.post('./api/moveToReceiveList', vm.checked_items)
                .then(function(res){
                    vm.checked_items = {};
                    response_data = res.data;
                    vm.searchData();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
            this.mailing(response_data);
        },
        mailing(data){
            var vm = this;
            axios.post('./api/sendmail', data)
                .then(function(res){ })
            .catch(function(err){
                warningModal.show_modal(err);
            });
        },
    },
    computed:{
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.itemList){
                all_item_length = this.tdata.itemList.length;
            }
            if(this.checked_items.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_items.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
