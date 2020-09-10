import React from 'react';

export default function Spinner () {
    return (
        <div className='text-center'>
            <div className="spinner-grow text-primary" role="status">
                <span className="sr-only">Loading...</span>
            </div>
        </div>
    );
}