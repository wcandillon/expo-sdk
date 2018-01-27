// @flow
import * as React from "react";
import { View, Animated } from "react-native";

type BlurViewProps = {
  intensity: number | Animated.Value,
  tint: "light" | "dark" | "default"
} & React.ElementProps<typeof View>;

export default class BlurView extends React.PureComponent<BlurViewProps> {

  static defaultProps = {
      intensity: 100
  };

  render(): React.Node {
    const { tint, intensity, ...props } = this.props;
    let opacity = 1;
    let backgroundColor;
    if (tint === "dark") {
      backgroundColor = `rgba(0, 0, 0, ${(100 / 0.5) * intensity})`;
    } else if (tint === "light") {
      backgroundColor = `rgba(255, 255, 255, ${(100 / 0.7) * intensity})`;
    } else {
      backgroundColor = `rgba(255,255,255, ${(100 / 0.4) * intensity})`;
    }

    return <Animated.View {...props} style={[this.props.style, { backgroundColor, opacity }]} />;
  }
}
