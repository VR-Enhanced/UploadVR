function Posts(){
  this.panels = [];
  this.distanceFromUser = 50;
  $.ajax({

    url: 'posts/posts.json',
    dataType: 'json',
    error: function(jqXHR, textStatus, errorThrown){
      console.log(jqXHR)
      console.log(textStatus)
      console.log(errorThrown)
    },
    success: function(data){
      this.createPanels(data.posts, new THREE.Vector3(0, 100, -500));
    }.bind(this)
  });

}

Posts.prototype.createPanels = function(posts){
    var scale = 8;
    var geo = new THREE.PlaneBufferGeometry(190, 200)
    var mat = new THREE.MeshBasicMaterial({
      color: 0xff00ff,
      transparent: true,
      opacity: 0.7
    });

  for(var i = 0; i < posts.length; i++){
    var post = posts[i];
    var $post = $('<div class = "post"><div class = "title"></div><div class="content"></div></div>');
    $post.find('.title').text(post.title);
    var $content = $post.find('.content');
    _.each(post.paragraphs, function(paragraph){
      var $paragraph = $('<p>')
      $paragraph.text(paragraph);
      $content.append($paragraph)
    });
    
    var panel = new THREE.Mesh(geo, mat);
    scene.add(panel);
    panel.position.set(i * 300, 100, -500);

    var innerPanel = new THREE.Object3D();
    panel.add(innerPanel);
    innerPanel.html = $post[0];
    innerPanel.content = new THREE.CSS3DObject(innerPanel.html);
    innerPanel.content.scale.set(0.2, 0.2, 1);
    innerPanel.content.position.z = -43.5
    innerPanel.add(innerPanel.content);
    this.panels.push(panel);

    this.created = true;


    G.objectControls.add(panel);
    panel.select =function(){
      this.flyIn(panel);
    }.bind(this);
    



  }


}

Posts.prototype.flyIn = function(panel){
  var fakeObject = new THREE.Object3D();
  var target = G.controls.getObject().position.clone();
  var direction = G.controls.getDirection();
  fakeObject.translateZ(direction.z * this.distanceFromUser)
  fakeObject.translateY(direction.y * this.distanceFromUser)
  fakeObject.translateX(direction.x * this.distanceFromUser)
  var i = {
    x: panel.position.x,
    z: panel.position.z
  }

  var f = {
    x: fakeObject.position.x,
    z: fakeObject.position.z
  }
  var posTween = new TWEEN.Tween(i).
    to(f, 3000).
    onUpdate(function(){
      panel.position.set(i.x, panel.position.y, i.z);
      console.log(panel.position, 'yaa')
    }).start();

}


Posts.prototype.update = function(){
  if(!this.created){
    return;
  }
  var target = G.controls.getObject().position.clone();
  G.controls.getDirection();
  // this.panels[0].position.z -=1


}