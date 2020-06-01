const axios = require('axios');
require('dotenv').config();
const cTable = require('console.table');
axios.defaults.baseURL = process.env.baseURL;
const inquirer = require('inquirer');
const EmployeeManager = require('./EmployeeManager');

class Department {
    constructor(){

    }
    getAllDepartment(){
        axios.get('/api/department')
        .then(response => {
            const table  = cTable.getTable(response.data.data);
            console.log(table);
            //new EmployeeManager();
            return;
        })
        .catch(function (error) {
            // handle error
            if (error.code  == "ECONNREFUSED"){
                return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
            } else {
                return(error);
            }
        });
        return;
    }

    addDepartment(){
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

          inquirer.prompt(questions).then(answers => {
            if (answers.dept_name){

                axios.post('/api/department',{
                    name: answers.dept_name
                  })
                .then(response => {
                    if (response.data.data.affectedRows == 1) {
                        this.getAllDepartment();  
                    } 
                    return("success");
                })
                .catch(function (error) {
                    // handle error
                    if (error.code  == "ECONNREFUSED"){
                        return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                    } else {
                        return(error);
                    }
                });
            }
          });
        return;
    }
    executeDeleteDepartment(deptId){
        const url = '/api/department/' + deptId;
        axios.delete(url)
        .then(response => {
             return("Successfully deleted");
        })
        .catch(function (error) {
            // handle error
            if (error.code  == "ECONNREFUSED"){
                return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
            } else {
                return(error);
            }
        });
        return;
    }

    deleteDepartment (){
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

            return inquirer.prompt(questions).then(answers => {
                var index = response.data.data.findIndex(function(item, i){
                    return item.DeptName === answers.Deptlist; });
                    
                this.depIndex = response.data.data[index].DeptId;
                this.executeDeleteDepartment(this.depIndex);
            });
        });
    }
}


module.exports = Department;