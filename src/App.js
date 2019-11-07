import React from 'react';
import ReactDOM from 'react-dom';
//import { Router, Route ,IndexRoute} from 'react-router'
import {BrowserRouter, Route, Switch} from 'react-router-dom';

import Process from './pages/Proecss'
import Index from './pages/Index'
import MainLayout from './components/MainLayout'
import LoginPage from './pages/Login'
import Finished from './pages/Finished'
import Timeout from './pages/Timeout'

//引入样式相关
import  './assets/css/base.css'
import  './assets/css/main.scss'
import { Provider } from "mobx-react";
import rootStore from './mobx/index'


class App extends React.Component {
    render(){
        return (
            <Provider {...rootStore}>
                <BrowserRouter>
                    <Switch>
                        <Route exact path="/" component={LoginPage}/>
                        <Route  path="/" render={() =>
                            <MainLayout>
                                <Route exact path="/index" component={Index}/>
                                <Route exact path="/process" component={Process}/>
                                <Route exact path="/finished" component={Finished}/>
                                <Route exact path="/timeout" component={Timeout}/>
                            </MainLayout>
                        }/>
                    </Switch>
                </BrowserRouter>
            </Provider>
        )
    }
}

/*function App() {
  return (
    <div className="App">
        <Provider {...store}>
            <Header />
            <BrowserRouter>
                <Switch>
                    <Route path="/login" component={Login}/>
                    <Route path="/" component={
                        <Mainlayout>
                            <Route path="/" component={Home} />
                            <Route path="/future" component={Future}/>
                            <Route path="/history" component={History}/>
                        </Mainlayout>
                    }>

                    </Route>

                </Switch>
            </BrowserRouter>
            <Footer />
        </Provider>
    </div>
  );
}*/

export default App;
