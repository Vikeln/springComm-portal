/* global $ */

import React, { Component } from 'react';

import UserService from '../../services/user.service';
import {
    Link
} from "react-router-dom";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';

export default class SingleRole extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            formData: {
                id: null,
                permissions: []
            },
            permissions: [],
            roleId: this.props.match.params.id,
            permissionsReceived: false,



        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRoleSubmission = this.handleRoleSubmission.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.getRoleDetails = this.getRoleDetails.bind(this);

    }

    async componentDidMount() {

        const { roleId } = this.state;

        //$(".createUser").parsley();

        await this.getPermissions();
        await this.getRoleDetails(roleId);

    }

    componentDidUnMount() {

    }

    getRoleDetails(roleId) {

        UserService.getUserRole(roleId).then(response => {

            if (response.data.status == "success") {

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

    handleChange(el) {

        const inputName = el.target.name;

        const inputValue = el.target.value;

        const checked = el.target.checked;


        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);

    }

    getPermissions() {

        UserService.getAllPermissions().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    permissions: response.data.data,
                    permissionsReceived: true
                });

            }else{
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

    handleRoleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createUser").parsley().isValid() && formData.permissions
            .length > 0) {



            UserService.createUserRoles(formData).then(response => {

                console.log(response);
                if (response.data.status == "success"){
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
                                onClick: () => window.location.href = "/dashboard/roles"
                            }
                        ]
                    });
                }else{
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

        } else {

            alert("Please select at least one permission");

        }



    }

    render() {

        const { permissions, permissionsReceived, formData } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <form

                            className="createUser"
                            onSubmit={this.handleRoleSubmission}>
                            <div
                                className="row">

                                <div
                                    className="col-12">

                                    <label>Role Name</label>

                                    <input
                                        type="text"
                                        name="name"
                                        id="name"
                                        value={formData.name || ""}
                                        className="form-control"
                                        data-parsley-required="true"
                                        disabled
                                        onChange={this.handleChange} />
                                </div>



                                {permissionsReceived != "" &&

                                    <>
                                        <div className="col-12">

                                            <div className="row">

                                                {permissions != "" &&

                                                    permissions.map((permission, index) => (

                                                        <div
                                                            className="col-3 roleItem" key={index}>
                                                            <input

                                                                checked={formData.permissions.includes(permission.id)}
                                                                disabled
                                                                type="checkbox" id={permission.name}
                                                                name={permission.name}
                                                                value={permission.id}
                                                                onChange={e => {

                                                                    const inputName = e.target.name;
                                                                    const inputChecked = e.target.checked;
                                                                    const inputValue = e.target.value;
                                                                    //let permissions = [];

                                                                    console.log(inputChecked);

                                                                    let stateCopy = Object.assign({}, this.state);

                                                                    if (inputChecked) {

                                                                        //stateCopy.formData.permissions[inputName] = true;
                                                                        //permissions.push(parseInt(inputValue));

                                                                        stateCopy.formData.permissions.push(parseInt(inputValue));

                                                                    } else {

                                                                        //delete stateCopy.formData.permissions[inputName];
                                                                        permissions.pop(parseInt(inputValue));

                                                                        stateCopy.formData.permissions.pop(parseInt(inputValue))

                                                                        //stateCopy.formData.permissions = permissions;

                                                                    }


                                                                    this.setState(stateCopy);

                                                                    console.log(e.target.value);
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





                            </div>

                            <div className="row">

                                <div className="col-12">

                                    <Link
                                        className="btn-primary"
                                        type="submit"
                                        to="/dashboard/viewroles">Back to Roles</Link>

                                    <button className="btn-primary" type="reset">Cancel</button>

                                </div>


                            </div>

                        </form>

                    </div>

                </div>
            </>

        )

    }

}
