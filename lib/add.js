const connection = require('../config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const start = require('../server')

//add options prompt
const addOptions = () => {
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
                    start.start();
            }
        })
}
//function to addEmployee
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
                    message: 'What is the employee\'s <RoleID>?',
                    validate: value => {

                        let idArray = [];
                        for (var i = 0; i < data[0].length; i++) {
                            idArray.push(data[0][i].RoleID);
                        }

                        // console.log(idArray);
                        let valid = /^[0-9]*$/.test(value);
                        if (valid && idArray.indexOf(parseInt(value)) != -1) {
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
                    message: 'What is the <ManagerID> of the employee\'s manager?',
                    validate: value => {

                        let idArray = [];
                        for (var i = 0; i < data[1].length; i++) {
                            idArray.push(data[1][i].ManagerID);
                        }

                        // console.log(idArray);
                        let valid = /^[0-9]*$/.test(value);
                        if (valid && idArray.indexOf(parseInt(value)) != -1) {
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
                        first_name: answer.firtName.trim(),
                        last_name: answer.lastName.trim(),
                        role_id: answer.roleId,
                        manager_id: answer.managerId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New employee has been added!');
                        start.start();
                    }
                );
            });
    })


}
//function to addRole
const addRole = () => {
    connection.query('SELECT role.id AS TitleID, title AS Title, salary as Salary, department_id AS DepartmentID, department.name AS Department FROM role JOIN department ON role.department_id=department.id ORDER BY role.id;SELECT id AS DepartmentID, name AS DEPARTMENT from department', function (err, data) {
        if (err) throw err;
        console.table(data[0]);
        console.table(data[1]);
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
                    type: 'input',
                    name: 'salary',
                    message: 'Please input this role\'s <SALARY>!',
                    validate: value => {
                        let valid = /^[0-9]*$/.test(value);
                        if (valid) {
                            return true;
                        }
                        else {
                            return "Please enter a <Valid Number>!";
                        }
                    }
                },
                {
                    type: 'input',
                    name: 'departmentId',
                    message: 'Please input <DepartmentID>!',
                    validate: value => {

                        let idArray = [];
                        for (var i = 0; i < data[1].length; i++) {
                            idArray.push(data[1][i].DepartmentID);
                        }

                        // console.log(idArray);
                        let valid = /^[0-9]*$/.test(value);
                        if (valid && idArray.indexOf(parseInt(value)) != -1) {
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
                        title: answer.title.trim(),
                        salary: answer.salary,
                        department_id: answer.departmentId
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New role has been added!');
                        start.start();
                    })
            })
    })

}
//function to addDepartment
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
                        name: answer.name.trim()
                    },
                    function (err) {
                        if (err) throw err;
                        console.log('New department has been added!');
                        start.start();
                    })
            })
    })

}

exports.addOptions = addOptions;