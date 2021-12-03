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

export default class Pricing extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            sources: [],
            showHide: false,
            products: [],
            formData: [{
                lower: null,
                upper: null,
                value: null
            }],
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
        this.removeRange = this.removeRange.bind(this);
        this.addNewRange = this.addNewRange.bind(this);
        this.handleReviseCosts = this.handleReviseCosts.bind(this);

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
    removeRange(el, index) {

        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData.splice(index, 1);

        this.setState(stateCopy);
    }

    async fetchMyTransactions() {

        TenantService.getUnitCosts().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
                });
                $(".table").bootstrapTable();

            } else {
                confirmAlert({
                    // title: 'Error',
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
                // title: 'Error occurred',
                message: error.message,
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });
        });

    }
    addNewRange() {

        let stateCopy = Object.assign({}, this.state);
        let newArr = {
            lower: null,
            upper: null,
            value: null
        };
        stateCopy.formData.push(newArr);

        this.setState(stateCopy);
    }

    handleReviseCosts() {

        let stateCopy = Object.assign({}, this.state);

        let newArr = [{
            lower: null,
            upper: null,
            value: null
        }];
        if (this.state.sources.length > 0)
            stateCopy.formData = this.state.sources;
        else
            stateCopy.formData = newArr;
        this.setState(stateCopy);
        this.handleModalShowHide();
    }
    handleChange(el, index) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[index][inputName] = inputValue;

        this.setState(stateCopy);


    }

    handleSubmission() {

        const { formData } = this.state;

        // event.preventDefault();
        if (formData.length < 1) {
            alert("Please add costs first");

        } else {

            this.setState({
                loading: true,
            });

            this.handleModalShowHide();
            // if ($(".createSource").parsley().isValid()) {
            TenantService.reviseUnitCosts(formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        message: 'Success!',
                        // message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => window.location.reload()
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        // title: 'Error making request',
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

                            <h2 className="text-md mb-0">Default SMS Unit Pricing</h2>

                        </div>


                        <div className="padding-left">

                        <Button variant="primary" className="pull-right float-right" onClick={() => this.handleReviseCosts()}>
                                    Revise Pricing
                                </Button>
                            </div>
                        <div className="padding">



                            <div className="view viewall">
                               

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>


                                <Modal show={this.state.showHide}>
                                    <Modal.Header closeButton onClick={() => this.handleModalShowHide()}>
                                        <Modal.Title>Revise SMS Units Pricing</Modal.Title>
                                    </Modal.Header>
                                    <Modal.Body>
                                        <form className="selectProductForm" >

                                            <Button variant="secondary" onClick={() => this.addNewRange()}>
                                                Add New Range
                                            </Button>
                                            {this.state.formData != "" && this.state.formData.map((cost, index) => (
                                                <div className="row">
                                                    <div
                                                        className="col-3">

                                                        <label>Service</label>
                                                        <select

                                                            className="form-control"
                                                            value={cost.service}
                                                            data-parsley-required="true"
                                                            data-parsley-minlength='12'
                                                            data-parsley-maxlength='12'
                                                            onChange={(e) => this.handleChange(e, index)}
                                                            name="service"
                                                            id="service">
                                                            <option></option>
                                                            <option value="SMS">SMS</option>
                                                            <option value="USSD">USSD</option>

                                                        </select>

                                                    </div>
                                                    <div
                                                        className="col-3">

                                                        <label>Min</label>

                                                        <input
                                                            type="number"
                                                            placeholder="2547..."
                                                            className="form-control"
                                                            value={cost.lower}
                                                            data-parsley-required="true"
                                                            data-parsley-minlength='12'
                                                            data-parsley-maxlength='12'
                                                            onChange={(e) => this.handleChange(e, index)}
                                                            name="lower"
                                                            id="lower" />

                                                    </div>
                                                    <div
                                                        className="col-3">

                                                        <label>Max</label>

                                                        <input
                                                            type="number"
                                                            placeholder="2547..."
                                                            className="form-control"
                                                            value={cost.upper}
                                                            data-parsley-required="true"
                                                            data-parsley-minlength='12'
                                                            data-parsley-maxlength='12'
                                                            onChange={(e) => this.handleChange(e, index)}
                                                            name="upper"
                                                            id="upper" />

                                                    </div>
                                                    <div
                                                        className="col-3">

                                                        <label>Cost per Unit</label>

                                                        <input
                                                            type="text"
                                                            placeholder="2547..."
                                                            className="form-control"
                                                            value={cost.value}
                                                            data-parsley-required="true"
                                                            data-parsley-minlength='12'
                                                            data-parsley-maxlength='12'
                                                            onChange={(e) => this.handleChange(e, index)}
                                                            name="value"
                                                            id="value" />

                                                    </div>
                                                    <div
                                                        className="col-3">

                                                        <Button variant="secondary" onClick={(e) => this.removeRange(e, index)}>
                                                            X
                                                        </Button>
                                                    </div>
                                                </div>

                                            ))


                                            }
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
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>#</th>
                                            <th>Service</th>
                                            <th>Range</th>
                                            <th>Cost Per Unit</th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {sources != "" &&
                                            sources.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.id} >


                                                        <td>
                                                            <span className="text-muted">{index + 1}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.service}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.lower + " - " + mes.upper}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.value}</span>
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
