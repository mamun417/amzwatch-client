<template>
    <canvas id="q-c-chart" height="100px" />
</template>

<script>
import Chart from "chart.js";

export default {
    props: {
        type: {
            type: String,
            default: "line"
        },
        data: {
            type: Object,
            default: () => ({})
        }
    },
    mounted() {
        this.createChart();
    },
    methods: {
        createChart() {
            let ctx = document.getElementById("q-c-chart");

            let chart = new Chart(ctx, {
                type: this.type,
                data: this.data,
                options: {
                    // scales: {
                    //     xAxes: [
                    //         {
                    //             type: "time",
                    //             time: {
                    //                 displayFormats: {
                    //                     quarter: "MMM YYYY"
                    //                 }
                    //             },
                    //             distribution: "series"
                    //         }
                    //     ]
                    // }
                }
            });
        }
    }
};
</script>
