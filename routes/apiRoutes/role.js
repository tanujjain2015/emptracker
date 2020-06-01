const express = require('express');
const router = express.Router();
const db = require('../../db/database');
const {getUniqueId, inputCheck} = require('../../lib/commnLib')


router.get('/roles',(req, res)=>{
    const sql = "select id as RoleId, title as RoleTitle, salary as RoleSalary, department_id as DeptId from roletable";
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

router.get('/role/:id',(req, res)=>{
    //console.log(req.params.id);
    const sql = "select * from roletable where id like = ?";
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

router.get('/rolesbytitle',(req, res)=>{
    const sql = "select * from roletable where title like ?";
    const params = [req.query.title] ;
    console.log("Value f Prams is: " + params);

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

router.delete('/role/:id',(req, res)=>{
    console.log(req.params.id);
    const sql = "delete from roletable where id = ?";
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


router.post('/role',(req, res)=>{
    const errors = inputCheck(req.body, 'title','salary','department_id');
    if (errors) {
      res.status(400).json({ error: errors });
      return;
    }
    const sql = "insert into roletable (title,salary,department_id) values (?,?,?)";
    const params = [req.body.title,req.body.salary,req.body.department_id ] ;

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
