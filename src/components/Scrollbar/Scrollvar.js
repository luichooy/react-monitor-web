import React, { Component } from 'react';
import { Scrollbars } from 'react-custom-scrollbars';
import { omit } from '../../utils/tool';

class Scrollbar extends Component {
  
  /*
  * @props
  *
  * @getScrollRef：  父容器用来获取 Scrollbars组件实例的 ref 回调，参数为Scrollbars组件实例
  *
  * @viewStyle: 定义滚动容器的样式
  *
  * @viewClass: 滚动容器的class
  *
  * @trackStyle:  水平和垂直滚动条轨迹的样式
  *
  * @trackClass：  水平和垂直滚动条轨迹的class
  *
  * @thumbStyle：  水平和垂直滚动条的样式
  *
  * @thumbClass：  水平和垂直滚动条的轨迹
  * */
  
  constructor(props, ...rest) {
    super(props, ...rest);
    
    this.state = {
      hover: false
    };
    
    this.renderView = this.renderView.bind(this);
    this.renderThumb = this.renderThumb.bind(this);
    this.renderTrack = this.renderTrack.bind(this);
    this.handleMouseEnter = this.handleMouseEnter.bind(this);
    this.handleMouseLeave = this.handleMouseLeave.bind(this);
  }
  
  handleMouseEnter() {
    this.setState({ hover: true });
  }
  
  handleMouseLeave() {
    this.setState({ hover: false });
  }
  
  renderView({ style, ...props }) {
    const { viewStyle, viewClass } = this.props;
    return (
      <div
        className={ viewClass }
        style={ { ...style, ...viewStyle } }
        { ...props }
      />
    );
  }
  
  renderThumb({ style, ...props }) {
    const { thumbStyle, thumbClass } = this.props;
    const { hover } = this.state;
    return (
      <div
        className={ thumbClass }
        style={ { ...style, opacity: hover ? 1 : 0, ...thumbStyle } }
        { ...props }
      />
    );
  }
  
  renderTrack({ style, ...props }) {
    const { trackStyle, trackClass } = this.props;
    const { hover } = this.state;
    const defaultTrackStyle = {
      top: 2,
      bottom: 2,
      right: 2,
      borderRadius: 3
    };
    return (
      <div
        className={ trackClass }
        style={ { ...style, opacity: hover ? 1 : 0, ...defaultTrackStyle, ...trackStyle } }
        { ...props }
      />
    );
  }
  
  render() {
    const keys = [
      'getScrollRef',
      'viewStyle',
      'viewClass',
      'trackStyle',
      'trackClass',
      'thumbStyle',
      'thumbClass'
    ];
    
    return (
      <Scrollbars
        ref={ this.props.getScrollRef }
        renderView={ this.renderView }
        renderTrackHorizontal={ this.renderTrack }
        renderTrackVertical={ this.renderTrack }
        renderThumbHorizontal={ this.renderThumb }
        renderThumbVertical={ this.renderThumb }
        onMouseEnter={ this.handleMouseEnter }
        onMouseLeave={ this.handleMouseLeave }
        { ...omit(this.props, keys) }
      />
    );
  }
}

export default Scrollbar;
