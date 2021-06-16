/* global $ */

import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";


import { faHandHoldingUsd, faHourglass, faDrawPolygon, faMobileAlt, faEnvelope, faTimesCircle, faCalculator } from '@fortawesome/free-solid-svg-icons';

import SummaryIcon from '../../components/Admin/SummaryIcon';
import Chart from '../../components/Admin/Chart';


import CommunicationsService from '../../services/communications.service';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

//import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

import { Button, Modal } from 'react-bootstrap'
import Loader from '../../components/loaders/Loader';


import utils from '../../utils/utils';
import tenantService from '../../services/tenant.service';


export default class SingleClient extends Component {

    constructor(props) {

        super(props);

        this.state = {
            smsBalance:0,
            sentSms:0,
            scheduledSms:0,
            sentScheduledSms:0,
            chartdata: "",
            customerId: this.props.match.params.id,
            client: {
                country:{}
            },
            searchBody: {
                startDate: undefined,
                endDate: undefined
            },
            applications: [],
            loans: [],
            application: [],
            toogleStatusBody: {
                productId: undefined,
                customerId: undefined,
                value: undefined
            },
            interactions: [],
            products: [],
            resetModal: false,
            submitting: false,
            loadingApplication: false,
            showToogleStatus: false,
            limit: undefined,
            businessData: {},
            client: {},
            customerGroups: [],
            repayments: [],
            limits: [],
            relations: [],
            optionalFields: [],
            customerStatuses: [],
            customerFlags: [],
            socialData: {},
            updateContactsModel: {},
            supplierData: {},
            accounts: "",
            interactionTypes: [],
            messages: [],
            zones: [],
            markets: [],
            interactionId: undefined,
            repaymentId: undefined,
            interaction: { interactionSubmissions: [] },
            showInteraction: false,
            showRepayment: false,
            showUpdateContacts: false,
            loading: false,
            fields: [],
            resetFormData: { resetReason: undefined },
            formData: {
                active: true,
                customerId: this.props.match.params.id,
                interactionCategoryName: "",
                interactionSubmissions: [],
                action: {
                    actionType: "",
                    active: true,
                    complete: null,
                    name: ""
                }, suppliers: [{
                    supplierName: 'Kabu ',
                    weeklyExpenditure: '500',
                    weeklyIncome: '1300'
                }, {
                    supplierName: 'Sweety Sweets',
                    weeklyExpenditure: '200',
                    weeklyIncome: '600'
                }, {
                    supplierName: 'Rwathia',
                    weeklyExpenditure: '200',
                    weeklyIncome: '600'
                }]
            },
            showApplication: false,
            loadingApplication: false,

        }

        this.toggleTab = this.toggleTab.bind(this);
        this.getData = this.getData.bind(this);
        this.loadSingleCustomer = this.loadSingleCustomer.bind(this);

    }

    openAdvancedSearch() {

        $(".advancedSearch").stop().slideToggle();

    }


    async componentDidMount() {

        const { id } = this.props.match.params;

        
        await this.loadSingleCustomer(id);

        $(document).on("click", ".tab-nav li", this.toggleTab);



        $(".tab-pane").each(function (index, value) {
            $(this).find(".tab-content").hide();
            $(this).find(".tab-content:first").show();
        });

        $(".tab-nav").each(function (index, value) {

            $(this).find("li").removeClass("active");
            $(this).find("li:first").addClass("active");

        });


    }


    componentDidUpdate() {

        $(".table").each(function (index, value) {
            $(this).bootstrapTable('refresh');
        });

        $(".tab-pane").each(function (index, value) {
            $(this).find(".tab-content").hide();
            $(this).find(".tab-content:first").show();
        });

        $(".tab-nav").each(function (index, value) {

            $(this).find("li").removeClass("active");
            $(this).find("li:first").addClass("active");

        });

        $(".createInteraction").parsley();

        $(".interactiondate").datepicker({
            format: 'dd/mm/yyyy',
            todayHighlight: true,
            autoclose: true,
            startDate: '0d',
            datesDisabled: '-1d',
            orientation: 'bottom'
        });
    }

    toggleTab(event) {

        var taget = event.target.dataset.target;
        var listItem = event.target;

        $(listItem).parents(".tab-nav").find("li").removeClass("active");
        $(listItem).addClass("active");
        $(listItem).parents(".tab-nav").next().find(".tab-content").hide();
        $(listItem).parents(".tab-nav").next().find(".tab-content." + taget).show();


        $(this).parents(".tab-nav").next().find("").addClass("targeted");




        // $("this").parents(".tab-nav").next(".col-9").find(".tab-content."+event.target.dataset.target).addClass("targeted");

    }

  
    getData(clientKey) {
       
        CommunicationsService.getDashboardData(clientKey).then(response => {

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



        CommunicationsService.getDashboardGraphData(clientKey).then(response => {

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

    }
    loadSingleCustomer(customerId) {


        tenantService.getClient(customerId).then(response => {

            if (response.data.successMessage === "success") {

                this.setState({
                    client: response.data.data,
                    loading: false,
                });
                this.getData(response.data.data.tenantKey);


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

            confirmAlert({
                title: 'Error',
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


    componentDidUnMount() {

        $(".table").each(function (index, value) {

            $(this).bootstrapTable().destroy();

        });

        $(".createInteraction").parsley().destroy();

        $(".interactiondate").datepicker({

        }).destroy();
    }

    


    render() {

        const { client,submitting, smsBalance,
            sentSms,
            scheduledSms,
            sentScheduledSms, loading, interaction, repayment, limits, application, loadingApplication,
        } = this.state;

        return (
            <>

                <div id="content" className="flex ">


                    <Modal show={this.state.showToogleStatus}>

                        <Modal.Header closeButton onClick={() => this.opentoogleStatusModal()}>
                            <Modal.Title>Toogle Customer Borrowing</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-12">
                                    <label>Limit Product</label>
                                    <select
                                        name="limit"
                                        id="limit"
                                        className="form-control"
                                        onChange={this.handleToogleStatusChange}
                                    >
                                        <option value=""></option>
                                        {limits != "" &&
                                            limits.map((limit, index) => (
                                                <>

                                                    <option value={limit.productId}>{limit.productName}</option>
                                                </>

                                            ))

                                        }
                                    </select>

                                </div>
                                <div className="col-12">
                                    {this.state.toogleStatusBody.productId != undefined &&
                                        <p>Status will change to : {this.state.toogleStatusBody.value}</p>
                                    }
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {submitting ?
                                <Loader type="circle" />
                                : <><Button variant="secondary" onClick={() => this.opentoogleStatusModal()}>
                                    Close
                                </Button>
                                    <Button type="submit" variant="primary" onClick={() => this.toogleStatus()}>
                                        Submit
                                    </Button></>}
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showUpdateContacts}>

                        <Modal.Header closeButton onClick={() => this.openUpdateContactsModal()}>
                            <Modal.Title>Update Customer Contacts</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">
                                <div className="col-12">
                                    <label>Phone Number</label>
                                    <input className="form-control" required
                                        id="phoneNumber" name="phoneNumber" onChange={this.handleContactsChange}
                                        type="text" />
                                </div>
                                <div className="col-12">
                                    <label>Alternate Phone Number</label>
                                    <input className="form-control" required
                                        id="alternativeNumber" name="alternativeNumber" onChange={this.handleContactsChange}
                                        type="text" />
                                </div>

                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {submitting ?
                                <Loader type="circle" />
                                : <><Button variant="secondary" onClick={() => this.openUpdateContactsModal()}>
                                    Close
                                </Button>
                                    <Button type="submit" variant="primary" onClick={() => this.updateContacts()}>
                                        Submit
                                    </Button></>}
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.resetModal}>
                        <Modal.Header closeButton onClick={() => this.resetPinModal()}>
                            <Modal.Title>Reset Customer Pin</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="row">

                                <div className="col-12">
                                    Confirm reset pin for {client.fullName}
                                </div>
                                <div className="col-12">
                                    <label>Reason</label>
                                    <input className="form-control" required
                                        id="reason" onChange={this.handleReasonChange}
                                        type="text" />
                                </div>
                            </div>
                        </Modal.Body>
                        <Modal.Footer>
                            {submitting ?
                                <Loader type="circle" />
                                : <><Button variant="secondary" onClick={() => this.resetPinModal()}>
                                    Close
                                </Button>
                                    <Button type="submit" variant="primary" onClick={() => this.resetPin()}>
                                        Submit
                                    </Button></>}
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showInteraction}>
                        <Modal.Header closeButton onClick={() => this.handleshowHideModal()}>
                            <Modal.Title>{interaction.interactionCategoryName} Interaction Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <div className="padding row">

                                <ol className="nav flex-column">
                                    {interaction.dateTimeCreated != undefined &&
                                        <>
                                            <li className="nav-item"> Interaction Type: {interaction.interactionTypeName}</li>
                                            <li className="nav-item"> Interaction Date: {interaction.dateTimeCreated}</li>
                                        </>
                                    }
                                    {interaction.interactionSubmissions != "" &&
                                        interaction.interactionSubmissions.map((submission, index) => (
                                            <li key={index} className="nav-item"> {utils.formatCamelCaseToString(submission.field)} : {submission.value}</li>
                                        ))
                                    }


                                </ol>
                            </div>
                            {loading &&
                                <Loader type="circle" />
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleshowHideModal()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showRepayment}>
                        <Modal.Header closeButton onClick={() => this.handleshowHideRepaymentModal()}>
                            <Modal.Title> Repayment Statuses</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            {repayment != undefined && repayment.map((singleRepayment, index) => (
                                <div className="padding row" key={index}>

                                    <div className="col-12">
                                        <label>Status: </label>
                                        <span disabled>{utils.formatCamelCaseToString(singleRepayment.repaymentStatus)}</span>
                                    </div>
                                    <div className="col-12">
                                        <label>Reason: </label>
                                        <span disabled>{singleRepayment.statusReason}</span>

                                    </div>
                                </div>
                            )
                            )
                            }
                            {loading &&
                                <Loader type="circle" />
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleshowHideRepaymentModal()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>

                    <Modal show={this.state.showApplication}>
                        <Modal.Header closeButton onClick={() => this.handleshowHideApplicationModal()}>
                            <Modal.Title> Application Details</Modal.Title>
                        </Modal.Header>
                        <Modal.Body>
                            <table
                                className="table table-small" data-plugin="bootstrapTable"
                                id="table"
                                data-search="true"
                                data-search-align="right"
                                data-show-columns="true"
                                data-show-export="true"
                                data-maintain-meta-data="true"
                                data-multiple-select-row="false"
                                data-mobile-responsive="true"
                                data-pagination="true"
                                data-page-list="[10, 25, 50, 100, ALL]"
                            >

                                <thead>
                                    <tr>
                                        <th data-sortable="true">Status</th>
                                        <th data-sortable="true"> Desc</th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {application != undefined && application.map((singleapplication, index) => (

                                        <tr key={index}>
                                            <td>{utils.formatCamelCaseToString(singleapplication.applicationStatus)}</td>
                                            <td>{singleapplication.statusDesc}</td>

                                        </tr>

                                    )
                                    )
                                    }

                                </tbody>

                            </table>

                            {loadingApplication &&
                                <Loader type="circle" />
                            }
                        </Modal.Body>
                        <Modal.Footer>
                            <Button variant="secondary" onClick={() => this.handleshowHideApplicationModal()}>
                                Close
                            </Button>
                        </Modal.Footer>
                    </Modal>




                    <div className="page-container" id="page-container">


                        <div className="padding">

                            {/* Tabs Header */}
                            <div className="card">

                                <div className="card-header bg-dark bg-img p-0 no-border customerHighlights">

                                    <div className="bg-dark-overlay r-2x no-r-b">

                                        <div className="d-md-flex">

                                            <div className="p-4 customerBio">

                                                <div className="d-flex">

                                                    <div className="mx-3">
                                                        <h5 className="mt-2">{client != "" ? client.name : ""}</h5>
                                                        <div className=""> <small>{client.physicalAddress || ""}</small></div>
                                                    </div>
                                                </div>
                                            </div>

                                            <span className="flex"></span>

                                            <div className="pinOptions align-items-center d-flex">
                                                {/* End Reset Pin 
                                                <button
                                                    className="btn-primary"
                                                    onClick={() => this.resetPinModal()}>Reset Pin
                                            </button>
                                            */}

                                            </div>

                                            {/* Customer Status */}
                                            <div className="align-items-center d-flex p-4">
                                                <div className="toolbar">
                                                    <a href="#" className="btn btn-sm bg-dark-overlay btn-rounded text-white bg-success active" data-toggle-class="bg-success">
                                                        <span className="d-inline">{client.status ? "Active" : "Inactive"}</span>
                                                        <span className="d-none">{client.status ? "Active" : "Inactive"}</span>
                                                    </a>

                                                </div>
                                            </div>
                                            {/* End Customer Status*/}

                                        </div>

                                    </div>
                                </div>

                                {/* Tab Navigation */}
                                <div className="px-2">

                                    <div className="d-flex nav-active-border nav-active-text-primary b-primary">

                                        <ul className="nav ">

                                            {/* Single Tab Navigation */}
                                            <li className="nav-item">
                                                <a className="nav-link py-3 active" href="#" data-toggle="tab" data-target="#business">Dashboard</a>
                                            </li>
                                            {/* End Single Tab Navigation*/}
                                            {/* Single Tab Navigation */}
                                            <li className="nav-item">
                                                <a className="nav-link py-3" href="#" data-toggle="tab" data-target="#biodata">Bio Data</a>
                                            </li>
                                            {/* End Single Tab Navigation*/}


                                        </ul>

                                    </div>
                                </div>
                                {/* End Tab Navigation*/}
                            </div>
                            {/* End Tabs Header*/}
                            {/* Tab Container  */}
                            <div className="row">

                                <div className="col-sm-12 col-lg-12">

                                    {/* Tab Content  */}
                                    <div className="tab-content">

                                        {/* Bio Data */}
                                        <div className="tab-pane  fade" id="biodata">
                                            <div className="card">

                                                <div className="px-2"><div className="py-3">



                                                    <ul className="nav flex-column">

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-pin"></i>
                                                                <span className="mx-2">{(client.state + " " + client.physicalAddress + " ") || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-account"><i></i></i>
                                                                <span className="mx-2">{client.clientType || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-mail"><i></i></i>
                                                                <span className="mx-2">{client.email || ""}</span>
                                                            </a>
                                                        </li>

                                                        <li className="nav-item">
                                                            <a className="nav-link i-con-h-a">
                                                                <i className="i-con i-con-web"><i></i></i>
                                                                <span className="mx-2">{client.website !=undefined ? <> <a href={client.website} target="blank" >Visit Website</a> </> : ""}</span>
                                                            </a>
                                                        </li>

                                                    </ul>
                                                </div>
                                                </div>
                                            </div>
                                        </div>
                                        {/* End Bio Data*/}

                                        {/* Business Details */}
                                        <div className="tab-pane active " id="business">
                                            <div className="card">

                                                <div className="px-4 py-4">

                                                <div className="row">

<div className="col-sm-12 col-lg-12">

    {/* Tab Content  */}
    <div className="tab-content">
        {/* Tab 1 */}

        <div className="tab-pane active" id="tab_1">

        {!loading &&
            <div className="row">
                {smsBalance != "" && <SummaryIcon
                    amount={"KES " + utils.formatNumber(smsBalance)}
                    title="SMS Balance"
                    icon={faHandHoldingUsd}
                />}

                {/* Summary Icon */}
                {sentSms != "" && <SummaryIcon
                    amount={sentSms}
                    title="Total SMS Sent"
                    icon={faCalculator}
                />}

                {/* End Summary Icon*/}

                {/* Summary Icon */}
                {scheduledSms != "" && <SummaryIcon
                    amount={scheduledSms}
                    title="Scheduled SMS"
                    icon={faTimesCircle}
                />}
                {/* End Summary Icon*/}

                {/* Summary Icon */}
                {sentScheduledSms != "" && <SummaryIcon
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
                <Loader type="dots"/>
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
                                            </div>
                                        </div>
                                        {/* End Business Details */}
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>


            </>
        )

    }

}
