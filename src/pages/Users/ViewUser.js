/* global $ */

import React, { Component } from 'react';
import { confirmAlert } from 'react-confirm-alert';
import UserService from '../../services/user.service';
import AuthService from '../../services/auth.service';

import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';


export default class ViewUser extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            userId: this.props.match.params.id,
            formData: {

            },
            groupNames: [],
            roles: [],
            errors: "",
            rolesReceived: "",
            groupReceived: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: ""

        }

        this.enenableUser = this.enenableUser.bind(this);

    }

    async componentDidMount() {

        const { userId } = this.state;

        this.loadSingleUser(userId);
        this.getGroupValues();



    }

    componentDidUnMount() {

    }
    enenableUser(id){
        
        confirmAlert({
            title: "Are you sure you want to unlock this user's account? ",
            message: 'Please proceed.',
            buttons: [
              {
                label: 'Yes',
                onClick: () => {
                    UserService.unlockUserAccount(id).then(response => {
  
  
  
                        if (response.data.status == "success") {
  
                            this.setState({
  
                                emailSuccessful: response.data.message
  
                            });
  
                            confirmAlert({
                              title: 'Succesfully unlocked the account!',
                              message: 'Please proceed.',
                              buttons: [
                                {
                                  label: 'Yes',
                                  onClick: () => window.location.reload()
                                }
                              ]
                            });
  
                        }else if(response.data.status == "error"){
  
                            confirmAlert({
                              title: 'Error Submitting Data for '+id,
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
                }
              }
            ]
          });

    }

    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let userGroups = [];
        let options = el.target.options;

        let stateCopy = Object.assign({}, this.state);

        if (inputName == "role") {

            stateCopy.formData[inputName] = parseInt(inputValue);

        } else if (inputName == "userGroups") {

            for (var i = 0, l = options.length; i < l; i++) {

                if (options[i].selected) {
                    userGroups.push(parseInt(options[i].value));
                }

            }

            stateCopy.formData[inputName] = userGroups;


        } else {

            stateCopy.formData[inputName] = inputValue;

        }



        this.setState(stateCopy);

    }

    getGroupValues() {

        // UserService.getUserGroups().then(response => {


        //     if (response.data.status != "error") {

        //         this.setState({
        //             groupNames: response.data.data,
        //             groupReceived: "yes"
        //         });

        //     } else {
        //         confirmAlert({
        //             title: 'Error occurred',
        //             message: response.data.message,
        //             buttons: [
        //                 {
        //                     label: 'ok',
        //                 }
        //             ]
        //         });
        //     }


        // }).catch(error => {
        //     confirmAlert({
        //         title: 'Error occurred',
        //         message: error.message,
        //         buttons: [
        //             {
        //                 label: 'ok',
        //             }
        //         ]
        //     });

        // });

        UserService.getUserRoles().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    roles: response.data.data,
                    rolesReceived: "yes"
                });

            } else {
                confirmAlert({
                    title: 'Error occurred',
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

    handleUserSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createUser").parsley().isValid()) {



            UserService.createUser(formData).then(response => {



                if (response) {

                    this.setState({
                        networkError: false
                    });

                }

                if (response.data.status == "success") {

                    this.setState({
                        successfulSubmission: true,
                        submissionMessage: response.data.message
                    });

                    setTimeout(function () {
                        window.location.href = "/dashboard/users"
                    }, 4000);

                }

            }).catch(error => {

                this.setState({
                    networkError: true,

                });
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



    }

    loadSingleUser(userId) {

        UserService.getUser(userId).then(response => {

            if (response.data.status != "error") {
                this.setState({
                    formData: response.data.data
                });
            } else {
                confirmAlert({
                    title: 'Error occurred',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }

        })
            .catch(error => {
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

    render() {

        const { roles, groupNames, rolesReceived, groupReceived, successfulSubmission, networkError, submissionMessage, formData } = this.state;

        const { otherName, email, phoneNumber, userName } = this.state.formData;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <h2></h2>
                        {
                            formData != "" ?

                                <form

                                    className="createUser"
                                    onSubmit={this.handleUserSubmission}>
                                    {/* <div
                                        className="row">
                                            {!formData.accountBlocked &&
                                                                <button
                                                                    className="dropdown-item enableUser"
                                                                    data-id={formData.id}
                                                                    data-username={formData.firstName}
                                                                    onClick={() => {
                                                                        this.enenableUser(formData.id)
                                                                    }}
                                                                >Unlock Account </button>}

                                        </div> */}
                                        <div
                                        className="row">
                                    
                                        <div
                                            className="col-4">

                                            <label>First Name</label>

                                            <input
                                                type="text"
                                                name="firstName"
                                                id="firstName"
                                                className="form-control"
                                                data-parsley-required="true"
                                                value={this.state.formData.firstName || ""}
                                                readOnly />
                                        </div>

                                        <div
                                            className="col-4">

                                            <label>Last Name</label>

                                            <input
                                                type="text"
                                                name="lastName"
                                                id="lastName"
                                                className="form-control"
                                                data-parsley-required="true"
                                                value={this.state.formData.lastName || ""}
                                                readOnly />
                                        </div>

                                        <div
                                            className="col-4">

                                            <label>Other Name</label>

                                            <input
                                                type="text"
                                                name="otherName"
                                                id="otherName"
                                                className="form-control"
                                                data-parsley-required="true"
                                                value={otherName || ""}
                                                readOnly />
                                        </div>

                                        <div
                                            className="col-12">

                                            <label>User Name</label>

                                            <input
                                                type="text"
                                                name="userName"
                                                id="userName"
                                                className="form-control"
                                                data-parsley-required="true"
                                                value={userName || ""}
                                                readOnly />
                                        </div>

                                        <div className="col-4">

                                            <label>Phone Number</label>

                                            <input
                                                type="number"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                data-parsley-required="true"
                                                value={phoneNumber || ""}
                                                readOnly />
                                        </div>

                                        <div className="col-4">

                                            <label>Email</label>

                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                data-parsley-required="true"
                                                value={email || ""}
                                                readOnly />
                                        </div>

                                        {groupReceived != "" &&

                                            <>
                                                <div className="col-12">

                                                    <label>User Groups <em>*Use ctr on Windows / Command on Mac to select multiple groups</em></label>

                                                    <select
                                                        className="form-control"
                                                        name="userGroups"
                                                        id="userGroups"
                                                        multiple
                                                        data-parsley-required="true"
                                                        readOnly>
                                                        <option value=""></option>
                                                        {groupNames != "" &&

                                                            groupNames.map((group, index) => (
                                                                <option key={group.id}

                                                                    value={group.id}>{group.name}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>
                                            </>
                                        }

                                        {rolesReceived != "" &&
                                            <div className="col-12">

                                                <label>Role</label>

                                                <select
                                                    className="form-control"
                                                    name="role"
                                                    id="role"
                                                    value={formData.role}
                                                    data-parsley-required="true"
                                                    readOnly>
                                                    <option value=""></option>
                                                    {roles != "" &&

                                                        roles.map((role, index) => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))
                                                    }
                                                </select>

                                            </div>
                                        }



                                    </div>

                                    <div className="row">

                                        <div className="col-12">

                                            <Link to="/dashboard/users" className="btn-primary">Back to users</Link>



                                        </div>


                                    </div>

                                </form>

                                :

                                <h2>Error Fetching User Data</h2>
                        }


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
            </>

        )

    }

}
