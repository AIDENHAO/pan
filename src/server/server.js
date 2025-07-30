import express from 'express';
import cors from 'cors';
import fs from 'fs';
import path from 'path';

// 修复ES模块中__dirname的使用问题
const __dirname = path.dirname(new URL(import.meta.url).pathname);

const app = express();
const PORT = 3015;
const DATA_PATH = path.join(__dirname, '../data/leaderInfo.json');
const PERSON_DATA_PATH = path.join(__dirname, '../data/personInfoData.json');
const SYSTEM_DATA_PATH = path.join(__dirname, '../data/systemInfoData.json');
const ZONGMEN_DATA_PATH = path.join(__dirname, '../data/zongmenInfoData.json');
const POSITION_MAPPING_PATH = path.join(__dirname, '../data/positionMapping.json');
const CULTIVATION_STAGES_PATH = path.join(__dirname, '../data/cultivationStages.json');
const CULTIVATION_METHOD_MAPPING_PATH = path.join(__dirname, '../data/cultivationMethodMapping.json');

// 配置CORS
app.use(cors({
  origin: ['http://localhost:3000', 'http://localhost:3001', 'http://localhost:3002', 'http://localhost:3003', 'http://localhost:3004', 'http://localhost:3005', 'http://localhost:3006', 'http://localhost:3007', 'http://localhost:3008', 'http://localhost:3009', 'http://localhost:3010'],
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
 * 通用文件读取函数
 * @param {string} filePath - 文件路径
 * @param {string} fileName - 文件名（用于错误信息）
 * @returns {Promise<Object>} 解析后的JSON对象
 */
const readJsonFile = async (filePath, fileName) => {
  try {
    const data = await fs.promises.readFile(filePath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    console.error(`读取${fileName}文件失败:`, error);
    throw error;
  }
};

/**
 * 写入JSON文件的通用函数
 * @param {string} filePath - 文件路径
 * @param {Object} data - 要写入的数据
 * @param {string} fileName - 文件名（用于日志）
 */
const writeJsonFile = async (filePath, data, fileName) => {
  try {
    await fs.promises.writeFile(filePath, JSON.stringify(data, null, 2), 'utf8');
    console.log(`${fileName}文件写入成功`);
  } catch (error) {
    console.error(`写入${fileName}文件失败:`, error);
    throw error;
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
 * 获取人物信息端点
 * 直接返回personInfoData.json文件内容
 */
app.post('/api/get-person-info', async (req, res) => {
  try {
    const { id } = req.body;
    console.log('收到获取人物信息请求，ID:', id);
    
    const personInfo = await readJsonFile(PERSON_DATA_PATH, 'personInfoData.json');
    const positionMapping = await readJsonFile(POSITION_MAPPING_PATH, 'positionMapping.json');
    
    // 添加职位名称（移除境界名称映射，因为realmMapping.json已删除）
    const enrichedPersonInfo = {
      ...personInfo,
      positionName: positionMapping[personInfo.position.toString()]
    };
    
    res.status(200).json({
      status: 'success',
      data: enrichedPersonInfo,
      message: '人物信息获取成功'
    });
  } catch (error) {
    console.error('获取人物信息失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取人物信息失败',
      error: error.message
    });
  }
});

/**
 * 获取宗门信息端点
 */
app.post('/api/get-zongmen-info', async (req, res) => {
  try {
    const { id } = req.body;
    console.log('收到获取宗门信息请求，ID:', id);
    
    const zongmenInfo = await readJsonFile(ZONGMEN_DATA_PATH, 'zongmenInfoData.json');
    const systemInfo = await readJsonFile(SYSTEM_DATA_PATH, 'systemInfoData.json');
    
    // 合并宗门信息和系统信息
    const combinedInfo = {
      ...zongmenInfo,
      disciples: systemInfo.disciples,
      resources: systemInfo.resources
    };
    
    res.status(200).json({
      status: 'success',
      data: combinedInfo,
      message: '宗门信息获取成功'
    });
  } catch (error) {
    console.error('获取宗门信息失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取宗门信息失败',
      error: error.message
    });
  }
});

/**
 * 获取映射数据端点
 * 包含职位映射、修炼阶段和功法映射数据
 */
app.post('/api/get-mappings', async (req, res) => {
  try {
    const positionMapping = await readJsonFile(POSITION_MAPPING_PATH, 'positionMapping.json');
    const cultivationStages = await readJsonFile(CULTIVATION_STAGES_PATH, 'cultivationStages.json');
    const cultivationMethodMapping = await readJsonFile(CULTIVATION_METHOD_MAPPING_PATH, 'cultivationMethodMapping.json');
    
    res.status(200).json({
      status: 'success',
      data: {
        positionMapping,
        cultivationStages,
        cultivationMethodMapping
      },
      message: '映射数据获取成功'
    });
  } catch (error) {
    console.error('获取映射数据失败:', error);
    res.status(500).json({
      status: 'error',
      message: '获取映射数据失败',
      error: error.message
    });
  }
});

/**
 * 更新修炼值API端点
 * 接收增加的修炼值数量，更新文件并返回最新信息
 */
app.post('/api/update-cultivation', async (req, res) => {
  try {
    console.log('收到修炼值更新请求:', req.body);
    const { increaseValue, id } = req.body;
    console.log('修炼值更新请求 - ID:', id, '增量:', increaseValue);

    // 验证输入
    if (typeof increaseValue !== 'number' || isNaN(increaseValue)) {
      return res.status(400).json({
        success: false,
        error: '无效的修炼值增量，必须提供数字'
      });
    }

    // 读取personInfoData.json文件
    const personInfo = await readJsonFile(PERSON_DATA_PATH, 'personInfoData.json');

    // 更新修炼值
    const newValue = personInfo.cultivationValue + increaseValue;
    personInfo.cultivationValue = newValue;

    // 保存更新后的数据到personInfoData.json
    await writeJsonFile(PERSON_DATA_PATH, personInfo, 'personInfoData.json');

    // 返回成功响应
    res.json({
      success: true,
      data: personInfo
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
    const { id } = req.body;
    console.log('收到境界等级更新请求，ID:', id);

    // 读取personInfoData.json文件
    const personInfo = await readJsonFile(PERSON_DATA_PATH, 'personInfoData.json');

    // 自增境界等级
    personInfo.realmLevel = (personInfo.realmLevel || 0) + 1;

    // 保存更新后的数据到personInfoData.json
    await writeJsonFile(PERSON_DATA_PATH, personInfo, 'personInfoData.json');

    // 返回成功响应
    res.json({
      success: true,
      data: personInfo
    });
  } catch (error) {
    console.error('更新境界等级失败:', error);
    res.status(500).json({
      success: false,
      error: error.message || '更新境界等级时发生服务器错误'
    });
  }
});

/**
 * 激活境界突破API端点
 */
app.post('/api/activate-breakthrough', async (req, res) => {
  try {
    const { id } = req.body;
    
    if (!id) {
      return res.status(400).json({
        success: false,
        error: '缺少必需的参数: id'
      });
    }

    const personInfo = await readJsonFile(PERSON_DATA_PATH, 'personInfoData.json');
    
    if (personInfo.id !== id) {
      return res.status(404).json({
        success: false,
        error: '未找到指定的修炼者'
      });
    }

    // 激活境界突破
    personInfo.canBreakthrough = true;
    personInfo.breakthroughEnabled = true;
    personInfo.lastBreakthroughTime = new Date().toISOString();

    await writeJsonFile(PERSON_DATA_PATH, personInfo, 'personInfoData.json');

    res.json({
      success: true,
      data: {
        message: '境界突破已激活',
        canBreakthrough: personInfo.canBreakthrough,
        breakthroughEnabled: personInfo.breakthroughEnabled
      }
    });
  } catch (error) {
    console.error('激活境界突破失败:', error);
    res.status(500).json({
      success: false,
      error: '服务器内部错误'
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