/* global $ */

import React,{Component} from 'react';

import {
  Link
} from "react-router-dom";

import UserService from '../../services/user.service';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';
import authService from '../../services/auth.service';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEye, faPen } from '@fortawesome/free-solid-svg-icons';


export default class ViewRoles extends Component{

    constructor(props){

        super(props);

        this.state ={

            editRoles: authService.checkIfRoleExists("CAN_EDIT_ROLES"),
            value:this.props.value,
            roles: [],
            loading:false


        }

    }

    async componentDidMount(){

        await this.fetchUsers();


    }

    componentDidUnMount(){

    }



    fetchUsers() {


        UserService.getUserRoles().then(response => {



            if(response.data.status != "error"){

                this.setState({
                    roles: response.data.data,
                });

                $('.table').bootstrapTable();

            }else{

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

    render(){

        const {roles, editRoles} = this.state;

        return(

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                            <div className="page-title padding pb-0 ">

                                <h2 className="text-md mb-0">View Roles</h2>

                            </div>



                            <div className="padding">

                            <a class="float-right" href="/portal/addroles">
                                <button className="btn btn-primary"><i className="fa fa-pen">Add New</i></button></a>


<br/>
<br/>
                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>

                                <table
                                    className="table table-theme v-middle table-row" data-plugin="bootstrapTable"
                                    id="table"
                                    data-toolbar="#toolbar"
                                    data-search="true"
                                    data-search-align="right"
                                    data-show-columns="true"
                                    data-show-export="true"
                                    data-detail-view="false"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>Role Id</th>
                                            <th>Role Name</th>

                                            <th>Actions </th>

                                        </tr>
                                    </thead>

                                    <tbody>

                                        {roles != "" &&
                                            roles.map((role, index) => (
                                                <tr className=" " key={role.id}>

                                                    <td>
                                                        <span className="text-muted">
                                                            {role.id}
                                                        </span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">
                                                            {role.name}
                                                        </span>
                                                    </td>


                                                    <td>
                                                         {/*  <div className="item-action dropdown">
                                                            <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                            <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                           


                                                              <Link className="dropdown-item" to={'/portal/singlerole/'+role.id}>
                                                                    See detail
                                                                </Link>

                                                                { editRoles && <Link className="dropdown-item" to={'/portal/editrole/'+role.id}>
                                                                    Edit
                                                                </Link>}

                                                            </div>

                                                        </div> */}
                                                         <span className="padding">
                                                                <a href={'/portal/singlerole/' + role.id} >
                                                                    <FontAwesomeIcon icon={faEye} color="#49bcd7"></FontAwesomeIcon>
                                                                </a>
                                                            </span>
                                                            {editRoles &&
                                                                <span className="padding">
                                                                    <a href={'/portal/editrole/' + role.id} >
                                                                        <FontAwesomeIcon icon={faPen} color="#49bcd7"></FontAwesomeIcon>
                                                                    </a>
                                                                </span>
                                                            }
                                                    </td>

                                                </tr>
                                          ))
                                      }

                                  </tbody>

                                </table>

                            </div>



                    </div>

                </div>
            </>

        )

    }

}
