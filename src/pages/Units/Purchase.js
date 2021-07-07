/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TenantService from '../../services/tenant.service';
import { Button, Modal } from 'react-bootstrap'
import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';
import utils from '../../utils/utils';
import { clientBaseUrl } from '../../API';
import Axios from 'axios';
import authService from '../../services/auth.service';

export default class Purchase extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            clientService: this.props.match.params.id,
            sources: {
                unitCosts: [],
                billingTransactions: [],
                clientService: {}
            },
            prepared: false,
            defaultUnitCosts: [],
            purchaseBody: {
                "sid": "1DEM3144F153139077763213806DEMO_invalid",
                "oid": "1",
                "amount": "10",
                "account": "failed_to_creat",
                "payment_channels": [
                    {
                        "name": "MPESA",
                        "paybill": "510800"
                    },
                    {
                        "name": "AIRTEL",
                        "paybill": "510800"
                    },
                    {
                        "name": "EQUITEL",
                        "paybill": "510800"
                    }
                ],
                "hash": "d9ffb6ef2291a3e10f515cc642daec50af15df9435a8b34f4a013e49167a25d1"
            },
            formData: {
                phone: null,
                units: null
            },
            iPayPurchaseUnitsBody: {
                "amount": 0,
                "clientService": this.props.match.params.id,
                "customerEmail": undefined,
                "customerTel": undefined,
                "paymentChannel": undefined,
                "units": 0,
                "callback": clientBaseUrl + "payments/callback"
            },
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMyTransactions = this.fetchMyTransactions.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.handleModalShowHide = this.handleModalShowHide.bind(this);
        this.calculateTotalAmount = this.calculateTotalAmount.bind(this);
        this.openAdvancedSearch = this.openAdvancedSearch.bind(this);
        this.handleSubmitPaymentTransaction = this.handleSubmitPaymentTransaction.bind(this);
        this.getDefaultUnitCosts = this.getDefaultUnitCosts.bind(this);

    }

    componentDidMount() {

        $(".view").hide();
        $(".selectProductForm").parsley();
        $(".view:first").show();
        this.fetchMyTransactions();
        this.getDefaultUnitCosts();
        for (var i = 0; i < 5; i++) {
            var placement = ".advancedSearchButton" + i;
            $(placement).click(this.openAdvancedSearch(i));
        }

    }
    openAdvancedSearch(i) {

        var placement = ".advancedSearch" + i;
        $(placement).stop().slideToggle();

    }
    componentDidUnMount() {

    }
    componentDidUpdate() {
        
        for (var i = 0; i < 5; i++) {
            var placement = ".advancedSearchButton" + i;
            $(placement).click(this.openAdvancedSearch(i));
        }

    }

    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);

        if (inputName === "units") {
            this.calculateTotalAmount(parseInt(inputValue));
            stateCopy.iPayPurchaseUnitsBody[inputName] = parseInt(inputValue);
        } else {
            stateCopy.iPayPurchaseUnitsBody[inputName] = inputValue;

            this.setState(stateCopy);
        }


    }

    calculateTotalAmount(units) {
        var costs = this.state.sources.unitCosts.length > 0 ? this.state.sources.unitCosts
            :
            this.state.defaultUnitCosts.filter(cost => cost.service === "SMS");
        var total = 0;
        for (var i = 0; i < costs.length; i++)
            if (units >= costs[i].lower && units <= costs[i].upper)
                total = units * costs[i].value;
        let stateCopy = Object.assign({}, this.state);

        stateCopy.iPayPurchaseUnitsBody.amount = total;

        this.setState(stateCopy);
    }

    async handleSubmitPaymentTransaction(el) {
        el.preventDefault();


        const { iPayPurchaseUnitsBody } = this.state;
        if ($(".selectProductForm").parsley().isValid()) {
            TenantService.prepareBillingTransaction(authService.getCurrentClientId(), iPayPurchaseUnitsBody).then(response => {

                if (response.data.status != "error") {
                    console.log(response.data.data)

                    this.setState({
                        purchaseBody: response.data.data != null ? response.data.data.data : {},
                        prepared: true
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
        if (iPayPurchaseUnitsBody.paymentChannel != "MPESA") {

        }

    }

    getDefaultUnitCosts() {

        TenantService.getUnitCosts().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    defaultUnitCosts: response.data.data != null ? response.data.data : [],
                });
                $(".table").bootstrapTable();

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

    handleModalShowHide() {
        if (this.state.showHide) {

            this.setState({
                subscriptionProduct: undefined,
            });
        }
        this.setState({ showHide: !this.state.showHide })
    }

    async fetchMyTransactions() {

        TenantService.getClientService(this.state.clientService).then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
                });
                $(".table").bootstrapTable();


            } else {
                confirmAlert({
                    title: 'Error fetching your transactions',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
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



    handleSubmission() {

        if ($(".selectProductForm").parsley().isValid()) {
            this.handleSubmitPaymentTransaction();
        }

    }


    render() {

        const { sources, successfulSubmission, networkError, submissionMessage, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">
                                Purchase {sources.clientService.service} Units</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">
                                <div className="row">
                                    <div className="col-6">
                                        <form className="selectProductForm" data-plugin="parsley" onSubmit={this.handleSubmitPaymentTransaction} >
                                            <div
                                                className="col-12">

                                                <label>Phone (254..)</label>

                                                <input
                                                    type="text"
                                                    placeholder="2547..."
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='12'
                                                    data-parsley-maxlength='12'
                                                    onChange={this.handleChange}
                                                    name="customerTel"
                                                    id="customerTel" />

                                            </div>
                                            <div
                                                className="col-12">

                                                <label>Units</label>

                                                <input
                                                    type="number"
                                                    placeholder="Minimum 10 units"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-min='10'
                                                    onChange={this.handleChange}
                                                    name="units"
                                                    id="units" />

                                            </div>
                                            <div
                                                className="col-12">

                                                <label>Total Amount</label>

                                                <input
                                                    type="number" disabled value={this.state.iPayPurchaseUnitsBody.amount}
                                                    placeholder="Minimum 10 units"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-min='10'
                                                    onChange={this.handleChange}
                                                    name="amount"
                                                    id="amount" />

                                            </div>
                                            <div
                                                className="col-12">

                                                <label>Receive Email Invoice</label>
                                                <select name="sendEmails" className="form-control"
                                                    onChange={this.handleChange}>
                                                    <option></option>
                                                    <option value="yes">Yes</option>
                                                    <option value="no">No</option>
                                                    <option></option>
                                                </select>

                                            </div>
                                            {this.state.iPayPurchaseUnitsBody.sendEmails === "yes" &&
                                                <div
                                                    className="col-12">

                                                    <label>Email</label>

                                                    <input
                                                        type="email"
                                                        placeholder="100"
                                                        className="form-control"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}
                                                        name="customerEmail"
                                                        id="customerEmail" />

                                                </div>}


                                            <div
                                                className="col-12">

                                                <label>Desired Payment Channel</label>
                                                <select name="paymentChannel" className="form-control"
                                                    onChange={this.handleChange}>
                                                    <option></option>
                                                    <option value="MPESA">MPESA</option>
                                                    <option value="Other">Others</option>
                                                    <option></option>
                                                </select>

                                            </div>
                                            <button className="btn-primary" type="submit">Purchase</button>
                                        </form>

                                        {loading &&
                                            <Loader type="dots" />
                                        }</div>
                                    <div className="col-6">
                                        <h4>Payment Instructions</h4>
                                        {!this.state.prepared &&
                                            <p>Please fill out the form</p>
                                        }

                                        {this.state.prepared &&
                                            <>
                                                <p>Please use the following information for your payment</p>

                                                {this.state.purchaseBody.payment_channels != "" &&
                                                    this.state.purchaseBody.payment_channels.map((channel, index) => (
                                                        <>
                                                            <div className="row advancedSearchOptions ">
                                                                <div className="col-6 searchToggle">

                                                                    <button className={"advancedSearchButton" + index + " btn-rounded"}>

                                                                        <span className="">
                                                                            <i className="i-con i-con-minus">
                                                                                <i></i>
                                                                            </i>
                                                                        </span>

                                                                        {channel.name}

                                                                    </button>

                                                                </div>



                                                            </div>

                                                            <div className={"advancedSearch" + index + " padding pb-0 pt-4"} style={{ display: 'none' }}>

                                                                <div className="col-lg-12 pb-2 pl-0 pr-0">

                                                                    <p>Paybill Number: {channel.paybill}</p>
                                                                    <p>Account Number: {this.state.purchaseBody.account}</p>
                                                                    <p>Total Amount : {this.state.purchaseBody.amount}</p>
                                                                </div>
                                                            </div>

                                                        </>
                                                    ))
                                                }
                                            </>
                                        }
                                    </div>
                                </div>

                            </div>

                            {successfulSubmission &&
                                <Notification
                                    type="success"
                                    description={submissionMessage} />
                            }

                            {networkError &&
                                <Notification
                                    type="network"
                                    description="Network Connection Issue, please check your internet connection and try again"
                                />
                            }



                        </div>



                    </div>

                </div>
            </>

        )

    }

}
