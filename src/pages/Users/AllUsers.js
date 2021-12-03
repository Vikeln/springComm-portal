/* global $ */

import React, { Component } from 'react';


import {
    Link
} from "react-router-dom";


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import UserService from '../../services/user.service';
import authService from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faLockOpen, faPen, faToggleOff, faToggleOn } from '@fortawesome/free-solid-svg-icons';


export default class AllUsers extends Component {

    constructor(props) {

        super(props);

        this.state = {
            viewUsers: authService.checkIfRoleExists("CAN_VIEW_USERS"),
            enableUser: authService.checkIfRoleExists("CAN_ENABLE_USERS"),
            disableUser: authService.checkIfRoleExists("CAN_DEACTIVATE_USER"),
            unlockUser: authService.checkIfRoleExists("CAN_UNLOCK_USER_ACCOUNT"),
            value: this.props.value,
            users: [],
            emailSuccessful: "",
            loading: false,
            editUsers: authService.checkIfRoleExists("CAN_EDIT_USERS"),

        }

        this.enableUser = this.enableUser.bind(this);

        this.unlockUserAccount = this.unlockUserAccount.bind(this);

        this.deactivateUser = this.deactivateUser.bind(this);

    }

    async componentDidMount() {

        await this.fetchUsers();

        $("body").on("click", ".enableUser", this.enableUser);
        $("body").on("click", ".disableUser", this.deactivateUser);
        $("body").on("click", ".unlockUser", this.unlockUserAccount);


    }

    componentDidUnMount() {

    }

    fetchUsers() {

        this.setState({
            loading: true
        });

        UserService.getAllUsers().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    users: response.data.data,
                    loading: false,
                });
                $('.table').bootstrapTable({
                    exportDataType: 'all',
                    exportTypes: ['json', 'csv', 'excel'],
                });
                // $('.table').dataTable({});
                // $(".table #table_filter input").attr("placeHolder", "Search");

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

                this.setState({
                    loading: false,
                });
            }


        }).catch(error => {

            this.setState({
                loading: false,
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
        });


    }

    enableUser(el) {


        var username = el.target.dataset.name;


        confirmAlert({
            message: 'Are you sure you want to enable ' + username,
            // message: 'Please proceed.',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        UserService.enableUser(username).then(response => {



                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });

                                confirmAlert({
                                    title: 'Succesfully Activated ' + username,
                                    message: 'Please proceed.',
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    title: 'Error Submitting Data for ' + username,
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

    unlockUserAccount(el) {


        var id = el.target.dataset.id;
        confirmAlert({
            message: "Are you sure you want to unlock this user's account? ",
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

                            } else if (response.data.status == "error") {

                                confirmAlert({
                                    title: 'Error Submitting Data for ' + id,
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

    deactivateUser(el) {
        var id = el.target.dataset.id;
        confirmAlert({
            message: "Are you sure you want to disable this user's account? ",
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        UserService.deactivate(id).then(response => {

                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });
                                window.location.reload()


                            } else {
                                confirmAlert({
                                    title: 'Error occurred on user deactivation',
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
                }]
        });
    }

    render() {

        const { users, viewUsers, loading, editUsers, enableUser, disableUser, unlockUser } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">All Users</h2>

                        </div>


                        {viewUsers &&
                            <div className="padding">


                               
<a class="float-right" href="/portal/addusers">
                                <button className="btn btn-primary"><i className="fa fa-pen">Add New</i></button></a>

<br/>
<br/>
                                <table
                                    className="table table-theme v-middle table-row"
                                    id="table"
                                    data-toolbar="#toolbar"
                                    data-search="true"
                                    data-search-align="left"
                                    data-show-columns="true"
                                    data-show-export="true"
                                    data-detail-view="false"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>User name</th>
                                            <th>First Name</th>
                                            <th>Last Name</th>
                                            <th>API User </th>
                                            <th>Role </th>
                                            <th>Email </th>
                                            <th>Activated </th>
                                            <th>Actions </th>

                                        </tr>
                                    </thead>

                                    <tbody>



                                        {users != "" &&
                                            users.map((user, index) => {

                                                return (


                                                    <tr className=" " key={user.id} >


                                                        <td>
                                                            <Link className="link" to={'/portal/viewuser/' + user.id}>
                                                                {user.userName}
                                                            </Link>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.firstName}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.lastName}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.apiUser ? "True" : "False"}</span>
                                                        </td>

                                                        <td>
                                                            {<span className="">{user.role.name}</span>}
                                                        </td>


                                                        <td>
                                                            <span className="">{user.email}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">
                                                                <Badge description={user.enabled.toString()}
                                                                    type={user.enabled.toString()} />
                                                            </span>
                                                        </td>

                                                        <td>

                                                            <span className="padding">
                                                                <a href={'/portal/viewuser/' + user.id} >
                                                                    <FontAwesomeIcon icon={faEye} color="#49bcd7"></FontAwesomeIcon>
                                                                </a>
                                                            </span>
                                                            {editUsers &&
                                                                <span className="padding">
                                                                    <a href={'/portal/edituser/' + user.id} >
                                                                        <FontAwesomeIcon icon={faPen} color="#49bcd7"></FontAwesomeIcon>
                                                                    </a>
                                                                </span>
                                                            }

                                                            {disableUser && user.enabled && <span className="padding disableUser">
                                                                <FontAwesomeIcon
                                                                    icon={faToggleOff}
                                                                    color="#49bcd7"
                                                                    data-id={user.id}
                                                                    data-name={user.userName}
                                                                    className=""></FontAwesomeIcon>

                                                            </span>}
                                                            {enableUser && !user.enabled && <span className="padding enableUser">
                                                                <FontAwesomeIcon icon={faToggleOn} color="#49bcd7"
                                                                    data-id={user.id}
                                                                    data-name={user.userName}
                                                                    className=""></FontAwesomeIcon>
                                                            </span>}

                                                            {unlockUser && user.accountLocked && <span className="padding unlockUser">
                                                                <FontAwesomeIcon icon={faLockOpen} color="#49bcd7"
                                                                    data-id={user.id}
                                                                    data-name={user.userName}
                                                                    className=""></FontAwesomeIcon>
                                                            </span>}


                                                            {/* <div className="item-action dropdown">
                                                                <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                <div className="dropdown-menu dropdown-menu-right" role="menu">



                                                                    {editUsers &&
                                                                        <Link className="dropdown-item" to={'/portal/edituser/' + user.id}>
                                                                            Edit
                                                                        </Link>
                                                                    }

                                                                    {enableUser && !user.enabled &&
                                                                        <button data-name={user.userName}
                                                                            className="dropdown-item enableUser"
                                                                        >Enable {user.userName}</button>}

                                                                    {disableUser && user.enabled &&
                                                                        <button data-id={user.id}
                                                                            className="dropdown-item disableUser"
                                                                        // onClickCapture={() =>
                                                                        //     this.deactivateUser(user.user.id)
                                                                        // }
                                                                        >DeActivate {user.userName}</button>}
                                                                    {unlockUser && user.accountLocked &&
                                                                        <button data-id={user.id}
                                                                            className="dropdown-item unlockUser"
                                                                        // onClickCapture={() =>
                                                                        //     this.unlockUserAccount(user.user.id)
                                                                        // }
                                                                        >Unlock {user.userName}'s Account </button>}

                                                                </div>

                                                            </div> */}
                                                        </td>

                                                    </tr>

                                                );

                                            })
                                        }

                                    </tbody>

                                </table>



                            </div>
                        }{!viewUsers &&
                            <div><p>You do not have permission to view this resource</p></div>
                        }

                        {loading &&
                            <Loader type="dots" />
                        }


                    </div>

                </div>
            </>

        )

    }

}
