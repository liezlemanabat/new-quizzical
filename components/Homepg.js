import React from "react"

function Homepg({children}) {    
    return (
        <section className="homepg">
        <img src="./assets/blob.svg" alt="" className="blob" />
        <img src= "./assets/blob1.svg" alt="" className="blob1" />
            { children }
        </section>
    )
}

export default Homepg