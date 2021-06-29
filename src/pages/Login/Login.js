/* global $ */

import React, { Component } from 'react';
import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

import jwt_decode from "jwt-decode";
import AuthService from '../../services/auth.service';
import tenantService from '../../services/tenant.service';
import authService from '../../services/auth.service';
import { axiosInstance, clientBaseUrl } from '../../API';

export default class Login extends Component {

    constructor(props) {

        super(props);

        this.state = {

            email: '',
            password: '',
            emailError: '',
            passwordError: '',
            credentialsError: '',
            networkError: "",

        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

    }

    componentDidMount() {
        $(".login").parsley();
    }

    componentDidUnMount() {

    }

    handleEmailChange(event) {

        this.setState({
            email: event.target.value,
            emailError: '',
        });

    }

    handlePasswordChange(event) {

        this.setState({
            password: event.target.value,
            passwordError: '',
        });


    }

    handleSubmit(event) {

        const { email, password } = this.state;

        if (email == "" || email == null) {

            this.setState({
                emailError: "Please input a valid email"
            });

        } else if (password == "" || password == null) {

            this.setState({
                passwordError: "Please input a password"
            });

        } else {

            this.setState({
                loading: true,
            });

            $("form button").hide();
            // console.log(AuthService.login(email,password)) ;
            var loggedInSuccess = false;

            AuthService.login(email, password).then(response => {

                console.log(response);

                if (response) {

                    this.setState({
                        networkError: false,
                        loading: false,
                    });

                    $("form button").show();

                }
                console.log("response.data.data " + JSON.stringify(response.data))

                if (response.data.data != undefined && response.data.data.accessToken != undefined) {

                    var data = jwt_decode(response.data.data.accessToken);

                    console.log(data);

                    localStorage.setItem("user", data.username);
                    localStorage.setItem("client", data.user.client);
                    localStorage.setItem("email", data.user.accountOwner.emailAddress);
                    localStorage.setItem("name", data.user.accountOwner.firstName + " " + data.user.accountOwner.lastName);
                    localStorage.setItem("loginTime", Math.floor(response.data.data.expiry));
                    localStorage.setItem("data", JSON.stringify(data));
                    localStorage.setItem("roles", JSON.stringify(data.user.account.permissions.map(perm => perm.name)));
                    localStorage.setItem("accessToken", response.data.data.accessToken);
                    // if(authService.getCurrentClientId() == undefined){


                    // }             
                    loggedInSuccess = true;

                    axiosInstance.get(clientBaseUrl + "clients/view/"+data.user.client,{
                        headers: {
                            'Content-Type': 'application/json',
                            "access-control-allow-origin" : "*",
                            "Authorization" : "Bearer " + response.data.data.accessToken,
                        }
                    }).then(response => {
                    console.log("viewTenant data " + JSON.stringify(response.data))

                    localStorage.setItem("clientId", response.data.data.id);
                    localStorage.setItem("clientName", response.data.data.name);
                    window.location.reload();
                })
                    .catch((error) => {

                        console.log(error);

                        this.setState({
                            networkError: true,
                            networkErrorMessage: error.message,
                            loading: false,
                        });

                        // $("form button").show();

                    })


                } else if (response.data.data != undefined && response.data.data.message != undefined) {

                    this.setState({
                        credentialsError: response.data.data.message,
                        loading: false,
                    });

                    $("form button").show();

                } else {

                    this.setState({
                        credentialsError: response.data.message,
                        loading: false,
                    });

                    $("form button").show();

                }


            }).catch(error => {

                console.log(error);

                this.setState({
                    networkError: true,
                    networkErrorMessage: error.message,
                    loading: false,
                });

                $("form button").show();

            });


            this.setState({
                emailError: "",
                passwordError: "",
                networkError: "",
                credentialsError: ""

            });
        }

        event.preventDefault();

    }


    render() {

        const { credentialsError, networkError, loading, networkErrorMessage } = this.state;

        return (

            <>
                        <div className="authenticationBackground auth-wrapper">

                            <div className="auth-inner" >
                            <div className="row authenticationBackgroundInner">
                                
                                <img src="/logo2.png" />
                            </div>

                                <div className="formcontainer">

                                    <p>
                                        <small className="text-muted">Login to manage your account</small>
                                    </p>

                                    <form className="login" role="form" onSubmit={this.handleSubmit}>
                                        {
                                            credentialsError != "" &&

                                            <Notification
                                                type="error"
                                                description={credentialsError} />
                                        }

                                        {
                                            networkError != "" &&

                                            <Notification
                                                type="network"
                                                description={networkErrorMessage} />
                                        }
                                        <div className="form-group">

                                            <label>Username</label>
                                            <input
                                                type="text" className="form-control"
                                                placeholder="Enter Username"
                                                data-parsley-required="true"
                                                value={this.state.email}
                                                onChange={this.handleEmailChange} />

                                        </div>

                                        <div className="form-group">

                                            <label>Password</label>

                                            <input
                                                type="password" className="form-control" placeholder="Password"
                                                data-parsley-required="true"
                                                minLength="4"
                                                value={this.state.password}
                                                onChange={this.handlePasswordChange} />



                                            <div className="my-3">
                                                <span className=" text-left"><Link to="/auth/forgotpassword" className="text-muted">Forgot password?</Link> </span> <br></br>
                                                <span className=" text-right">Don't have an account? <Link to="/auth/register" className="text-muted"> Register</Link> </span>


                                            </div>


                                        </div>


                                        <button type="submit" className="btn btn-primary mb-4">Sign in</button>

                                    </form>

                                    {loading &&
                                        <Loader type="dots" />
                                    }
                                </div>
                            </div>

                        </div>

            </>

        )

    }

}
