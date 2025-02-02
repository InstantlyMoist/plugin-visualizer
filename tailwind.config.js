export default {
  theme: {
    extend: {
      dropShadow: {
        glow: [
          "0 0px 20px rgba(255,255, 255, 0.35)",
          "0 0px 65px rgba(255, 255,255, 0.2)"
        ]
      },
      keyframes: {
        shine: {
          '0%': { 'background-position': '100%' },
          '100%': { 'background-position': '-100%' },
        },
        blurIn: {
          '0%': {
            filter: 'blur(10px)',
            opacity: '0',
            transform: 'translateY(-50px)',
          },
          '50%': {
            filter: 'blur(5px)',
            opacity: '0.5',
            transform: 'translateY(5px)',
          },
          '100%': {
            filter: 'blur(0px)',
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
        blurInBottom: {
          '0%': {
            filter: 'blur(10px)',
            opacity: '0',
            transform: 'translateY(50px)',
          },
          '50%': {
            filter: 'blur(5px)',
            opacity: '0.5',
            transform: 'translateY(-5px)',
          },
          '100%': {
            filter: 'blur(0px)',
            opacity: '1',
            transform: 'translateY(0)',
          },
        },
      },
      animation: {
        blurIn: 'blurIn 1s forwards',
        blurInBottom: 'blurInBottom 1s forwards',
        shine: 'shine 5s linear infinite',
      },
    },
  }
}