/* global $ */

import React, { Component } from 'react';

import UserService from '../../services/user.service';
import Notification from '../../components/notifications/Notifications';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';


export default class EditUser extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            userId: this.props.match.params.id,
            formData: {
                userPermissions: []

            },
            groupNames: [],
            roles: [],
            permissions: [],
            errors: "",
            rolesReceived: "",
            groupReceived: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,


        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserSubmission = this.handleUserSubmission.bind(this);
        this.loadSingleUser = this.loadSingleUser.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.getGroupValues = this.getGroupValues.bind(this);
        this.getRoleDetails = this.getRoleDetails.bind(this);

    }
    getPermissions() {

        UserService.getAllPermissions().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    permissions: response.data.data,
                    permissionsReceived: true
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
    async componentDidMount() {

        const { userId } = this.state;



        await this.loadSingleUser(userId);
        this.getGroupValues();
        this.getPermissions();

    }

    componentDidUnMount() {

    }

    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({

            [name]: value

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
            this.getRoleDetails(parseInt(inputValue));

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

    getRoleDetails(roleId) {

        UserService.getUserRole(roleId).then(response => {

            if (response.data.successMessage == "success") {
                let stateCopy = Object.assign({}, this.state);
                // console.log("Role data => " + JSON.stringify(response.data.data));
                stateCopy.formData.userPermissions = response.data.data.permissions

                this.setState(stateCopy);

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
        })

    }

    loadSingleUser(userId) {

        UserService.getUser(userId).then(response => {

            if (response.data.data != "") {

                this.setState({
                    formData: response.data.data
                });

                $(".createUser").parsley();

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
            .catch(e => {
                confirmAlert({
                    title: 'Error occurred',
                    message: e.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            });

    }

    handleUserSubmission(event) {

        const { formData, userId } = this.state;

        event.preventDefault();

        if ($(".createUser").parsley().isValid()) {



            $('input[type="submit"],button[type="submit"]').hide();

            this.setState({
                loading: true
            });

            UserService.updateUser(formData).then(response => {

                if (response) {

                    this.setState({
                        networkError: false,
                        loading: false
                    });

                }

                if (response.data.status === "success") {

                    this.setState({
                        successfulSubmission: true,
                        submissionMessage: response.data.message,
                        loading: false
                    });

                    confirmAlert({
                        title: 'Succesfully Updated User ',
                        message: 'Please proceed.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => window.location.href = "/dashboard/viewuser/"+ formData.id
                            }
                        ]
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
                    $('input[type="submit"],button[type="submit"]').show();

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
                $('input[type="submit"],button[type="submit"]').show();

            });

        }



    }

    render() {

        const { roles, groupNames, rolesReceived, groupReceived, formData, loading, permissions } = this.state;

        const { firstName, lastName, otherName, email, phoneNumber, userName, role, userGroups } = this.state.formData;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <h2></h2>
                        {
                            formData != "" || formData != null ?

                                <form

                                    className="createUser"
                                    onSubmit={this.handleUserSubmission}>
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
                                                value={firstName || ""}
                                                onChange={this.handleChange}
                                            />
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
                                                value={lastName || ""}
                                                onChange={this.handleChange}
                                            />
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
                                                onChange={this.handleChange}
                                            />
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
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <div className="col-4">

                                            <label>Phone Number</label>

                                            <input
                                                type="number"
                                                name="phoneNumber"
                                                id="phoneNumber"
                                                data-parsley-required="true"
                                                value={phoneNumber || ""}
                                                onChange={this.handleChange}
                                            />
                                        </div>

                                        <div className="col-4">

                                            <label>Email</label>

                                            <input
                                                type="email"
                                                name="email"
                                                id="email"
                                                data-parsley-required="true"
                                                value={email || ""}
                                                onChange={this.handleChange}
                                            />
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
                                                        onChange={this.handleChange}
                                                        value={userGroups || ""}
                                                        onChange={this.handleChange}
                                                    >
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
                                                    data-parsley-required="true"
                                                    value={lastName || ""}
                                                    onChange={this.handleChange}
                                                    value={role || ""}
                                                    onChange={this.handleChange}
                                                >
                                                    <option value=""></option>
                                                    {roles != "" &&

                                                        roles.map((role, index) => (
                                                            <option key={role.id} value={role.id}>{role.name}</option>
                                                        ))
                                                    }
                                                </select>

                                            </div>
                                        }
                                        {permissions != "" &&

                                            permissions.map((permission, index) => (

                                                <div
                                                    className="col-3 roleItem" key={index}>
                                                    <input

                                                        checked={formData.userPermissions.includes(permission.name)}
                                                        type="checkbox" id={permission.name}
                                                        name={permission.name}
                                                        value={permission.name}
                                                        onChange={e => {

                                                            const inputName = e.target.name;
                                                            const inputChecked = e.target.checked;
                                                            const inputValue = e.target.value;

                                                            console.log(inputChecked);

                                                            let stateCopy = Object.assign({}, this.state);

                                                            if (inputChecked) {

                                                                stateCopy.formData.userPermissions.push(inputValue);

                                                            } else {

                                                                //delete stateCopy.formData.permissions[inputName];
                                                                // permissions.pop(inputValue);

                                                                var index = stateCopy.formData.userPermissions.indexOf(inputValue)
                                                                console.log("removing " + inputValue + "index " + index);

                                                                stateCopy.formData.userPermissions.splice(index, 1);
                                                                //stateCopy.formData.permissions = permissions;

                                                            }


                                                            this.setState(stateCopy);
                                                        }}
                                                    />
                                                    <label htmlFor={permission.name}>{permission.name}</label>
                                                </div>

                                            ))
                                        }



                                    </div>

                                    <div className="row">

                                        <div className="col-12">

                                            <button
                                                className="btn-primary"
                                                type="submit">Update User</button>

                                            <button className="btn-primary" type="reset">Cancel</button>

                                        </div>


                                    </div>

                                </form>

                                :

                                <h2>Error Fetching User Data</h2>
                        }

                        {loading &&
                            <Loader type="circle" />
                        }




                    </div>

                </div>
            </>

        )

    }

}
