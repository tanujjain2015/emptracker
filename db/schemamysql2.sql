DROP TABLE IF EXISTS employee;
DROP TABLE IF EXISTS roletable;
DROP TABLE IF EXISTS department;
CREATE TABLE department(
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    name VARCHAR(30) NOT NULL
);

CREATE TABLE roletable (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    title VARCHAR(30) NOT NULL,
    salary DECIMAL,
    department_id INTEGER,
    CONSTRAINT fk_dept_id FOREIGN KEY (department_id) REFERENCES department(id) ON DELETE SET NULL
);

CREATE TABLE employee (
    id INTEGER PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(30),
    last_name VARCHAR(30),
    role_id INTEGER,
    manager_id INTEGER,
    CONSTRAINT fk_roleid FOREIGN KEY (role_id)  REFERENCES roletable(id) ON DELETE CASCADE,
    CONSTRAINT fk_empid FOREIGN KEY (manager_id) REFERENCES employee(id) ON DELETE SET NULL
);

