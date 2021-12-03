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
import authService from '../../services/auth.service';

export default class Balances extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            codes: [],
            showHide: false,
            products: [],
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

        this.handleChange = this.handleChange.bind(this);
        this.fetchMyCodes = this.fetchMyCodes.bind(this);
        this.handleModalShowHide = this.handleModalShowHide.bind(this);

    }

    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        this.fetchMyCodes();

    }

    componentDidUnMount() {

    }
    handleModalShowHide() {
        if (this.state.showHide) {

            this.setState({
                subscriptionProduct: undefined,
            });
        }
        this.setState({ showHide: !this.state.showHide })
    }

    async fetchMyCodes() {

        TenantService.getClientServices(authService.getCurrentClientId()).then(response => {

            if (response.data.successMessage != "error") {


                this.setState({
                    codes: response.data.data != null ? response.data.data : [],
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



    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);


    }


    render() {

        const { codes, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">My Service Balances</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">

                                <table
                                    className="table table-theme v-middle table-row"
                                    id="table"
                                    data-toolbar="#toolbar"
                                    data-search="true"
                                    data-search-align="left"
                                    data-show-columns="true"
                                    data-show-export="true"
                                    data-detail-view="false"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            
                                            <th>#</th>
                                            <th>Service Type</th>
                                            <th>Billing Type</th>
                                            <th>Status</th>
                                            <th>Balance</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {codes != "" &&
                                            codes.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.id} >



                                                        <td>
                                                            <span className="text-muted">{index+1}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{(mes.code !=null ? (mes.code.parent != null ? "Shared ": "") :"") + mes.service.service + (mes.service.service == "USSD" ? (" Code : " + mes.code.value) : "")}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.service.billingType}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.service.status}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.service.runningBalance} units</span>
                                                        </td>

                                                        <td>
                                                            <a className="link" href={"/portal/transactions/" + mes.service.id} >Transactions</a>
                                                            {/* <Link className="link" href={"/portal/transactions/" + mes.service.id} className="dropdown-item Link">Transactions</Link> */}
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
