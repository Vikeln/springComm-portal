/* global $ */
import authService from '../../services/auth.service';

import React, { Component } from 'react';

export default class Footer extends Component {

    constructor(props) {

        super(props);

        this.state = {

            adminPanel: authService.checkIfRoleExists("CAN_VIEW_OUTBOX_TREND"),
            value: this.props.value
        }


    }
    render() {

        return (

            <>
           {/* { ($(window).width() < 1024) && */}
            <div className="box-shadow ">
                <div className="footerContainer justify-content-center">
                   <h6 className="bootomText">&copy;  2021 TAARIFA_FLY KENYA</h6>
                    </div>
            </div>
            </>

        )

    }

}
