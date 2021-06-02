import React,{Component} from 'react';

import $ from "jquery";

export default class Welcome extends Component{

    constructor(props){

        super(props);

        this.state ={

            value:this.props.value

        }

    }

    componentDidMount(){


    }

    componentDidUnMount(){

    }

    render(){

        return(

            <>
                <div id="content" className="flex ">

                    <div class="page-container" id="page-container">

                        <div className="bannerImage">

                            <img src="./assets/img/banner/banner1.jpg" />

                            <article>
                            <div className="col-10 adminSummary">

{/* Tabs Header */}
<div className="card">

    <div className="card-header p-0 no-border" data-stellar-background-ratio="0.1" data-plugin="stellar">

        <div className=" r-2x no-r-b">

            <div className="d-md-flex">

                <div className="p-4">

                    <div className="d-flex">

                        <a href="#">
                            <span className="avatar w-64">
                                <img src="../assets/img/a1.jpg" alt="." />
                                <i className="on"></i>
                            </span>
                        </a>

                        <div className="mx-3">

                            <h4 className="mt-2">TRENDYMEDIA</h4>
                            {/* <div className=""><small><i className="fa fa-map-marker mr-2"></i>Capital West Building, Westlands, Nairobi</small></div> */}
                        </div>
                    </div>
                </div>




            </div>

        </div>
    </div>

</div>
{/* End Tabs Header*/}

</div>
                                </article>


                        </div>


                    </div>

                </div>
            </>

        )

    }

}
