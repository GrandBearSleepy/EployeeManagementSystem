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

    // console.log('connected as id ' + connection.threadId);
});


const start = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'Please choose your option',
            choices: ['VIEW', 'ADD', 'UPDATE', 'DELETE', 'EXIT']
        }).then(function (answer) {

            switch (answer.selected) {
                case 'VIEW':
                    view();
                    break;

                case 'ADD':
                    add();
                    break;

                case 'UPDATE':
                    update();
                    break;

                case 'DELETE':
                    remove();
                    break;

                case 'EXIT':
                    process.exit();
            }
        });
};

const view = () => {
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
                    start();
                    break;
            }
        })
}


const viewEmployees = () => {
    const query = 'SELECT e.id AS EmployeeID, CONCAT(e.first_name," ", e.last_name) AS Name, role.title AS Title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name ," " ,m.last_name) AS Manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id) ORDER BY e.id;'
    // const query = 'SELECT first_name AS First_name, last_name AS Last_name, title AS Title, department.name AS Department, role.salary AS Salary, manager_id AS Manager FROM employee INNER JOIN role ON employee.role_id = role.id INNER JOIN department ON role.department_id = department.id';
    connection.query(query, function (err, data) {
        if (err) throw err;
        // console.log(data)
        console.table(data);
        start();
    });

}

const viewRoles = () => {
    const query = 'SELECT id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID FROM role';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });

}

const viewDepartments = () => {
    const query = 'SELECT id AS DepartmentID, name AS Department FROM department';
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        start();
    });

}

const add = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'What would you like to add?',
            choices: ['Employee', 'Role', 'Department', 'Back']
        })
        .then(function (answer) {
            switch (answer.selected) {
                case 'Employee':
                    addEmployee();
                    break;
                case 'Role':
                    addRole();
                    break;
                case 'Department':
                    addDepartment();
                    break;
                case 'Back':
                    start();
            }
        })
}

const addEmployee = () => {
    connection.query('SELECT id AS RoleID, title AS Title FROM role;SELECT DISTINCT e.manager_id AS ManagerID,CONCAT(m.first_name, " ", m.last_name) AS Manager,department.name AS Department FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id)WHERE e.manager_id IS NOT NULL ORDER BY e.id;', function (err, data) {
        console.table(data[0]);
        console.table(data[1]);
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
                    type: 'input',
                    name: 'roleId',
                    message: 'What is the employee\'s <ROLE ID>?',
                    validate: value => {
                        let valid = /^[0-9]*$/.test(value);
                        if (valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid ID>!";
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'managerId',
                    message: 'What is the <ID> of the employee\'s manager?',
                    validate: value => {
                        let valid = /^[0-9]*$/.test(value);
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

const addRole = () => {
    connection.query('SELECT role.id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID, department.name AS Department FROM role JOIN department ON role.department_id=department.id ORDER BY role.id', function (err, data) {
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
                        let valid = /^[0-9]*$/.test(value);
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
                        let valid = /^[0-9]*$/.test(value);
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

const addDepartment = () => {
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

const update = () => {
    inquirer
        .prompt({
            type: 'list',
            name: 'selected',
            message: 'What would you like to update?',
            choices: ['Employee\'s Role', 'Employee\'s Manager', 'Back']
        })
        .then(function (answer) {
            switch (answer.selected) {
                case 'Employee\'s Role':
                    updateRole();
                    break;
                case 'Employee\'s Manager':
                    updateManager();
                    break;
                case 'Back':
                    start();
            }
        })
}

const updateRole = () => {

    connection.query('SELECT e.id AS EmployeeID, CONCAT(e.first_name," ", e.last_name) AS Name, r.title AS TITLE FROM employee AS e JOIN role AS r WHERE e.role_id=r.id; SELECT id AS TitleID, title FROM role', function (err, data) {
        if (err) throw err;
        console.table(data[0]);
        console.table(data[1]);
        inquirer
            .prompt([
                {
                    type: 'input',
                    name: 'employeeId',
                    message: 'Please input the <EmployeeID> that you would like to update!!\n',
                    validate: value => {
                        let valid = /^[0-9]*$/.test(value);
                        if (valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid ID>!";
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Please input new <TitleID>!!',
                    validate: value => {
                        let valid = /^[0-9]*$/.test(value);
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

const updateManager = () => {
    connection.query('SELECT e.id AS EmployeeID ,CONCAT(e.first_name, " ", e.last_name) AS Name, r.title AS CurrentTitle From employee AS e JOIN role AS r ON e.role_id = r.id;SELECT DISTINCT e.manager_id AS ManagerID, CONCAT(m.first_name, " " , m.last_name) AS Manager FROM employee AS e JOIN employee AS m ON e.manager_id = m.id WHERE e.manager_id IS NOT NULL', function (err, data) {
        if (err) throw err;
        console.table(data[0]);
        console.table(data[1]);
        inquirer
            .prompt([{
                type: 'input',
                message: 'Please input the <EmployeeID> that you would like to update!!\n',
                name: "employeeId",
                validate: value => {
                    let valid = /^[0-9]*$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            },
            {
                type: "input",
                message: "Please input the <ManagerID> that you would like to update!!\n",
                name: "managerId",
                validate: value => {
                    let valid = /^[0-9]*$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            }])
            .then(function (answer) {
                connection.query('UPDATE employee SET ? WHERE ?',
                    [
                        {
                            manager_id: answer.managerId
                        },
                        {
                            id: answer.employeeId
                        }
                    ])
            })
    })
}

const remove = () => {
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
                    start();
            }
        })
}

const deleteEmployee = () => {
    const query = 'SELECT e.id, e.first_name, e.last_name, role.title, department.name AS Department, role.salary AS Salary, CONCAT(m.first_name ," " ,m.last_name) AS Manager FROM department RIGHT JOIN role ON role.department_id = department.id RIGHT JOIN employee e On e.role_id = role.id LEFT JOIN employee m ON(m.role_id = e.manager_id) ORDER BY e.id;'
    connection.query(query, function (err, data) {
        if (err) throw err;
        console.table(data);
        inquirer
            .prompt({
                type: 'input',
                name: 'employeeId',
                message: 'Please input the <EmployeeID> that you want to delete.',
                validate: value => {
                    let valid = /^[0-9]*$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            })
            .then(function (answer) {
                // const id = parseInt(answer.employeeId);
                connection.query('DELETE FROM employee WHERE id=?', [answer.employeeId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start();
                })
            })
    })
}

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
                    let valid = /^[0-9]*$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            })
            .then(function (answer) {
                // const id = parseInt(answer.roleId);
                connection.query('DELETE FROM role WHERE id=?', [answer.roleId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start();
                })
            })
    });

}

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
                    let valid = /^[0-9]*$/.test(value);
                    if (valid) {
                        return true;
                    }
                    else {
                        return "Please enter a <Valid ID>!";
                    }
                }
            })
            .then(function (answer) {
                // const id = parseInt(answer.departmentId);
                connection.query('DELETE FROM role WHERE id=?', [answer.departmentId], function (err, data) {
                    if (err) throw err;
                    console.log('Delete success!');
                    start();
                })
            })
    });

}

const userInstruction = () => {
    console.log('\n');
    console.log('--------------------------------------------------------------------------------');
    console.log('\n');
    console.log('                 Welcome to EMPLOYEE Management System                          ');
    console.log('\n');
    console.log('     You can manage your employees or deparments here!');
    console.log('     Follow the prompt options, you can VIEW, ADD or UPDATE employees, roles or departments.');
    console.log('     "Ctrl+c" to end the program!                                                   ');
    console.log('\n');
    console.log('--------------------------------------------------------------------------------');
}

const ini = () => {
    console.clear();
    userInstruction();
    start();
}
ini();