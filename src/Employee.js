const axios = require('axios');
require('dotenv').config();
const cTable = require('console.table');
axios.defaults.baseURL = process.env.baseURL;
const Role = require('./Role')
const inquirer = require('inquirer');
const EmployeeManager = require('./EmployeeManager');

class Employee {
    constructor(){
        this.roleindex="";
    }

    getAllEmployee(){
        axios.get('/api/employees')
        .then(response => {
            const table  = cTable.getTable(response.data.data);
            console.log(table);
            return "success";
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

    getEmployeeById(empId){
        const url = '/api/employee/' + empId;
        axios.get(url)
        .then(response => {
            const table  = cTable.getTable(response.data.data);
            console.log(table);
            return "success";
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

    getEmployeeByManager(id){
        const req = '/api/employee/manager/' + id;
        axios.get(req)
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

    getEmployeeByDepartment(id){
        const req = '/api/employee/department/' + id;
        axios.get(req)
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

    getManagerEmployee(){
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
            
            function getManagerInput() {
              inquirer.prompt(questions).then(answers => {
                 var index = response.data.data.findIndex(function(item, i){
                    return item.ManagerName === answers.managername;
                  });
                  new Employee().getEmployeeByManager(response.data.data[index].id);
              });
            }
            
            getManagerInput();
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

    getDepartmentEmployee(){
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
            
            function getDepartmentInput() {
              inquirer.prompt(questions).then(answers => {
                 var index = response.data.data.findIndex(function(item, i){
                    return item.DeptName === answers.departmentname;
                  });
                  new Employee().getEmployeeByDepartment(response.data.data[index].DeptId);
              });
            }
            
            getDepartmentInput();
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
        
        function ask() {
          inquirer.prompt(questions).then(answers => {
            if (answers.employeeList == "view all employees"){
                 new Employee().getAllEmployee();
            }
            if (answers.employeeList == "view all employees by manager") {
                new Employee().getManagerEmployee();
            }
            if (answers.employeeList == "view all employees by department") {
                new Employee().getDepartmentEmployee();
            }
          });
        }
        
        ask();
    }

    addEmployee(){
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

          inquirer.prompt(questions).then(answers => {
                axios.post('/api/employee',{
                    first_name: answers.emp_firstname,
                    last_name: answers.emp_lastname,
                    role_id: answers.role_id,
                    manager_id: answers.manager_id,

                  })
                .then(response => {
                    if (response.data.data.affectedRows == 1) {
                        this.getAllEmployee();
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
          });
        return;
    }

    getRoleId (empid){
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

            return inquirer.prompt(questions).then(answers => {
                var index = response.data.data.findIndex(function(item, i){
                    return item.RoleTitle === answers.rolelist;
                    });
                    
                this.roleindex = response.data.data[index].RoleId;
                this.updateEmployeeRoleById(empid, this.roleindex);
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

    updateEmployeeRoleById(id,role_id){
            const url = '/api/employee/' + id;
            axios.patch(url, {
                role_id : role_id
            })
            .then(response => {
                this.getEmployeeById(id);
                return "success";
            })
            .catch(function (error) {
                if (error.code  == "ECONNREFUSED"){
                    return("Could not connect to web server at : " + error.config.baseURL + error.config.url);
                } else {
                    return(error);
                }
            });
            return;
    }

    updateEmployeeRole(){

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

            inquirer.prompt(questions).then(answers => {
                   var index = response.data.data.findIndex(function(item, i){
                      return item.FirstName === answers.employeeName.split(' ')[0];
                    });
                    this.getRoleId(response.data.data[index].EmpId);
                        
                    
                });
             // }
             // getEmployeeInput();


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

    executeDeleteEmployee(empId){
        const url = '/api/employee/' + empId;
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

    deleteEmployee(){
        //console.log("Inside Delete");
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

            return inquirer.prompt(questions).then(answers => {
                var index = response.data.data.findIndex(function(item, i){
                    return item.FirstName === answers.empList.split(' ')[0];
                    });
                    
                this.roleindex = response.data.data[index].EmpId;
                this.executeDeleteEmployee(this.roleindex);
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


module.exports = Employee;
 