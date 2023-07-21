import { IonIcon } from '@ionic/react';
import { help as defaultIcon } from 'ionicons/icons'

import React from 'react';

type NamedIconProps = {
  name: string
  style?: { [key: string]: string | undefined }
  color?: string
}

export class NamedIcon extends React.Component<NamedIconProps> {
  state = {
    icon: undefined
  };

  componentDidMount() {
    this.doRefresh();
  }

  componentDidUpdate(prevProps: NamedIconProps) {
    if (this.props.name !== prevProps.name) {
      this.doRefresh();
    }
  }

  doRefresh() {
    let icon = undefined;
    if (this.props.name !== undefined) {
      icon = require(`ionicons/icons/imports/${this.props.name}.js`);
    } else {
      icon = defaultIcon;
    }
    this.setState({
      icon: icon
    });

  }


  render() {
    return (
      <IonIcon icon={this.state.icon} style={this.props.style} color={this.props.color} />
    );
  }
}

export default NamedIcon;
