<template>

    <div class="hstack">
        <div class="vstack align-top col-6 me-2">
            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-danger"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b v-if="lang=='kr'">출장비 자동 계산기</b><b v-else>Business Trip Calculator</b>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용되는 곳</b>
                            <b v-else>Be Used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">예산 수립 화면 에서 "Business Trip Calculator" Option 이 Check 되어 있는 계정</span>
                            <span v-else>at budget planning</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용 방법</b>
                            <b v-else>How to be used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">출장 지역을 선택하면 지역별 입력된 금액을 기준으로 출장비 자동 계산됨.</span>
                            <span v-else>Search business trip location.</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showBusinessTripCostCalculatorModal">Management</button>
            </div>

            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-danger"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b v-if="lang=='kr'">예산 수립 Option Column</b><b v-else>Planning Option Column</b>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용되는 곳</b>
                            <b v-else>Be Used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">예산 수립 화면 에서 보여지는 계정별 Option Column </span>
                            <span v-else>at budget planning</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용 방법</b>
                            <b v-else>How to be used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">출장 지역을 선택하면 지역별 입력된 금액을 기준으로 출장비 자동 계산됨.</span>
                            <span v-else>Search business trip location.</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showAccountPlanOptionColumnModal">Management</button>
            </div>

            <div v-if="this.$props.site == 'hq'" class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-success"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b>PCB Sample Cost Calculator (PDM Interface)</b>
                    </div>
                </div>
            </div>
            <div v-if="this.$props.site == 'hq'" class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;"><b>Sample PCB Column</b></span>
                        <span class="form-control bg-white text-end">
                            <span class="text-danger me-3">Editable only Admin</span>
                            <button v-if="this.$props.acl >= 9" class="btn btn-primary shadow-sm py-1"
                                    style="min-width:80px;" @click="showAccountOptionPSCModal">Management</button>
                            <button v-else class="btn btn-secondary shadow-sm py-1" style="min-width:80px;">Management</button>
                        </span>
                    </div>
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;"><b>Stencil Column</b></span>
                        <span class="form-control bg-white text-end">
                            <span class="text-danger me-3">Editable only Admin</span>
                            <button v-if="this.$props.acl >= 9" class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                                    @click="showAccountOptionStencilModal">Management</button>
                            <button v-else class="btn btn-primary shadow-sm py-1" style="min-width:80px;">Management</button>
                        </span>
                    </div>
                </div>
            </div>

        </div>


        <div class="vstack align-top col-6 ms-2">

            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b v-if="lang=='kr'">운임 기준</b><b v-else>Freight Charge</b>
                    </div>
                </div>
            </div>

            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;"><b>Keyword</b></span>
                        <span class="form-control bg-white">=__FREIGHT_CHARGE_SEARCH</span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;"><b>Reserved Interface</b></span>
                        <span class="form-control bg-white"> FREIGHT_WEIGHT , (freight_charge_name, unit_cost)</span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showFreightChargeModal">Management</button>
            </div>

            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger" @click="showFreightChargeModal"></i>
                        <b>User Defined Project Code Management</b>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용되는 곳</b>
                            <b v-else>Be Used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">예산 집행 화면</span>
                            <span v-else>at budget execution</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용 방법</b>
                            <b v-else>How to be used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">Project Name 검색 시 추가 검색됨</span>
                            <span v-else>Search project name or project code.</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showUserDefinedProject">Management</button>
            </div>
            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b v-if="lang=='kr'">예산 집행 Option Column</b><b v-else>Execution Option Column</b>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용되는 곳</b>
                            <b v-else>Be Used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">예산 집행 화면 에서 보여지는 계정별 Option Column </span>
                            <span v-else>at budget execution</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용 방법</b>
                            <b v-else>How to be used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">계정별 Option Column 을 선택하여 추가함.</span>
                            <span v-else>Search to add account option column for execution.</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <span class="text-danger me-3">Editable only Admin</span>
                <button v-if="this.$props.acl >= 9" class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showAccountOptionColumnModal">Management</button>
                <button v-else class="btn btn-secondary shadow-sm py-1" style="min-width:80px;">Management</button>
            </div>

            <div class="border-bottom border-primary mt-3">
                <div class="hstack">
                    <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                        style="min-width:100px;">
                        <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                        <b v-if="lang=='kr'">견적 타입</b><b v-else>Estimation Information</b>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용되는 곳</b>
                            <b v-else>Be Used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">예산 집행 화면 에서 견적 타입을 선택할때 </span>
                            <span v-else>at budget execution</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="hstack">
                <div class="col me-1">
                    <div class="input-group mt-1">
                        <span class="input-group-text" style="width:160px;">
                            <b v-if="lang=='kr'">사용 방법</b>
                            <b v-else>How to be used</b>
                        </span>
                        <span class="form-control bg-white">
                            <span v-if="lang=='kr'">사업부별 __E3 의 담당자 지정 </span>
                            <span v-else>PIC required at __E3 type.</span>
                        </span>
                    </div>
                </div>
            </div>
            <div class="text-end m-1">
                <button class="btn btn-primary shadow-sm py-1" style="min-width:80px;"
                            @click="showAccountEstimationInfoModal">Management</button>
            </div>
        </div>


        <div v-if="businessTripCostCalculatorModal">
            <trip-location-select-component
                    ref="tripLocationSelectComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name"
                    :pmode="'mgmt'"
                    @close-modal="businessTripCostCalculatorModal=false"
                    @select-target="setTripLocation">
            </trip-location-select-component>
        </div>
        <div v-if="accountPlanOptionColumnModal">
            <account-plan-option-column-component
                    ref="accountPlanOptionColumnComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name"
                    :pmode="'mgmt'"
                    @close-modal="accountPlanOptionColumnModal=false">
            </account-plan-option-column-component>
        </div>
        <div v-if="freightChargeSearchModal">
            <freight-charge-search-modal-component
                    ref="freightChargeSearchModalComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :pmode="this.$props.pmode"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name">
            </freight-charge-search-modal-component>
        </div>
        <div v-if="userDefinedProjectModal">
            <user-defined-project-modal-component
                    ref="userDefinedProjectModalComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :pmode="this.$props.pmode"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name">
            </user-defined-project-modal-component>
        </div>
        <div v-if="accountOptionColumnModal">
            <account-option-column-component
                    ref="accountOptionColumnComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name"
                    :pmode="'mgmt'"
                    @close-modal="accountOptionColumnModal=false">
            </account-option-column-component>
        </div>

        <div v-if="accountEstimationInfoModal" class="vue_modal" style="z-index: 9991;">
            <div class="vue_overlay"></div>
            <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
                <div class="modal-content text-center">
                    <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                        <h4 class="col">Account Estimation Type Master</h4>
                        <button type="button" class="btn-close btn-close btn-close-white"
                                @click="accountEstimationInfoModal=false"></button>
                    </div>

                    <div class="modal-body" style="min-height:150px;">
                        <account-estimation-info-component
                                ref="accountEstimationInfoComponent"
                                :site="this.$props.site"
                                :lang="this.$props.lang"
                                :div_name="this.$props.div_name"
                                :acl="this.$props.acl"
                                :pmode="'mgmt'"
                                :pdata="{}">
                        </account-estimation-info-component>
                    </div>
                    <div class="modal-footer">
                        <div class="col text-center">
                            <div class="btn btn-secondary mx-2" style="width:100px;"
                                @click="accountEstimationInfoModal=false">Close</div>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div v-if="accountOptionPSCModal">
            <account-option-psc-component
                    ref="accountOptionPSCComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name"
                    :pmode="'mgmt'"
                    @close-modal="accountOptionPSCModal=false">
            </account-option-psc-component>
        </div>
        <div v-if="accountOptionStencilModal">
            <account-option-stencil-component
                    ref="accountOptionStencilComponent"
                    :site="this.$props.site"
                    :lang="this.$props.lang"
                    :acl="this.$props.acl"
                    :div_name="this.$props.div_name"
                    :pmode="'mgmt'"
                    @close-modal="accountOptionStencilModal=false">
            </account-option-stencil-component>
        </div>
    </div>

</template>

<script>
export default {
    props : ['site','lang','acl','pmode','div_name'],
    components: {
        'trip-location-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/tripLocationSelectComponent.vue', vueLoaderOptions) ),
        'account-plan-option-column-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountPlanOptionColumnComponent.vue', vueLoaderOptions) ),
        'freight-charge-search-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/freightChargeSearchModalComponent.vue', vueLoaderOptions) ),
        'user-defined-project-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userDefinedProjectModalComponent.vue', vueLoaderOptions) ),
        'account-option-column-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountOptionColumnComponent.vue', vueLoaderOptions) ),
        'account-estimation-info-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountEstimationInfoComponent.vue', vueLoaderOptions) ),
        'account-option-psc-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountOptionPSCComponent.vue', vueLoaderOptions) ),
        'account-option-stencil-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/accountOptionStencilComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            businessTripCostCalculatorModal:false,
            accountPlanOptionColumnModal:false,
            freightChargeSearchModal:false,
            userDefinedProjectModal:false,
            accountOptionColumnModal:false,
            accountEstimationInfoModal:false,
            accountOptionPSCModal:false,
            accountOptionStencilModal:false,
        }
    },
    mounted(){

    },
    methods : {
        showBusinessTripCostCalculatorModal(){
            this.businessTripCostCalculatorModal = true;
            if(this.$refs.businessTripCostCalculatorModal){
                this.$refs.businessTripCostCalculatorModal.searchData();
            }
        },
        showAccountPlanOptionColumnModal(){
            this.accountPlanOptionColumnModal = true;
            if(this.$refs.accountPlanOptionColumnComponent){
                this.$refs.accountPlanOptionColumnComponent.searchData();
            }
        },
        showFreightChargeModal(){
            this.freightChargeSearchModal = true;
            if(this.$refs.freightChargeSearchModalComponent){
                this.$refs.freightChargeSearchModalComponent.searchData();
            }
        },
        showUserDefinedProject(){
            this.userDefinedProjectModal = true;
            if(this.$refs.userDefinedProjectModalComponent){
                this.$refs.userDefinedProjectModalComponent.searchData();
            }
        },
        showAccountOptionColumnModal(){
            this.accountOptionColumnModal = true;
            if(this.$refs.accountOptionColumnComponent){
                this.$refs.accountOptionColumnComponent.searchData();
            }
        },
        showAccountEstimationInfoModal(){
            this.accountEstimationInfoModal = true;
            if(this.$refs.accountEstimationInfoComponent){
                this.$refs.accountEstimationInfoComponent.searchData();
            }
        },

        showAccountOptionPSCModal(){
            this.accountOptionPSCModal = true;
            if(this.$refs.accountOptionPSCComponent){
                this.$refs.accountOptionPSCComponent.searchData();
            }
        },
        showAccountOptionStencilModal(){
            this.accountOptionStencilModal = true;
            if(this.$refs.accountOptionStencilComponent){
                this.$refs.accountOptionStencilComponent.searchData();
            }
        },
    },
}
</script>

