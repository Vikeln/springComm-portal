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

export default class Countries extends Component {

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

        TenantService.getAllCountries().then(response => {

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
        if (formData.countryCode == undefined || formData.countryName == undefined) {
            alert("Please fill the form first");

        }else {

            this.setState({
                loading: true,
            });

            this.handleModalShowHide();
            let values=[];
            values.push(formData);
            // if ($(".createSource").parsley().isValid()) {
            TenantService.addCountries(values).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Success!',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick:()=>window.location.reload()
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        title: 'Error',
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

            this.setState({
                loading: false,
            });
        }
    }


    render() {

        const { sources, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">System Countries</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">   <Button variant="primary" className="pull-right float-right" onClick={() => this.handleModalShowHide()}>
                                Add New
                    </Button>

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>


                                <Modal show={this.state.showHide}>
                                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                                        <Modal.Title>New Country</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form className="selectProductForm" >
                                            <div
                                                className="col-6">

                                                <label>County Code</label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='2'
                                                    data-parsley-maxlength='5'
                                                    onChange={this.handleChange}
                                                    name="countryCode"
                                                    id="countryCode" />

                                            </div>
                                            <div
                                                className="col-6">

                                                <label>County Name</label>

                                                <input
                                                    type="text"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength='3'
                                                    data-parsley-maxlength='50'
                                                    onChange={this.handleChange}
                                                    name="countryName"
                                                    id="countryName" />

                                            </div>
                                        </form>
                                    </Modal.Body>
                                    <Modal.Footer>
                                        <Button variant="secondary" onClick={() => this.handleModalShowHide()}>
                                            Close
                    </Button>
                                        <Button variant="primary" onClick={() => this.handleSubmission()}>
                                            Submit
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
                                            <th>#</th>
                                            <th>Code</th>
                                            <th>Name</th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {sources != "" &&
                                            sources.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.countryCode} >


                                                        <td>
                                                            <span className="text-muted">{index+1}</span>
                                                        </td>
                                                        <td>
                                                            <span className="text-muted">{mes.countryCode}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.countryName}</span>
                                                        </td>

                                                    </tr>

                                                );

                                            })
                                        }

                                    </tbody>

                                </table>

                                {loading &&
                                    <Loader type="dots"/>
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
