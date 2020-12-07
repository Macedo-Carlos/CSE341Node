/* Create the database tables */

CREATE TABLE locations (
    id SERIAL NOT NULL PRIMARY KEY,
    location_name VARCHAR(50) NOT NULL
);

CREATE TABLE parts(
    id SERIAL NOT NULL PRIMARY KEY,
    part_number VARCHAR(50) NOT NULL,
    part_name VARCHAR(50) NULL,
    default_location_id INTEGER NOT NULL REFERENCES locations (id),
    part_qty_on_hand FLOAT NOT NULL,
    part_uom VARCHAR(10) NOT NULL,
    part_image VARCHAR(250) NULL
);

CREATE TABLE inventory_counts (
    id SERIAL NOT NULL PRIMARY KEY,
    inventory_date DATE NOT NULL,
    part_id INTEGER NOT NULL REFERENCES parts (id),
    inventory_count FLOAT NOT NULL,
    location_id INTEGER NOT NULL REFERENCES locations (id),
    inventory_change FLOAT NULL,
    inventory_status VARCHAR(10) NOT NULL
);

CREATE TABLE users (
    id SERIAL NOT NULL PRIMARY KEY,
    user_name VARCHAR(50) NOT NULL,
    user_password VARCHAR(250),
    user_is_admin BOOLEAN
);

CREATE TABLE trackers (
    id SERIAL NOT NULL PRIMARY KEY,
    tracker_date DATE NOT NULL,
    tracker_previous INT NOT NULL,
    tracker_next INT NOT NULL
);

/* Insert initial data into tables */

INSERT INTO locations (location_name)
VALUES ('Shelf-001');
INSERT INTO locations (location_name)
VALUES ('Shelf-002');
INSERT INTO locations (location_name)
VALUES ('Cart-001');
INSERT INTO locations (location_name)
VALUES ('Cart-002');

INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EC-001', 'Engine Starter', 1, 0, 'ea', 'img/engine_starter.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EC-002', 'Air Filter', 1, 0, 'ea', 'img/air_filter.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EC-003', 'Spark Plug', 2, 0, 'ea', 'img/spark_plug.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EC-004', 'Battey Cable', 2, 0, 'ea', 'img/battery_cable.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('AC-001', 'Motor Cover', 3, 0, 'ea', 'img/motor_cover.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('AC-002', 'Storage Bag', 3, 0, 'ea', 'img/storage_bag.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('AC-003', 'Spaghetti Gasket', 4, 0, 'ft', 'img/spaghetti_gasket.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('AC-004', 'Muffler Bolt Packet', 4, 0, 'ea', 'img/muffler_bolt_packet.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EL-001', 'Female Bullet Connector', 2, 0, 'ea', 'img/female_bullet_connector.jpg');
INSERT INTO parts (part_number, part_name, default_location_id, part_qty_on_hand, part_uom, part_image)
VALUES ('EL-002', 'Female Push-On Connector', 3, 0, 'ea', 'img/famale_push-on_connector.jpg');

INSERT INTO users (user_name, user_password, user_is_admin)
VALUES ('admin', '$2b$10$Cztvgr3NtpJVOqwHvz6zIuXrHZRN/WKS5M6k58Pt9RofT/r.cMHEy', TRUE);
INSERT INTO users (user_name, user_password, user_is_admin)
VALUES ('count', '$2b$10$24Yl/jXDHmFAMbG9tilPc.sU7JSbWBsYzpk6ll640W5IQLg3XNrMa', FALSE);


/* Reference queries */

UPDATE models SET modeldescription = 'This motor has 80 lb of thrust, 72" shaft, electric steer, self deploy, auto pilot and bluetooth. This motor requires 24 V input (two battheries) and bow mount.' WHERE id = 5;

UPDATE models SET modeldescription = 'This motor has 112 lb of thrust, 48" shaft, foot pedal steer, auto pilot and bluetooth. This motor requires 36 V input (three battheries) and bow mount.' WHERE id = 4;