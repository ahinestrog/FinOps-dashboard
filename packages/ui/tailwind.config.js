const preset = require('@finops/config/tailwind/preset')

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [preset],
  content: ['./src/**/*.{ts,tsx}'],
}
