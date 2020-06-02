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

    //getAllRoles () retieve and print all available roles in roletable. 
    getAllRoles(){
        return new Promise ((resolve, reject) => {
            axios.get('/api/roles')
            .then(response => {
                const table  = cTable.getTable(response.data.data);
                console.log(table);
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

    //updateRole update new roe to table. 
    updateRole (role_title, role_salary, department_id){
        return new Promise ((resolve, reject) => { 
            axios.post('/api/role',{
                title: role_title,
                salary: role_salary,
                department_id: department_id

            })
            .then(response => {
                if (response.data.data.affectedRows == 1) {
                    this.getAllRoles()
                    .then (response => {
                        resolve(response);
                    })
                    .catch (err => {
                        reject(err);
                    })
                } 
                resolve ("success");
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

    //getDepartmentId prompts user to select department and return it's Id. 
    getDepartmentId (roletitle, rolesalary){
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
                    message: 'Please select roles to be updated',
                    choices: deptlist
                    }
                ];

                return inquirer.prompt(questions).then(answers => {
                    var index = response.data.data.findIndex(function(item, i){
                        return item.DeptName === answers.Deptlist;
                        });
                        
                    this.depIndex = response.data.data[index].DeptId;
                    this.updateRole(roletitle, rolesalary, this.depIndex)
                    .then (response => {
                        resolve(response);
                    })
                    .catch (err => {
                        reject(err);
                    });
                });
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

    //addRole adds new role. 
    addRole(){
        return new Promise ((resolve, reject) => { 
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

               return  inquirer.prompt(questions)
                .then(answers => {
                    this.getDepartmentId(answers.role_title, answers.role_salary)
                    .then (response => {
                        resolve (response);
                    })
                    .catch (err => {
                        reject (err);
                    });
                        
                })
                .catch (error => {
                    reject(error);
                });
        });
    }
    
    //executeDeleteRole deletes role 
    executeDeleteRole(roleId){
        return new Promise ((resolve, reject) => { 
            const url = '/api/role/' + roleId;
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

    //deleteRole prompts user to select role that needs to be deleted. 
    deleteRole(){
        return new Promise ((resolve, reject) => { 
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

                inquirer.prompt(questions).then(answers => {
                    var index = response.data.data.findIndex(function(item, i){
                        return item.RoleTitle === answers.rolelist;
                        });
                        
                    this.roleindex = response.data.data[index].RoleId;
                    this.executeDeleteRole(this.roleindex)
                    .then(response => {
                        resolve(response);
                    })
                    .catch(err =>{
                        reject(err);
                    });
                });
            })
            .catch(function (error) {
                // handle error
                if (error.code  == "ECONNREFUSED"){
                    return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    return(error);
                }
            });
        });
    }
}


module.exports = Role;