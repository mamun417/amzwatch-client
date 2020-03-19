<template>
    <canvas id="q-c-chart" height="50px"/>
</template>

<script>
import Chart from 'chart.js';

export default {
    mounted() {
        this.createChart();
    },
    methods: {
        createChart() {
            let ctx = document.getElementById('q-c-chart');

            let chart = new Chart(ctx, {
                type: 'line',
                data: {
                    labels: ['jan', 'feb', 'march', 'april', 'may'],
                    datasets: [{
                        label: '# of broken links',
                        data: [12, 19, 3, 5, 2],
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
                                beginAtZero: true,
                                stepSize: 10
                            }
                        }]
                    }
                }
            })
        }
    }
}
</script>
