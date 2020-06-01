const axios = require('axios');
require('dotenv').config();
const cTable = require('console.table');
axios.defaults.baseURL = process.env.baseURL;
const querystring = require('querystring');
const inquirer = require('inquirer');

class Role {
    constructor(){
        this.depIndex = "";
    }
    getAllRoles(){
        axios.get('/api/roles')
        .then(response => {
            const table  = cTable.getTable(response.data.data);
            console.log(table);
            return;
        })
        .catch(function (error) {
            // handle error
            if (error.code  == "ECONNREFUSED"){
                console.log("Could not connect to web server at : " + error.config.baseURL + error.config.url);
            } else {
                console.log(error);
            }
            
        });
    }

    updateRole (role_title, role_salary, department_id){
            axios.post('/api/role',{
                title: role_title,
                salary: role_salary,
                department_id: department_id

            })
            .then(response => {
                if (response.data.data.affectedRows == 1) {
                    this.getAllRoles();  
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

    getDepartmentId (roletitle, rolesalary){
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
                message: 'Please select roles to be updated',
                choices: deptlist
                }
            ];

            return inquirer.prompt(questions).then(answers => {
                var index = response.data.data.findIndex(function(item, i){
                    return item.DeptName === answers.Deptlist;
                    });
                    
                this.depIndex = response.data.data[index].DeptId;
                this.updateRole(roletitle, rolesalary, this.depIndex);
            });
        })
        .catch(function (error) {
            // handle error
            if (error.code  == "ECONNREFUSED"){
                return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
            } else {
                return(error);
            }
        })
    }

    addRole(){
        var questions = [
            {
                type: 'input',
                name: 'role_title',
                message: "please enter role title",
                validate: function(value) {
                    var pass = value.match(
                        /^[\w\s]+$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid role title?';
                }
            },
            {
                type: 'input',
                name: 'role_salary',
                message: "please enter role salary",
                validate: function(value) {
                    var pass = value.match(
                        /^[\w\s]+$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid role salary?';
                }
            }

          ];

          inquirer.prompt(questions).then(answers => {
              this.getDepartmentId(answers.role_title, answers.role_salary);
                
          });
        return;
    }
    
    executeDeleteRole(roleId){
        const url = '/api/role/' + roleId;
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

    deleteRole(){
        axios.get('/api/roles')
        .then(response => {
            var roleList = [];
            for (var i in response.data.data){
                roleList.push(response.data.data[i].RoleTitle);
            }
            var questions = [
                {
                type: 'list',
                name: 'rolelist',
                message: 'Please select roles to be deleted : ',
                choices: roleList
                }
            ];

            return inquirer.prompt(questions).then(answers => {
                var index = response.data.data.findIndex(function(item, i){
                    return item.RoleTitle === answers.rolelist;
                    });
                    
                this.roleindex = response.data.data[index].RoleId;
                this.executeDeleteRole(this.roleindex);
            });
        })
        .catch(function (error) {
            // handle error
            if (error.code  == "ECONNREFUSED"){
                return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
            } else {
                return(error);
            }
        })
    }

}


module.exports = Role;