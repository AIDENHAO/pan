import express from 'express';
const app = express();

// 简单的测试路由
app.get('/', (req, res) => {
  res.json({ message: 'Test server working' });
});

// 测试带参数的路由
app.get('/test/:id', (req, res) => {
  res.json({ id: req.params.id });
});

const PORT = 8080;
app.listen(PORT, () => {
  console.log(`Test server running on port ${PORT}`);
});