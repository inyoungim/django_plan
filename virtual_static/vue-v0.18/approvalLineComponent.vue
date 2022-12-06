<template>

    <div class="hstack border-bottom border-primary align-items-end">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <div>
                <i v-if="this.$props.acl >= 9" @dblclick="changeAdminMode" class="bi bi-people-fill text-primary px-2"></i>
                <i v-else class="bi bi-people-fill text-primary px-2"></i>
                <b>Approval Line</b>
            </div>
        </div>
        <div class="col-auto ms-1 me-auto p-0">
            <i class="bi bi-list-task m-0 p-1 fs-4 " style="cursor: pointer;" @click="toggle_wf_show"></i>
        </div>

        <div class="col hstack ms-1 pb-1">
            <!-- 결재라인 수정-->
            <!-- MASTER 이거나, 배포 이전 단계에서 현재단계 이후만 수정 가능 -->
            <div class="ms-auto">
                <div v-if="pmode == 'view' && mode == 'view' &&
                    ( (nextAppline.active && nextAppline.step > 0) || (this.$props.app_type == 'MASTER' && this.$props.acl >= 7))">
                    <button class="btn btn-warning ms-2" type="button" style="padding:0.1em 0.5em;min-width:90px;"
                        @click="modifyAppLine">Modify Approval Line</button>
                </div>
                <div v-else-if="pmode == 'view' && mode == 'view' && nextAppline.step > 0 && adminmode">
                    <button class="btn btn-warning ms-2" type="button" style="padding:0.1em 0.5em;min-width:90px;"
                        @click="modifyAppLine">Modify Approval Line (Admin Mode)</button>
                </div>
                <div v-if="mode == 'modify'">
                    <button class="btn btn-warning ms-2" type="button" style="padding:0.1em 0.5em;min-width:90px;"
                        @click="updateAppLine">Update Approval Line</button>
                    <button class="btn btn-secondary ms-2" type="button" style="padding:0.1em 0.5em;min-width:90px;"
                        @click="cancelModifyAppLine">Cancel</button>
                </div>
            </div>
        </div>
    </div>

    <div v-if="wf_show" class="w-100 m-0 py-2 hstack border-bottom border-primary"
         style="background-color:#FFFFEE; overflow:auto" id="workflow_diagram">
        <div class="ms-auto"></div>

        <div v-for="(stage,i) in stageList" class="hstack">
            <div v-if="(this.$props.app_type != 'MASTER' &&
                            (stage.stage_type == 'Serial' || stage.stage_type == 'Distribution') &&
                            (stage.option != 'Hidden' && stage.option != 'HiddenAll') ) ||
                       (this.$props.app_type == 'MASTER' &&
                            (stage.stage_type == 'Serial' || stage.stage_type == 'Distribution') )"
                 class="col-auto px-2">
                <i class="bi bi-caret-right-fill"></i>
            </div>

            <div v-if="stage.option == 'Mandatory'" class="card text-center border border-primary" style="min-width:100px;">
                <div class="card-body p-1">
                    <h5 class="py-1 text-center fw-bold">{{stage.stage}}</h5>
                </div>
                <div class="card-footer text-muted py-0 text-end">
                    <div v-if="stage.reject_stage"> {{stage.reject_stage}} <i class="bi bi-arrow-return-left"></i> </div>
                    <div v-else class="my-4">&nbsp;</div>
                </div>
            </div>
            <div v-else-if="stage.option == 'Optional'" class="card text-center" style="border:1px dashed gray; min-width:100px;">
                <div class="card-body p-1">
                    <h5 class="py-1 text-center">{{stage.stage}}</h5>
                </div>
                <div class="card-footer text-muted py-0 text-end">
                    <div v-if="stage.reject_stage"> {{stage.reject_stage}} <i class="bi bi-arrow-return-left"></i> </div>
                    <div v-else class="my-4">&nbsp;</div>
                </div>
            </div>
            <div v-else-if="(stage.option == 'Hidden' || stage.option == 'HiddenAll') && this.$props.app_type == 'MASTER'"
                 class="card text-center" style="border:1px dashed red; min-width:100px;">
                <div class="card-header p-0">
                    <span class="text-primary fw-bold" :class="{'text-danger':stage.option == 'HiddenAll'}">
                        ( {{stage.option}} )
                    </span>
                </div>

                <div class="card-body p-1">
                    <h5 class="py-1 m-0 text-center">{{stage.stage}}</h5>

                </div>
                <div class="card-footer text-muted py-0 text-end">
                    <div v-if="stage.reject_stage"> {{stage.reject_stage}} <i class="bi bi-arrow-return-left"></i> </div>
                    <div v-else class="my-4">&nbsp;</div>
                </div>
            </div>
        </div>
        <div class="ms-auto hstack position-relative">
            <button type="button" class="btn-close mx-2 position-absolute top-0 end-0" @click="toggle_wf_show"></button>
        </div>

    </div>
    <div v-if="(this.$props.app_type == 'MASTER' && this.$props.div_name) || attached_files.length > 0"
         class="w-100 m-0 hstack border-bottom border-primary" style="background-color:#FFFFEE; overflow:auto">
        <div class="col input-group">
            <label class="input-group-text bg-warning bg-opacity-25" style="width:150px;">
                <span v-if="this.$props.lang == 'kr'"><b>결재 재량권</b></span>
                <span v-else><b>Approval discretion</b></span>
            </label>
            <button class="input-group-text btn btn-warning bg-opacity-25" @click="vieApprovalDiscretionModal">
                <i class="bi bi-arrow-up-right-square"></i>
            </button>

            <label class="form-control p-1 pb-0 bg-warning bg-opacity-25">
                <attached-file-component
                        :attached_list="attached_files"
                        :type="'single'"
                        :base_url="'approval_discretion/'">
                </attached-file-component>
            </label>
        </div>
    </div>

    <!-- approval line modify -->
    <div v-if="(this.$props.pmode == 'modify' || mode =='new' || mode =='modify') && mode !='disable' "
         class="hstack border border-primary border-top-0 border-start-0 border-end-0 py-1"
         :class="{'bg-danger bg-opacity-50 p-2' : appline_user_mode == 'modify'}">
        <div class="input-group" style="width:170px;">
            <span class="input-group-text" style="padding:0.1em 0.5em;"><b>Stage</b></span>
            <div class="form-control p-0" style="padding:0.1em 0.5em;">
                <select v-model="new_stage" class="form-select border-0" style="padding:0.1em 0.5em;"
                    :disabled="new_step == 'SAME' || appline_user_mode == 'modify'">
                    <option v-for="stage,i in stageList"
                            v-show="i > 0 && ( (stage.option != 'Hidden' && stage.option != 'HiddenAll')
                                || this.$props.app_type == 'MASTER')"
                            :value="stage.stage">
                        {{stage.stage}}
                        <span v-if="stage.option == 'Mandatory'">**</span>
                    </option>
                </select>
            </div>
        </div>

        <div v-if="appline_user_mode != 'modify'" class="input-group ms-1" style="width:130px;">
            <span class="input-group-text" style="padding:0.1em 0.5em;"><b>Step</b></span>
            <div class="form-control p-0" style="padding:0.1em 0.5em;">
                <select v-model="new_step" class="form-select border-0" style="padding:0.1em 0.5em;"
                    :disabled="appline_user_mode == 'modify'" @change="stepCheck">
                    <option value="NEXT"> Latest </option>
                    <option value="SAME"> Same </option>
                </select>
            </div>
        </div>

        <div v-if="this.$props.app_type == 'MASTER'" class="input-group ms-1" style="width:150px;">
            <span class="input-group-text" style="padding:0.1em 0.5em;"><b>Options</b></span>
            <input class="form-control" style="padding:0.1em 0.5em;" placeholder="Null" v-model="new_option">
        </div>

        <div v-if="appline_user_mode != 'modify'" class="input-group ms-3" style="width:300px;">
            <i class="input-group-text bi bi-person-fill text-primary px-2" style="padding:0.1em 0.5em;"></i>
            <input class="form-control" style="width:100px; padding:0.1em 0.5em;" placeholder="Name"
                v-model="new_name" @keydown.enter.prevent="searchUser">
            <button class="btn btn-primary" style="padding:0.1em 0.5em;" @click="searchUser">Search & Add</button>
        </div>

        <div v-if="this.$props.app_type == 'MASTER'" class="input-group text-center ms-1" style="width:350px;">
            <span class="input-group-text" style="padding:0.1em 0.5em;"><b>Condition</b></span>
            <div class="form-control p-0" style="padding:0.1em 0.5em;">
                <select v-model="new_condition" class="form-select border-0"
                        style="padding:0.1em 0.5em;" @change="resetCondition">
                    <option value=""> All </option>
                    <option value="Adjust">
                        <div v-if="this.$props.lang == 'kr'"> 조정 품의시 추가 </div>
                        <div v-else> Assigned at adjustment document </div>
                    </option>
                    <option value="Cost">
                        <div v-if="this.$props.lang == 'kr'"> 품의 금액 초과시 추가 </div>
                        <div v-else> Assigned at execution cost over than </div>
                    </option>
                    <option value="OrgAccount">
                        <div v-if="this.$props.lang == 'kr'"> (조직+계정) 품의시 추가</div>
                        <div v-else> Assigned for (Organization+Account) </div>
                    </option>
                </select>
            </div>
        </div>
        <div v-if="new_condition == 'Cost' || new_condition == 'OrgAccount'"
             class="input-group ms-1" style="width:100px;">
            <input class="form-control" style="width:100px; padding:0.1em 0.5em;" v-model="new_condition2">
        </div>
        <div v-if="appline_user_mode == 'modify'" class="col-auto ms-3">
            <button class="btn btn-primary" style="padding:0.1em 0.5em;" @click="updateUser">Update</button>
            <button class="btn btn-secondary ms-2" style="padding:0.1em 0.5em;" @click="cancelUser">Cancel</button>
        </div>
    </div>

    <!-- approval line modify or master show -->
    <div v-if="(this.$props.pmode == 'modify' || mode =='new' || mode =='modify') && mode !='disable' "
         class="table-responsive m-0 p-0">
        <table class="table table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center" width="10%">Stage</th>
                    <th v-if="pmode =='modify' || mode =='new' || mode =='modify'" class="py-1 text-center">
                        <i class="bi bi-arrow-up"></i>
                        <i class="bi bi-arrow-down"></i>
                    </th>
                    <th class="py-1 text-center" width="5%">Step</th>
                    <th v-if="this.$props.app_type != 'MASTER'" class="py-1 text-center" width="10%">Status</th>
                    <th class="py-1 text-center" width="10%">Name</th>
                    <th class="py-1 text-start" width="15%">Email</th>
                    <th class="py-1 text-start" >Position</th>
                    <th class="py-1 text-start" >Organization</th>
                    <th class="py-1 text-center" width="10%">Option</th>
                    <th v-if="appline_user_mode != 'modify' && (pmode =='modify' || mode =='new' || mode =='modify')"
                        class="col-auto py-1 text-center">
                        <i class="bi bi-person-x-fill"></i>
                    </th>
                    <th v-if="this.$props.app_type == 'MASTER'" class="py-1 text-center">Condition</th>
                    <th v-if="this.$props.app_type == 'MASTER' && (pmode =='modify' || mode =='new' || mode =='modify')"
                        class="col-auto py-1 text-center">
                        <i class="bi bi-pencil-square"></i>
                    </th>
                </tr>
            </thead>
            <tbody v-for="app in applines">
                <tr v-if="app.stage_option !='HiddenAll' || app.empno == nextAppline.user_empno || nextAppline.step == 0
                            || this.$props.app_type == 'MASTER' || adminmode " class="bg-opacity-25"
                    :class="{'bg-warning' : app.empno == selectedUser.empno && app.stage == selectedUser.stage}"
                    class="border-end"
                    @click="selectUserRow(app)" style="cursor:pointer">
                    <td class="py-1 text-center text-nowrap">
                        {{ app.stage }}
                        <span v-if="(pmode =='modify' || mode =='new' || mode =='modify') &&
                            (app.stage_type == 'Serial' || app.stage_type == 'Parallel') && isStageChangeable(app)">
                            <i class="bi bi-arrow-repeat" @click="changeStage(app,$event)"></i>
                        </span>
                    </td>
                    <td v-if="pmode =='modify' || mode =='new' || mode =='modify'" class="py-1 text-center">
                        <div v-if="app.stage_type == 'Serial' || app.stage_type == 'Parallel' ">
                            <i class="bi bi-arrow-up" @click="moveUpUserRow(app,$event)"></i>
                            <i class="bi bi-arrow-down" @click="moveDownUserRow(app,$event)"></i>
                        </div>
                    </td>
                    <td class="py-1 text-center">{{ app.step }}</td>
                    <td v-if="this.$props.app_type != 'MASTER'" class="py-1 align-middle text-center">
                        <span v-if="!app.state && app.step == nextAppline.step" class="text-danger">Waiting</span>
                        <span v-else-if="app.step > nextAppline.step"></span>
                        <span v-else>{{ app.state }}</span>
                    </td>
                    <td class="py-1 text-center text-nowrap">
                        <div v-if="this.$props.lang == 'kr'"> {{ app.name }} </div>
                        <div v-else> {{ app.name_en }} </div>
                    </td>
                    <td class="py-1 text-start">{{ app.email }}</td>
                    <td class="py-1 text-start">
                        <div v-if="this.$props.lang == 'kr'"> {{ app.position }} </div>
                        <div v-else> {{ app.position_en }} </div>
                    </td>
                    <td class="py-1 text-start">
                        <div v-if="this.$props.lang == 'kr'"> {{ app.organization }} </div>
                        <div v-else> {{ app.organization_en }} </div>
                    </td>
                    <td class="py-1 text-center">{{ app.option }}</td>
                    <td v-if="appline_user_mode != 'modify' && (pmode =='modify' || mode =='new' || mode =='modify')"
                        class="py-1 text-center">
                        <i v-if="(mode == 'new' && app.option == '') ||
                                 (app.step > nextAppline.step && app.option == '' ) ||
                                 this.$props.app_type == 'MASTER' "
                           class="bi bi-person-x-fill text-danger" style="cursor:pointer"
                           @click="removeUser(app,$event)"></i>
                        <i v-else class="bi bi-person"></i>
                    </td>
                    <td v-if="this.$props.app_type == 'MASTER'"
                        class="py-1 align-middle text-start text-nowrap hstack border-0">
                        <span v-if="app.condition == 'Adjust'">
                            <div v-if="this.$props.lang == 'kr'"> 조정 품의시 추가 </div>
                            <div v-else> Assigned at adjustment document </div>
                        </span>
                        <span v-else-if="app.condition == 'Cost'">
                            <div v-if="this.$props.lang == 'kr'"> 품의 금액 초과시 추가 </div>
                            <div v-else> Assigned at execution cost over than </div>
                        </span>
                        <span v-else-if="app.condition == 'OrgAccount'">
                            <div v-if="this.$props.lang == 'kr'"> (조직+계정) 품의시 추가 </div>
                            <div v-else> Assigned for (Organization+Account) </div>
                        </span>
                        <span v-if="app.condition2 && app.condition2 !=''"> : {{ markedCost(app.condition2) }}</span>
                    </td>
                    <th v-if="this.$props.app_type == 'MASTER' && (pmode =='modify' || mode =='new' || mode =='modify')"
                        class="col-auto py-1 text-center">
                        <i class="bi bi-pencil-square" @click="modifyUser(app,$event)"></i>
                    </th>
                </tr>
            </tbody>
            <tbody v-if="applines.length == 0">
                <tr>
                    <td class="py-1 text-center"  colspan='11'> There is no data. </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- approval line show -->
    <div v-else class="table-responsive m-0 p-0">
        <table class="table table-bordered">
            <thead style="background-color:#DDEEFF;">
                <tr>
                    <th class="py-1 text-center" width="10%">Stage</th>
                    <th class="py-1 text-center" width="5%">Step</th>
                    <th class="py-1 text-center" width="10%">State</th>
                    <th class="py-1 text-center" width="20%">Date</th>
                    <th class="py-1 text-start" width="55%">Approval & Comments</th>
                    <th v-if="this.$props.app_type == 'MASTER'" class="py-1 text-center">Option</th>
                    <th v-if="this.$props.app_type == 'MASTER'" class="py-1 text-center">Condition</th>
                </tr>
            </thead>
            <tbody v-for="app in applines">
                <tr v-if="app.stage_option !='HiddenAll' || app.empno == nextAppline.user_empno || nextAppline.step == 0
                            || this.$props.app_type == 'MASTER' || adminmode " class="border-end bg-opacity-25"
                    :class="{'bg-warning' : app.step == nextAppline.step && (!app.state || !app.state.includes('_') ) }">
                    <td class="py-1 align-middle text-center">{{ app.stage }}</td>
                    <td class="py-1 align-middle text-center">{{ app.step }}</td>
                    <td v-if="!app.state && app.step == nextAppline.step"
                        class="py-1 align-middle text-center text-danger">Waiting</td>
                    <td v-else class="py-1 align-middle text-center text-nowrap"
                        :class="{'text-danger':app.state && app.state.includes('_NG')}">{{ app.state }}</td>
                    <td class="py-1 align-middle text-center"
                        :class="{'text-danger':app.state && app.state.includes('_NG')}">{{ app.date }}</td>
                    <td class="py-1 align-middle text-start">
                        <div v-if="app.option == 'ADMIN'"> Admin Comments </div>
                        <div v-else>
                            <div v-if="this.$props.lang == 'kr'"> {{ app.name }} {{ app.position }} / {{ app.organization }} </div>
                            <div v-else> {{ app.name_en }} {{ app.position_en }} / {{ app.organization_en }} </div>
                            <button v-if="!app.date && app.app_count > 1 && app.step == nextAppline.step"
                                    class="btn btn-secondary ms-3"
                                    type="button" style="padding:0.1em 0.5em;min-width:90px;"
                                    @click="showAppHistory">Show Approval History</button>
                        </div>
                        <div v-if="app.date && app.comments" class="hstack">
                            <div class="vstack" >
                                <i v-if="app.option == 'ADMIN'" class="bi bi-person-circle text-danger ms-3 me-1 align-top"></i>
                                <i v-else class="bi bi-chat-dots-fill text-primary ms-3 me-1 align-top"></i>
                            </div>
                            <div class="w-100" v-html="app.comments.replace(/(?:\r\n|\r|\n)/g, '<br />')"></div>
                        </div>
                    </td>
                    <td v-if="this.$props.app_type == 'MASTER'" class="py-1 align-middle text-start">
                        {{ app.option }}
                    </td>
                    <td v-if="this.$props.app_type == 'MASTER'"
                        class="py-1 align-middle text-start text-nowrap hstack border-0">
                        <span v-if="app.condition == 'Adjust'">
                            <div v-if="this.$props.lang == 'kr'"> 조정 품의시 추가 </div>
                            <div v-else> Assigned at adjustment document </div>
                        </span>
                        <span v-else-if="app.condition == 'Cost'">
                            <div v-if="this.$props.lang == 'kr'"> 품의 금액 초과시 추가 </div>
                            <div v-else> Assigned at execution cost over than </div>
                        </span>
                        <span v-else-if="app.condition == 'OrgAccount'">
                            <div v-if="this.$props.lang == 'kr'"> (조직+계정) 품의시 추가</div>
                            <div v-else> Assigned for (Organization+Account) </div>
                        </span>
                        <span v-if="app.condition2 && app.condition2 !=''"> : {{ markedCost(app.condition2) }}</span>
                    </td>
                </tr>
            </tbody>
            <tbody v-if="applines.length == 0">
                <tr>
                    <td class="py-1 text-center"  colspan='11'> There is no data. </td>
                </tr>
            </tbody>
        </table>
    </div>

    <!-- Approval / Reject / Retrive Button -->
    <div class="hstack my-3">
        <div class="me-auto"></div>

        <div v-if="pmode == 'view' && mode == 'view' && nextAppline.step > 0 && adminmode">
                <button class="btn btn-success ms-2" type="button" style="min-width:100px;"
                    @click="approvalAppLine('OK')">{{nextAppline.stage}} (Admin Mode)</button>
                <button class="btn btn-danger ms-2" type="button" style="min-width:100px;"
                    @click="approvalAppLine('NG')">Reject (Admin Mode)</button>
        </div>
        <div v-if="pmode == 'view' && mode == 'view' && nextAppline.active && nextAppline.step > 0 ">
            <!-- Approval / Reject -->
            <button class="btn btn-success ms-2" type="button" style="min-width:100px;"
                    @click="approvalAppLine('OK')">{{nextAppline.stage}}</button>

            <button v-if="nextAppline.reject_stage != 'X' "
                    class="btn btn-danger ms-2" type="button" style="min-width:100px;"
                    @click="approvalAppLine('NG')">Reject</button>
        </div>
        <div v-else-if="pmode == 'view' && mode == 'view'
            && nextAppline.lastStep == 0 && (nextAppline.isOwner == 1 || adminmode)">
            <!-- Self Reject -->
            <button v-if="adminmode" class="btn btn-danger ms-2" type="button" style="min-width:100px;"
                    @click="selfRejectAppLine">Self Reject (Admin Mode)</button>
            <button v-else class="btn btn-danger ms-2" type="button" style="width:100px;"
                    @click="selfRejectAppLine">Self Reject</button>
        </div>
        <div class="ms-auto"></div>
    </div>

    <div v-if="showModal == 'show'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">User Search Result</h5>
                    <button type="button" class="btn-close btn-close-white" @click="showModal = ''"></button>
                </div>
                <div class="modal-body" style="max-height:400px;">

                    <table class="table table-hover table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="5%"><i class="bi bi-person-fill"></i></th>
                                <th class="py-1 text-center" >Name</th>
                                <th class="py-1 text-center" >Position</th>
                                <th class="py-1 text-center" >E-Mail</th>
                                <th class="py-1 text-center" >Organization</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="user in searchList" @click="addUser(user)" style="cursor:pointer">
                                <td class="py-1 text-center"><i class="bi bi-person-fill"></i></td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.FULL_NAME }} </div>
                                    <div v-else> {{ user.NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.JIKWI_NAME }} </div>
                                    <div v-else> {{ user.JIKWI_NAME_ENG }} </div>
                                </td>
                                <td class="py-1 text-start">{{ user.EMAIL }}</td>
                                <td class="py-1 text-start">
                                    <div v-if="this.$props.lang == 'kr'"> {{ user.OLD_ORG_NAME }} </div>
                                    <div v-else> {{ user.ORGAN_NAME_ENG }} </div>
                                </td>
                            </tr>
                            <tr v-if="searchList.length == 0">
                                <td class="py-1 text-center"  colspan='11'> There is no data. </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        Please, select one row.
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Approval Dialog -->
    <div v-if="showApprovalModal == 'show'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move"
                    :class="[approval_dialog_mode=='OK'? 'bg-success' : 'bg-danger' ]">
                    <h5 v-if="approval_dialog_mode=='OK'" class="col">{{nextAppline.stage}}</h5>
                    <h5 v-else class="col">Reject</h5>
                    <span v-if="nextAppline.activeid.length > 1">
                        <select v-model="admin_activeid" class="form-select border-0" style="min-width:100px; padding:0.1em 0.5em;">
                            <option v-for="(aid,i) in nextAppline.activeid" :value="aid">{{nextAppline.activename[i]}}</option>
                        </select>
                    </span>
                </div>
                <div class="modal-body" style="max-height:400px;">
                    <div class="col-auto hstack ms-1 pb-1">
                        <div class="col input-group">
                            <label class="input-group-text" style="width:90px;"><b>Comments</b></label>
                            <textarea ref="app_comments" class="form-control p-1 ps-2" style="height:80px"></textarea>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <div v-if="approval_dialog_mode == 'OK'"
                             class="btn bg-success mx-2 text-white" style="width:100px;"
                             @click="confirmApproval">{{nextAppline.stage}}</div>
                        <div v-else
                             class="btn mx-2 disabled" style="border: 1px dashed; width: 100px;">{{nextAppline.stage}}</div>

                        <div v-if="approval_dialog_mode == 'NG'"
                             class="btn btn-danger mx-2" style="width:100px;" @click="checkRejectModal">Reject</div>
                        <div v-else
                             class="btn mx-2 disabled" style="border: 1px dashed; width: 100px;">Reject</div>

                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeApprovalModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showApprovalConfirmModal == 'show'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-danger text-white">
                    <h5 class="col">{{nextAppline.stage}} Reject</h5>
                </div>
                <div class="modal-body" style="max-height:400px;">
                    <div class="row align-items-center" style="min-height:100px;">
                        <div class="w-100 fs-5">
                            Are you sure to reject?
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <div class="btn btn-danger mx-2" style="width:130px;" @click="confirmReject">Reject Confirm</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeApprovalModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="showSelfRejctConfirmModal == 'show'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-danger text-white">
                    <h5 class="col">Self Reject</h5>
                </div>
                <div class="modal-body" style="max-height:400px;">
                    <div class="row align-items-center" style="min-height:100px;">
                        <div class="w-100 fs-5">
                            Are you sure to self reject?
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <div class="btn btn-danger mx-2" style="width:130px;" @click="confirmSelfReject">Reject Confirm</div>
                        <div class="btn btn-secondary mx-2" style="width:100px;" @click="closeApprovalModal">Cancel</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Approval History Dialog -->
    <div v-if="showApprovalHistoryModal == 'show'" class="vue_modal" style="z-index: 9990;">
        <div class="vue_overlay"></div>
        <div class="modal-dialog modal-dialog-centered modal-lg modal-dialog-scrollable">
            <div class="modal-content text-center">
                <div class="modal-header py-2 bg-success text-white" style="cursor:move">
                    <h5 class="col">Approval History</h5>
                    <button type="button" class="btn-close btn-close-white" @click="showApprovalHistoryModal= ''"></button>
                </div>
                <div class="modal-body" style="max-height:400px;">

                    <table class="table table-bordered">
                        <thead style="background-color:#DDEEFF;">
                            <tr>
                                <th class="py-1 text-center" width="10%">Stage</th>
                                <th class="py-1 text-center" width="5%">Step</th>
                                <th class="py-1 text-center" width="10%">State</th>
                                <th class="py-1 text-center" width="20%">Date</th>
                                <th class="py-1 text-start" width="55%">Approval & Comments</th>
                            </tr>
                        </thead>
                        <tbody class="shadow-sm">
                            <tr v-for="app in apphistorys" class="bg-opacity-25">
                                <td class="py-1 align-middle text-center">{{ app.stage }}</td>
                                <td class="py-1 align-middle text-center">{{ app.step }}</td>
                                <td class="py-1 align-middle text-center"
                                    :class="{'text-danger':app.state.includes('_NG')}">{{ app.state }}</td>
                                <td class="py-1 align-middle text-center"
                                    :class="{'text-danger':app.state.includes('_NG')}">{{ app.date }}</td>
                                <td class="py-1 align-middle text-start">
                                    <div v-if="app.option == 'ADMIN'"> Admin Comments </div>
                                    <div v-else>
                                        <div v-if="this.$props.lang == 'kr'"> {{ app.name }} {{ app.position }} / {{ app.organization }} </div>
                                        <div v-else> {{ app.name_en }} {{ app.position_en }} / {{ app.organization_en }} </div>
                                    </div>
                                    <div v-if="app.date && app.step >0">
                                        <i v-if="app.option == 'ADMIN'" class="bi bi-person-circle text-danger ms-3 me-1"></i>
                                        <i v-else class="bi bi-chat-dots-fill text-primary ms-3 me-1"></i>
                                        {{app.comments}}
                                    </div>
                                </td>
                            </tr>
                        </tbody>
                    </table>

                </div>
                <div class="modal-footer">
                    <div class="w-100">
                        <div class="btn btn-secondary" style="width:100px;" @click="showApprovalHistoryModal= ''">Close</div>
                    </div>
                </div>
            </div>
        </div>
    </div>

    <div v-if="approvalDiscretionModal">
        <approval-discretion-modal-component
                ref="approvalDiscretionModalComponent"
                :site="this.$props.site"
                :lang="this.$props.lang"
                :acl="this.$props.acl"
                :div_name="this.$props.div_name"
                :app_type="this.$props.app_type"
                :appid="this.$props.appid"
                :app_key="this.$props.app_key"
                @update-attached="updateAttached"
                @close-modal="approvalDiscretionModal=false">
        </approval-discretion-modal-component>
    </div>

    <!-- Progress bar Modal -->
    <div v-if="showProgressModal == 'show'" class="vue_modal" style="z-index: 9995;">
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
// mode : view, new, modify
// emit : @valid-ok, @active-appline, @load-complete
export default {
    props : ['pmode','site','lang','div_name','app_type','appid','app_key','acl','preset_item1','preset_item2'],
    components: {
        'attached-file-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/attachedFileComponent.vue', vueLoaderOptions) ),
        'approval-discretion-modal-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/approvalDiscretionModalComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            stageList : [],
            applines : [],
            attached_files : [],
            apphistorys : [],
            nextAppline : {},
            selectedUser : {},
            new_stage : "",
            new_step : "NEXT",
            new_condition : '',
            new_condition2 : '',
            searchList : [],
            showModal : "",
            showApprovalModal : "",
            showSelfRejctConfirmModal : "",
            showApprovalConfirmModal : "",
            showApprovalHistoryModal : "",
            approvalDiscretionModal : false,
            showProgressModal : "",
            wf_show : false,
            adminmode : false,
            admin_activeid : "",
            approval_dialog_mode : "",
            appline_user_mode : "",
            appline_user_item : {},
        }
    },
    async mounted(){;
        if(!this.$props.app_key && this.$props.appid == 0){
            await this.loadData("new");
            this.mode = "new";
            return;
        }
        this.loadData();
    },
    methods: {
        // emit function of approvalDiscretionModalComponent
        updateAttached(attached_files){
            this.attached_files = attached_files;
        },
        vieApprovalDiscretionModal(event){
            event.preventDefault();
            this.approvalDiscretionModal=true;
        },
        changeApplines(applines){
            this.applines = applines;
        },
        toggle_wf_show(){
            if(!this.wf_show) this.wf_show = true;
            $('#workflow_diagram').slideToggle(200,'linear',);
            // this.wf_show = ! this.wf_show;
        },
        async loadData(load_mode=""){
            this.showProgressModal = "show";
            var vm = this;
            await axios.get('./api/applines/'+this.$props.app_type+'/'+this.$props.appid,
                    { params: { load_mode: load_mode , div_name:vm.$props.div_name, app_key:vm.app_key,
                                preset_item1:vm.$props.preset_item1, preset_item2:vm.$props.preset_item2  } } )
                .then(function(res){
                    vm.stageList = res.data.stageList;
                    if(vm.stageList.length > 1){
                        for(var s=1; s<vm.stageList.length; s++){
                            if(vm.stageList[s].option != "Hidden" && vm.stageList[s].option != "HiddenAll"){
                                vm.new_stage = vm.stageList[s].stage;
                                break;
                            }
                        }
                    }
                    vm.applines = res.data.applines;
                    vm.attached_files = res.data.attached_files;
                    vm.nextAppline = res.data.nextAppline;
                })
                .catch(function(err){
                    if(err.response.data.detail == "NOAPPTYPE"){
                        vm.toggle_wf_show();
                        vm.mode = "view";
                        if(vm.$props.app_type == 'MASTER')
                            vm.$props.app_type = "";
                        return;
                    }
                    warningModal.show_modal(err);
                    return;
                });
            this.mode = "view";

            // assing applines.stage_type
            for(var i=0; i<this.applines.length; i++){
                for(var s=0; s<this.stageList.length; s++){
                    if(this.applines[i].stage == this.stageList[s].stage){
                        this.applines[i].stage_type = this.stageList[s].stage_type;
                        this.applines[i].stage_option = this.stageList[s].option;
                        break;
                    }
                }
            }
            this.showProgressModal = "";
            this.$emit('load-complete',vm.nextAppline, vm.applines);
        },
        changeAdminMode(){
            if(!this.nextAppline.active)
                this.adminmode = !this.adminmode;
        },
        modifyAppLine(){
            this.mode = "modify";
            this.selectedUser = {};
            this.$emit("active-appline");
        },
        async validateAppLine(check=""){
            // Check approval user at Mandatory stage
            if(this.$props.app_type != "MASTER"){
                for(var i=0; i<this.stageList.length; i++){
                    if(this.stageList[i].option == "Mandatory"){
                        var appcount = 0;
                        for(var j=0; j<this.applines.length; j++){
                            if(this.stageList[i].stage == this.applines[j].stage){
                                appcount += 1;
                                break;
                            }
                        }
                        if(appcount == 0){
                            await warningModal.show_modal(this.stageList[i].stage + " Stage need one or more user!");
                            return false;
                        }
                    }
                }
            }
            if(check == "check") this.$emit("valid-ok");
            return true;
        },
        async updateAppLine(check=""){
            if(check !="checkpass"){
                if( !this.validateAppLine() )
                    return;
            }

            this.showProgressModal = "show";
            var vm = this;
            var data = {};
            data.applines = vm.applines;
            data.app_key = vm.$props.app_key;
            data.preset_item1 = vm.$props.preset_item1;
            data.preset_item2 = vm.$props.preset_item2;
            await axios.put('./api/applines/'+this.$props.app_type+'/'+this.$props.appid,data)
                .then(function(res){
                    vm.applines = res.data.applines;
                    vm.nextAppline = res.data.nextAppline;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            vm.mode = "view";
            // assing applines.stage_type
            for(var i=0; i<this.applines.length; i++){
                for(var s=0; s<this.stageList.length; s++){
                    if(this.applines[i].stage == this.stageList[s].stage){
                        this.applines[i].stage_type = this.stageList[s].stage_type;
                        this.applines[i].stage_option = this.stageList[s].option;
                        break;
                    }
                }
            }
            this.showProgressModal = "";
            this.$emit('load-complete',vm.nextAppline, vm.applines);
            this.$emit('update-appline');
        },
        async cancelModifyAppLine(){
            await this.loadData();
        },
        selfRejectAppLine(){
            this.showSelfRejctConfirmModal = "show";
        },
        async confirmSelfReject(){
            this.showProgressModal = "show";
            var vm = this;
            var data = {};
            data.state = "SNG";
            data.comments = "Self Reject";
            await axios.put('./api/approval/'+vm.nextAppline.request_appid, data)
                .then(function(res){
                    vm.showApprovalModal = "";
                    vm.showApprovalConfirmModal = "";
                    vm.showSelfRejctConfirmModal = "";
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
            this.loadData();
            this.showProgressModal = "";
        },
        approvalAppLine(mode='OK'){
            if(this.nextAppline.step == 0){
                this.confirmApproval();
            }else{
                this.approval_dialog_mode = mode;
                this.showApprovalModal = "show";
            }
        },
        async confirmApproval(){
            // 결재 (Approve) 진행
            var vm = this;
            var data = {};
            if(this.nextAppline.step > 0){
                if(this.$refs.app_comments.value == ""){
                    warningModal.show_modal("Please, input comments.");
                    return;
                }
                data.comments = this.$refs.app_comments.value;
            }
            var app_activeid = "";
            if(vm.nextAppline.activeid.length > 1)
                app_activeid = vm.admin_activeid;
            else if(vm.nextAppline.activeid.length == 1)
                app_activeid = vm.nextAppline.activeid[0];
            else
                app_activeid = vm.nextAppline.activeid;

            if(app_activeid == ""){
                warningModal.show_modal("Please, select target name.");
                return;
            }

            this.showProgressModal = "show";
            data.state = "OK";
            data.adminmode = this.adminmode;
            await axios.put('./api/approval/'+app_activeid, data)
                .then(function(res){
                    vm.showApprovalModal = "";
                })
                .catch(function(err){
                    vm.showApprovalModal = "";
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.loadData();
            this.showProgressModal = "";
            if(this.nextAppline.step > 0){
                try{
                    top.window.close();
                }catch(e){
                    window.close();
                }
                window.close();
            }
        },
        checkRejectModal(){
            this.showApprovalConfirmModal = "show";
        },
        async confirmReject(){
            // 결재 (Reject) 진행
            if(this.$refs.app_comments.value == "" && this.nextAppline.step > 0){
                warningModal.show_modal("Please, input comments.");
                return;
            }
            this.showProgressModal = "show";
            var vm = this;
            var data = {};
            data.state = "NG";
            data.comments = this.$refs.app_comments.value;
            data.adminmode = this.adminmode;
            await axios.put('./api/approval/'+vm.nextAppline.activeid, data)
                .then(function(res){
                    vm.showApprovalModal = "";
                    vm.showApprovalConfirmModal = "";
                    vm.showSelfRejctConfirmModal = "";
                })
                .catch(function(err){
                    vm.showApprovalModal = "";
                    vm.showApprovalConfirmModal = "";
                    vm.showSelfRejctConfirmModal = "";
                    vm.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.loadData();
            this.showProgressModal = "";

            try{
                top.window.close();
            }catch(e){
                window.close();
            }
        },
        closeApprovalModal(){
            this.showApprovalModal = "";
            this.showApprovalConfirmModal = "";
            this.showSelfRejctConfirmModal = "";
        },
        stepCheck(){
            if(this.new_step == "SAME"){
                if(typeof this.selectedUser.stage == 'undefined' || this.selectedUser.stage_option == 'HiddenAll'){
                    this.new_stage = "";
                }else{
                    this.new_stage = this.selectedUser.stage;
                }
            }else{
                if(this.new_stage == "")
                    this.new_stage = this.stageList[1].stage;
            }
        },
        checkMoveStage(user){
            for(var i=0; i<this.applines.length; i++){
                for(var s=0; s<this.stageList.length; s++){
                    if(this.applines[i].stage == this.stageList[s].stage){
                        this.applines[i].stage_type = this.stageList[s].stage_type;
                        this.applines[i].stage_option = this.stageList[s].option;
                        break;
                    }
                }
            }

            // user.stage_type == "Request" , "Distribution" 일 경우 동일 stage 간만 이동가능
            // user.stage_type == "Serial" 일 경우, next.stage_list 가 Parallel 이면 계속 이동가능 stage 로 추가
            // user.stage_type == "Parallel" 일 경우, previous.stage_list, next.stage_list 가 Parallel 이면 계속 이동가능 stage 로 추가
            var available_stage_list = [];
            available_stage_list.push(user.stage);

            if(user.stage_type == "Request" || user.stage_type == "Distribution" )
                return available_stage_list;

            // user.stage_type == "Parallel" 일 경우
            // previous.stage_list 가 "Parallel" 이면 계속 이동 가능 stage 로 추가, "Serial" 추가 하고 중단
            if(user.stage_type == "Parallel"){
                var check_start = "false";
                for(var s1=this.stageList.length-1; s1>=0; s1--){
                    if(user.stage == this.stageList[s1].stage){
                        check_start = "true";
                        continue;
                    }
                    if(check_start == "true"){
                        if(this.stageList[s1].stage_type == "Parallel")
                            available_stage_list.push(this.stageList[s1].stage);
                        else if(this.stageList[s1].stage_type == "Serial"){
                            available_stage_list.push(this.stageList[s1].stage);
                            break;
                        }
                        else
                            break;
                    }
                }
            }

            // user.stage_type == "Parallel" ||  user.stage_type == "Serial" 일 경우
            // next.stage_list 가 "Parallel" 이면 계속 이동 가능 stage 로 추가
            if(user.stage_type == "Parallel" || user.stage_type == "Serial"){
                var check_start = "false";
                for(var s2=0; s2<this.stageList.length; s2++){
                    if(user.stage == this.stageList[s2].stage){
                        check_start = "true";
                        continue;
                    }
                    if(check_start == "true"){
                        if(this.stageList[s2].stage_type == "Parallel")
                            available_stage_list.push(this.stageList[s2].stage);
                        else
                            break;
                    }
                }
            }
            return available_stage_list;
        },
        moveUpUserRow(user,event){
            if(event) event.stopPropagation();

            if(user.step <= this.nextAppline.step) return;
            if(user.step -1 <= this.nextAppline.step) return;

            var moveStage = this.checkMoveStage(user);
            var moveStepSuccess = false;
            var checkStep = user.step;
            var sameStepList = [];
            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == checkStep ){
                    this.applines[i].step = -1;
                    sameStepList.push(this.applines[i]);
                }
            }

            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == checkStep -1 && moveStage.includes(this.applines[i].stage) ){
                    this.applines[i].step = checkStep;
                    moveStepSuccess = true;
                }
            }

            if(moveStepSuccess){
                for(var s=0; s<sameStepList.length; s++){
                    sameStepList[s].step = checkStep - 1;
                }
            }else{
                for(var s=0; s<sameStepList.length; s++){
                    sameStepList[s].step = checkStep;
                }
            }

            this.applines.sort(function(a, b)  {
                  if(a.step > b.step) return 1;
                  if(a.step == b.step) return 0;
                  if(a.step < b.step) return -1;
                });
            this.selectUserRow(user);
            //this.selectedUser = user;
        },
        moveDownUserRow(user,event){
            if(event) event.stopPropagation();

            if(user.step <= this.nextAppline.step) return;
            if(user.step +1 <= this.nextAppline.step) return;

            var moveStage = this.checkMoveStage(user);
            var moveStepSuccess = false;
            var checkStep = user.step;
            var sameStepList = [];
            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == checkStep ){
                    this.applines[i].step = -1;
                    sameStepList.push(this.applines[i]);
                }
            }

            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == checkStep +1 && moveStage.includes(this.applines[i].stage) ){
                    this.applines[i].step = checkStep;
                    moveStepSuccess = true;
                }
            }

            if(moveStepSuccess){
                for(var s=0; s<sameStepList.length; s++){
                    sameStepList[s].step = checkStep + 1;
                }
            }else{
                for(var s=0; s<sameStepList.length; s++){
                    sameStepList[s].step = checkStep;
                }
            }

            this.applines.sort(function(a, b)  {
                  if(a.step > b.step) return 1;
                  if(a.step == b.step) return 0;
                  if(a.step < b.step) return -1;
                });

            this.selectUserRow(user);
            //this.selectedUser = user;
        },
        changeStage(user,event){
            if(event) event.stopPropagation();
            var moveStage = this.checkMoveStage(user);
            for(var s=0; s<moveStage.length; s++){
                if(user.stage != moveStage[s]){
                    user.stage = moveStage[s];
                    break;
                }
            }
            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == user.step ){
                    this.applines[i].stage = user.stage;
                }
            }
            this.selectUserRow(user);
        },
        selectUserRow(user){
            // if(user.step == 0) return;
            if(user.step <= this.nextAppline.step) return;
            //if(user.option) return;
            //if(user.date) return;

            this.selectedUser = user;
            this.stepCheck();
        },
        async searchUser(event){
            if(event) event.preventDefault();

             this.showProgressModal = "show";
            var vm = this;
            vm.searchList = [];
            await axios.get('./api/userinfo',
                { params:{
                    'search_condition': 'appline',
                    'div_name':vm.$props.div_name,
                    'search_text': vm.new_name
                    },
                })
                .then(function(res){
                    if(res.data.searchList){
                        vm.searchList = res.data.searchList;
                    }else{
                        vm.showModal = "";
                        warningModal.show_modal(res.data);
                    }
                })
                .catch(function(err){
                    vm.showModal = "";
                    this.showProgressModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
            vm.new_name = "";
            if(vm.searchList.length == 1){
                this.addUser(vm.searchList[0]);
                return;
            }
            vm.showModal = "show";
        },
        addUser(user){
            // MAIL 주소가 없을 경우 중지
            //if(!user.EMAIL.includes("@")){
            //    warningModal.show_modal("Please, select another user who have e-mail address.");
            //    return;
            //}
            // 동일 Stage 에 동일 사용자가 있을 경우 중지
            for(var i=0; i<this.applines.length; i++){
                if(this.new_stage == this.applines[i].stage && user.EMAIL == this.applines[i].email){
                    warningModal.show_modal("Same user is already exists at same stage.");
                    return;
                }
            }
            // this.new_stage 가 Request 인 항목 추가 금지
            if(this.new_stage == "Request"){
                warningModal.show_modal("Request user can not be added.");
                return;
            }

            // nextAppline.stage 를 포함한 다음 stage, step 에만 결재선 수정 가능
            if(this.mode != 'new' && this.$props.app_type != 'MASTER' && this.new_step != "SAME"){
                var allowInsertStageList = [];     // allow to inert stage list
                var allowNextStage = false;
                for(var i=0; i<this.stageList.length; i++){
                    if(this.nextAppline.stage == this.stageList[i].stage)
                        allowNextStage = true;
                    if(allowNextStage)
                        allowInsertStageList.push(this.stageList[i].stage);
                }
                if(!allowInsertStageList.includes(this.new_stage)){
                    this.showModal = "";
                    warningModal.show_modal("Can not insert row before current approval step.");
                    return;
                }
            }

            // Max step of Selected Stage
            var applineCount = 0;
            try{ applineCount = this.applines.length; }catch(e){}
            var previousAllStageList = [];
            var insertIndex =0;
            var newStep = 1;

            // 동일 step 에 추가할 경우 selectedUser.step 과 동일하게 다음줄에 추가
            if(this.new_step == "SAME"){
                if(typeof this.selectedUser.step == 'undefined' || this.new_stage == ''){
                    warningModal.show_modal("Same step needs selected row.");
                    this.showModal = "";
                    return;
                }else{
                    for(var i=0; i<this.applines.length; i++){
                        if( this.selectedUser.step == this.applines[i].step ){
                            // 추가될 위치를 이름 기준으로 sorting 하여 추가
                            if(user.FULL_NAME < this.applines[i].name){
                                insertIndex = i;
                                newStep = this.selectedUser.step;
                                break;
                            }else{
                                insertIndex = i + 1;
                                newStep = this.selectedUser.step;
                            }
                        }
                    }
                }
            }

            // NEXT step 에 추가할 경우 checkMoveStage(user) 중 가장 높은 step 다음줄에 추가
            if(this.new_step == "NEXT"){
                // 신규 추가 user 의 경우 stage_type 미리 할당 후 계산
                var previousStageList = [];
                user.stage = this.new_stage;
                for(var s=0; s<this.stageList.length; s++){
                    previousStageList.push(this.stageList[s].stage);
                    if(this.new_stage == this.stageList[s].stage){
                        user.stage_type = this.stageList[s].stage_type;
                        user.stage_option = this.stageList[s].option;
                        break;
                    }
                }
                var moveStage = this.checkMoveStage(user);
                previousStageList = previousStageList.concat(moveStage);

                for(var i=0; i<this.applines.length; i++){
                    if(previousStageList.includes(this.applines[i].stage)){
                        insertIndex = i + 1;
                        newStep = this.applines[i].step + 1;
                        if(user.stage_type == "Distribution" && this.applines[i].stage_type == "Distribution")
                            newStep = this.applines[i].step;
                    }else{
                        this.applines[i].step += 1;
                    }
                }
            }

            if(this.new_option == undefined) this.new_option = '';
            user.id = 0;
            user.step = newStep;
            user.stage = this.new_stage;
            user.empno = user.EMPLOYEE_NUMBER;
            user.name = user.FULL_NAME;
            user.name_en = user.NAME_ENG;
            user.position = user.JIKWI_NAME;
            user.position_en = user.JIKWI_NAME_ENG;
            user.email = user.EMAIL;
            user.organization = user.OLD_ORG_NAME;
            user.organization_en = user.ORGAN_NAME_ENG;
            user.option = this.new_option;
            user.condition = this.new_condition;
            user.condition2 = this.new_condition2;
            this.applines.splice(insertIndex,0,user);

            this.selectedUser = user;
            this.new_condition = "";
            this.new_condition2 = "";
            this.showModal = "";
        },
        mergeAppline(user){
            // 기존 appline 에 applines 병합

            if(!user.email.includes("@")) return;
            // 동일 Stage 에 동일 사용자가 있을 경우 Skip
            for(var i=0; i<this.applines.length; i++){
                if(user.stage == this.applines[i].stage && user.email == this.applines[i].email){
                    this.selectedUser = user;
                    return;
                }
            }

            // Max step of Selected Stage
            var applineCount = 0;
            try{ applineCount = this.applines.length; }catch(e){}
            var previousAllStageList = [];
            var insertIndex =0;
            var newStep = 1;

            // 동일 step 에 추가할 경우 user.step 과 동일한 사용자 select 후 추가
            if(user.new_step == "SAME"){
                for(var i=0; i<this.applines.length; i++){
                    if( user.step == this.applines[i].step ){
                        for(var s=0; s<this.stageList.length; s++){
                            if(user.stage == this.stageList[s].stage){
                                user.stage_type = this.stageList[s].stage_type;
                                user.stage_option = this.stageList[s].option;
                                break;
                            }
                        }
                        this.selectedUser = user;
                        break;
                    }
                }

                for(var i=0; i<this.applines.length; i++){
                    if( this.selectedUser.step == this.applines[i].step ){
                        // 추가될 위치를 이름 기준으로 sorting 하여 추가
                        if(user.name < this.applines[i].name){
                            insertIndex = i;
                            newStep = this.selectedUser.step;
                            break;
                        }else{
                            insertIndex = i + 1;
                            newStep = this.selectedUser.step;
                        }
                    }
                }
            }

            // NEXT step 에 추가할 경우 checkMoveStage(user) 중 가장 높은 step 다음줄에 추가
            if(user.new_step == "NEXT"){
                // 신규 추가 user 의 경우 stage_type 미리 할당 후 계산
                var previousStageList = [];
                for(var s=0; s<this.stageList.length; s++){
                    previousStageList.push(this.stageList[s].stage);
                    if(user.stage == this.stageList[s].stage){
                        user.stage_type = this.stageList[s].stage_type;
                        user.stage_option = this.stageList[s].option;
                        break;
                    }
                }
                var moveStage = this.checkMoveStage(user);
                previousStageList = previousStageList.concat(moveStage);

                for(var i=0; i<this.applines.length; i++){
                    if(previousStageList.includes(this.applines[i].stage)){
                        insertIndex = i + 1;
                        newStep = this.applines[i].step + 1;
                        if(user.stage_type == "Distribution" && this.applines[i].stage_type == "Distribution")
                            newStep = this.applines[i].step;
                    }else{
                        this.applines[i].step += 1;
                    }
                }
            }

            user.id = 0;
            user.step = newStep;
            this.applines.splice(insertIndex,0,user);
            this.selectedUser = user;
            this.showModal = "";
        },
        removeUser(user, event){
            if(this.selectedUser == user) this.selectedUser = {};
            var sameStepCount = 0;
            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].step == user.step)
                    sameStepCount += 1;

                if(this.applines[i] == user){
                    this.applines.splice(i,1);
                    i--;
                }else if(this.applines[i].step > user.step && sameStepCount == 1){
                    this.applines[i].step -= 1;
                }
            }
            this.stepCheck();
        },
        modifyUser(user, event){
            this.appline_user_mode = "modify";
            this.appline_user_item = user;

            this.new_stage = user.stage;
            this.new_option = user.option;
            this.new_condition = user.condition;
            this.new_condition2 = user.condition2;
        },
        updateUser(){
            for(var i=0; i<this.applines.length; i++){
                if(this.applines[i].empno == this.appline_user_item.empno
                    && this.applines[i].step == this.appline_user_item.step){
                    this.applines[i].option = this.new_option;
                    this.applines[i].condition = this.new_condition;
                    this.applines[i].condition2 = this.new_condition2;
                    break;
                }
            }
            this.appline_user_mode = "";
            this.appline_user_item = {};

            this.new_option = "";
            this.new_condition = "";
            this.new_condition2 = ""
        },
        cancelUser(){
            this.appline_user_mode = "";
            this.appline_user_item = {};

            this.new_option = "";
            this.new_condition = "";
            this.new_condition2 = ""
        },
        showAppHistory(){
            this.showProgressModal = "show";
            this.showApprovalHistoryModal = "show";
            var vm = this;
            axios.get('./api/apphistorys/'+this.$props.app_type+'/'+this.$props.appid, null )
                .then(function(res){
                    vm.apphistorys = res.data.apphistorys;
                })
                .catch(function(err){
                    vm.showApprovalHistoryModal = "";
                    warningModal.show_modal(err);
                    return;
                });
            this.showProgressModal = "";
        },
        resetCondition(){
            if(this.new_condition == "" || this.new_condition == "Adjust")
                this.new_condition2 = "";
        },

        setPresetItem1(value){
            this.$props.preset_item1 = value;
        },
        setPresetItem2(value){
            this.$props.preset_item2 = value;
        },
    },
    computed:{
        isStageChangeable(){
            return(user)=>{
                var moveStage = this.checkMoveStage(user);
                if(moveStage.length > 1) return true;
                return false;
            }
        },
        markedCost(){
            return (val) => {
                if(isNaN(val)) return val;
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
    },
}
</script>
