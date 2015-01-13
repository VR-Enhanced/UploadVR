function Posts(){
  this.panels = [];
  $.ajax({

    url: 'posts/posts.json',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR)
      console.log(textStatus)
      console.log(errorThrown)
    },
    success: function(data){
      this.createPosts(data.posts);
    }.bind(this)
  });

}

Posts.prototype.createPosts = function(posts){
  G.totalPosts = posts.length;
  for(var i = 0; i < posts.length; i++){
    new Post(posts[i])   
  }

}



