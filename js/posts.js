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
  var string;
  var post;
  var wordsPerLine = 12;
  var words;
  for(var i = 0; i < posts.length; i++){
    //we need to create one big string from this guy, with new lines and such
    post = posts[i];
    string = "";
    string += post.title.toUpperCase() + '\n\n\n'
    _.each(post.paragraphs, function(paragraph){
      words = paragraph.split(' ');
      for(var j = 0; j < words.length; j++){
        string += words[j] +" ";
        if(j!== 0 && j%wordsPerLine === 0){
          string += '\n';
        }
      }
      string += '\n\n';
    });
    new Post(string, i);
  }

}



