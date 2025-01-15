$(function () {
    'use strict';
    var chartColors = {
        donut: {
            series1: '#ffe700',
            series2: '#00d4bd',
            series3: '#FF0000',
        },
    };

    var month = ["January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December"];
    var d = new Date();
    $("#Month").text(month[d.getMonth()]);
    $(".navMonth").click(function (e) {
        var Month = month.indexOf($("#Month").text());
        if ($(this).attr("data-action") == "next")
            Month++;
        else
            Month--;

        if ($(this).attr("data-action") == "next" && Month == 12) {
            Month = 0;
        }
        else if ($(this).attr("data-action") == "previous" && Month == -1) {
            Month = 11;
        }
        $("#Month").text(month[Month]);
    });

    var BillsChart = document.querySelector('#Bills-chart'),
        BillsChartConfig = {
            chart: {
                height: 350,
                type: 'donut'
            },
            legend: {
                show: true,
                position: 'bottom'
            },
            labels: ['Upcomming', 'Overdue', 'Paid'],
            series: [85, 100, 35],
            colors: [
                chartColors.donut.series1,
                chartColors.donut.series2,
                chartColors.donut.series3
            ],
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return parseInt(val) + '%';
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                fontSize: '2rem',
                                fontFamily: 'Montserrat'
                            },
                            value: {
                                fontSize: '1rem',
                                fontFamily: 'Montserrat',
                                formatter: function (val) {
                                    return parseInt(val);
                                }
                            },
                        }
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 992,
                    options: {
                        chart: {
                            height: 380
                        }
                    }
                },
                {
                    breakpoint: 576,
                    options: {
                        chart: {
                            height: 320
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    labels: {
                                        show: true,
                                        name: {
                                            fontSize: '1.5rem'
                                        },
                                        value: {
                                            fontSize: '1rem'
                                        },
                                        total: {
                                            fontSize: '1.5rem'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
    if (typeof BillsChart !== undefined && BillsChart !== null) {
        var billsChart = new ApexCharts(BillsChart, BillsChartConfig);
        billsChart.render();
    }

    var ExpenseVSIncomeChartEl = document.querySelector('#ExpenseVSIncome-chart'),
        ExpenseVSIncomeChartConfig = {
            chart: {
                height: 350,
                type: 'radialBar'
            },
            colors: [chartColors.donut.series1, chartColors.donut.series2, chartColors.donut.series3],
            plotOptions: {
                radialBar: {
                    size: 185,
                    hollow: {
                        size: '25%'
                    },
                    track: {
                        margin: 15
                    },
                    dataLabels: {
                        name: {
                            fontSize: '2rem',
                            fontFamily: 'Montserrat'
                        },
                        value: {
                            fontSize: '1rem',
                            fontFamily: 'Montserrat',
                            formatter: function (val) {
                                return parseInt(val);
                            }
                        },
                    }
                }
            },
            grid: {
                padding: {
                    top: -35,
                    bottom: -30
                }
            },
            legend: {
                show: true,
                position: 'bottom'
            },
            stroke: {
                lineCap: 'round'
            },
            series: [80, 50, 35],
            labels: ['Expense', 'Income', 'Budget']
        };
    if (typeof ExpenseVSIncomeChartEl !== undefined && ExpenseVSIncomeChartEl !== null) {
        var radialChart = new ApexCharts(ExpenseVSIncomeChartEl, ExpenseVSIncomeChartConfig);
        radialChart.render();
    }

    var TopSpendsChartEl = document.querySelector('#TopSpends-chart'),
        TopSpendsChartConfig = {
            chart: {
                height: 250,
                type: 'donut'
            },
            legend: {
                show: true,
                position: 'bottom'
            },
            labels: ['Bills', 'Food'],
            series: [1285, 100],
            colors: [
                chartColors.donut.series1,
                chartColors.donut.series2
            ],
            dataLabels: {
                enabled: true,
                formatter: function (val, opt) {
                    return parseInt(val) + '%';
                }
            },
            plotOptions: {
                pie: {
                    donut: {
                        labels: {
                            show: true,
                            name: {
                                fontSize: '2rem',
                                fontFamily: 'Montserrat'
                            },
                            value: {
                                fontSize: '1rem',
                                fontFamily: 'Montserrat',
                                formatter: function (val) {
                                    return parseInt(val);
                                }
                            },
                        }
                    }
                }
            },
            responsive: [
                {
                    breakpoint: 992,
                    options: {
                        chart: {
                            height: 380
                        }
                    }
                },
                {
                    breakpoint: 576,
                    options: {
                        chart: {
                            height: 320
                        },
                        plotOptions: {
                            pie: {
                                donut: {
                                    labels: {
                                        show: true,
                                        name: {
                                            fontSize: '1.5rem'
                                        },
                                        value: {
                                            fontSize: '1rem'
                                        },
                                        total: {
                                            fontSize: '1.5rem'
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            ]
        };
    if (typeof TopSpendsChartEl !== undefined && TopSpendsChartEl !== null) {
        var TopSpendsChart = new ApexCharts(TopSpendsChartEl, TopSpendsChartConfig);
        TopSpendsChart.render();
    }
});
