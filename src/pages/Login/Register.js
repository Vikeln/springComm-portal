/* global $ */

import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

import TenantService from '../../services/tenant.service';

export default class Register extends Component {

    constructor(props) {

        super(props);

        this.state = {

            email: '',
            formData: {
                customerId: null,
                customerRole: "MOBI_CONNECT_TENANT",
                attributeValues: null,
                country: "Kenya",
                customerType: "BUSINESS",
                enabled: true,
                createAdminUser: true,
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
        console.log(JSON.stringify(formData));
        TenantService.createTenant(formData).then(response => {
            console.log(response);

            if (response) {

                this.setState({
                    networkError: false,
                    loading: false,
                });

                $("form button").show();

            }
            if (response.data.status != "error") {
                this.setState({
                    credentialsError: "Your account has been setup successfully! We have sent you a link on your email to verufy your data.",
                    loading: false,
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

                    <div className="page-container" id="page-container">

                        <div className="row">

                            <div className="col-md-6  r-l authenticationBackground">

                                <div className="formTitle">
                                    <article>
                                        <h1>MobiConnect</h1>
                                    </article>
                                </div>

                            </div>

                            <div className="col-md-6 container" id="content-body">
                                <br></br>

                                <div className="formcontainer">

                                    <h5>Create MobiConnect Account</h5>
                                    <p>
                                        <small className="text-muted">Create an account to access all our features</small>
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
                                                    name="otherName"
                                                    id="otherName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
                                            <div className="col-4">

                                                <label>Document Type</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="documentType"
                                                    name="documentType">
                                                    <option></option>
                                                    <option value="NATIONAL_ID">NATIONAL_ID</option>


                                                </select>

                                            </div>
                                            <div className="col-4">

                                                <label>Document Number</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter documentNumber"
                                                    name="documentNumber"
                                                    id="documentNumber"
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

                                                <label>Account Username</label>
                                                <input
                                                    type="text" className="form-control"
                                                    placeholder="Enter Username"
                                                    name="userName"
                                                    id="userName"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />

                                            </div>
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
