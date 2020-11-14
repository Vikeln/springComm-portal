/* global $ */

import React,{Component} from 'react';
import {
  Link
} from "react-router-dom";

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';

import jwt_decode from "jwt-decode";
import AuthService from '../../services/auth.service';

export default class Login extends Component{

    constructor(props){

        super(props);

        this.state ={

            email:'',
            password:'',
            emailError:'',
            passwordError:'',
            credentialsError:'',
            networkError:"",

        }

        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleEmailChange = this.handleEmailChange.bind(this);
        this.handlePasswordChange = this.handlePasswordChange.bind(this);

    }

    componentDidMount(){
        $(".login").parsley();
    }

    componentDidUnMount(){

    }

    handleEmailChange(event){

        this.setState({
            email:event.target.value,
            emailError:'',
        });

    }

    handlePasswordChange(event){

        this.setState({
            password:event.target.value,
            passwordError:'',
        });


    }

    handleSubmit(event) {

        const {email,password} = this.state;

        if(email == "" || email == null){

            this.setState({
                emailError:"Please input a valid email"
            });

        }else if(password == "" || password == null){

            this.setState({
                passwordError:"Please input a password"
            });

        }else{

            this.setState({
                loading:true,
            });

            $("form button").hide();
            // console.log(AuthService.login(email,password)) ;

            AuthService.login(email,password).then(response => {

                console.log(response);

                if(response){

                    this.setState({
                        networkError:false,
                        loading:false,
                    });

                    $("form button").show();

                }
                console.log("response.data.data " + JSON.stringify(response.data))

                if (response.data.data.access_token != undefined) {

                    var data = jwt_decode(response.data.data.access_token);

                    console.log(data);

                    localStorage.setItem("user", data.preferred_username);
                    localStorage.setItem("email",data.email);
                    localStorage.setItem("name", data.family_name + " "+ data.given_name);
                    localStorage.setItem("loginTime", Math.floor(Date.now() + (response.data.data.expires_in *1000)));
                    localStorage.setItem("data", JSON.stringify(data));
                    localStorage.setItem("roles", JSON.stringify(data.realm_access.roles));
                    localStorage.setItem("accessToken", response.data.data.access_token);

                    window.location.reload();


                }else{

                    this.setState({
                        credentialsError:response.data.data.message,
                        loading:false,
                    });

                    $("form button").show();

                }


            }).catch(error => {

                console.log(error);

                this.setState({
                    networkError:true,
                    networkErrorMessage:error.message,
                    loading:false,
                });

                $("form button").show();

            });


            this.setState({
                emailError:"",
                passwordError:"",
                networkError:"",
                credentialsError:""

            });
        }

        event.preventDefault();

      }


    render(){

        const {credentialsError,networkError,loading,networkErrorMessage} = this.state;

        return(

            <>

            {/* Authentication Screen */}
            <div id="" className="authentication ">

                <div className="page-container" id="page-container">

                    <div className="row">

                        <div className="col-md-6  r-l authenticationBackground">

                            <div className="formTitle">
                                <article>
                                    <h1>MobiConnect</h1>
                                </article>
                            </div>

                        </div>

                        <div className="col-md-6  formBody" id="content-body">

                            <div className="formcontainer">

                                <h5>Welcome back</h5>
                                <p>
                                    <small className="text-muted">Login to manage your account</small>
                                </p>

                                <form className="login" role="form"  onSubmit={this.handleSubmit}>
                                    {
                                        credentialsError!= "" &&

                                        <Notification
                                            type="error"
                                            description={credentialsError}/>
                                    }

                                    {
                                        networkError!= "" &&

                                        <Notification
                                            type="network"
                                            description={networkErrorMessage}/>
                                    }
                                    <div className="form-group">

                                        <label>Username</label>
                                        <input
                                            type="text" className="form-control"
                                            placeholder="Enter Username"
                                            data-parsley-required="true"
                                            value={this.state.email}
                                            onChange={this.handleEmailChange}/>

                                    </div>

                                    <div className="form-group">

                                        <label>Password</label>

                                        <input
                                            type="password" className="form-control" placeholder="Password"
                                            data-parsley-required="true"
                                            minLength="4"
                                            value={this.state.password}
                                            onChange={this.handlePasswordChange} />



                                        <div className="my-3 text-right">

                                            <Link to="/auth/forgotpassword" className="text-muted">Forgot password?</Link>

                                        </div>
                                    </div>

                                    {/*
                                    <div className="checkbox mb-3">
                                        <label className="ui-check">
                                            <input type="checkbox" /><i></i> Remember me
                                        </label>
                                    </div>
                                    */}


                                    <button type="submit" className="btn btn-primary mb-4">Sign in</button>

                                </form>

                                {loading &&
                                    <Loader type="dots"/>
                                }
                            </div>
                        </div>

                    </div>

                </div>
            </div>
             {/* End Authentication Screen*/}

            </>

        )

    }

}
