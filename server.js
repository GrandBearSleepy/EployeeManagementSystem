const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

// create the connection information for the sql database
const connection = mysql.createConnection({
    host: 'localhost',

    // Your port; if not 3306
    port: 3306,

    // Your username
    user: 'root',

    // Your password
    password: '123456',
    database: 'employee_db',
    multipleStatements: true
});


connection.connect(function (err) {
    if (err) {
        console.error('error connecting: ' + err.stack);
        return;
    }

    console.log('connected as id ' + connection.threadId);
    start();
});

function start() {
    inquirer
        .prompt({
            type: 'list',
            name: 'choice',
            message: 'Welcome to employee tracker. What would you like to do?',
            choices: ['View All Employees', 'View All Roles', 'View All Departments', 'Add Employee', 'Update Employee']
        })
        .then(function (answer) {
            switch (answer.choice) {
                case 'View All Employees':
                    viewAllEmployees();
                    break;
                case 'View All Roles':
                    viewAllRoles();
                    break;
                case 'View All Departments':
                    viewAllDepartments();
                    break;
                case 'Add Employee':
                    addEmployee();
                    break;
                case 'Update Employee':
                    updateEmployee();
                    break;
            }
        })
}

function viewAllEmployees() {
    const query = 'SELECT first_name AS First_name, last_name AS Last_name, title AS Title, department.name AS Department, role.salary AS Salary, manager_id AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id';
    connection.query(query, function (err, data) {
        if (err) throw err;
        // console.log(data)
        console.table(data);
        start();
    });

}

function viewAllRoles() {
    const query = 'SELECT id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID FROM role';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });

}

function viewAllDepartments() {
    const query = 'SELECT id AS DepartmentID, name AS Department FROM department';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });

}


function addEmployee() {
    inquirer
        .prompt([
            {
                type: 'input',
                name: 'firtName',
                message: 'What is the employee\'s first name?',
                validate: value => {
                    let valid = /^[A-Za-z]*$/.test(value);
                    if (value.trim().length && valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid NAME>!";
                    }
                }
            },
            {
                type: 'input',
                name: 'lastName',
                message: 'What is the employee\'s last name?',
                validate: value => {
                    let valid = /^[A-Za-z]*$/.test(value);
                    if (value.trim().length && valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid NAME>!";
                    }
                }
            },
            {
                type: 'input',
                name: 'roleId',
                message: 'What is the employee\'s role ID?',
                validate: value => {
                    let valid = /^(0|[1-9][0-9]*)$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            },
            {
                type: 'prompt',
                name: 'managerId',
                message: 'What is the ID of the employee\'s manager?',
                validate: value => {
                    let valid = /^(0|[1-9][0-9]*)$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            }
        ])
        .then(function (answer) {
            connection.query('INSERT INTO employee SET ?',
                {
                    first_name: answer.firtName,
                    last_name: answer.lastName,
                    role_id: answer.roleId,
                    manager_id: answer.managerId
                },
                function (err) {
                    if (err) throw err;
                    console.log('New employee has been added!');
                    start();
                }
            );
        });

}


function updateEmployee() {

    connection.query('SELECT employee.id, employee.first_name, employee.last_name, role.title FROM employee JOIN role WHERE employee.role_id=role.id; SELECT id AS TitleID, title FROM role', function (err, data) {
        if (err) throw err;
        console.table(data[0]);
        console.table(data[1]);
        inquirer
            .prompt([
                {
                    type: 'number',
                    name: 'employeeId',
                    message: 'Please input the employee\'s <ID> that you would like to update!!\n',
                    // choices: function () {
                    //     let nameList = [];
                    //     for (let i = 0; i < data.length; i++) {
                    //         nameList.push(data[i].id + "" + data[i].first_name + " " + data[i].last_name + " " + data[i].title)
                    //     }
                    //     // console.log(nameList);
                    //     return nameList;
                    //     console.log(name);
                    // }
                },
                {
                    type: 'number',
                    name: 'roleId',
                    message: 'Please input new <TitleId>!!',
                }

            ])
            .then(function (answer) {
                connection.query('UPDATE employee SET ? WHERE ?',
                    [
                        {
                            role_id: answer.roleId
                        },
                        {
                            id: answer.employeeId
                        }
                    ], function (err, data) {
                        if (err) throw err;
                        console.log('Updated!!');
                        start();
                    });
            })


    });
}


// function getRoleList() {
//     connection.query('SELECT * FROM role', function (err, data) {
//         if (err) throw err;
//         let roleList = [];
//         for (let i = 0; i < data.length; i++) {
//             roleList.push(data[i].title);
//         }
//         return roleList;
//     })
// }

// function getNameList() {
//     connection.query('SELECT * FROM employee', function (err, data) {
//         if (err) throw err;
//         let nameList = [];
//         for (let i = 0; i < data.length; i++) {
//             nameList.push(data[i].first_name + " " + data[i].last_name);
//         }
//         return nameList;
//     })
// }