import React,{Component} from 'react';


export default class Badge extends Component{

    constructor(props){

        super(props);

        this.state ={

            type:this.props.type,
            description:this.props.description,

        }

    }

    componentDidMount(){

    }

    componentDidUnMount(){

    }

    renderBadge(notificationType,description){


        switch(notificationType) {

            case 'blue':
                return(
                    <span className="badge badge-primary text-uppercase">{description}</span>
                );

            case 'yellow':
            case 'CURRENT':
            case 'false':
            case 'DEBIT':
            case 'EXISTING_LOAN':


                return(
                    <span className="badge badge-warning">{description}</span>
                );

            case 'green':
            case 'PAID':
            case 'CLOSED':
            case 'CREDIT':
            case 'true':
            case 'PROCESSED':
            case 'active':
                return(
                    <div className="badge badge-success" role="alert">
                        {description}
                    </div>
                );

            case 'black':

            case 'AMOUNT_DECLINED':
            case 'inactive':
                return(
                    <div className="badge bg-dark-lt p-1" role="alert">
                        {description}
                    </div>
                );

            default:
                return(
                    <span className="badge badge-primary">{description}</span>
                );
        }

    }

    render(){

        const {type,description}  = this.state;

        return(



            <>
                {/* Notification  */}
                {this.renderBadge(type,description)}
                {/* End Notification */}
            </>

        )

    }

}
