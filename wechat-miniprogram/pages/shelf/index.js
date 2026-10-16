const store=require('../../utils/storage');
Page({
 data:{items:[],mode:'全部记录',modes:['全部记录','已收藏','进行中','已完成'],total:0,done:0,error:''},
 onShow(){this.refresh();},
 refresh(){try{const all=store.list().filter(x=>x.record);const mode=this.data.mode;all.forEach(x=>{x.preview=x.record.note.length>100?x.record.note.slice(0,100)+'…':x.record.note;});this.setData({items:all.filter(x=>mode==='全部记录'||(mode==='已收藏'?x.record.favorite:x.record.status===mode)).sort((a,b)=>b.record.updatedAt.localeCompare(a.record.updatedAt)),total:all.length,done:all.filter(x=>x.record.status==='已完成').length,error:''});}catch(e){this.setData({error:'读取失败，请保留数据并检查备份。',items:[]});}},
 filter(e){this.setData({mode:e.currentTarget.dataset.mode});this.refresh();},
 open(e){wx.navigateTo({url:'/pages/detail/index?id='+encodeURIComponent(e.currentTarget.dataset.id)});}
});
