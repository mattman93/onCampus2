var favicon = require('serve-favicon');
var crypto = require("crypto");
var mysql      = require('mysql');
var http = require('http');
var fs = require('fs');
var _favicon = favicon(__dirname + '/favicon.ico');
 var connection = mysql.createConnection({
   host: 'localhost',
    user: 'root',
    port: '3306',
    password: 'kxfxh5EKEi',
   database : 'shouts'
 });
 connection.connect(function(err){
 if(!err) {
     console.log("mysql connected");  
 } else {
  console.log(err);
 }
 });
var server = http.createServer(function(req, response){
    fs.readFile(__dirname + '/index.html',
          function(err, data){
       if(err){
             response.writeHead(500);
              return response.end('error');
         } else {
	  _favicon(req, response, function onNext(err){
		if(err){
		response.writeHead(200);
		response.end(data);
			} else {
			response.writeHead(200);
			response.end(data);
			}
		});
         }
     })
});
var io = require('socket.io').listen(server);
server.listen(80, "45.55.42.214");
var fs = require('fs');
var path = require('path');
var url = require('url');
var http = require('http');
var mysql      = require('mysql');
var connected_clients = [];
 var users = [];
  var userData = [];
    var pool = [];
      var being_observed = [];

   io.sockets.on('connection', function(socket){

      socket.on("map-loaded", function(){
        console.log("client " + socket.id + " map loaded ");
         var clientIp = socket.request.connection.remoteAddress;
         if(clientIp == null){
          clientIp = "null";
         }
         var remoteclient = {
            sock_id : socket.id.substr(2, socket.id.length),
            remote_addr : clientIp,
            hasUserName : false
          };
          connected_clients.push(remoteclient);
          var admins_logged_in = [];
          var cl = "";
          var usr= "";
          var usr_add = "<li id='userlist_na_"+socket.id.substr(2, socket.id.length) + "'> <b>client id: </b> guest:" + socket.id + "<br><hr></li>";
               socket.broadcast.emit('add_unreg_user', usr_add);
               for(var x=0; x<connected_clients.length; x++){
                usr = "<li id='userlist_na_"+ connected_clients[x].sock_id + "'> <b>client id: </b> guest:" + connected_clients[x].sock_id + "<br><hr></li>";
                if(socket.id.substr(2, socket.id.length) != connected_clients[x].sock_id){
                  if(connected_clients[x].hasUserName == false){
                  socket.emit("add_unreg_user", usr);
                  } else {
                     socket.emit("userlist_add_uname", connected_clients[x].sock_id, users[users[x]].username);
                  }
                }
               }
                    for(var i=0;i<users.length;i++){
                     if(userData[i].isAdmin == true){
                       admins_logged_in.push(users[users[i]]);
                        }
                     if(i == users.length - 1){
                     if(admins_logged_in.length > 0){
                       for(var j=0;j<admins_logged_in.length;j++){
                        cl += "<li id='remote_client_"+socket.id + "'> <b>client id: </b>" + socket.id + "<br><b> ip : </b>" + clientIp + "<hr></li>";
                        admins_logged_in[j].emit("add_cc", cl, connected_clients.length);
                      }
                     }
                   }
                 }
          var database = 'shouts';
                  var table    = 'ip_log';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                    });
                    client.connect();
                    client.query("USE " + database);
                    var currentdate = new Date(); 
                    var datetime = (currentdate.getMonth()+1)  + "/" 
                                  + currentdate.getDate() + "/"
                                  + currentdate.getFullYear() + " @"  
                                  + currentdate.getHours() + ":"  
                                  + currentdate.getMinutes() + ":" 
                                  + currentdate.getSeconds();
                    var data = {
                      remote_address: clientIp,
                      time: datetime
                    };
                          client.query("INSERT INTO " + table + " SET ?", data,
                            function(err, results){
                              if(err){ throw err }
                                });

        connection.query("SELECT * FROM posts ORDER BY(id) DESC", function selectCb(err, result){
          if(err){ throw err }
            else { 
          socket.emit("send_posts", result);
			}   
      });

       socket.emit("send-users", userData);
    });
function makeUniqueSocketId(){
  var text = "";
  var possible = "A*";

  for(var i=0; i < 20; i++){
    text += possible.charAt(Math.floor(Math.random() * possible.length));
  }
  return text;
}
function modify_location(array){
  for(var i=0; i < array.length; i++){
    if(array.length > 1){
      if(i == array.length - 1){
        var check1 = array[i].lat + array[i].longi;
        var check2 = array[i - 1].lat + array[i - 1].longi;
        if(check1 == check2){
           array[i].lat = parseFloat(array[i].lat) + 0.0005165;
           array[i].longi = parseFloat(array[i].longi) + 0.0006165;
        }
      }
    } else {
        var check1 = array[i].lat + array[i].longi;
        var check2 = array[i + 1].lat + array[i + 1].longi;
         if(check1 == check2){
           array[i].lat = parseFloat(array[i].lat) + 0.0005165;
           array[i].longi = parseFloat(array[i].longi) + 0.0006165;
        }
    }
  }
}
function makeid()
{
    var text = "";
    var possible = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^^&*()_+";

    for( var i=0; i < 14; i++ )
        text += possible.charAt(Math.floor(Math.random() * possible.length));

    return text;
}
function mod_loc(dataArr){
  for(var i=0; i < dataArr.length; i++){
  if(dataArr.length > 1){
       if(i == dataArr.length-1){
          if((dataArr[i].lat ||  dataArr[i].longi)==(dataArr[i-1].lat ||  dataArr[i-1].longi)){
             // This is concatenating 0.0003112 onto end of string - parse to int
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0005165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0006165;
         }
       } else {
         if((dataArr[i].lat ||  dataArr[i].longi)==(dataArr[i+1].lat ||  dataArr[i+1].longi)){
                 // This is concatenating 0.0003112 onto end of string - parse to int
           dataArr[i].lat = parseFloat(dataArr[i].lat) + 0.0007165;
           dataArr[i].longi = parseFloat(dataArr[i].longi) + 0.0009165;
         }
        }
      }
    }
}
socket.on("check-in", function(username, lat, longi){
  if(users.indexOf(username) > -1){
    var msg = "there is already a user by that name";
    socket.emit("register_error", msg);
  } else {
 var query = connection.query('SELECT user FROM users WHERE user = ?', username, 
      function selectCb(err, results){
      if(err){ throw err; }
        if(results.length > 0){
        var string = '';
        var strlen = results.length;
        for(var i = 0; i < strlen; i++){
      var admin = string + results[i].user;
       var messge = admin + " is an admin account, please login to use";
              socket.emit("admin", messge, admin, lat, longi);
       } 
      } 

      else {
           var user = {
            lat: lat,
            longi: longi,
            username: username,
             beingRequested : false,
             isinconv : false,
             chatPartner : null,
             rand : false,
             isAdmin : false
          } 
            var id = makeid();
             socket.user = id
             socket.username = username;
             users[socket.username] = socket;
             socket.Rid = id;
             socket.lat = lat;
             socket.longi = longi;
             users.push(socket.username);
             userData.push(user);
             mod_loc(users);
             mod_loc(userData);
                  var status = "user created";
                  socket.emit("valid", status);
                    socket.broadcast.emit("update-map", userData);
                    socket.broadcast.emit("replace_with_uname", socket.id.substr(2, socket.id.length), username);
                    var admins_logged_in = [];
                    for(var i=0;i<users.length;i++){
                     if(userData[i].isAdmin == true){
                       admins_logged_in.push(users[users[i]]);
                        }
                     if(i == users.length - 1){
                     if(admins_logged_in.length > 0){
                      var usrid = username.replace(/ /g,'');
                       var add_user = "<li id='list_usr_" + usrid + "'>" + username + "</li>";
                     for(var j=0;j<admins_logged_in.length;j++){
                        admins_logged_in[j].emit("list_add_user", add_user, users.length);
                      }
                  }
              }
          }
          connected_clients[users.indexOf(username)].hasUserName = true;
      }
    });
  }
 });
socket.on('addToRandomPool', function(uname, randRolling){
         var selfTarget = users.indexOf(uname);
          var selfTargetName = users[selfTarget];
           users[selfTargetName].rand = true;
           userData[users.indexOf(selfTargetName)].rand = true;
           if(pool.push(users[selfTargetName])){
              randomConnectEngine(users[selfTargetName].username);
              }
     });
socket.on("removeFromPool", function(username){
  var selfTarget = users.indexOf(username);
    var selfTargetName = users[selfTarget];
  if(users[selfTargetName]){
    users[selfTargetName].rand = false;
    userData[users.indexOf(selfTargetName)].rand = false;
       if(users[selfTargetName].isinconv && users[selfTargetName].chatPartner != null){
                    //in case user removes himself from pool at same time someone connects to pool -- this will
                    //probably prevent some weird errors and/or server restarts
                    var otherUser = users[selfTargetName].chatPartner;
                    users[otherUser].isinconv = false;
                    users[otherUser].beingRequested = false;
                    users[otherUser].chatPartner = null;

                    userData[users.indexOf(otherUser)].isinconv = false;
                    userData[users.indexOf(otherUser)].beingRequested = false;
                    userData[users.indexOf(otherUser)].chatPartner = null;

                    users[otherUser].emit("convEnded", users[otherUser].isinconv,users[otherUser].beingRequested,users[otherUser].chatPartner);
                  }
                   if(pool.indexOf(users[selfTargetName]) > -1){
                      pool.splice(pool.indexOf(username), 1);
                      var msg = "removed from random connect pool";
                      socket.emit("removed", msg);
                      } else {
                         console.log("err0r rem0ving user fr0m p00l");
                      }
             } else {
              console.log("err0r");
             }
    });
function randomConnectEngine(username){ 
  var selfTarget = users.indexOf(username);
      var selfTargetName = users[selfTarget];
  if(((pool.length > 1) && (pool.length % 2 != 0)) || pool.length < 2){
    msg = "waiting for others";
    users[selfTargetName].emit("waiting", msg);
  }
  else if((pool.length > 0)  && (pool.length % 2 == 0)){
    var chatTargetIndex = (pool.indexOf(users[selfTargetName]) - 1);
      var chatTargetName = pool[chatTargetIndex].username;
        if(users[selfTargetName].isinconv !== true){
        users[selfTargetName].isinconv = true;
        users[chatTargetName].isinconv = true;
        users[selfTargetName].chatPartner = users[chatTargetName].username;
        users[chatTargetName].chatPartner = users[selfTargetName].username;

        userData[users.indexOf(selfTargetName)].isinconv = true;
        userData[users.indexOf(selfTargetName)].isinconv = true;
        userData[users.indexOf(selfTargetName)].chatPartner = users[chatTargetName].username;
        userData[users.indexOf(selfTargetName)].chatPartner = users[selfTargetName].username;

        users[selfTargetName].emit("joined", users[chatTargetName].username, users[selfTargetName].username);
        users[chatTargetName].emit("joined", users[selfTargetName].username, users[chatTargetName].username);
        var admins_logged_in = [];
         for(var i=0;i<users.length;i++){
         if(userData[i].isAdmin == true){
           admins_logged_in.push(users[users[i]]);
          }
         if(i == users.length - 1){
           if(admins_logged_in.length > 0){
             var name_one = users[users.indexOf(username)];
              var n_one = users[name_one].username.replace(/ /g,'');
              var n_two = users[name_one].chatPartner.replace(/ /g,'');

            var rank = users.indexOf(username);
            var partner_rank = users.indexOf(users[users[rank]].chatPartner);

            if(rank > partner_rank){
                 var elem_id = n_two+n_one;
            } else {
                 var elem_id = n_one+n_two;
            }
              var ac_num = 0;
                          for(var i=0; i<users.length;i++){
                            if(users[users[i]].isinconv == true){
                              ac_num++;
                               }
                             }
            var adj_ac_num = (ac_num / 2);
         var conv = "<li id='list_conv_" + elem_id + "'>" + n_one + " <span class='glyphicon glyphicon-arrow-right' aria-hidden='true'></span> " + n_two + " <a href='' id='view_conv' data-id='"+n_one+":"+n_two+"'> View </a> </li>";
            for(var j=0;j<admins_logged_in.length;j++){
              admins_logged_in[j].emit("list_add_conv", conv, adj_ac_num);
                }
        }
     }
  }
    var rank = users.indexOf(username);
    var partner_rank = users.indexOf(users[users[rank]].chatPartner);
    var db_u_one = "";
    var db_u_two = "";
            if(rank > partner_rank){
                  db_u_one = users[users[partner_rank]].username;
                  db_u_two = users[users[rank]].username;
            } else {
                   db_u_one = users[users[rank]].username;
                   db_u_two = users[users[partner_rank]].username;
            }
                  var database = 'shouts';
                  var table    = 'conversations';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                    });
                    client.connect();
                    client.query("USE " + database);
                    var currentdate = new Date(); 
                    var datetime = (currentdate.getMonth()+1)  + "/" 
                                  + currentdate.getDate() + "/"
                                  + currentdate.getFullYear() + " @"  
                                  + currentdate.getHours() + ":"  
                                  + currentdate.getMinutes() + ":" 
                                  + currentdate.getSeconds();
                    var data = {
                      user_one: db_u_one.replace(/ /g,''),
                      user_two: db_u_two.replace(/ /g,''),
                      start_time: datetime,
                      active: "1",
                      random: "1"
                    };
                          client.query("INSERT INTO conversations SET ?", data,
                            function(err, results){
                              if(err){ throw err }
                                });

      }
    }
  }
socket.on("decline", function(from, uname){
          users[uname].beingRequested = false;
          users[from].beingRequested = false;

          userData[users.indexOf(uname)].beingRequested = false;
          userData[users.indexOf(from)].beingRequested = false;

          users[from].emit("requestDeclined", uname);
    });
socket.on("check_cred", function(pass, username, lat, longi){
        connection.query("SELECT pass FROM users WHERE user = ? ", username,
      function selectCb(err, results){
        if(err){ throw err; }
         var passwd = results[0].pass;
          var encr_pass = crypto.createHash('md5').update(pass).digest("hex");
        if(encr_pass == passwd){
           if(users.indexOf(username) > -1){
               var msg = "Some one is already logged in to this account";
               socket.emit("register_error", msg);
  } else {
        var user = {
            lat: lat,
            longi: longi,
            username: username,
             beingRequested : false,
             isinconv : false,
             chatPartner : null,
             isAdmin : true
          } 
            var id = makeid();
             socket.user = id
             socket.username = username;
             users[socket.username] = socket;
             socket.Rid = id;
             socket.lat = lat;
             socket.longi = longi;
             users.push(socket.username);
             userData.push(user);
             mod_loc(users);
             mod_loc(userData);
            var status = "admin";
            socket.emit("valid", status);
                    socket.broadcast.emit("update-map", userData);
                    var admins_logged_in = [];
                    for(var i=0;i<users.length;i++){
                     if(userData[i].isAdmin == true){
                       admins_logged_in.push(users[users[i]]);
                        }
                     if(i == users.length - 1){
                     if(admins_logged_in.length > 0){
                      var usrid = username.replace(/ /g,'');
                       var add_user = "<li id='list_usr_" + usrid + "'>" + username + "</li>";
                     for(var j=0;j<admins_logged_in.length;j++){
                        admins_logged_in[j].emit("list_add_user", add_user, users.length);
                      }
                  }
              }
          }
                   }
                 } else {
                  var msgg = " password invalid";
                  socket.emit("bad_credentials", msgg); 
                 }
      });
}); 

socket.on("getAdminStats", function(admin_uname){
  var build_activ_arr = [];
  var active_conv = "";
  var all_users = "";
  var all_clients = "";
  for(var i=0; i<users.length;i++){

    if(users[users[i]].isinconv == true && (build_activ_arr.indexOf(users[users[users.indexOf(users[users[i]].chatPartner)]]) < 0)) {
      build_activ_arr.push(users[users[i]]);
       }
     }
     if(build_activ_arr.length > 0){
       for(var j=0;j<build_activ_arr.length;j++){
        var n_one = build_activ_arr[j].username.replace(/ /g,'');
        var n_two = build_activ_arr[j].chatPartner.replace(/ /g,'');
         active_conv += "<li id='list_conv_" + n_one + n_two + "'>" + n_one+ " <span class='glyphicon glyphicon-arrow-right' aria-hidden='true'></span> " + n_two + " <a href='' id='view_conv' data-id='"+n_one+":"+n_two+"'> View </a> </li>";
       }
     }
     for(var x=0;x<users.length;x++){
      var usrid = users[users[x]].username.replace(/ /g,'');
        all_users += "<li id='list_usr_" + usrid + "'>" + users[users[x]].username + "</li>";
     }
     for(var cc=0; cc<connected_clients.length; cc++){
       all_clients += "<li id='remote_client_"+connected_clients[cc].sock_id + "'> <b>client id: </b>" + connected_clients[cc].sock_id + "<br><b> ip : </b>" + connected_clients[cc].remote_addr + "<hr></li>";
     }
     var ac = build_activ_arr.length;
     var au = users.length;
     var conclt = connected_clients.length;

  var table_head_row = "<center> <div class='row'><div class='col-md-4'><b> Active Conversations <div id='ac_num'>[<b>  " + ac + "  </b>]</div></b></div><div class='col-md-4'><b> All Users <div id='au_num'>[<b>  " + au + "  </b>]</b></div></div><div class='col-md-4'><b> Connected Clients <div id='cc_num'>[<b>  " + conclt + "  </b>]</b></div></div></div>";
  var data_row = "<div class='row'><div class='col-md-4' style='height:150px;overflow-y: auto;border:1px dashed green;'><ul id='actv'>" + active_conv + "</ul></div>";
  var all_users_row = "<div class='col-md-4' style='height:150px;overflow-y:auto;border:1px dashed green;'><ul id='usrs'>" + all_users + "</ul></div>";
  var connected = "<div class='col-md-4' style='height:150px;overflow-y:auto;border:1px dashed green;'><ul id='clnts'>" + all_clients + "</ul></div></div></center>";
  var stats = table_head_row + data_row + all_users_row + connected;
  users[admin_uname].emit("returnAdminStats", stats);
});
socket.on("chat-request", function(to, from){

          var emitTarget = users.indexOf(to);
          var TargetName = users[emitTarget];
          var selfTarget = users.indexOf(from);
          var selfTargetName = users[selfTarget];
          users[selfTargetName].beingRequested = true;
          users[TargetName].beingRequested = true;

          userData[users.indexOf(from)].beingRequested = true;
          userData[users.indexOf(to)].beingRequested = true;

          users[from].chatPartner = to;
          users[to].chatPartner = from;

          userData[users.indexOf(from)].chatPartner = to;
          userData[users.indexOf(to)].chatPartner = from;


         users[TargetName].emit("show-client-req", to, from);

                        });
socket.on("cancelRequest", function(to, from){
          users[from].beingRequested = false;
          users[to].beingRequested = false;
          users[from].chatPartner = null;
          users[to].chatPartner = null;

          userData[users.indexOf(from)].beingRequested = false;
          userData[users.indexOf(to)].beingRequested = false;
          userData[users.indexOf(from)].chatPartner = null;
          userData[users.indexOf(to)].chatPartner = null;

              users[to].emit("senderLeft");
               users[from].emit("senderLeft");
});
socket.on("accept", function(from, to){
        var emitTarget = users.indexOf(from);
        var TargetName = users[emitTarget];
          if((emitTarget == -1) || (TargetName == undefined)){
            var msg = " chat partner left =( ";
             users[to].emit("senderLeft", msg);
                 } else {
                var other = users.indexOf(to);
                var otherName = users[other];
                users[TargetName].beingRequested = false;
                users[otherName].beingRequested = false;
                users[TargetName].isinconv = true;
                users[otherName].isinconv = true;

                userData[users.indexOf(TargetName)].beingRequested = false;
                userData[users.indexOf(otherName)].beingRequested = false;
                userData[users.indexOf(TargetName)].isinconv = true;
                userData[users.indexOf(otherName)].isinconv = true;

                users[TargetName].chatPartner = users[otherName].username;
                users[otherName].chatPartner = users[TargetName].username;

                userData[users.indexOf(TargetName)].chatPartner = users[otherName].username;
                userData[users.indexOf(otherName)].chatPartner = users[TargetName].username;
                users[otherName].emit("joined", to, from);
                users[TargetName].emit("joined", to, from);
        var admins_logged_in = [];
          for(var i=0;i<users.length;i++){
            if(userData[i].isAdmin == true){
             admins_logged_in.push(users[users[i]]);
               }
            if(i == users.length - 1){
                  if(admins_logged_in.length > 0){
                       var rank = users.indexOf(from);
                       var p_rank = users.indexOf(to);
                       var n_one = users[TargetName].username.replace(/ /g,'');
                       var n_two = users[TargetName].chatPartner.replace(/ /g,'');
                       var data_id_n_one = "";
                       var data_id_n_two = "";
                       if(rank > p_rank){
                         var elem_id = n_two+n_one;
                           data_id_n_one = users[TargetName].chatPartner.replace(/ /g,'');
                           data_id_n_two = users[TargetName].username.replace(/ /g,'');
                     } else {
                         var elem_id = n_one+n_two;
                          data_id_n_one = users[TargetName].username.replace(/ /g,'');
                           data_id_n_two = users[TargetName].chatPartner.replace(/ /g,'');
                      }
                        var ac_num = 0;
                          for(var i=0; i<users.length;i++){
                            if(users[users[i]].isinconv == true){
                              ac_num++;
                               }
                             }
            var adj_ac_num = (ac_num / 2);
                   var conv = "<li id='list_conv_" + elem_id + "'>" + n_one + " <span class='glyphicon glyphicon-arrow-right' aria-hidden='true'></span> " + n_two + " <a href='' id='view_conv' data-id='"+data_id_n_one+":"+data_id_n_two+"'> View </a> </li>";
                    for(var j=0;j<admins_logged_in.length;j++){
                     admins_logged_in[j].emit("list_add_conv", conv, adj_ac_num);
                       }
                  }
               }
           }
    }

              var database = 'shouts';
              var table    = 'conversations';
              var client   = mysql.createConnection({
                  host: 'localhost',
                  user: 'root',
                  password: 'kxfxh5EKEi',
                });
                client.connect();
                client.query("USE " + database);
                 var rank = users.indexOf(from);
                 var partner_rank = users.indexOf(to);
              var db_u_one = "";
              var db_u_two = "";
                          if(rank > partner_rank){
                                db_u_one = users[users[partner_rank]].username;
                                db_u_two = users[users[rank]].username;
                          } else {
                                 db_u_one = users[users[rank]].username;
                                 db_u_two = users[users[partner_rank]].username;
                          }

                var currentdate = new Date(); 
                var datetime = (currentdate.getMonth()+1)  + "/" 
                              + currentdate.getDate() + "/"
                              + currentdate.getFullYear() + " @"  
                              + currentdate.getHours() + ":"  
                              + currentdate.getMinutes() + ":" 
                              + currentdate.getSeconds();
                var data = {
                  user_one: db_u_one.replace(/ /g,''),
                  user_two: db_u_two.replace(/ /g,''),
                  start_time: datetime,
                  active: "1",
                  random: "0"
                };
                      client.query("INSERT INTO conversations SET ?", data,
                        function(err, results){
                          if(err){ throw err }
                            });
                      });
socket.on("decline", function(from, uname){
          users[users.indexOf(uname)].beingRequested = false;
          users[users.indexOf(from)].beingRequested = false;

          userData[users.indexOf(uname)].beingRequested = false;
          userData[users.indexOf(from)].beingRequested = false;

          users[users[users.indexOf(from)]].emit("requestDeclined", uname);
    });

socket.on("check_status", function(data, me){
      var msg;
      if(users[data].rand && !users[me].rand){
        msg = 5;
        users[me].emit("return_status", msg);
      }
      else if(users[me].rand){
        msg = 4;
        users[me].emit("return_status", msg);
       } 
        else if(users[me].isinconv){
          msg = 3;
          users[me].emit("return_status", msg);
          } else if(users[data].beingRequested == true){
            msg = 0;
            users[me].emit("return_status", msg);
              } else if(users[data].isinconv == true){
                msg = 1;
                users[me].emit("return_status", msg);
                } else {
                    msg = 2;
                    users[me].emit("return_status", msg);
                    }

});
    socket.on("message", function(you, message){
      if(undefined == users[you]){
        var msg = "An error has occured";
        socket.emit("msgerr", msg);
      } else {
      var TN2 = users[you].chatPartner;
      users[TN2].emit("sendmsg", message, you);
      if(being_observed.length > 0){
        for(var i=0; i<being_observed.length; i++){
          var key = being_observed[i].conv;
            var piece_one = "";
            var piece_two = "";
                  var r = users.indexOf(you);
                  var pr = users.indexOf(users[users[r]].chatPartner);
                      if(r > pr){
                            piece_one = users[users[pr]].username.replace(/ /g,'');
                            piece_two = users[users[r]].username.replace(/ /g,'');
                      } else {
                             piece_one = users[users[r]].username.replace(/ /g,'');
                             piece_two = users[users[pr]].username.replace(/ /g,'');
                      }

          var needle = piece_one + piece_two;

          if(key == needle){
            var adminTarget = users.indexOf(being_observed[i].admin);
            users[users[adminTarget]].emit("add_show_msg", message, you);
          }
        }
      }
                  var database = 'shouts';
                  var table    = 'conversations';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                            });
                  client.connect();
                  client.query("USE " + database);
                  var db_u_one = "";
                  var db_u_two = "";
                  var rank = users.indexOf(you);
                  var partner_rank = users.indexOf(users[users[rank]].chatPartner);
                      if(rank > partner_rank){
                            db_u_one = users[users[partner_rank]].username.replace(/ /g,'');
                            db_u_two = users[users[rank]].username.replace(/ /g,'');
                      } else {
                             db_u_one = users[users[rank]].username.replace(/ /g,'');
                             db_u_two = users[users[partner_rank]].username.replace(/ /g,'');
                      }
                  client.query("SELECT id FROM conversations WHERE user_one = ? AND user_two = ? AND active = ?", [db_u_one, db_u_two, 1],
                   function selectCb(err, results){
                      if(err){ throw err; }
                        if(results.length > 0){
                          var convId = "" ;
                          var str= '';
                          var strlen = results.length;
                          for(var i = 0; i < strlen; i++){
                            convId = str + results[i].id;
                          }
                              var table    = 'chat_messages';
                              var clnt   = mysql.createConnection({
                                  host: 'localhost',
                                  user: 'root',
                                  password: 'kxfxh5EKEi',
                                        });
                              clnt.connect();
                            clnt.query("USE " + database);
                             var data = {
                                conv_id: convId,
                                message: message,
                                sender: you
                              };
                            clnt.query("INSERT INTO chat_messages SET ?", data,
                                      function(err, results){
                                        if(err){ throw err }
                                          });
                          }
                        });
              }
      });
socket.on("rm_from_obv", function(conv_id_tag){
   var p_one = conv_id_tag.substr(0, conv_id_tag.indexOf(":"));
  var  p_two = conv_id_tag.substr(conv_id_tag.indexOf(":")+1, conv_id_tag.length);
  var needle = p_one + p_two; 
  for(var i=0; i<being_observed.length; i++){
    var key = being_observed[i].conv;
    if(key == needle){
      being_observed.splice(i, 1);
    }
      }
});
socket.on("viewing_conv_get_messages", function(conv, admin){
  var name_one = conv.substr(0, conv.indexOf(":"));
  var name_two = conv.substr(conv.indexOf(":")+1, conv.length);
  var tag = name_one + name_two;
  var obj = {
    admin : admin,
    conv: tag
  }
  being_observed.push(obj);
  var content = [];
      var database = 'shouts';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                            });
                  client.connect();
                  client.query("USE " + database);
                  client.query("SELECT id FROM conversations WHERE user_one = ? AND user_two = ? AND active = ?", [name_one, name_two, 1],
                   function selectCb(err, results){
                      if(err){ throw err; }
                        if(results.length > 0){
                          var convId = "";
                          var str = "";
                          for(var i = 0; i < results.length; i++){
                            convId = str + results[i].id;
                          }
                        client.query("SELECT `message`,`sender` FROM chat_messages WHERE conv_id = ? ORDER BY(id) DESC", convId,
                           function selectCb(err, res){
                              if(err){ throw err; }
                              for(var x=0; x<res.length; x++){
                                 var string_m = '';
                                  var string_send = '';
                                        var message = string_m + res[x].message;
                                        var sender = string_send + res[x].sender;
                                        var content_string = "<b>" + sender + "</b> : " + message + "<br>";
                                   content.push(content_string);
                                  if(x == res.length - 1){
                                    users[users[users.indexOf(admin)]].emit("show_message", content);
                                  }
                              }
                                //recurse_messages(res, admin, 0);
                           });
                        
                      }
                  });
            
    });
function recurse_messages(results, admin, i){
     if(i == results.length){
          return;
          }
            var string_m = '';
            var string_send = '';
                  var message = string_m + results[i].message;
                  var sender = string_send + results[i].sender;
                  users[users[users.indexOf(admin)]].emit("show_message", sender, message);
                    i++;
                    recurse_messages(results, admin, i);
              }
              
socket.on("end", function(uname){
var admins_logged_in = [];
    for(var i=0;i<users.length;i++){
      if(userData[i].isAdmin == true){
          admins_logged_in.push(users[users[i]]);
    }
     if(i == users.length - 1){
           if(admins_logged_in.length > 0){
             var name_one = users[users.indexOf(uname)];
              var n_one = users[name_one].username.replace(/ /g,'');
              var n_two = users[name_one].chatPartner.replace(/ /g,'');

            var rank = users.indexOf(uname);
            var partner_rank = users.indexOf(users[users[rank]].chatPartner);

            if(rank > partner_rank){
                 var elem_id = "list_conv_"+n_two+n_one;
            } else {
                 var elem_id = "list_conv_"+n_one+n_two;
            }
            var ac_num = 0;
            for(var i=0; i<users.length;i++){
              if(users[users[i]].isinconv == true){
                ac_num++;
                 }
               }
            var adj_ac_num = (ac_num / 2) - 1;
          for(var j=0;j<admins_logged_in.length;j++){
                  admins_logged_in[j].emit("list_rm_conv", elem_id, adj_ac_num);
             }
        } else {
          var rank = users.indexOf(uname);
            var partner_rank = users.indexOf(users[users[rank]].chatPartner);
            var db_u_one = "";
            var db_u_two = "";
            if(rank > partner_rank){
                  db_u_one = users[users[partner_rank]].username.replace(/ /g,'');
                  db_u_two = users[users[rank]].username.replace(/ /g,'');
            } else {
                   db_u_one = users[users[rank]].username.replace(/ /g,'');
                   db_u_two = users[users[partner_rank]].username.replace(/ /g,'');
            }
        }
     }
  }
     var self = users.indexOf(uname);
        var selfName = users[self];
              if(pool.indexOf(users[selfName]) > -1){
                 var other = pool[users[selfName].chatPartner];
                  pool.splice(pool.indexOf(users[other]), 1);
                    pool.splice(pool.indexOf(selfName.username), 1);
                     var msg = "removed from random connect pool";
                      var ou = users.indexOf(users[selfName].chatPartner);
                      var otherUser = users[ou];
                     users[otherUser].emit("removed", msg);
                     users[selfName].emit("removed", msg);
                      }
                  if(users[selfName].isinconv && users[selfName].chatPartner != null){
                    var ou = users.indexOf(users[selfName].chatPartner);
                    var otherUser = users[ou];
                    users[otherUser].isinconv = false;
                    users[otherUser].beingRequested = false;
                    users[otherUser].chatPartner = null;
                    users[otherUser].rand = false;
                    userData[users.indexOf(otherUser)].isinconv = false;
                    userData[users.indexOf(otherUser)].beingRequested = false;
                    userData[users.indexOf(otherUser)].chatPartner = null;
                    userData[users.indexOf(otherUser)].rand = false;
                    users[selfName].isinconv = false;
                    users[selfName].beingRequested = false;
                    users[selfName].chatPartner = null;
                    users[selfName].rand = false;
                    userData[users.indexOf(selfName)].isinconv = false;
                    userData[users.indexOf(selfName)].beingRequested = false;
                    userData[users.indexOf(selfName)].chatPartner = null;
                    userData[users.indexOf(selfName)].rand = false;
                    users[otherUser].emit("convEnded", users[otherUser].isinconv,users[otherUser].beingRequested,users[otherUser].chatPartner);
  
                  } else {
                    console.log("end conv err");
                  }

                  var database = 'shouts';
                  var table    = 'conversations';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                            });
                  client.connect();
                  client.query("USE " + database);
 
                  client.query("SELECT id FROM conversations WHERE user_one = ? AND user_two = ? AND active = ?", [db_u_one, db_u_two, 1],
                   function selectCb(err, results){
                      if(err){ throw err; }
                        if(results.length > 0){
                          var convId = "" ;
                          var str= '';
                          var strlen = results.length;
                          for(var i = 0; i < strlen; i++){
                            convId = str + results[i].id;
                          }
                            var currentdate = new Date(); 
                            var datetime = (currentdate.getMonth()+1)  + "/" 
                                          + currentdate.getDate() + "/"
                                          + currentdate.getFullYear() + " @"  
                                          + currentdate.getHours() + ":"  
                                          + currentdate.getMinutes() + ":" 
                                          + currentdate.getSeconds();
                           var stat = {
                              end_time: datetime,
                              active: 0
                            };
                          client.query("UPDATE conversations SET ? WHERE id = ?", [stat, convId],
                              function(err, results){
                                  if(err){ throw err }
                                    });
                    }
                  });
        });
socket.on("send_shout", function(from, msg, isAdmin, color, time){
 db = 'shouts';
   connection.query("USE " + db);
   adm_flag = 0;
   if(true == isAdmin){
    adm_flag = 1;
   }
      var post = {
      sender : from,
      message : msg,
      isAdmin : adm_flag,
      color : color,
      time : time
    };
 var query = connection.query('INSERT INTO messages SET ?', post, function(err, result) {
      function selectCb(err, results){
      if(err){ throw err; }
      }
    });
 if(isAdmin){
      connection.query("SELECT image FROM images WHERE user = ?",[from], function(err, rows){
     io.sockets.emit("post_admin_shout", from, msg, rows[0], color, time);
 });
 } else {
   io.sockets.emit("post_shout", from, msg, color, time);
 }
});

socket.on("get_all_shouts", function(){
  connection.query("SELECT * FROM messages ORDER BY(id) DESC LIMIT 150",
      function selectCb(err, results){
      if(err){ throw err; }
       recurse_results(results, 0);
      });
});
function recurse_results(results, i){
  if(i == results.length){
    return;
  }
  var string_s = '';
      var string_m = '';
      var string_adm = '';
      var string_clr = '';
      var string_tm = '';
   var sender = string_s + results[i].sender;
            var message = string_m + results[i].message;
            var isAdminPost = string_adm + results[i].isAdmin;
            var color = string_clr + results[i].color;
            var time = string_tm + results[i].time;
            var img = null;
            if(isAdminPost > 0){
                connection.query("SELECT image FROM images WHERE user = ?",[sender], function(err, rows){
                  img = rows[0];
                  socket.emit("load_shouts", sender, message, isAdminPost, img, color, time);
                  i++;
                  recurse_results(results, i);
                });
            } else {
            socket.emit("load_shouts", sender, message, isAdminPost, img, color, time);
            i++;
            recurse_results(results, i);
            }
        
}
socket.on("store_post", function(user, content, post_lat, post_long, isAdmin, time){
 var db = 'shouts';
   connection.query("USE " + db);
   adm_flag = 0;
   if(true == isAdmin){
    adm_flag = 1;
   }
      var post = {
      user : user,
      content : content,
      lat : post_lat,
      longi : post_long,
      isAdmin : adm_flag,
      time : time
    };
 connection.query('INSERT INTO posts SET ?', post, function(err, result) {
      if(err){ throw err; }
      if(!err){
          console.log("geopost created");
        connection.query("SELECT id FROM posts ORDER BY(id) DESC LIMIT 1",function(err, rows) {
          if(err){ throw err; }
            var id = rows[0].id;
             connection.query("SELECT comments FROM posts WHERE id = ?", id, function selectCb(e,r){
               if(e){ throw(e) }
                  else{
                  var commentnum = r[0].comments;
                  io.sockets.emit("add_post_to_map", user, content, post_lat, post_long, id, time, commentnum);
               }
            });
        });
      }
    });
});
socket.on("post_comment", function(com_con, user, key, color, isAdmin, time){
  var db = 'shouts';
   connection.query("USE " + db);
    adm_flag = 0;
    if(true == isAdmin){
     adm_flag = 1;
     }
    var comment = {
      user : user,
      post_id : key,
      content : com_con,
      color : color,
      isAdmin : adm_flag,
      time : time
    };
   connection.query("INSERT INTO post_comments SET ?", comment, function selectCb(err, result){
	   connection.query("UPDATE posts SET comments = comments + 1 WHERE id = ?", key, function selectCb(error, res){
      connection.query("SELECT comments FROM posts WHERE id = ?", key, function selectCb(e,r){
        if(e){ throw(e) }
          else{
            var commentnum = r[0].comments;
             io.sockets.emit("post", com_con, user, key, color, time, commentnum);
          }
        });
      });
   });
});
  socket.on("get_comments", function(id){
   var db = 'shouts';
   connection.query("USE " + db);
    connection.query("SELECT user,content,color FROM post_comments WHERE post_id = ?", id, function selectCb(err, result){
      if(!err){
      if(!result){
          socket.emit("no_comments", result);
        } else {
          console.log("rows " + result);
          socket.emit("serve_comments", result, id);
        }
        } else { throw err; }
      });
    });
socket.on('disconnect', function(){
  for(var c=0; c<connected_clients.length; c++){
    if(connected_clients[c].sock_id == socket.id.substr(2, socket.id.length)){
        connected_clients.splice(c, 1);
    }
  }
  socket.broadcast.emit("remove_userslist", socket.id.substr(2, socket.id.length));
        var uname = socket.username;
        var continue_exec = false;
    for(var i=0;i<users.length;i++){
      if(userData[i].isAdmin == true){
          users[users[i]].emit("rm_cc", socket.id, connected_clients.length);
                  } 
                } 
        if(uname == undefined){} else {

var admins_logged_in = [];
    for(var i=0;i<users.length;i++){
      if(userData[i].isAdmin == true){
          admins_logged_in.push(users[users[i]]);
    }
     if(i == users.length - 1){
    var index = users[users.indexOf(uname)];
      var isinconv = users[index].isinconv;
        if(isinconv){
           if(admins_logged_in.length > 0){
             var name_one = users[users.indexOf(uname)];
              var n_one = users[name_one].username.replace(/ /g,'');
              var n_two = users[name_one].chatPartner.replace(/ /g,'');

            var rank = users.indexOf(uname);
            var partner_rank = users.indexOf(users[users[rank]].chatPartner);

            if(rank > partner_rank){
                 var elem_id = "list_conv_"+n_two+n_one;
            } else {
                 var elem_id = "list_conv_"+n_one+n_two;
            }
            var ac_num = 0;
            for(var i=0; i<users.length;i++){
              if(users[users[i]].isinconv == true){
                ac_num++;
                 }
               }
               var adj_ac_num = (ac_num / 2) - 1;
          for(var j=0;j<admins_logged_in.length;j++){
                  admins_logged_in[j].emit("list_rm_conv", elem_id, adj_ac_num);
             }
        } 
          var rank = users.indexOf(uname);
            var partner_rank = users.indexOf(users[users[rank]].chatPartner);
            var db_u_one = "";
            var db_u_two = "";
            if(rank > partner_rank){
                  db_u_one = users[users[partner_rank]].username.replace(/ /g,'');
                  db_u_two = users[users[rank]].username.replace(/ /g,'');
            } else {
                   db_u_one = users[users[rank]].username;
                   db_u_two = users[users[partner_rank]].username.replace(/ /g,'');
            }
        
      } 
     var au_num = users.length - 1;  
      for(var j=0;j<admins_logged_in.length;j++){
             var usrid = uname.replace(/ /g,'');
               admins_logged_in[j].emit("list_rm_usr", usrid, au_num);
             }
            for(var x=0; x<users.length; x++){
                    if(users[x]== uname){
                      indx = x;
                    }
                  }
                  //chatpartner isn't set weiner
                   if(users[uname].beingRequested && users[uname].chatPartner != null)
                   {
                  var otherUser = users[uname].chatPartner;
                    users[otherUser].emit("senderLeft");
                      users[otherUser].isinconv = false;
                        users[otherUser].beingRequested = false;
                         users[otherUser].chatPartner = null;
                         userData[users.indexOf(otherUser)].isinconv = false;
                         userData[users.indexOf(otherUser)].beingRequested = false;
                         userData[users.indexOf(otherUser)].chatPartner = null;
                   }
                  if(users[uname].isinconv && users[uname].chatPartner != null){
                    //hide modal of conversation partner and reset their status
                    var otherUser = users[uname].chatPartner;
                    users[otherUser].isinconv = false;
                    users[otherUser].beingRequested = false;
                    users[otherUser].chatPartner = null;
                    userData[users.indexOf(otherUser)].isinconv = false;
                    userData[users.indexOf(otherUser)].beingRequested = false;
                    userData[users.indexOf(otherUser)].chatPartner = null;
                    users[otherUser].emit("convEnded", users[otherUser].isinconv,users[otherUser].beingRequested,users[otherUser].chatPartner);
                  }
             var self = users.indexOf(uname);
              var selfName = users[self];
              if(pool.indexOf(users[selfName]) > -1){
                 var other = pool[users[selfName].chatPartner];
                  pool.splice(pool.indexOf(users[other]), 1);
                    pool.splice(pool.indexOf(selfName.username), 1);
                     var msg = "removed from random connect pool";
                      var ou = users.indexOf(users[selfName].chatPartner);
                      var otherUser = users[ou];
                     users[otherUser].emit("removed", msg);
                      }
            users.splice(indx, 1);
            userData.splice(indx, 1);
            io.sockets.emit("remove-marker", uname);
              }
            }
               var database = 'shouts';
                  var table    = 'conversations';
                  var client   = mysql.createConnection({
                      host: 'localhost',
                      user: 'root',
                      password: 'kxfxh5EKEi',
                            });
                  client.connect();
                  client.query("USE " + database);
 
                  client.query("SELECT id FROM conversations WHERE user_one = ? AND user_two = ? AND active = ?", [db_u_one, db_u_two, 1],
                   function selectCb(err, results){
                      if(err){ throw err; }
                        if(results.length > 0){
                          var convId = "" ;
                          var str= '';
                          var strlen = results.length;
                          for(var i = 0; i < strlen; i++){
                            convId = str + results[i].id;
                          }
                            var currentdate = new Date(); 
                            var datetime = (currentdate.getMonth()+1)  + "/" 
                                          + currentdate.getDate() + "/"
                                          + currentdate.getFullYear() + " @"  
                                          + currentdate.getHours() + ":"  
                                          + currentdate.getMinutes() + ":" 
                                          + currentdate.getSeconds();
                           var stat = {
                              end_time: datetime,
                              active: 0
                            };
                          client.query("UPDATE conversations SET ? WHERE id = ?", [stat, convId],
                              function(err, results){
                                  if(err){ throw err }
                                    });
                    }
                  });
          }
      });
   }); //on connection
