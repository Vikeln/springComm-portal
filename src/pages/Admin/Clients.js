/* global $ */

import React, { Component } from 'react';


import {
    Link
} from "react-router-dom";


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import tenantService from '../../services/tenant.service';


export default class Clients extends Component {

    constructor(props) {

        super(props);

        this.state = {
            value: this.props.value,
            users: [],
            emailSuccessful: "",
            loading: false,

        }

    }

    async componentDidMount() {

        await this.fetchUsers();
    }

    componentDidUnMount() {

    }

    fetchUsers() {

        this.setState({
            loading: true
        });

        tenantService.getAllClients().then(response => {



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



    render() {

        const { users, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Clients</h2>

                        </div>


                        {!loading ?
                            <div className="padding">


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
                                            <th>Name</th>
                                            <th>Client Type</th>
                                            <th>Country </th>
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
                                                            <span className="">{user.name}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.clientType}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.country.countryName}</span>
                                                        </td>


                                                        <td>
                                                            <span className="">{user.email}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">
                                                                <Badge description={user.status.toString()}
                                                                type={user.status.toString()} />
                                                                </span>
                                                        </td>

                                                        <td>
                                                            <div className="item-action dropdown">
                                                                <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                                    <Link className="dropdown-item" to={'/dashboard/admin/viewclients/' + user.id}>
                                                                        See detail
                                                                    </Link>
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


                            :
                            <Loader type="dots" />
                        }


                    </div>

                </div>
            </>

        )

    }

}
