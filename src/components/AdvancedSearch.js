/* global $ */

import React,{Component} from 'react';

import {
  Link
} from "react-router-dom";

export default class AdvancedSearch extends Component{

    constructor(props){

        super(props);

        this.state ={


            type:this.props.type,
            searchData:[],


        }

        this.openAdvancedSearch = this.openAdvancedSearch.bind(this);
        this.handleSearch = this.handleSearch.bind(this);

    }

    componentDidMount(){

        $(".advancedSearchButton").click(this.openAdvancedSearch);

    }

    componentDidUnMount(){

    }

    openAdvancedSearch(){

        $(".advancedSearch").stop().slideToggle();

    }

    handleSearch(event){

    }

    renderAdvancedSearch(searchType){


        switch(searchType) {

            case 'loan':

                return(
                    <>
                    <p>Loan Search Type</p>
                    </>
                );


            case 'customer':
                return(
                    <>
                    <p>Customer Search</p>
                    </>
                );

            case 'reports':
                return(
                    <>
                    <p>Reports Search</p>
                    </>
                )

            default:
                return(
                    <>
                    <div className="buttonContainer padding pt-0 pb-0">


                        <div className="row advancedSearchOptions ">
                            <div className="col-6 searchToggle">

                                <button className="advancedSearchButton btn-rounded">

                                    <span className="">
                                        <i className="i-con i-con-minus">
                                            <i></i>
                                        </i>
                                    </span>

                                    Advanced Search : Click Here to Show

                                </button>

                            </div>

                            <div className="col-6 secondaryActions">

                                <Link to="/dashboard/createloan" className="addCustomer btn-rounded">
                                    <span className="">
                                        <i className="i-con i-con-plus">
                                            <i></i>
                                        </i>
                                    </span>

                                    Add New Loan Product

                                </Link>

                                <button className="btn-rounded upload">

                                    <span className="">
                                        <i className="i-con i-con-upload">
                                            <i></i>
                                        </i>
                                    </span>

                                    Add New Loan
                                </button>

                            </div>

                        </div>




                    </div>

                    <div className="advancedSearch padding pb-0 pt-4">

                        <div className="col-lg-12 pb-2 pl-0 pr-0">
                            {/* Loan Filter */}
                            <form data-plugin="parsley" >



                                <div className="card">

                                    <div className="card-header">
                                        <label>All fields are optional. You can type or select as many fields as you would like</label>
                                    </div>

                                    <div className="card-body">


                                        <div className="row row-sm">

                                            <div className="col-6">
                                                <label>Customer Type</label>

                                                <select name="" id="" className="form-control"></select>

                                            </div>

                                            <div className="col-6">
                                                <label>Customer / Bussiness / Group Name</label>

                                                <select name="" id="" className="form-control"></select>

                                            </div>

                                            <div className="col-6">
                                                <label>Loan ID</label>
                                                <input type="text" id="custId" className="form-control" name="customerrep"  />

                                            </div>

                                        </div>
                                    </div>

                                    <div className="formButtons">

                                        <button className="btn-rounded" onClick={this.handleSearch}>
                                            Search
                                        </button>

                                        <button type="reset" className="btn-rounded reset">
                                            Reset
                                        </button>

                                    </div>


                                </div>
                            </form>
                            {/* EndLoan Filter */}
                        </div>
                    </div>

                    </>
                );
        }

    }

    render(){

        const {type}  = this.state;

        return(



            <>
                {/* Summary Chart  */}

                {this.renderAdvancedSearch(type)}

                {/* EndSummary Chart  */}
            </>

        )

    }

}
