<template>
    <div class="col py-2">
        <div v-for="cmt in comments_list" class="col hstack my-1" style="min-height:1.5rem;">
            <div class="col ms-3"> {{cmt.comments}} </div>
            <div class="hstack mx-3">
                <span class="me-2">{{cmt.create_date}}</span>
                <span v-if="this.$props.lang == 'kr'">{{cmt.owner_name}}</span>
                <span v-else>{{cmt.owner_name_en}}</span>
                <i v-if="cmt.owner_empno == this.$props.empno && this.$props.mode != 'modify'
                        && cmt == comments_list[comments_list.length -1] "
                    class="bi bi-x-square text-danger strong ms-3" @click="del_comments(cmt.id)"></i>
                <p v-else class="ms-3" style="width:14px;"></p>
            </div>
        </div>
        <div v-if="this.$props.mode != 'modify' && this.$props.acl >= 5" class="col hstack">
            <button class="btn btn-secondary ms-2 shadow" style="padding:0.1em 0.5em;"
                @click="switchComments">
                <i class="bi bi-chat-square-dots-fill"></i>
                <span class="ms-2">Add Comments</span>
            </button>
        </div>
        <div v-if="show_comments" class="col hstack" style="min-height:50px;">
            <div class="col p-2">
                <textarea ref="new_comments" class="form-control p-1 ps-2"></textarea>
            </div>
            <button class="btn btn-secondary mx-1 " type="button"
                style="width:100px; height:50px;" @click="add_comments">Add</button>
        </div>
    </div>
</template>

<script>
export default {
    props : ['site','lang','pid','acl','empno','mode'],
    data(){
        return {
            pid : this.$props.pid,
            comments_list : [],
            show_comments : false,
            comment_id : '',
        }
    },
    mounted(){
        this.load_comments();
    },
    methods : {
        switchComments(event){
            if(event) event.preventDefault();
            this.show_comments = !this.show_comments;
        },
        async load_comments(){
            var vm = this;
            await axios.get('./api/comments/'+vm.pid, null )
                 .then(function (res){
                     vm.comments_list = res.data.comments_list;
                 })
                 .catch(function (err){
                    try{ warningModal.show_modal(err); }catch(e){}
                 });
        },
        async add_comments(){
            if(this.$refs.new_comments.value == "")
                return;

            var vm = this;
            let formData = new FormData();
            formData.append('comments', vm.$refs.new_comments.value);
            await axios.post('./api/comments/'+vm.pid, formData )
                 .then(function (res){
                     vm.$refs.new_comments.value = "";
                     vm.comments_list = res.data.comments_list;
                 })
                 .catch(function (err){
                    try{ warningModal.show_modal(err); }catch(e){}
                 });
        },
        del_comments(cmt_id){
            this.comment_id = cmt_id;
            confirmModal.show_modal(this);
        },
        async modal_ok(){
            var vm = this;
            await axios.delete('./api/comments/'+vm.pid, { data:{ comments_id:vm.comment_id } })
                 .then(function (res){
                     vm.comments_list = res.data.comments_list;
                 })
                 .catch(function (err){
                    try{ warningModal.show_modal(err); }catch(e){}
                 });
        },
    },
}
</script>

