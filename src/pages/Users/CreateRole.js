/* global $ */

import React, { Component } from 'react';
import UserService from '../../services/user.service';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';


export default class CreateRole extends Component {

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
            loading: false,


        }

        this.handleChange = this.handleChange.bind(this);
        this.handleRoleSubmission = this.handleRoleSubmission.bind(this);
        this.getPermissions = this.getPermissions.bind(this);

    }

    componentDidMount() {

        $(".createUser").parsley();
        this.getPermissions();

    }

    componentDidUnMount() {

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

            $('input[type="submit"],button[type="submit"]').hide();

            this.setState({
                loading: true,
            });

            UserService.createUserRoles(formData).then(response => {

                if (response.data.status == "success") {
                    this.setState({
                        loading: false,
                    });

                    confirmAlert({
                        title: 'Succesfully Added Role ',
                        message: 'Please proceed.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => window.location.href = "/dashboard/viewroles"
                            }
                        ]
                    });

                } else {

                    this.setState({
                        loading: false,
                    });

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

                this.setState({
                    networkError: true,
                    loading: false

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

                $('input[type="submit"],button[type="submit"]').show();

            });

        } else {

            confirmAlert({
                title: 'Select Permission',
                message: 'Please select at least one permission',
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

        }



    }

    render() {

        const { permissions, permissionsReceived } = this.state;

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
                                                            className="col-3 roleItem" key={index}>
                                                            <input

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
                                                                        permissions.pop(parseInt(inputValue));

                                                                        stateCopy.formData.permissions.pop(inputValue)

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
                                        type="submit">Create Role</button>

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
