<template>

    <div class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-lg modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Distribution </h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="cancelDistribute"></button>
                </div>
                <div class="modal-body" style="min-height:100px;" id="form_validation">
                    <div class="vstack">
                        <div class="hstack border-bottom border-primary align-items-end">
                            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
                                <b>Distribution Comments</b>
                            </div>
                        </div>
                        <div class="my-1">
                            <textarea class="form-control text-start bg-white"
                                      rows="3" class="form-select form-control text-start bg-white"
                                      name="Distribution Comments" v-model="distribution_comments" required>
                            </textarea>
                        </div>
                    </div>

                    <div class="col mt-1">
                        <distribute-board-user-list-component
                                ref="distributeUserListComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :acl="this.$props.acl">
                        </distribute-board-user-list-component>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="col">
                        <button type="button" class="btn btn-primary shadow-sm" style="width:100px"
                                @click="confirmDistribute">Distribute</button>
                        <button type="button" class="btn btn-secondary shadow-sm ms-1" style="width:100px"
                                @click="cancelDistribute">Cancel</button>
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
    props : ['site','lang','acl','doc_id'],
    components: {
        'distribute-board-user-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/distributeBoardUserListComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            showProgressModal : false,
            distribution_comments : "",
            doc_id : this.$props.doc_id,
        }
    },
    mounted(){;
        this.distribution_comments = "";
    },
    methods: {
        async confirmDistribute(event){
            if(!this.distribution_comments || this.distribution_comments == "" ){
                warningModal.show_modal("Please, input Distribution Comments.");
                return;
            }
            var dist_users = this.$refs.distributeUserListComponent.getDistUsers();
            if(!dist_users || dist_users.length == 0){
                warningModal.show_modal("Please, input distribute user.");
                return;
            }

            var mail_obj = {};
            mail_obj.comments = this.distribution_comments;
            mail_obj.to_list = dist_users;
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.post('./api/sendmail/'+this.doc_id, mail_obj )
                .then(function(res){
                    warningModal.show_modal(res.data.msg);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
            this.$emit('close-modal')
        },
        cancelDistribute(event){
            if(event) event.preventDefault();
            this.$emit('close-modal')
        },
    }
}
</script>
