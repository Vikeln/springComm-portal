/* global $ */

import React, { Component } from 'react';
import ReactDom from 'react-dom';

import { confirmAlert } from 'react-confirm-alert';
import CommunicationsService from '../../services/communications.service';
import AddressBookService from '../../services/addressbook.service';
import SourceService from '../../services/source.service';
import Notification from '../../components/notifications/Notifications';

import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import Loader from '../../components/loaders/Loader';
import authService from '../../services/auth.service';

export default class SendMessages extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            messageTemplates: [],
            sources: [],
            createSchedule: authService.checkIfRoleExists("CAN_CREATE_MESSAGE_SCHEDULE"),
            contactGroups: [],
            format: "HH:mm:ss",
            timeNow: moment().hour(0).minute(0),
            uploads: [],
            selectedFile: "",
            contacts: [],
            template: null,
            message: "",
            uploading: false,
            formData: {
                parameters: [],
                recipient: [],
                parameterValues: [],
                sendFromTemplate: "false"

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
        this.getAllGroupContacts = this.getAllGroupContacts.bind(this);

        this.onFileChange = this.onFileChange.bind(this);
        this.setCharAt = this.setCharAt.bind(this);
        this.complete = this.complete.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);
    }

    componentDidMount() {
        this.fetchMessageTemplates();
        this.fetchContacts();
        this.createTimePicker();
        this.fetchSources();
        $(".uploader").click(this.openFileUploader);
        $(".upload-download").click(this.downloadTemplate);
        // $("#recipients").change(this.complete);      

        $(document).on("change", ".startdate", this.updateStartDate);
        $(document).on("blur", ".starttime", this.updateStartTime);

    }

    componentDidUnMount() {

    }
    createTimePicker() {

        $(".startdate").datepicker({
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            startDate: new Date(),
            endDate: '+21d',
            datesDisabled: '-1d',
        });

        var dateNow = new Date();
        var now = dateNow.getTime();

        $(".starttime").timepicker({
            timeFormat: 'HH:mm:ss',
            interval: 30,
            minTime: now,
            maxTime: '23:59:00',
            defaultTime: now,
            startTime: now,
            dynamic: true,
            dropdown: false,
            scrollbar: true,
            change: function (time) {
                // the input field


                //element.siblings('span.help-line').text(text);
            }
        });
    }
    componentDidUpdate() {
        this.createTimePicker();
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


                var uniqueSources = response.data.data.filter((v, i, a) => a.findIndex(t => (t.alphanumeric === v.alphanumeric)) === i);

                this.setState({
                    sources: uniqueSources != null ? uniqueSources : [],
                });
                

            } else {
                if (response.data.message == "No records found") {
                    confirmAlert({
                        title: 'Sadly You have no Sender registered yet.',
                        message: "Click OK to go register one now",
                        buttons: [
                            {
                                label: 'ok',
                                onClick: () => window.location.href = "/dashboard/mysenderIds"
                            }
                        ]
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
    getAllGroupContacts(group) {
        AddressBookService.getAllGroupContacts(group).then(response => {

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

        AddressBookService.getAllContactGroups().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    contactGroups: response.data.data != null ? response.data.data : [],
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

    setCharAt(str, index, chr) {
        if (index > str.length - 1) return str;
        return str.substring(0, index) + chr + str.substring(index + 1);
    }

    complete(vals) {

        if (!vals) return;

        if (vals.startsWith("0")) {
            return "254" + vals.substring(1);
        } else {
            return vals;
        }
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
                stateCopy.message = inputValue;
            }

            this.setState(stateCopy);


        }
        else if (inputName === "recipients") {
            let userGroups = inputValue.split(",");
            // for (var i = 0, l = userGroups.length; i < l; i++) {

            //     if  (userGroups[i].startsWith("0"))
            //     userGroups[i] = this.setCharAt(userGroups[i],1,"0");
            // }
            stateCopy.formData.recipient = userGroups;
        } else if (inputName === "recipient") {

            for (var i = 0, l = options.length; i < l; i++) {


                if (options[i].selected) {
                    userGroups.push(options[i].value);
                }


            }

            stateCopy.formData[inputName] = userGroups;
        } else if (inputName === "source") {
            stateCopy.formData.source = parseInt(inputValue);

        } else if (inputName === "sendOnce") {
            stateCopy.formData.sendOnce = inputValue;
        } else if (inputName === "sendTime") {
            stateCopy.formData.sendTime = inputValue;

        } else if (inputName === "filterContacts") {
            stateCopy.filterContacts = inputValue;

        } else if (inputName === "contactGroup") {
            stateCopy.formData.contactGroup = inputValue;
            this.getAllGroupContacts(inputValue);

        } else if (inputName === "selectFromAddressBook") {

            stateCopy.selectFromAddressBook = inputValue;
            stateCopy.formData.recipient = [];
            stateCopy.uploads = [];

        } else if (inputName === "sendToGroup") {

            stateCopy.sendToGroup = inputValue;
            if (inputValue == "YES") {
                stateCopy.formData.recipient = stateCopy.contacts.map((contact) => { return contact.phone; });
            } else {
                stateCopy.formData.recipient = [];
                stateCopy.uploads = [];
            }


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

            if (tem.indexOf("{") > 0)
                stateCopy.formData.parameters = tem.match(/{{(.*?)}}/g).toString().replace(/{{|}}/gi, "").split(",");

            stateCopy.formData[inputName] = parseInt(inputValue);
            stateCopy.formData["message"] = tem;

        } else {

            stateCopy.formData[inputName] = inputValue;
        }
        this.setState(stateCopy);
    }

    handleMessageSubmission(event) {
        var send = true;
        event.preventDefault();
        const { formData } = this.state;

        if (formData.recipient.length < 1) {

            alert("Please set a recipient list");
            send = false;
        }

        if (formData.sendFromTemplate == "true" && formData.parameters != undefined && formData.parameters.length > 0 && formData.parameterValues.length < 1) {

            alert("Please set the value of the parameter you want to send");
            send = false;
        }




        if ($(".sendMessage").parsley().isValid() && send) {

            $('input[type="submit"],button[type="submit"]').hide();
            // let vals = [];
            // for (var i = 0; i < formData.recipient.length; i++) {

            //     vals.push(this.complete(formData.recipient[i].toString()));
            // }
            // formData.recipient = vals;
            if (formData.sendTime != "now")
                formData.timeToSend = formData.dateToSend + " " + formData.timeToSend;

            CommunicationsService.createMessage(formData).then(response => {

                if (response.data.status != "error") {

                    confirmAlert({
                        title: 'Success',
                        message: response.data.message,
                        buttons: [
                            {
                                label: 'OK',
                                onClick: () => this.state.formData.sendTime == "now" ? window.location.href = "/dashboard/messages"
                                    :
                                    window.location.href = "/dashboard/scheduled-messages"
                            }
                        ]
                    });

                } else {
                    $('input[type="submit"],button[type="submit"]').show();
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
                $('input[type="submit"],button[type="submit"]').show();
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


    updateStartTime(value) {
        console.log(value + "         " + value.format(this.state.format));
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData["timeToSend"] = value.format(this.state.format)

        this.setState(stateCopy);


    }

    updateStartDate(date) {

        // console.log("Start Date Changed", date.target.value);

        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData["dateToSend"] = date.target.value;

        this.setState(stateCopy);


    }

    render() {

        const { format, createSchedule, timeNow, filterContacts, contactGroups, sendToGroup, messageTemplates, uploading, sources, sendOnce, sendTime, sendFromTemplate, selectFromAddressBook, contacts, message, successfulSubmission, networkError, submissionMessage } = this.state;

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
                                        className="col-12">
                                        <div
                                            className="row">

                                            {this.state.messageTemplates.length > 0 &&

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
                                                </div>}
                                            {this.state.formData.sendFromTemplate == "true" &&
                                                <div
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
                                        className="col-12">
                                        <div
                                            className="row">
                                            <div className="col-4">

                                                <label>Select Recipients From </label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="selectFromAddressBook"
                                                    name="selectFromAddressBook">
                                                    <option></option>
                                                    {this.state.contacts.length > 0 && <option value="AddressBook">My AddressBook</option>}
                                                    <option value="Manually">Enter Manually</option>

                                                </select>

                                            </div>
                                            {selectFromAddressBook == "AddressBook" && <div className="col-4">

                                                <label>Filter Contacts by Group? </label>
                                                <select
                                                    className="form-control"
                                                    onChange={this.handleChange}
                                                    data-parsley-required="true"
                                                    id="filterContacts"
                                                    name="filterContacts">
                                                    <option></option>
                                                    <option value="Yes">Yes</option>
                                                    <option value="No">No</option>

                                                </select>

                                            </div>}
                                            {filterContacts == "Yes" &&
                                                <>
                                                    <div className="col-4">

                                                        <label>Contact Groups</label>

                                                        <select
                                                            className="form-control"
                                                            name="contactGroup"
                                                            id="contactGroup"

                                                            data-parsley-required="true"
                                                            onChange={this.handleChange}>
                                                            <option value=""></option>
                                                            {contactGroups != "" &&

                                                                contactGroups.map((contact, index) => (
                                                                    <option key={contact} value={contact}>{contact}</option>
                                                                ))
                                                            }
                                                        </select>

                                                    </div>

                                                    <div className="col-4">

                                                        <label>Send To ALL contacts in Group</label>

                                                        <select
                                                            className="form-control"
                                                            name="sendToGroup"
                                                            id="sendToGroup"

                                                            data-parsley-required="true"
                                                            onChange={this.handleChange}>
                                                            <option value=""></option>
                                                            <option value="YES">Yes</option>
                                                            <option value="No">No</option>
                                                        </select>

                                                    </div>
                                                </>
                                            }
                                            {(selectFromAddressBook == "AddressBook" && sendToGroup == "No") &&
                                                <div className="col-8">

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

                                                    <label>Recipients<small>(comma separated 254...)</small></label>

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
                                                            <a id="upload-download" href="http://10.38.83.54:30555/bridge/address-book/getContactsExcelTemplate" download="contactsUploadTemplate">

                                                                Download Template
                                                    </a>

                                                        </button>
                                                        <button
                                                            className="btn-primary uploadButton"
                                                            onClick={this.onFileUpload} hidden>
                                                            Upload!
                                                    </button>

                                                        {uploading &&
                                                            <Loader type="dots"/>
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
                                    </div>
                                    {this.state.formData.sendFromTemplate == "true" &&
                                        <div
                                            className="col-12">
                                            <label>Message</label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                value={message}
                                                data-parsley-required="true"
                                                data-parsley-trigger="keyup" data-parsley-minlength="1" data-parsley-maxlength="1000"
                                                onChange={this.handleChange}
                                                cols=""
                                                rows="">
                                            </textarea>
                                        </div>}
                                    {this.state.formData.sendFromTemplate == "false" &&
                                        <div
                                            className="col-12">
                                            <label>Message</label>
                                            <textarea
                                                name="message"
                                                id="message"
                                                data-parsley-required="true"
                                                data-parsley-trigger="keyup" data-parsley-minlength="1" data-parsley-maxlength="1000"
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

                                            {createSchedule && <option value="later">Send Later</option>
                                            }
                                        </select>

                                    </div>

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

                                        <div className="col-12">

                                            <div
                                                className="row">
                                                <div
                                                    className="col-6">

                                                    <label>Date to Send
                                                </label>
                                                    <div
                                                        className=" messageFilter">

                                                        <input
                                                            type="text"
                                                            className="form-control startdate"
                                                            name="dateToSend"
                                                            id="dateToSend"
                                                            data-parsley-required="true"
                                                        />

                                                    </div>
                                                </div>

                                                <div
                                                    className="col-6">

                                                    <label>Time to Send
                                                </label>
                                                    <div
                                                        className=" messageFilter">
                                                        <TimePicker
                                                            style={{ width: 100 }}
                                                            showSecond={true}
                                                            defaultValue={moment()}
                                                            className="xxx"
                                                            onChange={this.updateStartTime}

                                                        />

                                                    </div>
                                                </div>
                                            </div>

                                        </div>
                                    }
                                    {this.state.formData.sendOnce == "false" &&

                                        <div
                                            className="col-12">
                                            <div className=" row">

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

                                            </div>

                                            <div className="col-4">

                                                <label>Date to Send
                                                </label>
                                                <div>

                                                    <input
                                                        type="text"
                                                        className="form-control startdate"
                                                        name="dateToSend"
                                                        id="dateToSend"
                                                        data-parsley-required="true"
                                                    />
                                                </div>
                                            </div>
                                            <div className="col-4">
                                                <label>Time to Send
                                                </label>
                                                <div>


                                                    <TimePicker
                                                        style={{ width: 100 }}
                                                        showSecond={true}
                                                        defaultValue={moment()}
                                                        className="xxx"
                                                        onChange={this.updateStartTime}

                                                    />
                                                </div>


                                            </div>
                                        </div>
                                    }


                                    <div
                                        className="col-12">
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
