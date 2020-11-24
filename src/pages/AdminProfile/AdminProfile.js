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

export default class AdminProfile extends Component {

    constructor(props) {

        super(props);

        var newDate = new Date();
        newDate.setTime(AuthService.getUserLoggedInAt());
        var dateString = newDate.toUTCString();

        this.state = {
            users: [],
            loading: true,
            sentSms: "",
            chartdata: "",
            scheduledSms: "",
            smsBalance: "",
            sentScheduledSms: "",
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
        CommunicationsService.getDashboardData().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sentSms: response.data.data.sentSms,
                    scheduledSms: response.data.data.scheduledSms,
                    smsBalance: response.data.data.smsBalance,
                    sentScheduledSms: response.data.data.sentScheduledSms,
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




    }

    async componentDidMount() {

        await this.getData();

        $(".createUser").parsley();

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
                            {/* Admin Details */}
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

                                    */}

                                </div>
                            </div>
                            {/* End Admin Details*/}

                            {/* Admin Summary */}
                            <div className="col-10 adminSummary">

                                {/* Tabs Header */}
                                <div className="card">

                                    <div className="card-header bg-dark bg-img p-0 no-border" data-stellar-background-ratio="0.1" data-plugin="stellar">

                                        <div className="bg-dark-overlay r-2x no-r-b">

                                            <div className="d-md-flex">

                                                <div className="p-4">

                                                    <div className="d-flex">

                                                        <a href="#">
                                                            <span className="avatar w-64">
                                                                <img src="../assets/img/a1.jpg" alt="." />
                                                                <i className="on"></i>
                                                            </span>
                                                        </a>

                                                        <div className="mx-3">

                                                            <h5 className="mt-2">MobiConnect</h5>
                                                            <div className=""><small><i className="fa fa-map-marker mr-2"></i>Capital West Building, Westlands, Nairobi</small></div>
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

                                                <div className="row">
                                                    {smsBalance != "" && <SummaryIcon
                                                        amount={"KES " + utils.formatNumber(smsBalance)}
                                                        title="SMS Balance"
                                                        icon={faHandHoldingUsd}
                                                    />}

                                                    {(smsBalance == "" && sentSms == "" && scheduledSms == "" && sentScheduledSms == "") &&
                                                        <div className="row"><div className="mr-auto col-4"><Loader type="circle" /></div>
                                                        </div>}

                                                    {/* Summary Icon */}
                                                    {sentSms != "" && <SummaryIcon
                                                        amount={utils.formatNumber(sentSms)}
                                                        title="Total SMS Sent"
                                                        icon={faCalculator}
                                                    />}

                                                    {/* End Summary Icon*/}

                                                    {/* Summary Icon */}
                                                    {scheduledSms != "" && <SummaryIcon
                                                        amount={utils.formatNumber(scheduledSms)}
                                                        title="Scheduled SMS"
                                                        icon={faTimesCircle}
                                                    />}
                                                    {/* End Summary Icon*/}

                                                    {/* Summary Icon */}
                                                    {sentScheduledSms != "" && <SummaryIcon
                                                        amount={utils.formatNumber(sentScheduledSms)}
                                                        title="Sent Scheduled SMS   "
                                                        icon={faHourglass}
                                                    />}
                                                    {/* End Summary Icon*/}
                                                </div>
                                                {/* 
                                                <h3>Latest Loan Requests</h3> */}
                                                {loading &&
                                                    <Loader type="circle" />
                                                }

                                            </div>
                                            {/* End Tab 1*/}

                                        </div>
                                        {/* End Tab Content  */}
                                    </div>
                                </div>
                                {this.state.chartdata != "" &&
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
