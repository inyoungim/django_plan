<template>

    <div class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b>Calibration List</b>
            </div>

            <div class="col-auto ms-auto">
                <button class="btn btn-secondary shadow-sm py-1" style="min-width:80px;"
                        @click="excelDownload">Excel Download</button>
            </div>
        </div>
    </div>

    <div class="border-bottom border-primary py-1">
        <div class="hstack">
            <div class="col-auto">
                <div class="input-group">
                    <span class="input-group-text py-1">{{ this.$props.year }} Year</span>
                    <span v-if="search_type.includes('month')" class="input-group-text py-1">Month : {{ month }}</span>
                    <span v-else class="input-group-text py-1">All</span>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group">
                    <span class="input-group-text py-1">Type</span>
                    <select v-model="search_type" class="form-select py-1" disabled>
                        <option value="qty">Quantity</option>
                        <option value="target_year">
                            <span v-if="this.$props.lang=='kr'">교정 대상</span>
                            <span v-else>Calibration Target</span>
                        </option>
                        <option value="target_month">
                            <span v-if="this.$props.lang=='kr'">교정 대상</span>
                            <span v-else>Calibration Target</span>
                        </option>
                        <option value="complete_year">
                            <span v-if="this.$props.lang=='kr'">교정 완료</span>
                            <span v-else>Complete Calibrations</span>
                        </option>
                        <option value="complete_month">
                            <span v-if="this.$props.lang=='kr'">교정 완료</span>
                            <span v-else>Complete Calibrations</span>
                        </option>
                        <option value="waiting">
                            <span v-if="this.$props.lang=='kr'">교정 대기</span>
                            <span v-else>Waiting</span>
                        </option>
                        <option value="missing">
                            <span v-if="this.$props.lang=='kr'">분실/반납</span>
                            <span v-else>Missing/Return</span>
                        </option>
                        <option value="inst_room">
                            <span v-if="this.$props.lang=='kr'">계측기실</span>
                            <span v-else>Instrument Room</span>
                        </option>
                        <option value="agency">
                            <span v-if="this.$props.lang=='kr'">검교정 협력사</span>
                            <span v-else>Calibration Agency</span>
                        </option>
                        <option value="release">
                            <span v-if="this.$props.lang=='kr'">출고 대기 (계측기실)</span>
                            <span v-else>Waiting for release</span>
                        </option>
                    </select>
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group">
                    <span class="input-group-text py-1">{{selected_item.org_name}}</span>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" v-model="include_child"
                               @change="searchData"> Include Children
                    </div>
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">
                        <span v-if="lang=='kr'">자산 번호</span><span v-else>Asset Number</span>
                    </span>
                    <input class="form-control shadow-sm py-1" placeholder="Asset Number"
                           v-model="asset_number" @keyup.enter="searchData">
                </div>
            </div>
        </div>

        <div class="hstack mt-1">
            <div class="col-auto">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">User Name</span>
                    <input class="form-control shadow-sm py-1" placeholder="User Name"
                           v-model="search_user" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">
                        <span v-if="lang=='kr'">품명</span><span v-else>Product Name</span>
                    </span>
                    <input class="form-control shadow-sm py-1" placeholder="Product Name"
                           v-model="search_product_name" @keyup.enter="searchData">
                </div>
            </div>
            <div class="col-auto ms-2">
                <div class="input-group shadow-sm">
                    <span class="input-group-text py-1" style="width:120px;">
                        <span v-if="lang=='kr'">모델명</span><span v-else>Model Name</span>
                    </span>
                    <input class="form-control shadow-sm py-1" placeholder="Model Name"
                           v-model="search_model_name" @keyup.enter="searchData">
                </div>
            </div>

            <div class="col-auto ms-auto">
                <button class="btn btn-primary shadow-sm py-1" style="width:80px;" @click="searchData">Search</button>
            </div>
        </div>
    </div>

    <div class="table-responsive p-0 mt-2">
        <table class="table table-hover table-bordered">
            <thead style="background-color:#DDEEFF;">
            <tr>
                <th class="py-1 text-center">
                    <input class="form-check-input" type="checkbox"
                           :class="{'bg-secondary':checkNotMatch}"
                           :disabled="search_type != 'waiting'"
                        v-model="allChecked" @click="checkAItem">
                </th>
                <th class="py-1 text-center">PK</th>
                <th class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">자산 번호</span>
                    <span v-else>Asset Number</span>
                </th>
                <th class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">품명</span>
                    <span v-else>Product Name</span>
                </th>
                <th class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">모델명</span>
                    <span v-else>Model Name</span>
                </th>
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
                <th class="py-1 text-center text-nowrap">User Name</th>
                <th v-if="search_type=='qty' || search_type=='missing' || search_type.includes('target')"
                    class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">교정 완료일</span>
                    <span v-else>Calibration Date</span>
                </th>
                <th class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">차기 교정일</span>
                    <span v-else>Next Calibration Date</span>
                </th>
                <th v-if="search_type=='waiting'" class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">미교정 사용일</span>
                    <span v-else>Duration of uncalibrated</span>
                </th>
                <th v-if="search_type=='inst_room'" class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">계측기실 입고일</span>
                    <span v-else>Wearing Date of Instrument room</span>
                </th>
                <th v-if="search_type=='inst_room'" class="py-1 text-center text-nowrap">Organization</th>
                <th v-if="search_type=='inst_room'" class="py-1 text-center text-nowrap">User Name</th>

                <th v-if="search_type=='agency'" class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">검교정 협력사 입고일</span>
                    <span v-else>Wearing Date of Calibration agency</span>
                </th>
                <th v-if="search_type=='agency'" class="py-1 text-center text-nowrap">Organization</th>
                <th v-if="search_type=='agency'" class="py-1 text-center text-nowrap">User Name</th>

                <th v-if="search_type=='release' || search_type.includes('complete')"
                    class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">교정 완료일</span>
                    <span v-else>Calibration Date</span>
                </th>
                <th v-if="search_type=='release'" class="py-1 text-center text-nowrap">Organization</th>
                <th v-if="search_type=='release'" class="py-1 text-center text-nowrap">User Name</th>

                <th v-if="search_type=='release' || search_type.includes('complete')"
                    class="py-1 text-center text-nowrap">
                    <span v-if="lang=='kr'">출고 지연일</span>
                    <span v-else>Delivery delay period</span>
                </th>

                <th class="py-1 text-center text-nowrap">Status</th>
            </tr>
            </thead>
            <tbody class="shadow-sm">
                <tr v-for="item in tdata.itemList">
                    <td class="py-1 text-center">
                        <input class="form-check-input bg-opacity-50" type="checkbox"
                               :disabled="search_type != 'waiting'"
                               v-model="checked_ids" :value="item.id">
                    </td>
                    <td class="text-center text-nowrap">{{item.id}}</td>
                    <td class="text-start text-nowrap">{{ item.asset_number }}</td>
                    <td class="text-start text-nowrap">{{ item.asset_product }}</td>
                    <td class="text-start text-nowrap">{{ item.asset_model }}</td>
                    <td class="text-start text-nowrap">
                        <span v-if="toggle_id1" class="text-danger">[{{ item.user_org_id }}]</span>
                        <span v-if="toggle_code1" class="text-danger"><{{ item.user_org_nas_code }}></span>
                        {{ item.user_org_name }}
                    </td>
                    <td class="text-center text-nowrap">
                        <span v-if="lang=='kr'">{{ item.user_name }}</span>
                        <span v-else>{{ item.user_name_en }}</span>
                    </td>
                    <td v-if="search_type=='qty' || search_type=='missing' || search_type.includes('target')"
                        class="text-center text-nowrap">
                        {{ item.before_cal_date }}
                    </td>
                    <td class="text-center text-nowrap">{{ item.next_cal_date }}</td>

                    <td v-if="search_type=='waiting'" class="text-center text-nowrap text-danger">
                        {{ item.inst_room_delay_period }}
                    </td>
                    <td v-if="search_type=='inst_room'" class="text-center text-nowrap">
                        {{ item.inst_room_date }}
                    </td>
                    <td v-if="search_type=='inst_room'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.inst_room_user_org_name }}</span>
                        <span v-else>{{ item.inst_room_user_org_name_en }}</span>
                    </td>
                    <td v-if="search_type=='inst_room'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.inst_room_user_name }}</span>
                        <span v-else>{{ item.inst_room_user_name_en }}</span>
                    </td>

                    <td v-if="search_type=='agency'" class="text-center text-nowrap">
                        {{ item.agency_date }}
                    </td>
                    <td v-if="search_type=='agency'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.agency_user_org_name }}</span>
                        <span v-else>{{ item.agency_user_org_name_en }}</span>
                    </td>
                    <td v-if="search_type=='agency'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.agency_user_name }}</span>
                        <span v-else>{{ item.agency_user_name_en }}</span>
                    </td>

                    <td v-if="search_type=='release' || search_type.includes('complete')"
                        class="text-center text-nowrap">
                        {{ item.release_date }}
                    </td>
                    <td v-if="search_type=='release'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.release_user_org_name }}</span>
                        <span v-else>{{ item.release_user_org_name_en }}</span>
                    </td>
                    <td v-if="search_type=='release'" class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.release_user_name }}</span>
                        <span v-else>{{ item.release_user_name_en }}</span>
                    </td>

                    <td v-if="search_type=='release' || search_type.includes('complete')"
                        class="text-center text-nowrap text-danger">
                        {{ item.delivery_delay_period }}
                    </td>

                    <td class="text-center text-nowrap">
                        <span v-if="this.$props.lang=='kr'">{{ item.cal_status }}</span>
                        <span v-else>{{ item.cal_status_en }}</span>
                    </td>
                </tr>
                <tr v-if="!tdata.itemList || tdata.itemList.length == 0">
                    <td colspan="20" class="text-center text-nowrap">
                        There is no data
                    </td>
                </tr>
            </tbody>
            <tfoot>
                <tr>
                    <td colspan="100">
                        <div class="hstack mt-3">
                            <div class="col-md-3 col-12" role="group">
                                <div class="dropdown">
                                    <button class="btn btn-secondary dropdown-toggle" type="button" id="dropdownNumberButton"
                                        data-bs-toggle="dropdown" data-bs-auto-close="true" aria-expanded="false"> {{page_num}} </button>
                                    <ul class="dropdown-menu dropdown-menu-dark" aria-labelledby="dropdownNumberButton" style="min-width:50px;" >
                                        <li><a class="dropdown-item" :class="{active: page_num == 10}" href="#" @click="page(tdata.active_page, 10, $event)">10</a></li>
                                        <li><a class="dropdown-item" :class="{active: page_num == 20}" href="#" @click="page(tdata.active_page, 20, $event)">20</a></li>
                                        <li><a class="dropdown-item" :class="{active: page_num == 50}" href="#" @click="page(tdata.active_page, 50, $event)">50</a></li>
                                        <li><a class="dropdown-item" :class="{active: page_num == 100}" href="#" @click="page(tdata.active_page, 100, $event)">100</a></li>
                                    </ul>
                                    Total {{ tdata.total_article }} articles
                                </div>
                            </div>
                            <div class="col-md-6 col-12">
                                <ul class="pagination justify-content-center mb-0">

                                    <li class="page-item" :class="{disabled : tdata.previous_page == 0}" >
                                        <a class="page-link text-center mx-1 px-3" aria-label="Previous"
                                           :style="{color:previous_text_color}"
                                           href="#" @click="page(tdata.previous_page, page_num, $event)"> &Lang;&Lang; </a>
                                    </li>

                                    <li v-for="p in tdata.page_list" :class="['page-item', { active: tdata.active_page === p }]">
                                        <a class="page-link" href="#" @click="page(p, page_num, $event)">{{ p }}</a>
                                    </li>

                                    <li class="page-item" :class="{disabled : tdata.next_page == 0}">
                                        <a class="page-link text-center mx-1 px-3" aria-label="Next"
                                           :style="{color:next_text_color}"
                                            href="#"  @click="page(tdata.next_page, page_num, $event)"> &Rang;&Rang; </a>
                                        </a>
                                    </li>

                                </ul>
                            </div>
                            <div class="col-md-3 col-12 text-end">
                                <button v-if="search_type == 'waiting' && this.$props.acl >=7"
                                        class="btn btn-primary shadow-sm py-1 me-1"
                                    style="width:80px;" @click="mailingData">Mailing</button>
                            </div>
                        </div>

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
    props : ['site','lang','acl','div_name','year','month','include_child','selected_item','search_type'],
    components: {

    },
    data(){
        return {
            div_name : this.$props.div_name,
            year : this.$props.year,
            month : this.$props.month,
            include_child : this.$props.include_child,
            selected_item : this.$props.selected_item,
            search_type : this.$props.search_type,

            asset_number : '',
            search_user:'',
            search_product_name: '',
            search_model_name:'',
            mode : 'list',
            tdata : {},
            page_num : 10,
            active_page: 1,
            edit_item : {},
            showProgressModal : false,
            checked_ids:[],
            checked_all:false,

            toggle_id1 : false,
            toggle_code1 : false,
            checked_ids : [],
        }
    },
    mounted(){
        this.searchData();
    },
    methods: {
        async page(num, page_num, event){
            if(event) event.preventDefault();
            this.showProgressModal = true;
            var vm = this;
            await axios.get('./api/calibrationList',
                { params:{ div_name : vm.div_name,
                           year : vm.year,
                           month : vm.month,
                           org_id : vm.selected_item.id,
                           include_child : vm.include_child,
                           search_type : vm.search_type,
                           active_page: num, page_num: page_num,
                           asset_number : vm.asset_number,
                           search_user : vm.search_user,
                           search_product_name : vm.search_product_name,
                           search_model_name : vm.search_model_name
                         } })
                .then(function(res){
                    vm.tdata = res.data;
                    vm.page_num = page_num;
                    vm.mode = "list";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                });
            this.showProgressModal = false;
        },
        searchData(){
            this.page(this.tdata.active_page, this.page_num );
        },
        async excelDownload(){
            var vm = this;
            var svr_error = false;
            var config = {
                responseType: 'blob',
                params:{  div_name : vm.div_name,
                           year : vm.year,
                           month : vm.month,
                           org_id : vm.selected_item.id,
                           include_child : vm.include_child,
                           search_type : vm.search_type,
                           active_page: this.tdata.active_page, page_num: this.page_num,
                           asset_number : vm.asset_number,
                           search_user : vm.search_user,
                           search_product_name : vm.search_product_name,
                           search_model_name : vm.search_model_name
                }
            };
            this.showProgressModal = true;
            await axios.get('./api/calibrationListExcel', config )
                .then(function (res) {
                    const url = window.URL.createObjectURL(new Blob([res.data]));
                    const link = document.createElement('a');
                    link.href = url;
                    link.setAttribute('download', "calibration_list.xlsx");
                    document.body.appendChild(link);
                    link.click();
                 })
                .catch(function (err){
                    warningModal.show_modal(err);
                    svr_error = true;
                    return;
                });

            if(!svr_error){
                await axios.delete('./api/calibrationListExcel', null )
                    .then(function (res) { })
                    .catch(function (err){
                        warningModal.show_modal(err);
                        return;
                    });
            }
            this.showProgressModal = false;
        },
        checkAItem(event){
            this.checked_ids = [];
            if(this.tdata.itemList){
                for(var i=0; i<this.tdata.itemList.length; i++){
                    if(!this.allChecked){
                        this.checked_ids.push(this.tdata.itemList[i].id);
                    }
                }
            }
        },
        async mailingData(){
            if(this.$props.lang=='kr'){
                confirmModal.set_title("Confirm");
                confirmModal.set_contents("미 입고 계측기에 대하여 모두 메일을 발송 합니다.");
                confirmModal.show_modal(this);
            }else{
                confirmModal.set_title("Confirm");
                confirmModal.set_contents("Are you sure to execute mailing?");
                confirmModal.show_modal(this);
            }
        },
        async modal_ok(){
            this.showProgressModal = true;
            var vm = this;
            var mail_obj = {
                'div_name' : this.div_name,
                'year' : this.year,
                'month' : this.month,
            };
            // mail_obj.data_list = [];
            // for(var i=0; i<this.tdata.itemList.length; i++){
            //     if(this.checked_ids.includes(this.tdata.itemList[i].id)){
            //         mail_obj.data_list.push(this.tdata.itemList[i]);
            //     }
            // }
            await axios.post('./api/sendmail', mail_obj)
                .then(function(res){
                    warningModal.show_modal(res.data.msg);
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
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
        checkNotMatch(){
            var all_item_length = 0;
            if(this.tdata.itemList){
                all_item_length = this.tdata.itemList.length;
            }
            if(this.checked_ids.length == all_item_length){
                this.allChecked = true;
                return false;
            }else if(this.checked_ids.length == 0){
                this.allChecked = false;
                return false;
            }
            return true;
        },
    },
}
</script>
