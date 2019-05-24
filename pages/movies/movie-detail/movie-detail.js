var util = require('../../../utils/util.js');
// 必须得是相对路径
var app = getApp();
Page({
  data: {
    movie: {}
  },

  processDoubanData: function(data) {
    // console.log(data);
    if (!data) {
      return;
    }
    var director = {
      avatar: '',
      name: '',
      id: ''
    };
    //以上三个属性作为可能会空的，并且我们需要处理的属性的处理方式。如果为空，则给他一个默认值为空。
    if (data.directors[0] != null) {
      if (data.directors[0].avatars != null) {
        director.avatar = data.directors[0].avatars.large;
      }
      director.name = data.directors.name;
      director.id = data.directors[0].id;
    }
    var movie = {
      movieImg: data.images ? data.images.large : '',
      country: data.countries[0],
      title: data.title,
      originalTitle: data.original_title,
      wishCount: data.wish_count,
      commentCount: data.commets_count,
      year: data.year,
      genres: data.genres.join('、'),
      stars: util.convertToStarsArray(data.rating.stars),
      score: data.rating.average,
      director: director,
      casts: util.convertToCastString(data.casts),
      castsInfo: util.convertToCastInfos(data.casts),
      summary: data.summary
    };
    //  console.log(movie);
    this.setData({
      movie: movie
    });
  },

// 查看图片
viewMoviePostImg:function(e){
  var src = e.currentTarget.dataset.src;
  wx.previewImage({
    current: src, //当前显示图片的http链接
    urls: [src], //需要预览图片http链接列表
  })
},
  onLoad: function(options) {
    var movieId = options.movieId;
    console.log(movieId);
    // console.log(app);
    // console.log(app.globalData.doubanBase);
    var url = app.globalData.doubanBase + '/v2/movie/subject/' + movieId;
    util.http(url, this.processDoubanData);
  }

})