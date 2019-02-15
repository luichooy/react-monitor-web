import React, { Component } from 'react';
import { Icon } from 'antd';
import './index.css';

class MagicBall extends Component {
  constructor(props) {
    super(props);
    this.state = {
      dirt: 'center'
    };
  }
  
  changeDirt = dirt => {
    this.setState({ dirt });
  };
  
  render() {
    const { dirt } = this.state;
    return (
      <div className={ `magic-ball rounded-circle toolbar direction-${dirt}` }>
        <div
          onClick={ this.props.onScrollTop }
          onMouseEnter={ this.changeDirt.bind(this, 'top') }
          onMouseLeave={ this.changeDirt.bind(this, 'center') }
          className="ball-top text-white"
        />
        <div
          onClick={ this.props.onScrollCenter }
          onMouseEnter={ this.changeDirt.bind(this, 'center') }
          className="ball-center bg-white rounded-circle text-center text-danger"
        >
          <Icon type={ dirt === 'center' ? 'coffee' : 'rocket' }/>
        </div>
        <div
          onClick={ this.props.onScrollBottom }
          onMouseEnter={ this.changeDirt.bind(this, 'bottom') }
          onMouseLeave={ this.changeDirt.bind(this, 'center') }
          className="ball-bottom"
        />
      </div>
    );
  }
}

export default MagicBall;
