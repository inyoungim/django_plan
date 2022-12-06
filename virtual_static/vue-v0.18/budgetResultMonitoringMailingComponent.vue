<template>
    <div class="hstack" style="overflow:auto">
        <div class="vstack col-6 align-top border rounded p-2 ms-2" style="overflow-x:auto">

            <div class="table-responsive">
                <div v-if="this.$props.acl >=7" class="hstack justify-content-end my-1">
                    <div class="col">
                        <user-select-component ref="userSelectComponent"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       :pmode="'new'"
                                       :stype="'USER'"
                                       @select-target="targetSelected">
                        </user-select-component>
                    </div>
                    <div class="btn btn-primary col-auto mx-1" style="width:80px;"
                         @click="updateMailingList('add')">Add</div>
                    <div class="btn btn-primary col-auto" style="width:80px;"
                         @click="updateMailingList('del')">Remove</div>
                </div>

                <table class="table table-hover table-bordered mb-0">
                    <thead style="background-color:#DDEEFF;position: sticky;top:0;">
                        <tr>
                            <th class="py-1 text-center" width="5%"><i class="bi bi-person-fill"></i></th>
                            <th class="py-1 text-start"> User Name </th>
                            <th class="py-1 text-center"> Mail Address </th>
                        </tr>
                    </thead>
                    <tbody v-for="user in mailing_list">
                        <tr class="bg-opacity-25" :class="{'bg-warning': selectedUser == user}"
                            style="cursor:pointer" @click="selectedUser=user">
                            <th class="py-1 text-center" width="5%"><i class="bi bi-person"></i></th>
                            <td class="py-1 text-start">
                                <span v-if="this.$props.lang=='kr'">{{user.user_name}}</span>
                                <span v-else>{{user.user_name_en}}</span>
                            </td>
                            <td class="py-1 text-start">{{user.user_email}}</td>
                        </tr>
                    </tbody>
                </table>
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
    props : ['site','lang','year','div_name','acl'],
    components: {
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mailing_list : [],
            selectedUser : {},
            targetUser : {},
            showProgressModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        // emit function
        targetSelected(stype, user){
            this.targetUser = user;
        },
        async loadData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/resultMonitoringMailingList',
                    { params:{  div_name : vm.$props.div_name, } }
                )
                .then(function(res){
                    vm.mailing_list = res.data.mailing_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
        async updateMailingList(mode){
            if(mode == "add"){
                if(this.targetUser.EMPLOYEE_NUMBER == undefined){
                    if(this.$props.lang=='kr'){
                        this.warning_message = "User 를 선택 하세요!";
                    }else{
                        this.warning_message = "Please, select a user.";
                    }
                    warningModal.show_modal(this.warning_message);
                    return;
                }
            }
            if(mode == "del"){
                if(this.selectedUser.user_empno == undefined){
                    if(this.$props.lang=='kr'){
                        this.warning_message = "User 를 선택 하세요!";
                    }else{
                        this.warning_message = "Please, select a user.";
                    }
                    warningModal.show_modal(this.warning_message);
                    return;
                }
            }

            this.showProgressModal = true;
            var vm = this;
            var data = {};
            if(mode == "add"){
                data.user = vm.targetUser;
            }else if(mode == "del"){
                data.user = vm.selectedUser;
            }
            data.div_name = vm.$props.div_name;
            data.mode = mode;
            await axios.put('./api/resultMonitoringMailingList', data)
                .then(function(res){
                    vm.mailing_list = res.data.mailing_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.selectedUser = {};
        },
    },
    computed:{

    },
}
</script>
