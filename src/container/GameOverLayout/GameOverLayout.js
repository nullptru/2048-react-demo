/**
 * Created by Burgess on 2017/7/24.
 */
import React from 'react';
import './gameover.less'

export default (props) => {
    let {board, onRestart} = props;
    let contents = '';
    if (board.hasWon()) {
        contents = 'Good Job!';
    } else if (board.hasLost()) {
        contents = 'Game Over';
    }
    if (!contents) {
        return null;
    }
    return (
        <div className='overlay'>
            <p className='message'>{contents}</p>
            <button className="tryAgain" onClick={onRestart} onTouchEnd={onRestart}>重新开始</button>
        </div>
    );
};