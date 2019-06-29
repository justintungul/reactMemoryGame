import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';

import 'bootstrap/dist/css/bootstrap.min.css';

class Box extends React.Component {
    // onClick on box component
    handleClick = () => {
        // change only when in stage 3
        if (this.props.stage === 3) {

            // pass data to parent via handleAnswer prop
            this.props.handleAnswer({
                pos: this.props.pos,
                status: this.props.status
            });
        }
    }

    render() {
        return (
            // In final stage status is a string for the color
            // add class blue if status is 1
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
            time: 0,
            board: [],
            correct: []
        }
    }

    // method for click event in Start game button
    onStart = () => {
        this.setState({
            stage: 1,
            board: Array(3).fill(Array(4).fill(0)), // reset board
            correct: this.randomizeBoxes() // randomize correct board
        });
        this.countDown(1);
    }

    // randomize 2x2 matrix of arrays
    randomizeBoxes = () => {
        // create blank 3x4 matrix
        let randomBoxes = Array(3).fill(Array(4).fill(0));

        // fill in elements
        randomBoxes = randomBoxes.map((row) => {
            return row.map(box => {
                // randomize 1 or 0
                return Math.round(Math.random());
            })
        })
        return randomBoxes;
    }

    // count down timer
    countDown = (time) => {
        
        // replace time with parameter
        this.setState({ time: time})

        // interval function that runs every 1sec
        const interval = window.setInterval(() => {

            // decrease state.time every interval
            this.setState(state => {
                if (state.time > 0) {
                    state.time -= 1;
                }
                return state;
            });

            // if time runs out
            if (this.state.time === 0) {
                
                // stop interval calls
                clearInterval(interval);

                // if stage = 1 show board for set seconds
                if (this.state.stage === 1) {
                    this.setState({
                        stage: 2, // increase stage
                        board: this.state.correct // show board
                    });

                    // allows user to see correct board for 1sec
                    this.countDown(1);
                } 

                // if stage = 2 reset board for user to fill
                else if (this.state.stage === 2) {
                    this.setState({
                        stage: 3, // increase stage
                        board: Array(3).fill(Array(4).fill(0)) // reset board
                    });

                    // allows user 3sec to guess
                    this.countDown(3);
                }

                // if stage = 3 compare answers
                else if (this.state.stage === 3) {
                    this.setState({stage: 4});
                    this.compareAnswers();
                }
            }
        }, 1000) // 1 sec interval
    }

    // handle info from click event triggered by child "Box" component
    handleAnswer = (info) => {
        const newBoard = this.state.board.map((row, rowIdx) => {
            // build each row as arraw
            const newRow = row.map((box, boxIdx) => {
                // if current rowIdx and current boxIdx match pos sent from child
                if (rowIdx === info.pos[0] && boxIdx === info.pos[1]) {
                    // convert boolean to integer
                    return info.status ? 0 : 1;
                }
                // return box if not stated position
                return box;
            })
            return newRow;
        })
        this.setState({board: newBoard});
    }

    // compare current board to correct board
    compareAnswers = () => {
        const answers = this.state.board.map((row, rowIdx) => {
            // build each row as arraw
            const newRow = row.map((box, boxIdx) => {
                // correct and selected
                if (this.state.correct[rowIdx][boxIdx] === 1 && box === 1) {
                    return 'green';
                }
                // correct and unselected
                else if (this.state.correct[rowIdx][boxIdx] === 1 && box === 0) {
                    return 'yellow';
                }
                // correct and selected
                else if (box === 1) {
                    return 'red';
                }
                // not a correct answer and unselected
                else {
                    return 0;
                }
            });

            return newRow;
        });
        this.setState({board: answers});
    }

    render() {
        // map through board array
        const board = this.state.board.map((row, rowIdx) => {
            // map through each row
            const boxes = row.map((box, idx) => {
                // dynamically create Box components
                return <Box 
                            key={idx} 
                            pos={[rowIdx, idx]} 
                            stage={this.state.stage} 
                            status={box} 
                            handleAnswer={this.handleAnswer}
                        />;
            })
            return (
                // dinamically create each row divs
                <div key={rowIdx} className="row">
                    {boxes}
                </div>
            )
        });
        return (
            <div className="text-center container-fluid">

                {/* Header */}
                <h1 className="my-4">Kirk Guwapo's Memory Game</h1>
                
                {/* Main Board */}
                <div className="row">
                    <div className="col-6 offset-3">
                        {board}
                    </div>
                </div>

                {/* Display each element below depending on state.stage */}
                <div className="pt-3">
                    {/* Start game button */}
                    <button className={"btn btn-success px-5 " + (this.state.stage === 0 ? '' : 'd-none')}>
                        <h3 className="my-0"onClick={this.onStart}>Start Game</h3>
                    </button>

                    {/* Get ready timer */}
                    <h3 className={(this.state.stage === 1 ? '' : 'd-none')}>
                        Get ready to memorize in <span className="font-weight-bold">{this.state.time}</span>
                    </h3>

                    {/* User memorizes timer*/}
                    <h3 className={(this.state.stage === 2 ? '' : 'd-none')}>
                        Go! you have <span className="font-weight-bold">{this.state.time}</span> seconds remaining.
                    </h3>

                    {/* User guess the cells timer */}
                    <h3 className={(this.state.stage === 3 ? '' : 'd-none')}>
                        Guess the correct cells in <span className="font-weight-bold">{this.state.time}</span> seconds!
                    </h3>
                    
                    {/* Play again button */}
                    <button className={"btn btn-primary px-5 " + (this.state.stage === 4 ? '' : 'd-none')}>
                        <h3 className="my-0" onClick={this.onStart}>Play Again</h3>
                    </button>
                </div>
            </div>
        );
    }
}

ReactDOM.render(<App />, document.getElementById('root'));