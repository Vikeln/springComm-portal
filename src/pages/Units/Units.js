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

export default class Units extends Component {

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
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

        this.fetchMyTransactions = this.fetchMyTransactions.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.purchase = this.purchase.bind(this);
        this.ipayPurchase = this.ipayPurchase.bind(this);

    }
    purchase(){

        
        // window.location.href="/dashboard/ipay-purchase-units/"+this.state.clientService
        window.location.href="/dashboard/purchase-units/"+this.state.clientService
    }

   ipayPurchase(){

        
        window.location.href="/dashboard/ipay-purchase-units/"+this.state.clientService
        // window.location.href="/dashboard/purchase-units/"+this.state.clientService
    }
    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        this.fetchMyTransactions();

    }

    componentDidUnMount() {

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

                            <h2 className="text-md mb-0">Transactions</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">
                            {sources.clientService.service == "SMS" &&
                            <>
                                    <Button variant="primary" className="pull-right float-right" onClick={() => this.purchase()}>
                                        Purchase {sources.clientService.service} Units via Mpesa
                                    </Button>
                                    <Button variant="primary" className="pull-right float-right" onClick={() => this.ipayPurchase()}>
                                        Purchase {sources.clientService.service} Units via iPay
                                    </Button></>
                                }
                                <br />
                                <br />

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>

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
