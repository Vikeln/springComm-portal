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

export default class UploadContacts extends Component {

    constructor(props) {

        super(props);

        this.state = {

            loans: [],
            uploads: [],
            selectedFile: "",
            connectionError: false,
            loading: false,
            uploading: false,
            removedIndices: []

        }

        this.openAdvancedSearch = this.openAdvancedSearch.bind(this);
        this.openFileUploader = this.openFileUploader.bind(this);
        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);
        this.removeContact = this.removeContact.bind(this);
        this.confirmUploads = this.confirmUploads.bind(this);

    }

    async componentDidMount() {

        $(".advancedSearchButton").click(this.openAdvancedSearch);
        $(".upload").click(this.openFileUploader);
        $(".upload-download").click(this.downloadTemplate);


    }

    removeContact(index) {

        console.log("index => " + index);

        if (!this.state.removedIndices.includes(index)) {
            let stateCopy = Object.assign({}, this.state);

            stateCopy.removedIndices[this.state.removedIndices.length + 1] = index;

            this.setState(stateCopy);
        }
    }

    onFileChange(event) {


        if (event.target.files.length > 0) {

            var fileName = event.target.files[0].name;

            // Update the state
            this.setState({ selectedFile: event.target.files[0] });

            $(".uploadLabel").text("Upload " + fileName);

        } else {

            this.setState({ selectedFile: "" });
            $(".uploadLabel").text("Choose File To Upload as xls(excel)");
            $("#fileUpload").val("");

        }


    }

    // On file upload (click the upload button)
    onFileUpload() {

        if (this.state.selectedFile != "") {

            this.setState({
                uploading: true
            });
            // Create an object of formData
            const formData = new FormData();

            // Update the formData object
            formData.append(
                "file",
                this.state.selectedFile
            );

            // Details of the uploaded file
            console.log(this.state.selectedFile);

            AddressBookService.createUploadContacts(formData).then(response => {
                console.log(response.data);
                if (response.data.status == "success") {

                    this.setState({
                        uploading: false,
                        uploads: response.data.data
                    });

                    this.openFileUploader();
                } else {

                    this.setState({
                        uploading: false
                    });
                    confirmAlert({
                        title: 'Error Uploading file',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'ok',

                            }
                        ]
                    });

                    $(".uploadLabel").text("Choose File To Upload as xls(excel)");
                    $("#fileUpload").val("");
                }
            }).catch(error => {
                confirmAlert({
                    title: 'Error Uploading file',
                    message: error.message,
                    buttons: [
                        {
                            label: 'ok',

                        }
                    ]
                });

                this.setState({ selectedFile: "" });

                $(".uploadLabel").text("Choose File To Upload as xls(excel)");
                $("#fileUpload").val("");
            });




        } else {

            confirmAlert({

                title: 'Upload File',
                message: 'Please upload file to proceed.',
                buttons: [
                    {
                        label: 'ok',
                    }
                ]
            });

        }



    }
    confirmUploads(event) {
        event.preventDefault();

        console.log("data approved =>   " + JSON.stringify(this.state.uploads));
        AddressBookService.createContacts(this.state.uploads).then(response => {
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
                    title: 'Upload Success',
                    message: 'Your contacts have been uploaded succesfully.',
                    buttons: [
                        {
                          label: 'Yes',
                          onClick: () => window.location.href ="/dashboard/addressBook"
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
        })
    }

    openAdvancedSearch() {

        $(".advancedSearch").stop().slideToggle();

    }


    openFileUploader() {

        $(".uploadFile").stop().slideToggle();

    }


    downloadTemplate() {
        AddressBookService.getCustomerUploadFile().then(response => {
            console.log(response.data);

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
        })
    }

    componentDidUnMount() {

    }

    render() {

        const { uploads, loading, uploading } = this.state;

        return (

            <>

                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        {/* Advanced Search */}

                        <div className="buttonContainer padding pt-0 pb-0">


                            <div className="row advancedSearchOptions ">
                                

                                <div className="col-7 secondaryActions">
<a
                                    className="btn-rounded upload-download"
                                    href="/assets/files/ContactsUploadTemplate.xlsx"
                                    download>

                                    <span className="">
                                        <i className="i-con i-con-download">
                                            <i></i>
                                        </i>
                                    </span>Download Template</a>
  
                                    <button className="btn-rounded upload">

                                        <span className="">
                                            <i className="i-con i-con-upload">
                                                <i></i>
                                            </i>
                                        </span>Upload Contacts
                                    </button>



                                </div>

                            </div>


                        </div>

                        {/* File Upload */}
                        <div className=" padding pt-0 pb-0">

                            <div className="uploadFile">
                                <input type="file"
                                    name="fileUpload"
                                    id="fileUpload"
                                    className="fileUpload"
                                    placeholder="Upload Customer Template"
                                    onChange={this.onFileChange}
                                    accept=".xls,.xlsx,.csv" />

                                <label htmlFor="fileUpload" className="uploadLabel">Choose File To Upload as xls(excel)</label>

                                <button
                                    className="btn-primary"
                                    onClick={this.onFileUpload}>
                                    Upload!
                            </button>

                                {uploading &&
                                    <Loader type="circle" />
                                }

                            </div>

                        </div>
                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Uploaded Contacts </h2>

                        </div>

                        <div className="padding">
                            {uploads != "" &&

                                <button
                                    className="btn-primary"
                                    onClick={this.confirmUploads}>
                                    Save Contacts</button>

                            }
                            <table
                                className="table table-theme v-middle table-row contactsTable" data-plugin="bootstrapTable"
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

                                        {/* User Id */}
                                        <th data-sortable="true" data-field="id">Selected</th>
                                        {/* End User Id*/}

                                        {/* Customer Name */}
                                        <th data-sortable="true">Name</th>
                                        {/* End Customer Name */}

                                        {/* Phone Number */}
                                        <th data-sortable="true">Phone Number</th>
                                        {/* End Phone Number */}

                                        <th data-sortable="true">Email</th>
                                        {/* End Email */}

                                    </tr>
                                </thead>
                                <tbody>

                                    {uploads != "" &&
                                        uploads.map((upload, index) => (
                                            <tr className=" " data-id={upload.phone} key={index}>

                                                <td>

                                                    <input type="checkbox" defaultChecked={true} onChange={this.removeContact(index)} ></input>
                                                </td>

                                                <td>
                                                    <span className="item-amount text-sm ">
                                                        {upload.name}
                                                    </span>
                                                </td>

                                                <td>
                                                    <span className="item-amount text-sm ">
                                                        {upload.phone}
                                                    </span>
                                                </td>
                                                <td>
                                                    <small className="text-muted">{upload.email}</small>
                                                </td>



                                            </tr>
                                        ))
                                    }

                                </tbody>
                            </table>



                            {loading &&
                                <Loader type="circle" />
                            }

                        </div>
                    </div>

                </div>


            </>

        )

    }

}
