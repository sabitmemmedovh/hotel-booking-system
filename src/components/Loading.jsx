import React from 'react'

const Loading = ( {message =  "Loading..."}) => {
    return (
        <div className="w-full h-64 flex items-center justify-center">
            <div className="text-center">
                <div className="animate-spin h-8 w-8 border-4 border-slate-300 border-t-slate-700 rounded-full mx-auto mb-2" />
                <div className="text-slate-600">{message}</div>
            </div>
        </div>
    )
}

export default Loading
