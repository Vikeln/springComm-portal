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
                "callback":clientBaseUrl+"payments/callback"
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
        this.handleSubmitPaymentTransaction = this.handleSubmitPaymentTransaction.bind(this);
        this.getDefaultUnitCosts = this.getDefaultUnitCosts.bind(this);

    }

    componentDidMount() {

        $(".view").hide();
        $(".selectProductForm").parsley();
        $(".view:first").show();
        this.fetchMyTransactions();
        this.getDefaultUnitCosts();

    }

    componentDidUnMount() {

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

                    // this.setState({
                    //     defaultUnitCosts: response.data.data != null ? response.data.data : [],
                    // });

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
            if(iPayPurchaseUnitsBody.paymentChannel != "MPESA"){

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
                                            <p>Please use the following information for your payment</p>

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
