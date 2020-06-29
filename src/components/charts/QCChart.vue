<template>
    <div id="q-c-chart"/>
</template>

<script>
import Chart from 'chart.js';
import ApexCharts from 'apexcharts';

export default {
    mounted() {
        this.createChart();
    },
    methods: {
        createChart() {
            let ctx = document.getElementById('q-c-chart');

            let options = {
                chart: {
                    zoom: {
                        enabled: false
                    },
                    toolbar: {
                        show: false
                    },
                    height: 270,
                    width: "100%",
                    type: "area",
                    animations: {
                        initialAnimation: {
                            enabled: false
                        }
                    }
                },
                series: [
                    {
                        name: "Series 1",
                        data: [
                            {
                                x: "02-10-2017 GMT",
                                y: 34
                            },
                            {
                                x: "02-11-2017 GMT",
                                y: 43
                            },
                            {
                                x: "02-12-2017 GMT",
                                y: 31
                            },
                            {
                                x: "02-13-2017 GMT",
                                y: 43
                            },
                            {
                                x: "02-14-2017 GMT",
                                y: 33
                            },
                            {
                                x: "02-15-2017 GMT",
                                y: 52
                            }
                        ]
                    }
                ],
                xaxis: {
                    type: "datetime"
                }
            };

            let chart = new ApexCharts(ctx, options);

            chart.render();


            /*let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['January', 'February', 'March', 'April'],
                    datasets: [{
                        label: '# of broken links',
                        data: [0, 20, 40, 50],
                        backgroundColor: [
                            'rgba(255, 99, 132, 0.2)'
                        ],
                        borderColor: [
                            'rgba(255, 99, 132, 1)'
                        ],
                        borderWidth: 1
                    }]
                },
                options: {
                    scales: {
                        yAxes: [{
                            ticks: {
                                suggestedMin: 50,
                                suggestedMax: 100
                            }
                        }]
                    }
                }
            })*/
        }
    }
}
</script>
