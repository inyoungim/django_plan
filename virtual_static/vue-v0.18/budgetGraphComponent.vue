<template>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary">
        <div class="hstack">
            <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 ms-1 mt-1 bg-opacity-25 bg-primary"
                style="min-width:100px;">
                <i class="bi bi-grid-3x3-gap-fill pe-1 text-danger"></i>
                <b v-if="lang=='kr'">그래프</b><b v-else>Graph</b>
            </div>
        </div>
    </div>

    <div v-if="this.$props.pmode != 'budgetPlan' && this.$props.pmode != 'budgetAssign'" class="border-bottom border-primary py-1">
        <div class="hstack">
            <div class="col-auto me-auto">
                <div class="input-group">
                    <span v-if="this.$props.pmode == 'plan'" class="input-group-text py-1"> {{parent_org_item.year + 1}} Year</span>
                    <span v-else class="input-group-text py-1"> {{parent_org_item.year}} Year</span>
                    <div class="form-control p-0" style="width:60px; padding:0.1em 0.5em;">
                        <select v-model="startMonth" class="form-select border-0"
                                style="padding:0.25em 0.5em;" disabled @change="changeMonth('start')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                    <i class="input-group-text p-0" class="bi bi-dash"></i>
                    <div class="form-control p-0" style="width:60px; padding:0.1em 0.5em;">
                        <select v-model="endMonth" class="form-select border-0"
                                style="padding:0.25em 0.5em;" disabled @change="changeMonth('end')">
                            <option v-for="n in (12)" :value="n">{{n}}</option>
                        </select>
                    </div>
                    <span class="input-group-text py-1">{{parent_org_item.org_name}}</span>
                    <div class="input-group-text bg-white  py-1">
                        <input class="form-check-input me-2" type="checkbox" disabled v-model="checkChildOrganization"
                               @change="refreshPage"> Include Children
                    </div>
                    <span class="input-group-text py-1">{{parent_acc_item.account_name}}</span>
                    <div class="input-group-text bg-white py-1">
                        <input class="form-check-input me-2" type="checkbox" disabled v-model="checkChildAccount"
                               @change="refreshPage"> Include Children
                    </div>
                </div>
            </div>
        </div>
    </div>

    <!-- Line, Pie 차트 -->
    <div class="col hstack">
        <div class="col p-2 border rounded">
            <canvas id="lineChart" style="height:400px; width:100%"></canvas>
        </div>
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
export default {
    props : ['site','lang','pmode','acl',
             'parent_org_item','parent_acc_item','start_month','end_month','check_child_organization'],
    data: function() {
        return {
            parent_org_item : this.$props.parent_org_item,
            parent_acc_item : this.$props.parent_acc_item,
            startMonth : this.$props.start_month,
            endMonth : this.$props.end_month,
            checkChildOrganization : this.$props.check_child_organization,
            checkChildAccount : true,
            showProgressModal : "",
        };
    },
    mounted(){
        this.loadChart();
        this.reloadChart();
    },
    methods:{
        loadChart(){
            let option = {
                responsive: false,
                scales:{
                    x:{stacked:true},
                },
                plugins:{
                    legend:{
                        display: true,
                        position:'bottom'
                    }
                },
                // click event of "Chart data point"
                onClick: function(point, event) {
                    if(event.length <= 0) return;
                },
            };
            const lineChart = document.getElementById('lineChart');
            this.lineChart = new Chart(lineChart,{ type:'line', data:{},options:option });
        },
        reloadChart(){
            if(this.$props.lang == "kr"){
                var label1 = "계획 (운영)";
                var label2 = "계획 (변동)";
                var label3 = "조정";
                var label4 = "가용";
                var label5 = "실적 (대기+완료)";
                var label6 = "실적 (완료)";
                var label7 = "잔여";
                var labels = ['집행','완료','잔여'];
            }else{
                var label1 = "Plan (Operation)";
                var label2 = "Plan (Flexible)";
                var label3 = "Adjustment";
                var label4 = "Available";
                var label5 = "Closing (Waiting+Result)";
                var label6 = "Closing (Result)";
                var label7 = "Remain";
                var labels = ['Executed','Result','Remain'];
            }
            var parent_object = {};
            if (this.parent_acc_item.executedMonthCost != undefined){
                parent_object = this.parent_acc_item;
            }else{
                parent_object = this.parent_org_item;
            }
            var planMonthCostList = parent_object.planMonthCostList;
            var confirmedMonthCostList = parent_object.confirmedMonthCostList;
            var adjustMonthCostList = parent_object.adjustMonthCostList;
            var availableMonthCostList = parent_object.availableMonthCostList;
            var executedMonthCostList = parent_object.executedMonthCostList;
            var resultMonthCostList = parent_object.resultMonthCostList;
            var remainMonthCostList = parent_object.remainMonthCostList;

            for(var i=0; i<executedMonthCostList.length; i++){
                executedMonthCostList[i] += resultMonthCostList[i];
            }

            var vm = this;
            var chartData = {
                'labels': ['Jan.','Feb.','Mar.','Apr.','May.','Jun.','Jul.','Aug.','Sep.','Oct.','Nov.','Dec.'],
                'datasets': [
                    {
                        type: 'line',
                        'backgroundColor': 'transparent',
                        'borderColor': 'rgb(75, 192, 192)',
                        'label': label1,
                        'fill':1,
                        'tension':0.3,
                        'borderWidth':2,
                        'data': planMonthCostList,
                    },
                    {
                        type: 'line',
                        'backgroundColor': 'transparent',
                        'borderColor': 'rgb(255, 150, 150)',
                        'label': label2,
                        'fill':1,
                        'tension':0.3,
                        'borderWidth':2,
                        'data': confirmedMonthCostList,
                    },
                    {
                        type: 'line',
                        'backgroundColor': 'transparent',
                        'borderColor': 'rgb(255, 150, 255)',
                        'label': label4,
                        'fill':1,
                        'tension':0.3,
                        'borderWidth':2,
                        'data': availableMonthCostList,
                    },
                    {
                        type: 'bar',
                        'borderColor': 'rgb(75, 255, 150)',
                        'backgroundColor': 'rgba(75, 255, 150, 0.2)',
                        'label': label6,
                        'borderWidth':1,
                        'barPercentage':0.7,
                        'data': resultMonthCostList,
                    },
                    {
                        type: 'bar',
                        'borderColor': 'rgb(255, 150, 150)',
                        'backgroundColor': 'rgba(255, 150, 150, 0.2)',
                        'label': label5,
                        'borderWidth':1,
                        'barPercentage':0.7,
                        'data': executedMonthCostList,
                    },
                    {
                        type: 'line',
                        'backgroundColor': 'transparent',
                        'borderColor': 'rgb(255, 75, 150)',
                        'label': label7,
                        'fill':1,
                        'tension':0.3,
                        'borderWidth':2,
                        'data': remainMonthCostList,
                    }
                ]
            };
            vm.lineChart.data = chartData;
            vm.lineChart.update();
        },
    },
}
</script>
