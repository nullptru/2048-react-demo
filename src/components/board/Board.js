/**
 * Created by Burgess on 2017/7/14.
 */
import React, { Component, PropTypes } from 'react';
import ReactDom from 'react-dom';
import Cell from '../../container/Cell'
import Tile from '../tile/Tile'
import Header from '../../container/Header/Header'
import '../../common/common.less';
import './board.less'

import BoardModel from '../board/BoardModel'
import GameOverLayout from '../../container/GameOverLayout/GameOverLayout'

export default class Board extends Component{
    constructor(props){
        super(props);
        this.handleKeyDown = this.handleKeyDown.bind(this);
        this.handleTouchStart = this.handleTouchStart.bind(this);
        this.handleTouchEnd = this.handleTouchEnd.bind(this);
        this.restartGame = this.restartGame.bind(this);

        this.stepCount = 0;
        this.state = {
            board: new BoardModel(),
        };
    }

    componentDidMount() {
        window.addEventListener('keydown', this.handleKeyDown.bind(this));
    }
    componentWillUnmount() {
        window.removeEventListener('keydown', this.handleKeyDown.bind(this));
    }

    restartGame() {
        this.stepCount = 0;
        this.setState({board: new BoardModel()});
    }

    render(){
        let cells = this.state.board.cells.map((line, lineIndex)=>{
            return (
                <div key={lineIndex}>
                    {
                        line.map((item, itemIndex)=>{
                            return <Cell key={lineIndex * 4 + itemIndex}/>;
                        })
                    }
                </div>
            );
        });
        let tiles = this.state.board.tiles
            .filter(tile => tile.value != 0)
            .map((tile)=>{
                return (
                    <Tile key={tile.id} tile={tile}/>
                )
            });

        return (
            <div>
                <div>
                    <Header onRestart={this.restartGame} stepCount={this.stepCount}/>
                </div>
                <div className="board" onTouchStart={this.handleTouchStart} onTouchEnd={this.handleTouchEnd}>
                    {cells}
                    {tiles}
                    <GameOverLayout onRestart={this.restartGame} board={this.state.board}/>
                </div>
            </div>
        );
    }

    handleKeyDown(){
        if (this.state.board.hasWon()) {
            return;
        }
        if (event.keyCode >= 37 && event.keyCode <= 40) {
            event.preventDefault();
            let direction = event.keyCode - 37;
            this.setState({board: this.state.board.move(direction)});
            this.stepCount++;
        }
    }

    handleTouchStart(event){
        /**
         * 当一个手指在触屏上时，event.touches.length=1,
         当两个手指在触屏上时，event.touches.length=2，以此类推。
         */
        if (this.state.board.hasWon() || event.touches.length != 1){
            return;
        }
        event.preventDefault();
        this.startX = event.touches[0].screenX;
        this.startY = event.touches[0].screenY;
    }

    handleTouchEnd(event){
        /**
         * 对于 touchstart 事件, changedTouches 对象列出在此次事件中新增加的触点。
         对于 touchmove 事件，列出和上一次事件相比较，发生了变化的触点。
         对于 touchend ，列出离开触摸平面的触点（这些触点对应已经不接触触摸平面的手指）
         */
        if (this.state.board.hasWon() || event.changedTouches.length != 1){
            return;
        }
        let deltaX = event.changedTouches[0].screenX - this.startX;
        let deltaY = event.changedTouches[0].screenY - this.startY;
        let direction = -1;
        if (Math.abs(deltaX) > 3 * Math.abs(deltaY) && Math.abs(deltaX) > 30) {
            direction = deltaX > 0 ? 2 : 0;
        } else if (Math.abs(deltaY) > 3 * Math.abs(deltaX) && Math.abs(deltaY) > 30) {
            direction = deltaY > 0 ? 3 : 1;
        }
        if (direction != -1) {
            this.setState({board: this.state.board.move(direction)});
            this.stepCount++;
        }
    }
}

ReactDom.render(<Board/>, document.getElementById('root'));