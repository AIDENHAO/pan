import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// 修复ES模块中__dirname的使用问题
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 3015;
const DATA_PATH = path.join(__dirname, '../data/leaderInfo.json');

// 配置CORS
app.use(cors({
  origin: 'http://localhost:3003',
  methods: ['GET', 'POST'],
  allowedHeaders: ['Content-Type']
}));
app.use(express.json());

// 验证数据文件是否存在
if (!fs.existsSync(DATA_PATH)) {
  console.error(`错误: 数据文件不存在于路径 ${DATA_PATH}`);
  process.exit(1);
}

/**
 * 读取leaderInfo.json文件
 * @returns {Promise<Object>} 修炼者信息对象
 */
const readLeaderInfo = async () => {
  try {
    const data = await fs.promises.readFile(DATA_PATH, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error('读取leaderInfo.json失败:', error);
    throw new Error('无法读取修炼者信息文件');
  }
};

/**
 * 写入leaderInfo.json文件
 * @param {Object} data - 要写入的修炼者信息对象
 * @returns {Promise<void>}
 */
const writeLeaderInfo = async (data) => {
  try {
    await fs.promises.writeFile(DATA_PATH, JSON.stringify(data, null, 2), 'utf8');
  } catch (error) {
    console.error('写入leaderInfo.json失败:', error);
    throw new Error('无法写入修炼者信息文件');
  }
};

/**
 * 健康检查端点
 */
app.get('/api/health', (req, res) => {
  res.json({
    status: 'ok',
    timestamp: new Date().toISOString(),
    port: PORT
  });
});

/**
 * 更新修炼值API端点
 * 接收增加的修炼值数量，更新文件并返回最新信息
 */
app.post('/api/update-cultivation', async (req, res) => {
  try {
    console.log('收到修炼值更新请求:', req.body);
    const { increaseValue } = req.body;

    // 验证输入
    if (typeof increaseValue !== 'number' || isNaN(increaseValue)) {
      return res.status(400).json({
        success: false,
        error: '无效的修炼值增量，必须提供数字'
      });
    }

    // 读取当前数据
    const leaderInfo = await readLeaderInfo();

    // 更新修炼值，确保不超过上限
    const newValue = leaderInfo.cultivationValue + increaseValue;
    leaderInfo.cultivationValue = Math.min(newValue, leaderInfo.cultivationLimit);

    // 保存更新后的数据
    await writeLeaderInfo(leaderInfo);

    // 返回成功响应
    res.json({
      success: true,
      data: leaderInfo
    });
  } catch (error) {
    console.error('更新修炼值失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '更新修炼值时发生服务器错误'
    });
  }
});

/**
 * 更新境界等级API端点
 * 自增realmLevel并返回最新信息
 */
app.post('/api/update-realm-level', async (req, res) => {
  try {
    console.log('收到境界等级更新请求');

    // 读取当前数据
    const leaderInfo = await readLeaderInfo();

    // 自增境界等级
    leaderInfo.realmLevel = (leaderInfo.realmLevel || 0) + 1;

    // 保存更新后的数据
    await writeLeaderInfo(leaderInfo);

    // 返回成功响应
    res.json({
      success: true,
      data: leaderInfo
    });
  } catch (error) {
    console.error('更新境界等级失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '更新境界等级时发生服务器错误'
    });
  }
});

// 启动服务器
const server = app.listen(PORT, () => {
  console.log(`后端服务器已启动并监听 http://localhost:${PORT}`);
  console.log(`数据文件路径: ${DATA_PATH}`);
  console.log('API端点: POST /api/update-cultivation');

  // 添加定时状态打印
  setInterval(() => {
    console.log('工作中');
  }, 10000);
});

// 处理未捕获的异常
process.on('uncaughtException', (error) => {
  console.error('未捕获的异常:', error);
  server.close(() => process.exit(1));
});

process.on('unhandledRejection', (reason, promise) => {
  console.error('未处理的Promise拒绝:', reason);
  server.close(() => process.exit(1));
});