import React,{Component} from 'react';

export default class Notifications extends Component{

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

    renderChart(notificatoinType,description){


        switch(notificatoinType) {

            case 'success':

                return(
                    <div className="alert alert-success" role="alert">
                        {description}
                    </div>
                );

            case 'error':

                return(
                    <div className="alert alert-danger" role="alert">
                        {description}
                    </div>
                );

            case 'network':
                return(
                    <div className="alert alert bg-warning" role="alert">
                        {description}
                    </div>
                );


            case 'notification':
            default:
                return(
                    <div className="alert bg-dark" role="alert">
                        {description}
                    </div>
                );
        }

    }

    render(){

        const {type,description}  = this.state;

        return(



            <>
                {/* Notification  */}
                {this.renderChart(type,description)}
                {/* End Notification */}
            </>

        )

    }

}
