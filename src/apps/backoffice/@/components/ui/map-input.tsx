import React, { forwardRef, useEffect } from 'react';
import { usePlacesWidget } from 'react-google-autocomplete';
import { Input } from './input';

export type MapInputProps = React.HTMLProps<HTMLInputElement>;

export const MapInput = forwardRef<HTMLInputElement, MapInputProps>((props, ref) => {
  const { ref: placesRef } = usePlacesWidget({
    apiKey: (window as any).ENV.GOOGLE_MAPS_API_KEY,
    onPlaceSelected: (place) => {
      if (props.onChange) {
        props.onChange(place?.formatted_address);
      }
    },
    options: {
      fields: ['ALL'],
      types: [],
    },
  });

  // FIXME(pgm): Workaround for the google autocomplete
  // this is needed to allow pointer events to go through, used to fix the google autocomplete input
  useEffect(() => {
    setTimeout(() => (document.body.style.pointerEvents = ''), 0);
  }, []);

  return (
    <Input
      ref={(node) => {
        (placesRef as React.MutableRefObject<HTMLInputElement | null>).current = node;
        if (typeof ref === 'function') {
          ref(node);
        } else if (ref) {
          (ref as React.MutableRefObject<HTMLInputElement | null>).current = node;
        }
      }}
      {...props}
    />
  );
});

MapInput.displayName = 'MapInput';
