const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const {executeDbSql, inputCheck} = require('../../lib/commnLib')


// route to retrieve  all department from DB. 
router.get('/department',(req, res)=>{
    const sql = "select id as DeptId, name as DeptName from department";
    const params = [] ;

    //executeDbSql(sql,params,res);
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

// route to retrieve  department from DB based on Id. 
router.get('/department/:id',(req, res)=>{
    const sql = "select * from department where id = ?";
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

// route to retrieve  all department from DB based on Budget.  
router.get('/department/budget/:id',(req, res)=>{
    const sql = "select department.name , SUM(roletable.salary) as Budget from employee left join roletable on employee.role_id = roletable.id left join department on roletable.id = department.id where department.id = ?";
    const params = [req.params.id] ;
    db.getConnection()
        .then(conn => {
            const rows = conn.query(sql,params);
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

// route to delete department. 
router.delete('/department/:id',(req, res)=>{
    console.log(req.params.id);
    const sql = "delete from department where id = ?";
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

//route to add new department. 
router.post('/department',(req, res)=>{
    const errors = inputCheck(req.body, 'name');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = "insert into department (name) values (?)";
    const params = [req.body.name] ;

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
