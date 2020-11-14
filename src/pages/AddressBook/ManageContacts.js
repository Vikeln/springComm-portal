/* global $ */

import React, { Component } from 'react';


import {
    Link
} from "react-router-dom";


import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import AddressBookService from '../../services/addressbook.service';


export default class ManageContacts extends Component {

    constructor(props) {

        super(props);

        this.state = {
            viewUsers: true,
            value: this.props.value,
            users: [],
            emailSuccessful: "",
            loading: false

        }

    }

    async componentDidMount() {

        await this.fetchContacts();

        //$("body").on("click",".enableUser",this.enableUser);


    }

    componentDidUnMount() {

    }

    fetchContacts() {

        this.setState({
            loading: true
        });

        AddressBookService.getAllContacts().then(response => {

            if (response.data.status != "error") {

                this.setState({
                    users: response.data.data,
                    loading: false,
                });

                //$('.table').bootstrapTable();
                $('.table').dataTable({});
                $(".table #table_filter input").attr("placeHolder", "Search");

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

        const { users, viewUsers, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Address Book</h2>

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
                                            <th>Name</th>
                                            <th>Phone Number</th>
                                            <th>Email </th>
                                            <th>Grouping</th>

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
                                                            <span className="">{user.phone}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.email}</span>
                                                        </td>

                                                        <td>
                                                            <span className="">{user.grouping}</span>
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
