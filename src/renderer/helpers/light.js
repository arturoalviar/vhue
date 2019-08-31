import { convertXYtoRGB } from 'node-hue-api/hue-api/rgb';
import ct from 'color-temperature';

const makeGradientStyle = rgb => `linear-gradient(90deg, rgb(${rgb[0]}, ${rgb[1]}, ${rgb[2]}), transparent)`;


const getRgbValue = (light, isRgb) => {
  if (isRgb) {
    const { xy, bri } = light.state;
    return convertXYtoRGB(xy[0], xy[1], bri);
  }
  const { ct: mired } = light.state;
  const colorTemp = Math.floor(1000000 / mired);
  const { red, green, blue } = ct.colorTemperature2rgbUsingTH(colorTemp);
  return [red, green, blue];
};

const determineBrightnessPercentage = (brightness) => {
  const decimal = brightness / 254;
  const sanatized = Math.min(Math.max(decimal, 0.01), 1);
  const percentage = Math.floor(sanatized * 100);
  return percentage;
};

export {
  determineBrightnessPercentage,
  makeGradientStyle,
  getRgbValue,
};
