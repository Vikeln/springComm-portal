/* global $ */

import React,{Component} from 'react';

import UserService from '../../services/user.service';
import Notification from '../../components/notifications/Notifications';

import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

import Loader from '../../components/loaders/Loader';


export default class AddUser extends Component{

    constructor(props){

        super(props);

        this.state ={

            value:this.props.value,
            formData:{
                enabled:false,
                userGroups:[]

            },
            groupNames:[],
            roles:[],
            errors:"",
            rolesReceived:"",
            groupReceived:"",
            networkError:false,
            successfulSubmission:false,
            submissionMessage:"",
            loading:false,


        }

        this.handleInputChange = this.handleInputChange.bind(this);
        this.handleChange = this.handleChange.bind(this);
        this.handleUserSubmission = this.handleUserSubmission.bind(this);

        this.getGroupValues = this.getGroupValues.bind(this);

    }

    componentDidMount(){

        $(".createUser").parsley();
        this.getGroupValues();

    }

    componentDidUnMount(){

    }

    handleInputChange(event) {

        const target = event.target;
        const value = target.type === 'checkbox' ? target.checked : target.value;
        const name = target.name;

        this.setState({

            [name]: value

        });


    }

    handleChange(el) {

        let inputName = el.target.name;
        let inputValue = el.target.value;
        let userGroups = [];
        let options = el.target.options;

        let stateCopy = Object.assign({}, this.state);

        if(inputName == "role"){

            stateCopy.formData[inputName] = parseInt(inputValue);

        }else if(inputName == "userGroups"){

            for (var i = 0, l = options.length; i < l; i++) {

                if (options[i].selected) {
                  userGroups.push(parseInt(options[i].value));
                }

            }

            stateCopy.formData[inputName] = userGroups ;


        }else{

            stateCopy.formData[inputName] = inputValue;

        }



        this.setState(stateCopy);

    }

    getGroupValues(){

        UserService.getUserRoles().then( response => {

            if(response.data.status != "error"){

                this.setState({
                    roles:response.data.data,
                    rolesReceived:"yes"
                });

            }else{


                confirmAlert({

                    title: 'Error',
                    message: response.data.message,
                    buttons: [
                        {
                            label: 'ok',
                        }
                    ]
                });
            }

        }).catch(error =>{

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

    handleUserSubmission(event) {

        const {formData} = this.state;

        event.preventDefault();

        if( $(".createUser").parsley().isValid() ){

            this.setState({
                loading:true,
            });

            $('input[type="submit"],button[type="submit"]').hide();

            UserService.createUser(formData).then(response => {

                if(response){

                    this.setState({
                        networkError:false
                    });

                }

                if(response.data.status == "success"){

                    this.setState({
                        successfulSubmission:true,
                        submissionMessage : response.data.message,
                        loading:false,
                    });

                    confirmAlert({

                        title: 'Success',
                        message:response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                                onClick: () => window.location.href ="/dashboard/users"
                            }
                        ]
                    });


                }else{

                    confirmAlert({

                        title: 'Error',
                        message:response.data.message,
                        buttons: [
                            {
                                label: 'ok',
                                onClick: () => window.location.href ="/dashboard/users"
                            }
                        ]
                    });

                    $('input[type="submit"],button[type="submit"]').show();

                }

            }).catch(error => {

                this.setState({
                    networkError:true,
                    loading:false

                });

                confirmAlert({
                  title: 'Following Error Occurred',
                  message: error.message,
                  buttons: [
                    {
                      label: 'Ok',
                    }
                  ]
                });

                $('input[type="submit"],button[type="submit"]').show();

            });

        }



    }

    render(){

        const {roles,groupNames,rolesReceived,groupReceived,loading} = this.state;


        return(

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">

                        {/* Page Title */}
                        <div className="page-title padding pb-0 ">
                            <h2 className="text-md mb-0">Add User</h2>
                        </div>
                        {/* End Page Title*/}


                        <form

                            className="createUser padding"
                            onSubmit={this.handleUserSubmission}>
                            <div
                                className="row">

                                <div
                                    className="col-4">

                                    <label>First Name</label>

                                    <input
                                        type="text"
                                        name="firstName"
                                        id="firstName"
                                        className="form-control"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                <div
                                    className="col-4">

                                    <label>Last Name</label>

                                    <input
                                        type="text"
                                        name="lastName"
                                        id="lastName"
                                        className="form-control"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                <div
                                    className="col-4">

                                    <label>Other Name</label>

                                    <input
                                        type="text"
                                        name="otherName"
                                        id="otherName"
                                        className="form-control"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                <div
                                    className="col-12">

                                    <label>User Name</label>

                                    <input
                                        type="text"
                                        name="userName"
                                        id="userName"
                                        className="form-control"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                <div className="col-4">

                                    <label>Phone Number</label>

                                    <input
                                        type="number"
                                        name="phoneNumber"
                                        id="phoneNumber"
                                        data-parsley-pattern="(?:254|\+254|0)?(7(?:(?:[0-9][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$"
                                        data-parsley-required-message="Phone Number required"
                                        data-parsley-pattern-message="Invalid Phone Number"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                <div className="col-4">

                                    <label>Email</label>

                                    <input
                                        type="email"
                                        name="email"
                                        id="email"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}/>
                                </div>

                                {groupReceived != "" &&

                                    <>
                                    <div className="col-12">

                                        <label>User Groups <em>*Use ctr on Windows / Command on Mac to select multiple groups</em></label>

                                        <select
                                            className="form-control"
                                            name="userGroups"
                                            id="userGroups"
                                            multiple
                                            data-parsley-required="true"
                                            onChange={this.handleChange}>
                                            <option value=""></option>
                                            {groupNames != "" &&

                                                groupNames.map((group,index) => (
                                                    <option key={group.id} value={group.id}>{group.name}</option>
                                                ))
                                            }
                                        </select>

                                    </div>
                                    </>
                                }

                                {rolesReceived != "" &&
                                <div className="col-12">

                                    <label>Role</label>

                                    <select
                                        className="form-control"
                                        name="role"
                                        id="role"
                                        data-parsley-required="true"
                                        onChange={this.handleChange}>
                                        <option value=""></option>
                                        {roles != "" &&

                                            roles.map((role,index) => (
                                                <option key={role.id} value={role.id}>{role.name}</option>
                                            ))
                                        }
                                    </select>

                                </div>
                            }



                            </div>

                            <div className="row">

                                <div className="col-12">

                                    <button
                                        className="btn-primary"
                                        type="submit">Create User</button>

                                    <button className="btn-primary" type="reset">Cancel</button>

                                </div>


                            </div>

                        </form>

                        {loading &&
                            <Loader type="circle" />
                        }

                    </div>

                </div>
            </>

        )

    }

}