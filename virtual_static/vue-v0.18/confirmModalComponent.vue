<template>
    <div v-if="showConfirmModal" class="vue_modal" style="z-index: 9999;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered">

            <div class="modal-content text-center">
            <div class="modal-header"
                 :class="{'bg-danger':confirm_type=='Confirm',
                        'bg-warning':confirm_type=='Warning','bg-info':confirm_type=='Info' }" style="cursor:move">
                <h5 class="modal-title w-100 text-light"> {{ confirm_title }} </h5>
            </div>
            <div class="modal-body">
                <div class="row align-items-center" style="min-height:100px;">
                    <div class="w-100">
                        <span v-html="confirm_message"></span>
                    </div>
                </div>
            </div>
            <div class="modal-footer">
                <div v-if="confirm_type == 'Confirm'" class="col text-center">
                    <div class="btn btn-danger me-4" style="width:100px;" @click="confirm">Confirm</div>
                    <div class="btn btn-secondary" style="width:100px;"  @click="hide">Cancel</div>
                </div>
                <div v-else class="col text-center">
                    <div class="btn btn-secondary me-4" style="width:100px;" @click="hide">OK</div>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    props : ['lang'],
    data(){
        return {
            confirm_lang : this.$props.lang,
            confirm_type : "Info",
            confirm_title : "Information",
            confirm_message : "",
            confirm_target : "",
            showConfirmModal : "",
        }
    },
    mounted(){
        if(!this.confirm_lang) this.confirm_lang = "kr";
    },
    methods: {
        setType(type){
            this.confirm_type = type;
            if(type == "Warning"){
                this.confirm_title = "Warning";
            }else if (type == "Confirm"){
                this.confirm_title = "Warning";
                if(this.confirm_lang == 'kr'){
                    this.confirm_message = "정말로 삭제 하시겠습니까?";
                }else{
                    this.confirm_message = "Are you sure to delete?";
                }
            }
        }
        show(){
            this.showConfirmModal = true;
        },
        confirm(){
            this.showConfirmModal = false;
            this.$emit('confirm', this.confirm_target );
        },
        hide(){
            this.showConfirmModal = false;
        },
    }
}
</script>
