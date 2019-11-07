import React from 'react';

import {Layout}  from 'antd'
import TopHeader from './TopHeader'
import BottomFooter from './BottomFooter'
const { Header, Footer, Sider, Content } = Layout;


 class MainLayout extends React.Component {


    render() {
        return (
            <div>
                <TopHeader />
                <Content >
                    {this.props.children}
                </Content>
                <BottomFooter />
            </div>
        );
    }
}

export default MainLayout
