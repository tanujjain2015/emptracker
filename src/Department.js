const axios = require('axios');
require('dotenv').config();
const cTable = require('console.table');
axios.defaults.baseURL = process.env.baseURL;
const inquirer = require('inquirer');
const EmployeeManager = require('./EmployeeManager');

class Department {
    constructor(){

    }

    //getAllDepartment retrieves and print all departments in department table. 
    getAllDepartment(){
        return new Promise ((resolve, reject) => { 
            axios.get('/api/department')
            .then(response => {
                const table  = cTable.getTable(response.data.data);
                console.log(table);
                //new EmployeeManager();
                resolve("success");
            })
            .catch(function (error) {
                // handle error
                if (error.code  == "ECONNREFUSED"){
                    reject("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    reject(error);
                }
            });
        });
    }

    //newDepartment add new department
    newDepartment (questions){
        return new Promise ((resolve, reject) => { 
            inquirer.prompt(questions).then(answers => {
                if (answers.dept_name){

                    axios.post('/api/department',{
                        name: answers.dept_name
                    })
                    .then(response => {
                        if (response.data.data.affectedRows == 1) {
                            this.getAllDepartment()
                            .then (res => {

                                resolve(res);
                            })
                            .catch(error =>{
                                reject(error);
                            });
                        } 
                        resolve("success");
                    })
                    .catch(function (error) {
                        // handle error
                        if (error.code  == "ECONNREFUSED"){
                            reject("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                        } else {
                            reject(error);
                        }
                    });
                } else {
                    reject ("Not added");
                }
            });
        });
    }

    //newDepartment prompts user to enter department name. 
    addDepartment(){
        return new Promise((resolve, reject) => {
            var questions = [
                {
                    type: 'input',
                    name: 'dept_name',
                    message: "please enter department name:",
                    validate: function(value) {
                        var pass = value.match(
                            /^[\w\s]+$/
                        );
                        if (pass) {
                            return true;
                        }

                        return 'Please enter a valid department name?';
                    }
                }
            ];

            this.newDepartment(questions)
            .then (response=>{
                resolve(response);
            })
            .catch(err => {
                reject(err);
            });
        });
    }

    //executeDeleteDepartment deletes selected department 
    executeDeleteDepartment(deptId){
        return new Promise ((resolve, reject) => { 
            const url = '/api/department/' + deptId;
            axios.delete(url)
            .then(response => {
                resolve("Successfully deleted");
            })
            .catch(function (error) {
                // handle error
                if (error.code  == "ECONNREFUSED"){
                    reject("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    reject(error);
                }
            });
        });
    }

    //deleteDepartment ask user to select department to be deleted. 
    deleteDepartment (){
        return new Promise ((resolve, reject) => { 
            axios.get('/api/department')
            .then(response => {
                var deptlist = [];
                for (var i in response.data.data){
                    deptlist.push(response.data.data[i].DeptName);
                }
                var questions = [
                    {
                    type: 'list',
                    name: 'Deptlist',
                    message: 'Please select department to be deleted',
                    choices: deptlist
                    }
                ]

                inquirer.prompt(questions)
                .then(answers => {
                    var index = response.data.data.findIndex(function(item, i){
                        return item.DeptName === answers.Deptlist; });
                        
                    this.depIndex = response.data.data[index].DeptId;
                    this.executeDeleteDepartment(this.depIndex)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err => {
                        reject(err);
                    });
                });
            });
        });
    }
}


module.exports = Department;