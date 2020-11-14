/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import CommunicationsService from '../../services/communications.service';
import AddressBookService from '../../services/addressbook.service';
import SourceService from '../../services/source.service';
import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

export default class SendMessages extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            messageTemplates: [],
            sources: [],
            uploads: [],
            selectedFile: "",
            contacts: [],
            template: null,
            message: "",
            uploading: false,
            formData: {
                parameters: "",
                parameterValues: ""

            }, errors: "",
            parameters: "",
            sendFromTemplate: false,
            selectFromAddressBook: false,
            sendTime: false,
            sendOnce: false,
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            defaultView: "viewall"

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleMessageSubmission = this.handleMessageSubmission.bind(this);
        this.fetchMessageTemplates = this.fetchMessageTemplates.bind(this);
        this.fetchContacts = this.fetchContacts.bind(this);
        this.fetchSources = this.fetchSources.bind(this);

        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);


    }

    componentDidMount() {

        // $(".fetchMessages").parsley();
        $(".startdate").datepicker({
            format: 'mm/dd/yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        });

        $('#datetimepicker3').datepicker({
            format: 'LT'
        });

        this.fetchMessageTemplates();
        this.fetchContacts();
        this.fetchSources();
        $(".uploader").click(this.openFileUploader);
        $(".upload-download").click(this.downloadTemplate);



    }

    componentDidUnMount() {

    }

    async fetchMessageTemplates() {


        CommunicationsService.getAllMessageTemplates().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    messageTemplates: response.data.data != null ? response.data.data : [],
                });

                $('.table').bootstrapTable();

            } else {
                confirmAlert({
                    title: 'Error fetching templates',
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
    async fetchSources() {

        SourceService.getAllActiveSources().then(response => {

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
    async fetchContacts() {


        AddressBookService.getAllContacts().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    contacts: response.data.data != null ? response.data.data : [],
                });


            } else {
                confirmAlert({
                    title: 'Error fetching your address book',
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

    onFileChange(event) {


        if (event.target.files.length > 0) {

            var fileName = event.target.files[0].name;

            // Update the state
            this.setState({ selectedFile: event.target.files[0] });

            $(".uploadLabel").text("Upload " + fileName);
            $(".uploadButton").removeAttr("hidden");
            $("#uploadButtons").hide();
            $("#upload-download").hide();

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

                this.setState({
                    uploading: false
                });
                if (error) {
                    confirmAlert({
                        title: 'Error!',
                        message: "The file you uploaded contains errors. Please download the temlate and edit it accordingly",
                        buttons: [
                            {
                                label: 'ok',

                            }
                        ]
                    });
                }
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

    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;
        let userGroups = [];
        let stateCopy = Object.assign({}, this.state);
        if (inputName == "message") {

            var templateString = inputValue;
            var params = templateString.match(/{{(.*?)}}/g);



            if (params != null && params.length > 0) {

                var paramsText = params.toString();
                var paramsWithoutBraces = paramsText.replace(/{{|}}/gi, "");

                stateCopy.formData.parameterValues = paramsWithoutBraces.split(",");
                stateCopy.formData[inputName] = inputValue;
                stateCopy.message = inputValue;

                //this.setMessageParams(params);

            } else {
                stateCopy.formData.message = inputValue;
            }

            this.setState(stateCopy);


        } else if (inputName === "recipients") {
            let userGroups = inputValue.split(",");
            stateCopy.formData.recipient = userGroups;

        } else if (inputName === "recipient") {

            for (var i = 0, l = options.length; i < l; i++) {

                if (options[i].selected) {
                    userGroups.push(parseInt(options[i].value));
                }

            }

            stateCopy.formData[inputName] = userGroups;
        } else if (inputName === "source") {
            stateCopy.formData.source = parseInt(inputValue);

        } else if (inputName === "sendOnce") {
            stateCopy.formData.sendOnce = inputValue;
        } else if (inputName === "sendTime") {
            stateCopy.formData.sendTime = inputValue;

        } else if (inputName === "selectFromAddressBook") {

            stateCopy.selectFromAddressBook = inputValue;
            stateCopy.formData.recipient = [];
            stateCopy.uploads = [];


        } else if (inputName === "sendFromTemplate") {
            if (inputValue != "true") {
                stateCopy.formData.template = "";
                stateCopy.message = "";
                stateCopy.formData.message = "";
                stateCopy.formData.parameters = [];
                stateCopy.formData.parameterValues = [];
            }
            stateCopy.formData.sendFromTemplate = inputValue;

        } else if (inputName === "template") {

            var templ = this.state.messageTemplates.find(x => x.id === parseInt(inputValue));

            stateCopy.template = templ;

            var tem = templ.template;

            stateCopy.message = tem;


            stateCopy.formData.parameters = tem.match(/{{(.*?)}}/g).toString().replace(/{{|}}/gi, "").split(",");

            stateCopy.formData[inputName] = parseInt(inputValue);

        } else {

            stateCopy.formData[inputName] = inputValue;


        }
        this.setState(stateCopy);
    }

    handleMessageSubmission(event) {

        event.preventDefault();
        const { formData } = this.state;

        if (formData.sendFromTemplate == "true") {

            if (formData.parameterValues.length < 1) {

                alert("Please set the value of the parameter you want to send");

            }
        }
        if (formData.recipient.length < 1) {

                alert("Please set a recipient list");
        }


        if ($(".sendMessage").parsley().isValid()) {
            console.log(JSON.stringify(formData));

            CommunicationsService.createMessage(formData).then(response => {

                if (response.data.status != "error") {
                    window.location.href = "/dashboard/messages";

                } else {
                    confirmAlert({
                        title: 'Error sending messages',
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



    }


    render() {

        const { messageTemplates, uploading, sources, sendOnce, sendTime, sendFromTemplate, selectFromAddressBook, contacts, message, successfulSubmission, networkError, submissionMessage } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Send Message</h2>

                        </div>


                        <div className="padding">

                            <form

                                className="sendMessage"
                                onSubmit={this.handleMessageSubmission}>
                                <div
                                    className="row">

                                    <div
                                        className="col-12 row">
                                        <div className="col-4">

                                            <label>Use Existing Template</label>
                                            <select
                                                className="form-control"
                                                onChange={this.handleChange}
                                                data-parsley-required="true"
                                                id="sendFromTemplate"
                                                name="sendFromTemplate">
                                                <option></option>
                                                <option value="true">Yes</option>

                                                <option value="false">No</option>

                                            </select>


                                        </div>
                                        {this.state.formData.sendFromTemplate == "true" && <div
                                            className="col-4">

                                            <label>Select Template</label>

                                            <select
                                                id="template"
                                                name="template"
                                                className="form-control"
                                                data-parsley-required="true"
                                                onChange={this.handleChange}>

                                                <option></option>
                                                {messageTemplates != "" &&

                                                    messageTemplates.map((group, index) => (
                                                        <option key={group.id} value={group.id}>{group.templateName}</option>
                                                    ))
                                                }

                                            </select>

                                        </div>
                                        }
                                    </div>
                                    <div
                                        className="col-4">

                                        <label>Select Source</label>

                                        <select
                                            id="source"
                                            name="source"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange}>

                                            <option></option>
                                            {sources != "" &&

                                                sources.map((group, index) => (
                                                    <option key={group.id} value={group.id}>{group.senderId}</option>
                                                ))
                                            }

                                        </select>

                                    </div>
                                    <div
                                        className="col-12 row">
                                        <div className="col-4">

                                            <label>Select Recipients From </label>
                                            <select
                                                className="form-control"
                                                onChange={this.handleChange}
                                                data-parsley-required="true"
                                                id="selectFromAddressBook"
                                                name="selectFromAddressBook">
                                                <option></option>
                                                <option value="AddressBook">My AddressBook</option>
                                                <option value="Manually">Enter Manually</option>
                                                <option value="File">Upload File</option>

                                            </select>

                                        </div>
                                        {selectFromAddressBook == "AddressBook" && <div className="col-8">

                                            <label>Recipients <em>*Use ctr on Windows / Command on Mac to select multiple</em></label>

                                            <select
                                                className="form-control"
                                                name="recipient"
                                                id="recipient"
                                                multiple
                                                data-parsley-required="true"
                                                onChange={this.handleChange}>
                                                <option value=""></option>
                                                {contacts != "" &&

                                                    contacts.map((contact, index) => (
                                                        <option key={contact.id} value={contact.phone}>{contact.name} - {contact.phone}</option>
                                                    ))
                                                }
                                            </select>

                                        </div>

                                        }
                                        {selectFromAddressBook == "Manually" &&
                                            <div
                                                className="col-8">

                                                <label>Recipients<small>(comma separated)</small></label>

                                                <input
                                                    type="text"
                                                    name="recipients"
                                                    id="recipients"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange} />
                                            </div>

                                        }
                                        {selectFromAddressBook == "File" &&
                                            <div
                                                className="col-8">

                                                <label>Upload Recipients <small>Choose File To Upload as xls(excel)</small> </label>
                                                {this.state.uploads == "" && <div className="">
                                                    <input type="file"
                                                        name="fileUpload"
                                                        id="fileUpload"
                                                        className="fileUpload"
                                                        placeholder="Upload Customer Template"
                                                        onChange={this.onFileChange}
                                                        accept=".xls,.xlsx,.csv" />


                                                    <button
                                                        className="btn-primary" id="uploadButtons"
                                                        onClick={this.downloadTemplate}
                                                    >
                                                        <a id="upload-download" href="http://localhost:8080/bridge/address-book/getContactsExcelTemplate" download="contactsUploadTemplate">

                                                            Download Template
                                                    </a>

                                                    </button>
                                                    <button
                                                        className="btn-primary uploadButton"
                                                        onClick={this.onFileUpload} hidden>
                                                        Upload!
                                                    </button>

                                                    {uploading &&
                                                        <Loader type="circle" />
                                                    }

                                                </div>}
                                                {this.state.uploads != "" && <div className="">
                                                    <label>Recipients <em>*Use ctr on Windows / Command on Mac to select multiple</em></label>

                                                    <select
                                                        className="form-control"
                                                        name="recipient"
                                                        id="recipient"
                                                        multiple
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}>
                                                        <option value=""></option>
                                                        {this.state.uploads != "" &&

                                                            this.state.uploads.map((contact, index) => (
                                                                <option key={index} value={contact.phone}>{contact.name} - {contact.phone}</option>
                                                            ))
                                                        }
                                                    </select>

                                                </div>}


                                            </div>

                                        }
                                    </div>

                                        {this.state.formData.sendFromTemplate == "true" && 
                                    <div
                                        className="col-12"><label>Message</label><textarea
                                            name="message"
                                            id="message"
                                            value={message}
                                            data-parsley-required="true"
                                            data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="100"
                                            onChange={this.handleChange}
                                            cols=""
                                            rows="">
                                        </textarea>
                                    </div>}
                                        {this.state.formData.sendFromTemplate == "false" &&  
                                    <div
                                        className="col-12">                                       <label>Message</label><textarea
                                            name="message"
                                            id="message"
                                            data-parsley-required="true"
                                            data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="100"
                                            onChange={this.handleChange}
                                            cols=""
                                            rows="">
                                        </textarea>
                                    </div>}


                                    <div className="col-4">

                                        <label>Send At</label>
                                        <select
                                            className="form-control"
                                            onChange={this.handleChange}
                                            data-parsley-required="true"
                                            id="sendTime"
                                            name="sendTime">
                                            <option></option>
                                            <option value="now">Send Now</option>

                                            <option value="later">Send Later</option>

                                        </select>

                                    </div>
                                    <div
                                        className="col-12 row">

                                        {this.state.formData.sendTime == "later" &&

                                            <div className="col-4">

                                                <label>Send Once</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="sendOnce"
                                                    name="sendOnce">
                                                    <option></option>
                                                    <option value="true">Yes</option>

                                                    <option value="false">No</option>

                                                </select>

                                            </div>


                                        }

                                        {this.state.formData.sendOnce == "true" &&

                                            <div className="col-4">

                                                <label>Time to Send</label>
                                                <div
                                                    className="row messageFilter">

                                                    <input
                                                        type="text"
                                                        className="form-control startdate"
                                                        name="timeToSend"
                                                        id="timeToSend"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}
                                                    />

                                                </div>
                                            </div>
                                        }

                                    </div>
                                    {this.state.formData.sendOnce == "false" &&
                                        <div className="col-12 row">

                                            <div className="col-4">

                                                <label>Schedule Name</label>
                                                <input
                                                    type="text"
                                                    name="name"
                                                    id="name"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                            </div>

                                            <div className="col-8">

                                                <label>Schedule Description</label>
                                                <input
                                                    type="text"
                                                    name="description"
                                                    id="description"
                                                    className="form-control"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                            </div>
                                            <div className="col-4">

                                                <label>Frequency</label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="frequency"
                                                    name="frequency">
                                                    <option></option>
                                                    <option value="HOURLY">HOURLY</option>
                                                    <option value="DAILY">DAILY</option>
                                                    <option value="MONTHLY">MONTHLY</option>
                                                    <option value="YEARLY">YEARLY</option>
                                                </select>

                                            </div>
                                            <div className="col-4">

                                                <label>Frequency Count</label>
                                                <div
                                                    className="row messageFilter">

                                                    <input
                                                        type="number"
                                                        name="frequencyCount"
                                                        id="frequencyCount"
                                                        className="form-control"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}
                                                    />

                                                </div>
                                            </div>

                                            <div className="col-4">

                                                <label>Time to Send</label>
                                                <div
                                                    className="row messageFilter">

                                                    <input
                                                        type="text"
                                                        name="timeToSend"
                                                        id="timeToSend"
                                                        className="form-control startdate"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}
                                                    />


                                                </div>
                                            </div>
                                        </div>
                                    }







                                    <div className="row">

                                        <div className="col-12">

                                            {this.state.formData.sendTime == "now" && <button
                                                className="btn-primary"
                                                type="submit">Send Message</button>}

                                            {this.state.formData.sendTime == "later" && <button
                                                className="btn-primary"
                                                type="submit">Schedule Message</button>}

                                            <button
                                                className="btn-primary"
                                                type="reset">Cancel</button>

                                        </div>


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




                            {/* Form Sample */}

                            {/* End Form Sample*/}

                        </div>



                    </div>

                </div>
            </>

        )

    }

}