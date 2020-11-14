/* global $ */

import React, { Component } from 'react';

import {
    Link
} from "react-router-dom";

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from '../../components/loaders/Loader';
import CommunicationsService from '../../services/communications.service';
import Notification from '../../components/notifications/Notifications';


export default class MessageTemplates extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            messageTemplates: [],
            formData: {
                parameters: "",
                id: null,
                parametersArray: ""
            }, errors: "",
            rolesReceived: "",
            groupReceived: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading:false

        }

        this.handleChange = this.handleChange.bind(this);
        this.fetchMessageTemplates = this.fetchMessageTemplates.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);
        this.toggleView = this.toggleView.bind(this);
        this.setMessageParams = this.setMessageParams.bind(this);
        $(document).on("change", "input.parameters", this.setMessageParams);


    }

    componentDidMount() {

        //$('.table').bootstrapTable();
        $(".view").hide();
        $(".view:first").show();
        this.fetchMessageTemplates();

    }

    componentDidUnMount() {

    }
    async fetchMessageTemplates() {

        this.setState({
            loading:true
        });

        CommunicationsService.getAllMessageTemplates().then(response => {

            if (response.data.status != "error") {


                this.setState({
                    messageTemplates: response.data.data != null ? response.data.data : [],
                    loading:false
                });

                $('.table').bootstrapTable();


            }


        }).catch(error => {

            this.setState({
                loading:false
            });

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

        if (inputName == "template") {

            var templateString = inputValue;
            var params = templateString.match(/{{(.*?)}}/g);



            if (params != null && params.length > 0) {

                var paramsText = params.toString();
                var paramsWithoutBraces = paramsText.replace(/{{|}}/gi, "");

                stateCopy.formData.parametersArray = params;
                stateCopy.formData.parameters = paramsWithoutBraces;

                //this.setMessageParams(params);

            }

            this.setState(stateCopy);


        } else {

            this.setState(stateCopy);

        }



    }

    setMessageParams(params) {

        this.setState({
            formData: {
                parameters: params
            }
        });

        // this.setState({
        //     parameters:params
        // })

    }

    handleSubmission(event) {

        const { formData } = this.state;

        event.preventDefault();
        console.log(JSON.stringify(formData));

        if ($(".createTemplate").parsley().isValid()) {


            CommunicationsService.createMessageTemplate(formData).then(response => {

                if (response.data.status != "error") {
                    window.location.reload(true);
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

            // $(".view").hide();
            // $(".view:first").show();
            // $("form input,form textarea").val("");


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

        const { messageTemplates, successfulSubmission, loading,networkError, submissionMessage } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Message Templates</h2>

                        </div>


                        <div className="padding">

                            <div className="toggleMenu">
                                <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="viewall">View Message Templates</button>
                                <button
                                    className="btn-primary"
                                    onClick={this.toggleView}
                                    data-target="createForm">Add Message Template</button>

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
                                            <th>Template Id</th>
                                            <th>Template Name</th>
                                            <th>Template</th>
                                            <th>Language </th>
                                            <th>Actions </th>
                                        </tr>
                                    </thead>

                                    <tbody>


                                        {messageTemplates != "" &&
                                            messageTemplates.map((mes, index) => {

                                                return (


                                                    <tr className=" " key={index} >


                                                        <td>
                                                            <span className="text-muted">{mes.id}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.templateName}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.template}</span>
                                                        </td>

                                                        <td>
                                                            <span className="text-muted">{mes.language}</span>
                                                        </td>

                                                        <td>

                                                            <div className="item-action dropdown">
                                                                <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                                                                <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                                                    <Link className="dropdown-item" to={'/dashboard/editmessagetemplate/' + mes.id}>
                                                                        Edit
                                                                        </Link>
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
                                    <Loader type="circle" />
                                }

                            </div>

                            <form

                                className="createTemplate view createForm"
                                onSubmit={this.handleSubmission}>
                                <div
                                    className="row">

                                    <div
                                        className="col-4">

                                        <label>Template Name</label>

                                        <input
                                            type="text"
                                            name="templateName"
                                            id="templateName"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange} />
                                    </div>

                                    <div
                                        className="col-4">

                                        <label>Template Type</label>

                                        <select
                                            id="templateType"
                                            name="templateType"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange}>

                                            <option>--Select One--</option>
                                            <option value="SMS">SMS</option>
                                        </select>

                                    </div>

                                    <div
                                        className="col-4">

                                        <label>Language</label>

                                        <select
                                            id="language"
                                            name="language"
                                            className="form-control"
                                            data-parsley-required="true"
                                            onChange={this.handleChange}>
                                            <option></option>
                                            <option value="ENG">English</option>
                                            <option value="KIS">Kiswahili</option>

                                        </select>
                                    </div>

                                    <div
                                        className="col-12">

                                        <input
                                            type="hidden" id="messageParameters"
                                            name="messageParameters"
                                            onChange={this.handleChange}
                                        />

                                        <label>Template</label>
                                        <textarea
                                            name="template"
                                            id="template"
                                            data-parsley-required="true"
                                            data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="255"
                                            onChange={this.handleChange}
                                            cols=""
                                            rows="">
                                        </textarea>


                                        <input
                                            type="hidden"
                                            name="parameters"
                                            className="parameters"
                                            value={this.state.parameters || ""} onInput={this.handleChange} />
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-12">

                                        <button
                                            className="btn-primary"
                                            type="submit">Create Message Template</button>

                                        <button
                                            className="btn-primary"
                                            type="reset">Cancel</button>

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
