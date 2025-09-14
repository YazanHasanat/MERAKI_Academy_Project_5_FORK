/* roles table */
CREATE TABLE roles (
    id SERIAL PRIMARY KEY ,
    name VARCHAR(50) NOT NULL UNIQUE,
    permissions TEXT[], 
    is_deleted SMALLINT DEFAULT 0
);

/* users table */
CREATE TABLE users (
    id SERIAL PRIMARY KEY,
    firstName VARCHAR(100)  NOT NULL,
    lastName VARCHAR(100)  NOT NULL ,
    country VARCHAR(100)  NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    age INT  NOT NULL,
    role_id INT ,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0 ,
    FOREIGN KEY (role_id) REFERENCES roles(id)
);

/* user_locations table */
CREATE TABLE user_locations (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    address TEXT,
    latitude NUMERIC(9,6),
    longitude NUMERIC(9,6),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0 ,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);
/* category table */
CREATE TABLE category (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_deleted SMALLINT DEFAULT 0 
);

/* products table */
CREATE TABLE products (
    id SERIAL PRIMARY KEY,
    title VARCHAR(150)  NOT NULL,
    description TEXT,
    image_url TEXT ,
    category_id INT,
    price NUMERIC(10,2) NOT NULL,
    user_id INT NOT NULL,
    is_feature BOOLEAN DEFAULT false,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0 ,
    FOREIGN KEY (user_id) REFERENCES users(id) ,
    FOREIGN KEY (category_id) REFERENCES category(id)
);

/* cart table */
CREATE TABLE cart (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    products JSONB NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0 ,
    FOREIGN KEY (user_id) REFERENCES users(id) 
);


/* orders table */
CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    user_id INT NOT NULL,
    location_id INT,
    products JSONB NOT NULL,
    status VARCHAR(50) DEFAULT 'pending',
    pay_method VARCHAR(50)
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_deleted SMALLINT DEFAULT 0 ,
    FOREIGN KEY (user_id) REFERENCES users(id) ,
    FOREIGN KEY (location_id) REFERENCES user_locations(id)
);