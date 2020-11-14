/* global $ */

import React,{Component} from 'react';

import AuthService from '../../services/auth.service';

export default class Logout extends Component{

    constructor(props){

        super(props);

        this.state ={

            email:'',

        }


    }

    componentDidMount(){

        AuthService.logout();

    }

    componentDidUnMount(){

    }


    render(){



        return(

            <>

            <div>
                Log out
            </div>

            </>

        )

    }

}
