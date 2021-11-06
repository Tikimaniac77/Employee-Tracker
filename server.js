const inquirer = require("inquirer");
const mysql = require("mysql2");
const cTable = require("console.table");
const db = require(".");

const connection = mysql.createConnection({
  host: "localhost",
  port: 3306,  
  user: "root",  
  password: "password",
  database: "employeeDB"
});

connection.connect(function(err) {
  if (err) throw err;
  console.log("connectected to employeeDB");

  startPrompt();  
});


function startPrompt() {
  inquirer
    .prompt({
      type: "list",
      choices: [
        "Add department",
        "Add role",
        "Add employee",
        "View all departments",
        "View all roles",
        "View all employees",
        "Update employee role",
        "Quit"
      ],
      message: "What would you like to do?",
      name: "option"
    })
    .then(function(choice) {
      console.log("You entered: " + choice.option);

      switch (choice.option) {
        case "Add department":
          addDepartment();
          break;
        case "Add role":
          addRole();
          break;
        case "Add employee":
          addEmployee();
          break;
        case "View all departments":
          viewDepartment();
          break;
        case "View all roles":
          viewRoles();
          break;
        case "View all employees":
          viewEmployees();
          break;
        case "Update employee role":
          updateEmployee();
          break;
        default:
          quit();
      }
    });
}




function addDepartment() {

    inquirer.prompt({
      
        type: "input",
        message: "What is the name of the department?",
        name: "deptName"

    }).then(function(response){

        connection.query("INSERT INTO department (name) VALUES (?)", [response.deptName] , function(err, res) {
            if (err) throw err;
            console.table(res)
            startPrompt()
    })
    })
}


function addRole() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the name of the role?",
        name: "roleName"
      },
      {
        type: "input",
        message: "What is the salary for this role?",
        name: "salaryTotal"
      },
      {
        type: "input",
        message: "What is the department id number?",
        name: "deptID"
      }
    ])
    .then(function(response) {


      connection.query("INSERT INTO role (title, salary, department_id) VALUES (?, ?, ?)", [response.roleName, response.salaryTotal, response.deptID], function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
      });
    });
}

function addEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "What's the first name of the employee?",
        name: "FirstName"
      },
      {
        type: "input",
        message: "What's the last name of the employee?",
        name: "LastName"
      },
      {
        type: "input",
        message: "What is the employee's role id number?",
        name: "roleID"
      },
      {
        type: "input",
        message: "What is the manager id number?",
        name: "managerID"
      }
    ])
    .then(function(response) {

      
      connection.query("INSERT INTO employee (first_name, last_name, role_id, manager_id) VALUES (?, ?, ?, ?)", [response.FirstName, response.LastName, response.roleID, response.managerID], function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
      });
    });
}



function updateEmployee() {
  inquirer
    .prompt([
      {
        type: "input",
        message: "Which employee would you like to update?",
        name: "Update"
      },

      {
        type: "input",
        message: "What do you want to update to?",
        name: "updateRole"
      }
    ])
    .then(function(response) {
     
      connection.query('UPDATE employee SET role_id=? WHERE first_name= ?',[response.updateRole, response.Update],function(err, res) {
        if (err) throw err;
        console.table(res);
        startPrompt();
      });
    });
}

function viewDepartment() {
  
  let query = "SELECT * FROM department";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
 
}

function viewRoles() {
  
  let query = "SELECT * FROM role";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
 
}

function viewEmployees() {
  
  let query = "SELECT employee.id, employee.first_name, employee.last_name, role.title, department.name AS department, role.salary FROM employee LEFT JOIN role ON employee.role_id = role.id LEFT JOIN department on role.department_id = department.id";
  connection.query(query, function(err, res) {
    if (err) throw err;
    console.table(res);
    startPrompt();
  });
  
}

function quit() {
  connection.end();
  process.exit();
}