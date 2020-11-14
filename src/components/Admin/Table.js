import React from 'react';

export default class Table extends React.Component {
    
    constructor(props){
      super(props);
      this.getHeader = this.getHeader.bind(this);
      this.getRowsData = this.getRowsData.bind(this);
      this.getKeys = this.getKeys.bind(this);
    }
    
    getKeys = function(){
        var keys = this.props.headers;
        let res =[];
        for(var i =0; i < keys.length; i++){
            res.push(keys[i].value)
        }
        return res;
    }
    
    getHeader = function(){
      var headers = this.props.headers;
      return headers.map((key, index)=>{
        return <th key={key.name}>{key.name.toUpperCase()}</th>
      })
    }
        
    getRowsData = function(){
      var data = Array.from(this.props.data)
      var keys = this.getKeys();
      return data.map((row, index)=>{
        return <tr key={index}><RenderRow key={index} data={row} keys={keys}/></tr>
      })
    }
    
    render() {
        return (
          <div>
            <table className="table table-theme v-middle table-row" data-plugin="bootstrapTable">
            <thead>
              <tr>{this.getHeader()}</tr>
            </thead>
            <tbody>
              {this.getRowsData()}
            </tbody>
            </table>
          </div>
          
        );
    }
}

const RenderRow = (props) =>{
  return props.keys.map((key, index)=>{
    return <td key={props.data.key}>{props.data.key}</td>
  })
}   