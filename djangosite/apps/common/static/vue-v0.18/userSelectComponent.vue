<template>

    <div v-if="this.$props.pmode == 'simple' ">
        <button class="input-group-text" @click="searchUserOpen">
            <i class="bi bi-person-circle"></i>
        </button>
    </div>

    <div v-else class="input-group">
        <label class="input-group-text" style="width:100px;">
            <b v-if="search_user_type=='USER'">User</b>
            <b v-else-if="search_user_type=='ORG'">Organization</b>
            <b v-else-if="search_user_type=='OTHER'">Other</b>
        </label>
        <span v-if="target_item.EMAIL" class="form-control col text-nowrap" style="overflow:hidden" readonly>
            <span v-if="this.$props.lang == 'kr'">
                {{target_item.FULL_NAME}} {{target_item.JIKWI_NAME}} {{target_item.OLD_ORG_NAME}}
            </span>
            <span v-else>
                {{target_item.NAME_ENG}} {{target_item.JIKWI_NAME_ENG}} {{target_item.ORGAN_NAME_ENG}}
            </span>
        </span>
        <span v-else-if="target_item.ORGAN" class="form-control col text-nowrap" style="overflow:hidden" readonly>
            <span v-if="this.$props.lang == 'kr'">
                {{target_item.OLD_ORGAN_NAME}} ({{target_item.ORGAN}})
            </span>
            <span v-else>
                {{target_item.ORG_ENG_NAME}} ({{target_item.ORGAN}})
            </span>
        </span>
        <span v-else class="form-control col" readonly></span>

        <button v-if="this.$props.pmode == 'new'" class="input-group-text" @click="searchUserOpen">
            <i class="bi bi-person-circle"></i>
        </button>
    </div>


    <div v-if="showUserSearchListModal == 'show'" class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 v-if="search_user_type=='USER'" class="col">User Search</h4>
                    <h4 v-else-if="search_user_type=='ORG'" class="col">Organization Search</h4>
                    <h4 v-else-if="search_user_type=='OTHER'" class="col">Other Search</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeUserSearchListModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px; max-height:400px;">

                    <div class="hstack">
                        <div class="col-auto ms-auto">
                            <select v-model="search_user_type"
                                    class="form-select" :disabled="this.$props.stype" @change="changeType">
                                <option class="fw-bold" value="USER">User</option>
                                <option class="fw-bold" value="ORG">Org.</option>
                                <option class="fw-bold" value="OTHER">Other</option>
                            </select>
                        </div>
                        <div class="col-auto mx-1">
                            <input class="form-control" v-model="search_user_string"
                                :disabled="search_user_type == 'OTHER'" @keydown.enter.prevent="searchUser">
                        </div>
                        <div class="col-auto">
                            <button class="btn btn-primary shadow-sm" style="width:80px;"
                                    @click="searchUser">Search</button>
                        </div>
                    </div>

                    <div class="table-responsive p-0 mt-2">
                        <table v-if="search_user_type == 'USER' " class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-person-fill"></i></th>
                                    <th class="py-1 text-center" >Name</th>
                                    <th class="py-1 text-center" >Position</th>
                                    <th class="py-1 text-center" >E-Mail</th>
                                    <th class="py-1 text-center" >Organization</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="user in searchList" @click="setTarget(user)" style="cursor:pointer">
                                    <td class="py-1 text-center"><i class="bi bi-person-fill"></i></td>
                                    <td class="py-1 text-start">
                                        <span v-if="this.$props.lang == 'kr'">{{user.FULL_NAME}}</span>
                                        <span v-else>{{user.NAME_ENG}}</span>
                                    </td>
                                    <td class="py-1 text-start">
                                        <span v-if="this.$props.lang == 'kr'">{{user.JIKWI_NAME}}</span>
                                        <span v-else>{{user.JIKWI_NAME_ENG}}</span>
                                    </td>
                                    <td class="py-1 text-start">{{user.EMAIL}}</td>
                                    <td class="py-1 text-start">
                                        <span v-if="this.$props.lang == 'kr'">{{user.OLD_ORG_NAME}}</span>
                                        <span v-else>{{user.ORGAN_NAME_ENG}}</span>
                                    </td>
                                </tr>
                                <tr v-if="searchList.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>

                        <table v-else-if="search_user_type !=''" class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF;">
                                <tr>
                                    <th class="py-1 text-center" width="5%"><i class="bi bi-people-fill"></i></th>
                                    <th class="py-1 text-center" >Name</th>
                                    <th class="py-1 text-center" >Code</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="user in searchList" @click="setTarget(user)" style="cursor:pointer">
                                    <td class="py-1 text-center"><i class="bi bi-people-fill"></i></td>
                                    <td class="py-1 text-start">
                                        <span v-if="this.$props.lang == 'kr'">{{user.OLD_ORGAN_NAME}}</span>
                                        <span v-else>{{user.ORG_ENG_NAME}}</span>
                                    </td>
                                    <td class="py-1 text-start">{{user.ORGAN}}</td>
                                </tr>
                                <tr v-if="searchList.length == 0">
                                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                        <table v-else class="table table-bordered">
                            <tbody class="shadow-sm">
                                <tr height="100px" class="align-middle">
                                    <td class="py-1 text-center" colspan='10'> Please search data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col">
                        <button type="button" class="btn btn-secondary shadow-sm ms-1" style="width:100px"
                                @click="closeUserSearchListModal">Close</button>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal == 'show'" class="vue_modal" style="z-index: 9995;">
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
    props : ['site','lang','pmode','stype'],
    data(){
        return {
            searchList : [],
            search_user_type : "USER",
            search_user_string :"",
            searchedType : "",
            target_item : {},

            showUserSearchListModal : "",
            showProgressModal : "",
        }
    },
    mounted(){
        if(this.$props.stype){
            this.search_user_type = this.$props.stype;
        }
    },
    methods: {
        changeType(){
            this.searchList = [];
        },
        loadTarget(target){
            this.target_item = target;
        },
        searchUserOpen(event){
            if(event) event.preventDefault();
            this.searchList = [];
            this.search_user_string = "";
            this.showUserSearchListModal = "show";
        },
        closeUserSearchListModal(event){
            if(event) event.preventDefault();
            this.showUserSearchListModal = "";
        },
        async searchUser(event){
            if(event) event.preventDefault();
            this.showProgressModal = "show";
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/userinfo',
                { params:{ 'search_type': vm.search_user_type, 'search_text': vm.search_user_string }, })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchList = res.data.searchList;
                        vm.searchedType = vm.search_user_type;
                    }else{
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = "";
        },
        setTarget(user){
            this.target_item = user;
            this.showUserSearchListModal = "";
            this.$emit('select-target',this.searchedType, this.target_item);
        },
        clearTarget(){
            this.target_item = {};
            this.showUserSearchListModal = "";
        },
    }
}
</script>
