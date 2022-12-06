<template>

    <div class="vue_modal" style="z-index: 9991;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-xxl modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col">Tax Invoice List</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="closeModal"></button>
                </div>

                <div class="modal-body" style="min-height:150px;">
                    <div class="table-responsive m-0 p-0" style="max-height:500px;">
                        <table class="table table-hover table-bordered">
                            <thead style="background-color:#DDEEFF; position: sticky;top:0;">
                                <tr>
                                    <th class="py-1 text-center text-nowrap" width="50px">No</th>
                                    <th class="py-1 text-center text-nowrap">Organization</th>
                                    <th class="py-1 text-center text-nowrap">User Name</th>
                                    <th class="py-1 text-center text-nowrap">User Mail</th>
                                    <th class="py-1 text-center text-nowrap">Invoice No</th>
                                    <th class="py-1 text-center text-nowrap">Invoice Date</th>
                                    <th class="py-1 text-center text-nowrap">Description</th>
                                    <th class="py-1 text-center text-nowrap">Vendor Name</th>
                                    <th class="py-1 text-center text-nowrap">Vendor Code</th>
                                    <th class="py-1 text-center text-nowrap">VAT Type</th>
                                    <th class="py-1 text-center text-nowrap">Buy Amount</th>
                                    <th class="py-1 text-center text-nowrap">Tax Amount</th>
                                </tr>
                            </thead>
                            <tbody class="shadow-sm">
                                <tr v-for="data,i in itemList" class="bg-opacity-25">
                                    <td class="py-1 text-center text-nowrap">{{i+1}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.org_name}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.user_name}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.user_email}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.legacy_pk1}}{{data.legacy_pk2}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.invoice_date}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.item_desc}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.sup_vendor_name}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.sup_vat_registration_num}}</td>
                                    <td class="py-1 text-start text-nowrap">{{data.vat_gb2}}</td>
                                    <td class="py-1 text-end text-nowrap">{{markedCost(data.buy_amt)}}</td>
                                    <td class="py-1 text-end text-nowrap">{{markedCost(data.tax_amt)}}</td>
                                </tr>
                                <tr v-if="itemList.length == 0">
                                    <td class="py-1 text-center"  colspan='12'> There is no data. </td>
                                </tr>
                            </tbody>
                        </table>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeModal">Close</div>
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
    props : ['site','lang','acl','div_name','empno','year','month'],
    data(){
        return {
            itemList : [],
            selectedItem : {},
            showProgressModal : false,
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        closeModal(event){
            this.$emit('close-modal');
        },
        async searchData(event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/taxInvoiceList',
                { params:{  div_name : vm.$props.div_name,
                            user_empno : vm.$props.empno,
                            year : vm.$props.year,
                            month : vm.$props.month
                         }
                })
                .then(function(res){
                    vm.itemList = res.data.itemList;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
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
