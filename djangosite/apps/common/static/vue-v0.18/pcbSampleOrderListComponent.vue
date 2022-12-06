<template>

    <div class="hstack border-bottom border-primary">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 pe-2 bg-primary bg-opacity-25">
            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
            <b>PCB Sample Order History</b>
        </div>
    </div>

    <div class="table-responsive input-group mt-1">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center" width="5%">No</th>
                    <th v-if="this.$props.pmode != 'view'" class="py-1 text-center text-nowrap">
                        <i class="bi bi-clipboard-check"></i>
                    </th>
                    <th class="py-1 text-center text-nowrap">PCB P/N</th>
                    <th class="py-1 text-center text-nowrap">Rev</th>
                    <th class="py-1 text-center text-nowrap">Via size</th>
                    <th class="py-1 text-center text-nowrap">PCB Size</th>
                    <th class="py-1 text-center text-nowrap">Impedance</th>
                    <th class="py-1 text-center text-nowrap">Carbon</th>
                    <th class="py-1 text-center text-nowrap">Surface</th>
                    <th class="py-1 text-center text-nowrap">Date</th>
                    <th class="py-1 text-center text-nowrap">Quantity</th>
                    <th class="py-1 text-center text-nowrap">Maker</th>
                </tr>
            </thead>
             <tbody class="shadow-sm">
                <tr v-for="data,i in searchList">
                    <th class="py-1 text-center" width="5%">{{i+1}}</th>
                    <td v-if="this.$props.pmode != 'view'" class="py-1 text-center text-nowrap">
                        <i class="bi bi-clipboard-plus" style="cursor:pointer" @click="setTarget(data)"></i>
                    </td>
                    <td class="py-1 text-center text-nowrap">{{data.ATTRIBUTE2.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.ATTRIBUTE3.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.MINIMUM_HOLE_SIZE.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.PCB_SIZE.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.IMPEDANCE_CHECK.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.CARBON_TREATMENT.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.PCB_SURFACE_HANDLING.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.REQUEST_DATE}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.SAMPLE_QUANTITY.column_data_key}}</td>
                    <td class="py-1 text-center text-nowrap">{{data.MAKER.column_data_key}}</td>
                </tr>
                <tr v-if="searchList.length == 0">
                    <td class="py-1 text-center"  colspan='12'> There is no data. </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td v-if="this.$props.pmode != 'view' && searchList.length > 0" colspan="12" class="text-start text-success">
                        <span v-if="lang == 'kr'"> <i class="bi bi-clipboard-plus"></i>
                            아이콘을 누르면 발주 이력과 동일한 내용이 로딩 됩니다.</span>
                        <span v-else> When click <i class="bi bi-clipboard-plus"></i> icon,
                            same contents of ordered history are loaded.
                        </span>
                    </td>
                </tr>
            </tfoot>
        </table>
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
    props : ['site','lang','part_number','pmode'],
    data(){
        return {
            searchList : [],
            search_string :this.$props.part_number,
            showProgressModal : false,
        }
    },
    mounted(){
        if(this.$props.part_number)
            this.searchData();
    },
    methods: {
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/pcbSampleOrderHistory',
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
            this.$emit('select-target', data);
        },
    }
}
</script>
