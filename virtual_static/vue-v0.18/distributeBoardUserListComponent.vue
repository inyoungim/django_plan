<template>

    <div class="hstack border-bottom border-primary align-items-end">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <div>
                <b>Distribution Users</b>
            </div>
        </div>
    </div>

    <div class="hstack border border-primary border-top-0 border-start-0 border-end-0 py-1">
        <div class="input-group" style="width:300px;">
            <i class="input-group-text bi bi-person-fill text-primary px-2" style="padding:0.1em 0.5em;"></i>
            <input class="form-control" style="width:100px; padding:0.1em 0.5em;" placeholder="Name"
                v-model="new_name" @keydown.enter.prevent="searchUser">
            <button class="btn btn-primary" style="padding:0.1em 0.5em;" @click="searchUser">Search & Add</button>
        </div>

        <div class="input-group ms-2" style="width:100px;">
            <button class="btn btn-danger" style="width:80px; padding:0.1em 0.5em;" @click="deleteUser">Delete</button>
        </div>
    </div>

    <div class="table-responsive m-0 p-0">
        <table class="table table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="col-auto py-1 text-center" width="10%">Name</th>
                    <th class="col-auto py-1 text-center" width="5%">Position</th>
                    <th class="col-auto py-1 text-center" width="10%">E-Mail</th>
                    <th class="col-auto py-1 text-center" width="10%">Organization</th>
                </tr>
            </thead>
            <tbody v-for="user in dist_users">
                <tr v-if="this.$props.lang == 'kr'"
                    class="bg-opacity-25" :class="{'bg-warning' : user == selectedUser}"
                    style="cursor:pointer" @click="selectedUser=user">
                    <td class="col-auto py-1 text-start">{{ user.name }}</td>
                    <td class="col-auto py-1 text-start">{{ user.position }}</td>
                    <td class="col-auto py-1 text-start">{{ user.email }}</td>
                    <td class="col-auto py-1 text-start">{{ user.organization }}</td>
                </tr>
                <tr v-else
                    class="bg-opacity-25" :class="{'bg-warning' : user == selectedUser}"
                    style="cursor:pointer" @click="selectedUser=user">
                    <td class="col-auto py-1 text-start">{{ user.name_en }}</td>
                    <td class="col-auto py-1 text-start">{{ user.position_en }}</td>
                    <td class="col-auto py-1 text-start">{{ user.email }}</td>
                    <td class="col-auto py-1 text-start">{{ user.organization_en }}</td>
                </tr>
            </tbody>
            <tbody v-if="dist_users.length == 0">
                <tr>
                    <td class="py-1 text-center"  colspan='10'> There is no data. </td>
                </tr>
            </tbody>
        </table>
    </div>

    <div v-if="showSearchUserModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">User Search Result</h5>
                    <button type="button" class="btn-close btn-close-white" @click="showSearchUserModal=false"></button>
                </div>
                <div class="modal-body" style="max-height:400px;">

                    <table class="table table-hover table-bordered">
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
                            <tr v-for="user in searchList" @click="addUser(user)" style="cursor:pointer">
                                <td class="py-1 text-center"><i class="bi bi-person-fill"></i></td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.FULL_NAME }} </div>
                                    <div v-else> {{ user.NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.JIKWI_NAME }} </div>
                                    <div v-else> {{ user.JIKWI_NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">{{ user.EMAIL }}</td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.OLD_ORG_NAME }} </div>
                                    <div v-else> {{ user.ORGAN_NAME_ENG }} </div>
                                </td>
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
    props : ['site','lang','acl'],
    data(){
        return {
            dist_users : [],
            searchList : [],
            selectedUser : {},
            showSearchUserModal : false,
            showProgressModal : false,
        }
    },
    methods: {
        async searchUser(event){
            if(event) event.preventDefault();

            this.showProgressModal = true;
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/bid_userinfo', { params:{ 'search_text': vm.new_name }, })
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
            if(this.searchList.length == 1){
                this.addUser(this.searchList[0]);
            }else if(this.searchList.length > 1){
                this.showSearchUserModal = true;
            }else{
                warningModal.show_modal("There is no result.");
            }
        },
        addUser(user){
            var new_user = {};
            new_user.empno = user.EMPLOYEE_NUMBER;
            new_user.email = user.EMAIL;
            new_user.name = user.FULL_NAME;
            new_user.position = user.JIKWI_NAME;
            new_user.organization = user.OLD_ORG_NAME;
            new_user.name_en = user.NAME_ENG;
            new_user.position_en = user.JIKWI_NAME_ENG;
            new_user.organization_en = user.ORGAN_NAME_ENG;

            for(var i=0; i<this.dist_users.length; i++){
                if(new_user.empno == this.dist_users[i].empno)
                    return;
            }
            this.dist_users.push(new_user);
            this.showSearchUserModal = false;
            this.new_name = "";
        },
        deleteUser(event){
            if(!this.selectedUser.empno){
                warningModal.show_modal("Please, select a row.");
                return;
            }
            for(var i=0; i<this.dist_users.length; i++){
                if(this.dist_users[i] == this.selectedUser){
                    this.dist_users.splice(i,1);
                    break;
                }
            }
        },
        getDistUsers(){
            return this.dist_users;
        }
    },
}
</script>
