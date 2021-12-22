import React, { Component } from 'react';

import $ from "jquery";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowRight, faEnvelope } from '@fortawesome/free-solid-svg-icons';
import AuthService from '../services/auth.service';

export default class Home extends Component {

    constructor(props) {

        super(props);

        this.state = {

            value: this.props.value,
            authenticated:false

        }

    }

    componentDidMount() {
        
    if (AuthService.getCurrentUser() == null) {
        this.setState({
          authenticated: false,
        });
  
      } else {
  
        this.setState({
          authenticated: true,
        });
    }

    }

    componentDidUnMount() {

    }

    render() {

        const {authenticated} = this.state;
        return (

            <>
                <div id="content" className="flex ">
                    <h4 className="mt-2 text-center">TAARIFAFLY KENYA</h4>
                    <br></br>
                    <div class="container">
                        <img className="bannerImage" src="./assets/img/banner/home2.png" />
                        <div className="flex">


                            <br></br>


                            <div className="centered">


                                {!authenticated ?
                                <>
                                    <a href="/contacts" className="nav-link">
                                        <button className="btn btn-login btn-rounded">Contact Us <span> </span> <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon> </button>
                                    </a>
                                    <a href="/auth/login" className="nav-link">
                                        <button className="btn btn-login btn-rounded">Client Login <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                                    </a>
                                </>
                                :
                                <a href="/portal/adminprofile" className="nav-link">
                                <button className="btn btn-login btn-rounded">Dashboard <FontAwesomeIcon icon={faArrowRight}></FontAwesomeIcon></button>
                            </a>
}
                            </div>
                        </div>
                    </div>


                    <article>
                        <div className="col-12 adminSummary">

                            {/* Tabs Header */}
                            <div className="card">

                                <div className="card-header p-0 no-border" data-stellar-background-ratio="0.1" data-plugin="stellar">

                                    <div className=" r-2x no-r-b">

                                        <div className="d-md-flex">

                                            <div className="p-4 card-body">
                                                <div className="row">

                                                    <div className="col-sm">

                                                        <div className="card">

                                                            <div className="card-text text-center">
                                                                <h4>BULK SMS</h4>
                                                                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>

                                                            </div>
                                                            <div className="card-body">

                                                                <hr></hr>
                                                                Send bulk messages to all your customers with contacts to any TELCO in the country. Use our robust engine on our dashboard to schedule messages from any device.

                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm">

                                                        <div className="card">

                                                            <div className="card-text text-center">
                                                                <h4>TWO WAY SMS</h4>
                                                                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>

                                                            </div>
                                                            <div className="card-body">

                                                                <hr></hr>
                                                                Send and receive messages to and from customers to gain meaningly feedback on your services. 
                                                                Create unique flows on our bots to create autonomous two-way communication channel. 
                                                                
                                                            </div>
                                                        </div>
                                                    </div>
                                                    <div className="col-sm">

                                                        <div className="card">

                                                            <div className="card-text text-center">
                                                                <h4>PREMIUM SMS</h4>
                                                                <FontAwesomeIcon icon={faEnvelope}></FontAwesomeIcon>

                                                            </div>
                                                            <div className="card-body">

                                                                <hr></hr>
                                                                We provide sending of premium messages to customers subscribed to your entertainment service.
                                                                Reach more and more premium customers daily by creating your schedules on the dashboard.
                                                            </div>
                                                        </div>
                                                    </div>

                                                </div>
                                                <h3 className='text-center'>Your most secure and direct customer-interactions partner.</h3>

                                            </div>




                                        </div>

                                    </div>
                                </div>

                            </div>
                            {/* End Tabs Header */}
                        </div>
                    </article>

                </div>
            </>

        )

    }

}
