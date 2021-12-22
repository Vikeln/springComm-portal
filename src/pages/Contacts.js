

import React, { Component } from 'react';

export default class Contacts extends Component {

    constructor(props) {


        super(props);

        this.state = {

        }

    }

    componentDidMount() {

    }

    componentDidUnMount() {

    }

    render() {

        return (

            <>

                <div id="content" className="flex ">
                    <h4 className="mt-2 text-center">TAARIFAFLY KENYA</h4>
                    <div className="col-12 adminSummary padding">

                        <div className="card">

                            <div className="card-body text-center">

                                <section className="contact" id="contact">

                                    <section className="">


                                        <article>

                                            <h2>Interested, contact us today!</h2>

                                        </article>

                                        <form className='form'>
                                            <div className="row text-center justify-content-center">


                                                <div className="col-8 form-group">

                                                    <label for="">Email</label>

                                                    <input name="email" className='form-control text-center'
                                                        type="email" value="tlydiawairimu@gmail.com" disabled
                                                        data-parsley-type="email"
                                                        data-parsley-required />

                                                </div>

                                                <div className="col-8 form-group">

                                                    <label for="">Telephone</label>
                                                    <input name="telephone" className='form-control text-center'
                                                        type="text"  value="254790573861" disabled
                                                        data-parsley-pattern="(?:254|\+254|0)?([27]{1}(?:(?:[0-9][0-9])|(?:0[0-8])|(4[0-1]))[0-9]{6})$"
                                                        data-parsley-required-message="Phone Number required"
                                                        data-parsley-required />

                                                </div>  
                                            </div>
                                        </form>

                                    </section>
                                </section>

                            </div>
                        </div>

                    </div>
                </div>

            </>

        )

    }

}
