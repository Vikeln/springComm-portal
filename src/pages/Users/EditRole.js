/* global $ */

import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { confirmAlert } from 'react-confirm-alert';
import UserService from '../../services/user.service';


export default class EditRole extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            formData: {
                id: null,
                permissions: []
            },
            permissions: [],
            permissionsReceived: false,
            roleId: this.props.match.params.id


        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRoleSubmission = this.handleRoleSubmission.bind(this);
        this.getPermissions = this.getPermissions.bind(this);
        this.goBack = this.goBack.bind(this);

    }
    goBack(event) {
        event.preventDefault();
        window.location.href = "/portal/viewroles"
    }
    async componentDidMount() {

        const { roleId } = this.state;



        $(".createUser").parsley();

        this.getPermissions();
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

    handleRoleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createUser").parsley().isValid() && formData.permissions
            .length > 0) {



            UserService.updateUserRoles(formData).then(response => {

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
                        window.location.href = "/portal/viewroles"
                    }, 4000);

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

        } else {

            alert("Please enter all required data");

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
                                        className="form-control"
                                        value={formData.name || ""}
                                        data-parsley-required="true"
                                        onChange={this.handleChange} />
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
                                                                checked={formData.permissions.includes(permission.name)}
                                                                type="checkbox" id={permission.name} name={permission.name}
                                                                value={permission.name}
                                                                onChange={e => {

                                                                    const inputName = e.target.name;
                                                                    const inputChecked = e.target.checked;
                                                                    const inputValue = e.target.value;
                                                                    //let permissions = [];



                                                                    let stateCopy = Object.assign({}, this.state);

                                                                    if (inputChecked) {

                                                                        stateCopy.formData.permissions.push(inputValue);

                                                                    } else {

                                                                        //delete stateCopy.formData.permissions[inputName];
                                                                        // permissions.pop(inputValue);

                                                                        var index = stateCopy.formData.permissions.indexOf(inputValue)
                                                                        console.log("removing " + inputValue + "index " + index);

                                                                        stateCopy.formData.permissions.splice(index, 1);
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



                                        </div>
                                    </>
                                }





                            </div>

                            <div className="row">

                                <div className="col-12">

                                    <button
                                        className="btn-primary"
                                        type="submit">Update Role</button>

                                    <button className="btn-primary" type="button" onClick={this.goBack  }>Cancel</button>

                                </div>


                            </div>

                        </form>

                    </div>

                </div>
            </>

        )

    }

}
