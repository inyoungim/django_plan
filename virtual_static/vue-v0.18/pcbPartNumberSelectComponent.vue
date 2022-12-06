<template>

    <div class="col">
        <button class="input-group-text border-0" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">PCB Part Number Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="row my-1 justify-content-end">
                        <div class="col-auto">
                            <div class="input-group shadow-sm">
                                <label class="input-group-text">PCB Part Number</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                                <button class="btn btn-secondary shadow-sm" style="width:100px;" @click="searchData">Search</button>
                            </div>
                        </div>
                    </div>

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="5%"><i class="bi bi-check"></i></th>
                                <th class="py-1 text-center" >PCB Part No</th>
                                <th class="py-1 text-center" >Revision</th>
                                <th class="py-1 text-center" >State</th>
                                <th class="py-1 text-center" >Originator</th>
                            </tr>
                        </thead>
                         <tbody class="shadow-sm">
                            <tr v-for="data in searchList" @click="setTarget(data)" style="cursor:pointer">
                                <th class="py-1 text-center" width="5%"><i class="bi bi-check"></i></th>
                                <td class="py-1 text-start">{{data.PP_M1_NAME}}</td>
                                <td class="py-1 text-center">{{data.PP_M1_REVISION}}</td>
                                <td class="py-1 text-center">{{data.PP_M1_STATE}}</td>
                                <td class="py-1 text-center">{{data.PP_M1_ORIGINATOR}}</td>
                            </tr>
                            <tr v-if="searchList.length == 0">
                                <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                            </tr>
                        </tbody>
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
    props : ['site','lang','pmode'],
    data(){
        return {
            searchList : [],
            search_string :"",
            target_item : {},

            showSearchListModal : false,
            showProgressModal : false,
        }
    },
    methods: {
        loadTarget(target){
            this.target_item = target;
        },
        openSearchModal(event){
            if(event) event.preventDefault();
            this.searchList = [];
            this.search_string = "";
            this.showSearchListModal = true;
        },
        closeSearchModal(event){
            if(event) event.preventDefault();
            this.showSearchListModal = false;
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/pcbPartNumberSearch',
                { params:{ 'search_text': vm.search_string }, })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchList = res.data.searchList;
                    }else{
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
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
    }
}
</script>
