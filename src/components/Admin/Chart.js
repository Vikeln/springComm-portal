import React, { Component } from 'react';
import PropTypes from 'prop-types';

import { Bar } from 'react-chartjs-2';

export default class Chart extends Component {

    constructor(props) {

        super(props);

        this.state = {

            title: this.props.title,
            charttype: this.props.charttype,
            chartdata: this.props.chartdata,
            secondaryTitle: this.props.secondaryTitle,

        }

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }

    renderChart(charttype, chartData) {


        switch (charttype) {

            case 'bar':
                return (
                    <Bar data={chartData}
                        options={{
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    display: true,

                                }],
                                xAxes: [{
                                    display: true,
                                }
                                ],
                            },
                            title: {
                                display: true,
                            }
                        }}
                    />
                );

            default:
                return (
                    <Bar data={chartData}
                        width={50}
                        height={50}
                        options={{
                            maintainAspectRatio: false,
                            legend: {
                                display: false
                            },
                            scales: {
                                yAxes: [{
                                    display: false,

                                }],
                                xAxes: [{
                                    display: false,
                                }
                                ],
                            },
                            title: {
                                display: false,
                            }
                        }}
                    />
                );
        }

    }

    render() {

        const { title, charttype, chartdata, secondaryTitle } = this.state;

        return (



            <>
                {/* Summary Chart  */}
                <div className="row">

                    <div className="mx-auto col-sm-8">

                        <h4>{title}</h4>

                        {this.renderChart(charttype, chartdata)}

                    </div>

                </div>
                {/* EndSummary Chart  */}
            </>

        )

    }

}
