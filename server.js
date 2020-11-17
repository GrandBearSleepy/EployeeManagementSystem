const mysql = require('mysql');
const inquirer = require('inquirer');
const cTable = require('console.table');

const add = require('./lib/add');
const view = require('./lib/view');
const update = require('./lib/update');
const remove = require('./lib/delete');


// start prompt
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
                    view.viewOptions();
                    break;

                case 'ADD':
                    add.addOptions();
                    break;

                case 'UPDATE':
                    update.updateOptions();
                    break;

                case 'DELETE':
                    remove.deleteOptions();
                    break;

                case 'EXIT':
                    process.exit();
            }
        });
};


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

exports.start = start;