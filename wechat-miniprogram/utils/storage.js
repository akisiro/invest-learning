const catalog = require('../data/catalog');
const KEY = 'invest-learning.local.v1';
const ids = new Set(catalog.map(x => x.id));
const statuses = ['想学', '进行中', '已完成'];
function empty() { return { version: 1, records: {} }; }
function plain(x) { return !!x && typeof x === 'object' && !Array.isArray(x); }
function validate(value) {
  if (!plain(value) || value.version !== 1 || !plain(value.records)) throw new Error('备份格式或版本不支持');
  const result = empty();
  Object.keys(value.records).forEach(id => {
    const r = value.records[id];
    if (!ids.has(id) || !plain(r) || typeof r.favorite !== 'boolean' ||
        !statuses.includes(r.status) || !Number.isInteger(r.progress) || r.progress < 0 || r.progress > 100 ||
        typeof r.position !== 'string' || r.position.length > 120 ||
        typeof r.note !== 'string' || r.note.length > 20000 ||
        typeof r.updatedAt !== 'string' || !Number.isFinite(Date.parse(r.updatedAt))) {
      throw new Error('记录无效，请确认备份来自本小程序且未经修改');
    }
    result.records[id] = {favorite:r.favorite,status:r.status,progress:r.progress,position:r.position,note:r.note,updatedAt:r.updatedAt};
  });
  if (JSON.stringify(result).length > 500000) throw new Error('记录过大，请先缩短笔记后重试');
  return result;
}
function read() {
  const value = wx.getStorageSync(KEY);
  if (value === '' || value === undefined || value === null) return empty();
  return validate(value);
}
function write(value) {
  const clean = validate(value);
  wx.setStorageSync(KEY, clean); // 失败时抛出，界面不得显示保存成功
  return clean;
}
function get(id) {
  if (!ids.has(id)) throw new Error('资源不存在');
  return read().records[id] || {favorite:false,status:'想学',progress:0,position:'',note:'',updatedAt:''};
}
function save(id, record) {
  if (!ids.has(id)) throw new Error('资源不存在');
  const data = read();
  data.records[id] = Object.assign({}, record, {updatedAt:new Date().toISOString()});
  return write(data).records[id];
}
function exportText() { return JSON.stringify(read(), null, 2); }
function parse(text) {
  if (typeof text !== 'string' || text.length > 1000000) throw new Error('备份文字过长');
  return validate(JSON.parse(text));
}
function merge(value) {
  const incoming = validate(value);
  const data = read();
  Object.keys(incoming.records).forEach(id => { data.records[id] = incoming.records[id]; });
  return write(data);
}
function list() {
  const records = read().records;
  return catalog.map(item => Object.assign({}, item, {record:records[item.id] || null}));
}
module.exports = {KEY,statuses,read,get,save,exportText,parse,merge,list};
