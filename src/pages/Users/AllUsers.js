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


export default class AllUsers extends Component {

    constructor(props) {

        super(props);

        this.state = {
            viewUsers: authService.checkIfRoleExists("CAN_VIEW_USERS"),
            value: this.props.value,
            users: [],
            emailSuccessful: "",
            loading:false

        }

        this.enableUser = this.enableUser.bind(this);

        this.unlockUserAccount = this.unlockUserAccount.bind(this);

        this.deactivateUser = this.deactivateUser.bind(this);

    }

    async componentDidMount() {

        await this.fetchUsers();

        //$("body").on("click",".enableUser",this.enableUser);


    }

    componentDidUnMount() {

    }

    fetchUsers() {

        this.setState({
            loading:true
        });

        UserService.getAllUsers().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    users: response.data.data,
                    loading:false,
                });

                //$('.table').bootstrapTable();
                $('.table').dataTable({});
                $(".table #table_filter input").attr("placeHolder","Search");

            }else{
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
                    loading:false,
                });
            }


        }).catch(error => {

            this.setState({
                loading:false,
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

    enableUser(username) {



        confirmAlert({
          title: 'Are you sure you want to enable '+username,
          message: 'Please proceed.',
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
                            title: 'Succesfully Activated '+username,
                            message: 'Please proceed.',
                            buttons: [
                              {
                                label: 'Yes',
                                onClick: () => window.location.reload()
                              }
                            ]
                          });

                      }else if(response.data.status == "error"){

                          confirmAlert({
                            title: 'Error Submitting Data for '+username,
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
    unlockUserAccount(id){
        
        confirmAlert({
            title: "Are you sure you want to unlock this user's account? ",
            message: 'Please proceed.',
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
  
                        }else if(response.data.status == "error"){
  
                            confirmAlert({
                              title: 'Error Submitting Data for '+id,
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

    deactivateUser(username) {



        UserService.deactivate(username).then(response => {



            if (response.data.status == "success") {

                this.setState({

                    emailSuccessful: response.data.message

                });



            }else{
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

    render() {

        const { users, viewUsers,loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                    <div className="page-title padding pb-0 ">

                        <h2 className="text-md mb-0">All Users</h2>

                    </div>


{viewUsers &&
                        <div className="padding">




                            <table
                                className="table table-theme v-middle table-row"
                                id="table"
                                data-toolbar="#toolbar"
                                data-search="true"
                                data-page-length='10'
                                data-show-columns="true"
                                data-show-export="true"
                                data-detail-view="true"
                                data-mobile-responsive="true"
                                data-pagination="true"
                                data-page-list="[5, 25, 50, 100, ALL]"
                            >

                                <thead>
                                    <tr>
                                        <th>User name</th>
                                        <th>First Name</th>
                                        <th>Last Name</th>
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
                                                        <span className="">{user.userName}</span>
                                                    </td>

                                                    <td>
                                                        <span className="">{user.firstName}</span>
                                                    </td>

                                                    <td>
                                                        <span className="">{user.lastName}</span>
                                                    </td>

                                                    <td>
                                                        <span className="">{user.role.name}</span>
                                                    </td>

                                                    <td>
                                                        <span className="">{user.email}</span>
                                                    </td>

                                                    <td>
                                                        <span className=""><Badge description={user.enabled.toString()}
                                                        type={user.enabled.toString()}/></span>
                                                    </td>

                                                    <td>
                                                        <div className="item-action dropdown">
                                                            <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                            <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                                <Link className="dropdown-item" to={'/dashboard/viewuser/' + user.id}>
                                                                    See detail
                                                                        </Link>

                                                                <Link className="dropdown-item" to={'/dashboard/edituser/' + user.id}>
                                                                    Edit
                                                                        </Link>

                                                                        {!user.enabled &&
                                                                    <button
                                                                        className="dropdown-item enableUser"
                                                                        onClickCapture={(e) =>
                                                                            this.enableUser(user.userName)
                                                                        }
                                                                    >Enable {user.userName}</button>}

                                                                    {user.enabled &&
                                                                    <button
                                                                        className="dropdown-item enableUser"
                                                                        onClickCapture={() =>
                                                                            this.deactivateUser(user.id)
                                                                        }
                                                                    >DeActivate {user.userName}</button>}
                                                                    {user.accountLocked &&
                                                                    <button
                                                                        className="dropdown-item unlockUser"
                                                                        onClickCapture={() =>
                                                                            this.unlockUserAccount(user.id)
                                                                        }
                                                                    >Unlock {user.userName}'s Account </button>}

                                                            </div>

                                                        </div>
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
                            <Loader type="circle" />
                        }


                    </div>

                </div>
            </>

        )

    }

}