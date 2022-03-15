//dependencies
const inquirer = require("inquirer");
const mysql = require("mysql2");
const consol = require("console.table");

//Create mysql connection
const connect = mysql.createConnection({
    host: 'localhost',
    // Your MySQL username,
    user: 'root',
    // Your MySQL password
    password: 'newPassword',
    database: 'tracker'
});

// Start server after DB connection
connect.connect(err => {
    if (err) throw err;
    console.log('Database connected.');
    start();
});


function start() {
    // console.log("STARTED!");

    inquirer.prompt({
      type: "list",
      name: "action",
      message: "Choose one of the below:",
      choices: [
            "View Departments",
            "View Roles",
            "View Employees",
            "Add a Department",
            "Add a Role",
            "Add an Employee",
            "Update Employee Role",
            "Finish"
        ]
    }).then(function ({action}) {
        switch (action) {

            case "View Departments":
                viewDepartments();
                break;

            case "View Roles":
                viewRoles();
                break;
            
            case "View Employees":
                viewEmployees();
                break;
            
            case "Add a Department":
                addDepartment();
                break;
            
            case "Add a Role":
                addRole();
                break;
            
            case "Add an Employee":
                addEmployee();
                break
            
            case "Update Employee Role":
                updateEmployee();
                break
            
            case "Finish":
                connect.end();
                break
        }
    })
}

function viewDepartments() {
    
    var query = `SELECT * FROM department`;

    connect.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Departments")
        
    start();
    
    }
)}

function viewRoles() {
    
    var query = `SELECT * FROM roles
                    LEFT JOIN department
                    ON department_id = department.id`;

    connect.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Roles")
        
    start();
    
    }
)}

function viewEmployees() {

    var query = `SELECT * FROM employee
                    LEFT JOIN roles
                    ON employee.role_id = roles.id
                    LEFT JOIN department
                    ON department.id = roles.department_id`;

    connect.query(query, function (err, res) {
        if (err) throw err;

        console.table(res);
        console.log("Employees")
        
    start();
    
    }
)}

function addDepartment() {

    inquirer.prompt([
        {
            type: "input",
            name: "department_name",
            message: "What department do you want to add?"
        }

    ]).then(function (answer) {
        
        var query = `INSERT INTO department SET ?`

        connect.query(query,

            {name: answer.department_name},
        
            function (err, res) {
            
            if (err) throw err;
            console.table(res);
            console.log("Department Added");

            start();

        })
    })
}

function addRole() {

    inquirer.prompt([
        {
            type: "input",
            name: "role_name",
            message: "What role do you want to add?"
        },
        {
            type: "input",
            name: "role_salary",
            message: "What is the salary for this role?"
        },
        {
           type: "input",
           name: "role_department_id",
           message: "What is the department ID?"
        },

    ]).then(function (answer) {
        
        var query = `INSERT INTO roles SET ?`

        connect.query(query,

            {
                title: answer.role_name,
                salary: answer.role_salary,
                department_id: answer.role_department_id
            },
        
            function (err, res) {
            
            if (err) throw err;
            console.table(res);
            console.log("Role Added");

            start();

        })
    })
}

function addEmployee() {

    inquirer.prompt([
        {
            type: "input",
            name: "first_name",
            message: "What is the employee's first name?"
        },
        {
            type: "input",
            name: "last_name",
            message: "What is the employee's last name?"
        },
        {
           type: "input",
           name: "role_id",
           message: "What is the employee's role ID?"
        },
    ]).then(function (answer) {
        
        var query = `INSERT INTO employee SET ?`

        connect.query(query,

            {
                first_name: answer.first_name,
                last_name: answer.last_name,
                role_id: answer.role_id,
            },
        
            function (err, res) {
            
            if (err) throw err;
            console.table(res);
            console.log("Employee Added");

            start();

        })
    })
}

function updateEmployee() {

    var query = `SELECT * FROM employee`;

    connect.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);

    const employees = res.map(({ id, first_name, last_name }) => ({
        value: id, name: `${first_name} ${last_name}`
    
    }));

    // console.log(employees);
    updateRole(employees);

    })   

}

function updateRole(employees) {

    var query = `SELECT * FROM roles`;

    connect.query(query, function (err, res) {
        if (err) throw err;
        console.table(res);
    
    const roles = res.map(({ id, title }) => ({
        value: id, name: `${title}`

    }));

    promptUpdate(employees, roles);

    })

}

function promptUpdate(employees, roles) {

    inquirer.prompt([
        {
            type: "list",
            name: "employee",
            message: "Which employee do you want to update?",
            choices: employees
        },
        {
            type: "list",
            name: "role",
            message: "What is the employee's new role?",
            choices: roles
        }  
    ]).then(function (answer) {

        var query = `UPDATE employee SET role_id = ? WHERE id = ?`

        connect.query(query,
            [
                answer.role, answer.employee
            ],
            function (err, res) {
                if (err) throw err;
                console.table(res);
            })

        start()

    })
}