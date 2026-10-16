const store=require('../../utils/storage');
Page({
 data:{text:'',error:'',count:0},
 onShow(){try{this.setData({count:Object.keys(store.read().records).length,error:''});}catch(e){this.setData({error:'本地数据读取失败，请勿清理应用数据。'});}},
 input(e){this.setData({text:e.detail.value});},
 exportBackup(){try{const text=store.exportText();this.setData({text});wx.showToast({title:'备份已生成',icon:'none'});}catch(e){wx.showModal({title:'导出失败',content:e.message,showCancel:false});}},
 copy(){if(!this.data.text){wx.showToast({title:'请先生成备份',icon:'none'});return;}wx.setClipboardData({data:this.data.text,fail:()=>wx.showModal({title:'复制未成功',content:'请长按备份文字手动复制。',showCancel:false})});},
 importBackup(){
  let incoming;try{incoming=store.parse(this.data.text);store.read();}catch(e){wx.showModal({title:'无法导入',content:e.message,showCancel:false});return;}
  const count=Object.keys(incoming.records).length;
  if(!count){wx.showToast({title:'备份中没有记录',icon:'none'});return;}
  wx.showModal({title:'确认导入 '+count+' 条记录？',content:'同一资源的记录将被备份覆盖，其他资源保留。建议先导出当前记录并保存到别处。',success:r=>{
   if(!r.confirm)return;
   try{const merged=store.merge(incoming);this.setData({count:Object.keys(merged.records).length});wx.showToast({title:'导入成功'});}
   catch(e){wx.showModal({title:'导入未成功',content:'本地写入失败，请保留原备份后重试。',showCancel:false});}
  }});
 }
});
