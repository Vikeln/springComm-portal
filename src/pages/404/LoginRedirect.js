import React,{Component} from 'react';

import AuthService from '../../services/auth.service';

export default class LoginRedirect extends Component{

    constructor(props){

        super(props);

        this.state ={

            value:this.props.value

        }

    }

    componentDidMount(){

        if(AuthService.getCurrentUser() == null){

            window.location.href = '/auth/login';

        }

    }

    componentDidUnMount(){

    }

    render(){

        return(

            <>
                <div id="content" className="flex ">

                    <div className="page-container" id="page-container">



                    </div>

                </div>
            </>

        )

    }

}
