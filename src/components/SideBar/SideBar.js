import React, { Component } from 'react';

import {
    Link,
} from "react-router-dom";
import authService from '../../services/auth.service';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faUserCircle, faCommentDots, faShareAlt, faExchangeAlt, faPaperPlane, faTasks, faUser, faBook, faCashRegister, faPencilAlt } from '@fortawesome/free-solid-svg-icons';


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

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }

    render() {

        const { createUsers, adminPanel,
            manageAddressBook,
            createAddressBook,
            viewSenders,
            viewSchedules,
            sendMessages, createRoles, viewUsers, viewRoles, viewOutbox, viewMessageTemplates, } = this.state;


        return (

            <>
                {/* Main Side Bar */}
                <div id="aside" className="page-sidenav no-shrink  nav-expand " >

                    {/* Main Side Bar */}
                    <div className="sidenav h-100 modal-dialog bg-white box-shadow ">

                        <div className="flex scrollable hover">
                            <div className="nav-border b-primary" data-nav>
                                <br></br>
                                {/* Sidebar Navigation */}
                                <ul className="nav bg">

                                    {adminPanel == true ?
                                        <li className="nav-item">
                                            <Link to="/portal/adminprofile">

                                                <FontAwesomeIcon icon={faUserCircle} className="sidebarIcon" />

                                                <span className="nav-text newColorLink">Admin Profile</span>
                                            </Link>
                                        </li>
                                        :
                                        <li className="nav-item">
                                            <Link to="/portal/welcome">

                                                <FontAwesomeIcon icon={faUserCircle} className="sidebarIcon" />

                                                <span className="nav-text newColorLink">Home</span>
                                            </Link>
                                        </li>}
                                    {authService.getCurrentClientId() === "1" ?
                                        <>
                                            <li className="nav-item accordion">
                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />

                                                    <span className="nav-text newColorLink">System Admins</span>
                                                    <span className="nav-caret"></span>
                                                </a>
                                                <ul className="nav-sub">
                                                    {viewUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/users">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text newColorLink">All Admin Users</span>
                                                            </Link>
                                                        </li>}

                                                    {createUsers &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/addusers">
                                                                <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                <span className="nav-text newColorLink">New Admin</span>
                                                            </Link>
                                                        </li>
                                                    }
                                                </ul>

                                            </li>





                                            <li className="nav-item accordion">
                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />

                                                    <span className="nav-text">Clients</span>
                                                    <span className="nav-caret"></span>
                                                </a>
                                                <ul className="nav-sub">



                                                    <li className="nav-item">
                                                        <Link to="/portal/admin/clients">
                                                            <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                            <span className="nav-text">View Clients</span>
                                                        </Link>
                                                    </li>

                                                    <li className="nav-item">
                                                        <Link to="/portal/admin/clients/new">
                                                            <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                            <span className="nav-text">New Client</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li>
                                            {/* <li className="nav-item accordion">
                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />

                                                    <span className="nav-text">USSD Codes</span>
                                                    <span className="nav-caret"></span>
                                                </a>
                                                <ul className="nav-sub">

                                                    <li className="nav-item">

                                                        <Link to="/portal/admin/ussd-codes">
                                                            <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                            <span className="nav-text">View Codes</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">

                                                        <Link to="/portal/admin/ussd-codes/new">
                                                            <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                            <span className="nav-text">New Code</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li> */}

                                            <li className="nav-item">
                                                <Link to="/portal/admin/sources">
                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                    <span className="nav-text">Sender IDs</span>
                                                </Link>
                                            </li>
                                            <li className="accordion">

                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                    <span className="nav-text">SMS</span>
                                                    <span className="nav-caret"></span>
                                                </a>

                                                <ul className="nav-sub">

                                                    <li className="nav-item">
                                                        <Link to="/portal/sendmessages">
                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />
                                                            <span className="nav-text">New Message</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/portal/messages">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Outbox</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/portal/inbox">

                                                            <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                            <span className="nav-text">Inbox</span>
                                                        </Link>
                                                    </li>


                                                </ul>
                                            </li>
                                            <li className="nav-item">
                                                <Link to="/portal/admin/pricing">
                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                    <span className="nav-text">Default Pricing</span>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="/portal/admin/countries">
                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                    <span className="nav-text">Countries</span>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="/portal/admin/documentTypes">
                                                    <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                    <span className="nav-text">Document Types</span>
                                                </Link>
                                            </li>

                                            {/* </ul> */}
                                        </>
                                        :
                                        <>
                                            {viewSenders == true ?
                                                <>
                                                </>
                                                :

                                                ""}
                                            <li className="nav-item">
                                                <Link to="/portal/integration">

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

                                                    <li className="nav-item">
                                                        <Link to="/portal/mysenderIds">

                                                            <FontAwesomeIcon icon={faPaperPlane} className="sidebarIcon" />

                                                            <span className="nav-text">My Senders</span>
                                                        </Link>
                                                    </li>

                                                    {sendMessages == true &&
                                                        <>
                                                            <li className="nav-item">
                                                                <Link to="/portal/sendmessages">
                                                                    <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />
                                                                    <span className="nav-text">New Message</span>
                                                                </Link>
                                                            </li>
                                                            <li className="nav-item">
                                                                <Link to="/portal/custommessages">
                                                                    <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />
                                                                    <span className="nav-text">Custom Message</span>
                                                                </Link>
                                                            </li>
                                                        </>
                                                    }
                                                    {viewOutbox &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/messages">

                                                                <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                                <span className="nav-text">Sent Messages</span>
                                                            </Link>
                                                        </li>}

                                                    {viewSchedules &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/scheduled-messages">

                                                                <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                                <span className="nav-text">Scheduled Messages</span>
                                                            </Link>
                                                        </li>}

                                                    {viewMessageTemplates &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/messagetemplates">

                                                                <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                                <span className="nav-text">Message Templates</span>
                                                            </Link>
                                                        </li>}
                                                </ul>
                                            </li>



                                            <li className="accordion">

                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faBook} className="sidebarIcon" />

                                                    <span className="nav-text">Saved Contacts</span>
                                                    <span className="nav-caret"></span>
                                                </a>

                                                <ul className="nav-sub">
                                                    {createAddressBook &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/addressBook/upload">
                                                                <FontAwesomeIcon icon={faPencilAlt} className="sidebarIcon" />
                                                                <span className="nav-text">Upload New</span>
                                                            </Link>
                                                        </li>}

                                                    {manageAddressBook &&
                                                        <li className="nav-item">
                                                            <Link to="/portal/addressBook">
                                                                <FontAwesomeIcon icon={faBook} className="sidebarIcon" />
                                                                <span className="nav-text">View All</span>
                                                            </Link>
                                                        </li>
                                                    }



                                                </ul>
                                            </li>

                                            {/* <li className="accordion">

                                                <a href="#" className="i-con-h-a">

                                                    <FontAwesomeIcon icon={faCommentDots} className="sidebarIcon" />

                                                    <span className="nav-text">USSD</span>
                                                    <span className="nav-caret"></span>
                                                </a>
                                                <ul className="nav-sub">

                                                    <li className="nav-item">
                                                        <Link to="/portal/my-codes">

                                                            <FontAwesomeIcon icon={faPaperPlane} className="sidebarIcon" />

                                                            <span className="nav-text">My Codes</span>
                                                        </Link>
                                                    </li>
                                                    <li className="nav-item">
                                                        <Link to="/portal/new-code">

                                                            <FontAwesomeIcon icon={faPaperPlane} className="sidebarIcon" />

                                                            <span className="nav-text">New Code</span>
                                                        </Link>
                                                    </li>
                                                </ul>
                                            </li> */}

                                            <li className="nav-item">
                                                <Link to="/portal/my-documents">

                                                    <FontAwesomeIcon icon={faPaperPlane} className="sidebarIcon" />

                                                    <span className="nav-text">My Documents</span>
                                                </Link>
                                            </li>

                                            <li className="nav-item">
                                                <Link to="/portal/my-balances">

                                                    <FontAwesomeIcon icon={faCashRegister} className="sidebarIcon" />

                                                    <span className="nav-text">My Balances</span>
                                                </Link>
                                            </li>

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
                                                                    <Link to="/portal/users">
                                                                        <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                        <span className="nav-text">All Users</span>
                                                                    </Link>
                                                                </li>}

                                                            {createUsers &&
                                                                <li className="nav-item">
                                                                    <Link to="/portal/addusers">
                                                                        <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                        <span className="nav-text">Add Users</span>
                                                                    </Link>
                                                                </li>
                                                            }

                                                            {viewRoles &&
                                                                <li className="nav-item">
                                                                    <Link to="/portal/viewroles">
                                                                        <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                        <span className="nav-text">View Roles</span>
                                                                    </Link>
                                                                </li>}

                                                            {createRoles &&
                                                                <li className="nav-item">
                                                                    <Link to="/portal/addroles">
                                                                        <FontAwesomeIcon icon={faUser} className="sidebarIcon" />
                                                                        <span className="nav-text">Add Roles</span>
                                                                    </Link>
                                                                </li>}

                                                        </ul>
                                                    </li>


                                                </>
                                            }
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
