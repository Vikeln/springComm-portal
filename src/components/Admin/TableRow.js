import React,{Component} from 'react';
import {
  Link
} from "react-router-dom";

import Badge from '../../components/notifications/Badge';

export default class TableRow extends Component{

    constructor(props){

        super(props);

        this.state ={

            name:this.props.name,
            transaction:this.props.transaction,
            amount:this.props.amount,
            badgeDescription:this.props.badgeDescription,
            badgeColor:this.props.badgeColor,
            timestamp:this.props.timestamp,
            userId:this.props.userId

        }

    }

    componentDidMount(){

    }

    componentDidUnMount(){

    }

    render(){

        const {name,transaction,amount,badgeDescription,badgeColor,timestamp}  = this.state;

        return(



            <>
                {/* Single Table Row */}
                <tr>
                    <td>{name}</td>
                    <td>{transaction}</td>
                    <td>{amount}</td>
                    <td>
                        <Badge description={badgeDescription} type={badgeColor}/>
                    </td>
                    <td>{timestamp}</td>
                    <td>

                        <div className="item-action dropdown">
                            <a href="#" data-toggle="dropdown" className="text-muted"><i className="i-con i-con-more"><i></i></i></a>

                            <div className="dropdown-menu dropdown-menu-right bg-dark" role="menu">

                                <Link className="dropdown-item" to='#'>
                                    View details
                                </Link>

                                <Link className="dropdown-item" to='#'>
                                    Report Issue
                                </Link>

                            </div>

                        </div>

                    </td>
                </tr>
                {/* End Single Table Row*/}
            </>

        )

    }

}
