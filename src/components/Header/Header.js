/* global $ */

import React,{Component} from 'react';

import {
  Link,
} from "react-router-dom";

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBars } from '@fortawesome/free-solid-svg-icons';

import AuthService from '../../services/auth.service';

export default class Header extends Component{

    constructor(props){

        super(props);

        this.state ={

            user:AuthService.getCurrentUser(),
            mobileMenu:"closed",
            viewUsers: AuthService.checkIfRoleExists("CAN_VIEW_USERS"),
            viewLoan: AuthService.checkIfRoleExists("CAN_VIEW_LOAN_PRODUCT"),

        }

        this.logoutUser = this.logoutUser.bind(this);

    }

    componentDidMount(){

        if($(window).width() < 1024){

            $(document).on("click","#aside .nav-item a",function(){

                $('#aside').modal('hide');

            })

        }

    }

    componentDidUnMount(){

    }

    logoutUser(){

        AuthService.logout();


    }

    render(){

        const {viewUsers,viewLoan} = this.state;

        return(

            <>
            <header id="header" className="page-header bg-white box-shadow animate fadeInDown  ">

                <div className="navbar navbar-expand-lg" >

                    {/* Site Logo */}
                    <Link className="navbar-brand" to="/dashboard">
                        <img src="/assets/img/logo.png" />
                    </Link>
                    {/* End Site Logo*/}



                    {/* Main Navigation */}
                    <ul className="nav navbar-menu order-1 order-lg-2">

                        {/* Admin Profile  */}
                        <li className="nav-item dropdown">

                            <a href="#" data-toggle="dropdown" className="nav-link d-flex align-items-center py-0 px-lg-0 px-2 text-color">

                                {/* Admin Text */}
                                <span className=" mx-2 d-none l-h-1x d-lg-block text-right">

                                    <small className='text-fade d-block mb-1'>Hello, Welcome</small>
                                    <span>{this.state.user}</span>

                                </span>
                                {/* End Admin Text*/}

                                {/* Admin Profile Pic */}
                                <span className="avatar w-36">
                                    <img src="/assets/img/a0.jpg" alt="..." />
                                </span>
                                {/* End Admin Profile Pic*/}
                            </a>

                            {/* Drop Down Options */}
                            <div className="dropdown-menu dropdown-menu-right w pt-0 mt-3 animate fadeIn">

                                {viewUsers == true && viewLoan == true ?
                                    <Link
                                        className="dropdown-item" to="/dashboard/adminprofile">
                                        <span>Profile</span>
                                    </Link>
                                     :
                                     ""
                                 }




                                <Link
                                    className="dropdown-item" to="/logout">Sign out</Link>
                            </div>
                            {/* End Drop Down Options*/}

                        </li>
                        {/* End Admin Profile */}

                        <li className="nav-item d-lg-none">
                            <a
                                className="d-lg-none i-con-h-a px-1"
                                data-toggle="modal"
                                data-target="#aside">
                                <FontAwesomeIcon
                                    icon={faBars}
                                    size="1x"
                                    className="icon"/>
                            </a>
                        </li>
                    </ul>
                    {/* End Main Navigation*/}





                </div>
            </header>
            </>

        )

    }

}
