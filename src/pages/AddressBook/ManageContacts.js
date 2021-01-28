/* global $ */


import React, { Component } from 'react';


import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
// import Modal from 'react-modal';
import ReactModal from 'react-modal';
import Loader from '../../components/loaders/Loader';

import Badge from '../../components/notifications/Badge';

import AddressBookService from '../../services/addressbook.service';
export default class ManageContacts extends Component {

    constructor(props) {

        super(props);

        this.state = {
            showModal: false,
            viewUsers: true,
            value: this.props.value,
            users: [],
            formData: {
                id: null
            },
            emailSuccessful: "",
            loading: false

        }
        this.handleChange = this.handleChange.bind(this);
        this.handleMessageSubmission = this.handleMessageSubmission.bind(this);
        this.toggleView = this.toggleView.bind(this);

    }

    toggleView(event) {

        $(".toggleMenu button").removeClass("active");
        $(event.target).addClass("active");

        this.setState({

            defaultView: event.target.dataset.target,

        }, () => {

            if (this.state.defaultView == "createContacts") {



                $(".createContact").parsley();
            }

        });

        $(".view").hide();
        $(".view." + event.target.dataset.target).show();


    }
    handleMessageSubmission(event) {

        event.preventDefault();
        const { formData } = this.state;

        if ($(".createContact").parsley().isValid()) {

            console.log(formData);
            AddressBookService.createContact(formData).then(response => {
                console.log(response.data);
                if (response.data.status != "success") {
                    confirmAlert({
                        title: 'Error occurred',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });
                } else {
                    confirmAlert({
                        title: 'Contact creation Success!',
                        message: 'Your contacts have been created succesfully.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => window.location.href = "/dashboard/addressBook"
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


    }

    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;
        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData[inputName] = inputValue;
        this.setState(stateCopy);
    }

    async componentDidMount() {

        await this.fetchContacts();

        //$("body").on("click",".enableUser",this.enableUser);

        $(".view").hide();
        $(".view:first").show();

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

        const { successfulSubmission, users, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">My Contacts</h2>

                        </div>


                        <div className="padding">

                            <div className="toggleMenu">
                                <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="viewall">View Contacts</button>
                                <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="createContacts">Add New Contact</button>

                            </div>

                            <div className="view viewall">

                                <div id="toolbar">
                                    <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                                </div>

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



                                {loading &&
                                    <Loader type="circle" />
                                }
                            </div>

                            <div className="view createContacts">
                                <form

                                    className="createContact"
                                    onSubmit={this.handleMessageSubmission}>
                                    <div
                                        className="row">
                                        <div
                                            className="col-12">
                                            <div className="col-4">

                                                <label>Phone Number</label>
                                                <input
                                                    type="text"
                                                    name="phone"
                                                    id="phone"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    data-parsley-minlength="12"
                                                    data-parsley-maxlength="12"
                                                    onChange={this.handleChange}
                                                />

                                            </div>
                                            <div className="col-4">

                                                <label>Contact Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                            </div>
                                            <div className="col-4">

                                                <label>Contact Email</label>
                                                <input
                                                    type="text"
                                                    name="email"
                                                    id="email"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                            </div>
                                            <div className="col-4">

                                                <label>Contact Grouping</label>
                                                <input
                                                    type="text"
                                                    name="group"
                                                    id="group"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                            </div>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-12 mr-auto">

                                            <button
                                                className="btn-primary"
                                                type="submit">Save</button>

                                            <button className="btn-primary" type="reset">Cancel</button>

                                        </div>


                                    </div>
                                </form>

                            </div>
                            {successfulSubmission &&
                                <Notification
                                    type="success"
                                    description={submissionMessage} />
                            }

                            {networkError &&
                                <Notification
                                    type="network"
                                    description="Network Connection Issue, please check your internet connection and try again"
                                />
                            }



                        </div>



                    </div>

                </div>
            </>

        )

    }

}
