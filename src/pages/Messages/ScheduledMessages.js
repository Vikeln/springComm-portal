/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from '../../components/loaders/Loader';

import CommunicationsService from '../../services/communications.service';
import utils from '../../utils/utils';



export default class Messages extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            message: [],
            formData: {

            },
            startdate: "",
            enddate: "",
            loading: false,


        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMessages = this.fetchMessages.bind(this);
        this.updateStartDate = this.updateStartDate.bind(this);
        this.updateEndDate = this.updateEndDate.bind(this);


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

    componentDidUnMount() {

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

        const { message, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Scheduled Messages</h2>

                        </div>


                        <div className="padding">

                            <form onSubmit={this.fetchMessages}
                                className="fetchMessages">
                                <div
                                    className="row messageFilter">

                                    <div
                                        className="col-4">

                                        <label>Start Date</label>
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

                                        <label>End Date</label>
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
                                        <th>Name</th>
                                        <th>Message</th>
                                        <th>Scheduled For</th>
                                        <th>Schedule Frequency</th>
                                        <th>Count</th>
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
                                                        <span className="text-muted">{mes.name}</span>
                                                    </td>

                                                    <td>
                                                        <span className="text-muted">{mes.payload}</span>
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
