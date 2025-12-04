import { Image, ImageStyle, StyleProp } from "react-native";
import { LogoAsset } from "@assets/images/logo.png";

type Props = {
  style?: StyleProp<ImageStyle>;
};

const Logo = ({ style }: Props) => {
  return <Image style={style} src={LogoAsset}/>;
};

export default Logo;
