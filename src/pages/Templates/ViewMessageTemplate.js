/* global $ */

import React, { Component } from 'react';

import Notification from '../../components/notifications/Notifications';

export default class ViewMessageTemplate extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            message: [],
            formData: {

            }

        }

        this.handleChange = this.handleChange.bind(this);
        this.handleUserSubmission = this.handleUserSubmission.bind(this);


    }

    componentDidMount() {

        //$(".fetchMessages").parsley();

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

    handleUserSubmission(event) {


    }


    render() {

        const {successfulSubmission,networkError,submissionMessage} = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <h2>Page Title</h2>


                        <div className="padding">



                            {/* Form Sample */}
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

                                            <option></option>
                                            <option value="1">Template 1</option>
                                            <option value="2">Template 2</option>
                                            <option value="3">Template 3</option>

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
                                                data-parsley-trigger="keyup" data-parsley-minlength="20" data-parsley-maxlength="100"
                                                onChange={this.handleChange}
                                                cols=""
                                                rows="">
                                            </textarea>
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
                                    description={submissionMessage}/>
                            }

                            {networkError &&
                                <Notification
                                    type="network"
                                    description="Network Connection Issue, please check your internet connection and try again"
                                />
                            }
                            {/* End Form Sample*/}

                        </div>



                    </div>

                </div>
            </>

        )

    }

}
