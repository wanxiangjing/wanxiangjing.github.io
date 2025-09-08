/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx,scss}",
  ],
  theme: {
    extend: {
      // 你的自定义主题扩展
    },
  },
  plugins: [],
  corePlugins: {
    preflight: false, // 保持与现有SCSS的兼容性
  }
}