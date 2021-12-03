/* global $ */

import React, { Component } from 'react';

import AuthService from '../../services/auth.service';
import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';


export default class ResetPassword extends Component {

    constructor(props) {

        super(props);

        this.state = {

            formData: {
                userID: this.props.match.params.userID,
                password: "",
                verifyEmail: false
            },
            networkError: false,
            networkErrorMessage: "",
            successfulSubmission: false,
            submissionMessage: "",
            loading: false

        }

        this.handleUserSubmission = this.handleUserSubmission.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount() {

        if (this.state.formData.userID != "" || this.state.formData.userID != null) {

            this.setState({ formData: { ...this.state.formData, verifyEmail: true } });

        }

        $(".resetPassword").parsley();

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

    handleUserSubmission(event) {




        const { formData } = this.state;

        event.preventDefault();

        if ($(".resetPassword").parsley().isValid()) {

            this.setState({
                loading: true,
            });

            $("form button").hide();

            AuthService.resetPassword(formData).then(response => {

                console.log(response);

                if (response) {

                    this.setState({
                        networkError: false,
                        loading: false,
                        networkErrorMessage: "",
                    });

                    $("form button").show();

                }

                if (response.data.status == "success") {

                    this.setState({
                        successfulSubmission: true,
                        submissionMessage: response.data.message,
                        loading: false,
                        networkError: false,
                        networkErrorMessage: "",
                    });

                    setTimeout(function () {
                        window.location.href = "/auth/login"
                    }, 3000);

                } else {

                    this.setState({
                        successfulSubmission: false,
                        submissionMessage: "",
                        loading: false,
                        networkError: true,
                        networkErrorMessage: response.data.message,
                    });

                    $("form button").show();

                }

            }).catch(error => {

                console.log(error);
                this.setState({
                    networkError: true,
                    networkErrorMessage: error.message,
                    loading: false

                });

                $("form button").show();

            });

        }



    }

    render() {

        const { successfulSubmission, networkError, submissionMessage, loading, networkErrorMessage } = this.state;

        return (

            <>



                <div className="authenticationBackground auth-wrapper">

                    <div className="auth-inner" >
                        
                        <div className="formcontainer">
                        <img className="avatar w-100" src="../logo.png" alt="SPRING" />  

                            <p>
                                <small className="text-muted">Enter new password to reset your account</small>
                            </p>

                            {successfulSubmission &&
                                <Notification
                                    type="success"
                                    description={submissionMessage}
                                />
                            }

                            {networkError &&
                                <Notification
                                    type="network"
                                    description={networkErrorMessage}
                                />
                            }

                            <form
                                className="resetPassword" role="form"
                                onSubmit={this.handleUserSubmission}>

                                <div className="form-group">

                                    <label>Password</label>
                                    <input
                                        type="password"
                                        name="password"
                                        id="password"
                                        className="form-control"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}
                                        data-parsley-minlength="8" placeholder="Password" />

                                </div>

                                <div className="form-group">
                                    <label>Confirm Password</label>
                                    <input
                                        type="password" className="form-control"
                                        data-parsley-equalto="#password"
                                        name="password2"
                                        id="password2"
                                        data-parsley-required="true"
                                        data-parsley-minlength="8" placeholder="Confirm Password" />

                                </div>




                                <button
                                    type="submit" className="btn btn-primary mb-4"
                                    type="submit">Reset Password</button>

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
