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
    database: 'employee_db'
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
            type: 'list',
            name: 'choice',
            message: 'Welcome to employee tracker. What would you like to do',
            choices: ['View All Employees', 'Add Employee', 'Update Employee']
        })
        .then(function (answer) {
            switch (answer) {
                case 'View All Employees':
                    viewAllEmployees();
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
    connection.query(

    )
}

function addEmployee() {

}

function updateEmployee() {

}