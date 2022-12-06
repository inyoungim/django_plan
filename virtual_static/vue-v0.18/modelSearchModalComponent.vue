<template>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Product Model Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="row my-1 justify-content-end">
                        <div class="col-auto">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">Model Name</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                            </div>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">Model Name</th>
                                <th class="py-1 text-center">Project Code</th>
                                <th class="py-1 text-center">Project Name</th>
                                <th class="py-1 text-center">Grade</th>
                                <!--
                                <th class="py-1 text-center text-nowrap">PV SET<br>(Standard Unit)</th>
                                <th class="py-1 text-center text-nowrap">PV SET<br>(Carried out Unit)</th>
                                -->
                                <th class="py-1 text-center">DIV_CODE</th>
                                <th class="py-1 text-center">Period</th>
                                <th class="py-1 text-center">Cost</th>
                            </tr>
                        </thead>
                         <tbody class="shadow-sm">
                            <tr v-for="(data,i) in tdata.searchList" @click="setTarget(data)" style="cursor:pointer">
                                <td class="py-1 text-start">{{data.model_name}}</td>
                                <td class="py-1 text-start">{{data.project_code}}</td>
                                <td class="py-1 text-start">{{data.project_name}}</td>
                                <td class="py-1 text-start">{{data.project_grade}}</td>
                                <!--
                                <td class="py-1 text-start">{{data.pv_set_std_unit}}</td>
                                <td class="py-1 text-start">{{data.pv_set_co_unit}}</td>
                                -->
                                <td class="py-1 text-center">{{data.div_code}}</td>
                                <td class="py-1 text-center text-nowrap">{{data.period_name}}</td>
                                <td class="py-1 text-end">{{ markedCost(data.model_cost) }}</td>
                            </tr>
                            <tr v-if="!tdata.searchList">
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
                <div class="modal-footer">
                    <div class="w-100">
                        Please, select one row.
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
    props : ['site','lang','pmode','search_string'],
    data(){
        return {
            tdata : {},
            search_string :this.$props.search_string,
            target_item : {},

            showSearchListModal : false,
            showProgressModal : false,
            page_num : 10,
        }
    },
    mounted(){
        if(this.$props.search_string)
            this.page(1, this.page_num );
    },
    methods: {
        loadTarget(target){
            this.target_item = target;
        },
        openSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
        },
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showSearchListModal = true;
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/modelSearch',
                { params:{ active_page: num, page_num: page_num, search_text : vm.search_string, } })
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
        async refreshPage(event){
            if(event) event.preventDefault();
            await this.page(this.tdata.active_page, this.page_num );
        },
        async searchData(event){
            if(event) event.preventDefault();
            await this.page(this.tdata.active_page, this.page_num );
        },
        setTarget(data){
            this.target_item = data;
            this.showSearchListModal = false;
            this.$emit('select-target', this.target_item);
        },
        clearTarget(){
            this.target_item = {};
            this.showSearchListModal = false;
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
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
