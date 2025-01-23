// json-two.html?f=000000&b=ffffff

let foregroundHex;
let backgroundHex;
let colorData;

if (typeof window !== 'undefined') {
    let field = 'f';
    let url = window.location.href;
    if (url.indexOf('?' + field + '=') != -1) {
        foregroundHex = getUrlVariable('f');
        backgroundHex = getUrlVariable('b');
        checkColors(foregroundHex, backgroundHex);
    } else if (url.indexOf('&' + field + '=') != -1) {
        foregroundHex = getUrlVariable('f');
        backgroundHex = getUrlVariable('b');
        checkColors(foregroundHex, backgroundHex);
    }
}

// Get Url Parameter
export function getUrlVariable(param) {
    let vars = {};
    if (typeof window !== 'undefined') {
        window.location.href.replace(location.hash, '').replace(
            /[?&]+([^=&]+)=?([^&]*)?/gi, // regexp
            function(m, key, value) { // callback
                vars[key] = value !== undefined ? value : '';
            }
        );
    }
    if (param) {
        return vars[param] ? vars[param] : null;
    }
    return vars;
};

export function checkColors(foregroundColor, backgroundColor) {
  if (foregroundColor && backgroundColor) {
    foregroundHex = foregroundColor;
    backgroundHex = backgroundColor;
  }

  // Hex to RGB
  function hexToRgb(hex) {
    if (!hex) {
        console.error('Invalid hex value:', hex); // Log the error for debugging
        return null; // Return null if hex is invalid
    }

    let shorthandRegex = /^#?([a-f\d])([a-f\d])([a-f\d])$/i;
    hex = hex.replace(shorthandRegex, function(m, r, g, b) {
        return r + r + g + g + b + b; // Expanding shorthand to full hex
    });

    let result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex);
    if (!result) {
        console.error('Invalid hex format:', hex); // Log error if hex format is incorrect
        return null; // Return null if hex is not in a valid format
    }
    
    return {
        r: parseInt(result[1], 16),
        g: parseInt(result[2], 16),
        b: parseInt(result[3], 16)
    };
}


  // Get RGBA
  let foregroundR = hexToRgb(foregroundHex).r
  let foregroundG = hexToRgb(foregroundHex).g
  let foregroundB = hexToRgb(foregroundHex).b
  let foregroundColorRgba = ["" + foregroundR + "","" + foregroundG + "","" + foregroundB + "","0"]

  let backgroundR = hexToRgb(backgroundHex).r
  let backgroundG = hexToRgb(backgroundHex).g
  let backgroundB = hexToRgb(backgroundHex).b
  let backgroundColorRgba = ["" + backgroundR + "","" + backgroundG + "","" + backgroundB + "","1"]


  function luma(rgbaColor) {
    for (let i = 0; i < 3; i++) {
        let rgb = rgbaColor[i];
      rgb /= 255;
      rgb = rgb < .03928 ? rgb / 12.92 : Math.pow((rgb + .055) / 1.055, 2.4);
      rgbaColor[i] = rgb;
    }
    return .2126 * rgbaColor[0] + .7152 * rgbaColor[1] + 0.0722 * rgbaColor[2];
  }

  let foregroundLuma = luma(foregroundColorRgba);
  let backgroundLuma = luma(backgroundColorRgba);


  function checkContrast() {
    foregroundLuma = foregroundLuma + 0.05
    backgroundLuma = backgroundLuma + 0.05

    if (backgroundLuma < foregroundLuma) {
      return foregroundLuma / backgroundLuma;
    } else {
      return backgroundLuma / foregroundLuma;
    }
  }

  let ratio = checkContrast();
  let ratioRounded = ratio.toPrecision(3);

  function checkRating(value) {
    if (ratioRounded > value) {
      return true;
    } else {
      return false;
    }
  }

  let aaHeadline = checkRating(3);
  let aaaHeadline = checkRating(4.5);
  let aaText = checkRating(4.5);
  let aaaText = checkRating(7);
  let aaComponent = checkRating(3);



  return {
    "foregroundHex":foregroundHex,
    "backgroundHex":backgroundHex,
    "foregroundRgb":foregroundR + ", " + foregroundG + ", " + foregroundB,
    "backgroundRgb":backgroundR + ", " + backgroundG + ", " + backgroundB,
    "contrast":ratioRounded,
    "aaHeadline":aaHeadline,
    "aaaHeadline":aaaHeadline,
    "aaText":aaText,
    "aaaText":aaaText,
    "aaComponent":aaComponent,
    "foregroundLuma":foregroundLuma,
    "backgroundLuma":backgroundLuma
  }
};

/**
https://colorcontrast.dev/api/ 
*/
