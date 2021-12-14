/* global $ */

import React, { Component } from 'react';


import { faHandHoldingUsd, faHourglass, faTimesCircle, faCalculator } from '@fortawesome/free-solid-svg-icons';

import utils from '../../utils/utils.js';

import AuthService from '../../services/auth.service';
import SummaryIcon from '../../components/Admin/SummaryIcon';

import Loader from '../../components/loaders/Loader';
import Chart from '../../components/Admin/Chart';

import { Button, Modal } from 'react-bootstrap'
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import CommunicationsService from '../../services/communications.service';
import authService from '../../services/auth.service';
import addressbookService from '../../services/addressbook.service.js';
import sourceService from '../../services/source.service.js';

export default class AdminProfile extends Component {

    constructor(props) {

        super(props);

        var newDate = new Date();
        newDate.setTime(AuthService.getUserLoggedInAt());
        var dateString = newDate.toUTCString();

        this.state = {
            users: [],
            sources: [],
            groups: [],
            showDashboard: false,
            loading: false,
            sentSms: undefined,
            setInterval: 0,
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
            newGroup: false,
            newMessageData: {
                message: undefined,
                recipient: [],
                sendFromTemplate: "false",
                sendOnce: "true",
                sendTime: "now",
                source: undefined
            },
            newContactData: {},
            showQuickMessageForm: false,
            userName: AuthService.getCurrentUser(),
            userEmail: AuthService.getCurrentUserEmail(),
            userFullName: AuthService.getCurrentUserName(),


        }

        this.toggleUserView = this.toggleUserView.bind(this);
        this.handleUserSubmission = this.handleUserSubmission.bind(this);
        this.handleInputChange = this.handleInputChange.bind(this);
        this.formatDate = this.formatDate.bind(this);
        this.getData = this.getData.bind(this);

        this.handleshowQuickMessageForm = this.handleshowQuickMessageForm.bind(this);
        this.handleQuickMessageFormSubmission = this.handleQuickMessageFormSubmission.bind(this);
        this.handleshowContactForm = this.handleshowContactForm.bind(this);
        this.toogleshowDashboard = this.toogleshowDashboard.bind(this);
        this.handleChanges = this.handleChanges.bind(this);
        this.handleContactChanges = this.handleContactChanges.bind(this);
        this.getAllContactGroups = this.getAllContactGroups.bind(this);

    }


    toogleshowDashboard() {
        this.setState({ showDashboard: !this.state.showDashboard });
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
        CommunicationsService.getportalData(key).then(response => {

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



        CommunicationsService.getportalGraphData().then(response => {

            if (response.data.status != "error") {

                const data = {
                    labels: ['Today', 'This Week', 'This Month', 'This Year'],
                    datasets: [
                        {
                            label: 'SMS Usage',
                            backgroundColor: '#49bcd7',
                            borderColor: '#49bcd7',
                            borderWidth: 1,
                            hoverBackgroundColor: '#49bcd7',
                            hoverBorderColor: '#49bcd7',
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
        $(".quickMessageForm").parsley();
        $(".quickContactForm").parsley();
        this.getAllContactGroups();
    }

    componentDidUpdate() {

        $(".quickMessageForm").parsley();
        $(".quickContactForm").parsley();
    }




    toggleUserView(event) {

        this.setState({

            userViewStatus: event.target.dataset.state,

        });




    }

    handleshowQuickMessageForm() {
        this.setState({ showQuickMessageForm: !this.state.showQuickMessageForm });
    }

    handleshowContactForm() {
        if (this.state.showContactForm) {
            this.setState({ newGroup: false });
        }
        this.setState({ showContactForm: !this.state.showContactForm });
    }

    handleshowGroupContactForm() {
        this.setState({ newGroup: true });
        this.handleshowContactForm();
    }

    handleQuickMessageFormSubmission(event) {

        event.preventDefault();
        if ($(".quickMessageForm").parsley().isValid()) {
            console.log("data");
            this.handleshowQuickMessageForm();
            console.log(this.state.newMessageData);
            CommunicationsService.createMessage(this.state.newMessageData).then(response => {

                if (response.data.status != "error") {

                    confirmAlert({
                        // title: 'Success',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'View Outbox',
                                onClick: () => window.location.href = "/portal/messages"
                            },
                            {
                                label: 'OK',
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        // title: 'Error sending messages',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });
                }

            }).catch(error => {
                // $('input[type="submit"],button[type="submit"]').show();
                confirmAlert({
                    title: 'Error occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            });
        }


    }


    handleUserSubmission(event) {

        event.preventDefault();
        if ($(".quickContactForm").parsley().isValid()) {
            console.log("data");
            const { newContactData } = this.state;
            console.log(newContactData);
            this.handleshowContactForm();
            addressbookService.createContact(newContactData).then(response => {
                console.log(response.data);
                if (response.data.status != "success") {
                    confirmAlert({
                        title: 'Error occurred',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });
                } else {
                    confirmAlert({
                        message: 'Your contacts have been created succesfully.',
                        buttons: [
                            {
                                label: 'Ok',
                                onClick: () => window.location.reload()
                            },
                            {
                                label: 'View All Conntacts',
                                onClick: () => window.location.href = "/portal/addressBook"
                            }
                        ]
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
            });
        }


    }

    getAllContactGroups() {

        this.setState({
            loading: true
        });
        sourceService.getAllActiveSources().then(response => {

            if (response.data.status != "error") {


                var uniqueSources = response.data.data != undefined ? response.data.data.filter((v, i, a) => a.findIndex(t => (t.alphanumeric === v.alphanumeric)) === i) : [];

                this.setState({
                    sources: uniqueSources != null ? uniqueSources : [],
                });


            } else {
                if (response.data.message == "No records found") {
                    confirmAlert({
                        message: "Sadly You have no Sender registered yet",
                        buttons: [
                            {
                                label: 'Register for one now',
                                onClick: () => window.location.href = "/portal/mysenderIds"
                            },
                            {
                                label: 'Ok',
                            }
                        ]
                    });
                } else {
                    confirmAlert({
                        // title: 'Error fetching your sources',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });
                }

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
        });

        addressbookService.getAllContactGroups().then(response => {

            if (response.data.status != "error") {

                this.setState({
                    loading: false,
                    groups: response.data.data
                });

            } else {
                confirmAlert({

                    title: 'Error',
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

            this.setState({
                loading: false,
            });
            confirmAlert({
                title: 'Following Error Occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'Ok',
                    }
                ]
            });
        });


    }

    handleChanges(event) {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        let stateCopy = Object.assign({}, this.state);
        if (inputName === "recipient") {
            stateCopy.newMessageData[inputName] = [inputValue];

        }else if (inputName === "source") {
            stateCopy.newMessageData[inputName] = parseInt(inputValue);

        } else
        stateCopy.newMessageData[inputName] = inputValue;
        this.setState(stateCopy);

    }

    handleContactChanges(event) {
        let inputName = event.target.name;
        let inputValue = event.target.value;
        let stateCopy = Object.assign({}, this.state);

            stateCopy.newContactData[inputName] = inputValue;
        this.setState(stateCopy);

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
        const { groups, sources, sentSms, scheduledSms, smsBalance, sentScheduledSms, loading } = this.state;
        return (

            <>

                <div id="content" className="flex ">

                    <div className="container" id="page-container">

                        <div className="row padding">

                            <div className="col-12 adminSummary">
                                {/* Tab Container  */}
                                <div className="row">

                                    <div className=" col-12 padding">
                                        {/* Tab Container  */}
                                        <div className="row  justify-content-center">
                                            <div className="card col-sm padding">  <button onClick={() => this.toogleshowDashboard()} className="btn btn-primary float-right">{this.state.showDashboard ? <i className="fa fa-eye-slash"> Dashboard</i> : <i className="fa fa-eye"> Dashboard</i>}</button>
                                            </div>

                                            <div className="card col-sm padding"><button onClick={() => this.handleshowQuickMessageForm()} className="btn btn-primary float-right"><i className="fa fa-pen">  Quick Message</i></button>
                                            </div>

                                            <div className="card col-sm padding"> <button onClick={() => this.handleshowContactForm()} className="btn btn-primary float-right"><i className="fa fa-pen">  New Contact</i></button>
                                            </div>
                                            <div className="card col-sm padding">  <button onClick={() => this.handleshowGroupContactForm()} className="btn btn-primary float-right"><i className="fa fa-plus">  Group Contact</i></button>
                                            </div>

                                            <Modal show={this.state.showQuickMessageForm}>
                                                <Modal.Header closeButton onClick={() => this.handleshowQuickMessageForm()}>
                                                    <Modal.Title> Quick Message</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <form className="form quickMessageForm" data-plugin="parsley" onSubmit={this.handleQuickMessageFormSubmission}>
                                                        <div className="form-group">
                                                            <label>Recipient</label>
                                                            <input type="number" maxLength="12" minLength="9" className="form-control" data-parsley-required="true" name="recipient" id="recipient" onChange={this.handleChanges} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Sender</label>
                                                            <select name="source" className="form-control" data-parsley-required="true" id="source" onChange={this.handleChanges} >
                                                                <option></option>
                                                                {sources != "" && sources.map((source, index) => (<option value={source.id}>{source.senderId}</option>))}
                                                            </select>
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Message</label>
                                                            <textarea maxLength="160" minLength="5" className="form-control" data-parsley-required="true" name="message" id="message" onChange={this.handleChanges} />
                                                        </div>
                                                        <Button variant="primary" type="submit">
                                                            Submit
                                                        </Button>
                                                    </form>

                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => this.handleshowQuickMessageForm()}>
                                                        Close
                                                    </Button>

                                                </Modal.Footer>
                                            </Modal>

                                            <Modal show={this.state.showContactForm}>
                                                <Modal.Header closeButton onClick={() => this.handleshowContactForm()}>
                                                    <Modal.Title> New{this.state.newGroup && " Group "}Contact</Modal.Title>
                                                </Modal.Header>
                                                <Modal.Body>
                                                    <form className="form quickContactForm" data-plugin="parsley" onSubmit={this.handleUserSubmission}>
                                                        <div className="form-group">
                                                            <label>Name</label>
                                                            <input type="text" className="form-control" data-parsley-required="true" name="name" id="name" onChange={this.handleContactChanges} />
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Group</label>
                                                            {!this.state.newGroup ? <select name="group" data-parsley-required="true" className="form-control" id="group" onChange={this.handleContactChanges} >
                                                                <option></option>
                                                                {groups != "" && groups.map((source, index) => (<option value={source}>{source}</option>))}
                                                            </select> :
                                                                <input type="text" className="form-control" data-parsley-required="true" name="group" id="group" onChange={this.handleContactChanges} />
                                                            }
                                                        </div>
                                                        <div className="form-group">
                                                            <label>Contact</label>
                                                            <input type="number" className="form-control" data-parsley-required="true" name="phone" id="phone" onChange={this.handleContactChanges} />
                                                        </div>
                                                        <Button variant="primary" type="submit">
                                                            Submit
                                                        </Button>
                                                    </form>

                                                </Modal.Body>
                                                <Modal.Footer>
                                                    <Button variant="secondary" onClick={() => this.handleshowContactForm()}>
                                                        Close
                                                    </Button>

                                                </Modal.Footer>
                                            </Modal>
                                        </div>

                                    </div>

                                    <div className="tab-content col-12 padding">
                                        {/* Tab 1 */}

                                        {this.state.showDashboard &&
                                            <div className="tab-pane active" id="tab_1">

                                                {!loading &&
                                                    <div className="row">
                                                        {smsBalance != undefined && <SummaryIcon
                                                            amount={"KES " + utils.formatNumber(smsBalance)}
                                                            title="Account Balance"
                                                            icon={faHandHoldingUsd}
                                                        />
                                                        }

                                                        {/* Summary Icon */}
                                                        {sentSms != undefined && <SummaryIcon
                                                            amount={sentSms}
                                                            title="SMS Sent"
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
                                        }
                                         {(!loading && this.state.chartdata != "") &&
                                    <div className="row">

                                        <div className="col-sm-12 col-lg-12">
                                            <Chart
                                                charttype="bar"
                                                chartdata={this.state.chartdata}
                                                secondaryTitle="Sent SMS graph" />

                                        </div>
                                    </div>
                                }

                                    </div>
                                </div>


                            </div>

                            {/* End Admin Summary */}

                        </div>

                    </div>

                </div>


            </>

        )

    }

}
