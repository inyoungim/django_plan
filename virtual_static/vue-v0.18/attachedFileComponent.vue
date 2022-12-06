<template>

    <div v-if="this.$props.type == 'single'" class="col">
        <div class="col hstack" v-if="this.$props.mode == 'new' || this.$props.mode == 'reply' || this.$props.mode == 'modify'">

            <input type="file" ref="selectFiles" style="display:none;" @change="file_select">
            <div v-if="file_list.length > 0" class="col hstack m-0 px-2">
                <div class="col-10 text-start" >{{ file_list[0].name }}</div>
                <div class="col-2 text-center">{{ markedSize(file_list[0].size) }}</div>
            </div>
            <button type="button" class="btn btn-sm btn-primary mx-0 align-middle ms-auto" style="width:100px; height:25px;"
                    @click="$refs.selectFiles.click()">Add file</button>
        </div>

        <!-- attached file list of db -->
        <div class="col vstack">
            <div class="input-group" v-for="f in this.$props.attached_list">
                <div v-if="this.$props.mode == 'modify'" class="input-group-text bg-white border-0">
                    <input type="checkbox" v-model="remove_files" :value="f.id">
                </div>
                <div v-else class="px-2"></div>
                <div class="px-0 py-1"  :class="{'text-decoration-line-through':isChecked(f.id)}">
                    <a href="#" class="link-primary text-decoration-none"
                       @click="file_download(f.id, f.display_name)">{{ f.display_name }}</a>
                    ({{ markedSize(f.file_size) }})
                </div>
            </div>
        </div>
    </div>

    <div v-else class="col border p-1" style="min-height:2.5rem;">
        <div class="col" v-if="this.$props.mode == 'new' || this.$props.mode == 'reply' || this.$props.mode == 'modify'">
            <button type="button" class="btn btn-sm btn-primary mx-0 align-middle"
                    style="width:100px; padding:0.1em 0.5em;" @click="$refs.selectFiles.click()">Add files</button>
            <button type="button" class="btn btn-sm btn-danger mx-2"
                    style="width:100px; padding:0.1em 0.5em;" @click="removeSelectFiles">Remove files</button>

            <input class="col border p-1" type="file" ref="selectFiles" style="display:none;" multiple @change="file_select">
            <div @drop="file_drop" @dragover="file_dragOver">
                <div v-if="file_list.length > 0">
                    <table class="table table-sm my-1" style="background-color:#EEEEFF;">
                        <tr><td colspan="4" style="background-color:#CCCCCC; margin:0px;padding:0px; height:1px"></td></tr>
                        <tr v-for="(f,i) in file_list" class="bg-opacity-25"
                            style="cursor:pointer;" :class="{'bg-warning':check_list[i]}" @click="toggleFileRow(f,i)" >
                            <td class="col text-center" style="width:30px;"><input type="checkbox" v-model="check_list[i]"></td>
                            <td class="col-auto text-start" >{{ f.name }}</td>
                            <td class="col-2 text-center">{{ markedSize(f.size) }}</td>
                        </tr>
                        <tr><td colspan="4" style="background-color:#CCCCCC; margin:0px;padding:0px; height:1px"></td></tr>
                    </table>
                </div>
                <div v-else class="border my-1">
                    <div class="d-flex align-items-center" style="background-color:#EEEEFF; height:50px;">
                        <div class="col text-center">drop file here</div>
                    </div>
                </div>
            </div>

        </div>

        <!-- attached file list of db -->
        <div class="col vstack">
            <div class="input-group" v-for="f in this.$props.attached_list">
                <div v-if="this.$props.mode == 'modify'" class="input-group-text bg-white border-0 px-2">
                    <input type="checkbox" v-model="remove_files" :value="f.id">
                </div>
                <div v-else class="px-2"></div>
                <div class="px-0 py-1"  :class="{'text-decoration-line-through':isChecked(f.id)}">
                    <a href="#" class="link-primary text-decoration-none"
                       @click="file_download(f.id, f.display_name)">{{ f.display_name }}</a>
                    ({{ markedSize(f.file_size) }})
                </div>
            </div>
        </div>

    </div>

    <!-- body disable modal for uploading -->
    <div v-if="showUploadModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>

        <div v-if="file_list.length > 0" class="modal-dialog modal-dialog-centered mx-auto">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">File Upload ( {{currentCount}} )</h5>
                </div>
                <div class="modal-body">
                    <div v-for="(f,i) in file_list">
                        <div v-if="progress_list[i] > 0 && (progress_list[i+1] == 0 || i == file_list.length-1)">
                            <div class="col">
                                <div class="input-group">
                                    <span class="input-group-text" style="width:100px;">File name</span>
                                    <span class="form-control col text-start">
                                        {{f.name}} ({{ markedSize(f.size) }})
                                    </span>
                                </div>
                            </div>
                            <div class="col mt-1">
                                <div class="input-group">
                                    <span class="input-group-text" style="width:100px;">
                                        Status ({{ progress_list[i] }}%)
                                    </span>
                                    <div class="form-control col text-start">
                                        <div class="progress" style="height: 20px;">
                                            <div class="progress-bar bg-danger" role="progressbar"
                                                :style="{width: progress_list[i] + '%'}" aria-valuenow="progress_list[i]">
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- body disable modal for downloading -->
    <div v-if="showDownloadModal" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>

        <div class="modal-dialog modal-dialog-centered mx-auto">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">File Download</h5>
                </div>
                <div class="modal-body">
                    <div class="col">
                        <div class="input-group">
                            <span class="input-group-text" style="width:100px;">File name</span>
                            <span class="form-control col text-start">{{download_filename}}</span>
                        </div>
                    </div>
                    <div class="col mt-1">
                        <div class="input-group">
                            <span class="input-group-text" style="width:100px;">Status ({{ dprogress }}%)</span>
                            <div class="form-control col text-start">
                                <div class="progress" style="height: 20px;">
                                    <div class="progress-bar bg-danger" role="progressbar"
                                        :style="{width: dprogress + '%'}" aria-valuenow="dprogress">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                    <button class="btn btn-secondary btn-sm my-2 mx-1" @click="cancelDownload">Cancel Download</button>
                </div>
            </div>
        </div>
    </div>

</template>


<script>
let cancelTokenSource = axios.CancelToken.source();
export default {
    props : ['mode','type','attached_list','base_url'],
    data(){
        return {
            module_name : "",
            showUploadModal : false,
            showDownloadModal : false,
            download_filename : "",
            file_list : [],
            check_list : [],
            progress_list : [],
            errcheck : "",
            pk : null,
            remove_files : [],
            attached_list : this.$props.attached_list,
            dprogress : 0,
        }
    },
    methods : {
        initialize(){
            this.module_name = "";
            this.showUploadModal = false;
            this.showDownloadModal = false;
            // this.file_list = [];
            this.check_list = [];
            this.progress_list = [];
            this.errcheck = "";
            this.pk = null;
            this.remove_files = [];
            this.attached_list = this.$props.attached_list;
            this.dprogress = 0;
        },
        file_dragOver(e){
            e.stopPropagation()
            e.preventDefault()
        },
        file_drop(e){
            e.preventDefault()
            var files = e.dataTransfer && e.dataTransfer.files
            this.showFiles(files)
        },
        file_select(e){
            this.showFiles(e.target.files)
        },
        showFiles(files){
            if(this.$props.type == 'single'){
                this.file_list = [];
                this.progress_list = [];
            }

            var file_array = Array.from(files);
            for(var i=0; i<file_array.length; i++){
                var isNew = true;
                for(var j=0; j<this.file_list.length; j++){
                    if(this.file_list[j].name == file_array[i].name){
                        isNew = false;
                        break;
                    }
                }
                if(isNew){
                    this.file_list.push(file_array[i]);
                    this.check_list.push(false);
                    this.progress_list.push(0);
                }
            }
        },
        removeSelectFiles(){
            for(var i=0; i<this.check_list.length; i++){
                if(this.check_list[i] == true){
                    this.file_list.splice(i,1);
                    this.check_list.splice(i,1);
                    this.progress_list.splice(i,1);
                    i--;
                }
            }
        },
        toggleFileRow(row,index){
            if (this.check_list[index])
                this.check_list[index] = false;
            else
                this.check_list[index] = true;
        },
        async uploadStart(pk){
            if(!this.$props.base_url) this.$props.base_url = "";

            // add async,awit option both of uploadStart, sendFile for sync operation.
            var vm = this;
            vm.pk = pk;
            vm.showUploadModal = true;
            let serverFileList = new Array();
            let orgFileList = new Array();
            let serverResult = true;
            for (let i=0; i<this.file_list.length; i++) {
                var serverFile = await this.sendFile(i,this.file_list[i]);
                if(vm.errcheck != ""){
                    serverResult = false;
                    break;
                }
                serverFileList.push(serverFile);
                orgFileList.push(this.file_list[i].name);
            }

            if(vm.errcheck == "" && this.remove_files.length > 0 && vm.pk !="" && vm.pk != null){
                await axios.delete('./'+this.$props.base_url+'api/upload/'+vm.pk, { data :{ remove_files:vm.remove_files } })
                    .then(function (res) { vm.errcheck = "";    })
                    .catch(function (err){ vm.errcheck = err; serverResult = false; });
                // vm.remove_files = [];
            }
            vm.showUploadModal = false;

            const data = { 'result':serverResult , 'err':vm.errcheck,  'svr_file_names': serverFileList, 'up_file_names': orgFileList } ;
            return data;
        },
        async sendFile(index,file){
            var formData = new FormData();
            formData.append('file', file);
            formData.append('id', this.pk);
            var saved_file = "";
            var vm = this;
            var config = {
                onUploadProgress: function(progressEvent) {
                    vm.progress_list[index] = Math.round( (progressEvent.loaded * 100) / progressEvent.total );
                },
                headers:{
                    'Content-Type' : 'multipart/form-data'
                }
            };
            await axios.post('/cgi/fileupload.py', formData, config)
                .then(function (res) { saved_file = res.data.filename; vm.errcheck = "";    })
                .catch(function (err){ vm.errcheck = err;  });
            return saved_file;
        },
        async file_download(file_id, file_name){
            if(!this.$props.base_url) this.$props.base_url = "";
            var vm = this;
            var config = {
                responseType: 'blob',
                cancelToken: cancelTokenSource.token,
                onDownloadProgress: function(progressEvent) {
                    vm.dprogress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
                }
            };
            this.showDownloadModal = true;
            this.download_filename = file_name ;
            await axios.get('./'+this.$props.base_url+'api/download/'+file_id, config)
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
            this.showDownloadModal = false;
        },
        cancelDownload(){
            cancelTokenSource.cancel();
            cancelTokenSource = axios.CancelToken.source();
        },
        getFileName (contentDisposition) {
          let fileName = contentDisposition
            .split(';')
            .filter((ele) => {
              return ele.indexOf('fileName') > -1
            })
            .map((ele) => {
              return ele
                .replace(/"/g, '')
                .split('=')[1]
            })
          return fileName[0] ? fileName[0] : null
        }
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
        isChecked(){
            return (data) => {
                return this.remove_files.includes(data);
            }
        },
        currentCount(){
            var thisCount = 0;
            for(var i=0; i<this.progress_list.length; i++){
                if(this.progress_list[i] > 0)
                    thisCount = i +1;
            }
            return thisCount + " / " +  this.progress_list.length;
        },
    },
}
</script>

