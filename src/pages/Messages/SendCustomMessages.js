/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import CommunicationsService from '../../services/communications.service';
import AddressBookService from '../../services/addressbook.service';
import SourceService from '../../services/source.service';
import Notification from '../../components/notifications/Notifications';
import readXlsxFile from 'read-excel-file'


import Loader from '../../components/loaders/Loader';

export default class SendCustomMessages extends Component {
    constructor(props) {

        super(props);

        this.state = {
            dataObjects: [],
            columnNames: [],
            value: this.props.value,
            messageTemplates: [],
            sentMessages: [],
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
        this.moveNext = this.moveNext.bind(this);
        this.startsWith = this.startsWith.bind(this);
        this.complete = this.complete.bind(this);
        this.completeNumbers = this.completeNumbers.bind(this);
        this.onFileUpload = this.onFileUpload.bind(this);


    }

    componentDidMount() {
        this.setupWizard();
        this.indexTabContainers();
        // this.fetchSources();

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
            // console.log(this.state.selectedFile);

            readXlsxFile(this.state.selectedFile).then((rows) => {

                const objects = [];

                this.setState({
                    columnNames: rows.shift()
                });
                if (!this.state.columnNames.includes("Phone")) {

                    this.setState({
                        uploading: false
                    });
                    confirmAlert({

                        title: 'Upload File Failed',
                        message: 'The file you uploaded does not have column "Phone"',
                        buttons: [
                            {
                                label: 'ok',
                            }
                        ]
                    });
                } else {
                    // each row being an array of cells.
                    rows.forEach((row) => {
                        const obj = {};
                        row.forEach((cell, i) => {
                            obj[this.state.columnNames[i]] = cell;
                        });
                        objects.push(obj);
                    });
                    console.log(objects);
                    this.setState({
                        uploading: false,
                        dataObjects: objects
                    });
                    this.moveNext();

                }

            });

        } else {
            this.setState({
                uploading: false
            });

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
    moveNext() {
        $('#rootwizard').bootstrapWizard('next');
    }
    completeNumbers(val) {

        if (!val) return;

        if (val.startsWith("0")) {
            return "254" + val.substring(1);
        } else {
            return val;
        }
    }

    complete(strComplete) {
        var val = document.getElementById("message").value.substring(0, document.getElementById("message").value.indexOf('@')) + "{{" + strComplete + "}} ";
        document.getElementById("message").value = val;
    }

    setupWizard() {

        $('#rootwizard').bootstrapWizard({
            tabClass: '',
            // nextSelector: '.button-next',
            previousSelector: '.button-previous',
            firstSelector: '.button-first',
            lastSelector: '.button-last',
            onTabClick: function (tab, navigation, index) {
                return false;
            }
        });

    }

    indexTabContainers() {

        $(".tab-content .tab-pane").each(function (index, value) {

            $(this).attr("data-index", index);

            $(this).find("input,select").attr("data-parsley-group", "group-" + index);


        });

        $('#form').parsley();

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
    startsWith(str, word) {
        return str.lastIndexOf(word, 0) === 0;
    }
    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let options = el.target.options;
        var strSuggestionsDivId = "suggestions";
        let userGroups = [];
        let stateCopy = Object.assign({}, this.state);
        if (inputName == "message") {

            var templateString = inputValue;
            var lastString = templateString.substr(templateString.lastIndexOf(" "));
            if (this.startsWith(lastString, " @")) {
                var val = lastString.substr(2);
                console.log("finding suggestions for " + val);

                var objList = document.createElement("ul");
                if (val.length > 1) {
                    var found = false;
                    for (var i = 0; i < this.state.columnNames.length; i++) {
                        var word = this.state.columnNames[i];
                        var wordPart = word.substring(0, val.length)
                        if ((word.length > val.length && wordPart === val)) { // check if the words are matching
                            // if they do create a list entry
                            found = true;
                            var objListEntity = document.createElement("li");
                            objListEntity.onclick = this.complete(word);
                            objListEntity.innerHTML = word;
                            objList.appendChild(objListEntity);
                        }
                    }
                    if (found != true) {
                        console.log("not found any matching word")
                        for (var i = 0; i < this.state.columnNames.length; i++) {
                            var word = this.state.columnNames[i]
                            var objListEntity = document.createElement("li");
                            objListEntity.onclick = this.complete(word);
                            objListEntity.innerHTML = word;
                            objList.appendChild(objListEntity);
                        }
                    }
                } else {
                    console.log("not found any matching word")
                    for (var i = 0; i < this.state.columnNames.length; i++) {
                        var word = this.state.columnNames[i]
                        var objListEntity = document.createElement("li");
                        // objListEntity.setAttribute("onclick", "complete('" + word + "', '" + strSuggestionsDivId + "');");
                        objListEntity.onclick = function () { this.complete(word); }.bind(this);

                        objListEntity.innerHTML = word;
                        objList.appendChild(objListEntity);
                    }
                    // show the suggestionList
                }
                // show the suggestionList

            } else {
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
            }


            this.setState(stateCopy);


        } else {

            stateCopy.formData[inputName] = inputValue;


        }
        this.setState(stateCopy);
    }

    handleMessageSubmission(event) {

        let stateCopy = Object.assign({}, this.state);

        event.preventDefault();
        const { formData, dataObjects } = this.state;

        if (formData.parameterValues.length < 1) {

            alert("Please set the value of the parameter you want to send");

        }
        var values = [];
        for (var i = 0; i < formData.parameterValues.length; i++) {

            var paramValues = [];
            for (var m = 0; m < dataObjects.length; m++) {
                var data = dataObjects[m];
                Object.keys(data).map(key => {
                    if (data.hasOwnProperty(key)) {
                        if (key == formData.parameterValues[i])
                            paramValues.push(data[key])
                    }
                });
            }
            var obj = {
                parameter: formData.parameterValues[i],
                values: paramValues
            };
            values.push(obj);
        }
        stateCopy.formData.parameters = values;

        var numbers = [];
        for (var m = 0; m < dataObjects.length; m++) {
            var data = dataObjects[m];
            Object.keys(data).map(key => {
                if (data.hasOwnProperty(key)) {
                    if (key == "Phone") {
                        console.log(data[key]);
                        numbers.push(data[key]);
                    }
                }
            });
        }

        let vals = [];
        for (var i = 0; i < numbers.length; i++) {

            vals.push(this.completeNumbers(numbers[i].toString()));
        }
        stateCopy.formData.recepients = vals;    

        this.setState(stateCopy);

        console.log("formData => " + JSON.stringify(this.state.formData));


        CommunicationsService.createCustomMessage(formData).then(response => {
            console.log(response.data.data);

            if (response.data.successStatus == "success") {

                this.setState({
                    sentMessages: response.data.body != null ? response.data.body : [],
                });

                this.moveNext();

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


    render() {

        const { columnNames, uploading, sentMessages, sendOnce, sendTime, sendFromTemplate, selectFromAddressBook, contacts, message, successfulSubmission, networkError, submissionMessage } = this.state;


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
                                    <small>Sample: If the excel column headers are Phone,name and balance, then you will type the message as:
                                    Dear @name, you balance is @balance. This message will be sent to all the numbers on column [Phone]
</small><br />
                                </div>
                                <div className="buttonContainer padding pt-0 pb-0">


                                    <div className="row advancedSearchOptions ">


                                        <div className="col-7 secondaryActions">
                                            <a
                                                className="btn-rounded upload-download"
                                                href="/assets/files/CustomSMSTemplate.xlsx"
                                                download>

                                                <span className="">
                                                    <i className="i-con i-con-download">
                                                        <i></i>
                                                    </i>
                                                </span>Download Template</a>



                                        </div>

                                    </div>


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
                                                            </span>Upload Excel File
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
                                                            accept=".xlsx" />

                                                        <label htmlFor="fileUpload" className="uploadLabel">Choose File To Upload as xlsx(excel)</label>

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

                                                <div className=" padding pt-0 pb-0">
                                                    <p>The fields we have gotten on your document include:
                                                {columnNames != "" && columnNames.map((column, index) => (
                                                        <span key={index}><strong>{column},</strong></span>
                                                    ))
                                                        }.
                                                        </p>
                                                    <form>
                                                        <div className="col-12 row">
                                                            <div
                                                                className="col-12">
                                                                <label>Message</label>
                                                                <textarea
                                                                    name="message"
                                                                    id="message"
                                                                    // onChange={this.findSuggestions('message', 'suggestions')}
                                                                    data-parsley-required="true"
                                                                    data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="100"
                                                                    onChange={this.handleChange}
                                                                    cols=""
                                                                    rows="">
                                                                </textarea>

                                                                <button type="submit" className="btn-primary" onClick={this.handleMessageSubmission}>Submit</button>

                                                            </div>
                                                        </div>
                                                    </form>


                                                </div>
                                            </div>
                                            <div className="tab-pane" id="tab3">

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
                                                            <th>Recepient</th>
                                                            <th>Message</th>
                                                            <th>Priority </th>
                                                            <th>Response Status </th>
                                                        </tr>
                                                    </thead>

                                                    <tbody>

                                                        {sentMessages != "" &&
                                                            sentMessages.map((mes, index) => {

                                                                return (


                                                                    <tr className=" " key={index} >


                                                                        <td>
                                                                            <span className="text-muted">{mes.id}</span>
                                                                        </td>

                                                                        <td>
                                                                            <span className="text-muted">{mes.recipient}</span>
                                                                        </td>

                                                                        <td>
                                                                            <span className="text-muted">{mes.message}</span>
                                                                        </td>

                                                                        <td>
                                                                            <span className="text-muted">{mes.priority}</span>
                                                                        </td>

                                                                        <td>
                                                                            <span className="text-muted">{mes.sentResponseStatus}</span>
                                                                        </td>
                                                                    </tr>

                                                                );

                                                            })
                                                        }

                                                    </tbody>

                                                </table>

                                            </div>
                                        </div>


                                    </div>
                                    {/* End Multi Step Wizard */}
                                    {/* <div className="row py-3">
                                        <div className="col-6">

                                            <a href="#" className="btn btn-primary button-previous">Previous</a>

                                            <a href="#" className="btn btn-primary button-next i-con-h-a">Next</a>
                                        </div>

                                    </div> */}

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
