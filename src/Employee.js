const axios = require('axios');
require('dotenv').config();
const cTable = require('console.table');
axios.defaults.baseURL = process.env.baseURL;
const inquirer = require('inquirer');

// Employee class provides various methods for employee table operations. This class uses http client. 

class Employee {
    constructor(){
        this.roleindex="";
    }

    //getAllEmployee () method retrieve and print All employees from employee table. 
    getAllEmployee(){
       return  new Promise((resolve , reject) =>{
            axios.get('/api/employees')
            .then(response => {
                //const table = cTable.getTable(response.data.data);
                //console.log(table);
                 resolve (response.data.data);
                // return "hello";
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

    //getEmployeeById () method retrieve and print  employee from employee table based on EmpId.
    getEmployeeById(empId){
        return new Promise ((resolve, reject) => { 
            const url = '/api/employee/' + empId;
            axios.get(url)
            .then(response => {
                const table  = cTable.getTable(response.data.data);
                console.log(table);
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

    //getEmployeeByManager () method retrieve and print  employees from employee table based on Manager Id.
    getEmployeeByManager(id){
        return new Promise ((resolve, reject) => { 
            const req = '/api/employee/manager/' + id;
            axios.get(req)
            .then(response => {
                //const table  = cTable.getTable(response.data.data);
                //console.log(table);
                resolve (response.data.data);
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

    //getEmployeeByDepartment () method retrieve and print  employees from employee table based on Department Id.
    getEmployeeByDepartment(id){
        return new Promise ((resolve, reject) => { 
            const req = '/api/employee/department/' + id;
            axios.get(req)
            .then(response => {
                //const table  = cTable.getTable(response.data.data);
                //console.log(table);
                resolve(response.data.data);
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
    
    //getManagerInput retrieves managers from emp table and prompts use to select manager value. 
    getManagerInput(questions, responsedata) {
       return new Promise ((resolve, reject) => {
                inquirer.prompt(questions)
                .then(answers => {
                    var index = responsedata.findIndex(function(item, i){
                        return item.ManagerName === answers.managername;
                    });
                    this.getEmployeeByManager(responsedata[index].id)
                    .then (response => {
                        resolve(response);
                    })
                    .catch(err => {
                        reject(err);
                    })
                });
            });
        }

    //getManagerEmployee () method retrieve and print  employees from employee table based on manager selected
    getManagerEmployee(){
        return new Promise ((resolve, reject) => { 
            axios.get('/api/getManagerNames')
            .then(response => {
                var managerList = [];
                for (var i in response.data.data){
                    managerList.push(response.data.data[i].ManagerName);
                }
                var questions = [
                    {
                    type: 'list',
                    name: 'managername',
                    message: 'Please select Manager',
                    choices: managerList
                    }
                ];
                
                this.getManagerInput(questions,response.data.data)
                .then(response => {
                    resolve (response);
                })
                .catch(err =>{
                    reject(err);
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

    //getDepartmentInput () retrieves department names from department table and prompts use to select department value. 
    getDepartmentInput(questions, responsedata) {
        return new Promise ((resolve, reject) => {
            inquirer.prompt(questions).then(answers => {
            var index = responsedata.findIndex(function(item, i){
                return item.DeptName === answers.departmentname;
                });
                this.getEmployeeByDepartment(responsedata[index].DeptId)
                .then(response => {
                    resolve(response);
                })
                .catch(err =>{
                    reject(err);
                });
            });
        });
    }

    //getDepartmentEmployee () method retrieve and print  employees from employee table based on department selected
    getDepartmentEmployee(){
        return new Promise ((resolve, reject) => { 
            axios.get('/api/department')
            .then(response => {
                var departmentList = [];
                for (var i in response.data.data){
                    departmentList.push(response.data.data[i].DeptName);
                }
                var questions = [
                    {
                    type: 'list',
                    name: 'departmentname',
                    message: 'Please select Department',
                    choices: departmentList
                    }
                ];
                this.getDepartmentInput(questions, response.data.data)
                .then(response => {
                    resolve(response);
                })
                .catch (err => {
                    reject(err);
                })
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

    //View All employee is parent method ton prompt user to select various options to view employee. 
    viewAllEmployees() {
        var questions = [
            {
              type: 'list',
              name: 'employeeList',
              message: 'What would you like to do?',
              choices: [
                'view all Employees',
                'view all Employees by Manager',
                'view all Employees by Department'
              ],
              filter: function(val) {
                return val.toLowerCase();
            }
            }
          ];
        
            //Create a new promise object to return all employee. 
            return new Promise ((resolve, reject) => {
                inquirer.prompt(questions).then( answers => {
                    if (answers.employeeList == "view all employees"){
                            this.getAllEmployee()
                            .then(response => {
                                const table  = cTable.getTable(response);
                                console.log(table);
                                resolve ("success");
                            })
                            .catch (err => {
                                reject(err);
                            });
                    }
                    if (answers.employeeList == "view all employees by manager") {
                        this.getManagerEmployee()
                        .then (response => {
                            const table  = cTable.getTable(response);
                            console.log(table);
                            resolve ("success");
                        })
                        .catch (err => {
                            reject(err);
                        });
                    }
                    if (answers.employeeList == "view all employees by department") {
                        this.getDepartmentEmployee()
                        .then (response => {
                            const table  = cTable.getTable(response);
                            console.log(table);
                            resolve ("success");
                        })
                        .catch (err => {
                            reject(err);
                        });
                    }
                });
            });
    }

    //addEmployee method create a new employee in table. 
    addEmployee(){
        return new Promise ((resolve, reject) => {
        var questions = [
            {
                type: 'input',
                name: 'emp_firstname',
                message: "please enter first name",
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
                name: 'emp_lastname',
                message: "please enter last name",
                validate: function(value) {
                    var pass = value.match(
                        /^[\w\s]+$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid last name?';
                }
            },
            {
                type: 'input',
                name: 'role_id',
                message: "please enter Role Id",
                validate: function(value) {
                    var pass = value.match(
                        /^[\w\s]+$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid Role Id?';
                }
            },
            {
                type: 'input',
                name: 'manager_id',
                message: "please enter manager Id",
                validate: function(value) {
                    var pass = value.match(
                        /^[\w\s]+$/
                    );
                    if (pass) {
                        return true;
                    }

                    return 'Please enter a valid manager Id?';
                }
            }

          ];

          inquirer.prompt(questions)
          .then(answers => {
                axios.post('/api/employee',{
                    first_name: answers.emp_firstname,
                    last_name: answers.emp_lastname,
                    role_id: answers.role_id,
                    manager_id: answers.manager_id,

                  })
                .then(response => {
                    if (response.data.data.affectedRows == 1) {
                        this.getAllEmployee()
                        .then (response => {
                            const table = cTable.getTable(response);
                            console.log(table);
                            resolve("success");
                        })
                        .catch (err => {
                            reject(err);
                        })
                    } 
                })
                .catch(function (error) {
                    // handle error
                    if (error.code  == "ECONNREFUSED"){
                        return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                    } else {
                        return(error);
                    }
                });
          })
          .catch (err => {
              reject (err);
          });
        });
    }

    //getRoleId retrieves RoleID from role table. 
    getRoleId (empid){
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
                    message: 'Please select roles to be updated',
                    choices: roleList
                    }
                ];

                inquirer.prompt(questions)
                .then(answers => {
                    var index = response.data.data.findIndex(function(item, i){
                        return item.RoleTitle === answers.rolelist;
                        });
                        
                    this.roleindex = response.data.data[index].RoleId;
                    this.updateEmployeeRoleById(empid, this.roleindex)
                    .then (response => {
                        resolve(response);
                    })
                    .catch(err => {
                        reject(err);
                    })
                });
            })
            .catch(function (error) {
                // handle error
                if (error.code  == "ECONNREFUSED"){
                    reject("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    reject(error);
                }
            })
        });
    }

    //updateEmployeeRoleById updates Role id on an existing employee. 
    updateEmployeeRoleById(id,role_id){
        return new Promise ((resolve, reject) => { 
            const url = '/api/employee/' + id;
            axios.patch(url, {
                role_id : role_id
            })
            .then(response => {
                this.getEmployeeById(id)
                .then (response => {
                    resolve(response);
                })
                .catch(err => {
                    reject(err);
                })
            })
            .catch(function (error) {
                if (error.code  == "ECONNREFUSED"){
                    reject("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    reject(error);
                }
            });
        });
    }

    //updateEmployeeRoleById updates Role id on an existing employee. 
    updateEmployeeRole(){
        return new Promise ((resolve, reject ) => {
                axios.get('/api/employees')
                .then(response => {
                    var employeeList = [];
                    for (var i in response.data.data){
                        employeeList.push(response.data.data[i].FirstName + ' ' + response.data.data[i].LastName);
                    }
                    var questions = [
                        {
                        type: 'list',
                        name: 'employeeName',
                        message: 'Please select employee Details to be updated',
                        choices: employeeList
                        }
                    ];

                    inquirer.prompt(questions)
                    .then(answers => {
                        var index = response.data.data.findIndex(function(item, i){
                            return item.FirstName === answers.employeeName.split(' ')[0];
                            });
                            this.getRoleId(response.data.data[index].EmpId)
                            .then(response => {
                                resolve(response);
                            })
                            .catch(err => {
                                reject(err);
                            })
                    })
                    .catch (err => {
                        reject (err);
                    })
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

    //executeDeleteEmployee deletes employee deletion operation. 
    executeDeleteEmployee(empId){
        return new Promise ((resolve, reject) => { 
            const url = '/api/employee/' + empId;
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

    //DeleteEmployee method ask user to select employee that needs to be deleted. 
    deleteEmployee(){
        return new Promise ((resolve, reject) => { 
            axios.get('/api/employees')
            .then(response => {
                var empList = [];
                for (var i in response.data.data){
                    empList.push(response.data.data[i].FirstName + ' ' + response.data.data[i].LastName);
                }
                var questions = [
                    {
                    type: 'list',
                    name: 'empList',
                    message: 'Please select roles to be deleted : ',
                    choices: empList
                    }
                ];

                inquirer.prompt(questions).then(answers => {
                    var index = response.data.data.findIndex(function(item, i){
                        return item.FirstName === answers.empList.split(' ')[0];
                        });
                        
                    this.roleindex = response.data.data[index].EmpId;
                    this.executeDeleteEmployee(this.roleindex)
                    .then (response => {
                        resolve(response);
                    })
                    .catch(err => {
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
}


module.exports = Employee;
 