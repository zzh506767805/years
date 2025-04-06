const Person = require('../models/Person');

// 获取所有人物
exports.getAllPeople = async (req, res) => {
  try {
    const people = await Person.find({}, 'id name title brief');
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 搜索人物
exports.searchPeople = async (req, res) => {
  try {
    const { q } = req.query;
    
    if (!q || q.trim() === '') {
      return res.status(200).json([]);
    }

    // 创建搜索正则表达式，不区分大小写
    const searchRegex = new RegExp(q, 'i');
    
    // 在名字、标题和简介中搜索
    const people = await Person.find({
      $or: [
        { name: searchRegex },
        { title: searchRegex },
        { brief: searchRegex }
      ]
    }, 'id name title brief');
    
    res.status(200).json(people);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 导入名人数据
exports.importPerson = async (req, res) => {
  try {
    const personData = req.body;
    
    // 数据校验
    if (!personData || !personData.name || !personData.birthYear) {
      return res.status(400).json({ 
        success: false, 
        message: '数据不完整，必须包含姓名和出生年份' 
      });
    }
    
    // 验证经历数据
    if (!Array.isArray(personData.experiences) || personData.experiences.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '必须包含至少一条经历数据' 
      });
    }
    
    for (const exp of personData.experiences) {
      if (!exp.year || !exp.title || !exp.description) {
        return res.status(400).json({ 
          success: false, 
          message: '每条经历必须包含年份、标题和描述' 
        });
      }
    }

    // 获取最新ID
    const maxIdPerson = await Person.findOne().sort('-id');
    const newId = maxIdPerson ? maxIdPerson.id + 1 : 1;
    
    // 保存数据
    const newPerson = new Person({
      id: personData.id || newId,
      name: personData.name,
      birthYear: personData.birthYear,
      title: personData.title || '',
      brief: personData.brief || '',
      experiences: personData.experiences
    });
    
    // 检查ID是否已存在
    if (personData.id) {
      const existingPerson = await Person.findOne({ id: personData.id });
      if (existingPerson) {
        return res.status(400).json({
          success: false,
          message: `ID为${personData.id}的人物已存在`
        });
      }
    }
    
    await newPerson.save();
    
    res.status(201).json({
      success: true,
      message: '人物数据导入成功',
      person: newPerson
    });
  } catch (error) {
    res.status(500).json({
      success: false, 
      message: error.message
    });
  }
};

// 批量导入名人数据
exports.batchImportPeople = async (req, res) => {
  try {
    const peopleData = req.body;
    
    if (!Array.isArray(peopleData) || peopleData.length === 0) {
      return res.status(400).json({ 
        success: false, 
        message: '数据格式错误，应提供人物数组' 
      });
    }
    
    // 获取当前最大ID
    const maxIdPerson = await Person.findOne().sort('-id');
    let nextId = maxIdPerson ? maxIdPerson.id + 1 : 1;
    
    // 预处理数据，分配ID
    const processedData = peopleData.map(person => {
      if (!person.id) {
        person.id = nextId++;
      }
      return person;
    });
    
    // 检查数据合法性
    for (const person of processedData) {
      if (!person.name || !person.birthYear) {
        return res.status(400).json({
          success: false,
          message: `数据不完整，每个人物必须包含姓名和出生年份`
        });
      }
      
      if (!Array.isArray(person.experiences) || person.experiences.length === 0) {
        return res.status(400).json({
          success: false,
          message: `${person.name}必须包含至少一条经历数据`
        });
      }
      
      for (const exp of person.experiences) {
        if (!exp.year || !exp.title || !exp.description) {
          return res.status(400).json({
            success: false,
            message: `${person.name}的每条经历必须包含年份、标题和描述`
          });
        }
      }
    }
    
    // 检查ID冲突
    const existingIds = await Person.find({ 
      id: { $in: processedData.map(p => p.id) } 
    }, 'id name');
    
    if (existingIds.length > 0) {
      return res.status(400).json({
        success: false,
        message: `以下ID已存在: ${existingIds.map(p => `${p.id}(${p.name})`).join(', ')}`
      });
    }
    
    // 批量插入
    const result = await Person.insertMany(processedData);
    
    res.status(201).json({
      success: true,
      message: `成功导入${result.length}个人物数据`,
      count: result.length
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

// 获取单个人物完整信息
exports.getPersonById = async (req, res) => {
  try {
    const person = await Person.findOne({ id: req.params.id });
    if (!person) {
      return res.status(404).json({ message: '找不到该人物' });
    }
    res.status(200).json(person);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 按年份查询事件
exports.getEventsByYear = async (req, res) => {
  try {
    const year = parseInt(req.params.year);
    const people = await Person.find({
      "experiences.year": year
    });
    
    const events = people.map(person => {
      const yearExperiences = person.experiences.filter(exp => exp.year === year);
      return {
        personId: person.id,
        personName: person.name,
        birthYear: person.birthYear,
        experiences: yearExperiences
      };
    }).filter(person => person.experiences.length > 0);
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// 按年龄查询事件
exports.getEventsByAge = async (req, res) => {
  try {
    const age = parseInt(req.params.age);
    const people = await Person.find();
    
    const events = people.map(person => {
      const ageExperiences = person.experiences.filter(exp => exp.year - person.birthYear === age);
      return {
        personId: person.id,
        personName: person.name,
        birthYear: person.birthYear,
        experiences: ageExperiences.map(exp => ({
          ...exp.toObject(),
          year: exp.year,
          age: age
        }))
      };
    }).filter(person => person.experiences.length > 0);
    
    res.status(200).json(events);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
}; 