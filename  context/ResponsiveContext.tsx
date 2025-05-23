import React, { createContext, useContext, useEffect, useState } from 'react';
import { Dimensions, PixelRatio, ScaledSize } from 'react-native';

interface ResponsiveContextType {
  screenWidth: number;
  screenHeight: number;
  isSmallDevice: boolean;
  isMediumDevice: boolean;
  isLargeDevice: boolean;
  scale: number;
  fontScale: number;
  hp: (percentage: number) => number; // height percentage
  wp: (percentage: number) => number; // width percentage
  sp: (size: number) => number; // scaled size for fonts
  vs: (size: number) => number; // vertical scaled size
  ms: (size: number, factor?: number) => number; // moderate scaled size
}

const initialDimensions = Dimensions.get('window');

const ResponsiveContext = createContext<ResponsiveContextType>({
  screenWidth: initialDimensions.width,
  screenHeight: initialDimensions.height,
  isSmallDevice: initialDimensions.height < 700,
  isMediumDevice: initialDimensions.height >= 700 && initialDimensions.height < 800,
  isLargeDevice: initialDimensions.height >= 800,
  scale: PixelRatio.get(),
  fontScale: PixelRatio.getFontScale(),
  hp: (percentage) => 0,
  wp: (percentage) => 0,
  sp: (size) => 0,
  vs: (size) => 0,
  ms: (size, factor) => 0
});

export const useResponsive = () => useContext(ResponsiveContext);

export const ResponsiveProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
  const [dimensions, setDimensions] = useState<ScaledSize>(initialDimensions);

  useEffect(() => {
    const subscription = Dimensions.addEventListener('change', ({ window }) => {
      setDimensions(window);
    });

    return () => subscription.remove();
  }, []);

  // Width percentage
  const wp = (percentage: number) => {
    return dimensions.width * (percentage / 100);
  };

  // Height percentage
  const hp = (percentage: number) => {
    return dimensions.height * (percentage / 100);
  };

  // Scale font size
  const sp = (size: number) => {
    return size * dimensions.fontScale;
  };

  // Vertical scale
  const vs = (size: number) => {
    const standardScreenHeight = 812; // iPhone X height
    const verticalScale = dimensions.height / standardScreenHeight;
    return size * verticalScale;
  };

  // Moderate scale for fonts that look too big/small on certain devices
  const ms = (size: number, factor: number = 0.5) => {
    const standardScreenHeight = 812; // iPhone X height
    const verticalScale = dimensions.height / standardScreenHeight;
    return size + (size * (verticalScale - 1) * factor);
  };

  const value = {
    screenWidth: dimensions.width,
    screenHeight: dimensions.height,
    isSmallDevice: dimensions.height < 700,
    isMediumDevice: dimensions.height >= 700 && dimensions.height < 800,
    isLargeDevice: dimensions.height >= 800,
    scale: PixelRatio.get(),
    fontScale: dimensions.fontScale,
    hp,
    wp,
    sp,
    vs,
    ms
  };

  return (
    <ResponsiveContext.Provider value={value}>
      {children}
    </ResponsiveContext.Provider>
  );
};
