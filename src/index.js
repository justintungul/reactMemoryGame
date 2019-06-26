import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

class Box extends React.Component {
    handleClick = () => {
        if (this.props.stage === 3) {
            console.log(this.props.status);
            this.props.handleAnswer({
                pos: this.props.pos,
                status: this.props.status
            });
        }
    }
    render() {
        return (
            <div 
                className={"col-3 box " + this.props.status + " " + (this.props.status === 1 ? 'blue' : '')} 
                onClick={this.handleClick}
            ></div>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            stage: 0,
            time: 3,
            board: [],
            correct: []
            // correct: [
            //     [1,0,0,1],
            //     [0,1,0,0],
            //     [0,0,1,0]
            // ]
        }
    }
    // onStart = () => {

    //     this.setState({
    //         stage: 1,
    //         board: Array(3).fill(Array(4).fill(0)),
    //         correct: this.randomizeBoxes()
    //     });
    //     this.countDown(1);
    // }
    // randomizeBoxes = () => {
    //     let randomBoxes = Array(3).fill(Array(4).fill(0));
    //     randomBoxes = randomBoxes.map((row) => {
    //         return row.map(box => {
    //             return Math.round(Math.random());
    //         })
    //     })
    //     return randomBoxes;
    // }
    // countDown = (time) => {
    //     this.setState({ time: time})
    //     const interval = window.setInterval(() => {
    //         this.setState(state => {
    //             if (state.time > 0) {
    //                 state.time -= 1;
    //             }
    //             return state;
    //         });

    //         if (this.state.time === 0) {
    //             clearInterval(interval);

    //             if (this.state.stage === 1) {
    //                 this.setState({
    //                     stage: 2,
    //                     board: this.state.correct
    //                 });
    //                 this.countDown(1);
    //             } 
    //             else if (this.state.stage === 2) {
    //                 this.setState({
    //                     stage: 3,
    //                     board: Array(3).fill(Array(4).fill(0))
    //                 });
    //                 this.countDown(3);
    //             }
    //             else if (this.state.stage === 3) {
    //                 this.setState({stage: 4});
    //                 this.getAnswers();
    //             }
    //         }
    //     }, 1000)
    // }
    handleAnswer = (info) => {
        const newBoard = this.state.board.map((row, rowIdx) => {
            const newRow = row.map((box, boxIdx) => {
                if (rowIdx === info.pos[0] && boxIdx === info.pos[1]) {
                    return info.status ? 0 : 1;
                } else {
                    return box;
                }
            })
            return newRow;
        })
        this.setState({board: newBoard});
    }
    // getAnswers = () => {
    //     const answers = this.state.board.map((row, rowIdx) => {
    //         const newRow = row.map((box, boxIdx) => {
    //             if (this.state.correct[rowIdx][boxIdx] === 1 && box === 1) {
    //                 return 'green';
    //             }
    //             else if (this.state.correct[rowIdx][boxIdx] === 1 && box === 0) {
    //                 return 'yellow';
    //             }
    //             else if (box === 1) {
    //                 return 'red';
    //             }
    //             else {
    //                 return 0;
    //             }
    //         });
    //         return newRow;
    //     });
    //     this.setState({board: answers});
    // }
    render() {
        const board = this.state.board.map((row, rowIdx) => {
            const boxes = row.map((box, idx) => {
                return <Box 
                            key={idx} 
                            pos={[rowIdx, idx]} 
                            stage={this.state.stage} 
                            status={box} 
                            handleAnswer={this.handleAnswer}
                        />;
            })
            return (
                <div key={rowIdx} className="row">
                    {boxes}
                </div>
            )
        });
        return (
            <div className="text-center">
                <h1 className="display-3 my-4">Memory Game</h1>
                <div className="row">
                    <div className="col-6 offset-3">
                        {board}
                    </div>
                </div>
                <button className={"btn btn-success mt-4 px-5 " + (this.state.stage === 0 ? '' : 'd-none')}>
                    <h1 className="display-4" onClick={this.onStart}>Start Game</h1>
                </button>

                <h3 className={"my-5 " + (this.state.stage === 1 ? '' : 'd-none')}>
                    Get ready to memorize in <span className="font-weight-bold">{this.state.time}</span>
                </h3>

                <h3 className={"my-5 " + (this.state.stage === 2 ? '' : 'd-none')}>
                    Go! you have <span className="font-weight-bold">{this.state.time}</span> seconds remaining.
                </h3>

                <h3 className={"my-5 " + (this.state.stage === 3 ? '' : 'd-none')}>
                    Guess the correct cells in <span className="font-weight-bold">{this.state.time}</span> seconds!
                </h3>
                
                <button className={"btn btn-primary mt-4 px-5 " + (this.state.stage === 4 ? '' : 'd-none')}>
                    <h1 className="display-4" onClick={this.onStart}>Play Again</h1>
                </button>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));