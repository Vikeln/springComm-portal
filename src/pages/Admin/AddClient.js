/* global $ */

import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

import TenantService from '../../services/tenant.service';

export default class AddClient extends Component {

    constructor(props) {

        super(props);

        this.state = {

            email: '',
            formData: {
                "clientType": undefined,
                "countryCode": "KE",
                "createSMSService": true,
                "email": undefined,
                "firstName": undefined,
                "lastName": undefined,
                "middleName": undefined,
                "name": undefined,
                "phoneNumber": undefined,
                "physicalAddress": undefined,
                "smsserviceBillingType": "PREPAID",
                "state": undefined,
                "status": true,
                "userName": undefined,
                "createAdminUser": true,
                "createSMSService": false,
            },
            emailError: '',
            passwordError: '',
            credentialsError: '',
            networkError: "",

        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {
        $(".login").parsley();
    }

    componentDidUnMount() {

    }


    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        if  (inputName == "createSMSService")
            stateCopy.formData[inputName] = inputValue === "true" ? true:false;
        else
            stateCopy.formData[inputName] = inputValue;
        this.setState(stateCopy);
    }



    handleSubmit(event) {

        const { formData } = this.state;

        this.setState({
            loading: true,
        });

        $("form button").hide();
        // console.log(AuthService.login(email,password)) ;


        this.setState({
            emailError: "",
            passwordError: "",
            networkError: "",
            credentialsError: ""

        });

        event.preventDefault();
        //submit here


        if (formData.clientType === "INDIVIDUAL")
            formData.name = formData.firstName + " " + formData.lastName;

        console.log(JSON.stringify(formData));
        TenantService.createClients(formData).then(response => {
            console.log(response);

            if (response) {

                this.setState({
                    networkError: false,
                    loading: false,
                });

                // $("form button").show();

            }
            if (response.data.status != "error") {
                this.setState({

                    loading: false,
                });

                confirmAlert({
                    title: 'Success!',
                    message: "Client account has been setup successfully! We have sent you a link to the email email to verify the data.",
                    buttons: [
                        {
                            label: 'OK',
                            onClick: () => window.location.href = "/dashboard/admin/clients"
                        }
                    ]
                });

            } else {
                this.setState({
                    networkError: response.data.data.message,
                    loading: false,
                });

                $("form button").show();
            }

        }).catch(error => {

        });

    }


    render() {

        const { credentialsError, networkError, loading, networkErrorMessage } = this.state;

        return (

            <>

                {/* Authentication Screen */}
                <div id="" className="authentication ">

                    <div className="page-container padding card" id="page-container">

                        <div className="row">

                            <div className="col-12" id="content-body">
                                <br></br>

                                <div className="formcontainer">

                                    <h5>Create New Client</h5>
                                    <p>
                                        <small className="text-muted">Setup a new Client</small>
                                    </p>

                                    <form className="" role="form" onSubmit={this.handleSubmit}>
                                        {
                                            credentialsError != "" &&

                                            <Notification
                                                type="success"
                                                description={credentialsError} />
                                        }


                                        {
                                            networkError != "" &&

                                            <Notification
                                                type="network"
                                                description={networkErrorMessage} />
                                        }
                                        <div className="row">

                                            <div className="col-6">

                                                <label>Account Type</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="clientType"
                                                    name="clientType">
                                                    <option></option>
                                                    <option value="CORPORATE">CORPORATE</option>
                                                    <option value="INDIVIDUAL">INDIVIDUAL</option>


                                                </select>

                                            </div>


                                            {this.state.formData.clientType === "CORPORATE" ?
                                                <div className="col-6">

                                                    <label>Corporate Firm Name</label>
                                                    <input
                                                        type="text" className="form-control"
                                                        placeholder="Enter name"
                                                        name="name"
                                                        id="name"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange} />

                                                </div> :
                                                <div className="col-6">


                                                </div>}
                                            <div className="col-4">

                                                <label>FirstName</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter FirstName"
                                                    name="firstName"
                                                    id="firstName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>LastName</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter LastName"
                                                    name="lastName"
                                                    id="lastName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>OtherName</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter OtherName"
                                                    name="middleName"
                                                    id="middleName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>

                                            <div className="col-4">

                                                <label>Account Username</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter Username"
                                                    name="userName"
                                                    id="userName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>

                                            <div className="col-4">

                                                <label>Email</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter email"
                                                    name="email"
                                                    id="email"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>Phone Number</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter phoneNumber"
                                                    name="phoneNumber"
                                                    id="phoneNumber"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>Physical Address</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter physicalAddress"
                                                    name="physicalAddress"
                                                    id="physicalAddress"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>State</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter state"
                                                    name="state"
                                                    id="state"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>Auto Create SMS Service?</label>
                                               <select className="form-control"
                                                    onChange={this.handleChange} name="createSMSService" id="createSMSService">
                                                   <option></option>
                                                   <option value="true">True</option>
                                                   <option value="false">False</option>
                                               </select>

                                            </div>
                                           {this.state.formData.createSMSService &&
                                            <div className="col-4">

                                                <label>SMS Billing</label>
                                               <select className="form-control"
                                                    onChange={this.handleChange} name="smsserviceBillingType" id="smsserviceBillingType">
                                                   <option></option>
                                                   <option value="POSTPAID">POSTPAID</option>
                                                   <option value="PREPAID">PREPAID</option>
                                               </select>

                                            </div>

                                            }

                                        </div>


                                        <button type="submit" className="btn btn-primary mb-4">Create Account</button>

                                    </form>

                                    {loading &&
                                        <Loader type="dots" />
                                    }
                                </div>
                            </div>

                        </div>

                    </div>
                </div>
                {/* End Authentication Screen*/}

            </>

        )

    }

}
