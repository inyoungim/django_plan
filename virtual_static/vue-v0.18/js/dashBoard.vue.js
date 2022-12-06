axios.defaults.xsrfCookieName = 'csrftoken';
axios.defaults.xsrfHeaderName = 'X-CSRFToken';

const site = document.currentScript.getAttribute('site');
const initMenu = document.currentScript.getAttribute('initMenu');

Vue.createApp({
    delimiters: ['[[', ']]'],
    components: {
        'menu-list-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/menuListComponent.vue', vueLoaderOptions) ),
    },
    data: function() {
        return {
            menuId : initMenu,
            chart_data : [],
            detail_lists : [],
            maxHeight : 10000,
        };
    },
    mounted(){
        this.loadChart();
    },
    methods:{
        contractHeight(){
            this.maxHeight = 700;
        },
        expandHeight(){
            this.maxHeight = 10000;
        },
        menuSelected(menu){
            this.menuId = menu.id;
            this.reloadChart();
        },
        async loadChart(){
            let option1 = {
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
            this.lineChart = new Chart(lineChart,{ type:'line', data:{},options:option1 });

            /*
            const pieChart = document.getElementById('pieChart');
            let option2 = {
                plugins:{
                    legend:{
                        position:'right'
                    }
                }
            };
            this.pieChart = new Chart(pieChart,{ type:'pie', data:{}, options:option2 });
            */
        },
        reloadChart(){
            if(this.menuId){
                this.refreshLineChart();
                // this.refreshPieChart();
            }
        },
        async refreshLineChart(){
            var vm = this;
            await axios.get('./api/lineChart/'+vm.menuId,
                    {   params:{
                            start_date: vm.$refs.sdate.value ,
                            end_date : vm.$refs.edate.value,
                        }
                    }
                )
                .then(function(res){
                    vm.lineChart.data = res.data.chartData;
                    vm.lineChart.update();
                    vm.chart_data = res.data.chartData;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });

        },
        async refreshPieChart(){
            var vm = this;
            await axios.get('./api/pieChart/'+vm.menuId,
                    {   params:{
                            start_date: vm.$refs.sdate.value ,
                            end_date : vm.$refs.edate.value,
                        }
                    }
                )
                .then(function(res){
                    vm.pieChart.data = res.data.chartData;
                    vm.pieChart.update();
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
        },
        async detailLists(day){
            var vm = this;
            await axios.get('./api/detailLists/'+vm.menuId,
                    {   params:{  target_date: day } } )
                .then(function(res){
                    vm.detail_lists = res.data;
                })
                .catch(function(err){
                    warningModal.show_modal(err);
                    return;
                });
        },

    },
}).mount('#vue3-top-object')
