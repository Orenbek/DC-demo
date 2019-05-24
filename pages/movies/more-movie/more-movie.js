// pages/movies/more-movie/more-movie.js
var app = getApp();
var util = require('../../../utils/util.js');
Page({

  data: {
    navigateTitle: '',
    movies:{},
    requestUrl: '',
    totalCount: 0,
    isEmpty: true
  },

  processDoubanData:function(moviesDouban){
    var movies = [];
    for (var idx in moviesDouban.subjects) {
      var subject = moviesDouban.subjects[idx];
      var title = subject.title;
      if (title.length >= 6) {
        title = title.substring(0, 6) + "...";
      }
      var temp = {
        stars: util.convertToStarsArray(subject.rating.stars),
        title: title,
        average: subject.rating.average,
        coverageUrl: subject.images.large,
        movieId: subject.id
      };
      movies.push(temp);
    }
    var totalMovies = {};
    
    if(!this.data.isEmpty){
      totalMovies = this.data.movies.concat(movies);
      //这里的判空是必要的，要是movies是空的，则concat函数传入空值会报错。
    }
    else{
      totalMovies = movies;
      this.data.isEmpty = false;
    }
    this.setData({
      movies:totalMovies
    });
    this.data.totalCount += 20;
    wx.hideNavigationBarLoading();
    wx.stopPullDownRefresh();
  },

  // onScrollLower:function(event){
  //   console.log('正在加载');
  //   var nextUrl = this.data.requestUrl+'?start='+this.data.totalCount+'&count=20';
  //   util.http(nextUrl,this.processDoubanData); //回调函数
  //   wx.showNavigationBarLoading();
  // },

  onReachBottom: function (event) {
    var nextUrl = this.data.requestUrl +
      "?start=" + this.data.totalCount + "&count=20";
    util.http(nextUrl, this.processDoubanData)
    wx.showNavigationBarLoading()
  },

  // 只要在json中定义了"enablePullDownRefresh": true，则下拉时，页面会自动调用这个函数
onPullDownRefresh:function(event){
  var refreshUrl = this.data.requestUrl+'?start=0&count=20';
  this.data.isEmpty = true;
  this.data.movies = {};
  this.data.totalCount=0;
  util.http(refreshUrl,this.processDoubanData);
  wx.showNavigationBarLoading();
},

onMovieTap:function(event){
  var movieId = event.currentTarget.dataset.movieid;
  wx.navigateTo({
    url: '../movie-detail/movie-detail?movieId='+movieId
  });
},


  onLoad: function (options) {
    var category = options.category;
    this.setData({
      navigateTitle: category
    });
    var dataUrl = '';
    switch(category){
      case '正在热映':
      dataUrl = app.globalData.doubanBase+'/v2/movie/in_theaters';
      break;
      case '即将上映':
      dataUrl = app.globalData.doubanBase + "/v2/movie/coming_soon";
      break;
      case 'Top250':
      dataUrl = app.globalData.doubanBase+'/v2/movie/top250';
      break;
    };
    this.data.requestUrl = dataUrl;
    util.http(dataUrl, this.processDoubanData);
  },

  onReady: function (event) {
    wx.setNavigationBarTitle({
      title: this.data.navigateTitle
    });
  }
})
