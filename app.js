import React from "react";
import ReactDOM from "react-dom";

import UserTable from './components/UserTable';
import Form from './components/Form';

class Main extends React.Component {
    constructor(props) {
        super(props);

        this.web3 = new Web3(new Web3.providers.HttpProvider("http://localhost:8545"));

        this.state = {
            accounts: [],
        }

        this.retrieveAccounts = this.retrieveAccounts.bind(this);
    }

    componentWillMount() {
        this.retrieveAccounts();
    }

    retrieveAccounts() {
        const self = this;
        const accounts = this.web3.eth.accounts.map((account) => {
            return {
                accountAddress: account,
                accountBalance: self.web3.eth.getBalance(account).toString(),
            }
        });

        this.setState({ accounts });
    }

    render() {
        return (
            <div className="main">
                <div className='row'>
                    <UserTable accounts={this.state.accounts}/>
                </div>
                <div className="divider"></div>
                <div className='row'>
                    <Form onSubmit={this.retrieveAccounts}/>
                </div>
            </div>
        );
    }
}

var mountNode = document.getElementById("app");
ReactDOM.render( < Main /> , mountNode);
