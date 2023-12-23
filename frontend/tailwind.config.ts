const { nextui } = require("@nextui-org/react");

import type { Config} from 'tailwindcss'

export default {
  content: ['./app/**/*.{js,jsx,ts,tsx}',
  "./node_modules/@nextui-org/theme/dist/**/*.{js,ts,jsx,tsx}"
  ],
  theme: {
    extend: {
      colors: {
        primary: {"50":"#eff6ff","100":"#dbeafe","200":"#bfdbfe","300":"#93c5fd","400":"#60a5fa","500":"#3b82f6","600":"#2563eb","700":"#1d4ed8","800":"#1e40af","900":"#1e3a8a","950":"#172554"}
      }
    },
  },
  darkMode: "class",
  plugins: [nextui()]
} satisfies Config