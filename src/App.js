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


//ADMIN
import Senders from './pages/Admin/ManageSenders';
import Clients from './pages/Admin/Clients';
import SingleClient from './pages/Admin/ClientDetail';
import AddClient from './pages/Admin/AddClient';
import ViewCodes from './pages/Admin/Codes';
import NewCodes from './pages/Admin/NewCode';
import Pricing from './pages/Admin/Pricing';
import AdminAdminProfile from './pages/Admin/AdminProfile';
import Countries from './pages/Admin/Countries';


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

// Units
import Units from './pages/Units/Units';
import Purchase from './pages/Units/Purchase';
import IpayPurchase from './pages/Units/IpayPurchase';

// Codes
import Codes from './pages/USSD/Codes';
import Balances from './pages/USSD/Balances';
import NewCode from './pages/USSD/NewCode';

// Documents
import Documents from './pages/Documents/Documents';

// Messages and Communications Pages
import Messages from './pages/Messages/Messages';
import InboxMessages from './pages/Messages/InboxMessages';
import ScheduledMessages from './pages/Messages/ScheduledMessages';
import MessageTemplates from './pages/Templates/MessageTemplates';
import ViewMessageTemplate from './pages/Templates/ViewMessageTemplate';
import EditMessageTemplate from './pages/Templates/EditMessageTemplate';
import SendMessages from './pages/Messages/SendMessages';
import SendCustomMessages from './pages/Messages/SendCustomMessages';


import Header from './components/Header/Header';
import SideBar from './components/SideBar/SideBar';



import AuthService from './services/auth.service';
import authService from './services/auth.service';

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
      viewTrends: AuthService.checkIfRoleExists("CAN_VIEW_OUTBOX_TREND"),

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
        window.location.href = '/logout'

      }, AuthService.getUserLoggedInAt() - Math.floor(Date.now()));



    }

  }




  render() {

    const { authenticated } = this.state;

    return (

      <>


        <Router>

          {parseInt(authService.getCurrentClientId()) === 1 ? <>

            <AdminDashboard />
          </>
            :
            <>
              {authenticated == true ?
                <Route path='/' >
                  <Dashboard
                    createUsers={this.state.createUsers}
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
            </>
          }




        </Router>



      </>
    )
  }
}

function AdminDashboard() {

  return (
    <>
      <Header />
      <div id="main" className="layout-row flex">

        <SideBar />
        <Switch>

          <Route exact path="/dashboard/adminprofile">
            <AdminAdminProfile />
          </Route>

          <Route exact path="/logout">
            <Logout />
          </Route>

          <Route exact path="/dashboard/admin/sources">
            <Senders />
          </Route>

          <Route exact path="/dashboard/admin/clients">
            <Clients />
          </Route>

          <Route exact path="/dashboard/admin/viewclients/:id" component={SingleClient} />

          <Route exact path="/dashboard/admin/clients/new">
            <AddClient />
          </Route>

          <Route exact path="/dashboard/admin/ussd-codes">
            <ViewCodes />
          </Route>

          <Route exact path="/dashboard/admin/ussd-codes/new">
            <NewCodes />
          </Route>

          <Route exact path="/dashboard/admin/pricing">
            <Pricing />
          </Route>

          <Route exact path="/dashboard/admin/countries">
            <Countries />
          </Route>

          <Route exact path="/dashboard/sendmessages">
            <SendMessages />
          </Route>

          <Route exact path="/dashboard/users">
            <AllUsers />
          </Route>


          <Route exact path="/dashboard/addusers">
            <AddUser />
          </Route>


          <Route exact path="/dashboard/edituser/:id" component={EditUser} ></Route>

          <Route exact path="/dashboard/viewuser/:id" component={ViewUser} />

          <Route exact path="/dashboard/sendmessages">
            <SendMessages />
          </Route>
          <Route exact path="/dashboard/messages">
            <Messages />
          </Route>
          <Route exact path="/dashboard/inbox">
            <InboxMessages />
          </Route>

          <Redirect exact from='/auth/login' to='/dashboard/adminProfile' />


          <Redirect exact from='/auth/forgotpassword' to='/dashboard/adminProfile' />
          <Redirect exact from='/auth/resetpassword' to='/dashboardadminProfile' />

          <Route>
            <PageNotFound />
          </Route>




        </Switch>

      </div>
    </>
  )

}

function Dashboard(props) {


  const { createUsers, editUser, viewUsers, viewUserDetails, editRoles, viewRole, createRoles, viewOutbox, viewTrends, viewMessageTemplates } = props;


  return (
    <>
      <Header />
      <div id="main" className="layout-row flex">

        <SideBar />
        <Switch>

          <Route exact path="/dashboard/adminprofile">
              <>
                {viewTrends == true ?
                  <AdminProfile />
                  :
                  <Welcome />
                }
              </>
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

          <Route exact path="/dashboard/transactions/:id" component={IpayPurchase} />

          <Route exact path="/dashboard/purchase-units/:id" component={Purchase} />
          
          <Route exact path="/dashboard/ipay-purchase-units/:id" component={IpayPurchase} />

          <Route exact path="/dashboard/my-codes">
            <Codes />
          </Route>

          <Route exact path="/dashboard/my-balances">
            <Balances />
          </Route>

          <Route exact path="/dashboard/new-code">
            <NewCode />
          </Route>

          <Route exact path="/dashboard/my-documents">
            <Documents />
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
          <Route exact path="/dashboard/inbox">
            <InboxMessages />
          </Route>


          <Redirect exact from='/auth/login' to='/dashboard/adminProfile' />


          <Redirect exact from='/auth/forgotpassword' to='/dashboard/adminProfile' />
          <Redirect exact from='/auth/resetpassword' to='/dashboardadminProfile' />

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
