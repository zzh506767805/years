// 名人详情API处理函数 - 处理获取单个名人详情和按年份/年龄过滤的请求
require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// 创建Express应用
const app = express();

// 中间件
app.use(cors({
  origin: '*',
  methods: ['GET', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
}));
app.use(express.json());

// 导入Person模型
let Person;
try {
  Person = require('../server/models/Person');
} catch (error) {
  console.log('导入Person模型失败，创建临时模型');
  
  const personSchema = new mongoose.Schema({
    name: { type: String, required: true },
    birthYear: { type: Number, required: true },
    title: String,
    brief: String,
    experiences: [{
      year: Number,
      title: String,
      description: String
    }]
  });
  
  Person = mongoose.models.Person || mongoose.model('Person', personSchema);
}

// 数据库连接
let cachedDb = null;
async function connectToDatabase() {
  if (cachedDb) {
    return;
  }

  try {
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true
    });
    cachedDb = mongoose.connection;
    console.log('MongoDB连接成功');
  } catch (error) {
    console.error('MongoDB连接错误:', error);
    throw error;
  }
}

// 获取单个名人详情
const getPersonDetail = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { id } = req.params;
    
    // 验证ID格式
    if (!mongoose.Types.ObjectId.isValid(id)) {
      return res.status(400).json({
        success: false,
        message: '无效的ID格式'
      });
    }
    
    // 查找名人
    const person = await Person.findById(id);
    
    if (!person) {
      return res.status(404).json({
        success: false,
        message: '未找到该名人'
      });
    }
    
    // 返回详细信息
    res.status(200).json({
      success: true,
      data: person
    });
  } catch (error) {
    console.error('获取名人详情失败:', error);
    res.status(500).json({
      success: false,
      message: '获取名人详情过程中发生错误',
      error: error.message
    });
  }
};

// 按年份过滤名人
const filterPeopleByYear = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { year } = req.params;
    const numYear = parseInt(year);
    
    // 验证年份格式
    if (isNaN(numYear)) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的年份'
      });
    }
    
    // 查找在该年份有经历的名人或出生于该年份的名人
    const people = await Person.find({
      $or: [
        { birthYear: numYear },
        { "experiences.year": numYear }
      ]
    });
    
    // 结果统计
    const birthCount = people.filter(p => p.birthYear === numYear).length;
    const experienceCount = people.filter(p => 
      p.experiences && p.experiences.some(exp => exp.year === numYear)
    ).length;
    
    // 返回结果
    res.status(200).json({
      success: true,
      data: {
        year: numYear,
        totalCount: people.length,
        birthCount,
        experienceCount,
        people: people.map(p => ({
          id: p._id,
          name: p.name,
          birthYear: p.birthYear,
          title: p.title,
          brief: p.brief,
          relevantExperiences: p.experiences ? 
            p.experiences.filter(exp => exp.year === numYear) : []
        }))
      }
    });
  } catch (error) {
    console.error('按年份过滤名人失败:', error);
    res.status(500).json({
      success: false,
      message: '按年份过滤名人过程中发生错误',
      error: error.message
    });
  }
};

// 按年龄过滤名人
const filterPeopleByAge = async (req, res) => {
  try {
    await connectToDatabase();
    
    const { age } = req.params;
    const numAge = parseInt(age);
    
    // 验证年龄格式
    if (isNaN(numAge) || numAge < 0) {
      return res.status(400).json({
        success: false,
        message: '请提供有效的年龄'
      });
    }
    
    // 查找所有名人
    const allPeople = await Person.find();
    
    // 过滤出有特定年龄经历的名人
    const people = allPeople.filter(person => {
      if (!person.experiences || person.experiences.length === 0) return false;
      
      return person.experiences.some(exp => {
        // 计算在该经历发生时的年龄
        const ageAtExperience = exp.year - person.birthYear;
        return ageAtExperience === numAge;
      });
    });
    
    // 返回结果
    res.status(200).json({
      success: true,
      data: {
        age: numAge,
        count: people.length,
        people: people.map(p => {
          // 找出在特定年龄发生的经历
          const relevantExperiences = p.experiences.filter(exp => 
            (exp.year - p.birthYear) === numAge
          );
          
          return {
            id: p._id,
            name: p.name,
            birthYear: p.birthYear,
            title: p.title,
            brief: p.brief,
            relevantExperiences
          };
        })
      }
    });
  } catch (error) {
    console.error('按年龄过滤名人失败:', error);
    res.status(500).json({
      success: false,
      message: '按年龄过滤名人过程中发生错误',
      error: error.message
    });
  }
};

// 注册路由
app.get('/api/people/year/:year', filterPeopleByYear);
app.get('/api/people/age/:age', filterPeopleByAge);
app.get('/api/people/:id', getPersonDetail);

// 健康检查
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok', serverTime: new Date().toISOString() });
});

// 导出处理函数
module.exports = app; 