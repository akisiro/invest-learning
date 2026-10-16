const catalog=require('../../data/catalog');
const store=require('../../utils/storage');
const weread=require('../../data/weread');
Page({
 data:{item:null,favorite:false,status:'想学',statusIndex:0,statuses:store.statuses,progress:0,position:'',note:'',dirty:false,error:'',savedAt:''},
 onLoad(options){
  this.id=options.id;const original=catalog.find(x=>x.id===this.id);
  const item=original ? Object.assign({},original,{weread:weread[original.id]||{url:'',note:'暂未确认对应版本，可复制书名在微信读书内搜索。'}}) : null;
  if(!item){this.setData({error:'资源不存在'});return;}
  try{const r=store.get(this.id);this.setData(Object.assign({item,statusIndex:store.statuses.indexOf(r.status),savedAt:r.updatedAt},r));}
  catch(e){this.setData({error:'记录读取失败，已停止编辑。请保留本地数据。'});}
 },
 markDirty(){this.setData({dirty:true});if(wx.enableAlertBeforeUnload)wx.enableAlertBeforeUnload({message:'笔记尚未保存，请先保存记录'});},
 toggleFavorite(e){this.setData({favorite:e.detail.value});this.markDirty();},
 changeStatus(e){const i=Number(e.detail.value);const patch={statusIndex:i,status:store.statuses[i]};if(i===2)patch.progress=100;else if(this.data.progress===100)patch.progress=0;this.setData(patch);this.markDirty();},
 changeProgress(e){const p=Number(e.detail.value);const i=p===100?2:(p>0?1:0);this.setData({progress:p,statusIndex:i,status:store.statuses[i]});this.markDirty();},
 positionInput(e){this.setData({position:e.detail.value});this.markDirty();},
 noteInput(e){this.setData({note:e.detail.value});this.markDirty();},
 save(){try{const r=store.save(this.id,{favorite:this.data.favorite,status:this.data.status,progress:this.data.progress,position:this.data.position,note:this.data.note});this.setData({dirty:false,savedAt:r.updatedAt});if(wx.disableAlertBeforeUnload)wx.disableAlertBeforeUnload();wx.showToast({title:'已保存到本机'});}catch(e){wx.showModal({title:'保存未成功',content:'请勿退出当前页面。可能是存储空间不足或数据异常，先复制笔记备份。',showCancel:false});}},
 copyBookTitle(){if(this.data.item && this.data.item.kind==='书籍')wx.setClipboardData({data:this.data.item.title,success:()=>wx.showToast({title:'已复制，请在微信读书搜索',icon:'none'})});},
 copyWereadLink(){const item=this.data.item;if(item && item.kind==='书籍' && item.weread.url)wx.setClipboardData({data:item.weread.url,success:()=>wx.showToast({title:'已复制，请在浏览器打开',icon:'none'})});},
 copyNote(){wx.setClipboardData({data:this.data.note||'（空笔记）'});},
 copyLink(){wx.setClipboardData({data:this.data.item.url});}
});
