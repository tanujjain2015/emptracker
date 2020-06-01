const Employee = require('./Employee');
const Role = require('./Role');
const Department = require('./Department');
const inquirer = require('inquirer');

var output = [];

class EmployeeManager {
    constructor() {
        this.ask();
    }

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
        
    ask() {
        return inquirer.prompt(this.viewOptions())
        .then(answers => {
                if (answers.EmployeeManager == "view all employees"){
                    var promise = new Employee().viewAllEmployees();
                }
                if (answers.EmployeeManager == "view all departments"){
                    new Department().getAllDepartment();
                }
                if (answers.EmployeeManager == "view all roles"){
                    new Role().getAllRoles();
                }
                if (answers.EmployeeManager == "add a department"){
                    new Department().addDepartment();
                }
                if (answers.EmployeeManager == "add a role"){
                    new Role().addRole();
                }
                if (answers.EmployeeManager == "add an employee"){
                    new Employee().addEmployee();
                }
                if (answers.EmployeeManager == "update an employee role"){
                    new Employee().updateEmployeeRole();
                }
                if (answers.EmployeeManager == "delete department"){
                    new Department().deleteDepartment();
                }
                if (answers.EmployeeManager == "delete role"){
                    new Role().deleteRole();
                }
                if (answers.EmployeeManager == "delete employee"){
                    new Employee().deleteEmployee();
                }
            });
    }
}


module.exports = EmployeeManager;