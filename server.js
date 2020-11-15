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
});

function start() {
    inquirer
        .prompt({
            type: 'rawlist',
            name: 'choice',
            message: 'What would you like to do?',
            choices: ['View All Employees',
                'View All Roles',
                'View All Departments',
                'Add Employee',
                'Add Role',
                'Add Department',
                'Update Employee',
                'Exit'
            ]
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
                case 'Add Role':
                    addRole();
                    break;
                case 'Add Department':
                    addDepartment();
                    break;
                case 'Update Employee':
                    updateEmployee();
                    break;
                case 'Exit':
                    connection.end();
                    break;
                default:
                    break;
            }
        })
}

function viewAllEmployees() {
    const query = ' SELECT e.id, e.first_name, e.last_name, role.title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name ," " ,m.last_name) AS Manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id) ORDER BY e.id;'
    // const query = 'SELECT first_name AS First_name, last_name AS Last_name, title AS Title, department.name AS Department, role.salary AS Salary, manager_id AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id';
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
    connection.query('SELECT * FROM employee; SELECT id AS RoleID FROM role; SELECT id AS DepartmentID, name AS Department FROM department', function (err, data) {
        console.table(data[0]);
        console.table(data[1]);
        console.table(data[2]);
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'firtName',
                    message: 'What is the employee\'s <FIRST NAME>?',
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
                    message: 'What is the employee\'s <LAST NAME>?',
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
                    type: 'number',
                    name: 'roleId',
                    message: 'What is the employee\'s <ROLE ID>?',
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
                    type: 'number',
                    name: 'managerId',
                    message: 'What is the <ID> of the employee\'s manager?',
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
    })


}

function addRole() {
    connection.query('SELECT id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID FROM role', function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'title',
                    message: 'Please input this role\'s <TITLE>!',
                    validate: value => {
                        let valid = /^[ A-Za-z]*$/.test(value);
                        if (value.trim().length && valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid Title>!";
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'salary',
                    message: 'Please input this role\'s <SALARY>!',
                    validate: value => {
                        let valid = /^(0|[1-9][0-9]*)$/.test(value);
                        if (valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid Value>!";
                        }
                    }
                },
                {
                    type: 'number',
                    name: 'departmentId',
                    message: 'Please input <DEPARTMENT ID>!',
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
                connection.query('INSERT INTO role SET ?',
                    {
                        title: answer.title,
                        salary: answer.salary,
                        department_id: answer.departmentId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New role has been added!');
                        start();
                    })
            })
    })

}

function addDepartment() {
    connection.query('SELECT id AS DepartmentID, name AS Department FROM department', function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'name',
                    message: 'Please input new department\'s <NAME>!',
                    validate: value => {
                        let valid = /^[ A-Za-z]*$/.test(value);
                        if (value.trim().length && valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid NAME>!";
                        }
                    }
                }
            ])
            .then(function (answer) {
                connection.query('INSERT INTO department SET ?',
                    {
                        name: answer.name
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New department has been added!');
                        start();
                    })
            })
    })

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
                    validate: value => {
                        let valid = /^(0|[1-9][0-9]*)$/.test(value);
                        if (valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid ID>!";
                        }
                    }
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

const userInstruction = () => {
    console.log('\n');
    console.log('--------------------------------------------------------------------------------');
    console.log('\n');
    console.log('                           Welcome to EMPLOYEE TRACKER                          ');
    console.log(' You can manage your employees or deparments here!');
    console.log(' Follow the prompt options, you can VIEW, ADD or UPDATE employees or departments.');
    console.log(' "Ctrl+c" to end the program!                                                   ');
    console.log('\n');
    console.log('--------------------------------------------------------------------------------');
}

const ini = () => {
    console.clear();
    userInstruction();
    start();
}
ini();