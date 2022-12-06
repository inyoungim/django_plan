<template>
    <div class="hstack border-bottom border-primary">
        <div class="col-auto border border-bottom-0 border-primary rounded-top py-1 px-2 bg-primary bg-opacity-25">
            <i class="bi bi-grid-3x3-gap-fill px-2"></i>
            <b>Business Trip Information</b>
        </div>
    </div>

    <div class="vstack">
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Trip Location</b>
            </label>
            <input type="text" class="form-control col" style="padding:0.1em 0.5em;"
                       name="Trip Location" v-model="bizdata.trip_location" disabled required>
            <div v-if="pmode != 'view'" class="input-group-text p-0">
                <trip-location-select-component
                        ref="tripLocationSelectComponent"
                        :site="this.$props.site"
                        :lang="this.$props.lang"
                        :div_name="this.$props.div_name"
                        @select-target="setTripLocation"></trip-location-select-component>
            </div>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Airplane Price</b>
            </label>
            <label class="form-control" style="background-color:#EEEEEE">{{markedCost(bizdata.airplane_price)}}</label>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Fuel Tax</b>
            </label>
            <label class="form-control" style="background-color:#EEEEEE">{{markedCost(bizdata.fuel_tax)}}</label>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Room Charge</b>
            </label>
            <label class="form-control" style="background-color:#EEEEEE">{{markedCost(bizdata.room_charge)}}</label>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Activity Cost</b>
            </label>
            <label class="form-control" style="background-color:#EEEEEE">{{markedCost(bizdata.activity_cost)}}</label>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>No. of people</b>
            </label>
            <input class="form-control bg-white" type="text" :disabled="pmode == 'view'"
                   name="Number of people" v-model="bizdata.number_of_people" required>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <span class="badge small p-0"><i class="bi bi-asterisk text-danger"></i></span>
                <b>Nights & Days</b>
            </label>
            <input class="form-control bg-white" type="text" :disabled="pmode == 'view'"
                   name="Night(s)" v-model="bizdata.nights" required>
            <label class="input-group-text"><b>Night(s)</b></label>
            <input class="form-control bg-white" type="text" :disabled="pmode == 'view'"
                   name="Day(s)" v-model="bizdata.days" required>
            <label class="input-group-text"><b>Day(s)</b></label>
        </div>
        <div class="input-group mt-1">
            <label class="input-group-text" style="width:120px;">
                <b>Total Cost</b>
            </label>
            <input class="form-control bg-warning bg-opacity-25" type="text" disabled
                   name="Total Cost" v-model="cal_totalCost">
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
    props : ['site','lang','acl', 'pmode','div_name','biz_data'],
    components: {
        'trip-location-select-component': Vue.defineAsyncComponent(
            () => loadModule('/static/vue-v0.18/tripLocationSelectComponent.vue', vueLoaderOptions) ),
    },
    data(){
        return {
            mode : "view",
            bizdata : this.$props.biz_data,
            showProgressModal : false,
        }
    },
    methods : {
        setTripLocation(data){
            this.bizdata.div_name = data.div_name;
            this.bizdata.trip_location = data.trip_location;
            this.bizdata.airplane_price = data.airplane_price;
            this.bizdata.fuel_tax = data.fuel_tax;
            this.bizdata.room_charge = data.room_charge;
            this.bizdata.activity_cost = data.activity_cost;
        },
        getData(){
            return this.bizdata;
        },
        setData(data){
            this.bizdata = data;
        },
    },
    computed:{
        markedCost(){
            return (val) => {
                if(!val) return "";
                return String(val).replace(/\B(?=(\d{3})+(?!\d))/g, ",");
            };
        },
        cal_totalCost(){
            if(!this.bizdata.activity_cost) return 0;
            if(!this.bizdata.number_of_people || !this.bizdata.days || !this.bizdata.nights) return 0;

            var base_cost = this.bizdata.airplane_price + this.bizdata.fuel_tax ;
            var activity_cost = (this.bizdata.activity_cost * this.bizdata.days)
                                + (this.bizdata.room_charge * this.bizdata.nights)  ;
            this.bizdata.total_cost = ( base_cost  + activity_cost ) * this.bizdata.number_of_people ;
            return this.markedCost(this.bizdata.total_cost);
        },
    },
}
</script>

