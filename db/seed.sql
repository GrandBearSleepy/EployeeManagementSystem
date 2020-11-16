USE employee_db;


INSERT INTO department (name) VALUES ('Marketing');
INSERT INTO department (name) VALUES ('Sales');
INSERT INTO department (name) VALUES ('Services');
INSERT INTO department (name) VALUES ('Accounting');
INSERT INTO department (name) VALUES ('HR');

INSERT INTO role (title, salary, department_id) VALUES ("Marketing Manager", 100000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Marketing Consultant", 600000, 1);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Manager", 120000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Sales Assistant", 65000, 2);
INSERT INTO role (title, salary, department_id) VALUES ("Services Manager", 80000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("Services clerk", 55000, 3);
INSERT INTO role (title, salary, department_id) VALUES ("CFO", 210000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Financial Accountant", 80000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("Accountant", 75000, 4);
INSERT INTO role (title, salary, department_id) VALUES ("HR", 90000, 5);
INSERT INTO role (title, salary, department_id) VALUES ("HR Assisctant", 68000, 5);

INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Rick", "Novak", 1, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Susan", "Connor", 2, 1);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Margaret", "Adelman", 3, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ronald", "Barr", 4, 3);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Marie", "Broadbet", 5, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Roger", "Lum", 6, 5);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jeff", "Johnson", 7, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Melvin", "FOrbis", 8, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Jim", "Green", 9, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Lucu", "King", 9, 7);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Bob", "Smith", 10, null);
INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES ("Ruby", "Lee", 11, 10);

