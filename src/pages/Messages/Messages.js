/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from '../../components/loaders/Loader';
import authService from '../../services/auth.service';

import CommunicationsService from '../../services/communications.service';
import sourceService from '../../services/source.service';
import userService from '../../services/user.service';



export default class Messages extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            message: [],
            users: [],
            sources: [],
            formData: {
                source: "",
                sentBy: "",
            },
            startdate: "",
            enddate: "",
            filterMessages: authService.checkIfRoleExists("CAN_FILTER_MESSAGES_BY_USER"),
            loading: false,


        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.openAdvancedSearch = this.openAdvancedSearch.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);
        this.fetchUsers = this.fetchUsers.bind(this);
        this.fetchMySenders = this.fetchMySenders.bind(this);


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

        $(document).on("change", ".startdate", this.updateStartDate);
        $(document).on("change", ".enddate", this.updateEndDate);
        $(".advancedSearchButton").click(this.openAdvancedSearch);
        if (authService.checkIfRoleExists("CAN_VIEW_USERS"))
            this.fetchUsers();
        this.fetchMySenders();
        this.openAdvancedSearch();

    }
    openAdvancedSearch() {

        $(".advancedSearch").stop().slideToggle();

    }

    updateStartDate(date) {



        this.setState({
            startdate: date.target.value
        });

    }

    updateEndDate(date) {



        this.setState({
            enddate: date.target.value
        });

    }

    componentDidUpdate() {

    }

    fetchMessages(event) {

        const { startdate, enddate } = this.state;
        const { source, sentBy } = this.state.formData;

        event.preventDefault();


        if (startdate == "") {
            alert("Please select a start date");
        }

        if (enddate == "") {
            alert("Please select an end date");
        }


        //if ($(".fetchMessages").parsley().isValid()) {
        if (startdate != "" && enddate != "") {

            this.openAdvancedSearch();
            this.setState({
                loading: true,
                message: []
            });

            CommunicationsService.getAllMessages(startdate, enddate, source, sentBy).then(response => {
                if (response.data.status != "error") {

                    if ((response.data.data == null || response.data.data == undefined)) {
                        confirmAlert({
                            title: 'No records',
                            message: "No messages found",
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

    fetchUsers() {

        this.setState({
            loading: true
        });

        userService.getAllUsers().then(response => {



            if (response.data.status != "error") {

                this.setState({
                    users: response.data.data,
                    loading: false,
                });

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

    fetchMySenders() {

        sourceService.getAllSources().then(response => {

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
        if (inputName == "source")
            stateCopy.formData[inputName] = parseInt(inputValue);
        else if (inputName == "sentBy")
            stateCopy.formData[inputName] = inputValue;
        else
            stateCopy.formData[inputName] = this.formatDate(Date.parse(inputValue));
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
    render() {

        const { message, loading, filterMessages, users, sources } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">All Messages</h2>

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
                                                className="col-3">

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
                                                className="col-3">

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
                                            {filterMessages &&
                                                <div
                                                    className="col-3 ">
                                                    <label>Sent By</label>
                                                    <select
                                                        className="form-control"
                                                        name="sentBy"
                                                        id="sentBy"
                                                        data-parsley-required="true"
                                                        onChange={this.handleChange}>
                                                        <option value=""></option>
                                                        {users != "" &&

                                                            users.map((group, index) => (
                                                                <option key={group.user.id} value={group.user.userName}>{group.user.firstName + " " + group.user.lastName + (group.apiUser ? " - Api User" : "")}</option>
                                                            ))
                                                        }
                                                    </select>
                                                </div>
                                            }
                                            <div
                                                className="col-3 ">
                                                <label>Sent Through</label>
                                                <select
                                                    className="form-control"
                                                    name="source"
                                                    id="source"
                                                    data-parsley-required="true"
                                                    onChange={this.handleChange}>
                                                    <option value=""></option>
                                                    {sources != "" &&

                                                        sources.map((group, index) => (
                                                            <option key={index} value={group.id}>{group.senderId}</option>
                                                        ))
                                                    }
                                                </select>
                                            </div>
                                            <div
                                                className="col-3 ">
                                                <button
                                                    className="btn-primary"
                                                    type="submit">Fetch OutBox</button>
                                            </div>
                                        </div>

                                    </form>

                                </div>
                            </div>
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
                                data-detail-view="false"
                                data-mobile-responsive="true"
                                data-pagination="true"
                                data-page-list="[10, 25, 50, 100, ALL]"
                            >

                                <thead>
                                    <tr>
                                        <th>ID</th>
                                        <th>Recepient</th>
                                        <th>Message</th>
                                        <th>Request Status </th>
                                        <th>Status </th>
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
                                                        <span className="text-muted">{mes.recipient}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.message}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.sentResponseStatus}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.processedStatus}</span>
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



                    </div>

                </div>
            </>

        )

    }

}
