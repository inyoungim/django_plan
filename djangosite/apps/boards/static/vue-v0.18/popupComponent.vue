<template>

    <div v-for="item in article">
        <div v-if="showPopupModal == 'show'" :id="item.id" class="vue_modal" style="z-index: 9990;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-xl modal-dialog-scrollable px-5">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <div class="col"></div>
                        <div class="col"><h4 class="col">Notice</h4></div>
                        <div class="col text-end">
                            <span class="mx-1 py-1">( {{item.popup.popup_sdate}} ~ {{item.popup.popup_edate}} )</span>
                            <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal(item.id)"></button>
                        </div>
                    </div>
                    <div class="modal-body">
                        <div class="row">
                            <div class="col input-group">
                                <label class="input-group-text" style="width:100px;"><b>Title</b></label>
                                <label class="form-control text-start">{{item.title}}</label>
                            </div>
                        </div>
                        <div class="row mt-1" >
                            <div class="col input-group">
                                <span class="input-group-text" style="width:100px;"><b>Content</b></span>
                                <div class="form-control text-start" style="min-height:400px;">
                                    <note-contents v-html="item.contents"></note-contents>
                                </div>
                            </div>
                        </div>

                        <div class="input-group mt-1">
                            <label class="input-group-text" style="width:100px;"><b>Attached</b></label>
                            <div class="col border">
                                <div v-if="dprogress > 0" class="border p-2 progress" style="height:20px;">
                                    <button class="btn btn-warning btn-sm mx-1" @click="cancelDownload"> Download Cancel </button>
                                    <div class="progress-bar bg-primary" role="progressbar" :style="{width: dprogress + '%'}" aria-valuenow="0">{{ dprogress }}%</div>
                                </div>
                                <div class="input-group px-2 pt-1" v-for="f in item.attached_files">
                                    <div class="p-0">
                                        <a href="#" class="link-primary text-decoration-none" @click="file_download(f.id, f.display_name)">{{ f.display_name }}</a>
                                        ({{ markedSize(f.file_size) }})
                                    </div>
                                </div>
                            </div>
                        </div>

                    </div>
                    <div class="modal-footer">
                        <div class="col-auto">
                            <div v-if="!this.$props.manage_mode" class="form-check form-switch">
                              <input class="form-check-input" type="checkbox" role="switch" :id="'disablePopup'+item.id"
                                v-model="'disablePopup'+item.id" @click="checkDp(item.id)">
                              <label class="form-check-label" :for="'disablePopup'+item.id">Do not open anymore</label>
                            </div>
                        </div>
                        <div class="col-auto ms-auto">
                            <div class="btn btn-secondary" style="width:100px;" @click="closeModal(item.id)">Close</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

</template>

<script>
let cancelTokenSource = axios.CancelToken.source();
export default {
    props : ['site','lang','menuid','urlpath','manage_mode'],
    data(){
        return {
            showPopupModal : "",
            article : {},
            active_index : 0,
            active_check_id : "",
            dprogress : 0,
        }
    },
    mounted(){
        if(this.$props.urlpath == '/')
            this.loadData();
        else
            this.loadData();
    },
    methods: {
        async loadData(id=""){
            var vm = this;
            vm.active_index = 0;
            await axios.get('/'+this.$props.site+'/apps/common/api/loadPopup',
                { params:{ 'popupid': id, 'menuid': vm.$props.menuid, 'urlpath': vm.$props.urlpath }, } )
                .then(function(res){
                    vm.article = res.data;
                    if(vm.article.length > 0)
                        vm.showPopupModal = "show";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            for(var i=0; i<vm.article.length; i++){
                if(i == 0 ){
                    vm.active_index = i;
                    $('#'+vm.article[i].id).fadeIn(500);
                }else{
                    $('#'+vm.article[i].id).fadeToggle(1);
                }
            }
        },
        checkDp(id){
            if(this.active_check_id == id)
                this.active_check_id = ""
            else
                this.active_check_id = id ;
        },
        closeModal(id){
            if(this.active_index < this.article.length){
                $('#'+id).fadeToggle(500);
                this.active_index += 1;
            }

            if(this.active_index < this.article.length)
                $('#'+this.article[this.active_index].id).fadeToggle(500);

            var data = { check_id : this.active_check_id };
            axios.put('/'+this.$props.site+'/apps/common/api/loadPopup', data)
                .catch(function (err){ vm.errcheck = err;  });
            this.active_check_id = ""
        },
        async file_download(file_id, file_name){
            var vm = this;
            var config = {
                responseType: 'blob',
                cancelToken: cancelTokenSource.token,
                onDownloadProgress: function(progressEvent) {
                    vm.dprogress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            };

            await axios.get('/'+this.$props.site+'/apps/common/api/popupFileDownload/'+file_id, config)
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', file_name);
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){ vm.errcheck = err;  });
            vm.dprogress = 0;
        },
        cancelDownload(){
            cancelTokenSource.cancel();
            cancelTokenSource = axios.CancelToken.source();
        },
    },
    computed:{
        markedSize(){
            return (data) => {
                var fsize = "";
                if (data < 1024) fsize = data + " B";
                else if (data < 1024 * 1024) fsize = parseInt (data / 1024) + " KB";
                else if (data < 1024 * 1024 * 1024) fsize = parseInt (data / (1024 * 1024)) + " MB";
                else fsize = parseInt (data / (1024 * 1024 * 1024)) + " GB";
                return fsize;
            };
        },
    },
}
</script>
