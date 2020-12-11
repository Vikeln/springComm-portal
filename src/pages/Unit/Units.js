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

export default class Units extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            sources: [],
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
        this.fetchMyTransactions = this.fetchMyTransactions.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.handleModalShowHide = this.handleModalShowHide.bind(this);

    }

    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        this.fetchMyTransactions();

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

    async fetchMyTransactions() {

        TenantService.getAllTransactions().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
                });


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

    handleSubmission() {

        const { formData } = this.state;

        // event.preventDefault();
        if (formData.phone == undefined || formData.units == undefined) {
            alert("Please fill the form first");

        } else if (formData.phone.length < 12) {
            alert("Phone number must be 12 characters (2547..)");

        } else if (formData.units< 10) {
            alert("Can't purchase less than 10 units");

        } else {

            this.setState({
                loading: true,
            });

            this.handleModalShowHide();
            // if ($(".createSource").parsley().isValid()) {
            TenantService.purchaseUnits(formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Success!',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK'
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        title: 'Error making purchase request',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'Ok',
                            }
                        ]
                    });
                }

            }).catch(error => {
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

            // }
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



                            <div className="view viewall">   <Button variant="primary" className="pull-right float-right" onClick={() => this.handleModalShowHide()}>
                                Purchase Units
                    </Button>

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>


                                <Modal show={this.state.showHide}>
                                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                                        <Modal.Title>Purchase SMS Units</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form className="selectProductForm" >
                                            <div
                                                className="col-6">

                                                <label>Phone</label>

                                                <input
                                                    type="text"
                                                    placeholder="2547..."
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='12'
                                                    data-parsley-maxlength='12'
                                                    onChange={this.handleChange}
                                                    name="phone"
                                                    id="phone" />

                                            </div>
                                            <div
                                                className="col-6">

                                                <label>SMS Units</label>

                                                <input
                                                    type="text"
                                                    placeholder="100"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='12'
                                                    data-parsley-maxlength='12'
                                                    onChange={this.handleChange}
                                                    name="units"
                                                    id="units" />

                                            </div>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                                            Close
                    </Button>
                                        <Button variant="primary" onClick={() => this.handleSubmission()}>
                                            Purchase
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
                                    data-detail-view="true"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>Transaction Reference</th>
                                            <th>Units</th>
                                            <th>Date Created</th>
                                            <th>Status</th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {sources != "" &&
                                            sources.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.id} >


                                                        <td>
                                                            <span className="text-muted">{mes.id}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.transaction_reference}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.units_total}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.created_at}</span>
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
                                    <Loader type="circle" />
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
