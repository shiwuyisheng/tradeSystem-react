import React from 'react'
import {Form} from "antd";
import { withRouter } from 'react-router-dom'
import BGParticle from '../../utils/BGParticle'
import LoginForm from './LoginForm'
import './style.css'

class Login extends React.Component {
  componentDidMount () {
    this.particle = new BGParticle('backgroundBox')
    this.particle.init()
  }
  componentWillUnmount(){
    this.particle.destory()
  }

 
  render () {
    return (
      <div className='login-page' id='login-page'>
        <div style={styles.backgroundBox} id='backgroundBox'/>
        <div className='container'>
          <LoginForm className={'login-box-active login-box'}/>
        </div>
      </div>
    )
  }
}

const styles = {
  backgroundBox:{
    position:'fixed',
    top:'0',
    left:'0',
    width:'100vw',
    height:'100vh',
    backgroundImage:`url(${require('./img/bg5.jpg')})`,
    backgroundSize:'100% 100%'
  },
  focus: {
    transform: 'scale(0.6)',
    width: 40
  },
  focusHandLeft: {
    transform: 'translateX(-42px) translateY(-15px) scale(0.7)',
  },
  focusHandRight: {
    transform: 'translateX(42px) translateY(-15px) scale(0.7)',
  },
  focusArmsLeft: {
    transform: 'translateY(-40px) translateX(-40px) scaleX(-1)'
  },
  focusArmsRight: {
    transform: 'translateY(-40px) translateX(40px)'
  }
}

export default withRouter(Form.create()(Login));
