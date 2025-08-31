varying vec2 vUv;
uniform sampler2D uImage;
uniform sampler2D uImage1;
uniform float uTime;
uniform vec2 uHover;
uniform float uHoverState;
varying float vCircle;
uniform vec2 uTextureSize;
uniform float uIsFullScreen;
varying vec2 vSize;

vec2 getUV(vec2 uv, vec2 textureSize, vec2 quadSize) {
    vec2 tempUV = uv - vec2(0.5);

    float quadAspect = quadSize.x / quadSize.y;
    float textureAspect = textureSize.x / textureSize.y;

    if (quadAspect < textureAspect) {
        tempUV = tempUV * vec2(quadAspect / textureAspect, 1.);
    } else {
        tempUV = tempUV * vec2(1., textureAspect / quadAspect);
    }

    tempUV += vec2(0.5);
    return tempUV;
}

void main() {
    vec2 newUv = getUV(vUv, uTextureSize, vSize);
    float distortionStrength = vCircle * 0.05;
    vec2 distortedUV = newUv + vec2(distortionStrength * sin(uTime), distortionStrength * cos(uTime));

    vec4 imgTexture = texture2D(uImage, distortedUV);
    vec4 videoTexture = texture2D(uImage1, distortedUV);

    vec3 color = imgTexture.rgb;
    color += vCircle * 0.715;

    vec4 finalTexture;
    if (uIsFullScreen > 0.5) {
        // Show video texture directly in full-screen mode
        finalTexture = videoTexture;
    } else {
        // When hovered (uHoverState > 0.5), show only the video
        // Otherwise, show only the image
        if (uHoverState > 0.5) {
            finalTexture = videoTexture;
        } else {
            finalTexture = imgTexture;
        }
    }

    // Add the hover effect color
    finalTexture.rgb += vCircle/4.;

    gl_FragColor = finalTexture;
}