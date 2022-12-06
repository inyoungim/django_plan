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
                    <h4 class="col">Project Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeSearchModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">
                    <div class="hstack">
                        <div class="col-auto ms-auto">
                            <select v-model="target_div_name" class="form-select"
                                @change="searchData" :disabled="div_list.length <= 1">
                                <option v-for="div in div_list" :value="div">{{div}}</option>
                            </select>
                        </div>
                        <div class="col-auto mx-1">
                            <div class="input-group">
                                <label class="input-group-text">Project Code / Project Name</label>
                                <input class="form-control" v-model="search_string" @keydown.enter.prevent="searchData">
                            </div>
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
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-c-square"></i></th>
                                    <th class="py-1 text-center">Division Code</th>
                                    <th class="py-1 text-center">Project Name</th>
                                    <th class="py-1 text-center">Project Code</th>
                                </tr>
                            </thead>
                             <tbody class="shadow-sm">
                                <tr v-for="project in searchList" @click="setTarget(project)" style="cursor:pointer">
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-c-square"></i></th>
                                    <td class="py-1 text-start">{{project.div_name}}</td>
                                    <td class="py-1 text-start">{{project.project_name}}</td>
                                    <td class="py-1 text-start">{{project.project_code}}</td>
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
    props : ['site','lang','pmode','div_list','div_name'],
    data(){
        return {
            div_list : [],
            target_div_name : "",
            searchList : [],
            search_string :"",
            target_item : {},

            showSearchListModal : false,
            showProgressModal : false,
        }
    },
    mounted(){
        if(this.$props.div_name){
            this.target_div_name = this.$props.div_name;
            this.div_list = [this.target_div_name];
        }else if(this.$props.div_list){
            if(this.$props.div_list.includes(",")){
                var div_list = this.$props.div_list.split(",");
                for(var i=0; i<div_list.length; i++){
                    this.div_list.push(div_list[i]);
                }
            }else{
                this.div_list.push(this.$props.div_list);
            }
            this.target_div_name = this.div_list[0];
        }
    },
    watch : {
        div_name(nVal){
            this.target_div_name = nVal;
            this.div_list = [this.target_div_name];
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
            await axios.get('./api/projectSearch',
                { params:{ 'div_name': vm.target_div_name,  'search_text': vm.search_string }, })
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
