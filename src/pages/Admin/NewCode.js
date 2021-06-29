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

export default class NewCodes extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            sources: [],
            showHide: false,
            products: [],
            formData: {
                client: parseInt(authService.getCurrentClientId()),
            },
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);

    }

    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        $("#createSource").parsley();

    }

    componentDidUpdate() {
        $("#createSource").parsley();
    }


    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;

        let stateCopy = Object.assign({}, this.state);

        if (inputName === "providers") {
            var userGroups = [];

            for (var i = 0, l = options.length; i < l; i++) {

                if (options[i].selected) {
                    userGroups.push(options[i].value);
                }

            }
            stateCopy.formData[inputName] = userGroups;

        } else {
            stateCopy.formData[inputName] = inputValue;

        }
        this.setState(stateCopy);


    }

    handleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();


        if ($("#createSource").parsley().isValid()) {

            this.setState({
                loading: true,
            });
            TenantService.applyNewUSSDCodes(formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Success!',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => window.location.href = "/dashboard/my-codes"
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

                            <h2 className="text-md mb-0">New USSD Code</h2>

                        </div>


                        <div className="padding">



                            <div className="view viewall">

                                <form className="createSource" id="createSource" data-plugin="parsley" onSubmit={this.handleSubmission}>
                                    <div
                                        className="col-6">

                                        <label>Desired USSD Code</label>

                                        <input
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            data-parsley-required="true"
                                            data-parsley-minlength='3'
                                            data-parsley-maxlength='8'
                                            onChange={this.handleChange}
                                            name="code"
                                            id="code" />

                                    </div>
                                    <div
                                        className="col-6">

                                        <label>Callback Url</label>

                                        <input
                                            type="text"
                                            placeholder=""
                                            className="form-control"
                                            data-parsley-required="true"
                                            data-parsley-minlength='5'
                                            onChange={this.handleChange}
                                            name="callbackUrl"
                                            id="callbackUrl" />

                                    </div>
                                    
                                    <div className="col-6">

                                        <label>Billing</label>
                                        <select className="form-control"
                                            onChange={this.handleChange}
                                            name="billingType"
                                            id="billingType">
                                            <option></option>
                                            <option value="POSTPAID">POSTPAID</option>
                                            <option value="PREPAID">PREPAID</option>
                                        </select>

                                    </div>
                                    <div
                                        className="col-6">

                                        <label>Provider <small>Hold Ctrl to select multiple</small></label>

                                        <select
                                            type="text"
                                            name="providers"
                                            id="providers"
                                            className="form-control" multiple
                                            data-parsley-required="true"
                                            onChange={this.handleChange} >
                                            {/* <option></option> */}
                                            <option value="SAFARICOM">SAFARICOM</option>
                                            <option value="AIRTEL">AIRTEL</option>
                                            <option></option>
                                        </select>
                                    </div>
                                    <button type="submit" className="btn btn-primary">Apply</button>
                                </form>

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
