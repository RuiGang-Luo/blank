/**
 * 通用js方法封装处理
 * Copyright (c) 2019 pactera
 */

const baseURL = process.env.VUE_APP_BASE_API

// 获取当天日期：'yyyy-MM-dd'
export function dateNow() {
    const today = new Date();
    const year = today.getFullYear();
    const month = today.getMonth() + 1;
    const day = today.getDate();
    let yyyy = year;
    let mm = month > 10 ? ('' + month) : ('0' + month);
    let dd = day > 10 ? ('' + day) : ('0' + day);
    return yyyy + '-' + mm + '-' + dd;
}
// 日期格式化
export function parseTime(time, pattern) {
	if (arguments.length === 0 || !time) {
		return null
	}
	const format = pattern || '{y}-{m}-{d} {h}:{i}:{s}'
	let date
	if (typeof time === 'object') {
		date = time
	} else {
		if ((typeof time === 'string') && (/^[0-9]+$/.test(time))) {
			time = parseInt(time)
		} else if (typeof time === 'string') {
			time = time.replace(new RegExp(/-/gm), '/');
		}
		if ((typeof time === 'number') && (time.toString().length === 10)) {
			time = time * 1000
		}
		date = new Date(time)
	}
	const formatObj = {
		y: date.getFullYear(),
		m: date.getMonth() + 1,
		d: date.getDate(),
		h: date.getHours(),
		i: date.getMinutes(),
		s: date.getSeconds(),
		a: date.getDay()
	}
	const time_str = format.replace(/{(y|m|d|h|i|s|a)+}/g, (result, key) => {
		let value = formatObj[key]
		// Note: getDay() returns 0 on Sunday
		if (key === 'a') { return ['日', '一', '二', '三', '四', '五', '六'][value] }
		if (result.length > 0 && value < 10) {
			value = '0' + value
		}
		return value || 0
	})
	return time_str
}

// 表单重置
export function resetForm(refName) {
	if (this.$refs[refName]) {
		this.$refs[refName].resetFields();
	}
}

// 添加日期范围
export function addDateRange(params, dateRange) {
	var search = params;
	search.beginTime = "";
	search.endTime = "";
	if (null != dateRange && '' != dateRange) {
		search.beginTime = dateRange[0];
		search.endTime = dateRange[1];
	}
	return search;
}

// 回显数据字典
export function selectDictLabel(datas, value) {
	var actions = [];
	Object.keys(datas).some((key) => {
		if (datas[key].dictValue == ('' + value)) {
			actions.push(datas[key].dictLabel);
			return true;
		}
	})
	return actions.join('');
}

// 回显数据字典（字符串数组）
export function selectDictLabels(datas, value, separator) {
	var actions = [];
	var currentSeparator = undefined === separator ? "," : separator;
	var temp = value.split(currentSeparator);
	Object.keys(value.split(currentSeparator)).some((val) => {
		Object.keys(datas).some((key) => {
			if (datas[key].dictValue == ('' + temp[val])) {
				actions.push(datas[key].dictLabel + currentSeparator);
			}
		})
	})
	return actions.join('').substring(0, actions.join('').length - 1);
}

// 通用下载方法
export function download(fileName) {
	window.location.href = baseURL + "/common/download?fileName=" + encodeURI(fileName) + "&delete=" + true;
}

// 字符串格式化(%s )
export function sprintf(str) {
	var args = arguments, flag = true, i = 1;
	str = str.replace(/%s/g, function () {
		var arg = args[i++];
		if (typeof arg === 'undefined') {
			flag = false;
			return '';
		}
		return arg;
	});
	return flag ? str : '';
}

// 转换字符串，undefined,null等转化为""
export function praseStrEmpty(str) {
	if (!str || str == "undefined" || str == "null") {
		return "";
	}
	return str;
}

/**
 * 构造树型结构数据
 * @param {*} data 数据源
 * @param {*} id id字段 默认 'id'
 * @param {*} parentId 父节点字段 默认 'parentId'
 * @param {*} children 孩子节点字段 默认 'children'
 * @param {*} rootId 根Id 默认 0
 */
export function handleTree(data, id, parentId, children, rootId) {
	id = id || 'id'
	parentId = parentId || 'parentId'
	children = children || 'children'
	rootId = rootId || Math.min.apply(Math, data.map(item => { return item[parentId] })) || 0
	//对源数据深度克隆
	const cloneData = JSON.parse(JSON.stringify(data))
	//循环所有项
	const treeData = cloneData.filter(father => {
		let branchArr = cloneData.filter(child => {
			//返回每一项的子级数组
			return father[id] === child[parentId]
		});
		branchArr.length > 0 ? father.children = branchArr : '';
		//返回第一层
		return father[parentId] === rootId;
	});
	return treeData != '' ? treeData : data;
}


export function formatVal(key, value, condition){
  return {key: key, value: value, condition: condition};
}

export function formatInVal(key, val, condition){
  let value = val;

  if(Array.isArray(value)){
    return {key, value, condition};
  }else {
    let arr = value.toString().split(',');
    return {key, value: arr, condition};
  }
  return {key: key, value: value, condition: condition};
}

function getWhereParamsAllKeys(whereParams, keyAndCondition){
  let allKeys = whereParams.map(item => {
    if(keyAndCondition){
      return item.key + '@' + item.condition;
    }else{
      return item.key;
    }
  });
  return allKeys;
}

export function formatWhereParams(param = {}, conditionMap = {}) {
  const noArray = ["pageNum", "pageSize"];
  let whereParams = [];
  for(let key in param){
    let value = param[key];
    if(noArray.includes(key) || value === undefined || value === null){
      continue;
    }

    let whereParam;
    let condition = conditionMap[key] || 'eq';

    if(condition){
      if("function" === typeof condition){
        whereParam = condition(key, value)
      }else{
        condition = condition.toLowerCase();
        switch (condition)
        {
          case 'in':
            whereParam = formatInVal(key, value, condition);
            break;
          default:
            whereParam = formatVal(key, value, condition);
        }
      }
    } else {
      whereParam = formatVal(key, value, condition);
    }
    whereParams.push(whereParam);
  }
  return whereParams;
}
export function getWhereParamObj(whereParams = [], key = '', condition = '', keyAndCondition = false){
  let allKeys = getWhereParamsAllKeys(whereParams, keyAndCondition);
  let indexKey = keyAndCondition ? key + '@' + condition : key;
  let index = allKeys.indexOf(indexKey);
  if(index !== -1){
    return whereParams[index];
  }
  return null;
}


export function addWhereParamObj(whereParams = [], whereParamObj = {}, keyAndCondition = false){
  let allKeys = getWhereParamsAllKeys(whereParams, keyAndCondition);
  let {key = '', condition = ''} = whereParamObj;
  let indexKey = keyAndCondition ? key + '@' + condition : key;
  let index = allKeys.indexOf(indexKey);
  if(index !== -1){
    whereParams.splice(index, 1, whereParamObj);
  } else {
    whereParams.push(whereParamObj);
  }
}

export function addWhereParams(whereParams = [], whereParam, keyAndCondition = false){
  if(whereParam){
    if(Array.isArray(whereParam)){
      whereParam.forEach(item => {
        addWhereParamObj(whereParams, item, keyAndCondition);
      })
    }else {
      addWhereParamObj(whereParams, whereParam, keyAndCondition);
    }
  }
}

export function removeWhereParam(whereParams = {}, key = '', condition = '', keyAndCondition = false) {
  let allKeys = getWhereParamsAllKeys(whereParams, keyAndCondition);
  let indexKey = keyAndCondition ? key + '@' + condition : key;
  let index = allKeys.indexOf(indexKey);
  if(index !== -1){
    whereParams.splice(index, 1);
  }
}
