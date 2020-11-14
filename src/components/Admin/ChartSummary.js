import React,{Component} from 'react';
import PropTypes from 'prop-types';

import { Pie,HorizontalBar,Line,Bar } from 'react-chartjs-2';

export default class ChartSummary extends Component{

    constructor(props){

        super(props);

        this.state ={

            title:this.props.title,
            charttype:this.props.charttype,
            chartdata:this.props.chartdata,
            secondaryTitle:this.props.secondaryTitle,

        }

    }

    componentDidMount(){

    }

    componentDidUnMount(){

    }

    renderChart(chartType,chartData){


        switch(chartType) {

            case 'pie':

                return(
                    <Pie data={chartData} />
                );

            case 'line':

                return(
                    <Line data ={chartData}
                                options={{
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

            case 'horizontalbar':
                return(
                    <HorizontalBar data={chartData}
                                                options={{
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

            case 'bar':
                return(
                    <Bar data={chartData}
                                options={{
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

            default:
                return(
                    <Bar data={chartData}
                                options={{
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

    render(){

        const {title,charttype,chartdata,secondaryTitle}  = this.state;

        return(



            <>
                {/* Summary Chart  */}
                <div className="card summaryChart">

                    <div className="card-body">

                        <h4>{title}</h4>

                        {this.renderChart(charttype,chartdata)}

                    </div>

                </div>
                {/* EndSummary Chart  */}
            </>

        )

    }

}
