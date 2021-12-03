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
import authService from '../../services/auth.service';

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
            revealApiKey: false,

        }
        this.revealApiKey = this.revealApiKey.bind(this);

    }

    componentDidMount() {

    }
    revealApiKey(){
        this.setState({
            showKey : !this.state.showKey
        });

    }

    componentDidUnMount() {

    }

    componentDidUpdate() {
        if (this.state.showKey){

        setTimeout(() => {
            
            this.setState({
                showKey : false
            });
        
              }, 10000);
}
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
                                        API INTEGRATION</div>
                                    <div className="card-body">
                                        <div className="row advancedSearchOptions ">


                                            <div className="col-7 secondaryActions">

                                                <form>
                                                    <div className="row">
                                                        <div className="col-8">
                                                            <label>API KEY</label>
                                                            <input type="text"
                                                                disabled
                                                                className="form-control"
                                                                value={this.state.showKey ? authService.getCurrentClientKey() : "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX"}
                                                            />
                                                        </div>
                                                        <div className="col-4">
                                                            <Button variant="primary" className="pull-left float-left" onClick={() => this.revealApiKey()}>
                                                                Reveal Api Key
                                                            </Button>
                                                        </div>
                                                    </div>
                                                </form>

                                                <div className="row">
                                                    <br></br>
                                                </div>

                                                <a
                                                    className="btn-rounded upload-download" href="/assets/files/TAARIFA_KENYADocumentation.pdf"

                                                    download>

                                                    <span className="">
                                                        <i className="i-con i-con-download">
                                                            <i></i>
                                                        </i>
                                                    </span>Download Api Documentation</a>
                                            </div>

                                        </div>
                                        Wanna try the apis out?   <a target="_blank" href="https://TAARIFA_KENYA-api.mfs.co.ke/swagger-ui.html">
                                            Open Playground.</a>
                                    </div>
                                </div>


                                {loading &&
                                    <Loader type="dots" />
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
