/* global $ */

import React,{Component} from 'react';

import AuthService from '../../services/auth.service';

import Notification from '../../components/notifications/Notifications';

import Loader from '../../components/loaders/Loader';


export default class ForgotPassword extends Component{

    constructor(props){

        super(props);

        this.state ={

            formData:{

                email:""

            },
            networkError:false,
            successfulSubmission:false,
            submissionMessage:"",
            loading:false

        }

        this.handleUserSubmission = this.handleUserSubmission.bind(this);
        this.handleChange = this.handleChange.bind(this);

    }

    componentDidMount(){

        $(".resetPassword").parsley();

    }

    componentDidUnMount(){

        $(".resetPassword").parsley().destroy();

    }

    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;

        let stateCopy = Object.assign({}, this.state);

        stateCopy.formData[inputName] = inputValue;

        this.setState(stateCopy);

    }

    handleUserSubmission(event) {



        const {formData} = this.state;

        event.preventDefault();

        if( $(".resetPassword").parsley().isValid() ){

            this.setState({
                loading:true,
            });

            $("form button").hide();

            AuthService.forgotPassword(formData).then(response => {

                console.log(response);

                if(response){

                    this.setState({
                        networkError:false,
                        loading:false
                    });

                    $("form button").show();

                }

                if(response.data.status == "success"){

                    this.setState({
                        successfulSubmission:true,
                        submissionMessage : response.data.message,
                        loading:false
                    });

                    setTimeout(function(){
                        window.location.href ="/auth/login"
                    }, 3000);

                }else{
                    this.setState({
                        successfulSubmission:true,
                        submissionMessage : response.data.message,
                        loading:false
                    });
                }

            }).catch(error => {

                console.log(error);

                this.setState({
                    networkError:true,
                    loading:false
                });

                $("form button").show();


            });

        }



    }


    render(){

        const {successfulSubmission,networkError,submissionMessage,loading} = this.state;

        return(

            <>
            <div id="" className="authentication ">
                <div className="page-container" id="page-container">
                    <div className="row">

                        <div className="col-md-6 authenticationBackground r-l">
                            <div className="formTitle">
                                <article>
                                    <h1>Mkulima Loan</h1>
                                    <h3>Admin Dashboard</h3>
                                </article>
                            </div>
                        </div>

                        <div className="col-md-6 formBody" id="content-body">
                            <div className="formcontainer">
                                <h5>Forgot Password</h5>

                                {successfulSubmission &&
                                    <Notification
                                        type="success"
                                        description={submissionMessage}
                                    />
                                }

                                {networkError &&
                                    <Notification
                                        type="network"
                                        description="Network Connection Error"
                                    />
                                }

                                <form
                                    className="resetPassword"
                                    onSubmit={this.handleUserSubmission}
                                    role="form" >

                                    <div className="form-group">

                                        <label>Email Address</label>

                                        <input type="email" className="form-control"
                                        data-parsley-required="true"
                                        name="email"
                                        id="email"
                                        onChange={this.handleChange} placeholder="Email" />

                                    </div>

                                    <button type="submit" className="btn btn-primary mb-4">Send New Password</button>

                                </form>

                                {loading &&
                                    <Loader type="dots"/>
                                }
                            </div>
                        </div>

                    </div>
                </div>
            </div>
            </>

        )

    }

}
