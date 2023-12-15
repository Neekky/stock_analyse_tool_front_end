const express = require('express');
const path = require('path');

const app = express();

// 设置静态文件目录，通常是 React 构建后的文件夹
app.use(express.static(path.join(__dirname, 'dist')));

// 所有未匹配到的路由都指向 React 应用的 index.html
// 这对于 React Router 应用是必需的
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'dist', 'index.html'));
});

// 设置监听端口
const PORT = 8100
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
