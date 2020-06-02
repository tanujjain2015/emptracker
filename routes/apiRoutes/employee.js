const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const {getUniqueId, inputCheck, getEmployeePatchAttribute} = require('../../lib/commnLib')


//route to add all employees from employee table. 
router.get('/employees',(req, res)=>{
    const sql = "select employee.id as EmpId, employee.first_name as FirstName, employee.last_name as LastName, roletable.title as Title, roletable.salary as Salary, department.name as DeptName from employee left join roletable on employee.role_id = roletable.id left join department on roletable.department_id = department.id";
    const params = [] ;

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
});

//route to retrieve empployee based on Id. 
router.get('/employee/:id',(req, res)=>{
    const sql = "select * from employee where id = ?";
    const params = [req.params.id] ;

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
});

//Route to retrieve Manager names
router.get('/getManagerNames',(req, res)=>{
    const sql = "select concat(first_name, ' ', last_name) as ManagerName , employee.id  from employee left join roletable on employee.role_id = roletable.id where roletable.title like 'M%'";
    const params = [] ;

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
});

//route to retrieve manager name by Id. 
router.get('/employee/manager/:manager_id',(req, res)=>{
    //console.log(req.params.id);
    const sql = "select id as EmpId , first_name as FirstName, last_name as LastName from employee where  manager_id = ?";
    const params = [req.params.manager_id] ;

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
});

//route to retrieve all employees based on department Id. 
router.get('/employee/department/:department_id',(req, res)=>{
    const sql = "select employee.*, roletable.title as Title , department.name as department from employee left join roletable on  employee.role_id = roletable.id left join department on roletable.id = department.id where department.id = ?";
    const params = [req.params.department_id] ;

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
});

//route to delete employee based on Emp Id. 
router.delete('/employee/:id',(req, res)=>{
    console.log(req.params.id);
    const sql = "delete from employee where id = ?";
    const params = [req.params.id] ;

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
});


//route to add new employee
router.post('/employee',(req, res)=>{
    console.log(req.body.name);
    const errors = inputCheck(req.body, 'first_name','last_name','role_id','manager_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    
    const sql = "insert into employee (first_name,last_name,role_id,manager_id) values (?,?,?,?)";
    
    const params = [req.body.first_name,req.body.last_name,req.body.role_id, req.body.manager_id] ;

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
});

//route to update employee details based on id. 
router.put('/employee/:id',(req, res)=>{
    const errors = inputCheck(req.body, 'first_name','last_name','role_id','manager_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = "update employee set first_name = ?, last_name = ? , role_id = ?, manager_id = ? where id = ?";
    const params = [req.body.first_name,req.body.last_name,req.body.role_id, req.body.manager_id, req.params.id] ;

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
});

//route to patch employee details. 
router.patch('/employee/:id',(req, res)=>{
    const keys = Object.keys(req.body);
    const keyArray = getEmployeePatchAttribute(req.body);
    var errors = "";
    var sql = "";
    var params = "";
    if (keys.length > 0){
        if (keys.length == 1){
            errors = inputCheck(req.body, keys[0]);
             sql = `update employee set ${keys[0]} = ? where id = ?`;
             params = [keyArray[0], req.params.id] ;
        } else if (keys.length == 2) {
             errors = inputCheck(req.body, keys[0], keys[1]);
             sql = `update employee set ${keys[0]} = ? , ${keys[1]} = ?  where id = ?`;
             params = [keyArray[0], keyArray[1], req.params.id] ;
        } else if (keys.length == 3) {
             errors = inputCheck(req.body, keys[0], keys[1], keys[2]);
             sql = `update employee set ${keys[0]} = ? , ${keys[1]} = ?, ${keys[2]} = ? where id = ?`;
             params = [keyArray[0], keyArray[1], keyArray[2], req.params.id] ;
        } else if (keys.length == 4) {
             errors = inputCheck(req.body, keys[0], keys[1], keys[2], keys[3]);
             sql = `update employee set ${keys[0]} = ? , ${keys[1]} = ?, ${keys[2]} = ?, ${keys[3]} = ? where id = ?`;
             params = [keyArray[0], keyArray[1], keyArray[2], keyArray[3], req.params.id] ;
        } else {
             errors = "No keys specified.";
        }
        
    } else {
         errors = "No keys specified.";
    }
    
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    if (sql == "" || params == "") {
        res.status(400).json({ error: 'No parameter specified or id is not specified'});
        return;
    }
      
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
});


module.exports = router;
