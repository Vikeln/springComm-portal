/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import CommunicationsService from '../../services/communications.service';
import AddressBookService from '../../services/addressbook.service';
import SourceService from '../../services/source.service';
import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

export default class SendCustomMessages extends Component {

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
        this.fetchSources = this.fetchSources.bind(this);

        this.onFileChange = this.onFileChange.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);


    }

    componentDidMount() {
        this.fetchSources();

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

        $(".upload").click(this.openFileUploader);

    }

    componentDidUnMount() {

    }
    async fetchSources() {

        SourceService.getAllActiveSources().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    sources: response.data.data != null ? response.data.data : [],
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

    openFileUploader() {

        $(".uploadFile").stop().slideToggle();

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
                    if (this.state.formData.sendOnce == "true") {
                        window.location.href = "/dashboard/messages";
                    } else {
                        window.location.href = "/dashboard/scheduled-messages";
                    }

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

                {/* Page Content */}
                <div id="content" className="flex ">

                    {/* Page Container */}
                    <div className="page-container" id="page-container">

                        {/* Page Title */}
                        <div className="page-title padding pb-0 ">
                            <h2 className="text-md mb-0">CUSTOM MESSAGES</h2>

                        </div>
                        {/* End Page Title*/}

                        {/* Form Content */}
                        <div className="padding">

                            {/* Form Container */}
                            <div className="card">

                                <div className="card-header">
                                    <strong>Create Custom Message</strong>
                                    <br />
                                    <small>Sample: If the excel column headers are number,name and balance, then you will type the message as:
                                    Dear @name, you balance is @balance. This message will be sent to all the [numbers]
</small><br /><small>
                                        For more information on how to use custom messages, please click here..</small>
                                </div>

                                {/* Form Container */}
                                <div className="card-body">




                                    {/* Multi Step Wizard */}
                                    <div id="rootwizard" className="multistep">

                                        {/* Wizard Tabs */}
                                        <ul className="nav mb-3">

                                            <li className="nav-item">

                                                <a className="nav-link" href="#tab1" data-toggle="tab">
                                                    <span className="w-32 d-inline-flex align-items-center justify-content-center circle bg-light active-bg-success">1</span>
                                                    <div className="mt-2">
                                                        <span>Step 1</span>
                                                        <div className="text-muted">Excel File Upload</div>
                                                    </div>
                                                </a>

                                            </li>

                                            <li className="nav-item">

                                                <a className="nav-link" href="#tab2" data-toggle="tab">
                                                    <span className="w-32 d-inline-flex align-items-center justify-content-center circle bg-light active-bg-success">2</span>
                                                    <div className="mt-2">
                                                        <span>Step 2</span>
                                                        <div className="text-muted">Message</div>
                                                    </div>
                                                </a>

                                            </li>

                                            <li className="nav-item">

                                                <a className="nav-link" href="#tab3" data-toggle="tab">
                                                    <span className="w-32 d-inline-flex align-items-center justify-content-center circle bg-light active-bg-success">3</span>
                                                    <div className="mt-2">
                                                        <span>Step 3</span>
                                                        <div className="text-muted">Results</div>
                                                    </div>
                                                </a>


                                            </li>

                                        </ul>
                                        {/* End Wizard Tabs*/}
                                        <div className="tab-content p-3">

                                            {/* Tab 1 */}
                                            <div className="tab-pane active" id="tab1">

                                                {/* <form
                                                    id="createCustomMessageForm"
                                                    className="createCustomMessage"> */}

                                                    <div className="row advancedSearchOptions ">

                                                        <div className="col-7 secondaryActions">

                                                            <button className="btn-rounded upload">

                                                                <span className="">
                                                                    <i className="i-con i-con-upload">
                                                                        <i></i>
                                                                    </i>
                                                                </span>Upload Contacts
    </button>



                                                        </div>

                                                    </div>


                                                    <div className=" padding pt-0 pb-0">

                                                        <div className="uploadFile">
                                                            <input type="file"
                                                                name="fileUpload"
                                                                id="fileUpload"
                                                                className="fileUpload"
                                                                placeholder="Upload Custom Template"
                                                                onChange={this.onFileChange}
                                                                accept=".xls,.xlsx" />

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
                                                {/* </form> */}
                                            </div>
                                            <div className="tab-pane" id="tab2">

                                                Tab 2
                                                </div>
                                            <div className="tab-pane" id="tab3">
                                                Tab 3

                                                </div>
                                        </div>


                                    </div>
                                    {/* End Multi Step Wizard */}

                                </div>
                                {/* End Form Container */}

                            </div>
                            {/* End Form Container*/}

                        </div>
                        {/* End Form Content*/}



                    </div>
                    {/* End Page Container*/}

                </div>
                {/* End Page Content*/}


            </>

        )

    }

}
