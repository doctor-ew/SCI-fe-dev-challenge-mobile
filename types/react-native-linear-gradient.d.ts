declare module 'react-native-linear-gradient' {
    import { ComponentType } from 'react';
    import { ViewProps } from 'react-native';
  
    interface LinearGradientProps extends ViewProps {
      colors: string[];
      start?: { x: number; y: number };
      end?: { x: number; y: number };
      locations?: number[];
    }
  
    const LinearGradient: ComponentType<LinearGradientProps>;
    export default LinearGradient;
  }
  