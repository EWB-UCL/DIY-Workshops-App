
//
if(document.getElementById('submit')){
  document.getElementById('submit').addEventListener("click", onFormSubmit);
}
if(document.getElementById('view')){
  document.getElementById('view').addEventListener("click", viewEntries);
}

// Populate the database
//
function populateDB(tx) {
     //tx.executeSql('DROP TABLE IF EXISTS DIARY_ENTRY');
     tx.executeSql('CREATE TABLE IF NOT EXISTS DIARY_ENTRY (entry_id auto_increment, title, contents, file)');
     //tx.executeSql('CREATE TABLE IF NOT EXISTS DIARY_ENTRY (entry_id int NOT NULL AUTO_INCREMENT, Title varchar(255) NOT NULL, Contents varchar(255) NOT NULL, PRIMARY KEY (entry_id)');
     var title = document.getElementById("title").value;
     var content = document.getElementById("content").value;
     var file = document.getElementById("file");
     tx.executeSql("INSERT INTO DIARY_ENTRY (title, contents, file) VALUES ('"+ title +"','"+ content +"','"+ file +"')");
     //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (2, "Second row")');
}

function viewEntries(tx) {
  document.getElementById('view').style.visibility = 'hidden';
  var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
  db.transaction(viewQueryDB, errorCB);
  }

  function viewQueryDB(tx) {
    //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (34, "Another row")', [], querySuccess, errorCB);
      tx.executeSql('SELECT * FROM DIARY_ENTRY', [], viewQuerySuccess, errorCB);
  }

function viewQuerySuccess(tx, results) {
  //results of SELECT statement
  var len = results.rows.length;
  //$('#diary_entries').append("Your diary entries :<br>")
  for (var i=0; i<len; i++){
    $('#diary_entries').append("<br>"+"<h2>"+results.rows.item(i).title+"<h2>" + "<br>" + "<h5>"+results.rows.item(i).contents+"<h5>" + "<br>" );//+results.rows.item(i).file +"<br>");
  }
}

// Query the database
//
function queryDB(tx) {
  //tx.executeSql('INSERT INTO DEMO (id, data) VALUES (34, "Another row")', [], querySuccess, errorCB);
    tx.executeSql('SELECT * FROM DIARY_ENTRY', [], querySuccess, errorCB);
}

// Query the success callback
//
function querySuccess(tx, results) {
  //results of SELECT statement
  //var len = results.rows.length;
  //alert("DIARY table: " + len + " rows found.");
  //for (var i=0; i<len; i++){
    //alert("Row = " + i + " ID = " + results.rows.item(i).entry_id + " Title =  " + results.rows.item(i).title);
  //}
  //results of INSERT statement
    //console.log("Insert ID = " + results.insertId);
    //console.log("Rows Affected = " + results.rowAffected);
    //console.log("Insert ID = " + results.rows.length);
    $('#success').append("<br><h3>Successfully added to your diary!<h3><br>");
}

// Transaction error callback
//
function errorCB(err) {
    alert("Error processing SQL: "+err.message);
}

// Transaction success callback
//
function successCB() {
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(queryDB, errorCB);
}

// saving an entry
//
function onFormSubmit() {
    var title = document.getElementById("title").value;
    var content = document.getElementById("content").value;
    var file = document.getElementById("file").value;
    var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
    db.transaction(populateDB, errorCB, successCB);
}

//function viewEntries(){
//  var db = window.openDatabase("Database", "1.0", "PhoneGap Demo", 200000);
//  db.transaction(populateDB, errorCB, successCB);
//}
