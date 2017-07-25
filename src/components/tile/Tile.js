/**
 * Created by Burgess on 2017/7/14.
 */
import React, {Component} from 'react'
import './tile.less'

export default class Tile extends Component{
    constructor(props){
        super(props);
    }

    shouldComponentUpdate(nextProps){
        return !(!nextProps.tile.hasMoved() && !nextProps.tile.isNew());
    }

    render(){
        let {tile} = this.props;
        let classArray = ['tile'];
        classArray.push(`tile${tile.value}`);
        if (tile.mergedInto){
            classArray.push('merged')
        }else {
            classArray.push(`position_${tile.row}_${tile.col}`)
        }
        if (tile.isNew()){
            classArray.push('new')
        }
        if (tile.hasMoved()){
            classArray.push(`row_from_${tile.fromRow()}_to_${tile.toRow()}`);
            classArray.push(`col_from_${tile.fromCol()}_to_${tile.toCol()}`);
            classArray.push('isMoving');
        }
        classArray = classArray.join(' ');
        return <span className={classArray }>{tile.value}</span>
    }
}