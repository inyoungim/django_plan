<template>

    <div class="col">
        <button class="input-group-text" @click="openSearchModal">
            <i class="bi bi-search"></i>
        </button>
    </div>

    <div v-if="showSearchListModal" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">GPS Item Category Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="hstack">
                        <div class="col-auto ms-auto">
                            <label class="input-group-text">GPS Item Category</label>
                        </div>
                        <div class="col-auto mx-1">
                            <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary shadow-sm" style="width:80px;"
                                    @click="searchData">Search</button>
                        </div>
                    </div>

                    <div class="table-responsive p-0 mt-2">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-building"></i></th>
                                    <th class="py-1 text-center" >Item level1</th>
                                    <th class="py-1 text-center" >Item level2</th>
                                    <th class="py-1 text-center" >Item level3</th>
                                    <th class="py-1 text-center" >Item Category</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="data in searchList" @click="setTarget(data)" style="cursor:pointer">
                                    <td class="py-1 text-center"><i class="bi bi-person-fill"></i></td>
                                    <td class="py-1 text-start">{{data.LEVEL1_NAME}}</td>
                                    <td class="py-1 text-start">{{data.LEVEL2_NAME}}</td>
                                    <td class="py-1 text-start">{{data.LEVEL3_NAME}}</td>
                                    <td class="py-1 text-start">{{data.SRC_GRP_NAME}}</td>
                                </tr>
                                <tr v-if="searchList.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col">
                        <button type="button" class="btn btn-secondary shadow-sm ms-1" style="width:100px"
                                @click="closeSearchModal">Close</button>
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
            await axios.get('./api/gpsItemCategorySearch',
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
