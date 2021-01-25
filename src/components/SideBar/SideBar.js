import React, { Component } from 'react';

import {
    Link,
} from "react-router-dom";
import authService from '../../services/auth.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faCommentDots,faShareAlt, faExchangeAlt, faPaperPlane, faTasks, faUser, faBook } from '@fortawesome/free-solid-svg-icons';


export default class SideBar extends Component {

    constructor(props) {

        super(props);

        this.state = {
            viewUsers: authService.checkIfRoleExists("CAN_VIEW_USERS"),
            createUsers: authService.checkIfRoleExists("CAN_CREATE_USERS"),

            viewUserDetails: authService.checkIfRoleExists("CAN_VIEW_USER_DETAILS"),

            viewRoles: authService.checkIfRoleExists("CAN_VIEW_ROLES"),
            createRoles: authService.checkIfRoleExists("CAN_CREATE_ROLES"),

            listCustomers: authService.checkIfRoleExists("CAN_VIEW_CUSTOMERS"),

            createProduct: authService.checkIfRoleExists("CAN_CREATE_LOAN_PRODUCT"),
            viewLoan: authService.checkIfRoleExists("CAN_VIEW_LOAN_PRODUCT"),
            viewProductApplications: authService.checkIfRoleExists("CAN_VIEW_LOAN_APPLICATIONS"),
            viewProductDisbursements: authService.checkIfRoleExists("CAN_VIEW_DISBURSEMENT_TRANSACTIONS"),
            viewProductRepayments: authService.checkIfRoleExists("CAN_VIEW_LOAN_REPAYMENTS"),

            viewOutbox: authService.checkIfRoleExists("CAN_VIEW_OUTBOX"),
            viewMessageTemplates: authService.checkIfRoleExists("CAN_VIEW_MESSAGE_TEMPLATES"),

            value: this.props.value

        }

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }

    render() {

        const { createUsers, createRoles, viewUsers, viewProductDisbursements, viewProductRepayments, viewRoles, listCustomers, viewLoan, createProduct, viewProductApplications, viewOutbox, viewMessageTemplates, } = this.state;


        return (

            <>
                {/* Main Side Bar */}
                <div id="aside" className="page-sidenav no-shrink  nav-expand " aria-hidden="true">

                    {/* Main Side Bar */}
                    <div className="sidenav h-100 modal-dialog bg-white box-shadow">

                        <div className="flex scrollable hover">
                            <div className="nav-border b-primary" data-nav>
                                <br></br>
                                {/* Sidebar Navigation */}
                                <ul className="nav bg">

                                    {viewLoan == true && viewUsers == true ?
                                        <>
                                            {/* <li className="nav-header hidden-folded">
                                            <span>Main</span>
                                        </li> */}

                                            <li className="nav-item">
                                                <Link to="/dashboard/adminprofile">

                                                    <FontAwesomeIcon icon={faUserCircle} className="sidebarIcon" />

                                                    <span className="nav-text">Admin Profile</span>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="/dashboard/mysenderIds">

                                                    <FontAwesomeIcon icon={faPaperPlane} className="sidebarIcon" />

                                                    <span className="nav-text">My Senders</span>
                                                </Link>
                                            </li>
                                        </>
                                        :

                                        ""}
                                        <li className="nav-item">
                                            <Link to="/dashboard/integration">

                                                <FontAwesomeIcon icon={faShareAlt} className="sidebarIcon" />

                                                <span className="nav-text">API Integration</span>
                                            </Link>
                                        </li>

                                    {/* {viewOutbox == true || viewMessageTemplates == true  ?
                                    <li className="nav-header hidden-folded">
                                        <span>Messages</span>
                                    </li>
                                    :
                                    ""
                                    } */}

                                    {viewOutbox &&
                                        <li className="accordion">

                                            <a href="#" className="i-con-h-a">

                                                <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                <span className="nav-text">Texts</span>
                                                <span className="nav-caret"></span>
                                            </a>

                                            <ul className="nav-sub">

                                                {viewOutbox &&
                                                    <li className="nav-item">
                                                        <Link to="/dashboard/messages">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Sent Messages</span>
                                                        </Link>
                                                    </li>}

                                                {viewOutbox &&
                                                    <li className="nav-item">
                                                        <Link to="/dashboard/scheduled-messages">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Scheduled Messages</span>
                                                        </Link>
                                                    </li>}

                                                {viewMessageTemplates &&
                                                    <li className="nav-item">
                                                        <Link to="/dashboard/messagetemplates">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Message Templates</span>
                                                        </Link>
                                                    </li>}

                                                <li className="nav-item">
                                                    <Link to="/dashboard/sendmessages">
                                                        <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />
                                                        <span className="nav-text">New Message</span>
                                                    </Link>
                                                </li>
                                                <li className="nav-item">
                                                    <Link to="/dashboard/custommessages">
                                                        <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />
                                                        <span className="nav-text">Custom Message</span>
                                                    </Link>
                                                </li>


                                            </ul>
                                        </li>}



                                    {viewUsers &&
                                        <>
                                            {/* <li className="nav-header hidden-folded">
                                            <span>Address Book</span>
                                        </li> */}
                                            <li className="accordion">
                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faBook} className="sidebarIcon" />

                                                    <span className="nav-text">Address Book</span>
                                                    <span className="nav-caret"></span>
                                                </a>

                                                <ul className="nav-sub">



                                                    {viewUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/addressBook/upload">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">Upload Contacts</span>
                                                            </Link>
                                                        </li>}

                                                    {createUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/addressBook">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">Manage Contacts</span>
                                                            </Link>
                                                        </li>
                                                    }
                                                </ul>
                                            </li>
                                        </>
                                    }

                                    {viewUsers &&
                                        <>
                                            {/* <li className="nav-header hidden-folded">
                                        <span>Users</span>
                                    </li> */}
                                            <li className="accordion">
                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />

                                                    <span className="nav-text">Users</span>
                                                    <span className="nav-caret"></span>
                                                </a>

                                                <ul className="nav-sub">



                                                    {viewUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/users">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">All Users</span>
                                                            </Link>
                                                        </li>}

                                                    {createUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/addusers">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">Add Users</span>
                                                            </Link>
                                                        </li>
                                                    }

                                                    {viewRoles &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/viewroles">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">View Roles</span>
                                                            </Link>
                                                        </li>}

                                                    {createRoles &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/addroles">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">Add Roles</span>
                                                            </Link>
                                                        </li>}

                                                </ul>
                                            </li>
                                        </>
                                    }

                                </ul>
                                {/* End Sidebar Navigation*/}
                            </div>
                        </div>
                    </div>

                </div>
                {/* End Main Side Bar*/}
            </>

        )

    }

}
