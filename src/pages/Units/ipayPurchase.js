
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
import { clientBaseUrl, ipayKeyString } from '../../API';
import Axios from 'axios';

import CryptoJS from 'crypto-js';

export default class IpayPurchase extends Component {

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
            showHide: false,
            defaultUnitCosts: [],
            formData: {
                phone: null,
                units: null
            },
            paymentOrderId: this.getiPayCorrelator(),
            prepareTransactionBody: {
                ipayCorrelator: undefined,
                units: undefined,
                amount: undefined,
                clientService: undefined,
            },
            iPayPurchaseUnitsBody: {
                live: "0", // 0 or 1 whether its live txn or demo txn
                oid: undefined, // order id.. our unique ref for each request
                inv: undefined, // invoice no.. also from us.. could be same as order id
                ttl: undefined, // amount
                tel: "256712375678", // customer phone number
                eml: "kajuej@gmailo.com", // customer email
                vid: "demo", // value is always "demo" or some vender id assigned by ipay
                curr: "KES", // currency "KES"
                p1: "", // optional fields with custom entries that will be passed back in callback
                p2: "", //
                p3: "", //
                p4: "", //
                cbk: clientBaseUrl + "payments/callback", //"http://example.com" callback url
                cst: "1", // "1" 1 or 0 allows customer to recieve email confirmation from ipay.. 
                crl: "0", // "0" Name of the cURL flag input field crl=0 for http/https call back; crl=1 for a data stream of comma separated values ;crl=2 for a json data stream.
                hsh: undefined // hash value
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
        this.getiPayCorrelator = this.getiPayCorrelator.bind(this);
        this.calculateTotalAmount = this.calculateTotalAmount.bind(this);
        this.HMAC = this.HMAC.bind(this);
        this.handleSubmitPaymentTransaction = this.handleSubmitPaymentTransaction.bind(this);
        this.handlePrepareTransaction = this.handlePrepareTransaction.bind(this);
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
    getiPayCorrelator() {
        return 'TR' + Date.now();
    }


    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);

        if (inputName === "units") {
            this.calculateTotalAmount(parseInt(inputValue));
            stateCopy.prepareTransactionBody[inputName] = parseInt(inputValue);
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

        stateCopy.iPayPurchaseUnitsBody.ttl = total;
        stateCopy.prepareTransactionBody.amount = total;

        this.setState(stateCopy);
    }

    async handleSubmitPaymentTransaction(el) {
        el.preventDefault();


        const { iPayPurchaseUnitsBody, paymentOrderId } = this.state;
        if ($(".selectProductForm").parsley().isValid()) {

            iPayPurchaseUnitsBody.oid = paymentOrderId;
            iPayPurchaseUnitsBody.inv = paymentOrderId;
            let hash = "";
            var params = [
                ["live", iPayPurchaseUnitsBody.live]
                , ["oid", iPayPurchaseUnitsBody.oid],
                ["inv", iPayPurchaseUnitsBody.inv],
                ["ttl", iPayPurchaseUnitsBody.ttl],
                ["tel", iPayPurchaseUnitsBody.tel],
                ["eml", iPayPurchaseUnitsBody.eml],
                ["vid", iPayPurchaseUnitsBody.vid],
                ["curr", iPayPurchaseUnitsBody.curr],
                ["p1", iPayPurchaseUnitsBody.p1],
                ["p2", iPayPurchaseUnitsBody.p2],
                ["p3", iPayPurchaseUnitsBody.p3],
                ["p4", iPayPurchaseUnitsBody.p4],
                ["cst", iPayPurchaseUnitsBody.cst],
                ["crl", iPayPurchaseUnitsBody.crl],
                ["cbk", iPayPurchaseUnitsBody.cbk],

            ];

            // Build the request body string from the Postman request.data object
            var requestBody = "";
            var firstpass = true;
            for (var i = 0; i < params.length; i++) {
                if (!firstpass) {
                    requestBody += "&";
                }
                requestBody += params[i][0] + "=" + params[i][1];
                firstpass = false;
            }

            console.log("requestBody => " + requestBody);
            var hashstring = this.HMAC(ipayKeyString, requestBody);
            iPayPurchaseUnitsBody.hsh = hashstring;
            console.log("hashstring => " + iPayPurchaseUnitsBody.hsh);

            console.log("iPayPurchaseUnitsBody => " + JSON.stringify(iPayPurchaseUnitsBody));

            var bodyFormData = new FormData();

            Object.keys(iPayPurchaseUnitsBody).map((key, index) => (bodyFormData.append(key, iPayPurchaseUnitsBody[key])))


            console.log("submitting data to iPay => " + JSON.stringify(bodyFormData));

            Axios({
                method: "post",
                url: "https://payments.ipayafrica.com/v3/ke",
                data: bodyFormData,
                headers: {
                    "Content-Type": "multipart/form-data",
                    // "Access-Control-Allow-Origin": '*'
                },
            })
                .then(function (response) {
                    //handle success
                    console.log(JSON.stringify(response.data));

                    TenantService.prepareWebTransaction(this.state.clientService, this.state.prepareTransactionBody.units, iPayPurchaseUnitsBody.ttl, iPayPurchaseUnitsBody.inv).then(response1 => {

                        if (response1.data.status != "error") {
                            console.log(response.data.data)

                            //open the new window and  write your HTML to it
                            var myWindow = window.open("", "response", "resizable=yes");
                            myWindow.document.write(response.data);

                        } else {
                            confirmAlert({
                                title: 'Error',
                                message: response1.data.message,
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

                })
                .catch(function (response) {
                    //handle error
                    console.log(JSON.stringify(response));
                });

            // Axios.post("https://payments.ipayafrica.com/v3/ke", iPayPurchaseUnitsBody,
            // {
            // headers: {
            // "Access-Control-Allow-Origin": '*',
            // "Accept": "*/*",
            // "Host": "https://payments.ipayafrica.com",
            // "Origin": "http://localhost:3000",
            // 'Content-Type': `multipart/form-data; boundary=${form._boundary}`,
            // }
            // }).then(response => {
            // console.log(JSON.stringify(response.data));

            //open the new window and write your HTML to it
            // var myWindow = window.open("", "response", "resizable=yes");
            // myWindow.document.write(this.state.response.data);
            // myWindow.document.write(this.state.responseBody);
            // }).catch(error => {
            // console.log(JSON.stringify(error));

            // });
        }
    }

    HMAC(key, message) {
        return CryptoJS.SHA1(message);
    }

    handlePrepareTransaction() {
        const { prepareTransactionBody, paymentOrderId } = this.state;
        prepareTransactionBody.ipayCorrelator = paymentOrderId;
        prepareTransactionBody.clientService = this.state.sources.clientService.id;

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

        const { sources, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Transactions</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">
                                {sources.clientService.service == "SMS" &&
                                    <Button variant="primary" className="pull-right float-right" onClick={() => this.handleModalShowHide()}>
                                        Purchase {sources.clientService.service} Units
                                    </Button>
                                }
                                <br />
                                <br />

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>


                                <Modal show={this.state.showHide}>
                                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                                        <Modal.Title>Purchase {sources.clientService.service} Units</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form className="selectProductForm" data-plugin="parsley" onSubmit={this.handleSubmitPaymentTransaction} >
                                            <div
                                                className="col-6">

                                                <label>Phone (254..)</label>

                                                <input
                                                    type="text"
                                                    placeholder="2547..."
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='12'
                                                    data-parsley-maxlength='12'
                                                    onChange={this.handleChange}
                                                    name="tel"
                                                    id="tel" />

                                            </div>
                                            <div
                                                className="col-6">

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
                                                className="col-6">

                                                <label>Total Amount</label>

                                                <input
                                                    type="number" disabled value={this.state.iPayPurchaseUnitsBody.ttl}
                                                    placeholder="Minimum 10 units"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-min='10'
                                                    onChange={this.handleChange}
                                                    name="ttl"
                                                    id="ttl" />

                                            </div>
                                            <div
                                                className="col-6">

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
                                                    className="col-6">

                                                    <label>Email</label>

                                                    <input
                                                        type="email"
                                                        placeholder="100"
                                                        className="form-control"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}
                                                        name="eml"
                                                        id="eml" />

                                                </div>}
                                            <button className="btn-primary" type="submit">Purchase</button>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                                            Close
                                        </Button>

                                    </Modal.Footer>
                                </Modal>


                                <table
                                    className="table table-theme v-middle table-row"
                                    id="table"
                                    data-toolbar="#toolbar"
                                    data-search="true"
                                    data-search-align="left"
                                    data-show-columns="true"
                                    data-show-export="true"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Units</th>
                                            <th>Amount</th>
                                            <th>Date Purchased</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {sources.billingTransactions != "" &&
                                            sources.billingTransactions.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.id} >


                                                        <td>
                                                            <span className="text-muted">{mes.id}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.units}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.amount == 0 ? "FREE" : mes.amount}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{utils.formatDateString(mes.dateTimeCreated)}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.status}</span>
                                                        </td>

                                                    </tr>

                                                );

                                            })
                                        }

                                    </tbody>

                                </table>

                                {loading &&
                                    <Loader type="dots" />
                                }
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
