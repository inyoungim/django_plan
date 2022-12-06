<template>

    <div class="table-responsive">
        <table class="table table-hover table-bordered mt-2">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center">Version</th>
                    <th class="py-1 text-start text-nowrap">
                        Organization
                        <label class="ps-1" style="cursor:pointer" @click="toggle_id1 = !toggle_id1">
                            <i v-if="toggle_id1" class="bi bi-tag-fill text-danger"></i>
                            <i v-else class="bi bi-tag"></i>
                        </label>
                        <label class="ps-1" style="cursor:pointer" @click="toggle_code1 = !toggle_code1">
                            <i v-if="toggle_code1" class="bi bi-c-square-fill text-danger"></i>
                            <i v-else class="bi bi-c-square"></i>
                        </label>
                    </th>
                    <th class="py-1 text-start text-nowrap">
                        Account
                        <span v-if="viewPath">Path</span><span v-else>Name</span>
                        <label class="ps-1" style="cursor:pointer" @click="viewPath = !viewPath">
                            <i v-if="viewPath" class="bi bi-signpost-fill text-danger"></i>
                            <i v-else class="bi bi-signpost"></i>
                        </label>
                        <label class="ps-1" style="cursor:pointer" @click="toggle_id2 = !toggle_id2">
                            <i v-if="toggle_id2" class="bi bi-tag-fill text-danger"></i>
                            <i v-else class="bi bi-tag"></i>
                        </label>
                        <label class="ps-1" style="cursor:pointer" @click="toggle_code2 = !toggle_code2">
                            <i v-if="toggle_code2" class="bi bi-c-square-fill text-danger"></i>
                            <i v-else class="bi bi-c-square"></i>
                        </label>
                    </th>
                    <th class="py-1 text-center text-nowrap">User Name</th>
                    <th class="py-1 text-center text-nowrap">Model Name</th>
                    <th class="py-1 text-center text-nowrap">Month</th>
                    <th class="py-1 text-center text-nowrap">Unit Cost</th>
                    <th class="py-1 text-center text-nowrap">Quantity</th>
                    <th class="py-1 text-center text-nowrap">Total Cost</th>
                    <th class="py-1 text-center text-nowrap">Description</th>
                    <th class="py-1 text-center text-nowrap">Review Comments</th>
                </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item in tdata.itemList" class="bg-opacity-25">
                    <td class="text-center text-nowrap">{{ item.version }}</td>
                    <td class="text-start text-nowrap">
                        <span v-if="toggle_id1" class="text-danger">[{{ item.org_id }}]</span>
                        <span v-if="toggle_code1" class="text-danger"><{{ item.nas_code }}></span>
                        {{ item.org_name }}
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="toggle_id2" class="text-danger">[{{ item.account_id }}]</span>
                        <span v-if="toggle_code2" class="text-danger"><{{ item.account_code }}></span>
                        <span v-if="viewPath">{{ item.account_path }}</span>
                        <span v-else>{{ item.account_name }}</span>
                    </td>
                    <td class="text-start text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span><span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td class="text-start text-nowrap">{{ item.model_name }}</td>
                    <td class="text-end">{{ item.month }}</td>
                    <td class="text-end">{{ markedCost(item.unit_cost) }}</td>
                    <td class="text-end">{{ item.unit_count }}</td>
                    <td class="text-end">{{ markedCost(item.total_cost-item.transfer_cost) }}</td>
                    <td class="text-start"><span v-html="item.description"></span></td>
                    <td class="text-start"><span v-html="item.review_comment"></span></td>
                </tr>
            </tbody>
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
    props : ['site','lang','acl','div_name','year','item_id','parent_id','version'],
    data(){
        return {
            tdata : {},
            page_num : 10,
            showProgressModal : false,

            toggle_id1 : false,
            toggle_code1 : false,
            toggle_id2 : false,
            toggle_code2 : false,
            viewPath : false,
        }
    },
    mounted(){
        this.page(1, this.page_num );
    },
    watch : {
        div_name(nVal){
            this.page(1, this.page_num );
        }
    },
    methods: {
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/budgetPlanItemHistory',
                { params:{ div_name : vm.$props.div_name,
                           year : vm.$props.year,
                           version : vm.$props.version,
                           item_id: vm.$props.item_id,
                           parent_id: vm.$props.parent_id
                           }
                })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
    },
    computed:{
        previous_text_color(){
            if( this.tdata.previous_page == 0 )
                return "#ddd";
        },
        next_text_color(){
            if( this.tdata.next_page == 0 )
                return "#ddd";
        },
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
