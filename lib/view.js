const connection = require('../config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const start = require('../server');

//view options prompt
const viewOptions = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'What would you like to view?',
            choices: ['Employees', 'Roles', 'Departments', 'Back']
        })
        .then(function (answer) {
            switch (answer.selected) {
                case 'Employees':
                    viewEmployees();
                    break;
                case 'Roles':
                    viewRoles();
                    break;
                case 'Departments':
                    viewDepartments();
                    break;
                case 'Back':
                    start.start();
                    break;
            }
        })
}

//function to viewEmployees
const viewEmployees = () => {
    const query = 'SELECT e.id AS EmployeeID, CONCAT(e.first_name," ", e.last_name) AS Name, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name ," " ,m.last_name) AS Manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id) ORDER BY e.id;'
    // const query = 'SELECT first_name AS First_name, last_name AS Last_name, title AS Title, department.name AS Department, role.salary AS Salary, manager_id AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id';
    connection.query(query, function (err, data) {
        if (err) throw err;
        // console.log(data)
        console.table(data);
        start.start();
    });

}
//function to viewRoles
const viewRoles = () => {
    const query = 'SELECT id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID FROM role';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start.start();
    });

}
//function to viewDepartments
const viewDepartments = () => {
    const query = 'SELECT id AS DepartmentID, name AS Department FROM department';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start.start();
    });

}

exports.viewOptions = viewOptions;