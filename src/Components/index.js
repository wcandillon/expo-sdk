'use strict';

export AppLoading from './AppLoading';
export BlurView from './BlurView';
export LinearGradient from './LinearGradient';
export Video from './Video';

import * as SvgModules from 'react-native-svg';
let { Svg } = SvgModules;
for (let key in SvgModules) {
  if (key !== 'default' && key !== 'Svg') {
    Svg[key] = SvgModules[key];
  }
}
export { Svg };
