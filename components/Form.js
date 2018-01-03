import React from "react";
import Web3 from 'web3';
import { ToastContainer, toast } from 'react-toastify';

export default class Form extends React.Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

        this.state = {
            from: {
                value: '',
                error: false,
            },
            to: {
                value: '',
                error: false,
            },
            amount: {
                value: '',
                error: false,
            },
            transactionHash: false,
        }

        this.handleChange = this.handleChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.clearForm = this.clearForm.bind(this);
        this.notify = this.notify.bind(this);
    }

    handleChange(event) {
        this.setState({
            [event.target.name]: {
                value: event.target.value,
                error: false,
            },
        })
    }

    notify(message) {
        toast.error(message, {
            position: toast.POSITION.BOTTOM_RIGHT
        });
    }

    clearForm() {
        this.setState({
            from: {
                value: '',
                error: false,
            },
            to: {
                value: '',
                error: false,
            },
            amount: {
                value: '',
                error: false,
            }
        });
    }

    handleSubmit(event) {
        const { from, to, amount } = this.state;
        const transaction = { from: from.value, to: to.value, value: amount.value };

        try {
            console.log(`Sending transaction... ${JSON.stringify(transaction)}`);
            const self = this;
            this.web3.eth.sendTransaction(transaction, function (error, transactionHash) {
                console.log(`Transaction: ${transactionHash}`);
    
                if (error) {
                    this.notify(error);
                    this.clearForm();
                    return false;
                }
    
                self.web3.eth.getTransaction(transactionHash, function (error, transactionInfo) {
                    if (error) {
                        self.notify(error);
                        self.clearForm();
                        return false;
                    } else {
                        self.setState({ transactionHash: transactionInfo });
                        self.props.onSubmit();
                        return true;
                    }
                });
            });
        } catch(e) {
            this.notify(e.message);
            this.clearForm();
        }
    }

    render() {
        const { from, to, amount, transactionHash } = this.state;
        return (
            <div className="formContainer container">
                <div className="columns">
                    <div className="form column col-6">
                        <div className="form-group">
                            <label className="form-label" htmlFor="senderAddress">From (Address):</label>
                            <input className="form-input" name="from" type="text" placeholder="From (Address):" value={from.value} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="recepientAddress">To (Address):</label>
                            <input className="form-input" name="to" type="text" placeholder="To (Address):" value={to.value} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <label className="form-label" htmlFor="amount">Amount:</label>
                            <input className="form-input" name="amount" type="text" placeholder="Amount" value={amount.value} onChange={this.handleChange}/>
                        </div>
                        <div className="form-group">
                            <button className="btn btn-primary input-group-btn" onClick={this.handleSubmit}>Submit</button>
                        </div>
                    </div>
                    {transactionHash ? (
                        <div className="transactionInfo column col-6">
                            <p><b>Hash:</b> <span id="hash">{transactionHash.hash}</span></p>
                            <p><b>Nonce:</b> <span id="nonce">{transactionHash.nonce}</span></p>
                            <p><b>Gas usage:</b> <span id="gas-usage">{transactionHash.blockHash}</span></p>
                            <p><b>Block Number:</b> <span id="block-number">{transactionHash.blockNumber}</span></p>
                            <p><b>Block Hash:</b> <span id="block-hash">{transactionHash.gas}</span></p>
                            <p><b>Tx Index:</b> <span id="transaction-index">{transactionHash.transactionIndex}</span></p>
                            <p><b>From:</b> <span id="from">{transactionHash.from}</span></p>
                            <p><b>To:</b> <span id="to">{transactionHash.to}</span></p>
                            <p><b>Value:</b> <span id="value">{transactionHash.value.toString()}</span></p>
                        </div>
                    ) : '' }
                </div>
                <ToastContainer autoClose={3000} hideProgressBar/>
            </div>
        );
    }
}