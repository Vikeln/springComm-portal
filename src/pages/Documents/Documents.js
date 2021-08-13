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
import tenantService from '../../services/tenant.service';
import { baseUrl, clientBaseUrl } from '../../API';

export default class Documents extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            sources: [],
            createSender: authService.checkIfRoleExists("CAN_CREATE_SENDER_ID"),
            products: [],
            docTypes: [],
            formData: {
                client: parseInt(authService.getCurrentClientId()),
                document: undefined
            },
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleChanges = this.handleChanges.bind(this);
        this.fetchDocuments = this.fetchDocuments.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.fetchMyTransactions = this.fetchMyTransactions.bind(this);


    }

    componentDidMount() {

        $(".view").hide();
        $(".view:first").show();
        this.fetchDocuments();
        this.fetchMyTransactions();
        $(".createSource").parsley();

    }

    componentDidUnMount() {

    }


    async fetchDocuments() {

        tenantService.getClientDocuments(authService.getCurrentClientId()).then(response => {

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



    handleChanges(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;

        let stateCopy = Object.assign({}, this.state);

        console.log("File " + el.target.files[0]);

        var reader = new FileReader();

        reader.readAsDataURL(el.target.files[0]);
        reader.onload = function () {
            stateCopy.formData["document"] = reader.result;
        };
        reader.onerror = function (error) {
            console.log('Error: ', error);
        };

        this.setState(stateCopy);


    }

    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;

        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);


    }

    fetchMyTransactions() {
        tenantService.getAllDocumentTypes().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    docTypes: response.data.data != null ? response.data.data : [],
                });


            } else {
                confirmAlert({
                    title: 'Error fetching your transactions',
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

    handleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();

        if ($(".createSource").parsley().isValid()) {
            tenantService.createClientDocuments(formData).then(response => {

                if (response.data.status != "error") {
                    confirmAlert({
                        title: 'Success!',
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
                        title: 'Error',
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

        const { sources, docTypes, createSender, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">My Documents</h2>

                        </div>


                        <div className="padding">

                            <div className="toggleMenu">
                                <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="viewall">Documents</button>
                                {createSender &&
                                    <button
                                        className="btn-primary"
                                        onClick={this.toggleView}
                                        data-target="createForm">Upload New Document</button>
                                }

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
                                            <th>Document</th>
                                            {/* <th>Document Name</th> */}
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
                                                            <span className="text-muted">{mes.docType}</span>
                                                        </td>

                                                        {/* <td>
                                                            <span className="text-muted">{mes.documentName}</span>
                                                        </td> */}

                                                        <td>
                                                            <a href={clientBaseUrl + "documents/download?docName=" + mes.documentName}>Download</a>

                                                        </td>

                                                    </tr>

                                                );

                                            })
                                        }

                                    </tbody>

                                </table>

                                {loading &&
                                    <Loader type="dots" />
                                }
                            </div>
                            <div className=" view createForm">

                                <form

                                    className="createSource"
                                    data-plugin="parsley"
                                    onSubmit={this.handleSubmission}>


                                    <div className="row">

                                        <div className="col-6">
                                            <label>Document  Type</label>

                                            <select
                                                name="docType"
                                                id="docType"
                                                className="form-control"
                                                data-parsley-required="true"
                                                onChange={this.handleChange} >
                                                <option></option>
                                                {docTypes != "" && docTypes.map((doc, index) =>
                                                    <option value={doc.code}> {doc.name}</option>
                                                )

                                                }
                                            </select>
                                        </div>
                                    </div>
                                    <div className="row">

                                        <div className="col-6">
                                            <label>Select Document</label>

                                            <input
                                                type="file"
                                                name="senderId"
                                                id="senderId"
                                                className="form-control"
                                                data-parsley-required="true"
                                                onChange={this.handleChanges} />
                                        </div>
                                    </div>

                                    <div className="row">

                                        <div className="col-12">

                                            <button
                                                className="btn-primary"
                                                type="submit" >Upload</button>

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
