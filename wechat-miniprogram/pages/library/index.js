const store = require('../../utils/storage');
Page({
 data:{query:'',kind:'全部',kinds:['全部','书籍','纪录片','频道','工具'],items:[],error:''},
 onShow(){this.refresh();},
 refresh(){try{const q=this.data.query.trim().toLowerCase();this.setData({items:store.list().filter(x=>(this.data.kind==='全部'||x.kind===this.data.kind)&&((x.title+' '+x.author+' '+x.group).toLowerCase().includes(q))),error:''});}catch(e){this.setData({error:'本地记录读取失败，已停止写入。请保留设备数据并检查备份。',items:[]});}},
 search(e){this.setData({query:e.detail.value});this.refresh();},
 filter(e){this.setData({kind:e.currentTarget.dataset.kind});this.refresh();},
 open(e){wx.navigateTo({url:'/pages/detail/index?id='+encodeURIComponent(e.currentTarget.dataset.id)});}
});
