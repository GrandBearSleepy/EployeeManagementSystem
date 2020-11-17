const connection = require('../config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const start = require('../server')

//delete options prompt
const deleteOptions = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'What would you like to delete?',
            choices: ['Employee', 'Role', 'Department', 'Back']
        })
        .then(function (answer) {
            switch (answer.selected) {
                case 'Employee':
                    deleteEmployee();
                    break;
                case 'Role':
                    deleteRole();
                    break;
                case 'Department':
                    deleteDepartment();
                    break;
                case 'Back':
                    start.start();
            }
        })
}

//function to delete employee
const deleteEmployee = () => {
    const query = 'SELECT e.id AS EmployeeID, CONCAT(e.first_name, e.last_name) AS Name, role.title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name ," " ,m.last_name) AS Manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id) ORDER BY e.id;'
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt({
                type: 'input',
                name: 'employeeId',
                message: 'Please input the <EmployeeID> that you want to delete.',
                validate: value => {
                    let idArray = [];
                    for (var i = 0; i < data.length; i++) {
                        idArray.push(data[i].EmployeeID);
                    }

                    // console.log(idArray);
                    let valid = /^[0-9]*$/.test(value);
                    if (valid && idArray.indexOf(parseInt(value)) != -1) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid EmployeeID>!";
                    }
                }
            })
            .then(function (answer) {
                // const id = parseInt(answer.employeeId);
                connection.query('DELETE FROM employee WHERE id=?', [answer.employeeId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start.start();
                })
            })
    })
}
//function to delete role
const deleteRole = () => {
    const query = 'SELECT id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID FROM role';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt({
                type: 'input',
                name: 'roleId',
                message: 'Please input the <TitleID> that you want to delete.',
                validate: value => {
                    let idArray = [];
                    for (var i = 0; i < data.length; i++) {
                        idArray.push(data[i].TitleID);
                    }

                    // console.log(idArray);
                    let valid = /^[0-9]*$/.test(value);
                    if (valid && idArray.indexOf(parseInt(value)) != -1) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid TitleID>!";
                    }
                }
            })
            .then(function (answer) {
                // const id = parseInt(answer.roleId);
                connection.query('SET FOREIGN_KEY_CHECKS = 0;DELETE FROM role WHERE id=?', [answer.roleId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start.start();
                })
            })
    });

}
//function to delete department
const deleteDepartment = () => {
    const query = 'SELECT id AS DepartmentID, name AS Department FROM department';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt({
                type: 'input',
                name: 'departmentId',
                message: 'Please input the <DepartmentID> that you want to delete.',
                validate: value => {
                    let idArray = [];
                    for (var i = 0; i < data.length; i++) {
                        idArray.push(data[i].DepartmentID);
                    }

                    // console.log(idArray);
                    let valid = /^[0-9]*$/.test(value);
                    if (valid && idArray.indexOf(parseInt(value)) != -1) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid DepartmentID>!";
                    }
                }

            })
            .then(function (answer) {
                // const id = parseInt(answer.departmentId);
                connection.query('SET FOREIGN_KEY_CHECKS = 0;DELETE FROM department WHERE id=?', [answer.departmentId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start.start();
                })
            })
    });

}

exports.deleteOptions = deleteOptions;