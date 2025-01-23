import * as Checker from './colour-checker.js'

document.getElementById('scheme-button').addEventListener("click", checker)

function checker() {
    const colour = document.getElementById("seed-colour").value.substring(1) // Get hex value from input
    const mode = document.getElementById("color-scheme").value.toLowerCase() // Get selected color scheme mode

    fetch(`https://www.thecolorapi.com/scheme?hex=${colour}&mode=${mode}&format=json&count=5`)
        .then(response => response.json())  
        .then(data => {

            for (let i = 0; i < 5; i++) {
                const color = data.colors[i].hex.value  // Extract hex value
    
                // Set the background color for each color box
                document.getElementById(`c${i}`).style.backgroundColor = color

                // Set the hex value in the corresponding text box
                document.getElementById(`h${i}`).textContent = color

                // Add event listener to color boxes and hex codes to copy color value
                document.getElementById(`c${i}`).addEventListener("click", () => {
                    navigator.clipboard.writeText(color)  // Copy to clipboard
                    showFeedbackCopy(`Foreground: ${color}`)
                    updateColorFromHex(color, true)
                    contrastCheck()

                    
                });
                document.getElementById(`h${i}`).addEventListener("click", () => {
                    navigator.clipboard.writeText(color)  // Copy to clipboard
                    showFeedbackCopy(`Background: ${color}`)
                    updateColorFromHex(color, false)
                    contrastCheck()

                    
                });

                
            }
        })

}

function showFeedbackCopy(message) {
    const confirmation = document.getElementById('feedback')

    confirmation.textContent = message
    confirmation.style.display = 'flex'

    setTimeout(() => {confirmation.style.display = 'none'}, 2000)
    

}


const hex2rgb = (hex) => {
    const r = parseInt(hex.slice(1, 3), 16)
    const g = parseInt(hex.slice(3, 5), 16)
    const b = parseInt(hex.slice(5, 7), 16)
    
    return { r, g, b }
}

// Function to update color, hex, and RGB fields together
function updateColorFromHex(hex, isForeground = true) {
    // Update the RGB value
    const rgb = hex2rgb(hex)

    // Update the color box (color input)
    if (isForeground) {
        document.getElementById('fC').style.backgroundColor = hex;
        document.getElementById('fColour').value = hex  // Color input
        document.getElementById('fColour-T').value = hex  // Text input
        document.getElementById('fColour-R').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})`  // RGB input
        
    } else {
        document.getElementById('bC').style.backgroundColor = hex;
        document.getElementById('bColour').value = hex // Color input
        document.getElementById('bColour-T').value = hex  // Text input
        document.getElementById('bColour-R').value = `rgb(${rgb.r}, ${rgb.g}, ${rgb.b})` // RGB input
    }
}


// Listen for changes in the text input for foreground color (fColour-T)
document.getElementById('fColour-T').addEventListener('input', (e) => {
    const hex = e.target.value
    updateColorFromHex(hex, true)
    contrastCheck()


})

// Listen for changes in the text input for background color (bColour-T)
document.getElementById('bColour-T').addEventListener('input', (e) => {
    const hex = e.target.value
    updateColorFromHex(hex, false)
    contrastCheck()



});

// Listen for changes in the text input for background color (bColour-T)
document.getElementById('fColour').addEventListener('input', (e) => {
    const hex = e.target.value
    updateColorFromHex(hex, true)
    contrastCheck()
  

})

// Listen for changes in the text input for background color (bColour-T)
document.getElementById('bColour').addEventListener('input', (e) => {
    const hex = e.target.value 
    updateColorFromHex(hex, false)
    contrastCheck()



})

function contrastCheck() {
    let c = document.getElementById('fColour-T').value
    let b = document.getElementById('bColour-T').value

    // Update background gradient
    document.body.style.background = `linear-gradient(to bottom, ${c} 0%, ${c} 50%, ${b} 50%, ${b} 100%)`


    // Check contrast using Checker module
    const contrastData = Checker.checkColors(c, b)

    const textResult = document.getElementById("result-text")
    const textHeadline = document.getElementById("result-headlines")
    const textComponent = document.getElementById("result-components")
    const textRatio = document.getElementById("result-ratio")
    
    // Update contrast ratio, text, headlines, and components results
    textRatio.textContent = contrastData.contrast

    textResult.textContent = contrastData.aaaText ? "AAA" : "FAIL"
    textResult.style.color = contrastData.aaaText ? "#a0f6a4" : "#ff0000"


    textHeadline.textContent = contrastData.aaaHeadline ? "AAA" : "FAIL"
    textHeadline.style.color = contrastData.aaaHeadline ? "#a0f6a4" : "#ff0000"

    textComponent.textContent = contrastData.aaComponent ? "AA" : "FAIL"
    textComponent.style.color = contrastData.aaComponent ? "#a0f6a4" : "#ff0000"

    

}






