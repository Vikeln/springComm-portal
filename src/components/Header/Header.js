/* global $ */

import React, { Component } from 'react';

import {
    Link,
} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown, faBars } from '@fortawesome/free-solid-svg-icons';

import AuthService from '../../services/auth.service';
import authService from '../../services/auth.service';

export default class Header extends Component {

    constructor(props) {

        super(props);

        this.state = {

            user: AuthService.getCurrentUser(),
            mobileMenu: "closed",
            viewUsers: AuthService.checkIfRoleExists("CAN_VIEW_USERS"),
            viewLoan: AuthService.checkIfRoleExists("CAN_VIEW_LOAN_PRODUCT"),
            viewUsers: authService.checkIfRoleExists("CAN_VIEW_USERS"),
            createUsers: authService.checkIfRoleExists("CAN_CREATE_USERS"),
            enableUsers: authService.checkIfRoleExists("CAN_ENABLE_USERS"),
            disableUsers: authService.checkIfRoleExists("CAN_DEACTIVATE_USER"),

            viewUserDetails: authService.checkIfRoleExists("CAN_VIEW_USER_DETAILS"),

            viewRoles: authService.checkIfRoleExists("CAN_VIEW_ROLES"),
            editRoles: authService.checkIfRoleExists("CAN_EDIT_ROLES"),
            createRoles: authService.checkIfRoleExists("CAN_CREATE_ROLES"),
            viewOutbox: authService.checkIfRoleExists("CAN_VIEW_OUTBOX"),
            viewMessageTemplates: authService.checkIfRoleExists("CAN_VIEW_MESSAGE_TEMPLATES"),

            adminPanel: authService.checkIfRoleExists("CAN_VIEW_OUTBOX_TREND"),
            manageAddressBook: authService.checkIfRoleExists("CAN_VIEW_ADDRESS_BOOK"),
            createAddressBook: authService.checkIfRoleExists("CAN_CREATE_ADDRESS_BOOK"),
            createSenders: authService.checkIfRoleExists("CAN_CREATE_SENDER_ID"),
            viewSenders: authService.checkIfRoleExists("CAN_VIEW_SENDER_ID"),
            viewSchedules: authService.checkIfRoleExists("CAN_VIEW_MESSAGE_SCHEDULE"),
            createSchedule: authService.checkIfRoleExists("CAN_CREATE_MESSAGE_SCHEDULE"),
            editTemplate: authService.checkIfRoleExists("CAN_EDIT_MESSAGE_TEMPLATE"),
            createTemplate: authService.checkIfRoleExists("CAN_CREATE_MESSAGE_TEMPLATE"),
            sendMessages: authService.checkIfRoleExists("CAN_SEND_MESSAGE"),
            value: this.props.value
        }

        this.logoutUser = this.logoutUser.bind(this);

    }

    componentDidMount() {

        if ($(window).width() < 1024) {

            $(document).on("click", "#aside .nav-item a", function () {

                $('#aside').modal('hide');

            })

        }

    }

    componentDidUnMount() {

    }

    logoutUser() {

        AuthService.logout();


    }

    render() {

        const { createUsers, adminPanel } = this.state;


        return (

            <>
                <header id="header" className="page-header bg-white box-shadow animate fadeInDown  ">
                    <nav class="navbar navbar-expand-lg ml-auto navbar-light " >
                        
                            <a href={adminPanel == true ? "/portal/adminprofile": "/portal/welcome"} className="navbar-brand">
                                <img className="navbar-brand avatar" src="../logo.png" alt="TAARIFA." /> 
                                {/* TAARIFASMS */}
                            </a>

                        {/* <a class="navbar-brand" href="/portal">
                            {authService.getCurrentClientName() != undefined ? authService.getCurrentClientName().toUpperCase() : "SPRING"}
                        </a> */}
                        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarSupportedContent" aria-controls="navbarSupportedContent" aria-expanded="false" aria-label="Toggle navigation">
                            <span class="navbar-toggler-icon"></span>
                        </button>

                        <div class="collapse navbar-collapse justify-content-between" id="navbarSupportedContent">

                            <ul class="navbar-nav">
                                <li class="nav-item ml-auto">
                                    <a class="nav-link" href="/portal/integration">API</a>
                                </li>
                            </ul>
                            <ul class="navbar-nav">



                                {authService.getCurrentClientId() === "1" &&
                                    <>
                                        <li class="nav-item dropdown ml-auto">
                                            <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                                <span>Clients</span>
                                            </a>
                                            <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                                <a class="dropdown-item" href="/portal/admin/clients">View Clients</a>
                                                <a class="dropdown-item" href="/portal/admin/clients/new">New Client</a>
                                            </div>
                                        </li>
                                    </>
                                }
                                <li class="nav-item dropdown ml-auto">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span>Address Book</span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">

                                        <a class="dropdown-item" href="/portal/addressBook/upload">Upload New</a>
                                        <a class="dropdown-item" href="/portal/addressBook">List</a>
                                    </div>
                                </li>

                                <li class="nav-item dropdown ml-auto">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span>SMS</span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">

                                        <a class="dropdown-item" href="/portal/sendmessages">New</a>
                                        <a class="dropdown-item" href="/portal/inbox">Inbox</a>
                                        <a class="dropdown-item" href="/portal/messages">Outbox</a>
                                        {authService.getCurrentClientId() != "1" &&
                                            <>
                                                <a class="dropdown-item" href="/portal/custommessages">Custom</a>
                                                <a class="dropdown-item" href="/portal/scheduled-messages">Scheduled</a>
                                                <a class="dropdown-item" href="/portal/messagetemplates">Templates</a>
                                            </>
                                        }
                                    </div>
                                </li>


                                <li class="nav-item ml-auto">
                                    <a class="nav-link" href={authService.getCurrentClientId() === "1" ? "/portal/admin/sources" : "/portal/mysenderIds"}>Sender IDs</a>
                                </li>
                                <li class="nav-item dropdown ml-auto">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span>Settings</span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">

                                        {authService.getCurrentClientId() === "1" ?
                                            <>
                                                <a class="dropdown-item" href="/portal/admin/countries">Countries</a>
                                                <a class="dropdown-item" href="/portal/admin/documentTypes">Document Types</a>
                                                <a class="dropdown-item" href="/portal/admin/pricing">Pricing</a>
                                                <div class="dropdown-divider"></div>
                                                <a class="dropdown-item" href="/portal/users">All Admin Users</a>
                                                <a class="dropdown-item" href="/portal/addusers">New Admin</a>
                                            </> : <>
                                                <a class="dropdown-item" href="/portal/my-documents">My Documents</a>
                                                <a class="dropdown-item" href="/portal/my-balances">My Balances</a>
                                                <div class="dropdown-divider"></div>
                                                <a class="dropdown-item" href="/portal/users">Users</a>
                                                <a class="dropdown-item" href="/portal/viewroles">Roles</a>
                                            </>}
                                    </div>
                                </li>
                                <li class="nav-item dropdown ml-auto">
                                    <a class="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                        <span>{this.state.user}</span>
                                    </a>
                                    <div class="dropdown-menu" aria-labelledby="navbarDropdown">
                                        <a class="dropdown-item" href="/logout">Sign Out</a>
                                    </div>
                                </li>
                            </ul>
                        </div>
                    </nav>

                </header>
            </>

        )

    }

}
