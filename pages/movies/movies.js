// pages/movies/movies.js
var util = require('../../utils/util.js');
var app = getApp();
Page({

  /**
   * 页面的初始数据
   */
  data: {
    inTheaters: {},
    comingSoon: {},
    top250: {},
    searchResult: {},
    searchUrl: '',
    isEmpty: true,
    totalCount: 0,
    containerShow: true,
    searchPanelShow: false,
    inputValue: ''
    //这个对象要是不在这里初始化，会报错。
  },

  getMovieListData: function(url, settedKey, categoryTitle) {
    var that = this;
    wx.request({
      url: url,
      // data: {},
      method: 'GET',

      header: {
        "Content-Type": "json"
      },
      success: function(res) {
        that.processDoubanData(res.data, settedKey, categoryTitle);
      },
      fail: function() {
        console.log("failed")
      }
    })
  },

  processDoubanData: function(moviesDouban, settedKey, categoryTitle) {
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

    if (!this.data.searchPanelShow) {
          var readyData = {};
          readyData[settedKey] = {
            categoryTitle: categoryTitle,
            movies: movies
            //这里就做到了在每个inTheaters,comingSoon,和top250里填充movies数组
          };
          this.setData(readyData); //神了！ 这个简直了。
        }
     else {
          var totalMovies = {};

          if (!this.data.isEmpty) {
            totalMovies = this.data.searchResult.movies.concat(movies);
            //这里的判空是必要的，要是movies是空的，则concat函数传入空值会报错。
          } 
          else {
            totalMovies = movies;
            this.data.isEmpty = false;
          };
          var readyData = {};
      readyData['searchResult'] = {
            categoryTitle: categoryTitle,
            movies: totalMovies
            //这里就做到了在每个inTheaters,comingSoon,和top250里填充movies数组
          };
          this.setData(readyData); //神了！ 这个简直了。 
          this.data.totalCount += 20;
          wx.hideNavigationBarLoading();
      }

  },

  onMoreTap: function(event) {
    var category = event.currentTarget.dataset.category;
    wx.navigateTo({
      url: 'more-movie/more-movie?category=' + category,
    })
  },

  onMovieTap:function(event){
    var movieId = event.currentTarget.dataset.movieid;
    wx.navigateTo({
      url: 'movie-detail/movie-detail?movieId='+movieId,
    });
  },

  onBindFocus: function(event) {
    console.log('onBindFocus');
    this.setData({
      containerShow: false,
      searchPanelShow: true
    });
  },

  onBindChange(event) {
    var text = event.detail.value;
    var searchUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.getMovieListData(searchUrl, 'searchResult', '');

  },

  onConfirm: function(event) {
    var text = event.detail.value;
    console.log(text);
    var sUrl = app.globalData.doubanBase + '/v2/movie/search?q=' + text;
    this.setData({
      searchUrl: sUrl
    });
    this.getMovieListData(sUrl, 'searchResult', '');

  },

  onCancelImgTap: function() {
    this.setData({
      containerShow: true,
      searchPanelShow: false,
      searchResult: {},
      isEmpty: true,
      inputValue: '' 
    });
  },

  setInputValue(event) {
    this.setData({
      inputValue: event.detail.value
    });
  },

  onScrollLower: function(event) {
    console.log('正在加载');
    var nextUrl = this.data.searchUrl + '&start=' + this.data.totalCount + '&count=20';
    util.http(nextUrl, this.processDoubanData); //回调函数
    wx.showNavigationBarLoading();
  },

  /**
   * 生命周期函数--监听页面加载
   */
  onLoad: function(options) {
    var inTheatersUrl = app.globalData.doubanBase + "/v2/movie/in_theaters" + "?start=0&count=3";
    var comingSoonUrl = app.globalData.doubanBase + "/v2/movie/coming_soon" + "?start=0&count=3";
    var top250Url = app.globalData.doubanBase + "/v2/movie/top250" + "?start=0&count=3";

    this.getMovieListData(inTheatersUrl, 'inTheaters', '正在热映');
    this.getMovieListData(comingSoonUrl, 'comingSoon', '即将上映');
    this.getMovieListData(top250Url, 'top250', 'Top250');
  },

  /**
   * 生命周期函数--监听页面初次渲染完成
   */
  onReady: function() {

  },

  /**
   * 生命周期函数--监听页面显示
   */
  onShow: function() {

  },

  /**
   * 生命周期函数--监听页面隐藏
   */
  onHide: function() {

  },

  /**
   * 生命周期函数--监听页面卸载
   */
  onUnload: function() {

  },

  /**
   * 页面相关事件处理函数--监听用户下拉动作
   */
  onPullDownRefresh: function() {

  },

  /**
   * 页面上拉触底事件的处理函数
   */
  onReachBottom: function() {

  },

  /**
   * 用户点击右上角分享
   */
  onShareAppMessage: function() {

  }
})