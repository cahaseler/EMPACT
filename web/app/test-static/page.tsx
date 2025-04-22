"use client"

import { useEffect } from "react"
import Image from "next/image"
import styles from "./test-styles.module.css"

export default function TestStaticAssets() {
  useEffect(() => {
    // Log successful component mount
    console.log("Test static assets page mounted")
    
    // Test loading a JavaScript file
    const script = document.createElement("script")
    script.src = "/test-script.js"
    script.onload = () => console.log("JavaScript file loaded successfully")
    script.onerror = (e) => console.error("Failed to load JavaScript file", e)
    document.body.appendChild(script)
    
    // Test loading a CSS file
    const link = document.createElement("link")
    link.rel = "stylesheet"
    link.href = "/test-styles.css"
    link.onload = () => console.log("CSS file loaded successfully")
    link.onerror = (e) => console.error("Failed to load CSS file", e)
    document.head.appendChild(link)
    
    // Test fetching an image
    fetch("/empact-logo.png")
      .then(res => {
        console.log("Image fetch status:", res.status)
        return res.blob()
      })
      .then(() => console.log("Image fetched successfully"))
      .catch(err => console.error("Failed to fetch image", err))
      
    // Test API route
    fetch("/api/debug-middleware")
      .then(res => res.json())
      .then(data => console.log("API response:", data))
      .catch(err => console.error("API request failed", err))
  }, [])
  
  return (
    <div className="test-page">
      <h1>Static Asset Testing Page</h1>
      
      <div>
        <h2>Image Loading Test</h2>
        <p>Next.js Image Component:</p>
        <Image 
          src="/empact-logo.png" 
          alt="Logo" 
          width={200} 
          height={100} 
          onLoad={() => console.log("Next Image loaded successfully")}
          onError={() => console.error("Next Image failed to load")}
        />
        
        <p>Regular img tag:</p>
        <img 
          src="/empact-logo.png" 
          alt="Logo" 
          width={200}
          onLoad={() => console.log("Regular img loaded successfully")}
          onError={() => console.error("Regular img failed to load")}
        />
      </div>
      
      <div>
        <h2>CSS Test</h2>
        <p className="test-css-class">This text should be styled if CSS loads properly</p>
      </div>
      
      <div>
        <h2>Static File Loading Status</h2>
        <p>Check the browser console for detailed loading status</p>
        <button onClick={() => window.location.reload()}>Reload Page</button>
      </div>
    </div>
  )
}