/* global $ */
import React, { Component } from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';


// User and Role Mangement
import AllUsers from './pages/Users/AllUsers';
import AddUser from './pages/Users/AddUser';
import EditUser from './pages/Users/EditUser';
import ViewUser from './pages/Users/ViewUser';

import AdminProfile from './pages/AdminProfile/AdminProfile';
import Welcome from './pages/AdminProfile/Welcome';

// Contacts Management Views
import UploadContacts from './pages/AddressBook/UploadContacts';
import ManageContacts from './pages/AddressBook/ManageContacts';


import ManageSenders from './pages/Senders/ManageSenders';
import Integration from './pages/Integration/Integration';


// Role Management Views
import CreateRole from './pages/Users/CreateRole';
import ViewRoles from './pages/Users/ViewRole';
import EditRole from './pages/Users/EditRole';
import SingleRole from './pages/Users/SingleRole';

// Authentication Views
import Login from './pages/Login/Login';
import Register from './pages/Login/Register';
import Logout from './pages/Login/Logout';
import ResetPassword from './pages/ResetPassword/ResetPassword';
import ForgotPassword from './pages/ResetPassword/ForgotPassword';

// 404 and Redirects
import PageNotFound from './pages/404/404';
import LoginRedirect from './pages/404/LoginRedirect';



// Messages and Communications Pages

import Messages from './pages/Messages/Messages';
import ScheduledMessages from './pages/Messages/ScheduledMessages';
import MessageTemplates from './pages/Templates/MessageTemplates';
import ViewMessageTemplate from './pages/Templates/ViewMessageTemplate';
import EditMessageTemplate from './pages/Templates/EditMessageTemplate';
import SendMessages from './pages/Messages/SendMessages';
import SendCustomMessages from './pages/Messages/SendCustomMessages';


import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';



import AuthService from './services/auth.service';

export default class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      viewUsers: AuthService.checkIfRoleExists("CAN_VIEW_USERS"),
      createUsers: AuthService.checkIfRoleExists("CAN_CREATE_USERS"),
      viewUserDetails: AuthService.checkIfRoleExists("CAN_VIEW_USERS"),
      editUser: AuthService.checkIfRoleExists("CAN_EDIT_USERS"),

      editRoles: AuthService.checkIfRoleExists("CAN_EDIT_ROLES"),
      viewRole: AuthService.checkIfRoleExists("CAN_VIEW_ROLES"),
      createRoles: AuthService.checkIfRoleExists("CAN_CREATE_ROLES"),
      viewTrends:AuthService.checkIfRoleExists("CAN_VIEW_OUTBOX_TREND"),

      viewOutbox: AuthService.checkIfRoleExists("CAN_VIEW_OUTBOX"),
      viewMessageTemplates: AuthService.checkIfRoleExists("CAN_VIEW_MESSAGE_TEMPLATES"),
      loading: false,
      authenticated: false,
    }
  }

  componentDidMount() {
    if (AuthService.getCurrentUser() == null) {
      this.setState({
        authenticated: false,
      });

    } else {

      this.setState({
        authenticated: true,
      });



      setTimeout(function () {
        confirmAlert({
          title: "Session Timed Out",
          message: 'Your session has timed out and you will be logged out now.',
          closeOnEscape: false,
          closeOnClickOutside: false,
          buttons: [
            {
              label: 'Ok',
              onClick: () => window.location.href = '/logout'
            }
          ]
        });

      }, AuthService.getUserLoggedInAt() - Math.floor(Date.now()));



    }

  }




  render() {

    const { authenticated } = this.state;

    return (

      <>


        <Router>



          {authenticated == true ?



            <Route path='/' >
              <Dashboard createUsers={this.state.createUsers}
                viewUsers={this.state.viewUsers}
                viewUserDetails={this.state.viewUserDetails}
                viewRole={this.state.viewRole}
                createRoles={this.state.createRoles}
                viewTrends={this.state.viewTrends}
                viewOutbox={this.state.viewOutbox}
                viewMessageTemplates={this.state.viewMessageTemplates}
                editUser={this.state.editUser}
                editRoles={this.state.editRoles} />
            </Route>


            :

            <Route path='/' >

              <Authentication />

            </Route>


          }


        </Router>



      </>
    )
  }
}

function Dashboard(props) {


  const { createUsers, editUser, viewUsers, viewUserDetails, editRoles, viewRole, createRoles, viewOutbox,viewTrends, viewMessageTemplates } = props;


  return (
    <>
      <Header />
      <div id="main" className="layout-row flex">

        <SideBar />
        <Switch>

          <Route exact path="/dashboard/">
            {viewTrends == true ?
              <AdminProfile />
              :
              <Welcome />
            }
          </Route>


          <Route exact path="/dashboard/welcome">
            <Welcome />
          </Route>

          <Route exact path="/logout">
            <Logout />
          </Route>

          <Route exact path="/dashboard/addressBook/upload">
            <UploadContacts />
          </Route>

          <Route exact path="/dashboard/addressBook">
            <ManageContacts />
          </Route>

          <Route exact path="/dashboard/mysenderIds">
            <ManageSenders />
          </Route>

          {viewUsers == true &&
            <Route exact path="/dashboard/users">
              <AllUsers />
            </Route>
          }

          {createUsers == true &&
            <Route exact path="/dashboard/addusers">
              <AddUser />
            </Route>
          }


          {editUser == true && <Route exact path="/dashboard/edituser/:id" component={EditUser} ></Route>}

          {viewUserDetails == true && <Route exact path="/dashboard/viewuser/:id" component={ViewUser} />}

          {createRoles == true && <Route exact path="/dashboard/addroles">
            <CreateRole />
          </Route>}

          {viewRole == true && <Route exact path="/dashboard/viewroles">
            <ViewRoles />
          </Route>}

          {editRoles == true && <Route exact path="/dashboard/editrole/:id" component={EditRole} ></Route>}

          {viewRole == true && <Route exact path="/dashboard/singlerole/:id" component={SingleRole}></Route>}

          <Route exact path="/dashboard/integration">
            <Integration />
          </Route>



          {viewUsers == true ?

            <Route exact path="/dashboard/adminprofile">
              <AdminProfile />
            </Route>

            :
            ""
          }

          {viewOutbox == true && <Route exact path="/dashboard/messages">
            <Messages />
          </Route>}

          {viewOutbox == true && <Route exact path="/dashboard/scheduled-messages">
            <ScheduledMessages />
          </Route>}


          {viewMessageTemplates == true && <Route exact path="/dashboard/messagetemplates">
            <MessageTemplates />
          </Route>}

          {viewMessageTemplates == true &&
            <Route exact path="/dashboard/viewmessagetemplate/:id" component={ViewMessageTemplate}>

            </Route>
          }

          {viewMessageTemplates == true &&
            <Route exact path="/dashboard/editmessagetemplate/:id" component={EditMessageTemplate}>

            </Route>
          }

          {viewOutbox == true &&
            <Route exact path="/dashboard/sendmessages">
              <SendMessages />
            </Route>
          }
          {viewOutbox == true &&
            <Route exact path="/dashboard/custommessages">
              <SendCustomMessages />
            </Route>
          }


          <Redirect exact from='/auth' to='/dashboard' />

          <Redirect exact from='/auth/login' to='/dashboard' />

          <Redirect exact from='/auth/forgotpassword' to='/dashboard' />
          <Redirect exact from='/auth/resetpassword' to='/dashboard' />

          <Route>
            <PageNotFound />
          </Route>




        </Switch>

      </div>
    </>
  )

}

function Authentication() {


  return (

    <>
      <Switch>



        <Route path='/auth/login' >
          <Login />
        </Route>

        <Route path='/auth/resetpassword/:userID' component={ResetPassword} />

        <Route path='/auth/forgotpassword'>
          <ForgotPassword />
        </Route>

        <Route path='/auth/register'>
          <Register />
        </Route>

        <Route>
          <LoginRedirect />
        </Route>




      </Switch>
    </>

  )

}
