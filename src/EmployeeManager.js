const Employee = require('./Employee');
const Role = require('./Role');
const Department = require('./Department');
const inquirer = require('inquirer');
const cTable = require('console.table');

//This is the main Employee Manager Class to control user input. This class invokes various methods in Employee, Role and Department class.  
class EmployeeManager {
    //Constructor to invoke ask method. 
    constructor() {
        this.ask();
    }

    // View Option prompt various methods for user input 
    viewOptions() { 
      return [
            {
            type: 'list',
            name: 'EmployeeManager',
            message: 'What would you like to do?',
            choices: [
                'view all departments',
                'view all roles',
                'view all employees',
                'add a department',
                'add a role',
                'add an employee',
                'update an employee role',
                'delete department',
                'delete role',
                'delete employee'
            ],
            filter: function(val) {
                return val.toLowerCase();
            }
            }
        ];
    }
     
    //ask() method invokes various child method to invoke child methods. 
    ask() {
        return inquirer.prompt(this.viewOptions())
        .then(answers => {
                if (answers.EmployeeManager == "view all employees"){
                    new Employee().viewAllEmployees()
                    .then(response => {
                        console.log(response);
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "view all departments"){
                    new Department().getAllDepartment()
                    .then(response => {
                        this.ask();
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "view all roles"){
                    new Role().getAllRoles()
                    .then(response => {
                        this.ask();
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "add a department"){
                    new Department().addDepartment()
                    .then(response => {
                        this.ask();
                    })
                    .catch(err=>{
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "add a role"){
                    new Role().addRole()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "add an employee"){
                    new Employee().addEmployee()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "update an employee role"){
                    new Employee().updateEmployeeRole()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "delete department"){
                    new Department().deleteDepartment()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "delete role"){
                    new Role().deleteRole()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
                if (answers.EmployeeManager == "delete employee"){
                    new Employee().deleteEmployee()
                    .then(response => {
                        this.ask();
                    })
                    .catch (err => {
                        console.log(err);
                    });
                }
            });
    }
}


module.exports = EmployeeManager;