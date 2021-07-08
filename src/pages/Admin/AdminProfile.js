/* global $ */

import React, { Component } from 'react';


import { faHandHoldingUsd, faHourglass, faDrawPolygon, faMobileAlt, faEnvelope, faTimesCircle, faCalculator } from '@fortawesome/free-solid-svg-icons';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import {
    Link
} from "react-router-dom";

import utils from '../../utils/utils.js';

import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

import AddUser from '../Users/AddUser'

import SummaryIcon from '../../components/Admin/SummaryIcon';
import Badge from '../../components/notifications/Badge';

import Loader from '../../components/loaders/Loader';
import Chart from '../../components/Admin/Chart';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import CommunicationsService from '../../services/communications.service';
import authService from '../../services/auth.service';
import tenantService from '../../services/tenant.service.js';

export default class AdminProfile extends Component {

    constructor(props) {

        super(props);

        var newDate = new Date();
        newDate.setTime(AuthService.getUserLoggedInAt());
        var dateString = newDate.toUTCString();

        this.state = {
            users: [],
            loading: false,
            sentSms: undefined,
            chartdata: "",
            scheduledSms: undefined,
            smsBalance: undefined,
            sentScheduledSms: undefined,
            headers: [
                { name: "Name", value: "firstName" },
                { name: "Email", value: "email" },
                { name: "Role", value: "role.name" },
                { name: "Active", value: "enabled" }
            ],
            value: this.props.value,
            lastLoggedInAt: dateString,
            userViewStatus: "",
            formData: [],
            userName: AuthService.getCurrentUser(),
            userEmail: AuthService.getCurrentUserEmail(),
            userFullName: AuthService.getCurrentUserName(),


        }

        this.toggleUserView = this.toggleUserView.bind(this);
        this.handleUserSubmission = this.handleUserSubmission.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getData = this.getData.bind(this);


    }
    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }

    getData() {
        var key = undefined;
        if (authService.getCurrentClientId() != 1)
            key = authService.getCurrentClientKey();
        CommunicationsService.getDashboardData(key).then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sentSms: response.data.data.sentSms,
                    scheduledSms: response.data.data.scheduledSms,
                    smsBalance: response.data.data.smsBalance,
                    sentScheduledSms: response.data.data.sentScheduledSms,
                    loading: false,
                });
            } else {

                confirmAlert({
                    title: 'Error occurred',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }


        }).catch(error => {

            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });



        CommunicationsService.getDashboardGraphData().then(response => {

            if (response.data.status != "error") {

                const data = {
                    labels: ['Today', 'This Week', 'This Month', 'This Year'],
                    datasets: [
                        {
                            label: 'SMS Usage',
                            backgroundColor: '#204066',
                            borderColor: '#204066',
                            borderWidth: 1,
                            hoverBackgroundColor: '#204066',
                            hoverBorderColor: '#204066',
                            data: [response.data.data.today, response.data.data.week, response.data.data.month, response.data.data.year]
                        }
                    ]
                };



                this.setState({
                    chartdata: data,
                    loading: false,
                });

                $('.table').bootstrapTable();


            } else {

                confirmAlert({
                    title: 'Error occurred',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            }


        }).catch(error => {

            confirmAlert({
                title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

            this.setState({
                loading: false,
            });

        });


        this.setState({
            loading: false,
        });

    }

    async componentDidMount() {

        await this.getData();

        $(".createUser").parsley();
        var that = this;
        setInterval(() => {

            this.setState({
                loading: true,
            });
            CommunicationsService.getDashboardData().then(response => {

                if (response.data.status != "error") {


                    this.setState({
                        sentSms: response.data.data.sentSms,
                        scheduledSms: response.data.data.scheduledSms,
                        smsBalance: response.data.data.smsBalance,
                        sentScheduledSms: response.data.data.sentScheduledSms,
                        loading: false,
                    });
                } else {

                    confirmAlert({
                        title: 'Error occurred',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });

                    this.setState({
                        loading: false,
                    });

                }


            }).catch(error => {

                confirmAlert({
                    title: 'Error occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            });



            CommunicationsService.getDashboardGraphData().then(response => {

                if (response.data.status != "error") {

                    const data = {
                        labels: ['Today', 'This Week', 'This Month', 'This Year'],
                        datasets: [
                            {
                                label: 'SMS Usage',
                                backgroundColor: '#ff901f',
                                borderColor: '#AFD9FF',
                                borderWidth: 1,
                                hoverBackgroundColor: '#AFD9FF',
                                hoverBorderColor: '#AFD9FF',
                                data: [response.data.data.today, response.data.data.week, response.data.data.month, response.data.data.year]
                            }
                        ]
                    };



                    this.setState({
                        chartdata: data,
                        loading: false,
                    });

                    $('.table').bootstrapTable();


                } else {

                    confirmAlert({
                        title: 'Error occurred',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });

                    this.setState({
                        loading: false,
                    });

                }


            }).catch(error => {

                confirmAlert({
                    title: 'Error occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            });


            this.setState({
                loading: false,
            });
        }, 10000);

    }

    componentDidUnMount() {

    }


    toggleUserView(event) {

        this.setState({

            userViewStatus: event.target.dataset.state,

        });




    }



    handleUserSubmission(event) {

        event.preventDefault();

    }

    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({

            [name]: value


        });


    }

    render() {
        const { users, lastLoggedInAt, sentSms, scheduledSms, smsBalance, sentScheduledSms, loading } = this.state;
        return (

            <>

                <div id="content" className="flex ">

                    <div className="page-container adminProfile" id="page-container">

                        <div className="row">
                            {/* Admin Details 
                            <div className="adminDetails">

                                <div className="userInfo">

                                    <figure className="avatar w-64">
                                        <img src="/assets/img/a1.jpg" alt="." />
                                    </figure>

                                    <h5>{this.state.userFullName}</h5>


                                </div>

                                <div className="loginDetails">

                                    <span>Last Login</span>
                                    <h5>{lastLoggedInAt}</h5>

                                </div>

                                <div className="bioinfo">

                                    <p className="email">
                                        <FontAwesomeIcon icon={faEnvelope} />
                                        {this.state.userEmail}
                                    </p>

                                    <p className="phone">
                                        <FontAwesomeIcon icon={faMobileAlt} />
                                        0712121212
                                    </p>

                                    {/*
                                    <button className="btn-primary">Update Profile</button>


                                </div>
                            </div>
                            {/* End Admin Details */}

                            {/* Admin Summary */}
                            <div className="col-12 adminSummary">

                                {/* Tabs Header */}
                                <div className="card">

                                    <div className="card-header" data-plugin="stellar">

                                        <div className="r-2x no-r-b">

                                            <div className="d-md-flex">

                                                <div className="p-4">

                                                    <div className="d-flex">

                                                        <div className="mx-3">

                                                            <h4 className="mt-2">{authService.getCurrentClientName() != undefined ? authService.getCurrentClientName() : "TRENDYMEDIA"}</h4>
                                                            {/* <div className=""><small><i className="fa fa-map-marker mr-2"></i>Capital West Building, Westlands, Nairobi</small></div> */}
                                                        </div>
                                                    </div>
                                                </div>




                                            </div>

                                        </div>
                                    </div>

                                </div>
                                {/* End Tabs Header*/}

                                {/* Tab Container  */}
                                <div className="row">

                                    <div className="col-sm-12 col-lg-12">

                                        {/* Tab Content  */}
                                        <div className="tab-content">
                                            {/* Tab 1 */}

                                            <div className="tab-pane active" id="tab_1">

                                                {!loading &&
                                                    <div className="row">
                                                        {smsBalance != undefined && <SummaryIcon
                                                            amount={"KES " + utils.formatNumber(smsBalance)}
                                                            title="SMS Balance"
                                                            icon={faHandHoldingUsd}
                                                        />}

                                                        {/* Summary Icon */}
                                                        {sentSms != undefined && <SummaryIcon
                                                            amount={sentSms}
                                                            title="Total SMS Sent"
                                                            icon={faCalculator}
                                                        />}

                                                        {/* End Summary Icon*/}

                                                        {/* Summary Icon */}
                                                        {scheduledSms != undefined && <SummaryIcon
                                                            amount={scheduledSms}
                                                            title="Scheduled SMS"
                                                            icon={faTimesCircle}
                                                        />}
                                                        {/* End Summary Icon*/}

                                                        {/* Summary Icon */}
                                                        {sentScheduledSms != undefined && <SummaryIcon
                                                            amount={sentScheduledSms}
                                                            title="Sent Scheduled SMS   "
                                                            icon={faHourglass}
                                                        />}
                                                        {/* End Summary Icon*/}
                                                    </div>
                                                }
                                                {/* 
                                                <h3>Latest Loan Requests</h3> */}
                                                {loading == true &&
                                                    <Loader type="dots" />
                                                }

                                            </div>
                                            {/* End Tab 1*/}

                                        </div>
                                        {/* End Tab Content  */}
                                    </div>
                                </div>
                                {(!loading && this.state.chartdata != "") &&
                                    <div className="row">

                                        <div className="col-sm-12 col-lg-12">
                                            <Chart
                                                title="My SMS Usage"
                                                charttype="bar"
                                                chartdata={this.state.chartdata}
                                                secondaryTitle="Sent SMS graph" />

                                        </div>
                                    </div>
                                }


                            </div>

                            {/* End Admin Summary */}

                        </div>

                    </div>

                </div>


            </>

        )

    }

}
