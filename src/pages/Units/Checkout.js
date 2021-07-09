
/* global $ */

import React, { Component } from 'react';

import Iframe from 'react-iframe';

import { Button, Modal } from 'react-bootstrap'

import {
    Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';
import utils from '../../utils/utils';
import { clientBaseUrl } from '../../API';

import crypto from 'crypto';

export default class Checkout extends Component {

    constructor(props) {

        super(props);

        this.state = {

            redirectUrl: localStorage.getItem("redirectUrl"),
            value: this.props.value,
            clientService: this.props.match.params.id,
        }

        this.handleModalShowHidePayment = this.handleModalShowHidePayment.bind(this);
    }

    handleModalShowHidePayment() {
        window.location.href = "/dashboard/transactions/" + this.state.clientService
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

                    {/* <div className="page-container" id="page-container">

                        {/* <div className="page-title padding pb-0 ">

                            <h2 className="text-md mb-0">Payment Checkout</h2>

                        </div>

                        <div className="padding">



                            

                        </div>

                    </div> */}
                    <div className="view viewall paymentCheckoutDiv">

                        <Iframe url={this.state.redirectUrl}
                        // sandbox="allow-top-navigation allow-scripts allow-forms"
                            height="500px"
                            width="100%"
                            id="myId"
                            className="paymentCheckout"
                            display="initial"
                            position="center"

                        />

                        <Button variant="secondary" onClick={() => this.handleModalShowHidePayment()}>
                            Go Back
                        </Button>

                    </div>
                </div>
            </>

        )

    }

}

