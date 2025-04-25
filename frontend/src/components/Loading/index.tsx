import React from 'react';
import Image from 'next/image';

import spinner from './assets/spinner-1.gif';

export function Loading() {
    return (
        <div className="h-screen w-screen absolute inset-0 z-50 bg-white flex items-center justify-center">
            <Image src={spinner} alt="Spinner" />
            {/* <img src={spinner} alt="Spinner" /> */}
        </div>
    );
}

Loading.hasLayout = false;
