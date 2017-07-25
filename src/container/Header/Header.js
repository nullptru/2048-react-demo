/**
 * Created by Burgess on 2017/7/24.
 */
import React from 'react';
import StepRecord from '../StepRecord/StepRecord'
import './header.less'

export default (props)=> {
    let {onRestart, stepCount} = props;
    return <div className="row">
        <div className="header">
            <div className="header__left">
                <span className='title'>2048 Demo</span>
                <span className="hint">重温当年的小游戏</span>
            </div>
            <div className="header__right">
                <StepRecord stepCount={stepCount}/>
                <button className="tryAgain small" onClick={onRestart} onTouchEnd={onRestart}>重新开始</button>
            </div>
        </div>
    </div>
}