/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TimePicker from 'rc-time-picker';
import 'rc-time-picker/assets/index.css';
import moment from 'moment';

import { Button, Modal } from 'react-bootstrap'

import Loader from '../../components/loaders/Loader';
import communicationsService from '../../services/communications.service';

import CommunicationsService from '../../services/communications.service';
import utils from '../../utils/utils';



export default class Messages extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            message: [],
            format: "HH:mm:ss",
            formData: {

            },
            editScheduleForm: {
                name: undefined,
                description: undefined,
                frequency: undefined,
                freqCount: undefined,
                scheduledDate: undefined,
                freqTime: undefined
            },
            startdate: "",
            enddate: "",
            submitting: false,
            loading: false,
            editSchedule: false,


        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateStartsDate = this.updateStartsDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.openAdvancedSearch = this.openAdvancedSearch.bind(this);
        this.deleteSchedule = this.deleteSchedule.bind(this);
        this.editSchedule = this.editSchedule.bind(this);
        this.openEditScheduleModal = this.openEditScheduleModal.bind(this);
        this.editMessageSchedule = this.editMessageSchedule.bind(this);
        this.updateStartTime = this.updateStartTime.bind(this);


    }

    componentDidMount() {

        $(".startdate").datepicker({
            format: 'mm/dd/yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        })

        $(".enddate").datepicker({
            format: 'mm/dd/yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        });
        $(".startsdate").datepicker({
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '+21d',
            datesDisabled: '-1d',
        });

        $(".editScheduleForm").parsley();
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

        $(document).on("change", ".startdate", this.updateStartDate);
        $(document).on("change", ".startsdate", this.updateStartsDate);
        $(document).on("blur", ".starttime", this.updateStartTime);
        $(document).on("change", ".enddate", this.updateEndDate);

        $("body").on("click", ".deleteSchedule", this.deleteSchedule);
        $("body").on("click", ".editSchedule", this.editSchedule);

        $(".advancedSearchButton").click(this.openAdvancedSearch);
        this.openAdvancedSearch();

    }
    updateStartTime(value) {
        console.log(value + "         " + value.format(this.state.format));
        let stateCopy = Object.assign({}, this.state);

        stateCopy.editScheduleForm.freqTime = value.format(this.state.format);
        this.setState(stateCopy);


    }
    updateStartDate(date) {



        this.setState({
            startdate: date.target.value
        });

    }

    updateStartsDate(date) {
        let stateCopy = Object.assign({}, this.state);

        stateCopy.editScheduleForm.scheduledDate = date.target.value;
        this.setState(stateCopy);

    }

    updateEndDate(date) {

        this.setState({
            enddate: date.target.value
        });

    }

    openAdvancedSearch() {

        $(".advancedSearch").stop().slideToggle();

    }
    componentDidUpdate() {
        $(".startdate").datepicker({
            format: 'mm/dd/yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        })
        $(".startsdate").datepicker({
            format: 'yyyy-mm-dd',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '+21d',
            datesDisabled: '-1d',
        })

        $(".enddate").datepicker({
            format: 'mm/dd/yyyy',
            todayHighlight: true,
            autoclose: true,
            orientation: 'bottom',
            endDate: '0d',
            datesDisabled: '+1d',
        }); $(".editScheduleForm").parsley();
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

    fetchMessages(event) {

        const { startdate, enddate } = this.state;

        event.preventDefault();

        $('.table').bootstrapTable("destroy");

        if (startdate == "") {
            alert("Please select a start date");
        }

        if (enddate == "") {
            alert("Please select an end date");
        }


        //if ($(".fetchMessages").parsley().isValid()) {
        if (startdate != "" && enddate != "") {

            this.setState({
                loading: true
            });

            this.openAdvancedSearch();
            CommunicationsService.getAllScheduledMessages(startdate, enddate).then(response => {

                if (response.data.status != "error") {

                    if (response.data.data == undefined || response.data.data.length < 1) {
                        confirmAlert({
                            title: 'No records',
                            message: response.data.message,
                            buttons: [
                                {
                                    label: 'ok',
                                }
                            ]
                        });
                    }


                    this.setState({
                        message: response.data.data != null ? response.data.data : [],
                        loading: false,
                    });

                    $('.table').bootstrapTable();


                } else {

                    confirmAlert({
                        title: 'Error occurred',
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

                confirmAlert({
                    title: 'Error occurred',
                    message: error.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });

                this.setState({
                    loading: false,
                });

            });


        }

    }

    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.editScheduleForm[inputName] = inputValue;
        this.setState(stateCopy);
    }

    formatDate(date) {
        var d = new Date(date),
            month = '' + (d.getMonth() + 1),
            day = '' + d.getDate(),
            year = d.getFullYear();

        if (month.length < 2)
            month = '0' + month;
        if (day.length < 2)
            day = '0' + day;

        return [year, month, day].join('/');
    }

    deleteSchedule(el) {
        let messageId = el.target.dataset.id;

        confirmAlert({
            title: 'Confirm Delete',
            message: 'Are you sure you want to delete this scheduled message?',
            buttons: [
                {
                    label: 'Yes',
                    onClick: () => {
                        communicationsService.deleteScheduledMessage(messageId).then(response => {



                            if (response.data.status == "success") {

                                this.setState({

                                    emailSuccessful: response.data.message

                                });

                                confirmAlert({
                                    title: 'Success!',
                                    message: 'Please proceed.',
                                    buttons: [
                                        {
                                            label: 'Yes',
                                            onClick: () => window.location.reload()
                                        }
                                    ]
                                });

                            } else if (response.data.status == "error") {

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
            ]
        });


    }

    editMessageSchedule(el) {
        const { editScheduleForm } = this.state;
        editScheduleForm.scheduledDate = editScheduleForm.scheduledDate+" "+editScheduleForm.freqTime;

        if ($(".editScheduleForm").parsley().isValid()) {
            this.openEditScheduleModal();
            communicationsService.modifyScheduledMessage(editScheduleForm.id, editScheduleForm).then(response => {



                if (response.data.status == "success") {

                    this.setState({

                        emailSuccessful: response.data.message

                    });

                    confirmAlert({
                        title: 'Success!',
                        message: 'Please proceed.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => window.location.reload()
                            }
                        ]
                    });

                } else if (response.data.status == "error") {

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


    editSchedule(el) {
        let messageId = el.target.dataset.id;
        let edit = this.state.message.find(x => x.id === parseInt(messageId));
        var editScheduleForm = {
            name: edit.name,
            id: messageId,
            description: edit.description,
            frequency: edit.frequency,
            freqCount: edit.freqCount,
            scheduledDate: new Date(edit.scheduledDate).toLocaleDateString("en-US"),
            freqTime: edit.freqTime
        }
        this.setState({ editScheduleForm: editScheduleForm });
        this.openEditScheduleModal();

    }

    openEditScheduleModal() {
        this.setState({ editSchedule: !this.state.editSchedule });
    }
    render() {

        const { message, loading, submitting } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Scheduled Messages</h2>

                        </div>


                        <div className="padding">
                            <div className="buttonContainer padding pt-0 pb-0">


                                <div className="row advancedSearchOptions ">
                                    <div className="col-6 searchToggle">

                                        <button className="advancedSearchButton btn-rounded">

                                            <span className="">
                                                <i className="i-con i-con-minus">
                                                    <i></i>
                                                </i>
                                            </span>

                                            Advanced Search : Click Here to Show

                                        </button>

                                    </div>



                                </div>




                            </div>
                            <div className="advancedSearch padding pb-0 pt-4" style={{ display: 'none' }}>

                                <div className="col-lg-12 pb-2 pl-0 pr-0">
                                    <form onSubmit={this.fetchMessages}
                                        className="fetchMessages">
                                        <div
                                            className="row messageFilter">

                                            <div
                                                className="col-4">

                                                <label>Start Date*</label>
                                                <input
                                                    type="text"
                                                    className="form-control startdate"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}
                                                />

                                                <input
                                                    type="hidden"
                                                    name="startdate"
                                                    id="startdate"
                                                    onChange={this.handleChange} />

                                            </div>

                                            <div
                                                className="col-4">

                                                <label>End Date*</label>
                                                <input
                                                    type="text"
                                                    className="form-control enddate"
                                                    data-parsley-required="true"

                                                />

                                                <input
                                                    type="hidden"
                                                    name="enddate"
                                                    id="enddate"
                                                    onChange={this.handleChange} />
                                            </div>
                                            <div
                                                className="col-4 ">
                                                <button
                                                    className="btn-primary"
                                                    type="submit">Fetch</button>
                                            </div>
                                        </div>

                                    </form>

                                </div>
                            </div>
                            <div id="toolbar">
                                <button id="trash" className="btn btn-icon btn-white i-con-h-a mr-1"><i className="i-con i-con-trash text-muted"><i></i></i></button>
                            </div>
                            <Modal show={this.state.editSchedule}>

                                <Modal.Header closeButton onClick={() => this.openEditScheduleModal()}>
                                    <Modal.Title>Edit Message Schedule</Modal.Title>
                                </Modal.Header>
                                <Modal.Body>
                                    <div className="row">
                                        <form className="editScheduleForm" data-plugin="parsley">
                                            <div
                                                className="col-12">
                                                <div className=" row">

                                                    <div className="col-12">

                                                        <label>Schedule Name</label>
                                                        <input
                                                            type="text"
                                                            name="name"
                                                            id="name" value={this.state.editScheduleForm.name}
                                                            className="form-control"
                                                            data-parsley-required="true"
                                                            onChange={this.handleChange}
                                                        />

                                                    </div>

                                                    <div className="col-12">

                                                        <label>Schedule Description</label>
                                                        <input
                                                            type="text"
                                                            name="description" value={this.state.editScheduleForm.description}
                                                            id="description"
                                                            className="form-control"
                                                            data-parsley-required="true"
                                                            onChange={this.handleChange}
                                                        />

                                                    </div>
                                                    <div className="col-12">

                                                        <label>Frequency</label>
                                                        <select
                                                            className="form-control"
                                                            onChange={this.handleChange}
                                                            data-parsley-required="true"
                                                            id="frequency" value={this.state.editScheduleForm.frequency}
                                                            name="frequency">
                                                            <option></option>
                                                            <option value="HOURLY">HOURLY</option>
                                                            <option value="DAILY">DAILY</option>
                                                            <option value="MONTHLY">MONTHLY</option>
                                                            <option value="YEARLY">YEARLY</option>
                                                        </select>

                                                    </div>
                                                    <div className="col-12">

                                                        <label>Frequency Count</label>

                                                        <input
                                                            type="number" value={this.state.editScheduleForm.freqCount}
                                                            name="freqCount"
                                                            id="freqCount"
                                                            className="form-control"
                                                            data-parsley-required="true"
                                                            onChange={this.handleChange}
                                                        />

                                                    </div>

                                                </div>

                                                <div className="col-12">

                                                    <label>Date to Send</label>

                                                    <input
                                                        type="text"
                                                        className="form-control startsdate"
                                                        name="scheduledDate"
                                                        id="scheduledDate" value={this.state.editScheduleForm.scheduledDate}
                                                        data-parsley-required="true"
                                                    />
                                                </div>
                                                <div className="col-12">
                                                    <label>Time to Send</label>
                                                    <div>


                                                        <TimePicker
                                                            showSecond={true}
                                                            defaultValue={moment()}
                                                            className="xxx"
                                                            onChange={this.updateStartTime}

                                                        />
                                                    </div>


                                                </div>
                                            </div>

                                        </form>
                                    </div>
                                </Modal.Body>
                                <Modal.Footer>
                                    {submitting ?
                                        <Loader type="dots"/>

                                        : <>
                                            <button className="btn primary" onClick={() => this.openEditScheduleModal()}>Close</button>
                                            <button type="submit" className="btn primary" onClick={() => this.editMessageSchedule()}>Submit</button>

                                        </>
                                    }
                                </Modal.Footer>
                            </Modal>


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
                                        <th>ID</th>
                                        <th>Name</th>
                                        <th>Message</th>
                                        <th>Scheduled For</th>
                                        <th>Schedule Frequency</th>
                                        <th>Count</th>
                                        <th>Status </th>
                                        <th></th>
                                    </tr>
                                </thead>

                                <tbody>

                                    {message != "" &&
                                        message.map((mes, index) => {

                                            return (


                                                <tr className=" " key={index} >


                                                    <td>
                                                        <span className="text-muted">{mes.id}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.name}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.payload.substring(0,45)}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{utils.formatDateString(mes.scheduledDate)}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.frequency}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.freqCount}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.status}</span>
                                                    </td>
                                                    <td>
                                                        <div className="item-action dropdown">
                                                            <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                            <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                                {mes.status === "ACT" &&
                                                                    <>
                                                                        <button data-id={mes.id}
                                                                            className="dropdown-item deleteSchedule"
                                                                        >Delete</button>

                                                                    </>
                                                                }
                                                                <button data-id={mes.id}
                                                                    className="dropdown-item editSchedule"
                                                                >Edit Schedule</button>

                                                            </div>

                                                        </div>
                                                    </td>

                                                </tr>

                                            );

                                        })
                                    }

                                </tbody>

                            </table>

                            {loading &&
                                <Loader type="dots"/>
                            }

                        </div>



                    </div>

                </div>
            </>

        )

    }

}
