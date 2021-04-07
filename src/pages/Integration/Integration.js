/* global $ */

import React, { Component } from 'react';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import TenantService from '../../services/tenant.service';
import { Button, Modal } from 'react-bootstrap'
import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

export default class Integration extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            errors: "",
            networkError: false,
            successfulSubmission: false,
            submissionMessage: "",
            loading: false,

        }

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }



    render() {

        const { sources, successfulSubmission, networkError, submissionMessage, products, loading } = this.state;

        return (

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        <div className="padding">



                            <div className="view viewall">

                                <div className="card">
                                    <div className="card-title page-title padding pb-0 ">
                                        MOBICONNECT API INTEGRATION</div>
                                    <div className="card-body">
                                        Interested?  <a target="_blank" href="https://lbtotal.mfs.co.ke/swagger-ui.html">
                                            Here's our documentation.</a>
                                    </div>
                                </div>


                                {loading &&
                                    <Loader type="circle" />
                                }
                            </div>

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