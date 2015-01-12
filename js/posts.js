function Posts(){
  // $.ajax({

  //   url: 'posts/posts.json',
  //   dataType: 'json',
  //   error: function(jqXHR, textStatus, errorThrown){
  //     debugger
  //     console.log(jqXHR)
  //     console.log(textStatus)
  //     console.log(errorThrown)
  //   },
  //   success: function(data){
  //     debugger
  //     console.log(data)
  //   }
  // });

  var $post = $(' <p>There was a lot of hype surrounding the debut of the Virtuix Omni at this year’s International CES. Ever since the company premiered on<a href="https://www.kickstarter.com/projects/1944625487/omni-move-naturally-in-your-favorite-game"> Kickstarter</a>, there has been a portion of the VR community who have questioned its potential for success. There are a number of reasons for this, it’s large, weighing in at about 160lbs, with a footprint of 47”x42”x27” meaning that if you don’t have a room dedicated to it, one might run into issues with space. Secondly, many have pointed out that you need to hang the Rift cables from the ceiling, to prevent you from tripping all over yourself. Both of these are issues that make this device not one that is suited for the mass gaming market… and that is totally ok.</p>');

  var scale = 8;
  var mat = new THREE.MeshBasicMaterial({
    color: 0xff00ff,
    transparent: true,
    opacity: 0.7
  })
  this.panelContainer = new THREE.Mesh(new THREE.PlaneBufferGeometry(2000, 2000), mat);
  scene.add(this.panelContainer);

  this.panel = new THREE.Object3D();
  this.panelContainer.add(this.panel);
  this.panel.html = document.getElementById('panel')
  this.panel.html.style.width = 1000 + 'px';
  this.panel.html.style.height = 1000 + 'px';
  this.panel.html.style.overflow = 'scroll'
  this.panel.content = new THREE.CSS3DObject(this.panel.html);
  this.panel.position.y = 10
  this.panel.content.scale.set(0.1, 0.1, .1);
  this.panel.add(this.panel.content);

}

Posts.prototype.update = function(){

}