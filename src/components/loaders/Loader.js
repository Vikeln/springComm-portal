import React,{Component} from 'react';

import 'react-confirm-alert/src/react-confirm-alert.css';
import Loader from 'react-loader-spinner';

export default class Loaders extends Component{

    constructor(props){

        super(props);

        this.state ={

            type:this.props.type,

        }

    }

    componentDidMount(){

    }

    componentDidUnMount(){

    }

    renderLoader(loaderType){


        switch(loaderType) {

            case 'circle':

                return(
                    <div className="loader mr-auto">
                        <Loader
                             type="Oval"
                             color="#846FA9"
                             height={65}
                             width={65}
                         />

                    </div>
                );

            case 'dots':

                    return(
                        <div className="loader">
                            <h5>Loading</h5>
                            <Loader
                                 type="ThreeDots"
                                 color="#ff931e"
                                 height={40}
                                 width={40}
                             />

                        </div>
                    );

            case 'pulse':

                return(
                    <div className="loader">
                        <Loader
                             type="Rings"
                             color="#ff931e"
                             height={65}
                             width={65}
                         />
                    </div>
                );

            case 'progress':

                return(
                    <div className="loader">
                        <Loader
                             type="Puff"
                             color="#ff931e"
                             height={65}
                             width={65}
                         />
                    </div>
                );

            case 'overlaycircle':
                return(
                    <div className="loader overlay">
                        <Loader
                             type="Oval"
                             color="#ff931e"
                             height={65}
                             width={65}
                         />
                    </div>
                );

            case 'overlayprogress':
                return(
                    <div className="loader overlay">
                        <Loader
                             type="Puff"
                             color="#ff931e"
                             height={75}
                             width={75}
                         />
                    </div>
                );

            default:
                return(
                    <div className="loader">
                        
                        <Loader
                             type="Puff"
                             color="#ff931e"
                             height={65}
                             width={65}
                         />
                    </div>
                );
        }

    }

    render(){

        const {type}  = this.state;

        return(



            <>
                {/* Notification  */}
                {this.renderLoader(type)}
                {/* End Notification */}
            </>

        )

    }

}
