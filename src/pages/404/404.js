import React,{Component} from 'react';

import $ from "jquery";

export default class PageNotFound extends Component{

    constructor(props){

        super(props);

        this.state ={

            value:this.props.value

        }

    }

    componentDidMount(){

        setTimeout(() => {

          window.location.href="/portal/adminProfile";

      }, 2000);
    }

    componentDidUnMount(){

    }

    render(){

        return(

            <>
                <div id="content" className="flex ">

                    <div class="page-container" id="page-container">

                        <div className="notFound">

                            <h1>404</h1>

                            <h2>Page Not Found</h2>

                            <p>Will Redirect you to the portal</p>
                        </div>


                    </div>

                </div>
            </>

        )

    }

}
