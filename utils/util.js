const formatTime = date => {
  const year = date.getFullYear()
  const month = date.getMonth() + 1
  const day = date.getDate()
  const hour = date.getHours()
  const minute = date.getMinutes()
  const second = date.getSeconds()

  return [year, month, day].map(formatNumber).join('/') + ' ' + [hour, minute, second].map(formatNumber).join(':')
}

const formatNumber = n => {
  n = n.toString()
  return n[1] ? n : '0' + n
}

function convertToStarsArray(stars) {
  var num = stars.toString().substring(0, 1);
  var array = [];
  for (var i = 1; i <= 5; i++) {
    if (i <= num) {
      array.push(1);
    } else {
      array.push(0);
    }
  }
  return array;
}

function convertToCastString(casts) {
  var castsjoin = '';
  for (var idx in casts) {
    castsjoin = castsjoin + casts[idx].name + '/';
  }
  return castsjoin.substring(0, castsjoin.length - 2)
}

function convertToCastInfos(casts) {
  var castsArray = [];
  for (var idx in casts) {
    var cast = {
      img: casts[idx].avatars ? casts[idx].avatars.large : '',
      name: casts[idx].name
    };
    castsArray.push(cast);
  }
  return castsArray;
}

function http(url, callBack) {
  wx.request({
    url: url,
    // data: {},
    method: 'GET',
    header: {
      "Content-Type": "json"
    },
    success: function(res) {
      callBack(res.data);
    },
    fail: function(error) {
      console.log(error)
    }
  })
}

function getInfo() {
  //查看是否授权。
  wx.getSetting({
    success(res) {
      if (res.authSetting['scope.userInfo']) {
        console.log('已经授权，可以直接调用getUserInfo获取头像昵称。')
        // 已经授权，可以直接调用 getUserInfo 获取头像昵称
        wx.getUserInfo({
          success(res) {
            console.log(res.userInfo)
          }
        })
      }
    },
    fail(err) {
      console.log('getSetting函数返回错误', err)
    }
  });
}

function mapToArray(map) {
  let list = [];
  map.forEach((value, key, map) => {
    list.push([key, value]);
  })
  return list;
};

function removeFromCollection(collection, id, item, postId) {
  const db = wx.cloud.database({
    env: 'test-env-57b34f'
  });
  const _ = db.command;
  db.collection(collection).doc(id).get().then(res => {
    switch (item) {
      case 'thumbuped_posts':
        var setArr = new Set(res.data.thumbuped_posts);
        break;
      case 'collected_posts':
        var setArr = new Set(res.data.collected_posts);
        break;
      case 'collected_albums':
        var setArr = new Set(res.data.collected_albums);
        break;
      case 'liked_music':
        var setArr = new Set(res.data.liked_music);
        break;
      default:
        return false;
    } 
    if (setArr.has(postId)) {
      return [true,setArr]
    } else {
      return false
    }
  }).then(res=>{
    if(res[0]===true){
      let arr = res[1];
      arr.delete(postId);
      arr = [...arr];
      //这里要特别注意，data接受的是字段名，所以他不会读变量。
      if (item ==='thumbuped_posts'){
        db.collection(collection).doc(id).update({data: {thumbuped_posts: arr}}).catch(console.error)
      }
      if (item === 'collected_posts') {
        db.collection(collection).doc(id).update({data: {collected_posts: arr}}).catch(console.error)
      }
      if (item === 'collected_albums') {
        db.collection(collection).doc(id).update({data: {collected_albums: arr}}).catch(console.error)
      }
      if (item === 'liked_music') {
        db.collection(collection).doc(id).update({data: {liked_music: arr}}).catch(console.error)
      }
    }
  });
}

module.exports = {
  formatTime: formatTime,
  convertToStarsArray: convertToStarsArray,
  http: http,
  convertToCastString: convertToCastString,
  convertToCastInfos: convertToCastInfos,
  getInfo: getInfo,
  mapToArray: mapToArray,
  removeFromCollection: removeFromCollection
}