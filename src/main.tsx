import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import { RouterProvider } from 'react-router'
import router from './router'
import { ConfigProvider } from 'antd-mobile'
import { Provider } from 'react-redux'
import store from './store'

createRoot(document.getElementById('root')!).render(
  // <StrictMode>
    <Provider store={store}>
      <ConfigProvider >
        <RouterProvider router={router} />
      </ConfigProvider>
    </Provider>
  // </StrictMode>,
)
