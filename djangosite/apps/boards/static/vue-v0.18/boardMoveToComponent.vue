<template>
    <div class="vstack align-top rounded p-0">
        <div style="min-height:150px; max-height:400px;">
            <table class="table table-hover table-bordered">
                <thead style="background-color:#DDEEFF;">
                    <tr>
                        <th class="py-1 text-center">Board ID</th>
                        <th class="py-1 text-center">Type</th>
                        <th class="py-1 text-center">Title</th>
                        <th class="py-1 text-center">Mailing List</th>
                    </tr>
                </thead>
                 <tbody v-for="(data,i) in tdata.data_list">
                    <tr v-if="tdata.current_bid == data.id" class="bg-danger bg-opacity-25">
                        <td class="py-1 text-center">{{data.id}}</td>
                        <td class="py-1 text-center">{{data.board_type}}</td>
                        <td class="py-1 text-start">{{data.name}}</td>
                        <td class="py-1 text-start">{{data.board_mailing}}</td>
                    </tr>
                    <tr v-else class="bg-opacity-25"
                        :class="{'bg-warning': selected_item == data}"
                        @click="selected_item = data"  @dblclick="dblClick" style="cursor:pointer">
                        <td class="py-1 text-center">{{data.id}}</td>
                        <td class="py-1 text-center">{{data.board_type}}</td>
                        <td class="py-1 text-start">{{data.name}}</td>
                        <td class="py-1 text-start">{{data.board_mailing}}</td>
                    </tr>
                    <tr v-if="tdata.data_list.length == 0">
                        <td class="py-1 text-center"  colspan='10'> There is no data. </td>
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
    props : ['site','lang','boardid'],
    data(){
        return {
            tdata : {},
            showProgressModal : false,
            selected_item : {},
            page_num : 10,
        }
    },
    async mounted(){
        this.page(1, this.page_num);
    },
    methods: {
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/moveAbleList',
                { params:{ active_page: num, page_num: page_num } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        setTarget(){
            this.selected_item = item;
        },
        dblClick(){
            this.$emit('dbl-click');
        }
    },
    computed:{
    },
}
</script>
