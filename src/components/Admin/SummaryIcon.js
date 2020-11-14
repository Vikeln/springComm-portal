import React,{Component} from 'react';

import { FontAwesomeIcon } from '@fortawesome/react-fontawesome'
import { faMoney,faUserCircle,faHandHoldingUsd,faMoneyBillWave,faCalculator,faChartLine,faTasks,faFolderOpen,faUser } from '@fortawesome/free-solid-svg-icons';

export default class SummaryIcon extends Component{

    constructor(props){

        super(props);

        this.state ={ 

            amount:this.props.amount,
            title:this.props.title,
            icon:this.props.icon,

        }

    }

    componentDidMount(){

    }

    componentDidUnMount(){

    }

    render(){

        const {amount,title,icon}  = this.state;

        return(



            <>
                {/* Summary Icon */}
                <div className="card summaryIcon">

                    <h2>{amount}</h2>
                    <h6>{title}</h6>

                    <figure className="iconContainer">
                        <FontAwesomeIcon icon={icon} size="2x" className="icon"/>
                    </figure>

                </div>
                {/* End Summary Icon*/}
            </>

        )

    }

}
