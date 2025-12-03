import {ResizeObserver} from '@juggle/resize-observer'
import { useEffect, useRef, useState } from 'react'

// @ts-ignore
export const useChartDimensions = passedSettings => {
  const ref = useRef(null);
  const dimensions = combineChartDimensions(
    passedSettings
  );

  const [width, setWidth] = useState(0)
  const [height, setHeight] = useState(0)

  // @ts-ignore
  useEffect(() => {
      if (dimensions.width && dimensions.height)
        return [ref, dimensions];

      const element = ref.current;
      const resizeObserver = new ResizeObserver(
        entries => {
          if (!Array.isArray(entries)) return;
          if (!entries.length) return;

          const entry = entries[0];

          if (width != entry.contentRect.width)
            setWidth(entry.contentRect.width);
          if (height != entry.contentRect.height)
            setHeight(entry.contentRect.height);
        }
      )
      // @ts-ignore
      resizeObserver.observe(element);

      // @ts-ignore
      return () => resizeObserver.unobserve(element);
  }, [ref])

  const newSettings = combineChartDimensions({
      ...dimensions,
      width: dimensions.width || width,
      height: dimensions.height || height,
  })

  return [ref, newSettings];
}

// @ts-ignore
const combineChartDimensions = dimensions => {
     const parsedDimensions = {
      ...dimensions,
      marginTop: dimensions.marginTop || 10,
      marginRight: dimensions.marginRight || 10,
      marginBottom: dimensions.marginBottom || 40,
      marginLeft: dimensions.marginLeft || 75,
  }
  parsedDimensions.height =
    !dimensions.maxHeight || parsedDimensions.width * 0.5 < dimensions.maxHeight ? parsedDimensions.width * 0.5 : dimensions.maxHeight;
  return {
      ...parsedDimensions,
      containerHeight: Math.max(
        parsedDimensions.height
        - parsedDimensions.marginTop
        - parsedDimensions.marginBottom,
        0,
      ),
      containerWidth: Math.max(
        parsedDimensions.width
        - parsedDimensions.marginLeft
        - parsedDimensions.marginRight,
        0,
      )
  }
}