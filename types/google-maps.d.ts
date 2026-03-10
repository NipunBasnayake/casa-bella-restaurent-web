// Google Maps JavaScript API Type Declarations

declare global {
  interface Window {
    google: typeof google;
    initMap?: () => void;
  }

  namespace google {
    namespace maps {
      class Map {
        constructor(mapDiv: HTMLElement, opts?: MapOptions);
      }

      class Marker {
        constructor(opts?: MarkerOptions);
      }

      interface MapOptions {
        center?: LatLngLiteral;
        zoom?: number;
        styles?: any[];
      }

      interface MarkerOptions {
        position?: LatLngLiteral;
        map?: Map;
        title?: string;
        animation?: Animation;
      }

      interface LatLngLiteral {
        lat: number;
        lng: number;
      }

      enum Animation {
        BOUNCE = 1,
        DROP = 2,
      }
    }
  }
}

export {};
