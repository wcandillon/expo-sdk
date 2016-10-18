// @flow

import React from 'react';
import { AppRegistry } from 'react-native';

import Notifications from './Notifications';

function wrapWithExponentRoot(AppRootComponent: ReactClass<{}>) {
  class ExponentRootComponent extends React.Component {
    componentWillMount() {
      let { exp } = this.props;

      if (exp.notification) {
        Notifications._setInitialNotification(exp.notification);
      }
    }

    render() {
      return <AppRootComponent {...this.props} />;
    }
  }

  return ExponentRootComponent;
}

export default function registerRootComponent(component: ReactClass<{}>) {
  AppRegistry.registerComponent('main', () => wrapWithExponentRoot(component));
}
