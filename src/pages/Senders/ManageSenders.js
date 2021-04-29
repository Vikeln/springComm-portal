/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import SourceService from '../../services/source.service';
import {
    Link
} from "react-router-dom";
import utils from "../../utils/utils";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';
import authService from '../../services/auth.service';

export default class ManageSenders extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            sources: [],
            createSender: authService.checkIfRoleExists("CAN_CREATE_SENDER_ID"),
            products: [],
            formData: {
                status: "NEW"
            },
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMySenders = this.fetchMySenders.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.toggleView = this.toggleView.bind(this);


    }

    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        this.fetchMySenders();

    }

    componentDidUnMount() {

    }


    async fetchMySenders() {

        SourceService.getAllSources().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
                });


            } else {
                confirmAlert({
                    title: 'Error fetching your sources',
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



    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);


    }

    handleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createSource").parsley().isValid()) {
            SourceService.createSource(formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Succesfully Created your source!',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => window.location.reload()
                            }
                        ]
                    });

                } else {
                    confirmAlert({
                        title: 'Error Submitting Data for your source',
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

    toggleView(event) {

        $(".toggleMenu button").removeClass("active");
        $(event.target).addClass("active");

        this.setState({

            defaultView: event.target.dataset.target,

        }, () => {

            if (this.state.defaultView == "createForm") {



                $(".createTemplate").parsley();
            }

        });

        $(".view").hide();
        $(".view." + event.target.dataset.target).show();


    }


    render() {

        const { sources,createSender, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">My SenderIDs</h2>

                        </div>


                        <div className="padding">

                            <div className="toggleMenu">
                                {/* <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="viewall">View SenderIDs</button>
                                {createSender &&
                                 <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="createForm">Add New SenderIDs</button>
                                    } */}

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
                                    data-search-align="left"
                                    data-show-columns="true"
                                    data-show-export="true"
                                    data-detail-view="true"
                                    data-mobile-responsive="true"
                                    data-pagination="true"
                                    data-page-list="[10, 25, 50, 100, ALL]"
                                >

                                    <thead>
                                        <tr>
                                            <th>ID</th>
                                            <th>SenderId</th>
                                            <th>Provider</th>
                                            <th>Date Created</th>
                                            <th>Status</th>
                                            <th>Balance</th>
                                            <th></th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {sources != "" &&
                                            sources.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={mes.id} >


                                                        <td>
                                                            <span className="text-muted">{mes.id}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.senderId}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.provider !=undefined ? mes.provider : "SAFARICOM"}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{utils.formatDateString(mes.dateTimeCreated)}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.status}</span>
                                                        </td>
                                                        <td>
                                                            <span className="text-muted">KES {mes.smsBalance}</span>
                                                        </td>

                                                        {/* <td>
                                                            <div className="item-action dropdown">
                                                                <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                                    <Link className="dropdown-item" to={'/dashboard/edittimelinestates/' + mes.stateId}>
                                                                        Edit
                                                                        </Link>

                                                                </div>

                                                            </div>
                                                        </td> */}


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

                            <form

                                className="createSource view createForm"
                                onSubmit={this.handleSubmission}>
                                <div
                                    className="row">

                                    <div
                                        className="col-6">

                                        <label>Sender Id</label>

                                        <input
                                            type="text"
                                            name="senderId"
                                            id="senderId"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange} />
                                    </div>

                                    <div
                                        className="col-6">

                                        <label>Alphanumeric</label>

                                        <input
                                            type="text"
                                            name="alphanumeric"
                                            id="alphanumeric"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange} />
                                    </div>


                                    <div
                                        className="col-6">

                                        <label>Short Code</label>

                                        <input
                                            type="text"
                                            name="shortCode"
                                            id="shortCode"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange} />
                                    </div> 
                                    <div
                                        className="col-6">

                                        <label>Provider</label>
                                            
                                        <select
                                            type="text"
                                            name="provider"
                                            id="provider"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange} >
                                                <option></option>
                                                <option value="SAFARICOM">SAFARICOM</option>
                                                <option value="AIRTEL">AIRTEL</option>
                                                <option></option>
                                            </select>
                                    </div>



                                </div>

                                <div className="row">

                                    <div className="col-12">

                                        <button
                                            className="btn-primary"
                                            type="submit">Create Source</button>

                                        <button className="btn-primary" type="reset">Cancel</button>

                                    </div>


                                </div>

                            </form>

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
