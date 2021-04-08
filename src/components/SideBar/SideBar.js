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
            enableUsers: authService.checkIfRoleExists("CAN_ENABLE_USERS"),
            disableUsers: authService.checkIfRoleExists("CAN_DEACTIVATE_USER"),

            viewUserDetails: authService.checkIfRoleExists("CAN_VIEW_USER_DETAILS"),

            viewRoles: authService.checkIfRoleExists("CAN_VIEW_ROLES"),
            createRoles: authService.checkIfRoleExists("CAN_CREATE_ROLES"),
            viewOutbox: authService.checkIfRoleExists("CAN_VIEW_OUTBOX"),
            viewMessageTemplates: authService.checkIfRoleExists("CAN_VIEW_MESSAGE_TEMPLATES"),
            
            
            
            adminPanel: authService.checkIfRoleExists("CAN_VIEW_OUTBOX_TREND"),
            manageAddressBook:authService.checkIfRoleExists("CAN_VIEW_ADDRESS_BOOK"),
            createAddressBook:authService.checkIfRoleExists("CAN_CREATE_ADDRESS_BOOK"),
            createSenders: authService.checkIfRoleExists("CAN_CREATE_SENDER_ID"),
            viewSenders:authService.checkIfRoleExists("CAN_VIEW_SENDER_ID"),
            viewSchedules:authService.checkIfRoleExists("CAN_VIEW_MESSAGE_SCHEDULE"),
            createSchedule:authService.checkIfRoleExists("CAN_CREATE_MESSAGE_SCHEDULE"),
            editTemplate:authService.checkIfRoleExists("CAN_EDIT_MESSAGE_TEMPLATE"),
            createTemplate:authService.checkIfRoleExists("CAN_CREATE_MESSAGE_TEMPLATE"),
            sendMessages:authService.checkIfRoleExists("CAN_SEND_MESSAGE"),
            value: this.props.value

        }

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }

    render() {

        const { createUsers, adminPanel,
            manageAddressBook,
            createAddressBook,
            createSenders,
            viewSenders,
            viewSchedules,
            createSchedule,
            editTemplate,
            createTemplate,
            sendMessages,createRoles, viewUsers, viewProductDisbursements, viewProductRepayments, viewRoles, listCustomers, viewLoan, createProduct, viewProductApplications, viewOutbox, viewMessageTemplates, } = this.state;


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

                                {adminPanel == true ?
                                            <li className="nav-item">
                                                <Link to="/dashboard/adminprofile">

                                                    <FontAwesomeIcon icon={faUserCircle} className="sidebarIcon" />

                                                    <span className="nav-text">Admin Profile</span>
                                                </Link>
                                            </li>
     : "    "}
                                    {viewSenders == true ?
                                        <>
                                            {/* <li className="nav-header hidden-folded">
                                            <span>Main</span>
                                        </li> */}


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

                                        <li className="accordion">

                                            <a href="#" className="i-con-h-a">

                                                <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                <span className="nav-text">SMS</span>
                                                <span className="nav-caret"></span>
                                            </a>

                                            <ul className="nav-sub">

                                                {sendMessages == true ? 
                                                <>
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
                                                </li></>
                                                :
        
                                                ""}
                                                {viewOutbox &&
                                                    <li className="nav-item">
                                                        <Link to="/dashboard/messages">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Sent Messages</span>
                                                        </Link>
                                                    </li>}

                                                {viewSchedules &&
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



                                            </ul>
                                        </li>



                                    {manageAddressBook &&
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



                                                    {createAddressBook &&
                                                        <li className="nav-item">
                                                            <Link to="/dashboard/addressBook/upload">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text">Upload Contacts</span>
                                                            </Link>
                                                        </li>}

                                                    {manageAddressBook &&
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
