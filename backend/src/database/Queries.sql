USE PETRESCUE_DB;

/* =====================================================
   ALL USER TABLES
   ===================================================== */

SELECT * FROM person;
SELECT * FROM pet_owner;
SELECT * FROM community_member;
SELECT * FROM manager;
SELECT * FROM itadmin;


/* =====================================================
   ALL ORGANISATION TABLES
   ===================================================== */

SELECT * FROM organization_type;
SELECT * FROM npo_spca;
SELECT * FROM npo_spca_neighbourhood;
SELECT * FROM member_npo_spca;
SELECT * FROM owner_npo_spca;


/* =====================================================
   ALL OPERATIONAL/FUNCTION TABLES
   ===================================================== */

SELECT * FROM pet;
SELECT * FROM missing_pet_incident;
SELECT * FROM found_pet_report;
SELECT * FROM hand_over;
SELECT * FROM reunion;
SELECT * FROM reunion_comment;


/* =====================================================
   ALL LOOKUP TABLES
   ===================================================== */

SELECT * FROM status;
SELECT * FROM activity_type;
SELECT * FROM activity_status;
SELECT * FROM reason;
SELECT * FROM urgency_level;
SELECT * FROM contact_preference;
SELECT * FROM pet_species;
SELECT * FROM pet_colour;
SELECT * FROM pet_size;
SELECT * FROM wellbeing_description;
SELECT * FROM city;
SELECT * FROM neighbourhood;
SELECT * FROM location;