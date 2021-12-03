/* global $ */

import React, { Component } from 'react';

import Notification from '../../components/notifications/Notifications';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import CommunicationsService from '../../services/communications.service';

export default class EditMessageTemplate extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            id:this.props.match.params.id,
            message: [],
            formData: {

            }

        }

        this.handleChange = this.handleChange.bind(this);
        this.loadSingleTemplate = this.loadSingleTemplate.bind(this);
        this.handleSubmission = this.handleSubmission.bind(this);


    }

    async componentDidMount() {

        const {id} = this.state;
        await this.loadSingleTemplate(id);

        $(".editTemplate").parsley();

    }

    componentDidUnMount() {

    }

    handleChange(el) {
        let inputName = el.target.name;
        let inputValue = el.target.value;
        let stateCopy = Object.assign({}, this.state);
        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);

    }

    loadSingleTemplate(id){

        CommunicationsService.getSingleMessageTemplate(id).then(response =>{


            if(response.data.status === "success"){

                this.setState({
                    formData: response.data.data,
                });


            }else{

                confirmAlert({
                    title: 'Error retrieving data',
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
                        label: 'ok',
                    }
                ]
            });

        })

    }

    handleSubmission(event){

        const {formData,id} = this.state;

        event.preventDefault();

        console.log(JSON.stringify(formData));
        if ($(".editTemplate").parsley().isValid()) {

            CommunicationsService.updateMessageTemplate(id,formData).then(response => {

                if(response.data.status == "success"){

                    confirmAlert({
                        title: 'Succesfully Updated  Template',
                        message: 'Click Yes to proceed.',
                        buttons: [
                            {
                                label: 'Yes',
                                onClick: () => window.location.href = "/portal/messagetemplates"
                            }
                        ]
                    });

                }else{

                    confirmAlert({
                        title: 'Error Submitting Data for ',
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


    render() {

        const {formData} = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                    {/* Page Title */}
                    <div className="page-title padding pb-0 ">
                        <h2 className="text-md mb-0">Edit Template</h2>
                    </div>
                    {/* End Page Title*/}


                        <div className="padding">



                            {/* Form Sample */}
                            <form

                                className="editTemplate view createForm"
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
                                            value={formData.templateName || ""}
                                            onChange={this.handleChange}/>
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

                                            <option value={formData.templateType || ""}>{formData.templateType}</option>


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
                                            <option value="eng">English</option>
                                            <option value="kis">Kiswahili</option>

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
                                                data-parsley-trigger="keyup" data-parsley-minlength="1" data-parsley-maxlength="1000"
                                                onChange={this.handleChange}
                                                value={formData.template || ""}
                                                cols=""
                                                rows="">
                                            </textarea>
                                    </div>

                                </div>

                                <div className="row">

                                    <div className="col-12">

                                        <button
                                            className="btn-primary"
                                            type="submit">Update Message Template</button>

                                        <button
                                            className="btn-primary"
                                            type="reset">Cancel</button>

                                    </div>


                                </div>

                            </form>


                            {/* End Form Sample*/}

                        </div>



                    </div>

                </div>
            </>

        )

    }

}
