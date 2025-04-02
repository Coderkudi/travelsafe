// import dynamic from 'next/dynamic';

// const DynamicMap = dynamic(() => import('./DynamicMap'), {
//   ssr: false
// });

// // Set default sizing to control aspect ratio which will scale responsively
// // but also help avoid layout shift

// const DEFAULT_WIDTH = 600;
// const DEFAULT_HEIGHT = 600;

// const Map = (props) => {
//   const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
//   return (
//     <div style={{ aspectRatio: width / height }}>
//       <DynamicMap {...props} />
//     </div>
//   )
// }

// export default Map;

import dynamic from "next/dynamic";

// Use dynamic import with explicit loading state
const DynamicMap = dynamic(() => import("./DynamicMap"), {
    ssr: false,
    loading: () => (
        <div className="flex items-center justify-center h-full w-full">
            <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent"></div>
        </div>
    ),
});

// Set default sizing to control aspect ratio which will scale responsively
// but also help avoid layout shift
const DEFAULT_WIDTH = 600;
const DEFAULT_HEIGHT = 600;

interface MapProps {
    width?: number;
    height?: number;
    className?: string;
    center: [number, number];
    zoom: number;
    children: any;
}

const Map = (props: MapProps) => {
    const { width = DEFAULT_WIDTH, height = DEFAULT_HEIGHT } = props;
    return (
        <div style={{ aspectRatio: width / height }}>
            <DynamicMap {...props} />
        </div>
    );
};

export default Map;
