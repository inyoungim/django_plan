<template>

    <div class="col input-group">
        <span class="input-group-text text-start" style="width:100px;"><b>GERP Result</b></span>
        <div class="form-control p-1">
            <div class="table-responsive m-0 p-0">
                <table class="table table-hover table-bordered m-0">
                    <thead style="background-color:#DDEEFF;">
                        <tr>
                            <th class="py-1 text-center text-nowrap">Description</th>
                            <th class="py-1 text-center text-nowrap" style="width:20px;">
                                <i v-if="!fullView" class="bi bi-plus-square-fill text-primary"
                                   style="cursor:pointer" @click="fullView=!fullView"></i>
                                <i v-else class="bi bi-dash-square-fill text-secondary"
                                   style="cursor:pointer" @click="fullView=!fullView"></i>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                Organization
                                <label class="ps-1" style="cursor:pointer" @click="toggle_code1 = !toggle_code1">
                                    <i v-if="toggle_code1" class="bi bi-c-square-fill text-danger"></i>
                                    <i v-else class="bi bi-c-square"></i>
                                </label>
                            </th>
                            <th class="py-1 text-center text-nowrap">
                                Account Name
                                <label class="ps-1" style="cursor:pointer" @click="toggle_code2 = !toggle_code2">
                                    <i v-if="toggle_code2" class="bi bi-c-square-fill text-danger"></i>
                                    <i v-else class="bi bi-c-square"></i>
                                </label>
                            </th>
                            <th class="py-1 text-center text-nowrap">Project Code</th>
                            <th v-if="fullView" class="py-1 text-center text-nowrap">Invoice Code</th>
                            <th v-if="fullView" class="py-1 text-center text-nowrap">Invoice Detail</th>
                            <th v-if="fullView" class="py-1 text-center text-nowrap">Customer Name</th>
                            <th v-if="fullView" class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'">차변</span>
                                <span v-else>Debtor</span>
                            </th>
                            <th v-if="fullView" class="py-1 text-center text-nowrap">
                                <span v-if="this.$props.lang == 'kr'">대변</span>
                                <span v-else>Credit</span>
                            </th>
                            <th class="py-1 text-center text-nowrap">Total</th>
                        </tr>
                    </thead>
                    <tbody class="shadow-sm">
                        <tr v-for="data in data_list">
                            <td colspan="2" class="py-1 text-start text-nowrap">
                                <div v-if="fullView">{{ data.je_line_desc }}</div>
                                <div v-else style="width:400px; overflow:hidden;">{{ data.je_line_desc }}</div>
                            </td>
                            <td class="py-1 text-start text-nowrap">
                                <span v-if="toggle_code1" class="text-danger"><{{ data.segment2 }}></span>
                                {{ data.segment2_desc }}
                            </td>
                            <td class="py-1 text-start text-nowrap">
                                <span v-if="toggle_code2" class="text-danger"><{{ data.segment2 }}></span>
                                {{ data.segment3_desc }}
                            </td>
                            <td class="py-1 text-start text-nowrap"> {{ data.segment4 }} </td>
                            <td v-if="fullView" class="py-1 text-start text-nowrap"> {{ data.sub_batch_name }} </td>
                            <td v-if="fullView" class="py-1 text-start text-nowrap"> {{ data.je_header_name }} </td>
                            <td v-if="fullView" class="py-1 text-start text-nowrap"> {{ data.customer_name }} </td>
                            <td v-if="fullView" class="py-1 text-end text-nowrap"> {{ markedCost(data.accounted_dr) }} </td>
                            <td v-if="fullView" class="py-1 text-end text-nowrap"> {{ markedCost(data.accounted_cr) }} </td>
                            <td class="py-1 text-end text-nowrap"> {{ markedCost(data.accounted_dr - data.accounted_cr) }} </td>
                        </tr>
                        <tr v-if="data_list.length == 0">
                            <td colspan="50" class="text-start">
                                <span v-if="this.$props.lang == 'kr'">
                                    [품의서 번호] 형식으로 Description 입력시 활성화 됩니다.
                                </span>
                                <span v-else>
                                    GERP data is displayed witch description started with [Document No.]
                                </span>
                            </td>
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
    props : ['site','lang','doc_id'],
    data(){
        return {
            data_list : [],
            toggle_code1 : false,
            toggle_code2 : false,
            fullView : false,
            showProgressModal : false,
        }
    },
    mounted(){
        this.loadData();
    },
    methods: {
        async loadData(){
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/gerpGLData/'+vm.$props.doc_id, null)
                .then(function(res){
                    vm.data_list = res.data.data_list;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = false;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
