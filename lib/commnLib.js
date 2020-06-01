const db = require('../db/database');

//Function to generate Unique Id.
function getUniqueId(dbFile){
    var id = 0;
    if (dbFile.length == 0){
        id = 1;
    } else {
        id = (parseInt(dbFile[dbFile.length -1].id) + 1).toString();
    }
    return id.toString();
}

function inputCheck(obj, ...props){
    const errors = [];
  
    props.forEach((prop) => {
      // if property is blank or doesn't exist, add to errors array
      if (obj[prop] === undefined || obj[prop] === '') {
        errors.push(`No ${prop} specified.`);
      }
    });
  
    if (errors.length) {
      return {
        error: errors.join(' ')
      };
    }
    
    return null;
  }

  function getEmployeePatchAttribute(obj){
    const keysArray = Object.keys(obj);
    const keys = [];
    if (keysArray.length > 0) {
        for (var i = 0; i < keysArray.length ; i ++){
            if (keysArray[i] == "first_name") {
                keys.push(obj.first_name);
            } 
            if (keysArray[i] == "last_name") {
                keys.push(obj.last_name);
            } 
            if (keysArray[i] == "role_id") {
                keys.push(obj.role_id);
            } 
            if (keysArray[i] == "manager_id"){
                keys.push(obj.manager_id);
            }
        }
    return keys;
    } else return null;
  }

  function executeDbSql(sql,params, res){
    db.getConnection()
        .then(conn => {
            const rows = conn.execute(sql,params);
            conn.release();
            return rows;
        }).then(result => {
            res.json({
                message: "success",
                data: result[0]
            });
        }).catch(err => {
            res.status(404).json({error: err});
            return;
        });
  }


module.exports = {
    getUniqueId,
    inputCheck,
    getEmployeePatchAttribute,
    executeDbSql
};