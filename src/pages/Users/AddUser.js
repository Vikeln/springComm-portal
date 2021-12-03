/* global $ */

import React, { Component } from 'react';

import UserService from '../../services/user.service';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';


export default class AddUser extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            formData: {
                enabled: false,
                userGroups: [],
                userPermissions: []

            },
            groupNames: [],
            permissions: [],
            roles: [],
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

        this.getGroupValues = this.getGroupValues.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.getRoleDetails = this.getRoleDetails.bind(this);

    }

    componentDidMount() {

        $(".createUser").parsley();
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

        UserService.getUserRoles().then(response => {

            if (response.data.status != "error") {

                this.setState({
                    roles: response.data.data,
                    rolesReceived: "yes"
                });

            } else {


                confirmAlert({

                    title: 'Error',
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
    getRoleDetails(roleId) {
        console.log("fetching Role data => " +roleId);
    
        UserService.getUserRole(roleId).then(response => {
    
            if (response.data.successMessage == "success") {
              let stateCopy = Object.assign({}, this.state);
              // console.log("Role data => " + JSON.stringify(response.data.data));
              stateCopy.formData.userPermissions = response.data.data.permissions.map(x=>x.name);
               
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

    handleUserSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createUser").parsley().isValid()) {

            this.setState({
                loading: true,
            });

            $('input[type="submit"],button[type="submit"]').hide();
            console.log(formData);

            UserService.createUser(formData).then(response => {

                if (response) {

                    this.setState({
                        networkError: false
                    });

                }

                if (response.data.status == "success") {

                    this.setState({
                        successfulSubmission: true,
                        submissionMessage: response.data.message,
                        loading: false,
                    });

                    confirmAlert({

                        title: 'Success',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                                onClick: () => window.location.href = "/portal/users"
                            }
                        ]
                    });


                } else {

                    confirmAlert({

                        title: 'Error',
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

                this.setState({
                    networkError: true,
                    loading: false

                });

                confirmAlert({
                    title: 'Following Error Occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'Ok',
                        }
                    ]
                });

                $('input[type="submit"],button[type="submit"]').show();

            });

        }



    }

    render() {

        const { roles, groupNames, rolesReceived, groupReceived, loading, permissions, permissionsReceived } = this.state;


        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        {/* Page Title */}
                        <div className="page-title padding pb-0 ">
                            <h2 className="text-md mb-0">Add User</h2>
                        </div>
                        {/* End Page Title*/}


                        <form

                            className="createUser padding"
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
                                        onChange={this.handleChange} />
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
                                        onChange={this.handleChange} />
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
                                        onChange={this.handleChange} />
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
                                        onChange={this.handleChange} />
                                </div>

                                <div className="col-4">

                                    <label>Phone Number</label>

                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        data-parsley-pattern="(?:254|\+254|0)?(7(?:(?:[0-9][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$"
                                        data-parsley-required-message="Phone Number required"
                                        data-parsley-pattern-message="Invalid Phone Number"
                                        data-parsley-required="true"
                                        onChange={this.handleChange} />
                                </div>

                                <div className="col-4">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        data-parsley-required="true"
                                        onChange={this.handleChange} />
                                </div>

                                <div className="col-4">

                                    <label>User Type</label>

                                    <select
                                        className="form-control"
                                        name="apiUser"
                                        id="apiUser"

                                        data-parsley-required="true"
                                        onChange={this.handleChange}>
                                        <option value=""></option>
                                        <option value="true">Api User</option>
                                        <option value="false">portal User</option>
                                    </select>
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
                                                onChange={this.handleChange}>
                                                <option value=""></option>
                                                {groupNames != "" &&

                                                    groupNames.map((group, index) => (
                                                        <option key={group.id} value={group.id}>{group.name}</option>
                                                    ))
                                                }
                                            </select>

                                        </div>
                                    </>
                                }

                                {rolesReceived != "" && this.state.formData.apiUser === "false" &&
                                    <> <div className="col-12">

                                        <label>Role</label>

                                        <select
                                            className="form-control"
                                            name="role"
                                            id="role"
                                            data-parsley-required="true"
                                            onChange={this.handleChange}>
                                            <option value=""></option>
                                            {roles != "" &&

                                                roles.map((role, index) => (
                                                    <option key={role.id} value={role.id}>{role.name}</option>
                                                ))
                                            }
                                        </select>

                                    </div>


                                        {permissionsReceived != "" &&

                                            <>
                                                <div className="col-12">

                                                    <div className="row">

                                                        {permissions != "" &&

                                                            permissions.map((permission, index) => (

                                                                <div
                                                                    className="col-4 roleItem" key={index}>
                                                                    <input

                                                                        type="checkbox" id={permission.name} name={permission.name}
                                                                        checked={this.state.formData.userPermissions.includes(permission.name)}
                                                                        value={permission.name}
                                                                        onChange={e => {

                                                                            const inputName = e.target.name;
                                                                            const inputChecked = e.target.checked;
                                                                            const inputValue = e.target.value;
                                                                            //let permissions = [];



                                                                            let stateCopy = Object.assign({}, this.state);

                                                                            if (inputChecked) {
                      
                                                                              stateCopy.formData.userPermissions.push(inputValue);
                      
                                                                            } else {
                                                                              var index = stateCopy.formData.userPermissions.indexOf(inputValue)
                                                                              console.log("removing " + inputValue + "index " + index);
                      
                                                                              stateCopy.formData.userPermissions.splice(index, 1);
                                                                            }


                                                                            this.setState(stateCopy);


                                                                        }}
                                                                    />
                                                                    <label htmlFor={permission.name}>{permission.name}</label>
                                                                </div>

                                                            ))
                                                        }
                                                    </div>



                                                </div>
                                            </>
                                        }
                                    </>
                                }



                            </div>

                            <div className="row">

                                <div className="col-12">

                                    <button
                                        className="btn-primary"
                                        type="submit">Create User</button>

                                    <button className="btn-primary" type="reset">Cancel</button>

                                </div>


                            </div>

                        </form>

                        {loading &&
                            <Loader type="dots"/>
                        }

                    </div>

                </div>
            </>

        )

    }

}
