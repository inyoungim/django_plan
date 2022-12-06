<template>

    <div class="hstack border-bottom border-primary">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <i class="bi bi-grid-3x3-gap-fill text-primary px-2"></i>
            <b>Estimation Information</b>
        </div>
        <div v-if="this.$props.pmode =='mgmt'" class="col-auto ms-auto hstack">
            <div class="input-group-text ms-auto me-1" style="padding:0.1em 0.5em;">{{this.$props.div_name}}</div>
            <div class="form-control p-0" style="width:100px; padding:0.1em 0.5em;">
                <select v-model="est_data.estimation_key" class="form-select border-0" style="padding:0.1em 0.5em;"
                    @change="changeEstId" :disabled="this.$props.pmode == 'view'">
                    <option :value=""></option>
                    <option :value="'__E1'">__E1</option>
                    <option :value="'__E2'">__E2</option>
                    <option :value="'__E3'">__E3</option>
                    <option :value="'__E4'">__E4</option>
                </select>
            </div>
        </div>
    </div>

    <div class="col mt-1" id="form_validation">
        <div v-if="est_data.estimation_key =='__E1' || est_data.estimation_key =='__E2'
                    || est_data.estimation_key =='__E4' " class="input-group">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>GPS Contract Number Y/N</b>
            </label>
            <div class="col input-group-text bg-white">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="GPS Contract Number Y/N"
                           id="gpsContractYN1" value="Y" v-model="est_data.gps_contract_number_yn"
                           :checked="est_data.gps_contract_number_yn == 'Y'"
                           :disabled="est_data.estimation_key == '__E1' || est_data.estimation_key == '__E4'
                                      || this.$props.pmode == 'view'">
                    <label for="gpsContractYN1">Yes</label>
                </div>
                <div class="form-check ms-3" :disabled="est_data.estimation_key == '__E1'">
                    <input class="form-check-input" type="radio" name="GPS Contract Number"
                           id="gpsContractYN2" value="N" v-model="est_data.gps_contract_number_yn"
                           :checked="est_data.gps_contract_number_yn == 'N'"
                           :disabled="est_data.estimation_key == '__E1' || est_data.estimation_key == '__E4'
                                      || this.$props.pmode == 'view'">
                    <label for="gpsContractYN2">No</label>
                </div>
                <label class="col-auto ms-3 fst-italic text-success">
                    <i class="bi bi-exclamation-circle"></i>
                    <span v-if="lang=='kr'">PU-GPS에서 채번된 Contract Number 존재 유/무</span>
                    <span v-else>Select exists in GPS Contract Number in PU-GPS system.</span>
                </label>
            </div>
        </div>
        <div v-if="(est_data.estimation_key =='__E1' || est_data.estimation_key =='__E2' || est_data.estimation_key =='__E4')
                && est_data.gps_contract_number_yn == 'Y'" class="input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>GPS Contract Number</b>
            </label>
            <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                   :class="{'bg-white': this.$props.pmode == 'view'}"
                   name="GPS Contract Number" v-model="est_data.gps_contract_number" disabled required>

            <div v-if="this.$props.pmode != 'view'" class="input-group-tex">
                <gps-contract-number-select-component ref="gpsContractNumberSelectComponent"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       @select-target="setContractNumber"></gps-contract-number-select-component>
            </div>

        </div>
        <label v-if="est_data.gps_contract_number_yn == 'Y' && est_data.estimation_key == '__E1'"
               class="col-12 mb-2 text-end fst-italic text-success">
            <i class="bi bi-exclamation-circle"></i>
            <span v-if="lang=='kr'"> ※Contract Number는 CT로 시작됨 : GP담당자가 계약을 진행한 건
                ☞ <a href="http://pu-gps3.lge.com:8180/ssoagent.do" target="_blank">PU-GPS Home</a> </span>
            <span v-else> ※Contract Number is start with 'CT' : PIC of GP conclude contract
                ☞ <a href="http://pu-gps3.lge.com:8180/ssoagent.do" target="_blank">PU-GPS Home</a> </span>
        </label>
        <label v-else-if="est_data.gps_contract_number_yn == 'Y' &&
                ( est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')"
               class="col-12 mb-2 text-end fst-italic text-success">
            <i class="bi bi-exclamation-circle"></i>
            <span v-if="lang=='kr'"> ※Contract Number는 GEVS로 시작됨 : 동일 품의서 기존 채번된 Number 입력 </span>
            <span v-else> ※Contract Number is start with 'GEVS' : same contract number at same execution item.</span>
        </label>

        <div v-if="est_data.gps_contract_number_yn == 'N' &&
                   (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')" class="col input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Company Name</b>
            </label>

            <input v-if="this.$props.lang == 'kr' " type="text" class="form-control col" style="padding:0.1em 0.5em;"
                   :class="{'bg-white': this.$props.pmode == 'view'}"
                   name="Company Name" v-model="est_data.company_name" disabled required>
            <input v-else type="text" class="form-control col" style="padding:0.1em 0.5em;"
                   :class="{'bg-white': this.$props.pmode == 'view'}"
                   name="Company Name" v-model="est_data.company_name_en" disabled required>

            <div v-if="this.$props.pmode != 'view'" class="input-group-tex">
                <company-select-component ref="companySelectComponent"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       @select-target="setCompany"></company-select-component>
            </div>

        </div>
        <div v-if="est_data.gps_contract_number_yn == 'N'  &&
                   (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')" class="col input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>GPS Item Category</b>
            </label>
            <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                   :class="{'bg-white': this.$props.pmode == 'view'}"
                   name="GPS Item Category " v-model="est_data.gps_item_category" disabled required>

            <div v-if="this.$props.pmode != 'view'" class="input-group-tex">
                <gps-item-category-select-component ref="gpsItemCategorySelectComponent"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       @select-target="setGpsItemCategory"></gps-item-category-select-component>
            </div>

        </div>
        <div v-if="est_data.gps_contract_number_yn == 'N'  &&
                    (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')" class="col input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Bidding Type</b>
            </label>
            <div class="col input-group-text bg-white">
                <div class="form-check">
                    <input class="form-check-input" type="radio" name="Bidding Type" id="Competitive"
                           value="Competitive" :checked="est_data.bidding_type == 'Competitive'"
                           :disabled="this.$props.pmode == 'view'" v-model="est_data.bidding_type">
                    <label for="Competitive">Competitive </label>
                </div>
                <div class="form-check ms-3">
                    <input class="form-check-input" type="radio" name="Bidding Type" id="NonCompetitive"
                           value="NonCompetitive" :checked="est_data.bidding_type == 'NonCompetitive'"
                           :disabled="this.$props.pmode == 'view'" v-model="est_data.bidding_type">
                    <label for="NonCompetitive">Non-Competitive </label>
                </div>
            </div>
        </div>

        <div v-if="est_data.gps_contract_number_yn == 'N'  && est_data.bidding_type == 'Competitive' &&
                   (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4') "
             class="col input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Bidding Suppliers</b>
            </label>

            <div class="form-control p-1">
                <div v-if="this.$props.pmode != 'view' && est_data.bidding_type == 'Competitive' " class="d-flex mb-1">
                    <div class="me-auto">
                        <button class="btn btn-sm btn-primary" style="width:100px; height:25px;" @click="add_items">Add Item</button>
                        <button class="btn btn-sm btn-danger ms-2" style="width:100px; height:25px;" @click="remove_items">Remove Item</button>
                    </div>
                </div>
                <div class="table-responsive m-0 p-0">
                    <table class="table table-hover table-bordered m-0">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center">Supplier Name</th>
                                <th class="py-1 text-center">Supplier Code</th>
                                <th class="py-1 text-center">Supplier Scale</th>
                                <th class="py-1 text-center">LG Affiliate</th>
                                <th class="py-1 text-center">Currency</th>
                                <th class="py-1 text-center">Amount</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="bitem in est_data.bidding_list"
                                class="bg-opacity-25" style="cursor:pointer"
                                :class="{'bg-warning': selectBiddingItem == bitem}" @click="selectBiddingItem = bitem">
                                <td class="py-1 text-center">
                                    <span v-if="lang=='kr'">{{bitem.supplier_name}}</span>
                                    <span v-else>{{bitem.supplier_name_en}}</span>
                                </td>
                                <td class="py-1 text-center">{{bitem.supplier_code}}</td>
                                <td class="py-1 text-center">{{bitem.supplier_scale}}</td>
                                <td class="py-1 text-center">{{bitem.lg_affiliate}}</td>
                                <td class="py-1 text-center">{{bitem.currency}}</td>
                                <td class="py-1 text-end">{{bitem.amount}}</td>
                            </tr>
                            <tr v-if="!est_data.bidding_list">
                                <td colspan="7" class="text-center"> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>
                </div>

            </div>

        </div>
        <div v-if="est_data.gps_contract_number_yn == 'N'  && est_data.bidding_type == 'NonCompetitive' &&
                    (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')"
             class="col input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Non-Competitive Reason</b>
            </label>
            <select class="form-select form-control bg-white" name="NonCompetitiveReason"
                    :disabled="this.$props.pmode == 'view'" v-model="est_data.non_competitive_reason" required>
                <option value="1">Solo source supplier <span v-if="lang=='kr'">-대체할 공급업체가 없는 거래</span> </option>
                <option value="2">Continuity for projects <span v-if="lang=='kr'">-프로젝트 연속성</span></option>
                <option value="3">Security Issue <span v-if="lang=='kr'">-보안성이 요구되는 거래</span></option>
                <option value="4">Government Designated Supplier <span v-if="lang=='kr'">-정부가 지정한 업체와의 거래</span></option>
                <option value="5">Short Deadline <span v-if="lang=='kr'">-긴급성이 요구되는 거래</span></option>
                <option value="6">Other : Manual Input <span v-if="lang=='kr'">-직접 입력</span></option>
            </select>
            <input v-if="est_data.non_competitive_reason == 6" type="text" class="form-control col" style="padding:0.1em 0.5em;"
                   name="NonCompetitiveReason" v-model="est_data.non_competitive_reason2" :disabled="this.$props.pmode == 'view'" required>
        </div>
        <div v-if="est_data.gps_contract_number_yn == 'N' && est_data.bidding_type == 'NonCompetitive' &&
                   (est_data.estimation_key == '__E2' || est_data.estimation_key == '__E4')"
             class="col-12 input-group mt-1">
            <label class="input-group-text" style="width:200px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Evidential document</b>
            </label>
            <label class="col text-danger border p-2 bg-warning bg-opacity-25">
                <span v-if="lang=='kr'"> ※단독입찰 증빙서류, 업체 견적서, 업체평가서 등을 품의서에 반드시 첨부할 것</span>
                <span v-else> ※Non Competitive evidential document have to be attached at budget execution form.</span>
            </label>
        </div>

        <div v-if="est_data.estimation_key == '__E3'">
            <div class="col input-group mt-1">
                <label class="input-group-text" style="width:200px;">
                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                    <b>Product ID</b>
                </label>
                <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                       name="Product ID" v-model="est_data.product_id" :disabled="this.$props.pmode == 'view'" required>
            </div>
            <div class="col input-group mt-1">
                <label class="input-group-text" style="width:200px;">
                    <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                    <b>Request PIC</b>
                </label>
                <label v-if="est_data.request_pic" class="col input-group-text ps-1">
                    {{est_data.request_pic.name}} {{est_data.request_pic.position}} ({{est_data.request_pic.email}})
                </label>
                <label v-else class="col input-group-text">
                    No PIC (Person in Charge)
                </label>
                <label class="w-100 m-0 pe-2 pb-2 text-end text-success">
                    Automatic added to distribution stage.
                </label>
            </div>
            <div v-if="this.$props.pmode =='mgmt' && this.$props.acl >= 7 " class="col-9 hstack mt-1 ms-auto">
                <user-select-component ref="userSelectComponent" class="ms-auto"
                                       :site="this.$props.site"
                                       :lang="this.$props.lang"
                                       :pmode="'new'"
                                       :stype="'USER'"
                                       @select-target="userSelected"></user-select-component>
                <button class="input-group-text btn-primary ms-1" @click="setPIC"><b>Apply</b></button>
                <button class="input-group-text btn-danger ms-1" @click="clearPIC"><b>Clear</b></button>
            </div>
        </div>
    </div>

    <!-- Bidding Suppliers Search Modal -->
    <div v-if="showBiddingSuppliersSearchListModal" class="vue_modal" style="z-index:9992;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h4 class="col"> Bidding Suppliers Information</h4>
                    <button type="button" class="btn-close btn-close btn-close-white" @click="showBiddingSuppliersSearchListModal=false"></button>
                </div>
                <div class="modal-body" style="min-height:150px; max-height:400px;" id="bidding_supplier_info">

                    <div class="col input-group">
                        <label class="input-group-text" style="width:150px;"><b>Supplier Name</b></label>
                        <input v-if="this.$props.lang == 'kr' " type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               :class="{'bg-white': this.$props.pmode == 'view'}"
                               name="Supplier Name" v-model="supplier.supplier_name" disabled required>
                        <input v-else type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               :class="{'bg-white': this.$props.pmode == 'view'}"
                               name="Supplier Name" v-model="supplier.supplier_name_en" disabled required>

                        <div v-if="this.$props.pmode != 'view'" class="input-group-tex">
                            <company-select-component ref="companySelectComponent2"
                                                   :site="this.$props.site"
                                                   :lang="this.$props.lang"
                                                   @select-target="setCompany2"></company-select-component>
                        </div>
                    </div>
                    <div class="col input-group mt-1">
                        <label class="input-group-text" style="width:150px;"><b>Supplier Code</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Supplier Code" v-model="supplier.supplier_code" required>
                    </div>

                    <div class="col input-group mt-1">
                        <label class="input-group-text" style="width:150px;"><b>Supplier Scale</b></label>
                        <div class="form-control p-0" style="padding:0.1em 0.5em;">
                            <select v-model="supplier.supplier_scale" class="form-select border-0"
                                    name="Supplier Scale" required>
                                <option value="Small Business">Small Business</option>
                                <option value="Non-Small Business">Non-Small Business</option>
                            </select>
                        </div>
                        <label class="input-group-text col-auto fst-italic text-success">
                            <i class="bi bi-exclamation-circle"></i>
                            <span v-if="lang=='kr'">중소기업 구분</span>
                        </label>
                    </div>
                    <div class="col input-group mt-1">
                        <label class="input-group-text" style="width:150px;"><b>LG Affiliate</b></label>
                        <div class="form-control p-0" style="padding:0.1em 0.5em;">
                            <select v-model="supplier.lg_affiliate" class="form-select border-0"
                                    name="LG Affiliate" required>
                                <option value="Yes">Yes</option>
                                <option value="No">No</option>
                            </select>
                        </div>
                        <label class="input-group-text col-auto fst-italic text-success">
                            <i class="bi bi-exclamation-circle"></i>
                            <span v-if="lang=='kr'">계열사 구분</span>
                        </label>
                    </div>

                    <div class="col input-group mt-1">
                        <label class="input-group-text" style="width:150px;"><b>Currency</b></label>
                        <div class="form-control p-0" style="padding:0.1em 0.5em;">
                            <select v-model="supplier.currency" class="form-select border-0"
                                    name="Currency" required>
                                <option value="KRW">KRW</option>
                                <option value="USD">USD</option>
                                <option value="EUR">EUR</option>
                                <option value="JYP">JYP</option>
                                <option value="CNY">CNY</option>
                                <option value="GBP">GBP</option>
                            </select>
                        </div>
                    </div>
                    <div class="col input-group mt-1">
                        <label class="input-group-text" style="width:150px;"><b>Amount</b></label>
                        <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                               name="Amount" v-model="supplier.amount" required>
                    </div>

                </div>
                <div class="modal-footer">
                    <div class="col text-center">
                        <div class="btn btn-primary mx-2" style="width:100px;" @click="addBiddingSupplier">Add Item</div>
                        <div v-else class="btn btn-secondary mx-2" style="width:100px;" @click="showBiddingSuppliersSearchListModal=false">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
    <!-- Bidding Suppliers Search Modal -->


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
    components: {
        'gps-contract-number-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/gpsContractNumberSelectComponent.vue', vueLoaderOptions) ),
        'company-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/companySelectComponent.vue', vueLoaderOptions) ),
        'gps-item-category-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/gpsItemCategorySelectComponent.vue', vueLoaderOptions) ),
        'user-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/userSelectComponent.vue', vueLoaderOptions) ),
    },
    props : ['site','lang','pmode','div_name','acl','pdata'],
    data(){
        return {
            est_data : this.$props.pdata,
            showProgressModal : false,
            showBiddingSuppliersSearchListModal : false,
            supplier : {},
            selectBiddingItem : {},
            new_pic : {},
        }
    },
    mounted(){
        this.est_data = this.$props.pdata;
        if(this.est_data.estimation_key == "__E1"){
            this.est_data.gps_contract_number_yn  = "Y";
        }else if(this.est_data.estimation_key == "__E2"){
            if(!this.est_data.gps_contract_number_yn){
                this.est_data.gps_contract_number_yn = "N";
                this.est_data.bidding_type = "NonCompetitive";
            }
        }else if(this.est_data.estimation_key == "__E3"){
            this.getPIC();
        }else if(this.est_data.estimation_key == "__E4"){
            this.est_data.gps_contract_number_yn = "N";
            this.est_data.bidding_type = "NonCompetitive";
        }
    },
    watch : {
        pdata(newVal){
            this.est_data = newVal;
            if(newVal.estimation_key == "__E1"){
                this.est_data.gps_contract_number_yn = "Y";
            }else if(newVal.estimation_key == "__E2"){
                if(!this.est_data.gps_contract_number_yn){
                    this.est_data.gps_contract_number_yn = "N";
                    this.est_data.bidding_type = "NonCompetitive";
                }
            }else if(this.est_data.estimation_key == "__E3"){
                this.getPIC();
            }else if(this.est_data.estimation_key == "__E4"){
                this.est_data.gps_contract_number_yn = "N";
                this.est_data.bidding_type = "NonCompetitive";
            }
        }
    },
    methods : {
        changeEstId(){
            if(this.est_data.estimation_key == "__E1"){
                this.est_data.gps_contract_number_yn = "Y";
            }else if(this.est_data.estimation_key == "__E2"){
                if(!this.est_data.gps_contract_number_yn){
                    this.est_data.gps_contract_number_yn = "N";
                    this.est_data.bidding_type = "NonCompetitive";
                }
            }else if(this.est_data.estimation_key == "__E3"){
                this.getPIC();
            }else if(this.est_data.estimation_key == "__E4"){
                this.est_data.gps_contract_number_yn = "N";
                this.est_data.bidding_type = "NonCompetitive";
            }
        },
        async form_validation(){
            var requiredElements = document.querySelectorAll("#form_validation")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }
            if(this.est_data.bidding_type == 'Competitive'){
                if(!this.est_data.bidding_list){
                    warningModal.show_modal("Please add one or more Bidding Suppliers!");
                    return false;
                }else{
                    if(this.est_data.bidding_list.length == 0){
                        warningModal.show_modal("Please add one or more Bidding Suppliers!");
                        return false;
                    }
                }
            }
            return true;
        },
        userSelected(type,user){
            this.new_pic = user;
        },
        async getPIC(){
            var vm = this;
            await axios.get('./api/estimationPIC', { params:{ 'div_name': vm.$props.div_name } } )
                .then(function(res){
                    vm.est_data.request_pic = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return false;
                });
            return true;
        },
        async setPIC(){
            if(!this.new_pic.EMPLOYEE_NUMBER){
                warningModal.show_modal("Please, select PIC user!");
                return false;
            }
            var vm = this;
            vm.new_pic.div_name = vm.$props.div_name;
            await axios.put('./api/estimationPIC',vm.new_pic )
                .then(function(res){
                    vm.est_data.request_pic = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return false;
                });
            this.new_pic = {};
            if(this.$refs.userSelectComponent){
                this.$refs.userSelectComponent.clearTarget();
            }
            return true;
        },
        async clearPIC(){
            var vm = this;
            await axios.delete('./api/estimationPIC',{ params:{ 'div_name': vm.$props.div_name } } )
                .then(function(res){
                    vm.est_data.request_pic = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return false;
                });
        },
        setCompany(data){
            this.est_data.company_name = data.SUPPLIER_LOCAL_NAME;
            this.est_data.company_name_en = data.SUPPLIER_ENGLISH_NAME;
        },
        setCompany2(data){
            this.supplier.supplier_name = data.SUPPLIER_LOCAL_NAME;
            this.supplier.supplier_name_en = data.SUPPLIER_ENGLISH_NAME;
            this.supplier.supplier_code = data.SUPPLIER_CODE;
        },
        setGpsItemCategory(data){
            this.est_data.gps_item_category = data.SRC_GRP_NAME;
        },
        setContractNumber(data){
            this.est_data.gps_contract_number = data.CNTRT_NO;
        },
        add_items(event){
            if(event) event.preventDefault();
            this.showBiddingSuppliersSearchListModal = true;
            this.supplier = {};
        },
        remove_items(event){
            if(event) event.preventDefault();
            var tempList = [];
            if(this.est_data.bidding_list){
                for(var i=0; i<this.est_data.bidding_list.length; i++){
                    if(this.est_data.bidding_list[i] != this.selectBiddingItem)
                        tempList.push(this.est_data.bidding_list[i]);
                }
            }
            this.est_data.bidding_list = tempList;
            this.selectBiddingItem = {};
        },
        addBiddingSupplier(){
            var requiredElements = document.querySelectorAll("#bidding_supplier_info")[0].querySelectorAll("[required]");
            for (var i = 0; i < requiredElements.length; i++) {
                var e = requiredElements[i];
                if(e.value == ""){
                    warningModal.show_modal("Please input in [ "+ e.name +" ] field!");
                    return false;
                }
            }

            this.showBiddingSuppliersSearchListModal = false;
            if(!this.est_data.bidding_list)
                this.est_data.bidding_list = [];
            this.est_data.bidding_list.push(this.supplier);
        },
    },
}
</script>

