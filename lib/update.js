const connection = require('../config/connection');
const inquirer = require('inquirer');
const cTable = require('console.table');
const start = require('../server')

//update options prompt
const updateOptions = () => {
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
                    start.start();
            }
        })
}

//function to update employee's role
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

                        let idArray = [];
                        for (var i = 0; i < data[0].length; i++) {
                            idArray.push(data[0][i].EmployeeID);
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
                },
                {
                    type: 'input',
                    name: 'roleId',
                    message: 'Please input new <TitleID>!!',
                    validate: value => {

                        let idArray = [];
                        for (var i = 0; i < data[1].length; i++) {
                            idArray.push(data[1][i].TitleID);
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
                        start.start();
                    });
            })


    });
}
//function to update employee's manager
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

                    let idArray = [];
                    for (var i = 0; i < data[0].length; i++) {
                        idArray.push(data[0][i].EmployeeID);
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
            },
            {
                type: "input",
                message: "Please input the <ManagerID> that you would like to update!!\n",
                name: "managerId",
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
                        return "Please enter a <Valid ManagerID>!";
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
                    ]), function (err, data) {
                        if (err) throw err;
                        console.log('Updated!');
                        start.start();
                    }

            })
    })
}

exports.updateOptions = updateOptions;