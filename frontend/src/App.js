import React from 'react';
import { ConfigProvider, theme } from 'antd';
import Main from './components/Main'

function App() {
  return (
    <ConfigProvider theme={{
      token: { colorPrimary: '#87A1D0', borderRadius: '10px' },
      algorithm: theme.darkAlgorithm,
      components: {
        Button: {
          primaryColor: '#001844',
        },
        Menu: {
          // itemHeight: '80px'
        },
      },
    }}>
      <div className='App' style={{ backgroundColor:  '#141414' }}>
        <Main/>
      </div>
    </ConfigProvider>
    
  );
}

export default App;
